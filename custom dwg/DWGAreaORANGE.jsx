import React, { Component } from "react"
// import db from '../db/db_config'
import ReactDOM from 'react-dom'
import firebase from 'firebase'


export default class DWGArea extends React.Component {

  constructor() {
    super()
    this.state = {
    lines: [],
    currentLine:[],
    isDrawing: false
    }

    // this.handleExportClick = this.handleExportClick.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.saveSvg = this.saveSvg.bind(this)
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp)
    document.addEventListener("touchend", this.handleMouseup)
    document.addEventListener("touchcancel", this.handleMouseup)
  }

componentDidUpdate() {
   console.log("FROM THE DWGAREA COMP : ", ReactDOM.findDOMNode(this).innerHTML)
   // this.saveSvg(mysvg)
}



// var fileName = "Business Card - " + document.getElementById("name").value; + ".svg";
//     var svg = document.getElementById("svg");
//     var serializer = new XMLSerializer();
//     var svg_blob = new Blob([serializer.serializeToString(svg)],{'type': "image/svg+xml"});
//     var url = URL.createObjectURL(svg_blob);




saveSvg(svgEl) {
    console.log("WHAT IS THE SVG SHIT?::::: ", svgEl)
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    const source = svgEl

    var serializer = new XMLSerializer()
    var svgBlob = new Blob([serializer.serializeToString(source)],{'type': "image/svg+xml"})
     // const source = (new XMLSerializer()).serializeToString(ReactDOM.findDOMNode(this).node())

    // const doctype = '<?xml version="1.0" standalone="no"?>'
    // const svgBlob = new Blob([doctype, source], {type:"image/svg+xml"})

    console.log("I'M SUPPOSED TO BE A BLOB:::::", svgBlob)
    const svgUrl = URL.createObjectURL(svgBlob)
    console.log("URL:::::", svgUrl)

      const FBStorage = firebase.storage().ref()

    FBStorage
    .child("testBlob")
    .put(svgBlob)
    .then(function(snapshot) {
      console.log('Uploaded a blob or file!')
    })

  }




  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp)
    document.removeEventListener("touchend", this.handleMouseup)
    document.removeEventListener("touchcancel", this.handleMouseup)
  }

  handleMouseDown(evt) {
    if ((evt.button != 0) && (evt.type != "touchstart" )) {
      return
    }
    const point = this.relativeCoordinatesForEvent(evt)

    this.setState({
      currentLine: Object.assign([], [...this.state.currentLine, point]),
      isDrawing: true
    })
  }

  handleMouseMove(evt) {
    evt.preventDefault()
    if (!this.state.isDrawing) {
      return
    }

    const point = this.relativeCoordinatesForEvent(evt)

    this.setState( {
      currentLine: Object.assign([], [...this.state.currentLine, point])
    })
  }

  handleMouseUp(evt) {
    this.setState({
      lines: Object.assign([], [...this.state.lines, this.state.currentLine]),
      currentLine: [],
      isDrawing: false
    })

    // const mysvg = ReactDOM.findDOMNode(this)
    console.log(this.refs)
    const mysvg =  this.refs.drawArea
    this.saveSvg(mysvg)
  }

  relativeCoordinatesForEvent(evt) {
    let CLIENTX
    let CLIENTY
    const boundingRect = this.refs.drawArea.getBoundingClientRect()

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

    let coordObj= {
      x: CLIENTX - boundingRect.left,
      y: CLIENTY - boundingRect.top,
    }
    return coordObj
  }



  render() {
    return (
        <div>
          <div
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
  return (
      <svg
      width="750px"
      height="300px"
      className="drawing"
      stroke="10px"
      >
        {

          allLines.map((singleLine, idx) => {
            return <DrawingLine key={idx} line={singleLine} />
          })
        }
      </svg>
  )
}

function DrawingLine({line}) {
  const pathData = "M " +
    line.map(segment => {
      return `${segment.x} ${segment.y}`
    })
    .join(" L ")
  return (
    <path stroke="#F7931E" fill="none" className="path" d={pathData} />
  )

}
