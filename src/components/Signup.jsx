import React, { Component } from "react"
// import { Link } from "react-router-dom"
import { HashRouter as Router, Route } from 'react-router-dom'
import TextInput from "./TextInput.jsx"
import Bttn from "./Bttn.jsx"
import LoginSignup from "./LoginSignup.jsx"

export default class Signup extends Component {

  constructor() {
    super()
    this.state = {
      login: false
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(evt) {
    evt.preventDefault()
    this.setState({
      login: true
    })
  }

  render() {

    const handleClick = this.handleClick

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
                <h4>email: </h4><TextInput placeholder="email" />
                <h4>password: </h4><TextInput placeholder="password" />
                <h4>confirm password: </h4><TextInput placeholder="confirm password" />
                <Bttn value="Create Account" />

                <div>
                  <Bttn value="Go Back to Log In" onClick={handleClick} />
                </div>
              </div>
        }
      </div>

    )
  }
}
