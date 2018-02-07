import React from "react"
import { Link, BrowserRouter as Router } from "react-router-dom"
import { Wips, CreateGame, Profile, PanelDetail } from "./index"
import { withAuth } from "fireview"
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem
} from 'react-bootstrap'

const NavBar = ({ _user: user }) => {
  if (!user) return null
  return (
    <Navbar id="navlist" fluid collapseOnSelect>
      <Navbar.Header>
        {/* <Navbar.Brand>
          <a href="/">Exquisite Graveyard</a>
        </Navbar.Brand> */}
        <Navbar.Toggle />
      </Navbar.Header>
        <Navbar.Collapse>

          <Nav id="navlist">
            <NavItem className="nav-item">
              <Link to="/gallery">Gallery</Link>
            </NavItem>
            <NavItem className="nav-item">
              <Link to="/wips">WIPs</Link>
            </NavItem>
            <NavItem className="nav-item">
              <Link to="/new">New Game</Link>
            </NavItem>
            <NavItem className="nav-item">
              <Link to="/profile">Profile</Link>
            </NavItem>
            <NavItem className="nav-item">
              <Link to="/users">Find Your Friends</Link>
            </NavItem>
          </Nav>
          <Nav id="navlist" pullRight>
            <NavItem id="logging" className="nav-item">
              Hi there, {user.email}!
              <Link id="logoutPadding" to="/logout">Log Out</Link>
            </NavItem>
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  )
}

export default withAuth(NavBar)
