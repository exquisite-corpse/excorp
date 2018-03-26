import React, { Component } from "react"
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { TextInput, Bttn, GoogleAuth } from "./index"
import firebase from 'firebase'
import db from '../db/db_config'
import { Button, FormControl } from 'react-bootstrap'
import { FormGroup, form, ControlLabel, Col } from 'react-bootstrap'


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

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(createdUser => {
        console.log("Firetore auth created a new user with an id of: ", createdUser.uid)
        return db.collection("users").doc(`${createdUser.uid}`).set({
          email: email,
          username: username,
          id: createdUser.uid
        })
      })
      .then(newUserDoc => {
        console.log("what I'm returning after creating user", newUserDoc.id)
        window.location.href = "/gallery"
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.Message
        console.log(error)
      })
  }

  render() {
    let signUpTrueBool = this.props.signup

    return (
      <div id="auth-container">

          <div id="non-google-auth">
          <form
            name="signup-login-form"
            onSubmit={signUpTrueBool ? this.handleSignup : this.handleLogin}
          >

            <div className="signinup-form-item">
              <p>Email: </p>
              <FormControl
                label="email: "
                name="email"
                type="text"
                value={this.state.email}
                onChange={this.changeHandler}
                placeholder="email"
              />
            </div>
                {
                  signUpTrueBool &&
                  <div className="signinup-form-item">
                  <p>Username:</p>
                  <FormControl
                    label="username:"
                    name="username"
                    type="text"
                    value={this.state.username}
                    onChange={this.changeHandler}
                    placeholder="username"
                  />
                  </div>
                }
              <div className="signinup-form-item">
                <p>Password: </p>
                <FormControl
                  label="password:"
                  name="password"
                  type="password"
                  value={this.state.password}
                  secret={this.state.email}
                  onChange={this.changeHandler}
                  placeholder="password"
                />
              </div>

            <div id="signingup">
              <Button className="btn btn-primary btn-lg btn-block" type="submit" value={signUpTrueBool ? "Create Account" : "Log In"}>{signUpTrueBool ? "Create Account" : "Log In"}
              </Button>
            </div>
          </form>
          </div>
      </div>
    )
  }
}
