import React, { Component } from "react"
import { BrowswerRouter as Router, Route } from 'react-router-dom'
import TextInput from "./TextInput.jsx"
import Bttn from "./Bttn.jsx"
import Auth from "./Auth.jsx"
// import db from '../db/db_config'
// import firebase from 'firebase'

export default class LoginSignup extends Component {

  constructor() {
    super()
    this.state = {
      signup: false,
      login: true
    }
    this.handleSignupClick = this.handleSignupClick.bind(this)
    this.handleLoginClick = this.handleLoginClick.bind(this)
  }

  handleSignupClick(evt) {
    evt.preventDefault()
    this.setState({
      signup: true,
      login: false
    })
  }
  handleLoginClick(evt) {
    evt.preventDefault()
    this.setState({
      signup: false,
      login: true
    })
  }

  render () {
    return(
      <div>
        <span>
          <Bttn value="Sign Up" onClick={this.handleSignupClick} />
          <Bttn value="Log In" onClick={this.handleLoginClick} />
        </span>
        <br/>
        <Auth className="Auth" signup={this.state.signup} />
      </div>
    )
  }
}
