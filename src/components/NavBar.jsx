import React, {Component} from "react"
import { Link, BrowserRouter as Router } from "react-router-dom"
// import { Wips, CreateGame, Profile, PanelDetail } from "./index"
import { withAuth } from "fireview"
import '../hamburger.css'

const NavBar = ({ _user: user }) => {
  if (!user) return null
  return (
    <Hamburger user={user}/>
  )
}

class Hamburger extends Component {

  constructor(props){
    super(props)
    this.state = {
      menuToggle: false,
    }
     this.handleMenuToggle = this.handleMenuToggle.bind(this)
  }

  handleMenuToggle(){
    this.setState({menuToggle: !this.state.menuToggle})
  }

  render() {
    let toggled= this.state.menuToggle? 'toggled' : 'nope'

    return (
        <nav>
          <div id="menuToggle" className={toggled}>

             <div id="logo-small">
              <img src="./ex-grave-logo.svg" />
            </div>

            <div onClick={this.handleMenuToggle} className={toggled}>
              <div id="spanContainer">
                <span className="bar1"></span>
                <span className="bar2"></span>
                <span className="bar3"></span>
              </div>
            </div>

            <ul id="menu" className={toggled}>
              <div id="websiteLinks">
                <br/>
                <br/>

                <p onClick={this.handleMenuToggle}><Link to="/">Home</Link></p>
                <br/>
                <p onClick={this.handleMenuToggle}><Link to="/gallery">Gallery</Link></p>
                <br/>
                <p onClick={this.handleMenuToggle}><Link to="/wips">WIPs</Link></p>
                <br/>
                <p onClick={this.handleMenuToggle}><Link to="/new">New Game</Link></p>
                <br/>



                <div id="userSection">
                <p> Hi there, {this.props.user.email}!</p>
                 <div id="userLinks">
                    <p onClick={this.handleMenuToggle} className="offsetItem">
                    <Link to="/logout">Log Out</Link>
                    <Link to="/profile">Profile</Link>
                    <Link to="/users">Find Friends</Link>
                    </p>
                  </div>
                </div>

              </div>
           </ul>
          </div>
        </nav>
    )
  }
}

export default withAuth(NavBar)


