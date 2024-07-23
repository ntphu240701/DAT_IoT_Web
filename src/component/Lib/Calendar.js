import React, { useEffect, useState } from 'react';
import "./Tool.scss";
import { host } from '../Lang/Contant';
import { callApi } from '../Api/Api';
import { alertDispatch } from '../Alert/Alert';
import { useIntl } from 'react-intl';
import moment from 'moment-timezone';
import { HiOutlineCalendarDays } from 'react-icons/hi2';
function Calendar(props) {
    const [data, setData] = useState(props.data)
    const [setting, setSetting] = useState(props.setting)
    const dataLang = useIntl();
    const [auth, setAuth] = useState(false)
    const [pwd,setPwd] = useState(false)

    const hexToRgbA = (hex, opacity) => {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
        }
        throw new Error('Bad Hex');
    }

    useEffect(function () {
        setData(props.data)
    }, [props.data])

    useEffect(function () {
        setSetting(props.setting)
    }, [props.setting])


    useEffect(function () {
        if(auth){
            var getcalendar = document.getElementById(props.deviceid + "_" + props.tab + "_" + props.id + "_GETINP")
            getcalendar.value = setting[props.id]?.date
        }
    }, [auth])


    const handleAuth = async (e) => {
        if (e.key === "Enter") {
            let InputArray = e.currentTarget.id.split("_");
            var get = document.getElementById(InputArray[0] + "_" + InputArray[1] + "_" + InputArray[2] + "_GETPWD")
           
            console.log(get.value)
            if(get.value == setting[InputArray[2]].pwd){
                setAuth(true)
            }else{
                setPwd(false)
                alertDispatch(dataLang.formatMessage({ id: "alert_18" }))
            }
        }
       
    }

    const handleInput = async (e) => {
        let InputArray = e.currentTarget.id.split("_");
        var get = document.getElementById(InputArray[0] + "_" + InputArray[1] + "_" + InputArray[2] + "_GETINP")
        setting[InputArray[2]].date = get.value
        let res = await callApi('post', host.DATA + "/updateRegisterScreen", { id: InputArray[0], setting: setting, tab: InputArray[1] })
        // console.log(res)
        if (res.status) {
            // console.log("save dat true")
            alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
            setAuth(false)
            setPwd(false)
        }
        // console.log(get.value)

    }

    return (
        <div className="DAT_Input" style={{ height: props.height + "px", width: (props.width - 2) + "px" }}>
            {auth ||  setting[props.id]?.ispwd === 'false'
                ? <input style={{ width: '100%', height: '100%', textAlign: setting[props.id]?.align || "left", fontSize: setting[props.id]?.size + "px" ?? "12px", color: setting[props.id]?.color || "black", backgroundColor: hexToRgbA(setting[props.id]?.bgcolor || "#FFFFFF", setting[props.id]?.opacity || "1"), borderRadius: setting[props.id]?.radius + "px" || "0px", border: `solid  ${setting[props.id]?.borderwidth || 1}px ${setting[props.id]?.bordercolor || "black"}` }} type="date" id={props.deviceid + "_" + props.tab + "_" + props.id + "_GETINP"} name="Value" defaultValue={setting[props.id]?.date} onChange={(e) => { handleInput(e) }}></input>
                : pwd
                    ?<input style={{ width: '100%', height: '100%', textAlign: setting[props.id]?.align || "left", fontSize: setting[props.id]?.size + "px" ?? "12px", color: setting[props.id]?.color || "black", backgroundColor: hexToRgbA(setting[props.id]?.bgcolor || "#FFFFFF", setting[props.id]?.opacity || "1"), borderRadius: setting[props.id]?.radius + "px" || "0px", border: `solid  ${setting[props.id]?.borderwidth || 1}px ${setting[props.id]?.bordercolor || "black"}` }} type="password" id={props.deviceid + "_" + props.tab + "_" + props.id + "_GETPWD"} name="Value" placeholder='Enter Password' onKeyDownCapture={(e) => { handleAuth(e) }}></input>
                    :<div style={{ gap: "10px", width: '100%',  height:  props.height + "px" ,   display: "flex", alignItems: setting[props.id]?.align || "left", justifyContent: setting[props.id]?.justify || "center",  fontSize: setting[props.id]?.size + "px" ?? "12px", color: setting[props.id]?.color || "black", backgroundColor: hexToRgbA(setting[props.id]?.bgcolor || "#FFFFFF", setting[props.id]?.opacity || "1"), borderRadius: setting[props.id]?.radius + "px" || "0px", border: `solid  ${setting[props.id]?.borderwidth || 1}px ${setting[props.id]?.bordercolor || "black"}` }} type="date" id={props.deviceid + "_" + props.tab + "_" + props.id + "_GETAUTH"}  onClick={(e) => { setPwd(true) }} >{moment(setting[props.id]?.date).format("MM/DD/YYYY")}<HiOutlineCalendarDays /></div>
            }
        </div>
    );
}

export default Calendar;