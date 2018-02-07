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
      user:{},
      requested: false,
      currentUser: {
        id: '',
        username: ''
      }
    }
  }
  componentDidMount(){
    const userId = this.props.match.params.userId;
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
          this.setState({currentUser: user})
      }

    db.collection('users').doc(userId).get()
    .then(doc => {
       this.setState({user: doc.data()})
    })

    db.collection('users').doc(userId).collection('requests').where("id", "==", user.uid)
     .get()
     .then(querySnapshot => {
      querySnapshot.forEach(doc => {
          //console.log('aaa', doc.id, " => ", doc.data());
          if(doc.exists)
          this.setState({requested: true})
      });
     })
     .catch(function(error) {
      console.log("Error getting documents: ", error);
     });
    })
   }

  handleClick = () => {
    const userId = this.props.match.params.userId;
    const currentUserId = this.state.currentUser.uid;
    db.collection('users').doc(currentUserId).get()
     .then(doc => {
       console.log('aaa', doc.data())
       this.setState({currentUser: {
         id: currentUserId,
         username: doc.data().username
       }})
       return this.state.currentUser
     })
     .then((currentUser) => {
       console.log(currentUser)
      let requestRef = db.collection('users').doc(userId).collection('requests').doc()
      requestRef.set({
        requestId: requestRef.id,
        id: currentUserId,
        username: currentUser.username
      })
       this.setState({requested: true})

     })

  }

  render(){
    const user = this.state.user
    const requested = this.state.requested
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

    <section>
   <h4 className="text-muted"></h4>
   <h4>
   {requested
      ? <span className="glyphicon glyphicon-plus"> Requested</span>
      : <button onClick ={this.handleClick} className="btn btn-primary btn-block">
        <span className="glyphicon glyphicon-plus"></span> follow
      </button>}
   </h4>
   </section>
   </div>
    )
  }

}
