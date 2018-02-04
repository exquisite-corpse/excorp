import React, { Component } from "react"
import { Link } from "react-router-dom"
import { DwgItem, Bttn, TextInput } from "./index"
import firebase from 'firebase'
import db from '../db/db_config'
import Img from 'react-image'
import { Map, withAuth } from 'fireview'

const allPanels = db.collection('panels')

const Wips = (props) => {
  const user = props._user

  if (!user) return null
  return (
    <div>
      <h2>Here are Your Beautiful Works In Progress (WIPs)</h2>
    <Map from={allPanels.where('completed', '==', false).where(`${user.uid}`, '==', true)} 
        Loading={() => 'Loading...'}
        Render={(props) => `THIS IS THE IDS: ${props.id}` /*render panel source as a link to panels/props.id*/}
        Empty={() => <div>
          <h3>You don't have any works in progress...</h3>
          <Link to={`/new`}>Click here to Create a New Game
        </Link>
        </div>}/> 
    </div>
  )
}

export default withAuth(Wips)
