import React, { Component } from "react"
import { Bttn, TextInput } from "./index"
import firebase from 'firebase'
import db from '../db/db_config'
import { withAuth } from 'fireview'
// import { FormGroup, FormControl } from "../../../../Library/Caches/typescript/2.6/node_modules/@types/react-bootstrap";
import { FormGroup, FormControl, form, ControlLabel, Button, Col } from 'react-bootstrap'

class CreateGame extends Component {
    constructor() {
        super()
        this.state = {
            title: "Untitled",
            category: "Freeplay",
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
        this.startGame = this.startGame.bind(this)
    }

    async startGame() {
        //we get this user from fireview's withauth
        const { _user: user } = this.props
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

        const updatePanel = await allPanels.doc(panel.id).set({ drawingId: drawing.id, id: panel.id }, { merge: true })

        const updateDrawing = await allDrawings.doc(drawing.id).set({ id: drawing.id }, { merge: true })

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
            <form name="create-new-game" id="new-game-form" className="col-xs-5"onSubmit={this.handleSubmit}>
                <FormGroup controlId="formBasicText">
                   <ControlLabel>Create a New Game</ControlLabel>
                    <FormControl
                        type="text"
                        onChange={this.changeHandler}
                        placeholder="Untitled"
                        name="title"
                    />
                    <FormControl.Feedback />
                </FormGroup>

                {/* select category */}
                <FormGroup onChange={this.changeHandler} controlId="formControlsSelect">
                    <ControlLabel>Select a Category</ControlLabel>
                    <FormControl name="category" componentClass="select" placeholder="select">
                    <option value="" selected disabled hidden>Select A Category</option>
                        <option value="Animal">Animal</option>
                        <option value="Nature">Nature</option>
                        <option value="Monster">Monster</option>
                        <option value="Freeplay">Freeplay</option>
                    </FormControl>
                </FormGroup>

                <Button id="create-game-bttn" type="submit" value="Make a New Game">Make a New Game</Button>
            </form>
        )
    }

}

export default withAuth(CreateGame)
