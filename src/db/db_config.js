const firebase = require("firebase");
require('./secrets')
// Required for side-effects
require("firebase/firestore");
//import registerServiceWorker from '../registerServiceWorker';

var config = {
  apiKey: 'AIzaSyD_Q0PDm-RFJY-nz4EmUEj0EXbkLRrEIIc',
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: 'exquisitecorpse-84ff1',
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID
}



firebase.initializeApp(config);
var db = firebase.firestore();

export default db;
