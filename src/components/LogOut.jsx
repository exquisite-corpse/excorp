import React, { Component } from "react"

import firebase from 'firebase'

export default function SignOut () {

  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
    console.log("an error happened inside of SignOut")
  })

  return(
      <div>
      <br/>
        <p>You have been signed out! Ok byeeee!</p>
      </div>
    )

}
