import React, { Component } from "react"
import { Link } from "react-router-dom"
import firebase from 'firebase'
import db from '../db/db_config'


export default class Profile extends Component {

  constructor() {
    super()
    this.state = {
      user: [],
      users:[{
        id:'',
        name:''
      }],
      profileImages: [

        'https://artofcollage.files.wordpress.com/2013/09/nikkal-exquisite-corpse-e1378737704164.jpg',

        'http://www.tate.org.uk/art/images/work/P/P78/P78455_9.jpg',

        'https://i.pinimg.com/originals/de/1e/8a/de1e8ab6635a10448dc4f675b4b35e07.jpg',

        'https://stefanpoag.files.wordpress.com/2015/09/tryffyd.jpg',

        'http://jackwitcomb-experimentalstorytelling.weebly.com/uploads/1/4/0/9/14092804/5138755_orig.jpg?0'

      ]
    }
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({user})
      }
    })

    const usersRef = db.collection('users')
    let temp = []
      usersRef.get().then(snapshot => {
        snapshot.forEach((doc) => {
          temp.push({id:doc.id, name:doc.data().username})
          this.setState({users:temp})
        })
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  pickRandomProfile = () => {
    let profileImage = this.state.profileImages
    let length = this.state.profileImages.length
    let randomNum = Math.floor(Math.random() * Math.floor(length))
    return profileImage[randomNum]
  }

  render() {
    const user = this.state.user
    const pickRandomProfile = this.pickRandomProfile
    const profileImage = this.state.profileImages[1]
    const users = this.state.users

    return(

      <div className="profile-container">

        <h3>Your Profile</h3>
        <div className="profile-header">
          <div className="profile-picture">
            <img src={pickRandomProfile()} />
          </div>
          <div className="profile-info">
            <h5><strong>Name: </strong>{user.name}</h5>
            <h5><strong>Email: </strong>{user.email}</h5>
          </div>
        </div>

        <div className="profile-friends">
          <h3>Your Friends</h3>

        </div>

      </div>
    )
  }

}
