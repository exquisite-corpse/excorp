"use strict";
import React, { Component } from "react"
import { Link } from "react-router-dom"
import db from '../db/db_config';
import Bttn from './Bttn'
import firebase from 'firebase'
// import {SOMECOMPONENT} from "./index.jsx"

export default class PublicProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        id: '',
        username: '',
        email: ''
      },
      requests: [],
      friends: [],
      profileImages: [

        `https://artofcollage.files.wordpress.com/2013/09/nikkal-exquisite-corpse-e1378737704164.jpg`,

        `http://www.tate.org.uk/art/images/work/P/P78/P78455_9.jpg`,

        `https://i.pinimg.com/originals/de/1e/8a/de1e8ab6635a10448dc4f675b4b35e07.jpg`,

        `https://stefanpoag.files.wordpress.com/2015/09/tryffyd.jpg`,

        `http://jackwitcomb-experimentalstorytelling.weebly.com/uploads/1/4/0/9/14092804/5138755_orig.jpg?0`

      ]
    }
  }

  componentDidMount() {
    let temp = [];
    let tempFriends = []
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('user', user.uid)
        db.collection('users').doc(user.uid).get()
          .then(doc => {
            console.log('data', doc.data().username)
            this.setState({
              user: {
                id: user.uid,
                username: doc.data().username,
                email: doc.data().email
              }
            })
          })
          .then(() => {
            db.collection('users').doc(user.uid).collection('requests')
              .get().then(requests => {
                requests.forEach(request => {
                  temp.push({ requestId: request.data().requestId, id: request.data().id, username: request.data().username })
                  this.setState({ requests: temp })
                })
              })
          })
          .then(() => {
            db.collection('users').doc(user.uid).collection('friends')
              .get().then(friends => {
                friends.forEach(friend => {
                  tempFriends.push({ id: friend.data().id, username: friend.data().username })
                  this.setState({ friends: tempFriends })
                })
              })
          })
      }
    })
  }

  pickRandomProfile = () => {
    let profileImage = this.state.profileImages
    let length = this.state.profileImages.length
    let randomNum = Math.floor(Math.random() * Math.floor(length))
    return profileImage[randomNum]
  }

  handleClick = (request) => {
    const userId = this.state.user.id;
    // console.log('aaaa', request)
    db.collection('users').doc(userId).collection('friends').add({
      id: request.id,
      username: request.username
    }).then(() => {
      db.collection('users').doc(userId).collection('requests').doc(request.requestId).delete()
    }).then(() => {
      db.collection('users').doc(request.id).collection('friends').add({
        id: userId,
        username: this.state.user.username
      })
      window.location.href = '/profile'
    })
  }

  handleDecline = (request) => {
    console.log('I am hereee', request)
    const userId = this.state.user.id;


      db.collection('users').doc(userId).collection('requests').doc(request.requestId).delete()
      .then(() => {
        window.location.href = '/profile'
      })


  }


  render() {
    const user = this.state.user
    const requests = this.state.requests
    const friends = this.state.friends
    const pickRandomProfile = this.pickRandomProfile
    //console.log(user)
    return (

      <div id="main-container-profile">

            <div className="profile-header-container" >
              <div className="profile-picture">
                <img src={pickRandomProfile()} />
              </div>
              <div className="profile-info">
                <h2>Name: {user.username}</h2>
                <h2>Email: {user.email}</h2>
              </div>
            </div>

      <div >
          {requests &&
            <div >

            <div className="profile-header">
              <h2 >Friend Requests:</h2>
            </div>

              <div >


                {
                  requests.map(request => {
                    return (


                      <div className="friendReqs" key={request.id}>
                        <Link  to={`/users/${request.id}`}>{`${request.username} would like to follow you:`}</Link>



                         <span >
                            <button onClick={() => this.handleClick(request)} className="btn btn-lg btn-primary aprvDecline">
                              <span className="glyphicon glyphicon-plus"></span> Approve
                            </button>

                            <button onClick={() => this.handleDecline(request)} className="btn btn-primary btn-danger aprvDecline">
                              <span className="glyphicon glyphicon-plus"></span> Decline
                            </button>
                          </span>

                      </div>
                    )
                  })
                }


              </div>
            </div>}
          {friends &&
            <div>
            <div className="profile-header">
              <h2>My Friends:</h2>
            </div>

              <div className="list-group">
                {
                  friends.map(friend => {
                    return (
                      <div className="list-group-item" key={friend.id}>
                        <Link to={`/profiles/${friend.id}`}>{friend.username}</Link>
                      </div>
                    )
                  })
                }
            </div>
            </div>
          }

          </div>
        </div>
        )
  }
}

