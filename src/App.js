import db from './db/db_config';
import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import LoginSignup from './components/LoginSignup.jsx';
import NavBar from './components/NavBar.jsx'


class App extends Component {

  render() {
    db.collection("kat").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`);
      });
  });
    return (
      <div className="App">
        <h1>Exquisite Corpse</h1>
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Capstone</h1>
        </header> */}
        <LoginSignup />
        <NavBar />
      </div>
    );
  }
}

export default App;
