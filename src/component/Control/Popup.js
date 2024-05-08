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
import Device, { device, deviceCurrent, deviceData } from "./Device";

export default function Popup(props) {
  const dataLang = useIntl();

  const name_ = useRef();

  const popup_state = {
    pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
    new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" }
  }

  const handlePopup = (state) => {
    const popup = document.getElementById("Popup-")
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  }


  const handleConfirm = async (e) => {
    const dropProject = async () => {
      let d = await callApi('post', host.DATA + '/dropPlant', {
        plantid: props.plantid,
        usr: props.usr,
        partnerid: userInfor.value.partnerid,
        type: userInfor.value.type
      })
      if (d.status === true) {
        alertDispatch(dataLang.formatMessage({ id: 'alert_24' }));

        plantData.value = plantData.value.filter(
          (item) => item.plantid_ != props.plantid
        );
        plantState.value = 'default';
      }
    };

    const dropLogger = async (sn, plantid) => {
      let d = await callApi('post', host.DATA + '/dropLogger', {
        plantid: plantid,
        sn: sn,
      })
      if (d.status) {
        alertDispatch(dataLang.formatMessage({ id: 'alert_25' }));
        props.handleClose();
        device.value = device.value.filter((item) => item.sn_ != sn);
        deviceData.value = []
        deviceCurrent.value = 0

      }
    }

    const updateLogger = async (sn, name, des) => {
      let d = await callApi('post', host.DATA + '/updateLogger', {
        sn: sn,
        name: name,
        des: des
      })
      console.log(d)
      if (d.status) {
        alertDispatch(dataLang.formatMessage({ id: 'alert_25' }));
        props.handleClose();
        let index = device.value.findIndex(item => item.sn_ == sn)
        device.value[index] = {
          ...device.value[index],
          name_: name,
          description_: des
        }

      }
    }

    const addLoggerData = async (loggerid, sn, name) => {
      let d = await callApi('post', host.DATA + '/addLoggerData', {
        loggerid: loggerid,
        sn: sn,
        name: name
      })
      console.log(d)
      if (d.status) {
        // alertDispatch(dataLang.formatMessage({ id: 'alert_25' }));
        // props.handleClose();


      }
    }

    const dropLoggerData = async (loggerid, sn) => {
      let d = await callApi('post', host.DATA + '/dropLoggerData', {
        loggerdataid: loggerid,
        sn: sn
      })
      console.log(d)
      if (d.status) {
        // alertDispatch(dataLang.formatMessage({ id: 'alert_25' }));
        // props.handleClose();


      }
    }

    const updateLoggerData = async (loggerid, name) => {
      let d = await callApi('post', host.DATA + '/updateLoggerData', {
        loggerdataid: loggerid,
        name: name
      })
      console.log(d)
      if (d.status) {
        // alertDispatch(dataLang.formatMessage({ id: 'alert_25' }));
        // props.handleClose();


      }
    }


    if (props.type === "plant") {
      dropProject()
    } else {
      console.log(props.popupType)
      if (props.popupType === "delete") {
        // console.log(props.data, props.plant)
        dropLogger(props.data.sn_, props.plant.plantid_)
      }

      if (props.popupType === "edit") {
        let name = document.getElementById("edit-name").value
        let des = document.getElementById("edit-des").value

        if (!name || !des) {
          alertDispatch(dataLang.formatMessage({ id: 'alert_17' }));
        } else {
          updateLogger(props.data.sn_, name, des)
        }
      }

      if (props.popupType === 'add') {
        if (!name_.current.value) {
          alertDispatch(dataLang.formatMessage({ id: 'alert_17' }));
        } else {
          addLoggerData(props.data.id_, props.data.sn_, name_.current.value)
        }
      }


      if (props.popupType === 'delete-monitor') {

        // console.log(props.monitor)
        dropLoggerData(props.monitor.id_, props.monitor.sn_)

      }

      if (props.popupType === 'edit-monitor') {

        // console.log(props.monitor)
        let editname = document.getElementById("edit-monitor")
        if (!editname.value) {
          alertDispatch(dataLang.formatMessage({ id: 'alert_17' }));
        } else {
          console.log(editname.value, props.monitor.id_)
          updateLoggerData(props.monitor.id_, editname.value)
        }

      }
    }
  };

  // useEffect(() => {
  //   // console.log(props.monitor)
  //   let m = document.getElementById("edit-monitor")
  //   if (m !== null) {
  //     m.value = props.monitor.name_
  //   }

  // }, [props.monitor])

  useEffect(() => {
    // console.log(props.data)

    let n = document.getElementById("edit-name")
    if (n !== null) {
      n.value = props.data.name_
    }

    let d = document.getElementById("edit-des")
    if (d !== null) {
      d.value = props.data.description_
    }

    // let a = document.getElementById("add")
    // if (a !== null) {
    //   a.value = 'New Sreen'
    // }



  }, [props.data])

  const handleUpdate = (e) => {

  }

  // Handle close when press ESC
  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if (event.key === "Escape") {
  //       popupState.value = false;
  //     }
  //   };

  //   document.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div className="DAT_DevicePopup">
      <div className="DAT_Popup_Box">
        <div className="DAT_Popup_Box_Head">
          <div className="DAT_Popup_Box_Head_Left">
            {props.type === "plant"
              ?
              <>
                {dataLang.formatMessage({ id: 'delete' })}
              </>
              :
              <>
                {(() => {
                  switch (props.popupType) {
                    case "add":
                      return dataLang.formatMessage({ id: 'add' });
                    case "edit":
                      return dataLang.formatMessage({ id: 'edit' });
                    case "edit-monitor":
                      return dataLang.formatMessage({ id: 'edit' });
                    default:
                      return dataLang.formatMessage({ id: 'delete' });
                  }
                })()}
              </>
            }
          </div>
          <div className="DAT_Popup_Box_Head_Right">
            <div className="DAT_Popup_Box_Head_Right_Icon"
              onClick={() => props.type === "plant" ? (plantState.value = 'default') : props.handleClose()}
              id="Popup-"
              onMouseEnter={(e) => handlePopup("new")}
              onMouseLeave={(e) => handlePopup("pre")}
            >
              <IoClose size={25} />
            </div>
          </div>
        </div>

        <div className="DAT_Popup_Box_Body">
          <span>
            {props.type === "plant"
              ?
              <>
                {dataLang.formatMessage({ id: 'delPlant' })}
                &nbsp;
                <span style={{ fontFamily: "Montserrat-Bold" }}>
                  {props.name}
                </span>
              </>
              :
              <>
                {(() => {
                  switch (props.popupType) {
                    case "add":
                      return (
                        <>
                          <label>{dataLang.formatMessage({ id: 'name' })}</label>
                          <input
                            type="text"
                            ref={name_}
                            placeholder={dataLang.formatMessage({ id: 'typename' })}
                          />
                        </>
                      );
                    case "edit":
                      return (
                        <>
                          <label>{dataLang.formatMessage({ id: 'name' })}</label>
                          <input
                            type="text"
                            placeholder={dataLang.formatMessage({ id: 'typename' })}
                            id="edit-name"
                            style={{ marginBottom: "16px" }}

                          />

                          <label>{dataLang.formatMessage({ id: 'description' })}</label>
                          <textarea
                            type="text"
                            placeholder={dataLang.formatMessage({ id: 'typedescription' })}
                            id="edit-des"
                          />
                        </>
                      );
                    case "edit-monitor":
                      return (
                        <>
                          <label>{dataLang.formatMessage({ id: 'name' })}</label>
                          <input
                            type="text"
                            id="edit-monitor"
                            placeholder={dataLang.formatMessage({ id: 'typename' })}

                          />
                        </>
                      )
                    case "delete-monitor":
                      return (
                        <>
                          {dataLang.formatMessage({ id: 'delDevicemess' })}
                          &nbsp;
                          <span style={{ fontFamily: "Montserrat-Bold" }}>
                            {props.monitor.name_}
                          </span>
                        </>
                      )
                    default:
                      return (
                        <>
                          {dataLang.formatMessage({ id: 'delDevicemess' })}
                          &nbsp;
                          <span style={{ fontFamily: "Montserrat-Bold" }} >
                            {props.data?.sn_ || '...'}
                          </span>
                        </>
                      )
                  }
                })()}
              </>
            }
          </span>
        </div>

        <div className="DAT_Popup_Box_Foot">
          <button
            style={{ backgroundColor: "rgba(11, 25, 103)", color: "white" }}
            onClick={(e) => handleConfirm(e)}
          >
            {dataLang.formatMessage({ id: 'confirm' })}
          </button>
        </div>
      </div>
    </div>


  );
}
