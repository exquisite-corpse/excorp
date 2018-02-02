import React from 'react'
import firebase from 'firebase'
import db from '../db/db_config'

const provider = new firebase.auth.GoogleAuthProvider()
provider.addScope('profile')
provider.addScope('email')

const allUsers = db.collection('users')

window.auth = firebase.auth()

export default function GoogleAuth (evt) {
  evt.preventDefault()

  firebase.auth().signInWithRedirect(provider)
}


firebase.auth().getRedirectResult()
  .then(result => {
    if (result.credential) {
      const googleToken = result.credential.accessToken
      const user = result.user
      console.log('Logged in', user)
      db.collection("users").doc(user.uid).set({
        email: user.email,
        username: user.displayName,
        googleToken,
      }, {merge: true})
    }
  })
  .catch(function(error) {
    const errorCode = error.code
    const errorMessage = error.message
    const email = error.email
    const credential = error.credential
    console.log(errorCode, errorMessage)
    console.log(email, credential)
  })



// firebase.auth().onAuthStateChanged(user => {
//             if (user) {
//                 db.collection("users").doc(user.uid).set({
//                   email: user.email,
//                   username: "testy"
//                 })
//             }
//       })
