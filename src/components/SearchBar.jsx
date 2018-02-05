"use strict";
import React, { Component } from "react"
import { Link } from "react-router-dom"
import db from '../db/db_config';
import firebase from 'firebase'
// import {SOMECOMPONENT} from "./index.jsx"

export default class SearchBar extends Component{
  constructor(props){
    super(props)
    this.state ={
      users:[{
        id:'',
        userName:''
      }],
      inputValue:'',
      currentUser:''
    }
  }

  componentDidMount(){
    let temp =[]
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection('users').doc(user.uid).get()
        .then(doc => {
          this.setState({currentUser: doc.data()})
      })
      }
    const userRef = db.collection('users')
    userRef.get().then((users) => {
      users.forEach(user => {
        temp.push({id: user.id, userName: user.data().username})
        this.setState({users: temp})
      })
    })
  })
  }

  handleChange = (e) => {
    this.setState({inputValue:e.target.value});
  }

  render(){
    const users = this.state.users
    const filteredUsers = users.filter(user => user.userName && user.userName.match(this.state.inputValue)).filter(user => user.userName && !user.userName.match(this.state.currentUser.username))
    console.log(this.state.currentUser)
    return(
      <div>
      <h3>Users</h3>
      <form className="form-group" style={{marginTop: '20px'}}>
        <input
          className="form-control"
          placeholder="Enter a name"
          onChange={this.handleChange}
        />
     </form>
       <div className="list-group">
        {
          filteredUsers.map(user => {
            return (
              <div className="list-group-item" key={user.id}>
                <Link to={`/users/${user.id}`}>{ user.userName }</Link>
              </div>
            );
          })
        }
      </div>
    </div>
    )
  }
}
