import React, { Component } from "react"
import { Bttn, TextInput } from "./index"
import firebase from 'firebase'
import db from '../db/db_config'
import { withAuth } from 'fireview'
//switch redirects to use browser history...
// import {BrowserHistory} from 'react-router-dom'

class PassPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.createNextPanel = this.createNextPanel.bind(this)
    }
    async createNextPanel() {
        const nextArtist = event.target.nextArtist.value
        const { _user: user } = this.props
        const justFinishedPanel = this.props.panel
        const currentDrawing = this.props.drawing

        if (!user) {
            alert('must be logged in')
            window.location.href = "/"
        }
        const allDrawings = db.collection('drawings')
        const allPanels = db.collection('panels')
        let userId = user.uid

        const panel = await allPanels.add({
            author: db.collection('users').doc(nextArtist),
            completed: false,
            orderNum: justFinishedPanel.orderNum + 1,
            [nextArtist]: true,
            src: '',
            previousPanel: allPanels.doc(justFinishedPanel.uid),
            drawingId: allDrawings.doc(drawingId)
        })

        const drawing = await allDrawings.doc(drawingId).set({
            artists: {
                [nextArtist]: true
            },
            panels: {
                [panel.id]: 1
            }
        }, { merge: true })

        //do we need more error handling here?
        console.log('updated drawing', drawing.id)
        console.log('created new panel', panel.id)
        debugger
        return window.location.href = `/panels/${panel.id}`
    }

    handleSubmit(evt) {
        evt.preventDefault()
        this.createNextPanel(evt)
    }

    render() {
        return (
            <div>
                <br />
                <h3>Pass Along Your Panel to the Next Artist</h3>
                <br />
                <form name="pass-your-panel" onSubmit={this.handleSubmit}>
                    <div className="users-select">
                        <select  name="nextArtist">
                            <Map from={ db.collection('users')}
                                Loading={() => 'Loading...'}
                                Render={(userObj) => <option key={userObj.uid} value={userObj.uid}>{userObj.name}</option>}
                                Empty={() => <h3>You don't have any friends...</h3>}/>
                        </select>
                    </div>
                    <br />
                    <Bttn className="btn btn-success" type="submit" value="pass your panel" />
                </form>
            </div>
        )
    }
}

export default withAuth(CreateGame)
