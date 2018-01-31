import React from "react"
import { Link, BrowserRouter as Router} from "react-router-dom"
import {Wips, CreateGame, Profile, PanelDetail } from "./index"

const NavBar = () => {
  return(

    <div className="navbar-container">

      <ul id="nav-links">
        <li className="nav-item">
           <Link to="/wips">Search/Friends</Link>
        </li>

        <li className="nav-item">
           <Link to="/wips">WIPs</Link>
        </li>

        <li className="nav-item">
          <Link to="/new-drawing">New Drawing</Link>
        </li>

        <li className="nav-item">
          <Link to="/profile">Profile</Link>
        </li>
        <li className="nav-item">
          <Link to="/new">Create a New Game</Link>
        </li>

        <li className="nav-item">
          <Link to="/logout">Log Out</Link>
        </li>
          <Link to="/panel">Panel Detail</Link>
        </li>
      </ul>

    </div>
  )
}

export default NavBar



