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



// class App extends React.Component {
//   contructor() {
//     super();
//   }

//   swiped = () => {
//     console.log("Swiped")
//   }

//   render() {
//     return (
//       <div>
//         <div className='swipe-card' onTouchStart={this.swiped}>Swipe Me</div>
//       </div>
//     )
//   }
// }


export default class kbDWG extends React.Component {

  constructor() {
    super()

    this.state = {
      lines: new Immutable.List(),
      isDrawing: false
    }

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp)
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp)
  }

  handleMouseDown(mouseEvent) {
    console.log("HANDLEDOWN EVENT :", mouseEvent)
    if (mouseEvent.button != 0) {
      return
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent)

    this.setState(prevState => ({
      lines: prevState.lines.push(new Immutable.List([point])),
      isDrawing: true
    }))
  }

  handleMouseMove(mouseEvent) {
    if (!this.state.isDrawing) {
      return
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent)

    this.setState(prevState =>  ({
      lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
    }))
  }

  handleMouseUp() {
    this.setState({ isDrawing: false })
  }

  relativeCoordinatesForEvent(evt) {
    console.log("RELCOOORDEVT:", evt)
    // if (evt)
    const boundingRect = this.refs.drawArea.getBoundingClientRect()
    return new Immutable.Map({
      x: evt.clientX - boundingRect.left,
      y: evt.clientY - boundingRect.top,
    })
  }

  render() {
    return (
    <div> <p> my panel </p>
      <div
        className="drawArea"
        ref="drawArea"
        onTouchStart={this.handleMouseDown} onMouseDown={this.handleMouseDown}
        onTouchMove={this.handleMouseMove}  onMouseMove={this.handleMouseMove}
        onTouchEnd={this.handleMouseUp}
      >

        <Drawing lines={this.state.lines} />
      </div>
    </div>
    )
  }
}

function Drawing({ lines }) {
  return (
    <svg  className="drawing">
      {lines.map((line, index) => (
        <DrawingLine key={index} line={line} />
      ))}
    </svg>
  )
}

function DrawingLine({ line }) {
  const pathData = "M " +
    line
      .map(p => {
        return `${p.get('x')} ${p.get('y')}`
      })
      .join(" L ");

  return <path className="path" d={pathData} />
}
