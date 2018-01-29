import React, { Component } from "react"
// import { Link } from "react-router-dom"
import { HashRouter as Router, Route } from 'react-router-dom'
import TextInput from "./TextInput.jsx"
import Bttn from "./Bttn.jsx"
import Signup from "./Signup.jsx"

export default class LoginSignup extends Component {

  constructor() {
    super()
    this.state = {
      signup: false
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(evt) {
    evt.preventDefault()
    this.setState({
      signup: true
    })
  }

  render () {

    const handleClick = this.handleClick

    return(
      <div>
        {
          (this.state.signup)
            ? <div>
                <Router>
                  <Route component={Signup} />
                </Router>
              </div>
            : <div className="login-container">
                <h4>email: </h4><TextInput placeholder="email" />
                <h4>password: </h4><TextInput placeholder="password" />
                <br />

                <Bttn value="Log In" />
                <br />

                {/* make this a link */}
                <Bttn value="Sign Up" onClick={handleClick} />
                <br />

                {/* make this a link */}
                <Bttn value="Sign Up with Google" />
              </div>
        }
      </div>

    )
  }
}
