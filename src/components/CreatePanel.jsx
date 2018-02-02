import React, { Component } from "react";
import db from '../db/db_config';
import Bttn from './Bttn'
import {Redirect} from 'react-router-dom';
import firebase from 'firebase'

export default class CreatePanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      author:'',
      snippet: props.src,
      panelCreated: false,
      user: {},
      panelId: '',
      redirected: false,
      users:[{
        id:'',
        name:''
      }],
      authorId:''
    }
  }

  componentDidMount() {
    let temp = []
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({user})
      }
      const usersRef = db.collection('users')
      usersRef.get().then(snapshot => {

        snapshot.forEach((doc) => {
          temp.push({id:doc.id, name:doc.data().username})
          this.setState({users:temp})
        })
      })
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  handleChange = (e) => {
    e.preventDefault();
    const userRef = db.collection('users').doc(e.target.value)
    this.setState({author:userRef, authorId : e.target.value});
  }

    //    ****** CODE WHEN USERS IS ACCESSIBLE - add selected user(friend) id to this new panel ---
    //    ***** CODE WHEN USERS IS ACCESSIBLE - add this panel to selected user's(friend) panels collection


   handleSubmit = (e) => {
     e.preventDefault();
     const drwId = this.props.drawingId.path.split('/')[1]
     console.log("this.state.author: ", this.state.author)
    let postData = {
      author: this.state.author,
      completed:false,
      drawingId: this.props.drawingId,
      orderNum:this.props.orderNum +1,
      previousPanel: this.props.prevPanelId,
      src: ''
    }
    postData[`${drwId}`] = true
    const postRef = db.collection("panels").doc()
    this.setState({panelId: postRef.id})
    postRef.set(postData)
    console.log(postRef.id)
    .then(() => {
      console.log('sucsessfully written to db')
    })
    .catch((err) => console.log(err))

    // const drawingRef = db.collection("drawings").doc().collection('panels').doc(`${drwId}`)
    // drawingRef.set({panel:postRef})
    // .then(() => {
    //   console.log('sucsessfully written to db')
    //   this.setState({redirected: true})
    // })
    // .catch((err) => console.log(err))
    const authorId = this.state.authorId
    const orderNum = this.props.orderNum + 1
    console.log('order', orderNum)
    const panelId = postRef.id
    const drawingRef2 = db.collection("drawings").doc(`${drwId}`)
    drawingRef2.set({
      artists:{
      [authorId] : true
    },
    panels : {
      [`${panelId}`] : orderNum
    }

  }, {merge: true})
    .then(() => {
      console.log('sucsessfully written to db')
      this.setState({redirected: true})
    })
    .catch((err) => console.log(err))

   }
  render(){
    const redirected = this.state.redirected
    const users = this.state.users
    console.log(this.state.author)
    return(
      <div>
      <select
        // value={this.state.author}
        onChange={this.handleChange}
      >
      {
        users && users.map(user => <option value={user.id}>{user.name}</option>)
      }
      </select>
      <div>
      <Bttn value="Create New Panel" onClick ={this.handleSubmit}/>
      </div>
      {
        redirected &&
          <Redirect to={`/wips`} />
      }
      </div>
    )
  }
}
