import React, { Component } from "react"
// import db from '../db/db_config'
import ReactDOM from 'react-dom'
import firebase from 'firebase'
const FBStorage = firebase.storage().ref()

export default class DWGArea extends React.Component {

  constructor() {
    super()
    this.state = {
    lines: [],
    currentLine:[],
    isDrawing: false,
    svgUrl: ""
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
    if ((evt.button != 0) && (evt.type != "touchstart" )) {return}

    const point = this.relativeCoordinatesForEvent(evt)

    this.setState({
      currentLine: Object.assign([], [...this.state.currentLine, point]),
      isDrawing: true
    })
  }

  handleMouseMove(evt) {
    evt.preventDefault()

    if (!this.state.isDrawing) {return}

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
        this.saveSvgToBlobMaybe()
        // this.saveSvgToDataURI()
        // this.svgSave2()
  }



svgSave2 = ()=>{
  //get svg element.
      // var svg = document.getElementById("svg");
      const data = this.refs.drawArea
      //get svg source.
      // const serializer = new XMLSerializer()
      // let source = serializer.serializeToString(data)
      let source = new XMLSerializer().serializeToString(data.getElementsByTagName( 'svg' )[ 0 ])

      //add name spaces.
      if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
          source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"')
      }
      if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
          source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"')
      }

      //add xml declaration
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source

      this.setState({svgUrl: source})
      //convert svg source to URI data scheme.
      const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source)
      console.log("THE URL : ", url)

      //  FBStorage
      // .child("testBlob")
      // .put(svgBlob)
      // .then(function(snapshot) {
      //   console.log('Uploaded a blob or file!')
      // })

}

  saveSvgToDataURI = ()=> {
   const data = this.refs.drawArea
   const svg = new XMLSerializer().serializeToString(data.getElementsByTagName( 'svg' )[ 0 ])
   // const base64 = window.btoa( svg )

    const svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"})
    const svgUrl = URL.createObjectURL(svgBlob)
   this.setState({svgUrl: svgBlob})
   console.log("FROM SAVE SVG", this.state.svgUrl)

      FBStorage
      .child("testBlob")
      .put(svgBlob)
      .then(function(snapshot) {
        console.log('Uploaded a blob or file!')
      })

  }

  // saveSvgToDataURI = ()=> {
  //  const data = this.refs.drawArea
  //  const svg = new XMLSerializer().serializeToString(data.getElementsByTagName( 'svg' )[ 0 ])
  //  const base64 = window.btoa( svg )
  //  const newsrc = 'data:image/svg+xml;base64,' + base64
  //  this.setState({svgUrl: newsrc})
  // }

  saveSvgToBlobMaybe = ()=> {
      const svgEl =  this.refs.drawArea
      const svgData = new XMLSerializer().serializeToString(svgEl.getElementsByTagName( 'svg' )[ 0 ])
      // const svgData = svgEl.outerHTML
      const svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"})
      const svgUrl = URL.createObjectURL(svgBlob)
      // console.log("THE SVG-EL IM PASSING IN: ", svgEl)
      // console.log("I'M SUPPOSED TO BE A BLOB : ", svgBlob)
      // console.log("THE SVG URL", svgUrl)
      this.setState({svgUrl: svgUrl})

      FBStorage
      .child("testBlob")
      .put(svgBlob)
      .then(function(snapshot) {
        console.log('Uploaded a blob or file!')
      })
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
           <img width="750px" height="350px" src={this.state.svgUrl}/>
          <div
            // xmlns="http://www.w3.org/2000/svg"
            // className="container-fluid"
            className="drawArea"
            ref="drawArea"
            onTouchStart={this.handleMouseDown}
            onMouseDown={this.handleMouseDown}
            onTouchMove={this.handleMouseMove}
            onMouseMove={this.handleMouseMove}
            onTouchEnd={this.handleMouseUp}
            onMouseUp={this.handleMouseUp}
          >
            <Drawing allLines={this.state.lines} />
          </div>
        </div>
    )
  }
}

function Drawing({allLines}) {

  // const context = canvas.getContext("2d")

  return (
     // <canvas
     //  width="750px"
     //  height="300px"
     //  stroke="10px"
     //  viewBox="0,0, 100, 100"
     //  >
      <svg
      // xmlns="http://www.w3.org/2000/svg"
      width="700"
      height="350"
      className="drawing"
      // stroke="10px"
      >
        {
          allLines.map((singleLine, idx) => {
            return <DrawingLine key={idx} line={singleLine} />
          })
        }
      </svg>
      // </canvas>
  )
}

function DrawingLine({line}) {
  const pathData = "M " +
    line.map(segment => {
      return `${segment.x} ${segment.y}`
    })
    .join(" L ")
  return (
    <path stroke-linecap="round" stroke-linejoin="round" stroke="#000000" fill="none" className="path" d={pathData} />
  )

}

          // <img width="750px" height="350px" src={this.state.svgUrl}/>

// REACT DOM FIND EXAMPLE:
    // console.log("FROM THE DWGAREA COMP : ", ReactDOM.findDOMNode(this).innerHTML)

// OTHER SVG EXPORT EXAMPLE:
    // var fileName = "Business Card - " + document.getElementById("name").value; + ".svg";
    // var svg = document.getElementById("svg");
    // var serializer = new XMLSerializer();
    // var svg_blob = new Blob([serializer.serializeToString(svg)],{'type': "image/svg+xml"});
    // var url = URL.createObjectURL(svg_blob);


// OTHER OTHER SVG EXPORT EXAMPLE
    // var svgData = $("#figureSvg")[0].outerHTML
    // var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"})
    // var svgUrl = URL.createObjectURL(svgBlob)
    // var downloadLink = document.createElement("a")
    // downloadLink.href = svgUrl
    // downloadLink.download = "newesttree.svg"
    // document.body.appendChild(downloadLink)
    // downloadLink.click()
    // document.body.removeChild(downloadLink)

// OTHER OTHER SVG EXPORT EXAMPLE
    // function saveSvg(svgEl, name) {
    // svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    // var svgData = svgEl.outerHTML;
    // var preface = '<?xml version="1.0" standalone="no"?>\r\n'
    // var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"})
    // var svgUrl = URL.createObjectURL(svgBlob);
    // var downloadLink = document.createElement("a")
    // downloadLink.href = svgUrl
    // downloadLink.download = name;
    // document.body.appendChild(downloadLink)
    // downloadLink.click()
    // document.body.removeChild(downloadLink)
