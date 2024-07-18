import React, { useContext, useEffect, useLayoutEffect, useReducer, useState } from "react";
import "./Tooloverview.scss"
import axios from "axios";
import { action } from "../Control/Action";
//import { EnvContext } from "../Context/EnvContext";
import { SettingContext } from "../Context/SettingContext";
// import Calculateoverview from "./Calculateoverview";
// import Configoverview from "./Configoverview";
import Interfaceoverview from "./Interfaceoverview";
import { OverviewContext } from "../Context/OverviewContext";
import { isBrowser } from 'react-device-detect';
// import Reducer, { INITSTATE } from "./Reducer";
import DataTable from 'react-data-table-component';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
//     Filler,
//     BarElement,
//     ArcElement,
// } from 'chart.js';


// import Chart from 'chart.js/auto';
// import zoomPlugin from "chartjs-plugin-zoom";


// import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { host } from "../Lang/Contant";
// import { AlertContext } from "../Context/AlertContext";
import { useIntl } from "react-intl";
import { io } from "socket.io-client";
import adminslice from "../Redux/adminslice";
import moment from "moment-timezone";
import { effect, signal } from "@preact/signals-react";
import { IoIosAddCircle, IoIosArrowDown, IoIosCloseCircle } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
// import Default from "../Default/Default";
// import { pageDefault, view } from "../../App";
import { Token, socket } from '../../App'
import GoogleMap from "google-maps-react-markers";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { searchmoblile } from "../MenuTop/MenuTop";
import { LuFolderEdit } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
// Chart.register(zoomPlugin);
import { useMobileOrientation } from 'react-device-detect';
import { IoPhoneLandscapeOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { Loader } from "@googlemaps/js-api-loader";
import { listDevice, mode } from "../Control/Signal";

const report = signal(0)
export const overview = signal(false)
export const whatdevicegroup = signal({ id: '', groupid: '', tab: '' })




export default function Tooloverview(props) {
    // const { alertDispatch } = useContext(AlertContext);
    const dataLang = useIntl();
    const [online, setOnline] = useState(0)
    const [offline, setOffline] = useState(0)
    const { listdevice, settingDispatch } = useContext(SettingContext)
    const { overview_config, overview_control, overview_name, overviewDispatch } = useContext(OverviewContext)
    // const token = useSelector((state) => state.admin.token)
    //const socket_client = useRef(io(host.DEVICE));
    const [step, setStep] = useState(0)
    const rootDispatch = useDispatch()
    const { isLandscape } = useMobileOrientation()
    const popup_state = {
        pre: { transform: "rotate(0deg)", transition: "0.5s", color: "rgba(11, 25, 103)" },
        new: { transform: "rotate(90deg)", transition: "0.5s", color: "rgba(11, 25, 103)" }
    }

    const handlePopup = (state) => {
        const popup = document.getElementById("Popup")
        popup.style.transform = popup_state[state].transform;
        popup.style.transition = popup_state[state].transition;
        popup.style.color = popup_state[state].color;
    }




    const [invt, setInvt] = useState(() => {
        var x = {}
        listDevice.value.map((data, index) => {

            return x[data.sn_] = {}
        })
        return x
    })




    const invtCloud = async (data, token) => {

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










    /// read data
    useEffect(() => {
        //console.log(listdevice)

        var loaddata = async (id) => {
            const res = await invtCloud('{"deviceCode":"' + id + '"}', Token.value.token);
            // console.log(res)
            if (res.ret === 0) {
                setInvt(pre => ({ ...pre, [id]: res.data }))
                setStep(1)
            } else {
                setInvt(pre => ({ ...pre, [id]: {} }))
            }

        };
        var socket_io = async (id) => {
            try {
                socket.value.on("Server/" + id, function (data) {
                    //var check =  listdevice.filter(d => d.deviceid === data.deviceid)
                    console.log("Tooloverview socket")
                    // if(check.length === 1){
                    Object.keys(data.data).map((keyName, i) => {
                        setInvt(pre => ({
                            ...pre,
                            [data.deviceid]: {
                                ...pre[data.deviceid],
                                [keyName]: data.data[keyName]
                            }
                        }))
                    })
                    // }

                })

                socket.value.on("Server/up/" + id, function (data) {

                    console.log("Tooloverview up")
                    Object.keys(data.data).map((keyName, i) => {
                        setInvt(pre => ({
                            ...pre,
                            [data.deviceid]: {
                                ...pre[data.deviceid],
                                enabled: '1'
                            }
                        }))
                    })


                })
                socket.value.on("Server/down/" + id, function (data) {

                    console.log("Tooloverview down")
                    Object.keys(data.data).map((keyName, i) => {
                        setInvt(pre => ({
                            ...pre,
                            [data.deviceid]: {
                                ...pre[data.deviceid],
                                enabled: '0'
                            }
                        }))
                    })



                })



            } catch (error) {
                console.log(error)
            }
        }

        if (step === 0) {
            // console.log(listDevice.value)
            listDevice.value.map((data, index) => {
                return loaddata(data.sn_)
            })
        } else {
            if (mode.value === 'dashboard') {
                console.log(invt)
                listDevice.value.map((data, index) => {
                    //console.log("hello")
                    return socket_io(data.sn_)
                })

            }
        }

        return () => {

            listDevice.value.map((data, index) => {

                socket.value.off("Server/" + data.deviceid)
                socket.value.off("Server/up/" + data.deviceid)
                socket.value.off("Server/down/" + data.deviceid)

            })

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step, listDevice.value, mode.value])





    const handleTabCheck = () => {
        mode.value = 'overview'
        listDevice.value.map((data, index) => {

            socket.value.off("Server/" + data.sn_)
            socket.value.off("Server/up/" + data.sn_)
            socket.value.off("Server/down/" + data.sn_)

        })

        overviewDispatch({
            type: "SET_CONFIG",
            payload: false,
        })

    }






    return (
        <>
            <div className="DAT_ToolOverview">


                <div className="DAT_ToolOverview_Overview">

                    <div className="DAT_ToolOverview_Overview_Container">
                        <div className="DAT_ToolOverview_Overview_Container_Head">
                            <div className="DAT_ToolOverview_Overview_Container_Head_Tit">
                                {overview_name}
                            </div>
                            <div className="DAT_ToolOverview_Overview_Container_Head_Close"
                                onClick={(e) => handleTabCheck(e)}
                                id="Popup"
                                onMouseEnter={(e) => handlePopup("new")}
                                onMouseLeave={(e) => handlePopup("pre")}
                            >
                                <IoMdClose size={20} />
                            </div>

                        </div>
                        <div className="DAT_ToolOverview_Overview_Container_Content" id="CARDOVERVIEW" style={{ padding: "10px" }}>

                            {(overview_config)
                                ? <>
                                    {/* <Configoverview id={props.projectid} type={props.type} invt={invt} />
                                    {(overview_control.stt)
                                        ? <Calculateoverview id={props.projectid} invt={invt} />
                                        : <></>
                                    } */}
                                </>
                                : <Interfaceoverview id={props.projectid} type={props.code} invt={invt} />
                            }
                        </div>
                    </div>
                    {isLandscape
                        ? <></>
                        :

                        <div className="DAT_Landscape" >
                            <div className="DAT_Landscape_cancel" onClick={(e) => handleTabCheck(e)} ><div className="DAT_Landscape_cancel_icon"  ><span>Thoát</span></div></div>
                            <div className="DAT_Landscape_content" >
                                <div className="DAT_Landscape_content_tit">Embody</div>
                                <div className="DAT_Landscape_content_ver">Phiên bản: {process.env.REACT_APP_VER}</div>
                                <div className="DAT_Landscape_content_note">Bạn vui lòng chuyển sang chế độ Landscape bằng cách xoay ngang thiết bị của bạn</div>
                            </div>


                        </div>

                    }
                </div>



            </div >

        </>
    )
}