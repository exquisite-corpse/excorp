const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
//import registerServiceWorker from '../registerServiceWorker';

/*process.env.APIKEY =  “AIzaSyD_Q0PDm-RFJY-nz4EmUEj0EXbkLRrEIIc”;
process.env.AUTHDOMAIN =  “exquisitecorpse-84ff1.firebaseapp.com”;
process.env.DATABASEURL =  “https://exquisitecorpse-84ff1.firebaseio.com“;
process.env.PROJECTID = “exquisitecorpse-84ff1”;
process.env.STORAGEBUCKET = “exquisitecorpse-84ff1.appspot.com”;
process.env.MESSAGINGSENDERID = “349662282106”;*/

var config = {
  apiKey: 'AIzaSyD_Q0PDm-RFJY-nz4EmUEj0EXbkLRrEIIc',
  authDomain: 'exquisitecorpse-84ff1.firebaseapp.com',
  databaseURL: 'https://exquisitecorpse-84ff1.firebaseio.com',
  projectId: 'exquisitecorpse-84ff1',
  storageBucket: 'exquisitecorpse-84ff1.appspot.com',
  messagingSenderId: '349662282106'
}



firebase.initializeApp(config);
var db = firebase.firestore();

export default db;
