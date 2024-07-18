import React, { useContext, useEffect, useState } from "react";
import {
  defaultData,
  defaultDataState,
  listDevice,
  mode,
  plantData,
  plantState,
} from "./Signal";
import { IoAddOutline, IoClose } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineError } from "react-icons/md";
import { useIntl } from "react-intl";
import { BsThreeDotsVertical } from "react-icons/bs";
import { signal } from "@preact/signals-react";
import { ruleInfor } from "../../App";
import AddGateway from "./AddGateway";
import Device, { device, deviceCurrent, deviceData } from "./Device";
import { isBrowser } from "react-device-detect";
import Dashboard from "./Dashboard";
import Tooloverview from "../LibOverview/Tooloverview";
import { OverviewContext } from "../Context/OverviewContext";
import { RiDashboard2Line } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { LuRouter } from "react-icons/lu";
import { host } from "../Lang/Contant";
import { callApi } from "../Api/Api";
import PopupState, { bindHover, bindPopper } from "material-ui-popup-state";
import { Fade, Paper, Popper, Typography } from "@mui/material";

const viewNav = signal(false);
const viewStateNav = signal([false, false]);
function Project(props) {
  const dataLang = useIntl();

  const [gatewayState, setGatewayState] = useState(false);
  const [modeState, setModeState] = useState(false);
  const { overviewDispatch } = useContext(OverviewContext);
  // const [mode, setMode] = useState('Dashboard');
  const popup_state = {
    pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
    new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" },
  };

  useEffect(() => {
    if (viewNav.value === false) {
      setModeState(false);
    }
    return () => {};
  }, [viewNav.value]);

  const handleOutsideView = (e) => {
    setTimeout(() => {
      if (viewStateNav.value[1] == false) {
        viewNav.value = false;
        viewStateNav.value = [false, false];
      }
      clearTimeout();
    }, 1000);
  };

  const handlePopup = (state) => {
    const popup = document.getElementById("Popup_");
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  };

  const handleView = (e) => {
    // defaultDataState.value = true;
    var id = e.currentTarget.id;
    mode.value = id;
    setModeState(false);
  };

  const handleCloseGateway = () => {
    setGatewayState(false);
  };

  const handlePopupGateway = () => {
    setGatewayState(true);
    setModeState(false);
  };

  const handleCloseProjet = () => {
    plantState.value = "default";
    deviceCurrent.value = 0;
    listDevice.value = [];
    device.value = [];
    deviceData.value = [];
    mode.value = "overview";
    setModeState(false);
    overviewDispatch({
      type: "RESET_TOOLOVERVIEW",
      payload: [],
    });
    defaultData.value = {
      defaultscreenid_: 0,
      defaultscreenstate_: 0,
    };
    defaultDataState.value = true;
  };
  useEffect(() => {
    console.log(mode.value);
  }, [mode.value]);

  useEffect(() => {
    console.log(props.data.plantid_);
    console.log(mode.value);
  }, [mode.value]);

  return (
    <>
      {isBrowser ? (
        <div className="DAT_ProjectData">
          <div className="DAT_ProjectData_Header">
            <div className="DAT_ProjectData_Header_Left">
              <div
                className="DAT_ProjectData_Header_Left_Top"
                style={{ fontSize: 22 }}
              >
                <img
                  src={
                    props.data?.img
                      ? props.data.img
                      : `/dat_picture/${props.bu}.jpg`
                  }
                  alt=""
                />
                <div className="DAT_ProjectData_Header_Left_Top_Content">
                  <div className="DAT_ProjectData_Header_Left_Top_Content_Name">
                    {props.data.name_}
                    {props.data.state_ === 1 ? (
                      <FaCheckCircle size={20} color="green" />
                    ) : (
                      <MdOutlineError size={20} color="red" />
                    )}
                  </div>
                  {/* <div className="DAT_ProjectData_Header_Left_Top_Content_Addr">
                                        {props.data.addr_}
                                    </div> */}
                </div>
              </div>
            </div>

            <div className="DAT_ProjectData_Header_Right">
              {/* <div className="DAT_ProjectData_Header_Right_More">
                                <BsThreeDotsVertical
                                    size={20}
                                    color="white"
                                    onClick={() => {
                                        setModeState(!modeState);
                                        viewNav.value = true;
                                        viewStateNav.value = [true, true];
                                    }}
                                    onMouseLeave={() => handleOutsideView()}
                                />
                            </div> */}

              {(() => {
                switch (mode.value) {
                  case "device":
                    return (
                      <>
                        <PopupState
                          variant="popper"
                          popupId="demo-popup-popper"
                        >
                          {(popupState) => (
                            <div
                              style={{ cursor: "pointer" }}
                              {...bindHover(popupState)}
                            >
                              <div className="DAT_ProjectData_Header_Right_More">
                                <RxDashboard
                                  size={20}
                                  color="white"
                                  id="overview"
                                  onClick={(e) => handleView(e)}
                                />
                              </div>
                              <Popper {...bindPopper(popupState)} transition>
                                {({ TransitionProps }) => (
                                  <Fade {...TransitionProps} timeout={350}>
                                    <Paper
                                      sx={{
                                        width: "fit-content",
                                        marginLeft: "0px",
                                        marginTop: "10px",
                                        height: "20px",
                                        p: 1,
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "12px",
                                          textAlign: "justify",
                                          justifyItems: "center",
                                          // marginBottom: 1.7,
                                        }}
                                      >
                                        {dataLang.formatMessage({
                                          id: "projectinfo",
                                        })}
                                      </Typography>
                                    </Paper>
                                  </Fade>
                                )}
                              </Popper>
                            </div>
                          )}
                        </PopupState>
                        <PopupState
                          variant="popper"
                          popupId="demo-popup-popper"
                        >
                          {(popupState) => (
                            <div style={{ cursor: "pointer" }}>
                              <div
                                className="DAT_ProjectData_Header_Right_More"
                                {...bindHover(popupState)}
                              >
                                <RiDashboard2Line
                                  size={20}
                                  color="white"
                                  id="dashboard"
                                  onClick={(e) => handleView(e)}
                                />
                              </div>
                              <Popper {...bindPopper(popupState)} transition>
                                {({ TransitionProps }) => (
                                  <Fade {...TransitionProps} timeout={350}>
                                    <Paper
                                      sx={{
                                        width: "fit-content",
                                        marginLeft: "0px",
                                        marginTop: "10px",
                                        height: "20px",
                                        p: 1,
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "12px",
                                          textAlign: "justify",
                                          justifyItems: "center",
                                          // marginBottom: 1.7,
                                        }}
                                      >
                                        {dataLang.formatMessage({
                                          id: "overviewinterface",
                                        })}
                                      </Typography>
                                    </Paper>
                                  </Fade>
                                )}
                              </Popper>
                            </div>
                          )}
                        </PopupState>
                      </>
                    );
                  case "overview":
                    return (
                      <>
                        <PopupState
                          variant="popper"
                          popupId="demo-popup-popper"
                        >
                          {(popupState) => (
                            <div style={{ cursor: "pointer" }}>
                              <div
                                className="DAT_ProjectData_Header_Right_More"
                                {...bindHover(popupState)}
                              >
                                <LuRouter
                                  size={20}
                                  color="white"
                                  id="device"
                                  onClick={(e) => handleView(e)}
                                />
                              </div>
                              <Popper {...bindPopper(popupState)} transition>
                                {({ TransitionProps }) => (
                                  <Fade {...TransitionProps} timeout={350}>
                                    <Paper
                                      sx={{
                                        width: "fit-content",
                                        marginLeft: "0px",
                                        marginTop: "10px",
                                        height: "20px",
                                        p: 1,
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "12px",
                                          textAlign: "justify",
                                          justifyItems: "center",
                                          // marginBottom: 1.7,
                                        }}
                                      >
                                        {dataLang.formatMessage({
                                          id: "deviceinterface",
                                        })}
                                      </Typography>
                                    </Paper>
                                  </Fade>
                                )}
                              </Popper>
                            </div>
                          )}
                        </PopupState>

                        <PopupState
                          variant="popper"
                          popupId="demo-popup-popper"
                        >
                          {(popupState) => (
                            <div style={{ cursor: "pointer" }}>
                              <div
                                className="DAT_ProjectData_Header_Right_More"
                                {...bindHover(popupState)}
                              >
                                <RiDashboard2Line
                                  size={20}
                                  color="white"
                                  id="dashboard"
                                  onClick={(e) => handleView(e)}
                                />
                              </div>
                              <Popper {...bindPopper(popupState)} transition>
                                {({ TransitionProps }) => (
                                  <Fade {...TransitionProps} timeout={350}>
                                    <Paper
                                      sx={{
                                        width: "fit-content",
                                        marginLeft: "0px",
                                        marginTop: "10px",
                                        height: "20px",
                                        p: 1,
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "12px",
                                          textAlign: "justify",
                                          justifyItems: "center",
                                          // marginBottom: 1.7,
                                        }}
                                      >
                                        {dataLang.formatMessage({
                                          id: "overviewinterface",
                                        })}
                                      </Typography>
                                    </Paper>
                                  </Fade>
                                )}
                              </Popper>
                            </div>
                          )}
                        </PopupState>
                      </>
                    );
                  default:
                    return <></>;
                }
              })()}

              {/* {ruleInfor.value.setting.device.add
                                ? props.data.shared_ === 1
                                    ? <></>
                                    : <div className="DAT_ProjectData_Header_Right_Add"
                                        style={{ display: mode.value === "device" ? "block" : "none" }}
                                    >
                                        <button
                                            id="add"
                                            onClick={() => {
                                                setGatewayState(true);
                                                setModeState(false);
                                            }}
                                        >
                                            <IoAddOutline size={25} color="rgba(11, 25, 103)" />
                                        </button>
                                    </div>
                                : <></>
                            } */}

              <div
                className="DAT_ProjectData_Header_Right_Close"
                onClick={() => {
                  handleCloseProjet();
                }}
              >
                <IoClose
                  size={25}
                  color="white"
                  id="Popup_"
                  onMouseEnter={(e) => handlePopup("new")}
                  onMouseLeave={(e) => handlePopup("pre")}
                />
              </div>
            </div>
          </div>

          <div className="DAT_ProjectData_Content">
            {(() => {
              switch (mode.value) {
                case "device":
                  return (
                    <Device
                      bu={props.bu}
                      data={props.data}
                      popupGateway={handlePopupGateway}
                    />
                  );
                case "overview":
                  return <Dashboard data={props.data} />;
                default:
                  return <Tooloverview projectid={props.data.plantid_} />;
              }
            })()}
          </div>

          {modeState ? (
            <div
              className="DAT_ProjectDataDrop"
              style={{ display: viewNav.value ? "block" : "none" }}
              onMouseEnter={() => {
                viewStateNav.value = [true, true];
              }}
              onMouseLeave={() => {
                viewNav.value = false;
                viewStateNav.value = [false, false];
              }}
            >
              {(() => {
                switch (mode.value) {
                  case "device":
                    return (
                      <>
                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="overview"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "view" })}
                        </div>

                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="dashboard"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "dashboard" })}
                        </div>
                      </>
                    );
                  case "overview":
                    return (
                      <>
                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="dashboard"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "dashboard" })}
                        </div>

                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="device"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "device" })}
                        </div>
                      </>
                    );
                  default:
                    return <></>;
                }
              })()}
            </div>
          ) : (
            <></>
          )}
          {gatewayState ? (
            <div className="DAT_PopupBG">
              <AddGateway
                data={props.data}
                // handleInvt={handleInvt}
                handleClose={handleCloseGateway}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="DAT_ProjectDataMobile">
          <div className="DAT_ProjectDataMobile_Header">
            <div className="DAT_ProjectDataMobile_Header_Left">
              <div
                className="DAT_ProjectDataMobile_Header_Left_Top"
                style={{ fontSize: 22 }}
              >
                {/* <img src={props.data.img ? props.data.img : "/dat_picture/solar_panel.png"} alt="" /> */}
                <div className="DAT_ProjectDataMobile_Header_Left_Top_Content">
                  <div className="DAT_ProjectDataMobile_Header_Left_Top_Content_Name">
                    {props.data.name_}
                  </div>
                  {/* <div style={{display: "flex", alignItems: "center" ,gap: 10}} >
                                        <div style={{color: "white", fontSize: 15}}>Trạng thái:  </div>{props.data.state_ === 1 ? <FaCheckCircle size={16} color="green" /> : <MdOutlineError size={16} color="red" />}
                                    </div> */}
                  {/* <div className="DAT_ProjectDataMobile_Header_Left_Top_Content_Addr">
                                {props.data.addr_}
                            </div> */}
                </div>
              </div>
            </div>

            <div className="DAT_ProjectDataMobile_Header_Right">
              <div className="DAT_ProjectDataMobile_Header_Right_More">
                <BsThreeDotsVertical
                  size={20}
                  color="white"
                  onClick={() => {
                    setModeState(!modeState);
                    viewNav.value = true;
                    viewStateNav.value = [true, true];
                  }}
                  onMouseLeave={() => handleOutsideView()}
                />
              </div>

              {/* {ruleInfor.value.setting.device.add
                            ? props.data.shared_ === 1
                                ? <></>
                                : <div className="DAT_ProjectDataMobile_Header_Right_Add"
                                    style={{ display: mode.value === "device" ? "block" : "none" }}
                                >
                                    <button
                                        id="add"
                                        onClick={() => {
                                            setGatewayState(true);
                                            setModeState(false);
                                        }}
                                    >
                                        <IoAddOutline size={25} color="white" />
                                    </button>
                                </div>
                            : <></>
                        } */}

              <div
                className="DAT_ProjectDataMobile_Header_Right_Close"
                onClick={() => {
                  handleCloseProjet();
                }}
              >
                <IoClose
                  size={25}
                  color="white"
                  id="Popup_"
                  onMouseEnter={(e) => handlePopup("new")}
                  onMouseLeave={(e) => handlePopup("pre")}
                />
              </div>
            </div>
          </div>

          <div className="DAT_ProjectDataMobile_Content">
            {(() => {
              switch (mode.value) {
                case "device":
                  return (
                    <Device
                      data={props.data}
                      popupGateway={handlePopupGateway}
                    />
                  );
                case "overview":
                  return <Dashboard data={props.data} />;
                default:
                  return (
                    <div className="DAT_Mobile_Overview" id="DAT_overview">
                      <Tooloverview projectid={props.data.plantid_} />
                    </div>
                  );
              }
            })()}
          </div>

          {modeState ? (
            <div
              className="DAT_ProjectDataDropMobile"
              style={{ display: viewNav.value ? "block" : "none" }}
              onMouseEnter={() => {
                viewStateNav.value = [true, true];
              }}
              onMouseLeave={() => {
                viewNav.value = false;
                viewStateNav.value = [false, false];
              }}
            >
              {(() => {
                switch (mode.value) {
                  case "device":
                    return (
                      <>
                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="overview"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "projectinfo" })}
                        </div>

                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="dashboard"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "overviewinterface" })}
                        </div>
                      </>
                    );
                  case "overview":
                    return (
                      <>
                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="dashboard"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "overviewinterface" })}
                        </div>

                        <div
                          className="DAT_ProjectDataDrop_Item"
                          id="device"
                          onClick={(e) => handleView(e)}
                        >
                          {dataLang.formatMessage({ id: "deviceinterface" })}
                        </div>
                      </>
                    );
                  default:
                    return (
                      <>
                        {/* <div className="DAT_ProjectDataDropMobile_Item"
                                                    id="dashboard"
                                                    onClick={(e) => handleView(e)}
                                                >
                                                    {dataLang.formatMessage({ id: "dashboard" })}
                                                </div>

                                                <div className="DAT_ProjectDataDropMobile_Item"
                                                    id="device"
                                                    onClick={(e) => handleView(e)}
                                                >
                                                    {dataLang.formatMessage({ id: "device" })}
                                                </div> */}
                      </>
                    );
                }
              })()}
            </div>
          ) : (
            <></>
          )}

          {gatewayState ? (
            <div className="DAT_PopupBGMobile">
              <AddGateway
                data={props.data}
                // handleInvt={handleInvt}
                handleClose={handleCloseGateway}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
}

export default Project;
