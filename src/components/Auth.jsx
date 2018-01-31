import React, { Component } from "react"
import { BrowserRouter as Router, Route } from 'react-router-dom'
import {TextInput, Bttn, GoogleAuth} from "./index"
import firebase from 'firebase'
import db from '../db/db_config'


// const provider = new firebase.auth.GoogleAuthProvider()
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly')



const allUsers = db.collection('users')
const emailProvider = new firebase.auth.EmailAuthProvider()


export default class Signup extends Component {

  constructor() {
    super()
    this.state = {
      email: '',
      password: ''
    }
    this.handleSignup = this.handleSignup.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.changeHandler = this.changeHandler.bind(this)
  }


  changeHandler (evt) {
    evt.preventDefault
    const stObj = {}
    stObj[evt.target.name] = evt.target.value
    this.setState(stObj)
  }
  handleLogin(evt) {
    evt.preventDefault()
    const email = evt.target.email.value
    const password = evt.target.password.value
    firebase.auth().signInWithEmailAndPassword(email, password)
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then( () => {
      return  firebase.auth().signInWithEmailAndPassword(email, password)
      // firebase.firestore().collection('users').doc(currentUser.uid).set(currentUser)
      .catch(function(error) {
        // Handle Errors here.
        console.log("I'm also getting in here")
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      })
      .then(user =>
        {
          console.log(firebase.auth().currentUser.uid)
          //window.location.href = "/gallery"
        })
    })
    .catch(err => {
      console.log("bad err inside handle login")
      const errorCode = err.code
      const errorMessage = errorMessage
    })


  }
  handleSignup(evt) {
    evt.preventDefault()
    const email = evt.target.email.value
    const password = evt.target.password.value
    // create a password-based account

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      console.log('in firebase auth')
      const errorCode = error.errorCode
      const errorMessage = error.message
      console.log(errorCode, errorMessage)
    })
    .then((createdUser) => {
      //firebase.firestore().collection('users').doc(currentUser.uid).set(currentUser)
      db.collection("users").add({
        email: email,
        useruid: createdUser.uid
      }).then(something => {
        console.log(this.history)
        window.location.href = "/gallery"
      })
    })
    .catch(function(error) {
      console.error("Error adding document: ", error)
    })
  }

  render() {
    let signUpTrueBool = this.props.signup

    return(

        <div>
        <br/>

          <Bttn className="btn btn-success" type="submit" value={ "signup/login with Google"} onClick={GoogleAuth} />

          <h3>{ signUpTrueBool?  "Sign Up" : "Log In" }</h3>
          <br/>
              <form name="signup-login-form" onSubmit={ signUpTrueBool ? this.handleSignup : this.handleLogin}>

          <div className="authFields">
                  <TextInput
                    label= "email: "
                    name="email"
                    type="text"
                    value={this.state.email}
                    onChange={this.changeHandler}
                    placeholder="email"
                  />

                  <TextInput
                    label= "password: "
                    name="password"
                    type="text"
                    value={this.state.password}
                    onChange={this.changeHandler}
                    placeholder="password"
                  />
          </div>
                  <br/>
                  <Bttn className="btn btn-success" type="submit" value={ signUpTrueBool ? "Create Account" : "Log In"} />
            </form>
      </div>

    )
}

}






// evt.preventDefault()
//     console.log("i'm doing shit")
//     const email = evt.target.email.value
//     const password = evt.target.password.value
//     firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
//     .then( () => {
//       return  firebase.auth().signInWithEmailAndPassword(email, password)
//       // firebase.firestore().collection('users').doc(currentUser.uid).set(currentUser)
//       .catch(function(error) {
//         // Handle Errors here.
//         console.log("I'm also getting in here")
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // ...
//       })
//       .then(user => 
//         {
//           console.log(firebase.auth().currentUser.uid)
//           //window.location.href = "/gallery"
//         })
//     })
//     .catch(err => { 
//       console.log("bad err inside handle login")
//       const errorCode = err.code
//       const errorMessage = errorMessage
//     })