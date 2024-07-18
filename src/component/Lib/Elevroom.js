/* eslint no-eval: 0 */
/* eslint no-unused-vars: "off"*/
import React, { useEffect, useState } from "react"
import "./Tool.scss";



export default function Elevroom(props) {
    ///const [door, setDoor] = useState(false)
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
            //console.log(x)


            switch (setting.base) {
                case '10':
                    x = parseFloat(eval(numstring)).toFixed(2);
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
        <div className="box" id={props.deviceid + "_" + props.tab + "_" + props.id + "_elev"} style={{zIndex:setting.zindex, scale:setting?.scale || "1"}} >
            <div className="elevator-wrapper">
                <div className="elevator">
                    <div className="ng ng-instance" >
                        <div className="overlap-group">
                            <img className="background" alt="Background" src="/elev/background.png" />
                            {(parseInt(handlegetnum(setting.cal)) === parseInt(setting.open))
                                ? <>
                                    <img className="leftdoor" style={{ left: "28px", transition: "all 1.5s" }} alt="Leftdoor" src="/elev/leftdoor-2.png" />
                                    <img className="rightdoor" style={{ left: "182px", transition: "all 1.5s" }} alt="Rightdoor" src="/elev/rightdoor-2.png" />
                                </>
                                : <>
                                    <img className="leftdoor" style={{ left: "76px", transition: "all 1.5s" }} alt="Leftdoor" src="/elev/leftdoor-2.png" />
                                    <img className="rightdoor" style={{ left: "128px", transition: "all 1.5s" }} alt="Rightdoor" src="/elev/rightdoor-2.png" />
                                </>

                            }

                            <img className="frames" alt="Frames" src="/elev/frames-2.png" />
                            <img className="rightwall" alt="Rightwall" src="/elev/rightwall-2.png" />
                            <img className="leftwall" alt="Leftwall" src="/elev/leftwall-2.png" />
                            <img className="ceiling" alt="Ceiling" src="/elev/ceiling-2.png" />
                            <img className="wall" alt="Wall" src="/elev/wall-2.png" />
                            <img className="floor" alt="Floor" src="/elev/floor-2.png" />

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}