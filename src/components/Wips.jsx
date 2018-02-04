// import React, { Component } from "react"
// import db from '../db/db_config'
import Img from 'react-image'
// import { Link, Redirect } from "react-router-dom"
// import firebase from 'firebase'
// import {SOMECOMPONENT} from "./index.jsx"

// all panels completed false with my user id

// panels
// - search all panels
//   - where: completed: false
//   - where: author: current user id

// - map over resulted panels
//   - go to drawing ids for each
//   - print that drawing's title listed along thumbnail
//   - IF FEASIBLE: render preview of panel (from src)
//   - link to PanelDetail component

import React, { Component } from "react"
import { Link } from "react-router-dom"
import { DwgItem, Bttn, TextInput } from "./index"
import firebase from 'firebase'
import db from '../db/db_config'
import { Map, withAuth } from 'fireview'

const allPanels = db.collection('panels')

// // db.collection("cities").doc("SF")
// //     .onSnapshot(function(doc) {
// //         console.log("Current data: ", doc.data());
// //     })

// // db.collection("cities").where("state", "==", "CA")
// //     .onSnapshot(function(querySnapshot) {
// //         var cities = [];
// //         querySnapshot.forEach(function(doc) {
// //             cities.push(doc.data().name);
// //         });
// //         console.log("Current cities in CA: ", cities.join(", "));
// //     })


// class Wips extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       panels: [],
//       user: {}
//     }
//   }
//   componentWillReceiveProps(nextProps) {
//     console.log(nextProps)
//   }
//   componentWillMount() {
//     let panels = []
//     const allPanels = db.collection('panels')
//     this.unsubscribe = 
//     firebase.auth().onAuthStateChanged(user => {
//     if (user.uid) {
//       console.log("also here wtf")
//          allPanels.where('completed', '==', false).where(`${user.uid}`, '==', true)
//         .onSnapshot(querySnapshot => {
//           console.log("I'm getting here: ", querySnapshot)
//             querySnapshot.forEach(doc => {
//               console.log("I'm getting here: ???????", doc)
//                 panels.push(doc.data().id)
//                 console.log("what the fuck", panels, user)
//             })
//             this.setState({panels, user})
//         })
//       }
//     })
//   }

//   componentWillUnmount() {
//     this.unsubscribe()
//   }
//   render() {
//     const user = this.props._user
//     const {panels} = this.state
//     if (!user) { return null }
//     if (!panels.length) { return null }
//     return (
//       <div>

//         {
//           panels[0].id !== ''
//             ? <div>
//               <h2>Here are Your Beautiful Works In Progress (WIPs)</h2>
//               <h3>Click on one to begin drawing</h3>
//               <br />
//               { panels.length && panels.map((panel, index) => {
//                 return (
//                   <Link key={index} to={`/panels/${panel.id}`}>
//                     {panel.src !== ''
//                       ? <Img src={panel.src} />
//                       : <h3> Go to your panel</h3>
//                     }
//                   </Link>
//                 )
//               })}
//             </div>
//             : <div>
//               <h2>You don't have any Works In Progress</h2>
//               <Link to={`/new`}>Click here to Create a New Game
//             </Link>
//             </div>
//         }
//       </div>
//     )
//   }
// }

// export default withAuth(Wips)

const Wips = (props) => {
  const user = props._user

  if (!user) {return null} 
  // else{
  //   console.log("user: ", user)
  //   allPanels/*.where('completed', '==', false)*/.where("qKaZb3eV7XcmoczbTycmmquxMfF2", '==', true).get().then((snapshot) => {
  //     console.log(snapshot)
  //     snapshot.forEach(doc => {console.log("doc's data", doc.data())})
  //   })

  return (
    <div>
      <h2>Here are Your Beautiful Works In Progress (WIPs)</h2>
    <Map from={allPanels.where('completed', '==', false).where(`${user.uid}`, '==', true)} 
        Loading={() => 'Loading...'}
        Render={(props) => `${props}`}
        Empty={() => <div>
          <h3>You don't have any works in progress...</h3>
          <Link to={`/new`}>Click here to Create a New Game
        </Link>
        </div>}/> 
    </div>
  )
// }
}

export default withAuth(Wips)

// export default class Wips extends Component {
//   constructor() {
//     super()
//     this.state = {
//       incompletePanels: [{
//         id: '',
//         src: ''
//       }],
//       user: {}
//     }
//   }
//   componentDidMount() {
//     let temp = []
//     this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
//       if (user) {
//         this.setState({ user })
//         console.log("checking this.state.user.uid", this.state.user.uid)
//         const userRef = db.collection('users').doc(`${this.state.user.uid}`)

//         let notCompletedPanelsRef = db.collection('panels').where('completed', '==', false).where('author', '==', userRef).get().then((snapshot) => {
//           snapshot.forEach(doc => {
//             let panel = doc.data()

//             temp.push({ src: panel.src, id: doc.id })
//             console.log("this is supposed to be incomplete panels", temp)
//             this.setState({ incompletePanels: temp })
//           })
//         })
//           .catch(err => {
//             console.log('error getting docs: ', err)

//           })
//       }
//     })


//   }

//   componentWillUnmount() {
//     this.unsubscribe()
//   }
//   render() {
//     const incompletePanels = this.state.incompletePanels
//     console.log(incompletePanels[0]);
//     console.log(this.state.user)
//     return (
//       <div>

//         {
//           incompletePanels[0].id !== ''
//             ? <div>
//               <h2>Here are Your Beautiful Works In Progress (WIPs)</h2>
//               <h3>Click on one to begin drawing</h3>
//               <br />
//               {incompletePanels && incompletePanels.map((panel, index) => {
//                 return (
//                   <Link key={index} to={`/panels/${panel.id}`}>
//                     {panel.src !== ''
//                       ? <Img src={panel.src} />
//                       : <h3> Go to your panel</h3>
//                     }
//                   </Link>
//                 )
//               })}
//             </div>
//             : <div>
//               <h2>You don't have any Works In Progress</h2>
//               <Link to={`/new`}>Click here to Create a New Game
//             </Link>
//             </div>
//         }
//       </div>
//     )
//   }
// }
