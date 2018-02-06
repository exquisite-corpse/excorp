import React from "react"
import firebase from 'firebase'

export default function SignOut () {

  firebase.auth().signOut()
   .then(() => {
      window.setTimeout(()=>{
        // fix this redirect?
        window.location.href = "/"
      }, 1500)
    })
   .catch(error => {
        const errorCode = error.code
        const errorMessage = error.Message
        console.log(errorCode, errorMessage)
    })

  return(
      <div>
        <p>You have been signed out! Ok byeeee!</p>
      </div>
    )

}
