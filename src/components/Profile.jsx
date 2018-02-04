"use strict";
import React, { Component } from "react"
import { Link } from "react-router-dom"
import db from '../db/db_config';
import Bttn from './Bttn'
import firebase from 'firebase'
// import {SOMECOMPONENT} from "./index.jsx"

export default class PublicProfile extends Component{
  constructor(props){
    super(props)
    this.state = {
      user:{
        id:'',
        username:'',
        email:''
      },
      requests:[],
      friends: []
    }
  }
  componentDidMount(){
    let temp = [];
    let tempFriends = []
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('user', user.uid)
        db.collection('users').doc(user.uid).get()
        .then(doc => {
          console.log('data', doc.data().username)
          this.setState({user: {
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
               temp.push({requestId: request.data().requestId, id: request.data().id, username: request.data().username})
               this.setState({requests: temp})
              })
           })
        })
        .then(() => {
          db.collection('users').doc(user.uid).collection('friends')
           .get().then(friends => {
            friends.forEach(friend => {
              tempFriends.push({id: friend.data().id, username: friend.data().username})
               this.setState({friends: tempFriends})
              })
           })
        })
      }
  })
  }

  handleClick = (request) => {
    const userId = this.state.user.id;
    console.log('aaaa', request)
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

  render(){
    const user = this.state.user
    const requests = this.state.requests
    const friends = this.state.friends
    console.log(user)
    return(
      <div >
      <div>
        <h3>username: { user.username }</h3>
     </div>
     <div className="thumbnail">
       <h5>
          <span>mail: { user.email }</span>
       </h5>
     </div>
     <div className="thumbnail">
     { requests &&
       <h5>
          <span>Friend Requests</span>
          <div className="list-group">
          {
            requests.map(request => {
              return (
                <div className="list-group-item" key={request.id}>
                  <Link to={`/users/${request.id}`}>{ request.username }</Link>
                  <section>
                     <h4 className="text-muted"></h4>
                     <h4>
                       <button onClick ={() => this.handleClick(request)} className="btn btn-primary btn-block">
                        <span className="glyphicon glyphicon-plus"></span> Approve
                      </button>
                     </h4>
                   </section>
                </div>

              );
            })
          }
        </div>
       </h5>}
       { friends &&
       <h5>
          <span>Friends</span>
          <div className="list-group">
          {
            friends.map(friend => {
              return (
                <div className="list-group-item" key={friend.id}>
                  <Link to={`/users/${friend.id}`}>{ friend.username }</Link>
                </div>

              );
            })
          }
        </div>
       </h5>}
     </div>
   </div>
    )
  }

}
