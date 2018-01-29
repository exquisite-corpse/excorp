import db from './db/db_config';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {DwgDetail, PanelDetail} from './components/index';
import Img from 'react-image';

class App extends Component {
constructor(){
  super();
  this.state ={
    src:''
  }
}
  render() {
    var docRef = db.collection('users').doc('D9OSQw6pMdjTxsEPQBDD');
    docRef.get().then((doc) => {
      if (doc.exists) {
        doc.data().photo.get()
        .then(photo => console.log(photo.data().src));
        //this.setState({src: doc.data().src})
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
    })
    return (
      <div className="App">
      <Router >
        <div>
      <Route exact path="/drawing" component={DwgDetail} />
      <Route exact path="/panel" component={PanelDetail} />
      </div>
      </Router>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Capstone</h1>
        </header>
        <Img src='https://firebasestorage.googleapis.com/v0/b/exquisitecorpse-84ff1.appspot.com/o/panel4.png?alt=media&token=df75821d-d32a-468b-b30b-2d9bc63eec2c'/>
      </div>
    );
  }
}

export default App;
