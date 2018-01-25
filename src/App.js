import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import LoginSignup from './components/LoginSignup.jsx';
import NavBar from './components/NavBar.jsx'

class App extends Component {
  render() {
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
