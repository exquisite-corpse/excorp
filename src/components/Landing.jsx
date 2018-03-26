import React, { Component } from "react"
import { BrowswerRouter as Router, Route } from 'react-router-dom'
import {TextInput, Bttn, GoogleAuth, Auth} from './index'
import db from '../db/db_config'
import firebase from 'firebase'
import {withAuth} from 'fireview'
import { Button, ButtonToolbar} from 'react-bootstrap'

class LoginSignup extends Component {

  constructor() {
    super()
    this.state = {
      signup: false,
      login: true,
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
            <div id="logo">
              <img src="./ex-grave-logo.svg" />
            </div>
      <div id="landing">
        <div id="google-auth">
        <p>Sign Up or Log In with Google: </p>
          <Button
            className="btn btn-lg btn-primary btn-block"
            type="submit" value={"signup/login with Google"}
            onClick={GoogleAuth}>
              Google Verify
          </Button>
        </div>

        <div id="signinup">
          <div id="radioButtons">
            <div onClick={this.handleSignupClick} className="kbRadio" className={`auth${this.state.signup}`} id="radioLogin">
              login
            </div>
            <div onClick={this.handleLoginClick} className="kbRadio" className={`auth${this.state.login}`} id="radioSignup">
              signup
            </div>
          </div>
          <Auth className="Auth" signup={this.state.signup} />
        </div>
    </div>
        {/* Carousel */}
        <div id="myCarousel" className="carousel slide" data-ride="carousel">
          {/* <!-- Wrapper for slides --> */}
          <div  className="carousel-inner">
            <div className="item active">
              <img src="https://image.ibb.co/h2gXmH/12.png" />
            </div>

            <div className="item">
              <img src="https://image.ibb.co/iVRbDx/7.png" />
            </div>

            <div className="item">
              <img src="https://image.ibb.co/nj6yRH/8.png" />
            </div>

            <div className="item">
              <img src="https://image.ibb.co/d1x56H/10.png" />
            </div>

            <div className="item">
              <img src="https://image.ibb.co/dKTCmH/4.png" />
            </div>

            <div className="item">
              <img src="https://image.ibb.co/kitpYx/1.png" />
            </div>

            <div className="item">
              <img src="https://image.ibb.co/hmByRH/2.png" />
            </div>

            <div className="item">
              <img src="https://image.ibb.co/kdLgfc/5.png" />
            </div>

            <div className="item">
              <img src="https://image.ibb.co/dZ8pYx/3.png" />
            </div>

            <div className="item">
              <img src="https://image.ibb.co/krfQ6H/11.png" />
            </div>

            <div className="item">
              <img src="https://image.ibb.co/hhdpYx/6.png" />
            </div>

            <div className="item">
              <img src="https://image.ibb.co/nGj7Lc/9.png" />
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
