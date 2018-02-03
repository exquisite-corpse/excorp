import React, {Component} from "react"
// import * from 'immutable'
import Immutable from 'immutable'

// touch events:
// onTouchCancel onTouchEnd onTouchMove onTouchStart

// mouse events:
// onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
// onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
// onMouseMove onMouseOut onMouseOver onMouseUp

// form events:
// onChange onInput onInvalid onSubmit


export default class kbDWG extends React.Component {

  constructor() {
    super()

    this.state = {
    lines: [],
    currentLine:[],
    isDrawing: false
    }

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp)
    document.addEventListener("touchend", this.handleMouseup)
    document.addEventListener("touchcancel", this.handleMouseup)
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp)
    document.removeEventListener("touchend", this.handleMouseup)
    document.removeEventListener("touchcancel", this.handleMouseup)
  }

  handleMouseDown(evt) {
    // console.log("HANDLEDOWN EVENT :", evt.type)
    if ((evt.button != 0) && (evt.type != "touchstart" )) {
      return
    }

    const point = this.relativeCoordinatesForEvent(evt)
    // console.log("MAKING SURE I HAVE POINT: ", point)
    // console.log("CURRENT STATE OF LINES: ", this.state.lines)

    this.setState({
      currentLine: Object.assign([], [...this.state.currentLine, point]) ,
      isDrawing: true
    })

    // console.log("STATE IN AFTER PUSH IN MOUSEDOWN EVENT: ", this.state)
  }


  handleMouseMove(evt) {
    evt.preventDefault()
    if (!this.state.isDrawing) {
      return
    }

    // console.log("ARE WE EVER GETTING TO MOUSE MOVE")
    const point = this.relativeCoordinatesForEvent(evt)
    // console.log("MAKING SURE I HAVE POINT: ", point)

    // console.log("STATE INSIDE OF MOUSEMOVE EVENT: ", this.state)

    this.setState( {
      currentLine: Object.assign([], [...this.state.currentLine, point])
      // lines: [...this.state.lines, point]
    })
    // console.log("I'M THE STATE INSIDE HANDLE MOUSEMOVE: ", this.state)
  }

  handleMouseUp(evt) {
    console.log("IN MOUSE DOWN , evt ==> : ", evt)
    this.setState({
      lines: Object.assign([], [...this.state.lines, this.state.currentLine]),
      currentLine: [],
      isDrawing: false
    })

    console.log("MOUSEUP/END THIS.STATE = > ", this.state)
  }

  relativeCoordinatesForEvent(evt) {
    // console.log(evt.type)

    let CLIENTX
    let CLIENTY

    if (evt.type === "touchstart") {
      CLIENTX = evt.touches[0].clientX
      CLIENTY = evt.touches[0].clientY
    }

    if (evt.type === "mousedown"){
      CLIENTX = evt.clientX
      CLIENTY = evt.clientY
    }

     if (evt.type === "touchmove"){
      CLIENTX = evt.touches[0].clientX
      CLIENTY = evt.touches[0].clientY
    }

    if (evt.type === "mousemove"){
      CLIENTX = evt.clientX
      CLIENTY = evt.clientY
    }

    const boundingRect = this.refs.drawArea.getBoundingClientRect()

    let coordObj= {
      x: CLIENTX - boundingRect.left,
      y: CLIENTY - boundingRect.top,
    }
    return coordObj
  }

  render() {
    return (
    <div> <p> my panel </p>
      <div

        // width= "700px"
        // height="350px"


        className="drawArea"
        ref="drawArea"
        onTouchStart={this.handleMouseDown}
        onMouseDown={this.handleMouseDown}

        onTouchMove={this.handleMouseMove}
        onMouseMove={this.handleMouseMove}

        onTouchEnd={this.handleMouseUp}
      >

        <Drawing allLines={this.state.lines} />
      </div>
    </div>
    )
  }
}

function Drawing({allLines}) {
  console.log( "ALL LINES : ", allLines)

  return (
    <svg  className="drawing">
      {
        allLines.map((singleLine, idx) => (
        <DrawingLine key={idx} line={singleLine} />
      ))
      }
    </svg>
  )
}

function DrawingLine({line}) {
  console.log("LINE : ", line)

  const pathData = "M " +
      line
      .map(segment => {
        return `${segment.x} ${segment.y}`
      })
      .join(" L ")
  // console.log("PATH DATA!", pathData)

  return <path className="path" d={pathData} />
}
