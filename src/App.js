import db from './db/db_config'
import React, { Component } from 'react'
import './App.css'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { PageHeader } from 'react-bootstrap'
import { Landing, NavBar, Gallery, CreateGame, LogOut, Wips, Panel, SearchBar, Profile, PublicProfile,FriendsProfile} from './components/index'

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
          <div >
{/*            <PageHeader id="page-header">
              Exquisite Graveyard
            </PageHeader>
*/}
            <NavBar id="navcontainer"/>
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
