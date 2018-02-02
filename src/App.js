// import db from './db/db_config'
import React, { Component } from 'react'
import './App.css'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { DwgDetail, PanelDetail, Landing, NavBar, Gallery, CreateGame, LogOut, CreatePanel, Wips, kbDWG} from './components/index'

// import Img from 'react-image'

class App extends Component {
  constructor() {
    super()
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
              <Route exact path="/drawing/:drawingId" component={DwgDetail} />
              <Route exact path="/panels/:panelId" component={PanelDetail} />
              <Route exact path="/createPanel" component={CreatePanel} />
              <Route exact path="/wips" component={Wips} />
              <Route exact path="/drawing" component={DwgDetail} />
              <Route exact path="/panel" component={PanelDetail} />
              <Route exact path="/gallery" component={Gallery} />
              <Route exact path="/new" component={CreateGame} />
              <Route exact path="/logout" component={LogOut} />
              <Route exact path="/dwg" component={kbDWG} />
            </Switch>
            </div>
        </Router>
      </div>
    )
  }
}

export default App
