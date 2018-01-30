import db from './db/db_config'
import React, { Component } from 'react'
// import logo from './logo.svg'
import './App.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { DwgDetail, PanelDetail, Landing, NavBar, Gallery, CreateGame } from './components/index'
import Img from 'react-image'

class App extends Component {
  constructor() {
    super();
    this.state = {
    }
  }
  render() {
    return (
      <div className="App">
        <BrowserRouter >
          <div>
        <header className="App-header">
              <h1 className="App-title">Exquisite Corpse</h1>
            </header>
            <NavBar />
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/drawing" component={DwgDetail} />
              <Route exact path="/panel" component={PanelDetail} />
              <Route exact path="/gallery" component={Gallery} />
              <Route exact path="/new" component={CreateGame} />
            </Switch>
            </div>
        </BrowserRouter>
      </div>
    )
  }
}

export default App
