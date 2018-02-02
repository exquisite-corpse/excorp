import React from "react"
// import { Link } from "react-router-dom"
// import { DwgItem, Bttn, TextInput } from "./index"
// import firebase from 'firebase'
import db from '../db/db_config'

import {Map, withAuth} from 'fireview'

const allPanels = db.collection('panels')
const allDrawings = db.collection('drawings')

const Panel = ({src}) =>
  <img src={src} />

const sortedIds = panels =>
  Object.entries(panels)
    .sort(([_1, a], [_2, b]) => a - b)
    .map(([key, value]) => key)

const Drawing = ({_id, panels}) => panels
  ? <div> {_id} {sortedIds(panels).join(',')} {
      sortedIds(panels)
        .map(id => <Map key={id} from={allPanels.doc(id)}
              Empty={() => 'Empty.'}
              Render={Panel} />)
    } </div>
  : null


const Gallery = ({_user: user}) => {
      if (!user) return null
      return (
          <div>
            <h3>All My Finished Drawings</h3>

                  <Map from={allDrawings.where('completed', '==', true) /*.where(`artists.${user.uid}`, '==', true).where('completed','==', true) */}
                    Loading={() => 'Loading...'}
                    Render={Drawing} />

                  {/* this.state.panelSets && this.state.panelSets.map( (set, idx) => {
                       return <DwgItem key={idx} panels={set} />
                   */}

            </div>
      )
  }

// const Debug = props => {
//   console.log(props)
//   return '' + props
// }


export default withAuth(Gallery)
