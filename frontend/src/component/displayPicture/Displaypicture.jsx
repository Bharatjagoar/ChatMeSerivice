import React from 'react'
import DisplayPictureCss from "./displaypicture.module.css"
import BlackDP from "../../../images/blankDP.avif"

const Displaypicture = () => {
  return (
    <div className={DisplayPictureCss.MainDP}>
        {/* <h1>Bharat</h1> */}
        <img src={BlackDP} alt="" />
    </div>
  )
}

export default Displaypicture
