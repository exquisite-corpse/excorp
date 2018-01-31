import React, { Component } from "react"
import db from '../db/db_config'
import Img from 'react-image'
// import { Link } from "react-router-dom"
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
      incompletePanels: []
    }
  }
  componentDidMount() {
    let array = [1,2,3]
    let temp = []
    const userRef = db.collection('users').doc('CQ19BlLP178AUUwZSiTg')
    let notCompletedPanelsRef = db.collection('panels').where('completed', '==', false).where('author', '==', userRef).get().then((snapshot) => {
      snapshot.forEach(doc => {
        let src = doc.data().src
        temp.push(src)
        console.log('here src', temp)
        this.setState({incompletePanels: temp})
      })
    })
    .catch(err => {
      console.log('error getting docs: ', err)

    })
    // console.log('in mount', temp)

    // console.log(temp[doc.id])
  }

  render() {
    this.state.incompletePanels && console.log('on state: ', this.state.incompletePanels)
    const incompletePanels = this.state.incompletePanels
    return(
      <div>
      <h2>in whips</h2>
      {
        incompletePanels && incompletePanels.map(src => {
          // <h2>{panel}</h2>
          // console.log(panel)
          src && <Img src={src} />
        })
      }
      </div>
    )
  }
}
