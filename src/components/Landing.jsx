import React, { Component } from "react"
import { BrowswerRouter as Router, Route } from 'react-router-dom'
import TextInput from "./TextInput.jsx"
import Bttn from "./Bttn.jsx"
import Auth from "./Auth.jsx"

export default class LoginSignup extends Component {

  constructor() {
    super()
    this.state = {
      signup: true,
      login: false
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(evt) {
    evt.preventDefault()
    this.setState({
      signup: !this.state.signup,
      login: this.state.signup
    })
  }

  render () {

    const handleClick = this.handleClick

    return(
      <div>
        <span>

          <Bttn value="Sign Up" onClick={handleClick} />
          <Bttn value="Log In" onClick={handleClick} />

          {/* make this a link
          <Bttn value="Sign Up with Google" />
          */}

        </span>
        <br/>
        <Auth className="BIGAUTH" signup={this.state.signup} />
      </div>
    )
  }
}
