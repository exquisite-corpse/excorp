import db from './db/db_config'
import React, { Component } from 'react'
import './App.css'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { Landing, NavBar, Gallery, CreateGame, LogOut, Wips, Panel, SearchBar, Profile, PublicProfile,FriendsProfile} from './components/index'

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
        <Router >
          <div>
            <header className="App-header">
              <h1 className="App-title">Exquisite Corpse</h1>
            </header>
            <NavBar />
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/panels/:panelId" component={Panel} />
              <Route exact path="/wips" component={Wips} />
              <Route exact path="/gallery" component={Gallery} />
              <Route exact path="/new" component={CreateGame} />
              <Route exact path="/logout" component={LogOut} />
              <Route exact path="/users" component={SearchBar} />
              <Route exact path="/users/:userId" component={PublicProfile} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/profiles/:userId" component={FriendsProfile} />
            </Switch>
            </div>
        </Router>
      </div>
    )
  }
}

export default App
