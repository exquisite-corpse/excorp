import React, { Component } from "react";
import { render } from "react-dom";
import {Redirect} from 'react-router-dom';
import { Stage, Layer, Rect, Image, Group } from "react-konva";
import CreatePanel from './CreatePanel'
import Img from 'react-image';
import db from '../db/db_config';

class Drawing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false
    }
  }

  componentDidMount() {
    const canvas = document.createElement("canvas");
    canvas.width = 700;
    canvas.height = 350;
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
  }

  handleMouseMove = ({ evt }) => {
    const { context, isDrawing } = this.state;


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
        width={700}
        height={350}
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
    this.state = {
      imageSrc: '',
      snippetSrc: '',
      submitted: false,
      drawingDone: false,
      drawingId: '',
      panelId:'',
      createPanel: false,
      category: '',
      title: ''
    }
    this.handleExportClick = this.handleExportClick.bind(this)
  }

  componentDidMount() {
    const panelId = this.props.match.params.panelId
    const panelRef = db.collection('panels').doc(`${panelId}`)
    let previousPanelId = ''
    let orderNum = 0
    panelRef.get().then(doc => {
      orderNum = doc.data().orderNum
      this.setState({orderNum: orderNum })
      if (orderNum !== 1) {
        previousPanelId = doc.data().previousPanel.path.split('/')[1]
      }
      return previousPanelId
    })
    .then((previousPanelId) => {
      if (previousPanelId !== '') {
      let previousPanelRef = db.collection('panels').doc(`${previousPanelId}`)
        previousPanelRef.get().then(doc => {
          this.setState({snippetSrc: doc.data().src})
        })
      }}
    )
    .then(()=> {
      panelRef.get()
      .then(doc => {
        let category 
        let title
        const currentDrawing = doc.data().drawingId
        currentDrawing.get().then(doc => {
          category = doc.data().category
          title = doc.data().title
          this.setState({category, title})
        })
      })

    })
  }
  handleExportClick = () => {

    const panelId = this.props.match.params.panelId

    const panelRef = db.collection('panels').doc(`${panelId}`)
    this.setState({panelId: panelRef})
    let orderNum = 0
    let drawingId = ''
    panelRef.get().then(doc => {
       orderNum = doc.data().orderNum
       drawingId = doc.data().drawingId.path.split('/')[1]

      panelRef.update({
        src: this.stageRef.getStage().toDataURL('image/jpeg', 0.1),
        completed: true

      })
      this.setState({imageSrc: this.stageRef.getStage().toDataURL('image/jpeg', 0.1), submitted: true})
    }).then(() => {

    const drawingRef = db.collection('drawings').doc(`${drawingId}`)
    this.setState({drawingId: drawingRef })
    drawingRef.get().then(doc => {
      console.log(doc.data())
      if (orderNum === doc.data().panelCount) {
        drawingRef.update({
          completed: true
        })
        this.setState({drawingDone: true})
      } else {
        this.setState({createPanel: true})
      }
      })
  })
  }

  render() {
    const {submitted,drawingDone,drawingId,panelId,createPanel,orderNum} = this.state
    const snippet = this.state.snippetSrc
    const src = this.state.imageSrc

    return (
      <div onContextMenu={e => e.preventDefault()}>

        <div className="stage-container">

      {!submitted ? <div><h1>{`Drawing Title: ${this.state.title} Category: ${this.state.category}`}</h1><h1>{`You're on panel ${orderNum} of 3`}</h1></div> : 
      <h1>Pass your panel to the next player!</h1>
    
    }
       {createPanel
             ? <CreatePanel drawingId={drawingId} orderNum={orderNum} prevPanelId={panelId} src={src}/>
             :
               submitted
                ? <div>
                {  src &&
                <Img src={src}/> }
                  <h3>Panel Rendered</h3>
                  </div>
                : <div>
                {snippet
                ?<div>
                 <img className="snippet" src={snippet} width="700"/>

                  <Stage  className="Stage" width={700} height={350} ref={node => {
                  this.stageRef = node
                  }}>
                  <Layer>
                    <Drawing />
                  </Layer>
                </Stage>
                </div>
                : <Stage  className="Stage-no-snippet" width={700} height={350} ref={node => {
                  this.stageRef = node
                  }}>
                  <Layer>
                    <Drawing />
                  </Layer>
                </Stage>

              }

                <button className="submit-button" onClick={this.handleExportClick}>Submit Panel</button>
                </div>
              }


             {
               drawingDone &&
               <Redirect to={'/gallery'} />
             }
        </div>
      </div>
    );
  }
}
