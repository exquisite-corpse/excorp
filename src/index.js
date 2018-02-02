import React from 'react'
import ReactDOM from 'react-dom'
// import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import * as firebase from 'firebase'
import 'bootstrap/dist/css/bootstrap.min.css'
import {AuthProvider} from 'fireview'

ReactDOM.render(
<AuthProvider auth={firebase.auth()}>
  <App/>
</AuthProvider>
    , document.getElementById('root'))
registerServiceWorker()

export default firebase



{/* <BrowserRouter>
<App />
</BrowserRouter> */}
