import React, { useContext, useEffect, useState } from "react";
import "./Tooloverview.scss";
import axios from "axios";
import { SettingContext } from "../Context/SettingContext";
import Calculateoverview from "./Calculateoverview";
// import Configoverview from "./Configoverview";
import Interfaceoverview from "./Interfaceoverview";
import { OverviewContext } from "../Context/OverviewContext";
import { useDispatch } from "react-redux";
import { host } from "../Lang/Contant";
import { useIntl } from "react-intl";
import { signal } from "@preact/signals-react";
import { Token, socket } from "../../App";
import { useMobileOrientation } from "react-device-detect";
import { IoMdClose } from "react-icons/io";
import {
  listDevice,
  mode,
  plantData,
  plantState,
  plantobjauto,
} from "../Control/Signal";
import { useOrientation } from "react-use";
import { ScaleLoader } from "react-spinners";
import { RiErrorWarningLine } from "react-icons/ri";
import { seeAll } from "../Warn/Warn";
import { plantnameFilterSignal } from "../Control/Dashboard";
import { useNavigate } from "react-router-dom";
import PullUp from "./PullUp";

export const overview = signal(false);
export const whatdevicegroup = signal({ id: "", groupid: "", tab: "" });

export default function Tooloverview(props) {
  const { overview_config, overview_control, overview_name, overviewDispatch } =
    useContext(OverviewContext);
  const [step, setStep] = useState(0);
  // const { isLandscape } = useMobileOrientation()
  const { type } = useOrientation();
  const [load, setLoad] = useState(true);
  const [isLand, setIsLand] = useState(false);
  const [warnBoxState, setWarnBoxState] = useState(false);
  const Navigate = useNavigate();
  const popup_state = {
    pre: {
      transform: "rotate(0deg)",
      transition: "0.5s",
      color: "rgba(11, 25, 103)",
    },
    new: {
      transform: "rotate(90deg)",
      transition: "0.5s",
      color: "rgba(11, 25, 103)",
    },
  };

  const handlePopup = (state) => {
    const popup = document.getElementById("Popup");
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  };

  const [invt, setInvt] = useState(() => {
    var x = {};
    listDevice.value.map((data, index) => {
      return (x[data.sn_] = {});
    });
    return x;
  });

  const invtCloud = async (data, token) => {
    var reqData = {
      data: data,
      token: token,
    };

    try {
      const response = await axios({
        url: host.CLOUD,
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: Object.keys(reqData)
          .map(function (key) {
            return (
              encodeURIComponent(key) + "=" + encodeURIComponent(reqData[key])
            );
          })
          .join("&"),
      });

      return response.data;
    } catch (e) {
      return { ret: 1, msg: "cloud err" };
    }
  };

  useEffect(() => {
    // console.log("Tooloverview", type)
    console.log(plantobjauto.value);

    setLoad(true);
    const l = setInterval(() => {
      setLoad(false);
      if (type === "landscape-primary") {
        setIsLand(true);
      } else {
        setIsLand(false);
      }
      clearInterval(l);
    }, 1500);

    return () => {
      clearInterval(l);
    };
  }, [type]);

  /// read data
  useEffect(() => {
    //console.log(listdevice)

    var loaddata = async (id) => {
      const res = await invtCloud(
        '{"deviceCode":"' + id + '"}',
        Token.value.token
      );
      // console.log(res)
      if (res.ret === 0) {
        setInvt((pre) => ({ ...pre, [id]: res.data }));
        setStep(1);
      } else {
        setInvt((pre) => ({ ...pre, [id]: {} }));
      }
    };
    var socket_io = async (id) => {
      try {
        socket.value.on("Server/" + id, function (data) {
          //var check =  listdevice.filter(d => d.deviceid === data.deviceid)
          console.log("Tooloverview socket");
          // if(check.length === 1){
          Object.keys(data.data).map((keyName, i) => {
            setInvt((pre) => ({
              ...pre,
              [data.deviceid]: {
                ...pre[data.deviceid],
                [keyName]: data.data[keyName],
              },
            }));
          });
          // }
        });

        socket.value.on("Server/up/" + id, function (data) {
          console.log("Tooloverview up");
          Object.keys(data.data).map((keyName, i) => {
            setInvt((pre) => ({
              ...pre,
              [data.deviceid]: {
                ...pre[data.deviceid],
                enabled: "1",
              },
            }));
          });
        });
        socket.value.on("Server/down/" + id, function (data) {
          console.log("Tooloverview down");
          Object.keys(data.data).map((keyName, i) => {
            setInvt((pre) => ({
              ...pre,
              [data.deviceid]: {
                ...pre[data.deviceid],
                enabled: "0",
              },
            }));
          });
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (step === 0) {
      // console.log(listDevice.value)
      listDevice.value.map((data, index) => {
        return loaddata(data.sn_);
      });
    } else {
      if (mode.value === "dashboard") {
        console.log(invt);
        listDevice.value.map((data, index) => {
          //console.log("hello")
          return socket_io(data.sn_);
        });
      }
    }

    return () => {
      listDevice.value.map((data, index) => {
        socket.value.off("Server/" + data.deviceid);
        socket.value.off("Server/up/" + data.deviceid);
        socket.value.off("Server/down/" + data.deviceid);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, listDevice.value, mode.value]);

  const handleTabCheck = () => {
    plantState.value = "default";
    mode.value = "device";
    listDevice.value.map((data, index) => {
      socket.value.off("Server/" + data.sn_);
      socket.value.off("Server/up/" + data.sn_);
      socket.value.off("Server/down/" + data.sn_);
    });

    overviewDispatch({
      type: "SET_CONFIG",
      payload: false,
    });
  };

  const handleClose = () => {
    setWarnBoxState(!warnBoxState);
  }

  return (
    <>
      <div className="DAT_ToolOverview">
        <div className="DAT_ToolOverview_Overview">
          {load ? (
            <div
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100vh",
                backgroundColor: "rgba(255,255,255)",
                zIndex: "9999",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ScaleLoader color="#007bff" size={40} loading={load} />
            </div>
          ) : isLand ? (
            <div className="DAT_ToolOverview_Overview_Container">
              <div className="DAT_ToolOverview_Overview_Container_Head">
                <div className="DAT_ToolOverview_Overview_Container_Head_Tit">
                  <div className="DAT_ToolOverview_Overview_Container_Head_Tit_Avatar">
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      src={
                        plantobjauto.value.img
                          ? plantobjauto.value.img
                          : `/dat_picture/${plantobjauto.value.type_}.jpg`
                      }
                    />
                  </div>
                  <div className="DAT_ToolOverview_Overview_Container_Head_Tit_Name">
                    {overview_name}
                  </div>
                </div>
                <div
                  className="DAT_ToolOverview_Overview_Container_Head_Warn"
                  onClick={(e) => {
                    setWarnBoxState(!warnBoxState);
                    // console.log(overview_config, overview_control, overview_name)
                    // Navigate("/Warn");
                    // seeAll.value = false;
                    // plantnameFilterSignal.value = overview_name;
                  }}
                >
                  <RiErrorWarningLine
                    size={20}
                    color="orange"
                    style={{
                      padding: "5px",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  />
                </div>

                <div
                  className="DAT_ToolOverview_Overview_Container_Head_Close"
                  onClick={(e) => handleTabCheck(e)}
                  id="Popup"
                  onMouseEnter={(e) => handlePopup("new")}
                  onMouseLeave={(e) => handlePopup("pre")}
                >
                  <IoMdClose size={20} />
                </div>
              </div>
              <div
                className="DAT_ToolOverview_Overview_Container_Content"
                id="CARDOVERVIEW"
              >
                {overview_config ? (
                  <>
                    {/* <Configoverview id={props.projectid} type={props.type} invt={invt} />
                                            {(overview_control.stt)
                                                ? <Calculateoverview id={props.projectid} invt={invt} />
                                                : <></>
                                            } */}
                  </>
                ) : (
                  <Interfaceoverview
                    id={props.projectid}
                    type={props.code}
                    invt={invt}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="DAT_Landscape">
              <div
                className="DAT_Landscape_cancel"
                onClick={(e) => handleTabCheck(e)}
              >
                <div className="DAT_Landscape_cancel_icon">
                  <span>Thoát</span>
                </div>
              </div>
              <div className="DAT_Landscape_content">
                <div className="DAT_Landscape_content_tit">Embody</div>
                <div className="DAT_Landscape_content_ver">
                  Phiên bản: {process.env.REACT_APP_VER}
                </div>
                <div className="DAT_Landscape_content_note">
                  Bạn vui lòng chuyển sang chế độ Landscape bằng cách xoay ngang
                  thiết bị của bạn
                </div>
              </div>
            </div>
          )}
        </div>

        {warnBoxState ? <PullUp projectname={overview_name} handleClose={handleClose}/> : <></>}
      </div>
    </>
  );
}
