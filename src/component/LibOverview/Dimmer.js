/* eslint no-eval: 0 */
/* eslint no-unused-vars: "off"*/
import React, { useContext, useEffect, useState } from "react"
import "../Lib/Tool.scss";
// import { action } from "../Control/Action";
import { useIntl } from "react-intl";
// import { AlertContext } from "../Context/AlertContext";
import axios from "axios";
import { host } from "../Lang/Contant";
import { Slider } from "@mui/material";
import { useSelector } from "react-redux";
import { Token } from "../../App";
import { callApi } from "../Api/Api";
import { alertDispatch } from "../Alert/Alert";


export default function Dimmer(props) {
    const token = useSelector((state) => state.admin.token)
    const dataLang = useIntl();
    // const { alertDispatch } = useContext(AlertContext);
    const [data, setData] = useState(props.data)
    const [setting, setSetting] = useState(props.setting)
    const [marks, setMarks] = useState([]);

    const markConfig = (step) => {
        let marks = [];
        for (
            let i = parseInt(setting[props.id].min);
            i <= parseInt(setting[props.id].max);
            i += step
        ) {
            if (
                i === parseInt(setting[props.id].min) ||
                i === parseInt(setting[props.id].max)
            ) {
                marks.push({ value: i, label: i });
            } else {
                marks.push({ value: i });
            }
        }
        setMarks(marks);
        console.log(marks);
    };

    useEffect(() => {
        markConfig(parseInt(setting[props.id].step));
    }, [setting[props.id].step, setting[props.id].min, setting[props.id].max]);


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

    const handleSlider = async (e) => {

        var sliderarry = e.target.name.split("_")
        var DIM = e.target.value
        setting[sliderarry[2]].default = e.target.value
        // console.log(setting[sliderarry[2]])
        //settingDispatch({ type: "LOAD_STATE", payload: false })
        // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_19" }), show: 'block' }))
        // console.log(sliderarry[0],setting[sliderarry[2]].register,parseInt(eval(setting[sliderarry[2]].cal)) )

        const res = await remotecloud('{"deviceCode": "' + sliderarry[0] + '","address":"' + setting[sliderarry[2]].register + '","value":"' + parseInt(eval(setting[sliderarry[2]].cal)) + '"}', Token.value.token);

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

    const hori = {
        display: "flex",
        width: props.width +"px",
        height:props.height+"px",
        justifyContent:"center",
        paddingTop:"14px"
    }

    const verti = {
        display: "flex",
        width: props.width +"px",
        height:props.height+"px",
        alignItems:"center",
        paddingLeft:"36px"
    }

    const green500 = "#228b22";
    const green900 = "#7FFF00";


    

    return (
        <div className={props.deviceid + "_" + props.tab + "_" + props.id + "_slider"}
            style={setting[props.id].ori === "horizontal"? hori :verti }
        >
            <Slider

                style={{
                    height:  (props.height-40) + "px",
                    width: (props.width-40) + "px",
                }}
                sx={{
                    
                    "& .MuiSlider-thumb":{
                        backgroundColor: setting[props.id].thumbbgcolor,
                        borderRadius: setting[props.id].thumbradius + "px"

                    },
                    "& .MuiSlider-track": {
                        backgroundColor: setting[props.id].trackbgcolor,
                        borderRadius: setting[props.id].trackradius + "px"
                    },
                    "& .MuiSlider-rail": {
                        backgroundColor: setting[props.id].railbgcolor,
                        borderRadius: setting[props.id].trackradius + "px"
                    }
                }}
                name={props.deviceid + "_" + props.tab + "_" + props.id + "_SLIDER"}
                aria-label="Always visible"
                value={eval(parseInt(setting[props.id].default))}
                onChange={(e) => handleSlider(e)}
                valueLabelDisplay="auto"
                step={parseInt(setting[props.id].step)}
                marks={marks}
                min={parseInt(setting[props.id].min)}
                max={parseInt(setting[props.id].max)}
                track="normal"
                size="medium"
                // orientation set chieu ('horizontal' ngang | 'vertical' doc)
                orientation={setting[props.id].ori}
                
            />
        </div>
    )
}