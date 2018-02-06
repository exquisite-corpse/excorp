import React from "react"

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
