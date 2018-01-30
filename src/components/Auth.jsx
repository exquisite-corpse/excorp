import React, { Component } from "react"
import { BrowserRouter as Router, Route } from 'react-router-dom'
import TextInput from "./TextInput.jsx"
import Bttn from "./Bttn.jsx"
import firebase from 'firebase'

import db from '../db/db_config'
const allUsers = db.collection('users')

export default class Signup extends Component {

  constructor() {
    super()
    this.state = {
      email: '',
      password: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.changeHandler = this.changeHandler.bind(this)
  }


  changeHandler (evt) {
    evt.preventDefault
    const stObj = {}
    stObj[evt.target.name] = evt.target.value
    this.setState(stObj)
  }

  handleSubmit(evt) {
    // console.log("###########################HANDLE SUBMIT")
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
      console.log("###########################: ", createdUser)
      db.collection("users").add({
        email: email,
        useruid: createdUser.uid
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
          <h3>{ signUpTrueBool?  "Sign Up" : "Log In" }</h3>
          <br/>
              <form name="signup-login-form" onSubmit={this.handleSubmit}>

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
