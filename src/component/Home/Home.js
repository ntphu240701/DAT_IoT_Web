import React, { useContext, useEffect, useReducer, useState } from "react";
import "./Home.scss";
// import {useIntl} from 'react-intl';
// import { AlertContext } from "../Context/AlertContext";
// import { AuthContext, EnvContext } from "../Context/EnvContext";

import { Link, useNavigate } from "react-router-dom";
//import Card from 'react-bootstrap/Card';
// import { SettingContext } from "../Context/SettingContext";
import { effect, signal } from "@preact/signals-react";
import { pageDefault, ruleInfor, userInfor } from "../../App";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { useIntl } from "react-intl";
import { SiPowerapps } from "react-icons/si";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import Widget from "./Widget";
import { ToolContext } from "../Context/ToolContext";
import { SettingContext } from "../Context/SettingContext";
import Toollist from "../Lib/Toollist";
// import MenuTop from "../MenuTop/MenuTop";

const x = signal(108);
const s = signal(6);
const movestart = signal(0);
const which = signal(["auto", "energy", "elev"]);

export const toolState = signal(false);

export default function Home(props) {
  const dataLang = useIntl();
  // const { settingDispatch } = useContext(SettingContext)
  // const type = useSelector((state) => state.admin.type)
  const user = useSelector((state) => state.admin.usr);

  const boxRef = useRef(null);
  let [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const nevigate = useNavigate();
  const [step, setStep] = useState(0);

  const [widgetState, setWidgetState] = useState(false);
  const { toolDispatch } = useContext(ToolContext);
  const {
    screen,
    currentID,
    currentSN,
    currentName,
    lasttab,
    defaulttab,
    settingDispatch,
  } = useContext(SettingContext);

  const [widget, setWidget] = useState(0);
  const [logger, setLogger] = useState([]);
  const [loggerdata, setLoggerdata] = useState({});

  const startDragging = (e, type) => {
    setIsDragging(true);
    movestart.value = new Date().getTime();
    type === "mouse"
      ? setStartX(e.clientX - boxRef.current.offsetLeft)
      : setStartX(e.changedTouches[0].clientX - boxRef.current.offsetLeft);
  };

  const dragging = (e, type) => {
    if (!isDragging) return;
    const x_ =
      type === "mouse"
        ? e.clientX - boxRef.current.offsetLeft
        : e.changedTouches[0].clientX - boxRef.current.offsetLeft;
    const scrollLeft = x_ - startX;
    if (scrollLeft > 0) {
      if (x.value < 150) {
        x.value += 42;
        setIsDragging(false);
      }
    }
    if (scrollLeft < 0) {
      if (x.value > 24) {
        x.value -= 42;
        setIsDragging(false);
      }
    }
    s.value = parseInt((360 - x.value) / 42);
    // console.log(x.value, s.value)
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const handleClose = () => {
    setWidgetState(false);
  };

  const handlePage = (page) => {
    const page_ = {
      auto: "Auto",
      energy: "Energy",
      elev: "Elev",
    };
    // console.log(new Date().getTime() - movestart.value)
    console.log(new Date().getTime() - movestart.value);
    if (new Date().getTime() - movestart.value < 120) {
      // console.log(page)
      movestart.value = 0;
      nevigate("/" + page_[page]);
    }
  };

  useEffect(() => {
    const getAllLogger = async (usr, id, type) => {
      let res = await callApi("post", host.DATA + "/getAllLogger", {
        usr: usr,
        partnerid: id,
        type: type,
      });
      // console.log(res)
      if (res.status) {
        setLogger(res.data);
      }
    };

    const getWidget = async (usr) => {
      let d = await callApi("post", host.DATA + "/getWidget", {
        usr: usr,
      });
      // console.log(d)
      if (d.status) {
        setWidget(d.data);
        setStep(1);
      }
    };

    const getloggerDataUnit = async (id, sn) => {
      let res = await callApi("post", host.DATA + "/getLoggerDataUnit", {
        loggerdataid: id,
        sn: sn,
      });
      //     console.log(res);
      if (res.status) {
        setLoggerdata(res.data);
        setStep(2);
        // setDeviceState(true)
      }
    };
    const getScreen = async (data) => {
      let res = await callApi("post", host.DATA + "/getLoggerScreen", {
        id: data.id_,
      });
      // console.log(res);
      if (res.status) {
        console.log(data.defaulttab_);

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
          });
        });

        // console.log('Load Tool')
        setStep(3);
        // plantState.value = 'toollist';
      }
    };

    if (step === 0) {
      getWidget(user);
      getAllLogger(user, userInfor.value.partnerid, userInfor.value.type);
    }

    if (step === 1) {
      getloggerDataUnit(widget.loggerdataid_, widget.sn_);
    }

    if (step === 2) {
      getScreen(loggerdata);
    }
    if (step === 3) {
      console.log("Load Tool");
      if (widget.screenstate_) {
        // toolState.value = true;
      }
    }
  }, [step]);

  useEffect(() => {
    let box = document.querySelector(".DAT_viewIOT-3D");
    box.style.transform = `perspective(1000px) rotateY(${x.value}deg)`;
    return () => {
      // settingDispatch({ type: "RESET", payload: [] })
    };
  }, [x.value]);

  useEffect(() => {
    const which_ = ["energy", "auto", "elev"];
    Object.keys(ruleInfor.value.setting.system).map((key) => {
      if (ruleInfor.value.setting.system[key] === false) {
        which_.splice(which_.indexOf(key), 1);
      }
    });
    // console.log(which_)
    which.value = [...which_];
  }, [ruleInfor.value]);

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
        {/* <div className="DAT_viewIOT-Arrow" style={{ visibility: (s.value !== 5) ? "visible" : "hidden", }} id="pre" onClick={(e) => { handeAction(e) }}><ion-icon name="chevron-back-outline"></ion-icon></div> */}
        <div></div>
        <div
          className="DAT_viewIOT-3D"
          ref={boxRef}
          onMouseDown={(e) => startDragging(e, "mouse")}
          onMouseMove={(e) => dragging(e, "mouse")}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onTouchStart={(e) => startDragging(e, "touch")}
          onTouchMove={(e) => dragging(e, "touch")}
          onTouchEnd={stopDragging}

          // onPointerDown={(e) => startDragging(e,'mouse')}
          // onPointerMove={(e) => dragging(e,'mouse')}
          // onPointerUp={stopDragging}
        >
          <span
            style={{ "--i": 1 }}
            className="DAT_viewIOT-3D-Item"
            id="move"
          ></span>
          <span style={{ "--i": 2 }} className="DAT_viewIOT-3D-Item"></span>
          <span style={{ "--i": 3 }} className="DAT_viewIOT-3D-Item"></span>
          <span style={{ "--i": 4 }} className="DAT_viewIOT-3D-Item"></span>
          <span style={{ "--i": 5 }} className="DAT_viewIOT-3D-Item">
            <div className="DAT_viewIOT-3D-Item-Icon">
              <SiPowerapps
                size={60}
                color="white"
                onPointerUp={() => setWidgetState(true)}
              />
            </div>
            <label
              style={{
                color: s.value === 5 ? "white" : "gray",
                transition: "1s",
              }}
            >
              {dataLang.formatMessage({ id: "utilities" })}
            </label>
          </span>

          {which.value.map((data, index) => {
            return (
              <span
                key={index + 6}
                style={{ "--i": index + 6 }}
                className="DAT_viewIOT-3D-Item"
              >
                <img
                  alt=""
                  draggable="false"
                  onPointerUp={() => handlePage(data)}
                  src={`dat_icon/${data}.png`}
                ></img>
                <label
                  style={{
                    color: s.value === index + 6 ? "white" : "gray",
                    transition: "1s",
                  }}
                >
                  {dataLang.formatMessage({ id: data })}
                </label>
              </span>
            );
          })}

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
      </div>

      <div
        className="DAT_viewIOT-Widget"
        style={{ height: widgetState ? "100vh" : "0", transition: "0.5s" }}
      >
        <Widget
          logger={logger}
          widget={widget}
          loggerdata={loggerdata}
          handleClose={handleClose}
        />
      </div>

      {toolState.value ? (
        <div className="DAT_Toollist" style={{ zIndex: 35 }}>
          <div className="DAT_Toollist-card" id="CARD">
            <Toollist bu={"energy"}></Toollist>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
