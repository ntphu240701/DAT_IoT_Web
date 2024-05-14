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



export default function Switch(props) {
    const token = useSelector((state) => state.admin.token)
    const dataLang = useIntl();
    // const { alertDispatch } = useContext(AlertContext);
    const [data, setData] = useState(props.data)
    const [setting, setSetting] = useState(props.setting)


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
        //console.log(props.data)
    }, [props.data])

    useEffect(function () {
        setSetting(props.setting)
        //console.log("switch", setting)
    }, [props.setting])


    //check trạng thái điều khiển
    useEffect(function () {


        var sw = document.getElementById(props.deviceid + "_" + props.tab + "_" + props.id + "_SW")

        //console.log(props.id,setting)
        if (setting[props.id].stt === 'on') {
            sw.checked = true
        } else {
            sw.checked = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const handleSwitch = async (e) => {

        let switchArray = e.currentTarget.id.split("_");
        var NUMB;

        if (e.currentTarget.checked) {
            setting[switchArray[2]].stt = 'on'
            NUMB = setting[switchArray[2]].on
            //console.log("ON:",settingDATA[switchArray[2]].on,settingDATA[switchArray[2]].show,eval(settingDATA[switchArray[2]].cal),settingDATA[switchArray[2]].register)

        } else {
            setting[switchArray[2]].stt = 'off'
            NUMB = setting[switchArray[2]].off
            //console.log("OFF:",settingDATA[switchArray[2]].off,settingDATA[switchArray[2]].show,eval(settingDATA[switchArray[2]].cal),settingDATA[switchArray[2]].register)
        }


        const res = await remotecloud('{"deviceCode": "' + switchArray[0] + '","address":"' + setting[switchArray[2]].register + '","value":"' + parseInt(eval(setting[switchArray[2]].cal)) + '"}', Token.value.token);

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


    }


    return (


        <div className="DAT_Switch">
            <label className="DAT_Switch-box" style={{ width: props.width + "px", height: props.height + "px" }}>
                <input type="checkbox" className="DAT_Switch-box-check" id={props.deviceid + "_" + props.tab + "_" + props.id + "_SW"}

                    onChange={(e) => handleSwitch(e)}

                />
                <span className="DAT_Switch-box-slider" ></span>
            </label>
        </div>




    )
}