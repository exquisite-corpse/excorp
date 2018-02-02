import React, { Component } from "react"
import { Link } from "react-router-dom"
import { DwgItem, Bttn, TextInput } from "./index"
import firebase from 'firebase'
import db from '../db/db_config'
import { Map, withAuth } from 'fireview'

const allPanels = db.collection('panels')
const allDrawings = db.collection('drawings')

const Panel = (props) => {
  const { src } = props
  return <img src={src} height="350"/>
}

function sortedPanelIds(dwgsPanels) {
  //here we want to map through the panels object inside a drawing and sort them by their order
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
  console.log("SORTED IS RUNNING")
  const keyVals = Object.entries(dwgsPanels)
  const sortedKeyVals = keyVals.sort(([x, a], [y, b]) => {
    return (a - b)
  })
  return sortedKeyVals.map(([key, value]) => key)
}

const Drawing = ({panels}) => panels
 ? <div className="container" className="dwg-container"> {/*fix this with css*/}<br/><br/><br/><br/><br/><br/>{
  sortedPanelIds(panels)
       .map(id => <Map key={id} from={allPanels.doc(id)}
             Empty={() => 'Empty.'}
             Render={Panel} />)
   } </div>
 : null

const Gallery = ({ _user: user }) => {
  if (!user) return null
  return (
    <div>
      <h3>All My Finished Drawings</h3>
    <Map from={allDrawings.where('completed', '==', true).where(`artists.${user.uid}`, '==', true)} 
        Loading={() => 'Loading...'}
        Render={Drawing} /> 
    </div>
  )
}



export default withAuth(Gallery)
