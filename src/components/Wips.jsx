import React, { Component } from "react"
import db from '../db/db_config'
import Img from 'react-image'
import { Link } from "react-router-dom"
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
        console.log(doc.id)
        temp.push(panel)
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
    console.log(this.state.user)
    const incompletePanels = this.state.incompletePanels
    return(
      <div>
      <h2>in whips</h2>

      {
        incompletePanels && incompletePanels.map((panel, index) => { 
          console.log("here is  my panel!!!!", panel)
          
          return(
             <Link key={index} to={`/panels/${panel.id}`}>
                <Img src={panel.src} />
             </Link>
        )})
      }
      </div>
    )
  }
}
