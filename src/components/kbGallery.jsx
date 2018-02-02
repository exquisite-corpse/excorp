
import React, { Component } from “react”
import { Link } from “react-router-dom”
import { DwgItem, Bttn, TextInput } from “./index”
import firebase from ‘firebase’
import db from ‘../db/db_config’
import { Map, withAuth } from ‘fireview’

const allPanels = db.collection(‘panels’)
const allDrawings = db.collection(‘drawings’)

const Panel = (props) => {
 const { src } = props
 return <img src={src} />
}

function sortedPanelIds(dwgsPanels) {
 //here we want to map through the panels object inside a drawing and sort them by their order
 //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries

 const keyVals = Object.entries(dwgsPanels)
 const sortedKeyVals = keyVals.sort(([x, a], [y, b]) => {
   return (a - b)
 })
 sortedKeyVals.map(([key, value]) => key)
}

const Drawing = (props) => {
 const { myId, panels } = props
 if (!panels) return <div>NOOOOOO</div>
 else {
   return (
     <div>
       {sortedPanelIds(panels).join(‘,’)} {
         sortedPanelIds(panels)
           .map(id => <Map key={id} from={allPanels.doc(myId)}
             Empty={() => ‘Empty.’}
             Render={Panel} />)
       }
     </div>
   )
 }
}


const Gallery = ({ _user: user }) => {
 if (!user) return null

 allDrawings.where(‘completed’, ‘==‘, true).where(`artists.${user.id}`, ‘==’, true).get().then(snap => {
   snap.forEach(thing => console.log(“wroe”, thing.data()))
 })
 return (
   <div>
     <h3>All My Finished Drawings</h3>

   <Drawing id={1}/>


     {/* <Map from={allDrawings.where(‘completed’, ‘==‘, true) /*.where(`artists.${user.id}`, ‘==’, true).where(‘completed’,‘==’, true) */}
       {/* Loading={() => ‘Loading...‘}
       Render={Drawing} /> */}

     {/* this.state.panelSets && this.state.panelSets.map( (set, idx) => {
                      return <DwgItem key={idx} panels={set} />
                  */}

   </div>
 )
}

const Debug = props => {
 console.log(props)
 return ‘’ + props
}


export default withAuth(Gallery)


Message @Sara Rose Gallagher

*bold* _italics_ ~strike~ `code` ```preformatted``` >quote
