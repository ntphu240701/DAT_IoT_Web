/* eslint no-eval: 0 */
/* eslint no-unused-vars: "off"*/
import React, { useEffect, useState } from "react"
import "./Tool.scss";




export default function Status(props) {
    const [data, setData] = useState(props.data)
    const [setting, setSetting] = useState(props.setting)

    const hexToRgbA = (hex, opacity) => {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ','+opacity+')';
        }else{
            return 'rgba(255,255,255,'+opacity+')';
        }
        
    }

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
           


        {(setting.data[handlegetnum(setting.cal)] !== undefined)

        ?<div className="DAT_Value"  style={{position:"relative",zIndex:0,  color:setting.data[handlegetnum(setting.cal)].color, height:props.height+"px",  fontWeight:"500", fontSize:setting.size+"px", display:"flex", alignItems:"center",justifyContent:setting.align, textAlign: "justify", backgroundColor:hexToRgbA(setting?.bgcolor || "#FFFFFF", setting?.opacity || "1"), border: `solid  ${setting?.borderwidth || 1}px ${setting?.bordercolor || "black"}`, borderRadius: setting.radius +"px"}}>{setting.data[handlegetnum(setting.cal)].text}</div>
        :<div  className="DAT_Value" style={{position:"relative",zIndex:0,  color:'red', fontWeight:"500", height:props.height+"px", fontSize:setting.size+"px", display:"flex", alignItems:"center",justifyContent:setting.align,  backgroundColor:hexToRgbA(setting?.bgcolor || "white", setting?.opacity || "1"), border: `solid  ${setting?.borderwidth || 1}px ${setting?.bordercolor || "black"}` , borderRadius: setting.radius +"px"}}>UNVALID</div>
        }
        </>
    )
}