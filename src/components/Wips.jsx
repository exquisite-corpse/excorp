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

    <div id="main-container-wips" >
      <h1>Here are Your Beautiful Works In Progress (WIPs)</h1>
      <Map from={allPanels.where('completed', '==', false).where(`${user.uid}`, '==', true)}
          Loading={() => 'Loading...'}
          Render={(props) => {
            if (props.id) {
              return <Link key={props.id} to={`/panels/${props.id}`}>
                {props.src !== ''
                  ? <Img src={props.src} />
                  : <h2> Go to this panel</h2>
                }
              </Link>
            } else { return <h1>This panel wasn't formatted properly...Sorry about that!</h1> }
          }}
          Empty={() =>
            <div id="main-container-bodylinks">
              <h2 >You don't have any works in progress...</h2>
              <Link to={`/new`}>Click here to Create a New Game</Link>
            </div>
          }
      />
    </div>
  )
}

export default withAuth(Wips)
