import React, { useContext, useEffect, useState } from "react";
import "./Home.scss";
// import {useIntl} from 'react-intl';
// import { AlertContext } from "../Context/AlertContext";
// import { AuthContext, EnvContext } from "../Context/EnvContext";

import { useNavigate } from 'react-router-dom';
//import Card from 'react-bootstrap/Card';
// import { SettingContext } from "../Context/SettingContext";
import { signal } from "@preact/signals-react";
import { ruleInfor, userInfor } from "../../App";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { useIntl } from "react-intl";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import Widget from "./Widget";
import { ToolContext } from "../Context/ToolContext";
import { SettingContext } from "../Context/SettingContext";
import Toollist from "../Lib/Toollist";
import { FaMapLocation } from "react-icons/fa6";
import Map from "./Map";
import { plantState } from "../Control/Signal";
import Project from "../Control/Project";
import { MdSettings } from "react-icons/md";
import { PiScreencastDuotone } from "react-icons/pi";
import { isBrowser, useMobileOrientation } from "react-device-detect";
// import MenuTop from "../MenuTop/MenuTop";

const x = signal(150);
const s = signal(5);
const movestart = signal(0);
const which = signal([
        'auto',
        'energy',
        'elev',
]);

export const toolState = signal(false);

export default function Home(props) {
        const dataLang = useIntl();
        const user = useSelector((state) => state.admin.usr)
        const boxRef = useRef(null);
        let [isDragging, setIsDragging] = useState(false);
        const [startX, setStartX] = useState(0);
        const nevigate = useNavigate();
        const [step, setStep] = useState(0);
        const [widgetState, setWidgetState] = useState(false);
        const [mapState, setMapState] = useState(false);
        const { toolDispatch } = useContext(ToolContext);
        const { settingDispatch } = useContext(SettingContext);
        const [widget, setWidget] = useState(0);
        const [plant, setPlant] = useState([])
        const [logger, setLogger] = useState([]);
        const [loggerdata, setLoggerdata] = useState({});
        const [plantobj, setPlantobj] = useState({});
        const [ismanual, setIsmanual] = useState(false);
        const { isLandscape } = useMobileOrientation()
        const [viewMode, setViewMode] = useState(true);

        const startDragging = (e, type) => {
                setIsDragging(true);
                movestart.value = new Date().getTime();
                (type === 'mouse') ? setStartX(e.clientX - boxRef.current.offsetLeft) : setStartX(e.changedTouches[0].clientX - boxRef.current.offsetLeft);
        };

        const dragging = (e, type) => {

                if (!isDragging) return;
                const x_ = type === 'mouse' ? e.clientX - boxRef.current.offsetLeft : e.changedTouches[0].clientX - boxRef.current.offsetLeft;
                const scrollLeft = x_ - startX;
                if (scrollLeft > 0) {
                        if (x.value < 192) {
                                x.value += 42
                                setIsDragging(false);
                        }
                }
                if (scrollLeft < 0) {
                        if (x.value > 24) {
                                x.value -= 42
                                setIsDragging(false);
                        }
                }
                s.value = parseInt((360 - x.value) / 42);
                console.log(x.value, s.value)


        };

        const stopDragging = () => {

                setIsDragging(false);
        };

        const handleClose = () => {
                setWidgetState(false)
        }

        const handleCloseMap = () => {
                setMapState(false)
        }

        const handlePage = (page) => {
                const page_ = {
                        auto: 'Auto',
                        energy: 'Energy',
                        elev: 'Elev',

                }
                // console.log(new Date().getTime() - movestart.value)
                // console.log(new Date().getTime() - movestart.value)
                if ((new Date().getTime() - movestart.value) < 150) {
                        // console.log(page)
                        movestart.value = 0
                        nevigate('/' + page_[page])
                }

        }

        const handleWiget = () => {

                if ((new Date().getTime() - movestart.value) < 150) {
                        // console.log(page)
                        movestart.value = 0
                        setWidgetState(true)
                }

        }

        const handleMap = () => {

                if ((new Date().getTime() - movestart.value) < 150) {
                        // console.log(page)
                        movestart.value = 0

                        const getAllPlant = async (usr, id, type) => {

                                let res = await callApi("post", host.DATA + "/getAllPlant", {
                                        usr: usr,
                                        partnerid: id,
                                        type: type,
                                })
                                console.log(res)
                                if (res.status) {
                                        // setLogger(res.data)
                                        setPlant(res.data)
                                        setMapState(true)
                                }
                        }
                        getAllPlant(user, userInfor.value.partnerid, userInfor.value.type)
                }

        }

        const handleTool = () => {
                if ((new Date().getTime() - movestart.value) < 150) {

                        setStep(0)
                        setIsmanual(true)
                }
        }

        const handleViewMode = () => {
                setViewMode(!viewMode);
                if (viewMode) {
                        console.log(x.value, s.value);
                }
                // x.value = 108;
                // s.value = 6;
                // movestart.value = 0;
        };

        useEffect(() => {
                console.log(x.value, s.value, movestart.value);
        }, [])

        useEffect(() => {

                const getAllLogger = async (usr, id, type) => {

                        let res = await callApi("post", host.DATA + "/getAllLogger", {
                                usr: usr,
                                partnerid: id,
                                type: type,
                        })
                        // console.log(res)
                        if (res.status) {
                                setLogger(res.data)
                        }
                }

                const getWidget = async (usr) => {

                        let d = await callApi("post", host.DATA + "/getWidget", {
                                usr: usr,

                        })
                        console.log(d)
                        if (d.status) {
                                setWidget(d.data)
                                setStep(1)
                        }

                }

                const getloggerDataUnit = async (id, sn) => {

                        let res = await callApi("post", host.DATA + "/getLoggerDataUnit", {
                                loggerdataid: id,
                                sn: sn,
                        });
                        //     console.log(res);
                        if (res.status) {

                                setLoggerdata(res.data)
                                setStep(2)
                                // setDeviceState(true)
                        }
                }
                const getScreen = async (data) => {
                        let res = await callApi("post", host.DATA + "/getLoggerScreen", {
                                id: data.id_,
                        });
                        // console.log(res);
                        if (res.status) {

                                console.log(data.defaulttab_)


                                // console.log(res.data, arr[0], deviceData.value[index].sn_)

                                settingDispatch({
                                        type: "LOAD_SCREEN",
                                        payload: {
                                                currentID: data.id_,
                                                currentSN: data.sn_,
                                                currentName: data.name_,
                                                screen: res.data,

                                        },
                                });

                                settingDispatch({
                                        type: "LOAD_LASTTAB",
                                        payload: parseInt(data.tab_),
                                });
                                settingDispatch({
                                        type: "LOAD_DEFAULT",
                                        payload: parseInt(data.defaulttab_),
                                });


                                res.data.map((data2, index) => {
                                        toolDispatch({
                                                type: "LOAD_DEVICE",
                                                payload: {
                                                        tab: data2.tab_,
                                                        visual: data2.data_.data,
                                                        setting: data2.setting_,
                                                        name: data2.name_,
                                                        lastid: data2.data_.id,
                                                },
                                        })
                                })

                                // console.log('Load Tool')
                                setStep(3)
                                // plantState.value = 'toollist';

                        }
                }

                if (step === 0) {
                        getWidget(user)
                        getAllLogger(user, userInfor.value.partnerid, userInfor.value.type)
                        // getAllPlant(user, userInfor.value.partnerid, userInfor.value.type)
                }

                if (step === 1) {
                        getloggerDataUnit(widget.loggerdataid_, widget.sn_)
                }

                if (step === 2) {
                        getScreen(loggerdata)
                }
                if (step === 3) {
                        console.log('Load Tool')

                        if (ismanual) {
                                toolState.value = true;
                        } else {
                                if (widget.screenstate_) {
                                        toolState.value = true;
                                }
                        }

                }


        }, [step])

        useEffect(() => {
                if (viewMode) {
                        let box = document.querySelector('.DAT_viewIOT-3D')
                        box.style.transform = `perspective(1000px) rotateY(${x.value}deg)`;
                }
                return (() => {
                        // settingDispatch({ type: "RESET", payload: [] })

                })
        }, [x.value])

        useEffect(() => {
                const which_ = [
                        'energy',
                        'auto',
                        'elev',
                ]
                Object.keys(ruleInfor.value.setting.system).map((key) => {
                        if (ruleInfor.value.setting.system[key] === false) {
                                which_.splice(which_.indexOf(key), 1)
                        }
                })
                // console.log(which_)
                which.value = [...which_]
        }, [ruleInfor.value])

        const handleProject = (data) => {
                setPlantobj(data)
        }

        // useEffect(() => {
        //         if (type === 'user') {
        //                 console.log(pageDefault.value)
        //                 if (pageDefault.value.status) {
        //                         navigate('/' + which[pageDefault.value.code])
        //                 }
        //         }
        // }, [pageDefault.value])

        // const handeAction = (e) => {

        //         if (e.currentTarget.id === 'pre') {
        //                 x.value += 42;
        //         }

        //         if (e.currentTarget.id === 'next') {
        //                 x.value -= 42;
        //         }

        //         s.value = parseInt((360 - x.value) / 42);
        // }

        return (
                <>
                        {/* <MenuTop user={user} /> */}
                        <div className="DAT_viewIOT">
                                <div className="DAT_viewIOT-Mode" >
                                        <input type="checkbox" class="theme-checkbox" onClick={() => handleViewMode()} />
                                </div>

                                {/* <div className="DAT_viewIOT-Arrow" style={{ visibility: (s.value !== 5) ? "visible" : "hidden", }} id="pre" onClick={(e) => { handeAction(e) }}><ion-icon name="chevron-back-outline"></ion-icon></div> */}

                                <div></div>
                                <div className="DAT_viewIOT-3D"
                                        style={{ display: viewMode ? "block" : "none" }}
                                        ref={boxRef}
                                        onMouseDown={(e) => startDragging(e, 'mouse')}
                                        onMouseMove={(e) => dragging(e, 'mouse')}
                                        onMouseUp={stopDragging}
                                        onMouseLeave={stopDragging}

                                        onTouchStart={(e) => startDragging(e, 'touch')}
                                        onTouchMove={(e) => dragging(e, 'touch')}
                                        onTouchEnd={stopDragging}

                                // onPointerDown={(e) => startDragging(e,'mouse')}
                                // onPointerMove={(e) => dragging(e,'mouse')}
                                // onPointerUp={stopDragging}

                                >
                                        <span style={{ "--i": 1 }} className="DAT_viewIOT-3D-Item" id="move">
                                        </span>
                                        <span style={{ "--i": 2 }} className="DAT_viewIOT-3D-Item">
                                        </span>
                                        <span style={{ "--i": 3 }} className="DAT_viewIOT-3D-Item">
                                        </span>
                                        <span style={{ "--i": 4 }} className="DAT_viewIOT-3D-Item">
                                                <div className="DAT_viewIOT-3D-Item-Setting" ><MdSettings size={25} color="white" onPointerUp={() => handleWiget()} /></div>
                                                <div className="DAT_viewIOT-3D-Item-Icon" >
                                                        <PiScreencastDuotone size={60} color="white" onPointerUp={() => handleTool()} />
                                                </div>
                                                <label style={{ color: (s.value === 4) ? "white" : "gray", transition: "1s" }}>{dataLang.formatMessage({ id: "shortcut" })}</label>
                                        </span>
                                        <span style={{ "--i": 5 }} className="DAT_viewIOT-3D-Item">
                                                <div className="DAT_viewIOT-3D-Item-Icon" >
                                                        <FaMapLocation size={60} color="white" onPointerUp={() => handleMap()} />
                                                </div>
                                                <label style={{ color: (s.value === 5) ? "white" : "gray", transition: "1s" }}>{dataLang.formatMessage({ id: "map" })}</label>

                                        </span>

                                        {which.value.map((data, index) => {
                                                return <span key={index + 6} style={{ "--i": index + 6 }} className="DAT_viewIOT-3D-Item">
                                                        <img alt="" draggable="false" onPointerUp={() => handlePage(data)} src={`dat_icon/${data}.png`}></img>
                                                        <label style={{ color: (s.value === index + 6) ? "white" : "gray", transition: "1s" }}>{dataLang.formatMessage({ id: data })}</label>
                                                </span>
                                        })

                                        }

                                        {/* <span style={{ "--i": 6 }} className="DAT_viewIOT-3D-Item">
                                                <img alt="" draggable="false" onPointerUp={() => handlePage('energy')} src="dat_icon/energy.png"></img>
                                                <label style={{ color: (s.value === 6) ? "white" : "gray", transition: "1s" }}>{dataLang.formatMessage({ id: "energy" })}</label>
                                        </span>

                                        <span style={{ "--i": 7 }} className="DAT_viewIOT-3D-Item">
                                                <img alt="" draggable="false" onPointerUp={() => handlePage('auto')} src="dat_icon/auto.png"></img>
                                                <label style={{ color: (s.value === 7) ? "white" : "gray", transition: "1s" }}>{dataLang.formatMessage({ id: "auto" })}</label>
                                        </span>

                                        <span style={{ "--i": 8 }} className="DAT_viewIOT-3D-Item">
                                                <img alt="" draggable="false" onPointerUp={() => handlePage('elev')} src="dat_icon/elev.png"></img>
                                                <label style={{ color: (s.value === 8) ? "white" : "gray", transition: "1s" }}>{dataLang.formatMessage({ id: "elev" })}</label>
                                        </span> */}

                                </div>
                                <div></div>

                                {/* <div className="DAT_viewIOT-Arrow" style={{ visibility: (s.value !== 8) ? "visible" : "hidden" }} id="next" onClick={(e) => { handeAction(e) }}><ion-icon name="chevron-forward-outline"></ion-icon></div> */}

                                <div className="DAT_viewIOT-Widget" style={{ height: widgetState ? "100vh" : "0", transition: "0.5s" }}>
                                        <Widget logger={logger} widget={widget} loggerdata={loggerdata} handleClose={handleClose} />
                                </div>

                                <div className="DAT_viewIOT-Widget" style={{ height: mapState ? "100vh" : "0", transition: "0.5s" }}>
                                        <Map plant={plant} handleClose={handleCloseMap} handleProject={handleProject} />
                                </div>

                                <div className="DAT_ProjectInfor" style={{ height: plantState.value === "default" ? "0px" : "100vh", transition: "0.5s", }}>
                                        {(() => {
                                                switch (plantState.value) {
                                                        case "info":
                                                                return <Project usr={user} bu={plantobj.type_} data={plantobj} />;
                                                        case "toollist":
                                                                return <div className="DAT_Toollist">
                                                                        <div
                                                                                className="DAT_Toollist-card"
                                                                                id="CARD"
                                                                        >
                                                                                <Toollist bu={plantobj.type_} ></Toollist>
                                                                        </div>
                                                                </div>;
                                                        default:
                                                                return <></>;
                                                }
                                        })()}
                                </div>


                                {/* {isBrowser
                                        ? <div className="DAT_viewIOT-Inf" >
                                                <div className="DAT_viewIOT-Inf-Content"></div>
                                                <div className="DAT_viewIOT-Inf-Content"></div>
                                                <div className="DAT_viewIOT-Inf-Content"></div>
                                                <div className="DAT_viewIOT-Inf-Content"></div>
                                        </div>
                                        : isLandscape
                                                ? <></>

                                                : <div className="DAT_viewIOT-InfMobile" >
                                                        <div className="DAT_viewIOT-InfMobile-G">
                                                                <div className="DAT_viewIOT-InfMobile-G-Content"></div>
                                                                <div className="DAT_viewIOT-InfMobile-G-Content"></div>
                                                        </div>

                                                        <div className="DAT_viewIOT-InfMobile-G">
                                                                <div className="DAT_viewIOT-InfMobile-G-Content"></div>
                                                                <div className="DAT_viewIOT-InfMobile-G-Content"></div>
                                                        </div>
                                                </div>
                                } */}

                        </div >

                        {/* <div className="DAT_viewIOT-Plant" style={{ height: plantState.value === "info" ? "100vh" : "0", transition: "0.5s" }}>
                                <Project usr={user} bu={plantobj.bu_} data={plantobj} />
                        </div> */}

                        {toolState.value
                                ? <div className="DAT_Toollist" style={{ zIndex: 35 }}>
                                        <div
                                                className="DAT_Toollist-card"
                                                id="CARD"
                                        >
                                                <Toollist bu={widget.bu_} ></Toollist>
                                        </div>
                                </div>
                                : <></>
                        }

                        {/* {plantState.value === "info"
                                ? <Project usr={user} bu={plantobj.bu_} data={plantobj} />
                                : <></>

                        } */}
                </>
        );
}
