/* eslint no-unused-vars: "off"*/

import React, { useContext, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import "./Tool.scss"
import { ToolContext } from "../Context/ToolContext";
import Circle from "./Circle";

import Elevroom from "./Elevroom";
import Status from "./Status";
import Switch from "./Switch"
import Input from "./Input";
import Dimmer from "./Dimmer";
import Value from "./Value";
import Note from "./Note";
import Valuev2 from "./Valuev2";
import Arrow from "./Arrow";
import Led from "./Led";
import Icon from "./Icon";
import Timer from "./Timer";
//import disableScroll from 'disable-scroll';
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
//import { EnvContext } from "../Context/EnvContext";
import axios from "axios";
import LineChart from "./LineChart";
import { SettingContext } from "../Context/SettingContext";
import Gauge from "./Gauge";
import Picture from "./Picture";
import SwitchToggle from "./SwitchToggle";
import { useSelector } from "react-redux";
import { host } from "../Lang/Contant";
import Tablepro from "./Tablepro";
import View32bit from "./View32bit";


import { Token, ruleInfor, socket } from '../../App'
import { TbSettingsCog } from "react-icons/tb";
import { signal } from "@preact/signals-react";
import { ImConnection } from "react-icons/im";
import { callApi } from "../Api/Api";
import { isBrowser } from "react-device-detect";
const show = signal(true)

export default function Interface(props) {
    const type = useSelector((state) => state.admin.type)

    //const { token } = useContext(EnvContext);
    const intervalIDRef = useReducer(null);
    const [invt, setInvt] = useState({})
    //const [data, setData] = useState()
    const { config, setting, visual, toolDispatch } = useContext(ToolContext)
    const { currentName } = useContext(SettingContext)
    const [dropdowm, setDropdown] = useState(false)
    // const [isZoomSVG, setIsZoomSVG] = useState(false)
    const [zoom, setZoom] = useState(true)
    const [step, setStep] = useState(0)



    useEffect(() => {

        var i = 0
        var startTimer = () => {

            intervalIDRef.current = setInterval(async () => {
                i += 1
                if (i === 5) {
                    show.value = false
                }
            }, 1000);
        };
        var stopTimer = () => {
            clearInterval(intervalIDRef.current);
            intervalIDRef.current = null;
        };

        if (show) {

            startTimer();
        } else {
            stopTimer()
        }

        return () => {

            clearInterval(intervalIDRef.current);
            intervalIDRef.current = null;

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show.value])


    useEffect(function () {
        // console.log(props.sn, Token.value.token)
        var loaddata = async () => {
            const res = await cloud('{"deviceCode":"' + props.sn + '"}', Token.value.token);
            // console.log(res)
            if (res.ret === 0) {
                setInvt(res.data)
                // console.log(res.data.enabled)


                let res_ = await callApi("post", host.DATA + "/updateStateLogger", {
                    sn: props.sn,
                    state: res.data.enabled
                })

                console.log(res_)



                setStep(1)
            } else {
                //alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_42" }), show: 'block' }))
            }
        };


        if (step === 0) {
            loaddata();
        } else {
            console.log(invt)
            try {
                socket.value.on("Server/" + props.sn, function (data) {
                    if (data.deviceid === props.sn) {
                        console.log("Toollist socket")
                        //console.log(data.data)
                        Object.keys(data.data).map((keyName, i) => {
                            setInvt(invt => ({ ...invt, [keyName]: data.data[keyName] }))
                        })
                    }
                })

                socket.value.on("Server/up/" + props.sn, function (data) {
                    if (data.deviceid === props.sn) {
                        console.log("Toollist up")
                        setInvt(invt => ({ ...invt, enabled: '1' }))

                    }
                })

                socket.value.on("Server/down/" + props.sn, function (data) {
                    if (data.deviceid === props.sn) {
                        console.log("Toollist down")
                        setInvt(invt => ({ ...invt, enabled: '0' }))
                    }
                })
                // props.socket.current.on("Server/" + props.id, function (data) {
                //     if (data.deviceid === props.id) {
                //         console.log("Toollist socket")
                //         //console.log(data.data)
                //         Object.keys(data.data).map((keyName, i) => {
                //             setInvt(invt => ({ ...invt, [keyName]: data.data[keyName] }))
                //         })
                //     }
                // })

                // props.socket.current.on("Server/up/" + props.id, function (data) {
                //     if (data.deviceid === props.id) {
                //         console.log("Toollist up")
                //         setInvt(invt => ({ ...invt, enabled: '1' }))

                //     }
                // })
                // props.socket.current.on("Server/down/" + props.id, function (data) {
                //     if (data.deviceid === props.id) {
                //         console.log("Toollist down")
                //         setInvt(invt => ({ ...invt, enabled: '0' }))


                //     }
                // })

            } catch (error) {
                console.log(error)
            }



        }
        return () => {
            //console.log("UnMounting Interface")
            socket.value.off("Server/" + props.sn);
            socket.value.off("Server/up/" + props.sn)
            socket.value.off("Server/down/" + props.sn)
            // props.socket.current.off("Server/" + props.id);
            // props.socket.current.off("Server/up/" + props.id)
            // props.socket.current.off("Server/down/" + props.id)
        }

    }, [step])



    const ZoomState = () => {
        if (zoom) {
            setZoom(false)
        } else {
            setZoom(true)
        }
    }

    const cloud = async (data, token) => {

        var reqData = {
            "data": data,
            "token": token
        };

        try {

            const response = await axios({
                url: host.CLOUD,
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

    const visdata = (type, deviceid, sn, tab, id, w, h) => {


        switch (type) {
            case 'circle':
                return <Circle deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'lineChart':
                return <LineChart deviceid={deviceid} sn={sn} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'switch':
                return <Switch deviceid={deviceid} sn={sn} tab={tab} id={id} data={invt} setting={setting[tab]} width={w} height={h} />
            case 'switchtoggle':
                return <SwitchToggle deviceid={deviceid} sn={sn} tab={tab} id={id} data={invt} setting={setting[tab]} width={w} height={h} />
            case 'input':
                return <Input deviceid={deviceid} sn={sn} tab={tab} id={id} data={invt} setting={setting[tab]} width={w} height={h} />
            case 'text':
                return <Note deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'view':
                return <Value deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'view2':
                return <Valuev2 deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'slider':
                return <Dimmer deviceid={deviceid} sn={sn} tab={tab} id={id} data={invt} setting={setting[tab]} width={w} height={h} />
            case 'elev':
                return <Elevroom deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'status':
                return <Status deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'arrow':
                return <Arrow deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'led':
                return <Led deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'icon':
                return <Icon deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'timer':
                return <Timer deviceid={deviceid} sn={sn} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'gauge':
                return <Gauge deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'picture':
                return <Picture deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'tablepro':
                return <Tablepro deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'view32bit':
                return <View32bit deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            default:
                return <></>
        }


    }


    const Controls = () => {
        const { zoomIn, zoomOut, resetTransform } = useControls();
        return (
            <>


                {(zoom)
                    ? <>
                        <div className="DAT_zoom" style={{ bottom: "10px", right: "10px" }} onClick={() => ZoomState()}>
                            <ion-icon name="hand-left-outline"></ion-icon>
                        </div>

                    </>
                    : <>
                        <div className="DAT_zoom" style={{ bottom: "10px", right: "130px" }} onClick={() => resetTransform()}>
                            <ion-icon name="expand-outline"></ion-icon>
                        </div>
                        <div className="DAT_zoom" style={{ bottom: "10px", right: "90px" }} onClick={() => zoomIn()}>
                            <ion-icon name="add-outline"></ion-icon>
                        </div>
                        <div className="DAT_zoom" style={{ bottom: "10px", right: "50px" }} onClick={() => zoomOut()}>
                            <ion-icon name="remove-outline"></ion-icon>
                        </div>
                        <div className="DAT_zoom" style={{ bottom: "10px", right: "10px" }} onClick={() => ZoomState()}>
                            <ion-icon name="close-outline"></ion-icon>

                        </div>
                    </>

                }



            </>
        );
    };



    useEffect(() => {
        var card = document.getElementById("CARD")
        var svgcontainner = document.getElementById("SVGCONTAINNER")
        var svgview = document.getElementById("SVGVIEW")
        if (window.innerWidth >= 1500) {
            svgview.style.transform = "scale(1)"
            svgview.style.width = '1500px'
        } else {
            svgview.style.transform = "scale(" + card.offsetWidth / 1500 + ")"
            svgview.style.width = svgcontainner.offsetWidth / (card.offsetWidth / 1500)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    //Vào trang cài dặt
    const handleConfig = (e) => {

        //config[props.tab].stt = true

        toolDispatch({
            type: "SET_CONFIG", payload: {
                ...config,
                [props.tab]: {
                    stt: true
                }
            }
        })

    }



    //scale khi Thay đổi kích thước màn hình
    function handleWindowResize() {

        var card = document.getElementById("CARD")
        var svgcontainner = document.getElementById("SVGCONTAINNER")
        var svgview = document.getElementById("SVGVIEW")
        if (config[props.tab].stt === false) {


            if (window.innerWidth >= 1500) {
                svgview.style.transform = "scale(1)"
                svgview.style.width = '1500px'

            } else {

                svgview.style.transform = "scale(" + card.offsetWidth / 1500 + ")"
                svgview.style.width = svgcontainner.offsetWidth / (card.offsetWidth / 1500)

            }


        } else {

        }
    }

    //...
    useEffect(function () {
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);








    return (
        <>

            <div className="DAT_Tool"
                onClick={() => { show.value = true }}
            // onMouseEnter={(e) => { disableScroll.on() }}
            // onMouseLeave={(e) => { disableScroll.off() }}
            >


                {show.value
                    ? <>
                        {/* {isBrowser
                            ?
                            ruleInfor.value.setting.screen.modify
                                ? <div className="DAT_ToolConfig" onClick={(event) => { handleConfig(event) }} style={{ top: "10px", right: "10px" }}>
                                    <TbSettingsCog size={20} />
                                </div>
                                : <></>
                            : <></>
                        } */}

                        


                        <div className="DAT_Tool_Connect" style={{ bottom: "10px", left: "10px" }} >
                            {(invt !== undefined)
                                ? (invt['enabled'] === '1')
                                    ? <ImConnection size={20} color="green" />
                                    : <ImConnection size={20} color="gray" />
                                : <img alt="" style={{ width: "20px" }} src="/lib/offline_state.png"></img>
                            }
                        </div>

                        <div className="DAT_Name" style={{ bottom: "10px", left: "50px" }}>
                            {currentName}
                        </div>
                    </>
                    : <></>
                }

                <div className="DAT_Tool_SVG" >
                    <TransformWrapper
                        //centerOnInit
                        panning={{ disabled: zoom, excluded: ["input"] }}
                        wheel={{ disabled: zoom }}
                        pinch={{ disabled: zoom }}
                        doubleClick={{ disabled: zoom }}
                    //defaultScale={1.2}
                    >
                        <Controls />
                        <div className="DAT_Tool_SVG-content" id="SVGCONTAINNER">
                            <TransformComponent >
                                <svg id="SVGVIEW" className="DAT_Tool_SVG-content-view">

                                    {visual[props.tab].map((data, index) => (
                                        <foreignObject key={data.id} x={data.x} y={data.y} width={data.w} height={data.h}
                                            style={{ border: "solid 1px rgb(219, 219, 219,0)" }}
                                        >
                                            <div className="DAT_Edit">
                                                {visdata(data.type, props.id, props.sn, props.tab, data.id, data.w, data.h-2)}
                                            </div>
                                        </foreignObject>
                                    ))}
                                </svg>
                            </TransformComponent>
                        </div>
                    </TransformWrapper>
                </div>




            </div >


        </>
    )
}