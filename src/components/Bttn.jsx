import React from "react"
// import { Link } from "react-router-dom"
// import {SOMECOMPONENT} from "./index.jsx"

const Bttn = (props) => {
  return(
    <button
      type="submit"
      onClick={props.onClick}>
      {props.value}
    </button>
  )
}

export default Bttn
