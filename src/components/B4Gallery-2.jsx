import React, { Component } from "react"
// import { Link } from "react-router-dom"
import { DwgItem, Bttn, TextInput } from "./index"
import firebase from 'firebase'
import db from '../db/db_config'
import {Map, withAuth} from 'fireview'

class Gallery extends Component {
// {_user: user} where does this get passed in as props? in constructor?
    constructor() {
        super()
        this.state = {
            panelSets:[],
            // user: {}
        }
        this.buildDwgItems = this.buildDwgItems.bind(this)
    }

    // componentDidMount() {
    //     this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
    //         if (user) {
    //             this.setState({ user })
    //             this.buildDwgItems()
    //         }
    //     })
    // }

    componentWillUnmount() {
        this.unsubscribe()
    }

    componentWillReceiveProps({_user: newUser}, {_user: oldUser}) {
      if (newUser !== oldUser)
        this.buildDwgItems()
    }

    buildDwgItems() {
      const allDrawings = db.collection('drawings')
      const allPanels = db.collection('panels')
      let userId = this.state.user.uid

      allDrawings.where(`artists.${userId}`, '==', true).where('completed','==', true)
        .get()
        .then(snapshot => {
            snapshot.forEach(async drawing => {
              const panelSets = await Promise.all(
                Object.keys(drawing.panels)
                  .map(id => allPanels
                        .get(id)
                        .then(snap => snap.data())
                        .then(_ => _.src))
              )
              this.setState({panelSets})
              //   allPanels.where(`${drawing.id}`, '==', true)
              //     .get()
              //     .then(foundPanels =>{
              //       console.log(foundPanels)
              //       if (foundPanels) {
              //       const panelProps=[]
              //       foundPanels.forEach( panel => {
              //         panelProps.push(panel.data().src)
              //       })
              //       this.setState({panelSets: [...this.state.panelSets, panelProps] })
              //     }
              // })
            })
          })
        .catch(function (error) {
          console.error(error.code, error.message)
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


export default withAuth(Gallery)
