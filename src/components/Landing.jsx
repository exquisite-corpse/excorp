import React, { Component } from "react"
import { BrowswerRouter as Router, Route } from 'react-router-dom'
import {TextInput, Bttn, Auth} from './index'
import db from '../db/db_config'
import firebase from 'firebase'
import {withAuth} from 'fireview'
import { Button } from 'react-bootstrap'

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
      <div id="main-container-landing">
        <div id="signingup">
        <span>
          <div id="span-buttons">
          <Button id="button" value="Sign Up" onClick={this.handleSignupClick}>Sign Up</Button>
          <Button id="button" value="Log In" onClick={this.handleLoginClick}>Log In</Button>
          </div>
          <Auth className="Auth" signup={this.state.signup} />
        </span>

        </div>

        {/* Carousel */}
        <div id="myCarousel" className="carousel slide" data-ride="carousel">
          {/* <!-- Indicators --> */}
          <ol className="carousel-indicators">
            <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
            <li data-target="#myCarousel" data-slide-to="1"></li>
            <li data-target="#myCarousel" data-slide-to="2"></li>
          </ol>

          {/* <!-- Wrapper for slides --> */}
          <div  className="carousel-inner">
            <div className="item active">
              <img src="https://78.media.tumblr.com/e93e045188d10b71a20f9fb453e9df68/tumblr_p3qt7hSwIc1x55t66o1_500.png" />
            </div>

            <div className="item">
              <img src="https://78.media.tumblr.com/b41a8b4e2d62b76fe07e976d6af3ee20/tumblr_p3qx4sZoJc1x55t66o1_500.png" />
            </div>

            <div className="item">
              <img src="https://78.media.tumblr.com/b2bd4063d0b3a69eb0372cf66657a0df/tumblr_p3qtbsooVX1x55t66o1_540.png" />
            </div>

            <div className="item">
              <img src="https://78.media.tumblr.com/06deb1840f164980b3d1793a0046a040/tumblr_p3qtlfuarR1x55t66o1_500.png" />
            </div>

            <div className="item">
              <img src="https://78.media.tumblr.com/bf5e6a53de8eb888d9e2c61f31b2e475/tumblr_p3qx79jm9N1x55t66o1_500.png" />
            </div>

            <div className="item">
              <img src="https://78.media.tumblr.com/5a4ce01e570471c94f908e3c5f3b590e/tumblr_p3qx9sBGkK1x55t66o1_500.png" />
            </div>

          </div>

          {/* <!-- Left and right controls --> */}
          <a className="left carousel-control" href="#myCarousel" data-slide="prev">
            <span className="glyphicon glyphicon-chevron-left"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="right carousel-control" href="#myCarousel" data-slide="next">
            <span className="glyphicon glyphicon-chevron-right"></span>
            <span className="sr-only">Next</span>
          </a>
        </div>

      </div>
    )
  }
}

export default withAuth(LoginSignup)
