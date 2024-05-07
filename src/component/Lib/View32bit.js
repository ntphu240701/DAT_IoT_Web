import React, { useEffect, useState } from "react";
import "./Tool.scss";

export default function View32bit(props) {
    const [data, setData] = useState(props.data)
    const [setting, setSetting] = useState(props.setting)
    useEffect(function () {
        setData(props.data)
    }, [props.data])

    useEffect(function () {
        setSetting(props.setting)
    }, [props.setting])


    const handlegetnum = (numstring) => {
        try {
            var x = eval(numstring) 
            return parseInt(x) || 0
            
        } catch (e) {
            return 0;
        }
    }


  const convertToDoublewordAndFloat = (word,type) =>{
    var doubleword = (handlegetnum(word[1]) << 16) | handlegetnum(word[0]);
    var buffer = new ArrayBuffer(4);
    var intView = new Int32Array(buffer);
    var floatView = new Float32Array(buffer);
    intView[0] = doubleword;
    var float_value = floatView[0];

    return type === "int" ? doubleword : parseFloat(float_value).toFixed(2) || 0;
}



  return (
    <div className="DAT_Value" style={{height:props.height+"px", justifyContent:setting?.align || "center",fontSize:setting?.size+"px" || "20px", color:setting?.color || "black", backgroundColor:setting?.bgcolor || "white", border: "solid 1px "+ setting?.bordercolor || "black", borderRadius: setting?.radius +"px" || "10px"}}>{convertToDoublewordAndFloat(setting?.cal || "0",setting?.type || "int")}</div>
  );
}