import React from "react"

const Bttn = (props) => {
  return(
    <button
      value= {props.value}
      type="submit"
      className={props.className}
      onClick={props.onClick}
      >
      {props.text}
    </button>
  )
}

export default Bttn
