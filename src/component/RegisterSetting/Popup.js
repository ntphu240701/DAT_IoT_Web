import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useIntl } from "react-intl";
import { COLOR } from "../../App";
import { configEdit } from "./RegisterSetting";

export default function Popup(props) {
  const dataLang = useIntl();
  const errAddRef1 = useRef();
  const errAddRef2 = useRef();
  const [editVal, setEditVal] = useState(0);

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

  useEffect(() => {
    if (props.type === "editConfig") {
      const t = props.data.find(
        (item) => item.id == configEdit.value.split("_")[0]
      ).register;
      console.log(
        t.find((con) => con.id == configEdit.value.split("_")[1]).val
      );
    }
  }, []);

  //addNewReg,
  return (
    <>
      {(() => {
        switch (props.type) {
          case "addNewReg":
            return (
              <form
                className="DAT_CreateErrSetting"
                //   onSubmit={(e) => {
                //     props.handleConfirm(
                //       e,
                //       codeRef1.current.value,
                //       codeRef2.current.value,
                //       codeRef3.current.value
                //     );
                //   }}
              >
                <div className="DAT_CreateErrSetting_Head">
                  <div className="DAT_CreateErrSetting_Head_Left">
                    {dataLang.formatMessage({ id: "createNew" })}
                  </div>
                  <div className="DAT_CreateErrSetting_Head_Right">
                    <div
                      className="DAT_CreateErrSetting_Head_Right_Icon"
                      id="Popup"
                      onClick={() => props.closeopen()}
                      onMouseEnter={(e) => handlePopup("new")}
                      onMouseLeave={(e) => handlePopup("pre")}
                    >
                      <IoClose size={25} />
                    </div>
                  </div>
                </div>

                <div className="DAT_CreateErrSetting_Body">
                  <span>{dataLang.formatMessage({ id: "errcode" })}:</span>
                  <input type="number" ref={errAddRef1} /> -
                  <input type="number" ref={errAddRef2} />
                </div>
                <div className="DAT_CreateErrSetting_Foot">
                  <div className="DAT_CreateErrSetting_Foot_Left">
                    {/* <span style={{ color: "red" }}>*</span>
                    <div className="DAT_CreateErrSetting_Foot_Left_Item">
                      <span>A: {dataLang.formatMessage({ id: "notice" })}</span>
                      <span>E: {dataLang.formatMessage({ id: "alert" })}</span>
                    </div> */}
                  </div>

                  <div className="DAT_CreateErrSetting_Foot_Right">
                    <button
                      style={{
                        backgroundColor: COLOR.value.PrimaryColor,
                        color: "white",
                      }}
                      onClick={(e) => {
                        props.closeopen();
                        props.handleSubmitAddNewReg(
                          errAddRef1.current.value,
                          errAddRef2.current.value
                        );
                        // props.handleConfirm(
                        //   e,
                        //   codeRef1.current.value,
                        //   codeRef2.current.value,
                        //   codeRef3.current.value
                        // );
                      }}
                    >
                      {dataLang.formatMessage({ id: "confirm" })}
                    </button>
                  </div>
                </div>
              </form>
            );
          case "editConfig":
            return (
              <div className="DAT_EditErr">
                <div className="DAT_EditErr_Head">
                  <div className="DAT_EditErr_Head_Left">
                    {dataLang.formatMessage({ id: "edit" })}
                  </div>
                  <div className="DAT_EditErr_Head_Right">
                    <div
                      className="DAT_EditErr_Head_Right_Icon"
                      id="Popup"
                      onClick={() => props.closeopen()}
                      onMouseEnter={(e) => handlePopup("new")}
                      onMouseLeave={(e) => handlePopup("pre")}
                    >
                      <IoClose size={25} />
                    </div>
                  </div>
                </div>

                <div className="DAT_EditErr_Body">
                  <div className="DAT_EditErr_Body_Head">
                    {dataLang.formatMessage({ id: "config" })}
                  </div>
                  <div className="DAT_EditErr_Body_Content">
                    <div className="DAT_EditErr_Body_Content_Item">
                      {/* <span>En</span> */}
                      {/* <textarea /> */}
                      <input
                        type="text"
                        value={
                          props.data
                            .find(
                              (item) =>
                                item.id == configEdit.value.split("_")[0]
                            )
                            .register.find(
                              (con) => con.id == configEdit.value.split("_")[1]
                            ).addr
                        }
                        disabled
                        required
                      />{" "}
                      :
                      <input
                        type="number"
                        defaultValue={
                          props.data
                            .find(
                              (item) =>
                                item.id == configEdit.value.split("_")[0]
                            )
                            .register.find(
                              (con) => con.id == configEdit.value.split("_")[1]
                            ).val
                        }
                        onChange={(e) => {
                          setEditVal(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="DAT_EditErr_Foot">
                  <button
                    style={{
                      backgroundColor: COLOR.value.PrimaryColor,
                      color: "white",
                    }}
                    onClick={(e) => {
                      props.closeopen();
                      props.handleEditConfig(editVal);
                    }}
                  >
                    {dataLang.formatMessage({ id: "confirm" })}
                  </button>
                </div>
              </div>
            );
          case "removeConfig":
            return (
              <div className="DAT_RemoveErr">
                <div className="DAT_RemoveErr_Head">
                  <div className="DAT_RemoveErr_Head_Left">
                    {dataLang.formatMessage({ id: "delete" })}
                  </div>
                  <div className="DAT_RemoveErr_Head_Right">
                    <div
                      className="DAT_RemoveErr_Head_Right_Icon"
                      id="Popup"
                      onClick={() => props.closeopen()}
                      onMouseEnter={(e) => handlePopup("new")}
                      onMouseLeave={(e) => handlePopup("pre")}
                    >
                      <IoClose size={25} />
                    </div>
                  </div>
                </div>
                <div className="DAT_RemoveErr_Body">
                  {dataLang.formatMessage({ id: "delErrorAddr" })}
                </div>
                <div className="DAT_RemoveErr_Foot">
                  <button
                    style={{
                      backgroundColor: COLOR.value.PrimaryColor,
                      color: "white",
                    }}
                    onClick={(e) => {
                      props.closeopen();
                      props.handleRemoveConfig();
                    }}
                  >
                    {dataLang.formatMessage({ id: "confirm" })}
                  </button>
                </div>
              </div>
            );
          case "removeError":
            return (
              <div className="DAT_RemoveErr">
                <div className="DAT_RemoveErr_Head">
                  <div className="DAT_RemoveErr_Head_Left">
                    {dataLang.formatMessage({ id: "delete" })}
                  </div>
                  <div className="DAT_RemoveErr_Head_Right">
                    <div
                      className="DAT_RemoveErr_Head_Right_Icon"
                      id="Popup"
                      onClick={() => props.closeopen()}
                      onMouseEnter={(e) => handlePopup("new")}
                      onMouseLeave={(e) => handlePopup("pre")}
                    >
                      <IoClose size={25} />
                    </div>
                  </div>
                </div>

                {(() => {
                  switch (props.type) {
                    case "REMOVECAUSE":
                      return (
                        <div className="DAT_RemoveErr_Body">
                          {dataLang.formatMessage({ id: "delCause" })}
                        </div>
                      );
                    case "REMOVESOLUTION":
                      return (
                        <div className="DAT_RemoveErr_Body">
                          {dataLang.formatMessage({ id: "delSolution" })}
                        </div>
                      );
                    default:
                      return (
                        <div className="DAT_RemoveErr_Body">
                          {dataLang.formatMessage({ id: "delErrorInfo" })}
                        </div>
                      );
                  }
                })()}

                <div className="DAT_RemoveErr_Foot">
                  <button
                    style={{
                      backgroundColor: COLOR.value.PrimaryColor,
                      color: "white",
                    }}
                    onClick={(e) => {
                      props.closeopen();
                      props.handleDelErr();
                    }}
                  >
                    {dataLang.formatMessage({ id: "confirm" })}
                  </button>
                </div>
              </div>
            );
        }
      })()}
    </>
  );
}
