const firebase = require("firebase")
require("firebase/firestore")
require("firebase/auth")


var config = {
  apiKey: 'AIzaSyD_Q0PDm-RFJY-nz4EmUEj0EXbkLRrEIIc',
  authDomain: 'exquisitecorpse-84ff1.firebaseapp.com',
  databaseURL: 'https://exquisitecorpse-84ff1.firebaseio.com',
  projectId: 'exquisitecorpse-84ff1',
  storageBucket: 'exquisitecorpse-84ff1.appspot.com',
  messagingSenderId: '349662282106'
}


firebase.initializeApp(config)
const db = firebase.firestore()

export default db
