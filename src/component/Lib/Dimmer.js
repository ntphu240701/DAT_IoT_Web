/* eslint no-eval: 0 */
/* eslint no-unused-vars: "off"*/
import React, { useContext, useEffect, useState } from "react"
import "./Tool.scss";
import { action } from "../Control/Action";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import axios from "axios";
import { host } from "../constant";
import { Slider } from "@mui/material";
import { useSelector } from "react-redux";


export default function Dimmer(props) {
    const token = useSelector((state) => state.admin.token)
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
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
        console.log(sliderarry)

        var DIM = e.target.value
        //console.log(settingDATA)
        setting[sliderarry[2]].default = e.target.value
        console.log(setting[sliderarry[2]])
        //settingDispatch({ type: "LOAD_STATE", payload: false })
        alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_19" }), show: 'block' }))
        console.log(sliderarry[0],setting[sliderarry[2]].register,parseInt(eval(setting[sliderarry[2]].cal)) )

        const res = await remotecloud('{"deviceCode": "' + sliderarry[0] + '","address":"' + setting[sliderarry[2]].register + '","value":"' + parseInt(eval(setting[sliderarry[2]].cal)) + '"}', token);

        console.log(res)
        if (res.ret === 0) {
            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
            axios.post(host.DEVICE + "/setRegisterDevice", { id: sliderarry[0], data: JSON.stringify(setting), tab: sliderarry[1] }, { secure: true, reconnect: true }).then(
                function (res) {
                    if (res.data) {
                        console.log("save dat true")
                    } else {
                        console.log("save dat false")
                    }
                })
        } else {
            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
        }


        //




        // axios.post(host.DEVICE + "/setRegister", { id: sliderarry[0], data: JSON.stringify(setting), tab: sliderarry[1] }, { secure: true, reconnect: true }).then(
        //         function (res) {


        //                 if (res.data) {
        //                         console.log("save dat true")

        //                         axios.post(host.DEVICE + "/setDevice", { data: '{"deviceCode": "' + sliderarry[0] + '","address":"' + setting[sliderarry[2]].register + '","value":"' + parseInt(eval(setting[sliderarry[2]].cal)) + '"}', token: token }, { secure: true, reconnect: true }).then(
        //                                 function (res) {
        //                                         if (res.data.ret === 0) {
        //                                                 console.log("save invt true")
        //                                                 //settingDispatch({ type: "LOAD_STATE", payload: true })
        //                                                 alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))

        //                                         } else {
        //                                                 console.log("save invt false")
        //                                                 //settingDispatch({ type: "LOAD_STATE", payload: true })
        //                                                 alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
        //                                         }

        //                                         //alertDispatch(action('LOAD_CONTENT',{content:dataLang.formatMessage({id:"alert_5"}),show:'block'}))
        //                                 })
        //                 } else {
        //                         console.log("save dat false")
        //                 }
        //         })



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