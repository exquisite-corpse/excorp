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
            panelCount: 3,
            createdAt: Date.now(), //works?
            completed: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
        this.startGame = this.startGame.bind(this)
    }

    startGame(){
        const allDrawings = db.collection('drawings')
        const allPanels = db.collection('panels')
        let currentUser
        //console.log("what is my query?", firebase.auth().currentUser.uid)
        db.collection('users').where('useruid', '==', `${firebase.auth().currentUser.uid}`).get()
        .then(user => {
            console.log("what is my user???")
            if (user.exists){
                console.log("what is this here?: ",user.data())
                currentUser = user.data()
            }else{
                console.log("fuck you")
            }
        })
        console.log(allDrawings, allPanels, currentUser )
        
        // when we create a new game
        // - create a new drawing in AllDrawings with fields (with set: category, panelNum, createdAt, completed:false, title)
        // - create a new collection within this drawing called artists with a reference to currentUser's uid to this drawing's artist collection
        // - grab this drawing's id
        //add this drawing as a ref currentUser's drawings collection
        
        // - create a new panel in AllPanels (set: completed to false, orderNum is 1, author is a ref to currentUser)
        //   - add a ref to this panel into this drawing's panels collection
        //   - add  a ref to this panel into currentUser's panels collection

    }
    changeHandler(evt) {
        //evt.preventDefault()
        const stObj = {}
        stObj[evt.target.name] = evt.target.value
        this.setState(stObj)
    }

    handleSubmit(evt) {
        evt.preventDefault()
        //   const email = evt.target.email.value
        //   const password = evt.target.password.value
        //   // create a password-based account

        //   firebase.auth().createUserWithEmailAndPassword(email, password)
        //   .catch(function(error) {
        //     console.log('in firebase auth')
        //     const errorCode = error.errorCode
        //     const errorMessage = error.message
        //     console.log(errorCode, errorMessage)
        //   })
        //   .then((createdUser) => {
        //     console.log("###########################: ", createdUser)
        //     db.collection("users").add({
        //       email: email,
        //       useruid: createdUser.uid
        //     })
        //   })
        //   .catch(function(error) {
        //     console.error("Error adding document: ", error)
        //   })
    }

    render() {

        console.log("this is the session???", firebase.auth.Auth.Persistence.SESSION, "what type?", typeof firebase.auth.Auth.Persistence.SESSION)
        //let signUpTrueBool = this.props.signup
        this.startGame()
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
                            onChange={this.handleSelection}
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
