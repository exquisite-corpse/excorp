import React, { Component } from "react"
import { render } from "react-dom"
import { Redirect } from "react-router-dom"
import { Stage, Layer, Rect, Image, Group } from "react-konva"
import Img from "react-image"
import db from "../db/db_config"
import { PassPanel, Drawing } from "./index"
const allPanels = db.collection("panels")
const allDrawings = db.collection("drawings")

export default class Panel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      panel: {},
      snippetSrc: "",
      drawing: {},
      submitted: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
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

render() {
  const { snippetSrc, panel, drawing, submitted } = this.state
  if (!submitted)
    return (
      <div id="panel-cont" onContextMenu={e => e.preventDefault()}>
        <div className="stage-container" id="main-container">
        {
         drawing.title && <div>
            <h1>{`Drawing Title: ${drawing.title}`}</h1>
            <h1>{`Category: ${drawing.category}`}</h1>
            <h1>{`You're on panel ${panel.orderNum} of 3`}</h1>
          </div>
        }
          <div>
            {snippetSrc.length ? (
              <div id="snippet">
                <img  className="snippet" src={snippetSrc} width="700" />
                <Stage
                  className="Stage"
                  width={700}
                  height={350}
                  ref={node => {
                    this.stageRef = node
                  }}
                >
                  <Layer>
                    <Drawing />
                  </Layer>
                </Stage>
              </div>
            ) : (
                <Stage
                  className="Stage-no-snippet"
                  width={700}
                  height={350}
                  ref={node => {
                    this.stageRef = node
                  }}
                >
                  <Layer>
                    <Drawing />
                  </Layer>
                </Stage>
              )}
          </div>
        </div>
        <button id="submit-button" onClick={this.handleSubmit}>
          Submit Panel
          </button>
      </div>
    )
  return <PassPanel panel={panel} drawing={drawing} />
}
}
