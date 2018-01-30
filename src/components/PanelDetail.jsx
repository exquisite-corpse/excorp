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
      submitted: false
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
    var me = this
    // ******- sumbit a panel
    //   ******- completed: true

    //   - ******* if orderNum === 3, mark this drawing is complete

    //   - if orderNum !== 3, create a new panel
    //     - add selected user(friend) id to this new panel
    //       - add this panel to this drawing's panels collection
    //       - add this panel to selected user's(friend) panels collection
    //       - set completed to false
    //       - orderNum is current orderNum + 1
    //       - previousPanel is current panelId
    const panelId = me.props.match.params.panelId
    var panelRef = db.collection('panels').doc(`${panelId}`)
    panelRef.get().then(function(doc) {
      var orderNum = doc.data().orderNum
      var drawingId = doc.data().drawingId.path.split('/')[1]
      panelRef.update({
        src: me.stageRef.getStage().toDataURL('image/jpeg', 0.1),
        completed: true
      })
      me.setState({imageSrc: me.stageRef.getStage().toDataURL('image/jpeg', 0.1), submitted: true})

      if (orderNum === 3) {
        // change drawingId.complete = true
        db.collection('drawings').doc(`${drawingId}`).update({
          completed: true
        })
      } else {

      }
    })



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
    // const panelSource = this.props.previousPanel // render our snippet
    // const drawingId = this.props.drawingId // drawing Id
    return (
      <div onContextMenu={e => e.preventDefault()}>

        <div className="stage-container">


              { submitted
                ? <div>
                {  this.state.imageSrc&&
                <Img src={this.state.imageSrc}/> }
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






        </div>


      </div>
    );
  }
}


//render(<DwgDetail />, document.getElementById("root"));
