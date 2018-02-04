import React, { Component } from "react";
import db from '../db/db_config';
import Bttn from './Bttn'
import { Redirect } from 'react-router-dom';
import firebase from 'firebase'
import {withAuth, Map} from 'fireview'
const allDrawings = db.collection('drawings')
const allPanels = db.collection('panels')

class PassPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
        nextArtist: {}
    }
    this.createAndPassPanel = this.createAndPassPanel.bind(this)
    //this.handleSubmit = this.handleSubmit.bind(this)
    //this.handleChange = this.handleChange.bind(this)
  }

handleChange = (e) => {
  e.preventDefault()
  console.log(e.target.value)
  this.setState({nextArtist: e.target.value})
}

async createAndPassPanel() {
  let postData = {
    author: db.collection('users').doc(`${this.state.nextArtist.id}`),
    completed: false,
    drawingId: this.props.drawing.id,
    orderNum: this.props.panel.orderNum + 1,
    //this should really be just the id
    previousPanel: db.collection('panels').doc(`${this.props.panel.id}`),
    src: '',
    [this.state.nextArtist.id]: true,
    [this.props.drawing.id]: true,
    createdAt: Date.now()
    //consider adding category and title onto panel for easier work??
  }

  const newPanel = await db.collection("panels").add(postData)

  const addOwnId = await  allPanels.doc(`${newPanel.id}`).set({id: newPanel.id}, {merge: true})

  const updateDrawing = await db.collection("drawings").doc(`${this.props.drawing.id}`).set({
    artists: {
      [this.state.nextArtist.id]: true
    },
    panels: {
      [newPanel.id]: this.props.panel.orderNum + 1
    }
  }, { merge: true })

  return window.location.href = `/wips`
}

handleSubmit = (e) => {
  e.preventDefault()
  this.createAndPassPanel()
}

render(){
    return (
        <div>
            <br />
            <h3>Pass Along Your Panel to the Next Artist</h3>
            <br />
            <form name="pass-your-panel" onSubmit={this.handleSubmit}>
                <div className="users-select">
                    <select  onChange={this.handleChange} name="nextArtist">
                        <Map from={ db.collection('users')}
                            Loading={() => 'Loading...'}
                            Render={Options}
                            Empty={() => <select>You don't have any friends...</select>}/>
                    </select>
                </div>
                <br />
                <Bttn className="btn btn-success" type="submit" value="pass your panel" />
            </form>
        </div>
    )
}
}
export default withAuth(PassPanel)


const Options = (props) => {
    return <option key={props.uid} value={props}>{props.username}</option>
  }