import React from "react"
import { Link, BrowserRouter as Router} from "react-router-dom"
import {Wips, CreateGame, Profile, PanelDetail } from "./index"
import {withAuth} from 'fireview'

const NavBar = ({_user: user}) => {
  if (!user) return null
  return(

    <div className="navbar-container">

      <ul id="nav-links">
      <li className="nav-item">
           <Link to="/gallery">Completed Drawings</Link>
        </li>
        <li className="nav-item">
           <Link to="/wips">WIPs</Link>
        </li>
        <li className="nav-item">
          <Link to="/profile">Profile</Link>
        </li>
        <li className="nav-item">
          <Link to="/new">Create a New Game</Link>
        </li>
        <li className="nav-item">
          Hi there, {user.email} (<Link to="/logout">Log Out</Link>)
          <Link to="/logout">Log Out</Link>
        </li>
      </ul>
    </div>
  )
}

export default withAuth(NavBar)



