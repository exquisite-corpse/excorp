import React, { Component } from "react"
import { Bttn, TextInput } from "./index"
import firebase from 'firebase'
import db from '../db/db_config'
import {withAuth} from 'fireview'
//switch redirects to use browser history...
// import {BrowserHistory} from 'react-router-dom'
class CreateGame extends Component {
    constructor() {
        super()
        this.state = {
            title: "Untitled",
            category: "Animal",
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
        this.startGame = this.startGame.bind(this)
    }
    
    async startGame() {
        //we get this user from fireview's withauth
        const {_user: user} = this.props
        if (!user) { 
            alert('must be logged in')
            window.location.href = "/"
        }
        const allDrawings = db.collection('drawings')
        const allPanels = db.collection('panels')
        let userId = user.uid

        const panel = await allPanels.add({
            author: db.collection('users').doc(user.uid),
            createdAt: Date.now(), //this is a unix timestamp
            completed: false,
            orderNum: 1,
            [user.uid]: true,
            //do we need to send empty src?
            //can we instead not have one?
            //consider adding category and title onto panel for easier work??
            src: ''
        })

        const drawing = await allDrawings.add({
            panelCount: 3,
            createdAt: Date.now(), //this is a unix timestamp
            completed: false,
            category: this.state.category,
            title: this.state.title,
            artists: {
                [userId]: true
            },
            panels: {
                [panel.id]: 1
            }
        })

        const updatePanel = await allPanels.doc(panel.id).set({drawingId: drawing.id, id:panel.id}, {merge: true})

        const updateDrawing = await allDrawings.doc(drawing.id).set({id: drawing.id}, {merge: true})

        //do we need more error handling here?
        console.log('created drawing', drawing.id)
        console.log('added drawing ref to panel', panel.id)
        
        return window.location.href = `/panels/${panel.id}`
    }

    changeHandler(evt) {
        const stObj = {}
        stObj[evt.target.name] = evt.target.value
        this.setState(stObj)
    }

    handleSubmit(evt) {
        evt.preventDefault()
        this.startGame()
    }

    render() {
        return (
            <div>
                <br />
                <h3>Create a New Game</h3>
                <br />
                <form name="create-new-game" onSubmit={this.handleSubmit}>

                    <div className="gameFields">
                        <TextInput
                            label="title: "
                            name="title"
                            type="text"
                            value={this.state.title}
                            onChange={this.changeHandler}
                            placeholder="title"
                        />

                        <select
                            id="category-select"
                            name="category"
                            onChange={this.changeHandler}
                        >
                            <option value="Animal">Animal</option>
                            <option value="Nature">Nature</option>
                            <option value="Monster">Monster</option>
                            <option value="Freeplay">Freeplay</option>
                        </select>
                    </div>
                    <br />
                    <Bttn className="btn btn-success" type="submit" value="make a new game" />
                </form>
            </div>
        )
    }

}

export default withAuth(CreateGame)
