/* eslint no-eval: 0 */
/* eslint no-unused-vars: "off"*/
import React, { useContext, useEffect, useState } from "react"
import "../Lib/Tool.scss";
// import { action } from "../Control/Action";
import { useIntl } from "react-intl";
// import { AlertContext } from "../Context/AlertContext";
import axios from "axios";
import { host } from "../Lang/Contant";
import { useSelector } from "react-redux";
import { Token } from "../../App";
import { callApi } from "../Api/Api";
import { alertDispatch } from "../Alert/Alert";



export default function Input(props) {
    const token = useSelector((state) => state.admin.token)
    const dataLang = useIntl();
    // const { alertDispatch } = useContext(AlertContext);
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
        }
        throw new Error('Bad Hex');
    }

    const remotecloud = async (data, token) => {

        var reqData = {
            "data": data,
            "token": token
        };

        try {

            const response = await axios({
                url: host.RMCLOUD,
                method: "post",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: Object.keys(reqData).map(function (key) { return encodeURIComponent(key) + '=' + encodeURIComponent(reqData[key]) }).join('&'),
            });

            return response.data

        }

        catch (e) {
            return ({ ret: 1, msg: "cloud err" })
        }


    }





    useEffect(function () {
        setData(props.data)
    }, [props.data])

    useEffect(function () {
        setSetting(props.setting)
    }, [props.setting])

    const handleInput = async (e) => {

        console.log(props.plantid)
        if (e.key === "Enter") {
            let InputArray = e.currentTarget.id.split("_");
            var get = document.getElementById(InputArray[0] + "_" + InputArray[1] + "_" + InputArray[2] + "_GETINP")

            if (get.value !== '') {
                var INP = get.value
                setting[InputArray[2]].curr = get.value
                const res = await remotecloud('{"deviceCode": "' + InputArray[0] + '","address":"' + setting[InputArray[2]].register + '","value":"' + parseInt(eval(setting[InputArray[2]].cal)) + '"}', Token.value.token);
                console.log(res)
                if (res.ret === 0) {
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
                    let res = await callApi('post', host.DATA + "/updatePlantSetting", { id: props.plantid, setting: setting })
                  
                    if (res.status) {
                        // console.log("save dat true")
                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                    }

                } else {
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
                }
                console.log(setting[InputArray[2]])

            } else {
                //console.log("không được để trống")
                // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_1" }), show: 'block' }))
            }
        }



    }

    const handlegetnum = (numstring) => {
        try {
            var x = eval(numstring)
            return parseFloat(x).toFixed(1);
        } catch (e) {
            return 0;
        }
    }


    return (
        <div className="DAT_Input" style={{ height: props.height + "px", width: props.width + "px" }}>
            <input style={{ width: (props.width - 2) + "px", height: (props.height - 2) + "px", textAlign: setting[props.id]?.align || "left", fontSize: setting[props.id]?.size + "px" ?? "12px", color: setting[props.id]?.color || "black", backgroundColor: hexToRgbA(setting[props.id]?.bgcolor || "#FFFFFF"), borderRadius: setting[props.id]?.radius + "px" || "0px", border: "solid 3px " + setting[props.id]?.bordercolor ?? "solid 3px black" }} type="number" id={props.deviceid + "_" + props.tab + "_" + props.id + "_GETINP"} name="Value" placeholder={handlegetnum(setting[props.id]?.curr || 0)} onKeyDownCapture={(e) => { handleInput(e) }}></input>
            {/* <button className="DAT_Input-save" style={{height:props.height+"px"}}   id={props.deviceid + "_" + props.tab + "_" + props.id + "_INP"} onClick={(e) => { handleInput(e) }}>Lưu</button> */}
        </div>
    )
}