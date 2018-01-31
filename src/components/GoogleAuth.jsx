import React, { Component } from "react"
import firebase from 'firebase'


const provider = new firebase.auth.GoogleAuthProvider()
provider.addScope('profile')
provider.addScope('email')

export default function GoogleAuth () {
  firebase.auth().signInWithRedirect(provider)
  // Then, you can also retrieve the Google provider's OAuth token by calling getRedirectResult when your page loads:
  firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken;
      // ...
    }
    // The signed-in user info.
    const user = result.user
  })
  .catch(function(error) {
    // Handle Errors here.
    const errorCode = error.code
    const errorMessage = error.message
    // The email of the user's account used.
    const email = error.email
    // The firebase.auth.AuthCredential type that was used.
    const credential = error.credential
  })
}
