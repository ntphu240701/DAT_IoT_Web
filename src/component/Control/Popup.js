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

export default function Popup(props) {
  const dataLang = useIntl();
  const name = useRef();

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

  const handleDelete = (e) => {
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
    dropProject()
  };

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
                          <label>Tên</label>
                          <input
                            type="text"
                            placeholder="Nhập tên"
                          />
                        </>
                      );
                    case "edit":
                      return (
                        <>
                          <label>Tên</label>
                          <input
                            type="text"
                            placeholder="Nhập tên"
                            // defaultValue={props.devname}
                            style={{ marginBottom: "16px" }}
                          />

                          <label>Mô tả</label>
                          <textarea
                            type="text"
                            placeholder="Nhập mô tả"
                          // defaultValue={props.devdes}
                          />
                        </>
                      );
                    case "edit-monitor":
                      return (
                        <>
                          <label>Tên</label>
                          <input
                            type="text"
                            placeholder="Nhập tên"
                          />
                        </>
                      )
                    case "delete-monitor":
                      return (
                        <>
                          {dataLang.formatMessage({ id: 'delDevicemess' })}
                          &nbsp;
                          <span style={{ fontFamily: "Montserrat-Bold" }}>
                            {props.name}
                          </span>
                        </>
                      )
                    default:
                      return (
                        <>
                          {dataLang.formatMessage({ id: 'delDevicemess' })}
                          &nbsp;
                          <span style={{ fontFamily: "Montserrat-Bold" }}>
                            {props.name}
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
            onClick={(e) => handleDelete(e)}
          >
            {dataLang.formatMessage({ id: 'confirm' })}
          </button>
        </div>
      </div>
    </div>


  );
}
