import React, { useEffect, useRef } from "react";
import "./Control.scss";

import { plantData, plantState } from "./Signal";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { alertDispatch } from "../Alert/Alert";
// import { inverterDB, temp } from "./ProjectData";
import { userInfor } from "../../App";
import { useIntl } from "react-intl";

import { IoClose } from "react-icons/io5";
import { device, deviceCurrent, deviceData } from "./Device";

export default function PopupMonitor(props) {
  const dataLang = useIntl();

  const name_ = useRef();

  const popup_state = {
    pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
    new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" },
  };

  const handlePopup = (state) => {
    const popup = document.getElementById("Popup.");
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  };

  const handleConfirm = async (e) => {
    const addLoggerData = async (loggerid, sn, name) => {
      let d = await callApi("post", host.DATA + "/addLoggerData", {
        loggerid: loggerid,
        sn: sn,
        name: name,
      });
      console.log(d);
      if (d.status) {
        alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
        props.handleClose();
        deviceData.value.push(d.data);
      }
    };

    const dropLoggerData = async (loggerid, sn) => {
      let d = await callApi("post", host.DATA + "/dropLoggerData", {
        loggerdataid: loggerid,
        sn: sn,
      });
      // console.log(d)
      if (d.status) {
        alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
        props.handleClose();
        let index = deviceData.value.findIndex((item) => item.id_ == loggerid);
        deviceData.value.splice(index, 1);
        name_.current.value = "";
      }
    };

    const updateLoggerData = async (loggerid, name) => {
      let d = await callApi("post", host.DATA + "/updateLoggerData", {
        loggerdataid: loggerid,
        name: name,
      });
      if (d.status) {
        alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
        props.handleClose();
        console.log(deviceData.value);
        let index = deviceData.value.findIndex((item) => item.id_ == loggerid);
        deviceData.value[index] = {
          ...deviceData.value[index],
          name_: name,
        };
      }
    };

    if (props.type === "monitor") {
      console.log(props.popupType);
      if (props.popupType === "add") {
        if (!name_.current.value) {
          alertDispatch(dataLang.formatMessage({ id: "alert_17" }));
        } else {
          let index = device.value.findIndex(
            (item) => item.id_ == deviceCurrent.value
          );
          addLoggerData(
            device.value[index].id_,
            device.value[index].sn_,
            name_.current.value
          );
        }
      }
      if (props.popupType === "delete") {
        dropLoggerData(props.monitor.id_, props.monitor.sn_);
      }

      if (props.popupType === "edit") {
        let editname = document.getElementById("edit");
        if (!editname.value) {
          alertDispatch(dataLang.formatMessage({ id: "alert_17" }));
        } else {
          console.log(editname.value, props.monitor.id_);
          updateLoggerData(props.monitor.id_, editname.value);
        }
      }
    }
  };

  useEffect(() => {
    // console.log(props.monitor)
    let m = document.getElementById("edit");
    if (m !== null) {
      m.value = props.monitor.name_;
    }
  }, [props.monitor]);

  return (
    // <div className="DAT_DevicePopup">
    <div className="DAT_Popup_Box">
      <div className="DAT_Popup_Box_Head">
        <div className="DAT_Popup_Box_Head_Left">
          {props.type === "plant" ? (
            <>{dataLang.formatMessage({ id: "delete" })}</>
          ) : (
            <>
              {(() => {
                switch (props.popupType) {
                  case "add":
                    return dataLang.formatMessage({ id: "add" });
                  case "edit":
                    return dataLang.formatMessage({ id: "edit" });
                  default:
                    return dataLang.formatMessage({ id: "delete" });
                }
              })()}
            </>
          )}
        </div>
        <div className="DAT_Popup_Box_Head_Right">
          <div
            className="DAT_Popup_Box_Head_Right_Icon"
            onClick={() =>
              props.type === "plant"
                ? (plantState.value = "default")
                : props.handleClose()
            }
            id="Popup."
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
          >
            <IoClose size={25} />
          </div>
        </div>
      </div>

      <div className="DAT_Popup_Box_Body">
        <span>
          {(() => {
            switch (props.popupType) {
              case "add":
                return (
                  <>
                    <label>{dataLang.formatMessage({ id: "name" })}</label>
                    <input
                      type="text"
                      ref={name_}
                      placeholder={dataLang.formatMessage({ id: "typename" })}
                    />
                  </>
                );
              case "edit":
                return (
                  <>
                    <label>{dataLang.formatMessage({ id: "name" })}</label>
                    <input
                      type="text"
                      id="edit"
                      placeholder={dataLang.formatMessage({ id: "typename" })}
                    />
                  </>
                );
              case "delete":
                return (
                  <>
                    {dataLang.formatMessage({ id: "delDevicemess" })}
                    &nbsp;
                    <span style={{ fontFamily: "segoeui-sb" }}>
                      {props.monitor.name_}
                    </span>
                  </>
                );
              default:
                return <></>;
            }
          })()}
        </span>
      </div>

      <div className="DAT_Popup_Box_Foot">
        <button
          style={{ backgroundColor: "rgba(11, 25, 103)", color: "white" }}
          onClick={(e) => handleConfirm(e)}
        >
          {dataLang.formatMessage({ id: "confirm" })}
        </button>
      </div>
    </div>
    // </div>
  );
}
