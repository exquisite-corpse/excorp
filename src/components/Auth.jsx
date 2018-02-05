import React, { Component } from "react"
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { TextInput, Bttn, GoogleAuth } from "./index"
import firebase from 'firebase'
import db from '../db/db_config'

const allUsers = db.collection('users')
const emailProvider = new firebase.auth.EmailAuthProvider()


export default class Signup extends Component {

  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      username: ''
    }
    this.handleSignup = this.handleSignup.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.changeHandler = this.changeHandler.bind(this)
  }

  changeHandler(evt) {
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
      .then(() => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
      })
      .then(user => {
        console.log(firebase.auth().currentUser.uid)
        // fix this redirect
        window.location.href = "/gallery"
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.Message
        console.log(errorCode, errorMessage)
      })
  }

  handleSignup(evt) {
    evt.preventDefault()
    const email = evt.target.email.value
    const password = evt.target.password.value
    const username = evt.target.username.value
    console.log('username at su', username)
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((createdUser) => {
        return db.collection("users").doc(createdUser.uid).set({
          email: email,
          username: username
        })
      })
      .then(something => {
        // fix this redirect
        window.location.href = "/gallery"
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.Message
        console.log(errorCode, errorMessage)
      })
  }

  render() {
    let signUpTrueBool = this.props.signup

    return (

      <div>
        <br />

        <Bttn className="btn btn-success" type="submit" value={"signup/login with Google"} onClick={GoogleAuth} />

        <form name="signup-login-form" onSubmit={signUpTrueBool ? this.handleSignup : this.handleLogin}>
          <div className="authFields">
            <TextInput
              label="email: "
              name="email"
              type="text"
              value={this.state.email}
              onChange={this.changeHandler}
              placeholder="email"
            />
            {signUpTrueBool &&
              <TextInput
                label="username: "
                name="username"
                type="text"
                value={this.state.username}
                onChange={this.changeHandler}
                placeholder="username"
              />}

            <TextInput
              label="password: "
              name="password"
              type="text"
              value={this.state.password}
              onChange={this.changeHandler}
              placeholder="password"
            />
          </div>
          <br />
          <Bttn className="btn btn-success" type="submit" value={signUpTrueBool ? "Create Account" : "Log In"} />
        </form>
      </div>

    )
  }
}
