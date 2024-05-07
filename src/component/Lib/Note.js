/* eslint no-unused-vars: "off"*/
import React, { useEffect, useState } from "react"
import "./Tool.scss";




export default function Note(props) {
    const [data, setData] = useState(props.data)
    const [setting, setSetting] = useState(props.setting)
    useEffect(function () {
        setData(props.data)
    }, [props.data])

    useEffect(function () {
        setSetting(props.setting)
    }, [props.setting])

    return (
        <div className="DAT_Note" style={{height:props.height+"px", justifyContent:setting?.align || "left",fontSize:setting?.size+"px" || "16px", color:setting?.color || "black", backgroundColor:setting?.bgcolor || "white" , border: "solid 1px "+ setting?.bordercolor || "black", textAlign: "justify", borderRadius: setting?.radius +"px" || "10px" }}>{setting?.text || "Note"} </div>
    )
}