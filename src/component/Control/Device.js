import React, { useContext, useEffect, useState } from "react";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { FaCheckCircle, FaRegFileAlt } from "react-icons/fa";
import { useIntl } from "react-intl";
import { ruleInfor } from "../../App";
import { MdDesktopAccessDisabled, MdOutlineError } from "react-icons/md";
import { IoMdMore } from "react-icons/io";
import { Menu, MenuItem, snackbarClasses } from "@mui/material";
import PopupState, {
  bindMenu,
  bindToggle,
  bindPopper,
  bindHover,
} from "material-ui-popup-state";
import { FiEdit, FiMonitor } from "react-icons/fi";
import {
  IoAddOutline,
  IoCaretBackOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { signal } from "@preact/signals-react";
import { ToolContext } from "../Context/ToolContext";
import { SettingContext } from "../Context/SettingContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import { defaultData, defaultDataState, plantState } from "./Signal";
import Popup from "./Popup";
import { isBrowser, useMobileOrientation } from "react-device-detect";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import PopupMonitor from "./PopupMonitor";
import { TbDeviceDesktopPlus } from "react-icons/tb";
import Typography from "@mui/material/Typography";
import Popper from "@mui/material/Popper";
// import PopupState, { bindPopper, bindHover } from "material-ui-popup-state";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { alertDispatch } from "../Alert/Alert";
import { CgScreen } from "react-icons/cg";
import { PiScreencastDuotone } from "react-icons/pi";

export const device = signal([]);
export const deviceData = signal([]);
export const deviceCurrent = signal(0);

function Device(props) {
  const dataLang = useIntl();
  // const [device, setDevice] = useState([]);

  const { toolDispatch } = useContext(ToolContext);
  const { currentID, settingDispatch } = useContext(SettingContext);
  const [popupState, setPopupState] = useState(false);
  const [popupMonitor, setPopupMonitor] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [dev, setDev] = useState({});
  const [monitor, setMonitor] = useState({});
  const [monitorList, setMonitorList] = useState(false);
  // const [defaultdata, setDefaultdata] = useState(0);
  const { isLandscape } = useMobileOrientation();

  const handleEdit = (e) => {
    let arr = e.currentTarget.id.split("_");
    console.log(arr);
    let index = device.value.findIndex((data) => data.id_ == arr[0]);
    setDev(device.value[index]);
    setPopupState(true);
    setPopupType(arr[1]);
  };

  const handleEditMonitor = (e) => {
    let arr = e.currentTarget.id.split("_");
    console.log(arr);
    let index = deviceData.value.findIndex((data) => data.id_ == arr[0]);
    setMonitor(deviceData.value[index]);
    setPopupMonitor(true);
    setPopupType(arr[1]);
  };
  const handleAddMonitor = (e) => {
    console.log(deviceCurrent.value);
    setMonitor([]);
    setPopupMonitor(true);
    setPopupType("add");
  };

  const handleScreen = (id) => {
    // console.log(e.currentTarget.id);
    // let arr = e.currentTarget.id.split("_");
    // console.log(arr);
    const getScreen = async () => {
      let res = await callApi("post", host.DATA + "/getLoggerScreen", {
        id: id,
      });
      console.log(res);
      if (res.status && res.data.length > 0) {
        let index = deviceData.value.findIndex((data) => data.id_ == id);
        // console.log(res.data, arr[0], deviceData.value[index].sn_)

        settingDispatch({
          type: "LOAD_SCREEN",
          payload: {
            currentID: id,
            currentSN: deviceData.value[index].sn_,
            currentName: deviceData.value[index].name_,
            screen: res.data,
          },
        });

        settingDispatch({
          type: "LOAD_LASTTAB",
          payload: parseInt(deviceData.value[index].tab_),
        });
        settingDispatch({
          type: "LOAD_DEFAULT",
          payload: parseInt(deviceData.value[index].defaulttab_),
        });

        res.data.map((data, index) => {
          toolDispatch({
            type: "LOAD_DEVICE",
            payload: {
              tab: data.tab_,
              visual: data.data_.data,
              setting: data.setting_,
              name: data.name_,
              lastid: data.data_.id,
            },
          });
        });

        plantState.value = "toollist";
      } else {
        alertDispatch(dataLang.formatMessage({ id: "alert_63" }));
      }
    };

    settingDispatch({ type: "RESET", payload: [] });
    getScreen();
  };

  useEffect(() => {
    // console.log(currentID)
    const getGateway = async () => {
      let res = await callApi("post", host.DATA + "/getLogger", {
        plantid: props.data.plantid_,
      });
      // console.log(res)
      if (res.status) {
        // setDevice(res.data)
        let temp = res.data.sort((a, b) => a.id_ - b.id_);
        device.value = temp;
      }
    };

    getGateway();
  }, []);

  const handleClosePopup = () => {
    setPopupState(false);
  };

  const handleCloseMonitor = () => {
    setPopupMonitor(false);
  };

  const handleShowInfo = (e) => {
    let arr = e.currentTarget.id.split("_");
    // console.log(arr);
    deviceCurrent.value = arr[0];
    let i = device.value.findIndex((data) => data.id_ == arr[0]);
    console.log(device.value[i]);
    defaultData.value.defaultscreenid_ = device.value[i].defaultscreenid_;
    defaultData.value.defaultscreenstate_ = device.value[i].defaultscreenstate_;
    // setDefaultdata(device.value[i].defaultscreenid_);

    const getList = async () => {
      let res = await callApi("post", host.DATA + "/getLoggerData", {
        id: arr[0],
        sn: arr[1],
      });
      console.log(res);
      if (res.status) {
        deviceData.value = res.data;
        if (
          device.value[i].defaultscreenstate_ &&
          device.value[i].defaultscreenid_ !== 0
        ) {
          handleScreen(device.value[i].defaultscreenid_);
        }
        // setDeviceState(true)
      }
    };
    getList();
  };

  const handleDefaultScreen = async (e) => {
    let arr = e.currentTarget.id.split("_");
    console.log(arr);

    let res = await callApi("post", host.DATA + "/setDefaultScreen", {
      loggerdataid: arr[0],
      sn: arr[1],
    });

    console.log(res);
    if (res.status) {
      console.log(device.value);
      let i = device.value.findIndex((data) => data.sn_ == arr[1]);

      device.value[i].defaultscreenid_ = parseInt(arr[0]);
      device.value[i].defaultscreenstate_ = 1;

      defaultData.value = {
        ...defaultData.value,
        defaultscreenid_: parseInt(arr[0]),
        defaultscreenstate_: 1,
      };

      alertDispatch(dataLang.formatMessage({ id: "alert_64" }));
    }
  };

  const handleDisableDefaultScreen = async (e) => {
    let arr = e.currentTarget.id.split("_");
    console.log(arr);
    let res = await callApi("post", host.DATA + "/disableDefaultScreen", {
      sn: arr[0],
    });

    console.log(res);
    if (res.status) {
      console.log(device.value);
      let i = device.value.findIndex((data) => data.sn_ == arr[0]);
      device.value[i].defaultscreenstate_ = 0;
      defaultData.value = {
        ...defaultData.value,
        defaultscreenid_: 0,
        defaultscreenstate_: 0,
      };
      alertDispatch(dataLang.formatMessage({ id: "alert_65" }));
    }
  };

  useEffect(() => {

    if (defaultDataState.value) {
     
      if (device.value && device.value.length > 0) {
        console.log(defaultDataState.value);
        console.log(deviceData.value);
        const id = device.value[0].id_;
        const sn = device.value[0].sn_;
        const getList = async () => {
          let res = await callApi("post", host.DATA + "/getLoggerData", {
            id: id,
            sn: sn,
          });
          console.log(res);
          if (res.status) {
            defaultDataState.value = false;
            deviceData.value = res.data;
            defaultData.value = {
              ...defaultData.value,
              defaultscreenid_: device.value[0].defaultscreenid_,
              defaultscreenstate_: device.value[0].defaultscreenstate_,
            };
            deviceCurrent.value = id;
          }
        };
        getList();

      }
    }

    // handleScreen(device.value[i].defaultscreenid_);
  }, [device.value, defaultDataState.value]);

  return (
    <>
      {isBrowser ? (
        <>
          <div className="DAT_Screen">
            <div className="DAT_Screen_Left">
              <div className="DAT_Screen_Left_head">
                <div>
                  {props.bu === "elev"
                    ? dataLang.formatMessage({ id: "gatewaylist" })
                    : dataLang.formatMessage({ id: "devicelist" })}
                </div>
                {ruleInfor.value.setting.device.add ? (
                  <AiOutlineAppstoreAdd
                    size={25}
                    style={{ cursor: "pointer" }}
                    onClick={() => props.popupGateway()}
                  />
                ) : (
                  <></>
                )}
              </div>

              <div className="DAT_Screen_Left_main">
                <div className="DAT_Screen_Left_main_list">
                  {device.value.map((data, i) => {
                    return (
                      <div
                        className="DAT_Screen_Left_main_list_item"
                        key={i}
                        style={{
                          backgroundColor:
                            Number(data.id_) === Number(deviceCurrent.value)
                              ? "rgb(175, 175, 175,.5)"
                              : "white",
                        }}
                      >
                        <div className="DAT_Screen_Left_main_list_item_content">
                          <div
                            className="DAT_Screen_Left_main_list_item_content_name"
                            id={`${data.id_}_${data.sn_}`}
                            onClick={(e) => handleShowInfo(e)}
                          >
                            <div className="DAT_Screen_Left_main_list_item_content_name_content">
                              {data.name_}
                            </div>
                            <div
                              className="DAT_Screen_Left_main_list_item_content_name_Icon"
                              style={{ cursor: "pointer" }}
                            >
                              <PopupState
                                variant="popper"
                                popupId="demo-popup-popper"
                              >
                                {(popupState) => (
                                  <div style={{ cursor: "pointer" }}>
                                    <HelpOutlineIcon
                                      {...bindHover(popupState)}
                                      color="action"
                                      fontSize="5px"
                                    />
                                    <Popper
                                      {...bindPopper(popupState)}
                                      transition
                                    >
                                      {({ TransitionProps }) => (
                                        <Fade
                                          {...TransitionProps}
                                          timeout={350}
                                        >
                                          <Paper
                                            sx={{
                                              width: "200px",
                                              marginLeft: "100px",
                                              p: 2,
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: "12px",
                                                textAlign: "justify",
                                                marginBottom: 1.7,
                                              }}
                                            >
                                              {dataLang.formatMessage({
                                                id: "description",
                                              })}
                                              : <br />- {data.description_}
                                            </Typography>
                                          </Paper>
                                        </Fade>
                                      )}
                                    </Popper>
                                  </div>
                                )}
                              </PopupState>
                            </div>
                          </div>
                          <div className="DAT_Screen_Left_main_list_item_content_sn">
                            {data.sn_}
                            <div className="DAT_Screen_Left_main_list_item_content_sn_state">
                              {data.state_ === 1 ? (
                                <FaCheckCircle size={16} color="green" />
                              ) : (
                                <MdOutlineError size={16} color="red" />
                              )}{" "}
                            </div>
                          </div>
                        </div>
                        {/* <div className='DAT_Screen_main_list_item_des' >{data.description_}</div> */}
                        <div className="DAT_Screen_Left_main_list_item_modify">
                          {ruleInfor.value.setting.device.modify ||
                            ruleInfor.value.setting.device.remove ? (
                            <PopupState
                              variant="popper"
                              popupId="demo-popup-popper"
                            >
                              {(popupState) => (
                                <div className="DAT_TableEdit">
                                  <IoMdMore
                                    size={20}
                                    {...bindToggle(popupState)}
                                  />
                                  <Menu {...bindMenu(popupState)}>
                                    {ruleInfor.value.setting.device.modify ? (
                                      <MenuItem
                                        id={`${data.id_}_edit`}
                                        onClick={(e) => {
                                          handleEdit(e);
                                          popupState.close();
                                        }}
                                      >
                                        <FiEdit size={14} />
                                        &nbsp;
                                        {dataLang.formatMessage({ id: "edit" })}
                                      </MenuItem>
                                    ) : (
                                      <></>
                                    )}
                                    {ruleInfor.value.setting.device.remove ? (
                                      <MenuItem
                                        id={`${data.id_}_delete`}
                                        onClick={(e) => {
                                          handleEdit(e);
                                          popupState.close();
                                        }}
                                      >
                                        <IoTrashOutline size={16} />
                                        &nbsp;
                                        {dataLang.formatMessage({
                                          id: "delete",
                                        })}
                                      </MenuItem>
                                    ) : (
                                      <></>
                                    )}

                                    <MenuItem
                                      id={`${data.sn_}_default`}
                                      onClick={(e) => {
                                        handleDisableDefaultScreen(e);
                                        popupState.close();
                                      }}
                                    >
                                      <MdDesktopAccessDisabled size={16} />
                                      &nbsp;
                                      {dataLang.formatMessage({
                                        id: "disdefault",
                                      })}
                                    </MenuItem>
                                  </Menu>
                                </div>
                              )}
                            </PopupState>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="DAT_Screen_Right">
              <div className="DAT_Screen_Right_head">
                <div>
                  {props.bu === "elev"
                    ? dataLang.formatMessage({ id: "elevlist" })
                    : dataLang.formatMessage({ id: "monitorlist" })}
                </div>
                {deviceCurrent.value === 0 ? (
                  <></>
                ) : ruleInfor.value.setting.monitor.add ? (
                  <TbDeviceDesktopPlus
                    size={25}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleAddMonitor();
                    }}
                  />
                ) : (
                  <></>
                )}
              </div>

              <div className="DAT_Screen_Right_sub">
                <div className="DAT_Screen_Right_sub_list">
                  {deviceData.value.map((data, i) => {
                    return (
                      <div className="DAT_Screen_Right_sub_list_item" key={i}>
                        <div className="DAT_Screen_Right_sub_list_item_content">
                          <div
                            className="DAT_Screen_Right_sub_list_item_content_name"
                            id={`${data.id_}_SCREEN`}
                            onClick={(e) => handleScreen(data.id_)}
                          >
                            <div className="DAT_Screen_Right_sub_list_item_content_name_icon">
                              <FiMonitor size={20} />
                            </div>
                            {/* &nbsp; */}
                            <div className="DAT_Screen_Right_sub_list_item_content_name_text">
                              {data.name_}
                            </div>
                          </div>
                        </div>
                        {ruleInfor.value.setting.monitor.modify ||
                          ruleInfor.value.setting.monitor.remove ? (
                          <div className="DAT_Screen_Right_sub_list_item_modify">
                            <PiScreencastDuotone
                              size={18}
                              color={
                                defaultData.value.defaultscreenstate_
                                  ? defaultData.value.defaultscreenid_ ===
                                    data.id_
                                    ? "green"
                                    : "gray"
                                  : "gray"
                              }
                              style={{ cursor: "pointer" }}
                              id={`${data.id_}_${data.sn_}_edit`}
                              onClick={(e) => {
                                handleDefaultScreen(e);
                              }}
                            />
                            {ruleInfor.value.setting.monitor.modify ? (
                              <FiEdit
                                size={16}
                                color="gray"
                                style={{ cursor: "pointer" }}
                                id={`${data.id_}_edit`}
                                onClick={(e) => {
                                  handleEditMonitor(e);
                                }}
                              />
                            ) : (
                              <></>
                            )}
                            {ruleInfor.value.setting.monitor.remove ? (
                              <RiDeleteBin6Line
                                size={16}
                                color="red"
                                style={{ cursor: "pointer" }}
                                id={`${data.id_}_delete`}
                                onClick={(e) => {
                                  handleEditMonitor(e);
                                }}
                              />
                            ) : (
                              <></>
                            )}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {popupState ? (
            <div className="DAT_PopupBG">
              <Popup
                handleClose={handleClosePopup}
                popupType={popupType}
                type={"device"}
                data={dev}
                plant={props.data}
              />
            </div>
          ) : (
            <></>
          )}

          {popupMonitor ? (
            <div className="DAT_PopupBG">
              <PopupMonitor
                handleClose={handleCloseMonitor}
                popupType={popupType}
                type={"monitor"}
                monitor={monitor}
                plant={props.data}
              />
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          {monitorList ? (
            <div className="DAT_ScreenMobile">
              <div className="DAT_ScreenMobile_Tit">
                <div className="DAT_ScreenMobile_Tit_icon">
                  <IoCaretBackOutline
                    size={20}
                    color="black"
                    onClick={() => setMonitorList(false)}
                  />
                  {props.bu === "elev"
                    ? dataLang.formatMessage({ id: "elevlist" })
                    : dataLang.formatMessage({ id: "monitorlist" })}
                </div>
                {ruleInfor.value.setting.monitor.add ? (
                  <TbDeviceDesktopPlus
                    size={20}
                    color="black"
                    onClick={() => {
                      handleAddMonitor();
                    }}
                  />
                ) : (
                  <></>
                )}
              </div>
              <div
                className="DAT_ScreenMobile_sub"
                style={{
                  height: isLandscape
                    ? "calc(100vh - 220px)"
                    : "calc(100vh - 300px)",
                }}
              >
                <div className="DAT_ScreenMobile_sub_list">
                  {deviceData.value.map((data, i) => {
                    return (
                      <div className="DAT_ScreenMobile_sub_list_item" key={i}>
                        <div className="DAT_ScreenMobile_sub_list_item_content">
                          <div
                            className="DAT_ScreenMobile_sub_list_item_content_name"
                            id={`${data.id_}_SCREEN`}
                            onClick={(e) => handleScreen(data.id_)}
                          >
                            <div className="DAT_ScreenMobile_sub_list_item_content_name_icon">
                              <FiMonitor size={60} />
                            </div>
                            {/* &nbsp; */}
                            <div className="DAT_ScreenMobile_sub_list_item_content_name_text">
                              {data.name_}
                            </div>
                          </div>
                        </div>
                        {ruleInfor.value.setting.monitor.modify ||
                          ruleInfor.value.setting.monitor.remove ? (
                          <div className="DAT_ScreenMobile_sub_list_item_modify">
                            <PiScreencastDuotone
                              size={18}
                              color={
                                defaultData.value.defaultscreenstate_
                                  ? defaultData.value.defaultscreenid_ ===
                                    data.id_
                                    ? "green"
                                    : "gray"
                                  : "gray"
                              }
                              style={{ cursor: "pointer" }}
                              id={`${data.id_}_${data.sn_}_edit`}
                              onClick={(e) => {
                                handleDefaultScreen(e);
                              }}
                            />
                            {ruleInfor.value.setting.monitor.modify ? (
                              <FiEdit
                                size={16}
                                color="gray"
                                style={{ cursor: "pointer" }}
                                id={`${data.id_}_edit`}
                                onClick={(e) => {
                                  handleEditMonitor(e);
                                }}
                              />
                            ) : (
                              <></>
                            )}
                            {ruleInfor.value.setting.monitor.remove ? (
                              <RiDeleteBin6Line
                                size={16}
                                color="red"
                                style={{ cursor: "pointer" }}
                                id={`${data.id_}_delete`}
                                onClick={(e) => {
                                  handleEditMonitor(e);
                                }}
                              />
                            ) : (
                              <div
                                style={{ width: "16px", height: "16px" }}
                              ></div>
                            )}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="DAT_ScreenMobile">
              <div className="DAT_ScreenMobile_Tit">
                {props.bu === "elev"
                  ? dataLang.formatMessage({ id: "gatewaylist" })
                  : dataLang.formatMessage({ id: "devicelist" })}
                {ruleInfor.value.setting.device.add ? (
                  <AiOutlineAppstoreAdd
                    size={20}
                    color="black"
                    onClick={() => props.popupGateway()}
                  />
                ) : (
                  <></>
                )}
              </div>
              <div
                className="DAT_ScreenMobile_main"
                style={{
                  height: isLandscape
                    ? "calc(100vh - 220px)"
                    : "calc(100vh - 300px)",
                }}
              >
                {device.value.map((data, i) => {
                  return (
                    <div className="DAT_ScreenMobile_main_item" key={i}>
                      <div className="DAT_ScreenMobile_main_item_top">
                        <div
                          className="DAT_ScreenMobile_main_item_top_avatar"
                          id={`${data.id_}_${data.sn_}`}
                          onClick={(e) => {
                            handleShowInfo(e);
                            setMonitorList(true);
                          }}
                        >
                          {i + 1}
                        </div>
                        <div className="DAT_ScreenMobile_main_item_top_content">
                          <div
                            className="DAT_ScreenMobile_main_item_top_content_name"
                            id={`${data.id_}_${data.sn_}`}
                            onClick={(e) => {
                              handleShowInfo(e);
                              setMonitorList(true);
                            }}
                          >
                            {data.name_}
                          </div>

                          <div className="DAT_ScreenMobile_main_item_top_content_sn">
                            SN: {data.sn_}
                          </div>
                          <div className="DAT_ScreenMobile_main_item_top_content_state">
                            <div className="DAT_ScreenMobile_main_item_top_content_state_status">
                              Trạng thái:{" "}
                              {data.state_ === 1 ? (
                                <FaCheckCircle size={16} color="green" />
                              ) : (
                                <MdOutlineError size={18} color="red" />
                              )}
                            </div>
                            <PopupState
                              variant="popper"
                              popupId="demo-popup-popper"
                            >
                              {(popupState) => (
                                <div className="DAT_ScreenMobile_main_item_top_content_state_status">
                                  Mô tả:
                                  <HelpOutlineIcon
                                    {...bindHover(popupState)}
                                    color="action"
                                    fontSize="5px"
                                  />
                                  <Popper
                                    {...bindPopper(popupState)}
                                    transition
                                  >
                                    {({ TransitionProps }) => (
                                      <Fade {...TransitionProps} timeout={350}>
                                        <Paper
                                          sx={{
                                            width: "200px",
                                            marginLeft: "100px",
                                            p: 2,
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              fontSize: "12px",
                                              textAlign: "justify",
                                              marginBottom: 1.7,
                                            }}
                                          >
                                            {dataLang.formatMessage({
                                              id: "description",
                                            })}
                                            : <br />- {data.description_}
                                          </Typography>
                                        </Paper>
                                      </Fade>
                                    )}
                                  </Popper>
                                </div>
                              )}
                            </PopupState>
                          </div>
                        </div>
                      </div>
                      {ruleInfor.value.setting.device.modify ||
                        ruleInfor.value.setting.device.remove ? (
                        <div className="DAT_ScreenMobile_main_item_bottom">
                          {ruleInfor.value.setting.device.modify ? (
                            <FiEdit
                              size={16}
                              color="gray"
                              style={{ cursor: "pointer" }}
                              id={`${data.id_}_edit`}
                              onClick={(e) => {
                                handleEdit(e);
                              }}
                            />
                          ) : (
                            <></>
                          )}
                          {ruleInfor.value.setting.device.remove ? (
                            <RiDeleteBin6Line
                              size={16}
                              color="red"
                              style={{ cursor: "pointer" }}
                              id={`${data.id_}_delete`}
                              onClick={(e) => {
                                handleEdit(e);
                              }}
                            />
                          ) : (
                            <></>
                          )}

                          <MdDesktopAccessDisabled
                            size={16}
                            color="red"
                            style={{ cursor: "pointer" }}
                            id={`${data.sn_}_default`}
                            onClick={(e) => {
                              handleDisableDefaultScreen(e);
                            }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}

                      {/* <div className='DAT_ScreenMobile_main_item_content' >
                                                <div className='DAT_ScreenMobile_main_item_content_name'
                                                    id={`${data.id_}_${data.sn_}`}
                                                    onClick={(e) => { handleShowInfo(e); setMonitorList(true) }}
                                                >
                                                    <div className='DAT_ScreenMobile_main_item_content_name_content'>{data.name_}</div>
                                                    <div className='DAT_ScreenMobile_main_item_content_name_state'>{data.state_ === 1 ? <FaCheckCircle size={16} color="green" /> : <MdOutlineError size={16} color="red" />}</div>
                                                </div>
                                                <div className='DAT_ScreenMobile_main_item_content_sn'>{data.sn_}</div>
                                            </div>

                                            <div className='DAT_ScreenMobile_main_item_des' >{data.description_}</div>

                                            <div className='DAT_ScreenMobile_main_item_modify'>

                                                <PopupState variant="popper" popupId="demo-popup-popper">
                                                    {(popupState) => (<div className="DAT_TableEdit">
                                                        <IoMdMore size={20}   {...bindToggle(popupState)} />
                                                        <Menu {...bindMenu(popupState)}>

                                                            <MenuItem
                                                                id={`${data.id_}_edit`}
                                                                onClick={(e) => { handleEdit(e); popupState.close(); }}

                                                            >
                                                                <FiEdit size={14} />
                                                                &nbsp;
                                                                {dataLang.formatMessage({ id: "edit" })}
                                                            </MenuItem>
                                                            <MenuItem
                                                                id={`${data.id_}_delete`}
                                                                onClick={(e) => { handleEdit(e); popupState.close(); }}
                                                            >
                                                                <IoTrashOutline size={16} />
                                                                &nbsp;
                                                                {dataLang.formatMessage({ id: "delete" })}
                                                            </MenuItem>
                                                        </Menu>
                                                    </div>)}
                                                </PopupState>
                                            </div> */}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {popupState ? (
            <div className="DAT_PopupBGMobile">
              <Popup
                handleClose={handleClosePopup}
                popupType={popupType}
                type={"device"}
                data={dev}
                plant={props.data}
              />
            </div>
          ) : (
            <></>
          )}

          {popupMonitor ? (
            <div className="DAT_PopupBGMobile">
              <PopupMonitor
                handleClose={handleCloseMonitor}
                popupType={popupType}
                type={"monitor"}
                monitor={monitor}
                plant={props.data}
              />
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}

export default Device;
