import React, { Component } from "react"
import { Bttn, TextInput } from "./index"
import firebase from 'firebase'
import db from '../db/db_config'
import {withAuth} from 'fireview'

// import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

// when we create a new game
// - create a new drawing in AllDrawings with fields (with set: category, panelNum, createdAt, completed:false, title)
// - create a new collection within this drawing called artists with a reference to currentUser's uid to this drawing's artist collection
// - grab this drawing's id
//add this drawing as a ref currentUser's drawings collection

// - create a new panel in AllPanels (set: completed to false, orderNum is 1, author is a ref to currentUser)
//   - add a ref to this panel into this drawing's panels collection
//   - add  a ref to this panel into currentUser's panels collection

class CreateGame extends Component {
    constructor() {
        super()
        this.state = {
            title: "",
            category: "",
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
        this.startGame = this.startGame.bind(this)
    }

    async startGame() {
        const {_user: user} = this.props
        if (!user) return alert('must be logged in')
        console.log(this.state)
        const allDrawings = db.collection('drawings')
        const allPanels = db.collection('panels')
        const userDocRef = db.collection('users').doc(user.uid)
        let userId = user.uid
        let drawingId
        let drawingDocRef

        const panel = await allPanels.add({
            author: user.uid,
            completed: false,
            src: '',
        })

        const drawing = await allDrawings.add({
            panelCount: 3,
            createdAt: Date.now(), //this is a unix timestamp
            completed: false,
            category: this.state.category,
            title: this.state.title,
            artists: {
                [userId]: true
            },
            panels: {
                [panel.id]: 1
            }
        })
        console.log('created drawing', drawing.id)


        // //create a new drawing with the above obj as its fields
        // allDrawings.add(setObj)
        //     .then(docRef => {
        //         drawingDocRef = docRef
        //         drawingId = docRef.id
        //         //add this drawing as a ref currentUser's drawings collection
        //         userDocRef.collection('mydwgs').add({ "drawingRef": drawingDocRef })
        //     })
        //     .then(() => {
        //         // - create a new collection within this drawing called artists with a reference to currentUser's uid to this drawing's artist collection
        //         drawingDocRef.collection('artists').add({ 'artistRef': userDocRef })
        //     })
        //     .then(() => {
        //         let postData = {
        //             author: userDocRef,
        //             completed: false,
        //             drawingId: drawingDocRef,
        //             orderNum: 1,
        //             src: ''
        //         }
        //         postData[`${drawingId}`] = true
        //         // - create a new panel in AllPanels (set: completed to false, orderNum is 1, author is a ref to currentUser)
        //        return allPanels.add(postData)
        //     })
        //     .then(panelRef => {
        //         //   - add a ref to this panel into this drawing's panels collection
        //         drawingDocRef.collection('panels').add({ 'panel': panelRef })
        //         return panelRef
        //     })
        //     .then(panelRef => {
        //         //   - add  a ref to this panel into currentUser's panels collection
        //         return userDocRef.collection('panels').add({ 'panel': panelRef })
        //     })
        //     .then(() => {
        //         return window.location.href = "/wips"
        //      })
        //     .catch(error => {
        //         const errorCode = error.code
        //         const errorMessage = error.Message
        //         console.log(errorCode, errorMessage)
        //     })
    }

    changeHandler(evt) {
        const stObj = {}
        stObj[evt.target.name] = evt.target.value
        this.setState(stObj)
    }

    handleSubmit(evt) {
        evt.preventDefault()
        this.startGame()
    }

    render() {
        return (
            <div>
                <br />
                <h3>Create a New Game</h3>
                <br />
                <form name="create-new-game" onSubmit={this.handleSubmit}>

                    <div className="gameFields">
                        <TextInput
                            label="title: "
                            name="title"
                            type="text"
                            value={this.state.title}
                            onChange={this.changeHandler}
                            placeholder="title"
                        />

                        <select
                            id="category-select"
                            name="category"
                            onChange={this.changeHandler}
                        >
                            <option value="animal">Animal</option>
                            <option value="nature">Nature</option>
                            <option value="monster">Monster</option>
                        </select>
                    </div>
                    <br />
                    <Bttn className="btn btn-success" type="submit" value="make a new game" />
                </form>
            </div>

        )
    }

}

export default withAuth(CreateGame)
