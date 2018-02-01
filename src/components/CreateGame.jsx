// "use strict";
import React, { Component } from "react"
import { Bttn, TextInput } from "./index"
import firebase from 'firebase'
// import { Link } from "react-router-dom"
// import {SOMECOMPONENT} from "./index.jsx"
import db from '../db/db_config'
// const allDrawings = db.collection('drawings')
// firebase.auth().currentUser.uid


// when we create a new game
// - create a new drawing in AllDrawings with fields (with set: category, panelNum, createdAt, completed:false, title)
// - create a new collection within this drawing called artists with a reference to currentUser's uid to this drawing's artist collection
// - grab this drawing's id
//add this drawing as a ref currentUser's drawings collection

// - create a new panel in AllPanels (set: completed to false, orderNum is 1, author is a ref to currentUser)
//   - add a ref to this panel into this drawing's panels collection
//   - add  a ref to this panel into currentUser's panels collection

export default class CreateGame extends Component {

    constructor() {
        super()
        this.state = {
            title: "",
            category: "",
            user: {}
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
        this.startGame = this.startGame.bind(this)
    }
    componentDidMount() {
        // db.collection('users').doc('D1Dwr8o9ZmucTfCRWg0f').get()
        // .then((mrbear) => console.log("mr bear sut", mrbear.data()))
        this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ user })
            }

        })
    }
    componentWillUnmount() {
        this.unsubscribe()
    }

    startGame() {
        console.log(this.state)
        const allDrawings = db.collection('drawings')
        const allPanels = db.collection('panels')
        const userDocRef = db.collection('users').doc(this.state.user.uid)
        let userId = this.state.user.uid
        let drawingId
        let drawingDocRef
        const setObj = {
            panelCount: 3,
            createdAt: Date.now(), //this does NOT work
            completed: false,
            category: this.state.category,
            title: this.state.title,
        }
        //create a new drawing with the above obj as its fields
        allDrawings.add(setObj)
            .then(docRef => {
                drawingDocRef = docRef
                drawingId = docRef.id
                //console.log(docRef.id)
                //add this drawing as a ref currentUser's drawings collection
                console.log()
                userDocRef.collection('mydwgs').add({ "drawingRef": drawingDocRef })
            })
            .then(() => {
                // - create a new collection within this drawing called artists with a reference to currentUser's uid to this drawing's artist collection
                drawingDocRef.collection('artists').add({ 'artistRef': userDocRef })
            })
            .then(() => {
                let postData = {
                    author: userDocRef,
                    completed: false,
                    drawingId: drawingDocRef,
                    orderNum: 1,
                    src: ''
                }

                // - create a new panel in AllPanels (set: completed to false, orderNum is 1, author is a ref to currentUser)
                allPanels.add(postData)
                    .then(panelRef => {
                        //   - add a ref to this panel into this drawing's panels collection
                        drawingDocRef.collection('panels').add({ 'panel': panelRef })
                        return panelRef
                    })
                    .then(panelRef => {

                        //   - add  a ref to this panel into currentUser's panels collection
                        userDocRef.collection('panels').add({ 'panel': panelRef })
                        return panelRef
                    })
                    .then((panelRef) => {
                        window.location.href = `/panels/${panelRef.id}`
                    })
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });


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
