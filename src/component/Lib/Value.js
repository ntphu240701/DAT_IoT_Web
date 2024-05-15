/* eslint no-eval: 0 */
/* eslint no-unused-vars: "off"*/
import React, { useEffect, useState } from "react"
import "./Tool.scss";

export default function Value(props) {

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

            switch (setting.base) {
                case '10':
                    return parseFloat(eval(numstring)).toFixed(1) || 0;
                    //break;
                case '16':
                    var n = eval(numstring)
                    if (n < 0) {
                        n = 0xFFFFFFFF + n + 1;
                       } 
                    return parseInt(n, 10).toString(16) || 0;
                    //break
                default:
                    var b =  setting.base.split("_")
                    const numberToConvert = eval(numstring);
                    const numberOfBits = 16; // 32-bits binary
                    const arrBitwise = [0]; // save the resulting bitwise
            
                    for (let i = 0; i < numberOfBits; i++) {
                        let mask = 1;
            
                        const bit = numberToConvert & (mask << i); // And bitwise with left shift
            
                        if (bit === 0) {
                            arrBitwise[i] = 0;
                        } else {
                            arrBitwise[i] = 1;
                        }
                    }
            
                    const binary = arrBitwise.reverse().join("");
                    
                    return binary[15 - b[1]] || 0
                    //console.log(binary,x)
                    // break;

            }


            
        } catch (e) {
            return 0;
        }
    }



    return (
        <div className="DAT_Value" style={{height:props.height+"px", justifyContent:setting?.align || "left",fontSize:setting?.size+"px" || "16px", color:setting?.color || "black", backgroundColor:setting?.bgcolor || "white", border: "solid 1px "+ setting?.bordercolor || "black", borderRadius: setting?.radius +"px" || "10px"}}>{handlegetnum(setting?.cal || 0)}</div>
    )
}