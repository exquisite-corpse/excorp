const firebase = require("firebase")
require("firebase/firestore")
require("firebase/auth")


var config = {
  apiKey: "AIzaSyCzElnjQ1hAfRA9yQ6NiM6BtHy-gcOlS4g",
    authDomain: "exquisitegraveyard.firebaseapp.com",
    databaseURL: "https://exquisitegraveyard.firebaseio.com",
    projectId: "exquisitegraveyard",
    storageBucket: "exquisitegraveyard.appspot.com",
    messagingSenderId: "976218895180"
}


firebase.initializeApp(config)
const db = firebase.firestore()

export default db
