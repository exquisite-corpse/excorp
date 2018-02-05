import React, { Component } from "react"
import { render } from "react-dom"
import { Redirect } from 'react-router-dom'
import { Stage, Layer, Rect, Image, Group } from "react-konva"
import Img from 'react-image'
import db from '../db/db_config'
import {PassPanel} from "./index"
import {withAuth} from 'fireview'
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