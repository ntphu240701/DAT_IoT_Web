import React, { useEffect, useRef } from "react";
import "./Control.scss";


import { useIntl } from "react-intl";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { alertDispatch } from "../Alert/Alert";
import { Token } from "../../App";

import { IoClose } from "react-icons/io5";
import { device, deviceCurrent, deviceData } from "./Device";

export default function AddGateway(props) {
  const dataLang = useIntl();
  const sn = useRef();
  const name = useRef();

  const popup_state = {
    pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
    new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" },
  };

  const handlePopup = (state) => {
    const popup = document.getElementById("Popup");
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  };

  const handleSave = async (e) => {
    if (sn.current.value === "" || name.current.value === "") {
      alertDispatch(dataLang.formatMessage({ id: "alert_22" }))
    } else {
      const d = await callApi("post", host.DATA + "/addLogger", {
        plantid: props.data.plantid_,
        sn: sn.current.value,
        name: name.current.value,
      });
      // console.log(d)
      if (d.status) {
        // temp.value = [...temp.value, d.data];
        props.handleClose();
        device.value = [...device.value, d.data];
        deviceData.value = []
        deviceCurrent.value = 0
      }
      if (d.status === true) {
        alertDispatch(dataLang.formatMessage({ id: "alert_32" }))
      } else if (d.number === 0) {
        alertDispatch(dataLang.formatMessage({ id: "alert_35" }))
      } else {
        alertDispatch(dataLang.formatMessage({ id: "alert_7" }))
      }
      
    }
  };



  return (
    <div className="DAT_AddGateway">
      <div className="DAT_AddGateway_Head">
        <div className="DAT_AddGateway_Head_Left">
          <p>{dataLang.formatMessage({ id: 'ADD' })} Gateway</p>
        </div>

        <div className="DAT_AddGateway_Head_Right">
          <div
            className="DAT_AddGateway_Head_Right_Icon"
            onClick={() => props.handleClose()}
          >
            <IoClose
              size={25}
              id="Popup"
              onMouseEnter={(e) => handlePopup("new")}
              onMouseLeave={(e) => handlePopup("pre")}
            />
          </div>
        </div>
      </div>

      <div className="DAT_AddGateway_Body">
        <div className="DAT_AddGateway_Body_Input">
          <span>SN:</span>
          <input id="sn" type="text" placeholder={dataLang.formatMessage({ id: 'enterCode' })} ref={sn} />
        </div>

        <div className="DAT_AddGateway_Body_Input">
          <span>{dataLang.formatMessage({ id: 'name' })}:</span>
          <input id="name" type="text" placeholder={dataLang.formatMessage({ id: 'enterDev' })} ref={name} />
        </div>

      </div>

      <div className="DAT_AddGateway_Foot">
        <button
          style={{ backgroundColor: "rgba(11, 25, 103)", color: "white" }}
          onClick={(e) => handleSave(e)}
        >
          {dataLang.formatMessage({ id: 'confirm' })}
        </button>
      </div>
    </div>
  );
}
