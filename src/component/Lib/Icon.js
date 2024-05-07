/* eslint no-eval: 0 */
/* eslint no-unused-vars: "off"*/
import React, { useEffect, useState } from "react"
import "./Tool.scss";
import CssFilterConverter from 'css-filter-converter';



export default function Icon(props) {
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
                    var b = setting.base.split("_")
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

    const handlefilter = (color) => {
        const result = CssFilterConverter.hexToFilter(color);
        //console.log(result)
        return result.color
    }


    return (
        <>



            {(setting.data[handlegetnum(setting?.cal)] || undefined)

                ? <div className="DAT_Icon" style={{ width: props.width + "px", height: props.height + "px" }}><img alt="" src={"/icon/" + setting.img + ".png"} style={{ filter: handlefilter(setting.data[handlegetnum(setting.cal)].color), width: (props.width - 10) + "px", height: (props.height - 10) + "px" }}></img></div>
                : <div className="DAT_Icon" style={{ width: props.width + "px", height: props.height + "px" }}></div>
            }
        </>
    )
}