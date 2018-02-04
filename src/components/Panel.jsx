import React, { Component } from "react"
import { render } from "react-dom"
import { Redirect } from 'react-router-dom'
import { Stage, Layer, Rect, Image, Group } from "react-konva"
import Img from 'react-image'
import db from '../db/db_config'
import {PassPanel} from "./index"
const allPanels = db.collection('panels')
const allDrawings = db.collection('drawings')

class Drawing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDrawing: false
        }
    }
    componentDidMount() {
        const canvas = document.createElement("canvas")
        canvas.width = 700
        canvas.height = 350
        const context = canvas.getContext("2d")
        this.setState({ canvas, context })
    }

    handleMouseDown = () => {
        this.setState({ isDrawing: true })
        const stage = this.image.getStage()
        this.lastPointerPosition = stage.getPointerPosition()
    }

    handleMouseUp = () => {
        this.setState({ isDrawing: false })
    }

    handleMouseMove = ({ evt }) => {
        const { context, isDrawing } = this.state


        if (isDrawing) {
            context.strokeStyle = "black"
            context.lineJoin = "round"
            context.lineWidth = 3

            if (evt.buttons === 1) {
                // draw
                context.globalCompositeOperation = "source-over"
            } else if (evt.buttons === 2) {
                // erase
                context.globalCompositeOperation = "destination-out"
            }
            context.beginPath()

            var localPos = {
                x: this.lastPointerPosition.x - this.image.x(),
                y: this.lastPointerPosition.y - this.image.y()
            }
            context.moveTo(localPos.x, localPos.y)

            const stage = this.image.getStage()

            var pos = stage.getPointerPosition()
            localPos = {
                x: pos.x - this.image.x(),
                y: pos.y - this.image.y()
            }
            context.lineTo(localPos.x, localPos.y)
            context.closePath()
            context.stroke()
            this.lastPointerPosition = pos
            this.image.getLayer().draw()
        }
    }

    render() {
        const { canvas } = this.state

        return (
            <Image
                image={canvas}
                ref={node => (this.image = node)}
                width={700}
                height={350}
                stroke="blue"
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseMove={this.handleMouseMove}
            />
        )
    }
}

export default class Panel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            panel: {},
            snippetSrc: '',
            drawing: {},
            submitted: false
        }
        //this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        let panel
        let drawing
        const panelId = this.props.match.params.panelId
        const panelRef = allPanels.doc(`${panelId}`).get()
            .then(doc => {
                panel = doc.data()
            })
            .then(() => panel.drawingId.get())
            .then(drawingDoc => drawing = drawingDoc.data())
            .then(() => {
                if (panel.previousPanel){
                panel.previousPanel.get()
                .then(prevPanelDoc => {
                    const snippetSrc = prevPanelDoc.data().src
                    this.setState({ snippetSrc, panel, drawing })
                })}else {
                    this.setState({ panel, drawing })
                }
            })
    }

    handleSubmit = (e) => {
        const imageSrc= this.stageRef.getStage().toDataURL('image/jpeg', 0.1)
        console.log("IMAGE FUCKING SOURCE : ", imageSrc.slice(0,100))
        e.preventDefault()
        allPanels.doc(this.state.panel.id).set({src: imageSrc, completed:true}, {merge: true})
        .then(() => {
        //check if it's the last one 
        //and if it is update drawing {complete: true}
        //instead redirect to /gallery
          if (this.state.panel.orderNum == this.state.drawing.panelCount){
            allDrawings.doc(`${this.state.drawing.id}`).set({completed:true},{merge:true})
            .then(() => window.location.href = `/gallery`)
          }
        this.setState({submitted: true})
        })
    }

    render() {
        const { snippetSrc, panel, drawing, submitted } = this.state
        if (!submitted) return (
            <div onContextMenu={e => e.preventDefault()}>
                <div className="stage-container">
                    <div><h1>{`Drawing Title: ${drawing.title} Category: ${drawing.category}`}</h1><h1>{`You're on panel ${panel.orderNum} of 3`}</h1></div>
                     <div>
                        {snippetSrc.length
                            ? <div>
                                <img 
                                className="snippet" 
                                src={snippetSrc} 
                                width="700" 
                                />
                                <Stage 
                                className="Stage" 
                                width={700} 
                                height={350} 
                                ref={node => {this.stageRef = node }}
                                >
                                <Layer>
                                    <Drawing />
                                </Layer>
                                </Stage>
                            </div>
                            : <Stage 
                                className="Stage-no-snippet" 
                                width={700} 
                                height={350} 
                                ref={node => {this.stageRef = node }}
                                >
                                <Layer>
                                    <Drawing />
                                </Layer>
                            </Stage>
                        }
                        <button className="submit-button" onClick={this.handleSubmit}>Submit Panel</button>
                    </div>
                    }
                </div>
            </div>
        )
        return (
            <PassPanel panel={panel} drawing={drawing}/>
        )
    }
}


