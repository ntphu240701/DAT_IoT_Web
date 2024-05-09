import React, { useContext, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import "./Tool.scss"
// import Config from "./Config";
import { ToolContext } from "../Context/ToolContext";
import { SettingContext } from "../Context/SettingContext";
// import Calculate from "./Calculate";
import Interface from "./Interface";
import toolslice from "../Redux/toolslice";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { host } from "../Lang/Contant";
import { signal } from "@preact/signals-react";
import { PacmanLoader } from "react-spinners";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaFileExport } from "react-icons/fa6";
import { BiSolidMessageError } from "react-icons/bi";
import { SiPagespeedinsights } from "react-icons/si";
import { MdContactPhone } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
// import { AlertContext } from "../Context/AlertContext";
import { useIntl } from "react-intl";
// import { action } from "../Control/Action";
import { view } from "../../App";
import { useMobileOrientation } from 'react-device-detect';
import { IoPhoneLandscapeOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { plantState } from "../Control/Signal";
import { callApi } from "../Api/Api";
import { alertDispatch } from "../Alert/Alert";
const length = signal(0);
export const _tab = signal();

export default function Toollist(props) {
    const dataLang = useIntl();
    const { name, config, control, toolDispatch } = useContext(ToolContext)
    const { lasttab, defaulttab, currentID, currentSN, screen, settingDispatch } = useContext(SettingContext)
    const [tab, setTab] = useState(String(defaulttab))
    const [searchmoblile, setSearchmoblile] = useState(false)
    const rootDispatch = useDispatch()
    const lang = useIntl();
    const [statetab, setStatetab] = useState(false)
    const type = useSelector((state) => state.admin.type)
    //const user = useSelector((state) => state.admin.user)
    const { isLandscape } = useMobileOrientation()







    const handleWindowResize = () => {
        if (window.innerWidth >= 800) {
            setSearchmoblile(true)
        } else {
            setSearchmoblile(false)
        }
    }

    useEffect(function () {
        window.addEventListener('resize', handleWindowResize);
    }, []);



    useEffect(() => {
        length.value = Object.keys(name).length

        if (window.innerWidth >= 800) {
            setSearchmoblile(true)
        } else {
            setSearchmoblile(false)
        }

        setTab(String(defaulttab))
    }, [defaulttab, name])

    const handleTab = (e) => {
        const ID = e.currentTarget.id
        setTab(ID)
        _tab.value = ID
    }

    const handleTabMobile = (e) => {
        const ID = e.currentTarget.id
        _tab.value = ID
        setTab(ID)
        setStatetab(false)
    }


    const handleTabclose = () => {
        // rootDispatch(toolslice.actions.setstatus(false))
        toolDispatch({ type: "RESET_TOOL", payload: [] })
        settingDispatch({ type: "REMOVE_CURRENTID", payload: '' })

        plantState.value = "info"
    }

    const handleAdd = async (event) => {



        let tab = parseInt(lasttab) + 1
        let name = String("Màn hình " + tab)
        console.log(currentID, currentSN)
        settingDispatch({ type: "ADD_SCREEN", payload: { sn_: currentSN, loggerdataid_: currentID, tab_: tab, name_: name, data_: { id: '0', data: [] }, setting_: {} } })
        settingDispatch({ type: "LOAD_LASTTAB", payload: tab })

        let res = await callApi("post", host.DATA + "/addLoggerScreen", {
            id: currentID,
            sn: currentSN,
            tab: tab,
            name: name
        })


        if (res.status) {
            alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
        }

    }

    return (
        <>








            {(length.value > 5)
                ?
                <div className="DAT_Tool_Tab_Mobile">


                    <button className="DAT_Tool_Tab_Mobile_content" onClick={() => setStatetab(!statetab)} > <span> {name[tab]}</span>  {(statetab) ? <IoIosArrowDown /> : <IoIosArrowForward />} </button>
                    {(statetab)
                        ? <div className="DAT_Tool_Tab_Mobile_list" >
                            <div className="DAT_Tool_Tab_Mobile_list_item" onClick={() => handleAdd()} >Thêm màn hình</div>
                            {Object.keys(name).map((keyName, i) => {
                                return (
                                    <div className="DAT_Tool_Tab_Mobile_list_item" key={i} id={keyName} onClick={(e) => handleTabMobile(e)} >{i + 1}: {name[keyName]}</div>
                                )
                            })}



                        </div>
                        : <></>
                    }
                    <div className="DAT_Tool_Tab-warn">
                        <Link to="/Log" style={{ textDecoration: "none" }} >
                            <div className="DAT_Tool_Tab-warn-item"  ><BiSolidMessageError style={{ color: "red" }} /></div>
                        </Link>
                        <Link to="/Report" style={{ textDecoration: "none" }} >
                            <div className="DAT_Tool_Tab-warn-item"  ><FaFileExport style={{ color: "green" }} /></div>
                        </Link>
                        <Link to="/Contact" style={{ textDecoration: "none" }} >
                            <div className="DAT_Tool_Tab-warn-item"  ><MdContactPhone size={20} style={{ color: "blue" }} /></div>
                        </Link>
                    </div>
                    <div className="DAT_Tool_Tab-close" onClick={handleTabclose}><IoMdClose size={20} /></div>


                </div>
                :
                <div className="DAT_Tool_Tab">
                    {Object.keys(name).map((keyName, i) => {
                        return (
                            (keyName === tab)
                                ? <div key={i} className="DAT_Tool_Tab_main">
                                    <p className="DAT_Tool_Tab_main_left"></p>
                                    <span className="DAT_Tool_Tab_main_content1" id={keyName} style={{ backgroundColor: "White", color: "black", borderRadius: "10px 10px 0 0" }} onClick={(e) => handleTab(e)}>{name[keyName]}</span>
                                    <p className="DAT_Tool_Tab_main_right"></p>
                                </div>
                                : <span className="DAT_Tool_Tab_main_content2" key={i} id={keyName} style={{ backgroundColor: "#dadada" }} onClick={(e) => handleTab(e)}>{name[keyName]}</span>
                        )

                    })}

                    <span className="DAT_Tool_Tab_main_content2" style={{ backgroundColor: "#dadada" }} onClick={() => handleAdd()} >+</span>

                    <div className="DAT_Tool_Tab-warn">
                        <Link to="/Log" style={{ textDecoration: "none" }} >
                            <div className="DAT_Tool_Tab-warn-item"  ><BiSolidMessageError size={20} style={{ color: "red" }} /></div>
                        </Link>
                        <Link to="/Report" style={{ textDecoration: "none" }} >
                            <div className="DAT_Tool_Tab-warn-item"  ><FaFileExport size={20} style={{ color: "green" }} /></div>
                        </Link>
                        <Link to="/Contact" style={{ textDecoration: "none" }} >
                            <div className="DAT_Tool_Tab-warn-item"  ><MdContactPhone size={20} style={{ color: "blue" }} /></div>
                        </Link>
                    </div>

                    <div className="DAT_Tool_Tab-close" onClick={handleTabclose}><IoMdClose size={20} /></div>
                </div>

            }


            <div className="DAT_Tool_Content" style={{ padding: "10px" }}>

                {(config[tab] !== undefined)

                    ? (config[tab].stt)

                        ? <>
                            {/* <Config id={currentID} sn={currentSN} tab={tab} ></Config>
                            {(control[tab].stt)
                                ? <Calculate id={currentID} sn={currentSN} tab={tab} />
                                : <></>
                            } */}
                        </>
                        : <Interface id={currentID} sn={currentSN} tab={tab} />


                    : <div className="DAT_Tool_Loading"><PacmanLoader color="#36d7b7" size={35} loading={true} /></div>


                }

            </div>

            {/* {isLandscape
                ? <></>
                : <div className="DAT_Landscape" >

                    <div className="DAT_Landscape_tit">Embody</div>
                    <div className="DAT_Landscape_ver">Phiên bản: 3.0</div>
                    <div className="DAT_Landscape_note">Bạn vui lòng chuyển sang chế độ Landscape bằng cách xoay <span><IoPhoneLandscapeOutline size={25} color="Black" /></span> thiết bị của bạn</div>
                    <div className="DAT_Landscape_cancel" onClick={handleTabclose}><div >Thoát</div></div>

                </div>

            } */}




        </>
    )
}