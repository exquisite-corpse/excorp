"use strict";
import React, { Component } from "react"
import { Link } from "react-router-dom"
import db from '../db/db_config';
import firebase from 'firebase'
import Promise from 'bluebird'
// import {SOMECOMPONENT} from "./index.jsx"

export default class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [{
        id: '',
        userName: ''
      }],
      inputValue: '',
      currentUser: '',
      isFriend: false
    }
  }

  componentDidMount() {
    let temp = [];
    let promises = []
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection('users').doc(user.uid).get()
          .then(doc => {
            this.setState({ currentUser: doc.data() })
          })
      }
      const userRef = db.collection('users')
      userRef.get().then((users) => {
        users.forEach(user => {
          temp.push({ id: user.id, userName: user.data().username, isFriend: false })
          //this.setState({ users: temp })
          return temp;
        })
      })
        .then(() => {
          temp.map((user, index) => {
            console.log(this.state.currentUser)

            db.collection('users').doc(this.state.currentUser.id).collection('friends').where("id", "==", user.id)
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                  //console.log('aaa', doc.id, " => ", doc.data());
                  if (doc.exists)
                    temp[index].isFriend = true;
                });
              })
              .then(() => {
                this.setState({ users: temp })
              })
              .catch(function (error) {
                console.log("Error getting documents: ", error);
              });
          })
          console.log('temp', temp);

        })



    })
  }

  handleChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  render() {
    const users = this.state.users
    const isFriend = this.state.isFriend
    const filteredUsers = users.filter(user => user.userName && user.userName.match(this.state.inputValue)).filter(user => user.userName && !user.userName.match(this.state.currentUser.username))
    console.log(users)
    return (
      <div>
        <h3>Users</h3>
        <form className="form-group" style={{ marginTop: '20px' }}>
          <input
            className="form-control"
            placeholder="Enter a name"
            onChange={this.handleChange}
          />
        </form>
        <div className="list-group" id="search-friends">
          {
            filteredUsers.map(user => {
              console.log(user.isFriend)
              if (user.isFriend) {
                return (
                  <div className="list-group-item" key={user.id}>
                    <Link to={`/profiles/${user.id}`}>{user.userName}</Link>
                  </div>
                );
              }
              else {
                return (
                  <div className="list-group-item" key={user.id}>
                    <Link to={`/users/${user.id}`}>{user.userName}</Link>
                  </div>
                );
              }
            })
          }
        </div>
      </div>
    )
  }
}
