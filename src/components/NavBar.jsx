import React from "react"
import { Link } from "react-router-dom"
// import {Wips, CreateGame, Profile, PanelDetail } from "./index"
import {withAuth} from 'fireview'

const NavBar = ({_user: user}) => {
  if (!user) return null
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
          <Link to="/new">New Drawing</Link>
        </li>

        <li className="nav-item">
          <Link to="/profile">Profile</Link>
        </li>
        <li className="nav-item">
          <Link to="/new">Create a New Game</Link>
        </li>
        <li className="nav-item">
          <Link to="/panel">Panel Detail</Link>
        </li>
        <li className="nav-item">
          Hi there, {user.displayName} (<Link to="/logout">Log Out</Link>)
        </li>
      </ul>
    </div>
  )
}

export default withAuth(NavBar)



