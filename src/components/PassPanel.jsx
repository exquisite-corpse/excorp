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
        nextArtistId: "",
        artistSelected: false
    }
    this.createAndPassPanel = this.createAndPassPanel.bind(this)
    //this.handleSubmit = this.handleSubmit.bind(this)
    //this.handleChange = this.handleChange.bind(this)
  }

handleChange = (e) => {
  e.preventDefault()
  console.log("Currently chosen next artist: ", e.target.value)
  this.setState({nextArtistId: e.target.value, artistSelected: true})
}

async createAndPassPanel() {
    console.log(this.state.nextArtistId)
  let postData = {
    author: db.collection('users').doc(`${this.state.nextArtistId}`),
    completed: false,
    drawingId: this.props.drawing.id,
    orderNum: this.props.panel.orderNum + 1,
    //this should really be just the id
    previousPanel: db.collection('panels').doc(`${this.props.panel.id}`),
    src: '',
    [this.state.nextArtistId]: true,
    [this.props.drawing.id]: true,
    createdAt: Date.now()
    //consider adding category and title onto panel for easier work??
  }
  console.log("checking post data contents in create and pass", postData.author, this.state.nextArtistId)
  debugger
  const newPanel = await db.collection("panels").add(postData)

  //console.log("this is supposed to be the new panel :/ ", newPanel.id)

  const addOwnId = await  allPanels.doc(`${newPanel.id}`).set({id: newPanel.id}, {merge: true})

  const updateDrawing = await db.collection("drawings").doc(`${this.props.drawing.id}`).set({
    artists: {
      [this.state.nextArtistId]: true
    },
    panels: {
      [newPanel.id]: this.props.panel.orderNum + 1
    }
  }, { merge: true })

  console.log(`created new panel with an artist of ${this.state.nextArtistId} and a panel id of ${newPanel.id} for the drawing ${this.props.drawing.id}`)
  //debugger
  return window.location.href = `/wips`
}

handleSubmit = (e) => {
  e.preventDefault()
  this.createAndPassPanel()
}

render(){
  console.log(this.state.artistSelected)
    return (
        <div>
            <br />
            <h3>Pass Along Your Panel to the Next Artist</h3>
            <br />
            <form name="pass-your-panel" onSubmit={this.handleSubmit}>
                <div className="users-select">
                    <select  onChange={this.handleChange} name="nextArtist">
                    <option value="" selected disabled hidden>Select A User From Below</option>
                        <Map from={ db.collection('users')}
                            Loading={() => 'Loading...'}
                            Render={Options}
                            Empty={() => <select>You don't have any friends...</select>}/>
                    </select>
                </div>
                <br />
                { this.state.artistSelected ? <Bttn className="btn btn-success" type="submit" value="pass your panel" /> :
              <button type="button" disabled>Please choose the next artist!</button>
              }
            </form>
        </div>
    )
}
}
export default withAuth(PassPanel)


const Options = (props) => {
    console.log("this option has a value of: ", props.id)
    return <option key={props.id} value={props.id}>{props.username}</option>
  }