"use strict";
import React, { Component } from "react"
import { Link } from "react-router-dom"
import db from '../db/db_config';
import Bttn from './Bttn'
import {Panel, Drawing, sortedPanelIds} from './Gallery'
import firebase from 'firebase'
import { Map, withAuth } from 'fireview'
const allPanels = db.collection('panels')
const allDrawings = db.collection('drawings')

class FriendsProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        id: '',
        username: '',
        email: ''
      },
      friends:[],
      profileImages: [

        `https://artofcollage.files.wordpress.com/2013/09/nikkal-exquisite-corpse-e1378737704164.jpg`,

        `http://www.tate.org.uk/art/images/work/P/P78/P78455_9.jpg`,

        `https://i.pinimg.com/originals/de/1e/8a/de1e8ab6635a10448dc4f675b4b35e07.jpg`,

        `https://stefanpoag.files.wordpress.com/2015/09/tryffyd.jpg`,

        `http://jackwitcomb-experimentalstorytelling.weebly.com/uploads/1/4/0/9/14092804/5138755_orig.jpg?0`

      ],
      currentUserId: ''
    }
  }

  componentDidMount() {
    const userId = this.props.match.params.userId;
    let temp = [];
    let tempFriends = []
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('user', user.uid)
        this.setState({currentUserId: user.uid})

        db.collection('users').doc(userId).get()
          .then(doc => {
            console.log('data', doc.data().username)
            this.setState({
              user: {
                id: userId,
                username: doc.data().username,
                email: doc.data().email
              }
            })
          })
          .then(() => {
            db.collection('users').doc(userId).collection('friends')
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

  render() {
    const user = this.state.user
    const requests = this.state.requests
    const friends = this.state.friends
    const pickRandomProfile = this.pickRandomProfile
    const currentUserId = this.state.currentUserId
    // console.log(user)
    return (

      <div id="friends-container-profile" className="row justify-content-center">


      <div className="profile-header" className="col-xs-4" >
        <div className="profile-picture" >
            <img src={pickRandomProfile()} />
        </div>
        <div className="profile-info">
            <h5><strong>Name: </strong>{user.username}</h5>
            <h5><strong>Email: </strong>{user.email}</h5>
          </div>
        </div>

        <div  className="col-xs-4" >
          {friends &&
            <h5>
              <p className="friendReqs">Your Friend's Friends:</p>
              <div className="list-group" >
                {
                  friends.map(friend => {
                    if(friend.id == currentUserId)
                    return (
                            null
                      // <div className="list-group-item" key={friend.id}>
                      //   <Link to={"/profile"}>{friend.username}</Link>
                      // </div>
                    )
                    else
                    return (
                      <div className="list-group-item"  key={friend.id}>
                        <Link to={`/users/${friend.id}`}>{friend.username}</Link>
                      </div>

                    );
                  })
                }
              </div>
            </h5>}
        </div>
       { user.id &&  <div>
      <h1 id="allmy-header">{`All ${user.username}'s Drawings:`}</h1>

      <Map from={allDrawings.where('completed', '==', true).where(`artists.${user.id}`, '==', true)}
        Render={Drawing}
        Empty={() => <div id="you-dont-have-gallery">
        <h3 >{`Your friend ${user.username} doesn't have any finished drawings...`}</h3>
        <Link to={`/new`}> {`Click here to start a new game so you can send it to ${user.username}`}</Link>
      </div>} />


    </div>}
      </div>
    )
  }

}


export default withAuth(FriendsProfile)
