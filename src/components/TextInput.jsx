import React from "react"
// import { Link } from "react-router-dom"

const TextInput = (props) => {
  return(
    <div className="input-container">
      <input
        name={props.name}
        type={props.type}
        value={props.value}
        placeholder={props.placeholder}
        onSubmit={props.onSubmit} />
    </div>
  )
}

export default TextInput
