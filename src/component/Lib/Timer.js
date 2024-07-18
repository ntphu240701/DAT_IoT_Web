/* eslint no-eval: 0 */
/* eslint no-unused-vars: "off"*/
import React, { useEffect, useState } from "react"
import "./Tool.scss";
import _ from "lodash";
import { useIntl } from "react-intl";
// import { action } from "../Control/Action";
// import { AlertContext } from "../Context/AlertContext";
import axios from "axios";
import { SettingContext } from "../Context/SettingContext";
import { useContext } from "react";
import { host } from "../Lang/Contant";
import { ToolContext } from "../Context/ToolContext";



export default function Timer(props) {
    const { setting } = useContext(ToolContext)
    // const { alertDispatch } = useContext(AlertContext);
    const dataLang = useIntl();
    const [data, setData] = useState(props.data)
    const [setting2, setSetting] = useState(props.setting)
    const [timer, setTimer] = useState(props.setting.enable)
    const [dropvalue, setDropvalue] = useState(false)
    const [droptime, setDroptime] = useState(false)
    const [mem, setMem] = useState(1)
    const { currentID } = useContext(SettingContext)

    useEffect(function () {
        setData(props.data)
    }, [props.data])

    useEffect(function () {
        setSetting(props.setting)
    }, [props.setting])




    useEffect(function () {

        //console.log(timer)
        if (timer) {
            setting2.enable = true
           
        } else {
            setting2.enable = false
     
        }

        //console.log(setting2)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer])

    const handleOpen = (e) => {

        // console.log(e.currentTarget.id)
        var arr = e.currentTarget.id.split("_")
        // console.log(arr[3])
        setMem(arr[2])
        if (arr[3] === 'VALUE') {
            setDropvalue(true)
        } else {
            setDroptime(true)
        }
    }

    const handleClose = (e) => {

        // console.log(e.currentTarget.id)
        if (e.currentTarget.id === "VALUE") {
            setDropvalue(false)
        } else {
            setDroptime(false)
        }

    }

    const handleSettimer = (e) => {


        var id = e.currentTarget.id
        var value = e.currentTarget.value
        // console.log(id, value)
        var arr = id.split("_")
        if (arr[1] === 'value') {
            var val = document.getElementById(`${props.tab}_${props.id}_${value}_INPUTVALUE`)
            // console.log(val.value)
            if (val.value !== '') {
                var TIME = val.value
                setting2[value].input = val.value
                setting2[value].value = String(handlegetnum(eval(setting2.cal)))
                setDropvalue(false)
                // console.log(setting)
            }
        }

        if (arr[1] === 'time') {
            var time = document.getElementById(`${props.tab}_${props.id}_${value}_INPUTTIME`)
            // console.log(time.value)
            if (time.value !== '') {
                setting2[value].time = time.value + ":00"
                setDroptime(false)
                // console.log(setting2)
            }
        }
    }


    const handlegetnum = (numstring) => {
        try {
            var x = eval(numstring)
            return parseInt(x);
        } catch (e) {
            return 0;
        }
    }

    const handleSave = (e) => {

        console.log(JSON.stringify(setting2))
        axios.post(host.TIME +"/setData", { id: currentID, data: JSON.stringify(setting2) }, { secure: true, reconnect: true }).then(
            function (res) {
                if (res.data.status) {
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
                } else {
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_2" }), show: 'block' }))
                }
            })




        axios.post(host.DEVICE + "/setRegisterDevice", { id: currentID, data: JSON.stringify(setting[props.tab]), tab: props.tab }, { secure: true, reconnect: true }).then(
            function (res) {
                if (res.data) {
                    // console.log("save dat visual", res.data)
                    //alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))

                } else {
                    //alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
                }

            })


    }

    // const handlegetnum = (numstring) => {
    //     try {
    //         var x 
    //         switch (setting.base) {
    //             case '10':
    //                 x = parseInt(eval(numstring));
    //                 break;
    //             case '16':
    //                 var n = eval(numstring)
    //                 if (n < 0) {
    //                     n = 0xFFFFFFFF + n + 1;
    //                    } 
    //                 x = parseInt(n, 10).toString(16);
    //                 break
    //             default:
    //                 var b =  setting.base.split("_")
    //                 const numberToConvert = eval(numstring);
    //                 const numberOfBits = 16; // 32-bits binary
    //                 const arrBitwise = [0]; // save the resulting bitwise

    //                 for (let i = 0; i < numberOfBits; i++) {
    //                     let mask = 1;

    //                     const bit = numberToConvert & (mask << i); // And bitwise with left shift

    //                     if (bit === 0) {
    //                         arrBitwise[i] = 0;
    //                     } else {
    //                         arrBitwise[i] = 1;
    //                     }
    //                 }

    //                 const binary = arrBitwise.reverse().join("");

    //                 x = binary[15 - b[1]]
    //                 //console.log(binary,x)
    //                 break;

    //         }




    //         return x
    //     } catch (e) {
    //         return 0;
    //     }
    // }


    return (
        <>
            <div className="DAT_Timer" style={{ height: props.height + "px" }}>
                <div className="DAT_Timer-control" style={{ display: (dropvalue) ? 'block' : 'none', height: props.height + "px" }}>
                    <div className="DAT_Timer-control-number">
                        <div className="DAT_Timer-control-number-close" id="VALUE" onClick={e => handleClose(e)}><ion-icon name="close-outline"></ion-icon></div>
                        <div className="DAT_Timer-control-number-tit">Đặt Giá Trị</div>
                        <div className="DAT_Timer-control-number-group">
                            <input type="number" id={`${props.tab}_${props.id}_${mem}_INPUTVALUE`} placeholder={handlegetnum(setting2[mem].input)}></input>
                            <button value={mem} id='edit_value' onClick={(e) => handleSettimer(e)}>Chọn</button>
                        </div>
                    </div>
                </div>
                <div className="DAT_Timer-control" style={{ display: (droptime) ? 'block' : 'none', height: props.height + "px" }} >
                    <div className="DAT_Timer-control-number">
                        <div className="DAT_Timer-control-number-close" id="TIME" onClick={e => handleClose(e)}><ion-icon name="close-outline"></ion-icon></div>
                        <div className="DAT_Timer-control-number-tit">Đặt Thời Gian</div>
                        <div className="DAT_Timer-control-number-group">
                            <input type="time" id={`${props.tab}_${props.id}_${mem}_INPUTTIME`}></input>
                            <button value={mem} id='edit_time' onClick={(e) => handleSettimer(e)}>Chọn</button>
                        </div>
                    </div>
                </div>

                <div className="DAT_Timer-tb" style={{ height: (props.height - 20) + "px" }}>
                    <div className="DAT_Timer-tb-tit">Chu trình theo thời gian</div>

                    <div className="DAT_Timer-tb-content">

                        <table style={{ width: "100%", height: "100%", border: "solid 1px gray" }}>
                            <tbody >
                                <tr style={{ color: "blueviolet", fontSize: "16px", borderBottom: "solid 1px gray" }}>
                                    <th style={{ width: "80px", borderRight: "solid 1px gray", padding: "10px" }}>Bước chu trình</th>
                                    <th style={{ borderRight: "solid 1px gray", padding: "10px" }}>Khoảng thời gian (Giờ:Phút)</th>
                                    <th style={{ width: "80px", padding: "10px" }}>Giá trị đặt ({setting2.unit})</th>

                                </tr>
                                {_.times(8, (i) => (
                                    <tr key={i} style={{ color: "gray", fontSize: "16px", borderBottom: "solid 1px gray" }}>
                                        <th style={{ borderRight: "solid 1px gray", padding: "10px" }} >{i + 1}</th>
                                        <th style={{ borderRight: "solid 1px gray", padding: "10px", cursor: "pointer" }} id={`${props.tab}_${props.id}_${i + 1}_TIME`} onClick={e => handleOpen(e)}>
                                            {setting2[i + 1].time.split(":")[0] + ":" + setting2[i + 1].time.split(":")[1]}
                                        </th>
                                        <th style={{ padding: "10px", cursor: "pointer" }} id={`${props.tab}_${props.id}_${i + 1}_VALUE`} onClick={e => handleOpen(e)}>{setting2[i + 1].input}</th>
                                    </tr>
                                ))}


                            </tbody>
                        </table>

                    </div>
                    <div className="DAT_Timer-box">
                        Bật chế độ chu trình&nbsp;
                        <input
                            id="savepwd"
                            type="checkbox"
                            checked={timer}
                            onChange={e => setTimer(e.target.checked)}
                        />

                        <label htmlFor="savepwd" />
                        
                        <button onClick={e => handleSave(e)} >Cài</button>
                        

                    </div>

                </div>
            </div>


        </>
    )
}