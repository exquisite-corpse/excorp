import React, { Component } from "react"
import { render } from "react-dom"
import { Redirect } from "react-router-dom"
import { Stage, Layer, Rect, Image, Group } from "react-konva"
import Img from "react-image"
import db from "../db/db_config"
import { PassPanel, Drawing, Bttn } from "./index"
const allPanels = db.collection("panels")
const allDrawings = db.collection("drawings")

export default class Panel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      panel: {},
      snippetSrc: "",
      drawing: {},
      submitted: false,
      eraserOn: false,
      pencilSize: 2

    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleErase = this.handleErase.bind(this)
    this.handlePencil = this.handlePencil.bind(this)
  }


  componentDidMount() {
    let panel
    let drawing
    const panelId = this.props.match.params.panelId
    const panelRef = allPanels
      .doc(`${panelId}`)
      .get()
      .then(doc => {
        panel = doc.data()
        return panel
      })
      .then(myPanel => {
        console.log(
          `I am at ${panel.id} which has a drawing id of: ${myPanel.drawingId}`
        )
        return allDrawings.doc(myPanel.drawingId).get()
      })
      .then(drawingDoc => (drawing = drawingDoc.data()))
      .then(() => {
        if (panel.previousPanel) {
          panel.previousPanel.get().then(prevPanelDoc => {
            const snippetSrc = prevPanelDoc.data().src
            this.setState({ snippetSrc, panel, drawing })
          })
        } else {
          this.setState({ panel, drawing })
        }
      })
  }

  async handleSubmit(e) {
    e.preventDefault()
    const imageSrc = this.stageRef.getStage().toDataURL("image/jpeg", 0.1)

    const panel = await allPanels.doc(this.state.panel.id).set({ src: imageSrc, completed: true }, { merge: true })

    if (this.state.panel.orderNum == this.state.drawing.panelCount) {
      const drawing = await allDrawings
        .doc(`${this.state.drawing.id}`).set({ completed: true }, { merge: true })

       window.location.href = `/gallery`
    }else {
      this.setState({ submitted: true })
    }
  }


  handleErase(evt){
    evt.preventDefault()
    this.setState({eraserOn: !this.state.eraserOn})
  }

  handlePencil(evt){

    const text = evt.target.innerHTML

    if (text === "thin"){
      this.setState({pencilSize: 2, eraserOn: false})
    }
    if (text === "med"){
      this.setState({pencilSize: 5, eraserOn: false})
    }
    if (text === "thick"){
      this.setState({pencilSize: 8, eraserOn: false})
    }

  }


  render() {
    const { snippetSrc, panel, drawing, submitted } = this.state
    const clssNm = (snippetSrc.length? "Stage" : "Stage-no-snippet")
    const isSnippy = (snippetSrc.length? "panel-buttons-snippet" : "panel-buttons-no-snippet")
//     console.log("my panel button conditional className", isSnippy)

  if (!submitted)
    return (
      <div id="panel-cont" onContextMenu={e => e.preventDefault()}>
          {
            drawing.title &&
            (
            <div>
              <h1>
                {`Drawing Title: ${drawing.title} Category: ${drawing.category}`}
              </h1>
              <h1>
                {`You're on panel ${panel.orderNum} of 3`}
              </h1>
            </div>
            )
          }

          <div id="main-container">
              <img id="snippet" className="snippet" src={snippetSrc} width="700" />
              <Stage
                className= {clssNm}
                width={700}
                height={350}
                ref={node => {
                  this.stageRef = node
                }}
              >
                  <Layer>
                    <Drawing eraserOn={this.state.eraserOn} pencilSize={this.state.pencilSize}/>
                  </Layer>
              </Stage>
          </div>


          <div className={isSnippy}>
            <div className="drawing-buttons" >
                <button onClick={this.handleErase}>
                  {this.state.eraserOn? "PENCIL" : "ERASER"}
                </button>

                <h5>pencil size</h5>
                <button onClick={this.handlePencil} >thin</button>
                <button onClick={this.handlePencil} >med</button>
                <button onClick={this.handlePencil} >thick</button>

                <div>
                  <button id="submit-button" className="submit-button" onClick={this.handleSubmit}>
                    Submit Panel
                  </button>
                </div>
            </div>
        </div>
  </div>
  )
  return(
         <PassPanel panel={panel} drawing={drawing} />
  )
  }
}
