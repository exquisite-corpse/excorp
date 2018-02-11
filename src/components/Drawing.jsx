import React, { Component } from "react"
import { render } from "react-dom"
import { Redirect } from 'react-router-dom'
import { Stage, Layer, Rect, Image, Group } from "react-konva"
import db from '../db/db_config'
import {PassPanel} from "./index"
const allPanels = db.collection('panels')
const allDrawings = db.collection('drawings')

export default class Drawing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDrawing: false,
            strokeColor: "black",
            strokeWidth: 2,
        }
    }

    componentDidMount() {
        const canvas = document.createElement("canvas")
        canvas.width = 700
        canvas.height = 350
        const context = canvas.getContext("2d")
        this.setState({ canvas, context })
    }


    componentWillReceiveProps(nextProps){
        console.log("NEXT PROPS IN DWG", nextProps)

        if(nextProps.eraserOn) {
            this.setState({strokeColor: "white", strokeWidth: 20})
        }else{
            this.setState({strokeColor: "black", strokeWidth: 2})
        }

        if(nextProps.pencilSize && !nextProps.eraserOn) {
            this.setState({strokeWidth: nextProps.pencilSize})
        }

    }


    handleMouseDown = (evt) => {
        this.setState({ isDrawing: true })
        const stage = this.image.getStage()
        this.lastPointerPosition = stage.getPointerPosition()
    }

    handleMouseUp = (evt) => {
        this.setState({ isDrawing: false })
    }

    handleMouseMove = ( evt ) => {
        if (!this.state.isDrawing) {
          return
        }

        const { context, isDrawing } = this.state

        if (isDrawing) {
            context.strokeStyle = this.state.strokeColor
            context.lineJoin = "round"
            context.lineWidth = this.state.strokeWidth


            if (evt.evt.buttons === 1) {
                context.globalCompositeOperation = "source-over"
            }
            else if (evt.evt.type === "touchmove") {
                context.globalCompositeOperation = "source-over"

            }
            else if (evt.buttons === 2) {
                context.globalCompositeOperation = "destination-out"
            }
            context.beginPath()

            let localPos = {
                x: this.lastPointerPosition.x - this.image.x(),
                y: this.lastPointerPosition.y - this.image.y()
            }

            context.moveTo(localPos.x, localPos.y)
            const stage = this.image.getStage()


            stage.on('mouseout', () =>{
                this.setState({ isDrawing: false })
            })

            let pos = stage.getPointerPosition()

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
                fill="white"

                onMouseDown={this.handleMouseDown}
                onTouchStart={this.handleMouseDown}

                onMouseUp={this.handleMouseUp}
                onTouchEnd={this.handleMouseUp}
                onTouchCancel={this.handleMouseUp}

                onMouseMove={this.handleMouseMove}
                onTouchMove={this.handleMouseMove}

                onMouseLeave={this.handleMouseUp}
            />


        )
    }
}
