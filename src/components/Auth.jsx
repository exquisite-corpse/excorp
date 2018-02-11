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
      <div>
          <Button
            id="button"
            className="btn btn-success"
            type="submit" value={"signup/login with Google"}
            onClick={GoogleAuth}>Sign Up or Log In with Google
          </Button>

          <form
            name="signup-login-form"
            onSubmit={signUpTrueBool ? this.handleSignup : this.handleLogin}
          >

            <FormGroup controlId="formBasicText">
              <ControlLabel>Email: </ControlLabel>

                <FormControl
                  label="email: "
                  name="email"
                  type="text"
                  value={this.state.email}
                  onChange={this.changeHandler}
                  placeholder="email"
                  />

                {
                  signUpTrueBool &&
                  <div>
                  <ControlLabel>Username:</ControlLabel>
                    <FormControl
                      label="username: "
                      name="username"
                      type="text"
                      value={this.state.username}
                      onChange={this.changeHandler}
                      placeholder="username"
                    />
                  </div>
                }

                <ControlLabel>Password: </ControlLabel>
                    <FormControl
                      label="password: "
                      name="password"
                      type="password"
                      value={this.state.password}
                      secret={this.state.email}
                      onChange={this.changeHandler}
                      placeholder="password"
                    />
              </FormGroup>

            <div id="signingup">
              <Button id="button" className="btn btn-success" type="submit" value={signUpTrueBool ? "Create Account" : "Log In"}>{signUpTrueBool ? "Create Account" : "Log In"}
              </Button>
            </div>

          </form>
      </div>
    )
  }
}
