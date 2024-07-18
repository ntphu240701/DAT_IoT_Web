import React, { useEffect, useState } from "react"
import "./Tool.scss";




export default function Picture(props) {
    const [setting, setSetting] = useState(props.setting)
    useEffect(function () {
        setSetting(props.setting)
    }, [props.setting])


    return (
        <div className="DAT_Pic" style={{ width:props.width+"px", height:props.height+"px", position: "relative", zIndex: "0"}}>
            <div className="DAT_Pic-img" style={{height:props.height+"px", backgroundImage: "url('/picture/"+setting.pic+".png')"}}></div>
        </div>
    )
}