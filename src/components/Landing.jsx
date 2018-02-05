import React, { Component } from "react"
import { BrowswerRouter as Router, Route } from 'react-router-dom'
import {TextInput, Bttn, Auth} from './index'
import db from '../db/db_config'
import firebase from 'firebase'
import {withAuth} from 'fireview'

class LoginSignup extends Component {

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
    if (this.props._user){
    db.collection('users').doc(`${this.props._user.id}`).get()
    .then (user => {
      if (user) window.location.href = '/gallery'
    })
  }

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

export default withAuth(LoginSignup)