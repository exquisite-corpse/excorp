import React, { Component } from "react"
// import { Link } from "react-router-dom"
import { HashRouter as Router, Route } from 'react-router-dom'
import TextInput from "./TextInput.jsx"
import Bttn from "./Bttn.jsx"
import LoginSignup from "./LoginSignup.jsx"
import firebase from 'firebase'

export default class Signup extends Component {

  constructor() {
    super()
    this.state = {
      login: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleClick(evt) {
    evt.preventDefault()
    this.setState({
      login: true,
      input: ''
    })
  }

  handleSubmit(evt) {
    evt.preventDefault()
    const email = evt.target.email.value
    const password = evt.target.password.value
    // create a password-based account
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      console.log('in firebase auth')
      var errorCode = error.errorCode
      var errorMessage = error.message
      console.log('error code: ', errorCode, 'error message: ', errorMessage)
    })

    // console log the user uid and pass that into the newly created user in firestore as the id

    // save users to Firebase db
    // firebase.auth().onAuthStateChanged(user => {
    //   if (user) {

    //     // if user state changes and user exists, check Firebase for user
    //     const userReference = db.ref(`users/${user.uid}`)
    //     userReference.once('value', snapshot => {
    //       if (!snapshot.val()) {
    //         // user doesn't exist, create user entry
    //         userReference.set({
    //           email: user.email,
    //           displayName: user.displayName
    //         })
    //       }
    //     })
    //   }
    // })

  }

  render() {

    const handleClick = this.handleClick
    let input = this.input
    return(
      <div>
        {
          (this.state.login)
            ? <div>
                <Router>
                  <Route component={LoginSignup} />
                </Router>
              </div>
            : <div className="sign-up-container">
                <h3>Create an Account</h3>
                <form name="sign-up-form" onSubmit={this.handleSubmit}>
                  <h4>email: </h4>
                    <TextInput
                      name="email"
                      type="text"
                      value={input}
                      // onChange={handleChange}
                      placeholder="email" />
                  <h4>password: </h4>
                    <TextInput
                      name="password"
                      type="text"
                      value={input}
                      // onChange={handleChange}
                      placeholder="password" />
                  {/* <h4>confirm password: </h4><TextInput placeholder="confirm password" /> */}
                  <Bttn type="submit" value="Create Account" />
                </form>
                <div>
                  <Bttn value="Go Back to Log In" onClick={handleClick} />
                </div>
              </div>
        }
      </div>

    )
  }
}
