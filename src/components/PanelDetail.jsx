import React, { Component } from "react";
import { render } from "react-dom";
import {Redirect} from 'react-router-dom';
import { Stage, Layer, Rect, Image, Group } from "react-konva";
import CreatePanel from './CreatePanel'
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
  };

  handleExportClick = () => {
    // console.log(this.stageRef.getStage().toDataURL());
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
      createPanel: false
    }
    this.handleExportClick = this.handleExportClick.bind(this)
  }

  // componentDidMount() {
  //   const me = this
  //   var docRef = db.collection('photos').doc('tHlyrlBNY9y9wzoitJzd');

  //   docRef.get().then(function(doc) {
  //     if (doc.exists) {
  //         console.log('Document data:', doc.data());
  //         me.setState({ snippetSrc: doc.data().src })
  //     } else {
  //         // doc.data() will be undefined in this case
  //         console.log('No such document!');
  //     }
  //   }).catch(function(error) {
  //     console.log('Error getting document:', error);
  //   });
  // }

  handleExportClick = () => {
    // ******- sumbit a panel
    //   ******- completed: true

    //   - ******* if orderNum === 3, mark this drawing is complete


    const panelId = this.props.match.params.panelId

    const panelRef = db.collection('panels').doc(`${panelId}`)
    this.setState({panelId: panelRef})
    let orderNum = 0
    let drawingId = ''
    panelRef.get().then(doc => {
       orderNum = doc.data().orderNum
       drawingId = doc.data().drawingId.path.split('/')[1]
       this.setState({orderNum: orderNum })

      panelRef.update({
        src: this.stageRef.getStage().toDataURL('image/jpeg', 0.1),
        completed: true

      })
      this.setState({imageSrc: this.stageRef.getStage().toDataURL('image/jpeg', 0.1), submitted: true})
    }).then(() => {

    const drawingRef = db.collection('drawings').doc(`${drawingId}`)
    this.setState({drawingId: drawingRef })
    drawingRef.get().then(doc => {

      if (orderNum === doc.data().panelCount) {
        // change drawingId.complete = true
        drawingRef.update({
          completed: true
        })
        this.setState({drawingDone: true})
      } else {
          //   - if orderNum !== 3, create a new panel
    //     - add selected user(friend) id to this new panel
    //       - add this panel to this drawing's panels collection
    //       - add this panel to selected user's(friend) panels collection
    //       - set completed to false
    //       - orderNum is current orderNum + 1
    //       - previousPanel is current panelId
    this.setState({createPanel: true})
      }
    })})




  }




  //   // below is hard coded
  //   this.setState({
  //     imgSrc: this.stageRef.getStage().toDataURL('image/jpeg', 0.1)
  //     //snippetSrc: this.refs.cropper.crop()
  //   });
  //   {this.state.imgSrc && console.log(this.state.imgSrc)
  //     db.collection('photos').doc().set({})}

  //     // this.state.imgSrc && console.log(this.state.imgSrc)
  //     db.collection('photos').doc('photo5').set({
  //       src: this.stageRef.getStage().toDataURL('image/jpeg', 0.1)
  //     })
  //     .then(function() {
  //       console.log("Document successfully written!");
  //   })
  //   .catch(function(error) {
  //       console.error("Error writing document: ", error);
  //   });
  // }

  render() {
    const snippet = this.state.snippetSrc
    const submitted = this.state.submitted
    const drawingDone = this.state.drawingDone
    const drawingId = this.state.drawingId
    const panelId = this.state.panelId
    const createPanel = this.state.createPanel
    const src = this.state.imageSrc
    const orderNum = this.state.orderNum
    console.log('skhfj', createPanel);
    // const panelSource = this.props.previousPanel // render our snippet
    // const drawingId = this.props.drawingId // drawing Id
    return (
      <div onContextMenu={e => e.preventDefault()}>

        <div className="stage-container">
       {createPanel
             ? <CreatePanel drawingId={drawingId} orderNum={orderNum} prevPanelId ={panelId} src={src}/>
             :
               submitted
                ? <div>
                {  src &&
                <Img src={src}/> }
                  <h3>Panel Rendered</h3>
                  </div>
                : <div>
                <img className="snippet" src={snippet} />
                  <Stage className="Stage" width={700} height={500} ref={node => {
                  this.stageRef = node
                  }}>
                  <Layer>
                    <Drawing />
                  </Layer>
                </Stage>
                <button onClick={this.handleExportClick}>Submit Panel</button>
                </div>
              }
             {
               drawingDone &&
               <Redirect to={`/drawings/${drawingId}`} />
             }








        </div>


      </div>
    );
  }
}


//render(<DwgDetail />, document.getElementById("root"));
