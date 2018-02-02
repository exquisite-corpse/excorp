import React from "react"
// import { Link } from "react-router-dom"

const DwgItem = (props) => {
  const {panels} = props

  return(
         <div>
           {
              panels.map((src, idx) => {
                return <img key={idx} src={src} />
              })
            }
            <br/>
         </div>
  )
}

export default DwgItem
