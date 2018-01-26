import db from './db/db_config';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


class App extends Component {

  render() {
    var docRef = db.collection("saraNest").doc("sara1")
    docRef.get().then(function(doc) {
      if (doc.exists) {
          console.log("Document data:", doc.data().toy_ref.path);
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Capstone</h1>
        </header>
      </div>
    );
  }
}

export default App;
