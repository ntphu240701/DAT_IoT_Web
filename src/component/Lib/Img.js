import React, { useEffect, useState } from "react"
import "./Tool.scss";




export default function Img(props) {
    const [setting, setSetting] = useState(props.setting)
    useEffect(function () {
        setSetting(props.setting)
        // console.log(props.setting)
    }, [props.setting])


    return (
        <div className="DAT_Pic" style={{ width:(props.width-2)+"px", height:(props.height-2)+"px", position: "relative", zIndex: "0", overflow: "hidden", borderRadius: setting?.radius + "px" || "0px"}}>
            <img src={setting?.pic || '/dat_picture/Embody_APP_22.jpg'} style={{height:'100%', width:'100%'}} alt=""/>
        </div>
    )
} 