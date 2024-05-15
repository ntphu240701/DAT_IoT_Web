import React, { useContext, useEffect, useState } from 'react'
import { useRef } from 'react'
import DataTable from 'react-data-table-component'
export default function Tablepro(props) {
    const [headrow, setHeadRow] = useState([])
    const [data, setData] = useState(props.data)
    const [setting, setSetting] = useState(props.setting)
    const handlegetnum = (numstring) => {
        try {
         
            switch (setting.base) {
                case '10':
                    return parseInt(eval(numstring)) || 0;
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
 
                    //break;

            }


     
        } catch (e) {
            return 0;
        }
    }




    useEffect(function () {
        setData(props.data)
        setting.head.map((data, index) => {
            if (index == 0) {
                setHeadRow([])
                setHeadRow(pre => [...pre, { name: data.name, selector: row => row[data.code], width: "60px" }])
            } else {
                setHeadRow(pre => [...pre, {
                    name: <>
                        <div >
                            {data.name}

                        </div>
                        <div style={{ color: "gray", fontSize: "10px", position: "absolute", bottom: "0", right: "3px", }}>
                            {splitcode(data.code)}
                        </div>
                    </>
                    , selector: row => <div>{handlegetnum(row[data.code])}</div>
                }])
            }
        })
    }, [props.data])

    useEffect(function () {
        setSetting(props.setting)
    }, [props.setting])

   


    const splitcode = (text) => {
        var t = text
        t = t.split("_")
        return t[1]
    }

    return (
        <div className='DAT_TablePro' style={{ width: props.width + "px", overflow: "hidden", overflowX:"sc", position: "relative", zIndex: setting?.zindex  }}>
            <DataTable
                className='DAT_Table_Container'
                style={{ paddingTop: "0px" }}
                data={setting.data}
                columns={headrow}
            />
        </div>
    )
}
