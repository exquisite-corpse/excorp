import React, { Component } from "react"
import { render } from "react-dom"
import { Redirect } from 'react-router-dom'
import { Stage, Layer, Rect, Image, Group } from "react-konva"
import Img from 'react-image'
import db from '../db/db_config'
import {PassPanel} from "./index"
const allPanels = db.collection('panels')
const allDrawings = db.collection('drawings')

export default class Drawing extends Component {
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



    handleMouseDown = (evt) => {
        this.setState({ isDrawing: true })
        const stage = this.image.getStage()
        this.lastPointerPosition = stage.getPointerPosition()
    }

    handleMouseUp = (evt) => {
        this.setState({ isDrawing: false })
    }

    handleMouseMove = ( e ) => {
        if (!this.state.isDrawing) {
          return
        }

        const evt = e.evt
        const { context, isDrawing } = this.state

        if (isDrawing) {
            context.strokeStyle = "black"
            context.lineJoin = "round"
            context.lineWidth = 2


            if (evt.buttons === 1) {
                context.globalCompositeOperation = "source-over"
            }
            else if (e.type === "touchmove") {
                context.globalCompositeOperation = "source-over"

            } else if (evt.buttons === 2) {
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
                stroke="grey"
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