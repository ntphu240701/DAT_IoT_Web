import React, { useEffect } from "react";
import "./Warn.scss";

import { dataWarn, idDel, inf } from "./Warn";
import { alertDispatch } from "../Alert/Alert";
import { useIntl } from "react-intl";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { useSelector } from "react-redux";

import { IoClose } from "react-icons/io5";

export default function WarnPopup(props) {
  const dataLang = useIntl();
  const lang = useSelector((state) => state.admin.lang);

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

  const handleDeleteReport = async (e) => {
    // props.handleClose();

    const arr = idDel.value.split("_"); //['E02', 'T0623A000162']

    console.log(arr);
    // alertDispatch(dataLang.formatMessage({ id: "alert_28" }));

    const res = await callApi("post", host.DATA + "/removeWarn", {
      sn: arr[1],
      boxid: arr[0],
    });

    console.log(res);
    if (res.status) {
      props.handleClose();
      alertDispatch(dataLang.formatMessage({ id: "alert_28" }));
      dataWarn.value = dataWarn.value.filter((item) => item.boxid != arr[0]);
    }
  };

  // Handle close when press ESC
  useEffect(() => {
    // console.log(props.data);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        props.handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  return (
    <>
      {props.type === "info" ? (
        <div className="DAT_PopupWarnInfo_Box">
          <div className="DAT_PopupWarnInfo_Box_Head">
            <div className="DAT_PopupWarnInfo_Box_Head_Left">
              {props.data.level == "warn" ? (
                <div className="DAT_PopupWarnInfo_Box_Head_Left_TableWarning">
                  {props.data.name}
                </div>
              ) : (
                <div className="DAT_PopupWarnInfo_Box_Head_Left_TableNotice">
                  {props.data.name}
                </div>
              )}
            </div>

            <div className="DAT_PopupWarnInfo_Box_Head_Right">
              <div
                className="DAT_PopupWarnInfo_Box_Head_Right_Icon"
                onClick={() => props.handleClose()}
                id="Popup"
                onMouseEnter={(e) => handlePopup("new")}
                onMouseLeave={(e) => handlePopup("pre")}
              >
                <IoClose size={25}></IoClose>
              </div>
            </div>
          </div>

          <div className="DAT_PopupWarnInfo_Box_Body">
            <div className="DAT_PopupWarnInfo_Box_Body_Item">
              {dataLang.formatMessage({ id: "project" })}: &nbsp;
              {props.data.plant}
            </div>

            <div className="DAT_PopupWarnInfo_Box_Body_Item">
              {dataLang.formatMessage({ id: "device" })}: &nbsp;
              {props.data.device}
            </div>

            <div style={{ marginBottom: "8px" }}>
              {dataLang.formatMessage({ id: "cause" })}:
            </div>

            <div className="DAT_PopupWarnInfo_Box_Body_Item_Box">
              {props.data.cause.map((item, index) => (
                <div key={index} style={{ marginBottom: "5px" }}>
                  {item[lang]}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "8px" }}>
              {dataLang.formatMessage({ id: "solution" })} :
            </div>

            <div className="DAT_PopupWarnInfo_Box_Body_Item_Box">
              {props.data.solution.map((item, index) => (
                <div key={index} style={{ marginBottom: "5px" }}>
                  {item[lang]}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="DAT_PopupWarn_Box">
          <div className="DAT_PopupWarn_Box_Head">
            <div className="DAT_PopupWarn_Box_Head_Left">
              {dataLang.formatMessage({ id: "delWarn" })}
            </div>
            <div className="DAT_PopupWarn_Box_Head_Right">
              <div
                className="DAT_PopupWarn_Box_Head_Right_Icon"
                onClick={() => props.handleClose()}
                id="Popup"
                onMouseEnter={(e) => handlePopup("new")}
                onMouseLeave={(e) => handlePopup("pre")}
              >
                <IoClose size={25}></IoClose>
              </div>
            </div>
          </div>

          <div className="DAT_PopupWarn_Box_Body">
            {dataLang.formatMessage({ id: "delWarnmess" })}
          </div>

          <div className="DAT_PopupWarn_Box_Foot">
            <button
              style={{ backgroundColor: "rgba(11, 25, 103)", color: "white" }}
              onClick={(e) => handleDeleteReport(e)}
            >
              {dataLang.formatMessage({ id: "confirm" })}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
