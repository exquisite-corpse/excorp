import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import * as firebase from 'firebase'
import 'bootstrap/dist/css/bootstrap.min.css'



ReactDOM.render(
<App/>
    , document.getElementById('root'))
registerServiceWorker()

export default firebase



{/* <BrowserRouter>
<App />
</BrowserRouter> */}