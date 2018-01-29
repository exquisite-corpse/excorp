import React, { Component } from "react";
import { render } from "react-dom";
import { Stage, Layer, Rect, Image, Group } from "react-konva";
import Img from 'react-image';
import db from '../db/db_config';
//import {Cropper} from 'react-croppy';

class Drawing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
    }
    this.handleExportClick = this.handleExportClick.bind(this);
  }

  componentDidMount() {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const context = canvas.getContext("2d");

    this.setState({ canvas, context });
  }

  handleMouseDown = () => {
    this.setState({ isDrawing: true });
    const stage = this.image.getStage();
    this.lastPointerPosition = stage.getPointerPosition();
  };

  handleMouseUp = () => {
    this.setState({ isDrawing: false });
  };

  handleExportClick = () => {
    console.log(this.stageRef.getStage().toDataURL());
  }

  handleMouseMove = ({ evt }) => {
    const { context, isDrawing } = this.state;

//     console.log('evt', evt.buttons);

    if (isDrawing) {
      context.strokeStyle = "black";
      context.lineJoin = "round";
      context.lineWidth = 3;

      if (evt.buttons === 1) {
        // draw
        context.globalCompositeOperation = "source-over";
      } else if (evt.buttons === 2) {
        // erase
        context.globalCompositeOperation = "destination-out";
      }
      context.beginPath();

      var localPos = {
        x: this.lastPointerPosition.x - this.image.x(),
        y: this.lastPointerPosition.y - this.image.y()
      };
      context.moveTo(localPos.x, localPos.y);

      const stage = this.image.getStage();

      var pos = stage.getPointerPosition();
      localPos = {
        x: pos.x - this.image.x(),
        y: pos.y - this.image.y()
      };
      context.lineTo(localPos.x, localPos.y);
      context.closePath();
      context.stroke();
      this.lastPointerPosition = pos;
      this.image.getLayer().draw();
    }
  };

  render() {
    const { canvas } = this.state;

    return (
      <Image
        image={canvas}
        ref={node => (this.image = node)}
        width={300}
        height={300}
        stroke="blue"
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
      />
    );
  }
}

export default class DWgDetail extends Component {
  constructor(props){
    super(props);
    this.state = {imageSrc: '', snippetSrc: ''}
  }

  handleExportClick = () => {
    this.setState({
      imgSrc: this.stageRef.getStage().toDataURL('image/jpeg', 0.1)
      //snippetSrc: this.refs.cropper.crop()
    });
    {this.state.imgSrc && console.log(this.state.imgSrc)
      db.collection('photos').doc('photo5').set({
        src: this.stageRef.getStage().toDataURL('image/jpeg', 0.1)
      })
      .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
  }
  }
  render() {


    return (
      <div onContextMenu={e => e.preventDefault()}>
        <Stage   width={700} height={700} ref={node => {
          this.stageRef = node
          }}>
          <Layer>
            <Drawing />
          </Layer>
        </Stage>
        <button style={{ position: 'absolute', top: '0'}} onClick={this.handleExportClick}>Export stage</button>
        {this.state.imgSrc&&
        <Img src={this.state.imgSrc}/>}

      </div>
    );
  }
}

//render(<DwgDetail />, document.getElementById("root"));
