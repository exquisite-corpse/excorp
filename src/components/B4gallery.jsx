import React, { Component } from "react"
// import { Link } from "react-router-dom"
import { DwgItem, Bttn, TextInput } from "./index"
import firebase from 'firebase'
import db from '../db/db_config'

export default class Gallery extends Component {

    constructor() {
        super()
        this.state = {
            panelSets:[],
            user: {}
        }
        this.buildDwgItems = this.buildDwgItems.bind(this)
    }

    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ user })
                this.buildDwgItems()
            }
        })
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    buildDwgItems() {
      const allDrawings = db.collection('drawings')
      const allPanels = db.collection('panels')
      let userId = this.state.user.uid

      allDrawings.where(`${userId}`, '==', true).where('completed','==', true)
        .get()
        .then(snapshot => {
            snapshot.forEach( drawing => {
            allPanels.where(`${drawing.id}`, '==', true)
            .get()
            .then(foundPanels =>{
              console.log(foundPanels)
              if (foundPanels) {
              const panelProps=[]
              foundPanels.forEach( panel => {
                panelProps.push(panel.data().src)
              })
              this.setState({panelSets: [...this.state.panelSets, panelProps] })
            }
              })
            })
          })
        .catch(function (error) {
          console.error("Terrible error occured whilst looking for your drawings!", error);
        })
    }

    render() {
      return (
          <div>
            <h3>All My Finished Drawings</h3>
                {
                  this.state.panelSets && this.state.panelSets.map( (set, idx) => {
                      return <DwgItem key={idx} panels={set} />
                  })
                }
            </div>
      )
  }

}


