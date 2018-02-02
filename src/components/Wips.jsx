import React, { Component } from "react"
import db from '../db/db_config'
import Img from 'react-image'
import { Link, Redirect } from "react-router-dom"
import firebase from 'firebase'
// import {SOMECOMPONENT} from "./index.jsx"

// all panels completed false with my user id

// panels
// - search all panels
//   - where: completed: false
//   - where: author: current user id

// - map over resulted panels
//   - go to drawing ids for each
//   - print that drawing's title listed along thumbnail
//   - IF FEASIBLE: render preview of panel (from src)
//   - link to PanelDetail component

export default class Wips extends Component {
  constructor() {
    super()
    this.state = {
      incompletePanels: [{
        id: '',
        src:''
      }],
      user: {}
    }
  }
  componentDidMount() {
    let temp = []
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({user})
        console.log("checking this.state.user.uid", this.state.user.uid)
        const userRef = db.collection('users').doc(`${this.state.user.uid}`)
    let notCompletedPanelsRef = db.collection('panels').where('completed', '==', false).where('author', '==', userRef).get().then((snapshot) => {
      snapshot.forEach(doc => {
        let panel = doc.data()

        temp.push({src: panel.src, id: doc.id})
        this.setState({incompletePanels: temp})
      })
    })
    .catch(err => {
      console.log('error getting docs: ', err)

    })
      }
    })


  }

  componentWillUnmount() {
    this.unsubscribe()
  }
  render() {
    const incompletePanels = this.state.incompletePanels
    console.log(incompletePanels[0]);
    console.log(this.state.user)
    return(
      <div>

      {
        incompletePanels[0].id !== ''
        ? <div>
            <h2>Here are Your Beautiful Works In Progress (WIPs)</h2>
            <h3>Click on one to begin drawing</h3>
            <br />
            { incompletePanels && incompletePanels.map((panel, index) => {
              return (
              <Link key={index} to={`/panels/${panel.id}`}>
                {panel.src !== ''
                   ?<Img src={panel.src} />
                  : <h3> Go to your panel</h3>
                }
              </Link>
            )})}
          </div>
        : <div>
            <h2>You don't have any Works In Progress</h2>
            <Link to={`/new`}>Click here to Create a New Game
            </Link>
          </div>
      }
      </div>
    )
  }
}
