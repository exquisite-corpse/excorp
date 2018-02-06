import React from "react"


const TextInput = (props) => {
  return(
    <div className="input-container">
      <label>{props.label}</label>
      <input
        name={props.name}
        type={props.type}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange} />
    </div>
  )
}

export default TextInput
