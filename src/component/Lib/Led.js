/* eslint no-eval: 0 */
/* eslint no-unused-vars: "off"*/
import React, { useEffect, useState } from "react"
import "./Tool.scss";




export default function Led(props) {
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
            var x 
            switch (setting.base) {
                case '10':
                    x = parseInt(eval(numstring));
                    break;
                case '16':
                    var n = eval(numstring)
                    if (n < 0) {
                        n = 0xFFFFFFFF + n + 1;
                       } 
                    x = parseInt(n, 10).toString(16);
                    break
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
                    
                    x = binary[15 - b[1]]
                    //console.log(binary,x)
                    break;

            }


            

            return x
        } catch (e) {
            return 0;
        }
    }
    

    return (
        <>
        {(setting?.data[handlegetnum(setting.cal)] !== undefined)

        ?<div className="DAT_Led" style={{width:props.width+"px", height:props.height+"px", position: "relative", zIndex: "0"}}><div className="DAT_Led-cir" style={{backgroundColor:setting.data[handlegetnum(setting.cal)].color}}><label style={{color:setting.textcolor, fontSize:setting.size+"px"}} >{setting.text}</label></div></div>
        :<div className="DAT_Led"  style={{width:props.width+"px", height:props.height+"px"}}><div className="DAT_Led-cir" style={{backgroundColor:'red'}} ></div></div>
        }
        </>
    )
}