import React, { useEffect, useState } from "react";
import "./RegisterSetting.scss";
import { isBrowser, isMobile } from "react-device-detect";
import { signal } from "@preact/signals-react";
import { useIntl } from "react-intl";
import { IoIosAddCircleOutline, IoMdAdd, IoMdMore } from "react-icons/io";
import { Empty } from "../Project/Project";
import { FiEdit } from "react-icons/fi";
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import {
  IoAddOutline,
  IoCaretBackOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { PiUsersFour } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";
import { partnerInfor, ruleInfor, userInfor } from "../../App";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import PopupState, { bindMenu, bindToggle } from "material-ui-popup-state";
import { Menu, MenuItem } from "@mui/material";
import DataTable from "react-data-table-component";
import Popup from "./Popup";
import { lowercasedata } from "../ErrorSetting/ErrorSetting";
import { MdOutlineManageHistory } from "react-icons/md";

export const groupRegID = signal("");
export const configEdit = signal("");

export default function RegisterSetting() {
  const [dataGateway, setDataGateway] = useState([]);
  const [dataGatewaySub, setDataGatewaySub] = useState([]);
  const [dataRegister, setDataRegister] = useState([]);
  const [popup, setPopup] = useState(false);
  const [statePopup, setStatePopup] = useState("");
  const [regList, setRegList] = useState(false);

  const dataLang = useIntl();

  const columnGroupRole = [
    {
      name: dataLang.formatMessage({ id: "ordinalNumber" }),
      selector: (row, index) => index + 1,
      sortable: true,
      width: "80px",
      style: {
        justifyContent: "left",
        height: "auto !important",
      },
    },
    {
      name: dataLang.formatMessage({ id: "erroraddress" }),
      selector: (user) => user.addrcode,
      sortable: true,
      width: "150px",
      style: {
        height: "auto !important",
        justifyContent: "left !important",
      },
    },
    //CONFIG
    {
      name: dataLang.formatMessage({ id: "config" }),
      selector: (row) => {
        let cause = row.register.sort((a, b) => a.id - b.id);
        // console.log(cause);
        return (
          <div style={{ height: "auto" }}>
            {cause.map((err, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 0",
                    gap: "20px",
                  }}
                >
                  <div className="DAT_TableText">
                    {err.addr}: {err.val}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "10px",
                    }}
                  >
                    <FiEdit
                      size={16}
                      style={{ cursor: "pointer" }}
                      id={`${row.id}_${err.id}_EDIT`}
                      onClick={(e) => {
                        changePopupstate();
                        setStatePopup("editConfig");
                        handleSetConfig(e);
                      }}
                    />
                    <IoTrashOutline
                      size={16}
                      style={{ cursor: "pointer" }}
                      id={`${row.id}_${err.id}_REMOVE`}
                      onClick={(e) => {
                        changePopupstate();
                        setStatePopup("removeConfig");
                        handleSetConfig(e);
                      }}
                    />
                    {parseInt(index) === cause.length - 1 ? (
                      <IoIosAddCircleOutline
                        size={16}
                        style={{ cursor: "pointer" }}
                        id={`${row.id}_ADD`}
                        onClick={(e) => {
                          handleAddConfig(e);
                          handleSetConfig(e);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      },
      style: {
        minWidth: "200px",
        height: "auto !important",
        justifyContent: "center !important",
      },
    },
    {
      name: dataLang.formatMessage({ id: "setting" }),
      selector: (row) => (
        <>
          {row.type_ === "master" ? (
            <></>
          ) : (
            <PopupState variant="popper" popupId="demo-popup-popper">
              {(popupState) => (
                <div className="DAT_TableEdit">
                  <IoMdMore size={20} {...bindToggle(popupState)} />
                  <Menu {...bindMenu(popupState)}>
                    <MenuItem
                      id={row.id}
                      onClick={(e) => {
                        changePopupstate();
                        setStatePopup("removeError");
                        configEdit.value = e.currentTarget.id;
                        console.log(configEdit.value);
                      }}
                    >
                      <IoTrashOutline size={16} />
                      &nbsp;
                      {dataLang.formatMessage({ id: "delete" })}
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </PopupState>
          )}
        </>
      ),
      width: "80px",
      style: {
        height: "auto !important",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: dataLang.formatMessage({ id: "row" }),
    rangeSeparatorText: dataLang.formatMessage({ id: "to" }),
    selectAllRowsItem: true,
    selectAllRowsItemText: dataLang.formatMessage({ id: "showAll" }),
  };

  const usr = useSelector((state) => state.admin.usr);

  const handleSetConfig = (e) => {
    configEdit.value = e.currentTarget.id;
    console.log(e.currentTarget.id);
  };

  const handleChangeGroup = (e) => {
    groupRegID.value = e.currentTarget.id;
    console.log(groupRegID.value);
    const getRegister = async (sn) => {
      let inf = await callApi("post", host.DATA + "/getRegister", {
        sn: sn,
      });
      // console.log(inf);
      if (inf.status === true) {
        if (inf.data.length > 0) {
          setDataRegister(inf.data[0].setting_);
          console.log(inf.data);
        } else {
          setDataRegister([]);
        }
      }
    };
    console.log(dataRegister);
    getRegister(e.currentTarget.id);
  };

  const changePopupstate = (e) => {
    setPopup(!popup);
  };

  //FUNCTION POPUP

  const handleSubmitAddNewReg = (errAdd1, errAdd2) => {
    console.log(errAdd1, errAdd2);
    let temp = [...dataRegister];
    temp = [
      ...temp,
      {
        id: parseInt(temp.length) + 1,
        addrcode: `${errAdd1}-${errAdd2}`,
        register: [
          {
            id: 1,
            addr: `${errAdd1}-${errAdd2}`,
            val: "1",
          },
        ],
      },
    ];
    console.log(temp, groupRegID.value);
    const upReg = async () => {
      let req = await callApi("post", `${host.DATA}/updateRegister`, {
        sn: groupRegID.value,
        data: JSON.stringify(temp),
      });
      console.log(req);
      setDataRegister([...temp]);
    };
    upReg();
  };

  const handleEditConfig = (editVal) => {
    const temp = configEdit.value.split("_");
    const i = dataRegister.findIndex((data) => data.id == temp[0]);
    const j = dataRegister[i].register.findIndex((data) => data.id == temp[1]);
    let t = dataRegister;
    t[i].register[j].val = editVal;
    const upReg = async () => {
      let req = await callApi("post", `${host.DATA}/updateRegister`, {
        sn: groupRegID.value,
        data: JSON.stringify(t),
      });
      console.log(req);
      setDataRegister([...t]);
    };
    upReg();
    console.log(t);
  };

  const handleRemoveConfig = () => {
    const temp = configEdit.value.split("_");
    const i = dataRegister.findIndex((data) => data.id == temp[0]);
    const j = dataRegister[i].register.findIndex((data) => data.id == temp[1]);
    const t = dataRegister;
    dataRegister[i].register.splice(j, 1);
    setDataRegister([...dataRegister]);
    const upReg = async () => {
      let req = await callApi("post", `${host.DATA}/updateRegister`, {
        sn: groupRegID.value,
        data: JSON.stringify(t),
      });
      console.log(req);
      setDataRegister([...t]);
    };
    upReg();
    console.log(t);
  };

  const handleAddConfig = (e) => {
    const temp = e.currentTarget.id.split("_");
    const i = dataRegister.findIndex((data) => data.id == temp[0]);
    // console.log(dataRegister[i].register.length);
    // console.log(
    //   dataRegister[i].register[dataRegister[i].register.length - 1].id
    // );
    const t = dataRegister;
    t[i].register.push({
      id: t[i].register[t[i].register.length - 1].id + 1,
      addr: t[i].register[t[i].register.length - 1].addr,
      val: parseInt(t[i].register[t[i].register.length - 1].val) + 1,
    });
    const upReg = async () => {
      let req = await callApi("post", `${host.DATA}/updateRegister`, {
        sn: groupRegID.value,
        data: JSON.stringify(t),
      });
      console.log(req);
      setDataRegister([...t]);
    };
    upReg();
    console.log(t);
  };

  const handleDelErr = (e) => {
    const temp = configEdit.value;
    const i = dataRegister.findIndex((data) => data.id == temp);
    const t = dataRegister;
    t.splice(i, 1);
    const upReg = async () => {
      let req = await callApi("post", `${host.DATA}/updateRegister`, {
        sn: groupRegID.value,
        data: JSON.stringify(t),
      });
      console.log(req);
      setDataRegister([...t]);
    };
    upReg();
    console.log(t);
  };

  const handleFilter = (e) => {
    const input = lowercasedata(e.currentTarget.value);
    const t = dataGatewaySub;
    // console.log(input);
    if (input == "") {
      setDataGateway([...t]);
      // console.log(t);
      // console.log(dataGateway);
    } else {
      let temp = t.filter((data) => {
        return (
          lowercasedata(data.sn_).includes(input) ||
          lowercasedata(data.name_).includes(input)
        );
      });

      setDataGateway([...temp]);
    }
  };

  useEffect(() => {
    const getAllLogger = async (usr, id, type) => {
      let res = await callApi("post", host.DATA + "/getAllLogger", {
        usr: usr,
        partnerid: id,
        type: type,
      });
      if (res.status) {
        setDataGateway([...res.data]);
        setDataGatewaySub([...res.data]);
        // console.log(res.data);
      }
    };

    if (partnerInfor.value) {
      getAllLogger(usr, partnerInfor.value.partnerid, userInfor.value.type);
    }
  }, [partnerInfor.value]);

  const GroupUsers = () => {
    return <> </>;
  };

  // useEffect(() => {
  //   console.log(regList);
  //   console.log(dataRegister);
  // });

  return (
    <div>
      {isBrowser ? (
        <>
          <div className="DAT_GRHeader">
            <div className="DAT_GRHeader_Title">
              <PiUsersFour color="gray" size={25} />
              <span>{dataLang.formatMessage({ id: "RegisterSetting" })}</span>
            </div>
            <div
              className="DAT_GRHeader_Filter"
              style={{
                backgroundColor:
                  groupRegID.value === 0 ? "rgba(233, 233, 233, 0.5)" : "white",
              }}
            >
              {groupRegID.value === 0 ? (
                <input
                  disabled
                  type="text"
                  autoComplete="off"
                  placeholder={dataLang.formatMessage({ id: "enterInfo" })}
                />
              ) : (
                <input
                  type="text"
                  autoComplete="on"
                  placeholder={dataLang.formatMessage({ id: "enterInfo" })}
                  onChange={(e) => handleFilter(e)}
                />
              )}
              <CiSearch color="gray" size={20} />
            </div>
            {/* <button
          className="DAT_GRHeader_New"
          onClick={() => {
            changePopupstate();
            setStatePopup("addNewReg");
          }}
        >
          <span>
            <AiOutlineUsergroupAdd color="white" size={20} />
            &nbsp;
            {dataLang.formatMessage({ id: "createNewGroup" })}
          </span>
        </button> */}
          </div>

          <div className="DAT_GR">
            <div className="DAT_GR_Header">
              {dataLang.formatMessage({ id: "RegisterSetting" })}
            </div>
            <div className="DAT_GR_Content">
              <div className="DAT_GR_Content_DevideTable">
                <div
                  className="DAT_GR_Content_DevideTable_Left"
                  style={{ width: "300px" }}
                >
                  <div className="DAT_GR_Content_DevideTable_Left_Head">
                    {dataLang.formatMessage({ id: "Gateway" })}
                  </div>

                  <div className="DAT_GR_Content_DevideTable_Left_ItemList">
                    {dataGateway.map((item, index) => (
                      <div
                        className="DAT_GR_Content_DevideTable_Left_ItemList_Item"
                        key={index}
                        id={item.sn_}
                        style={{
                          backgroundColor:
                            groupRegID.value === item.sn_
                              ? "rgb(207, 207, 207, 0.4)"
                              : "",
                        }}
                        onClick={(e) => handleChangeGroup(e)}
                      >
                        <div>
                          <div
                            className="DAT_GR_Content_DevideTable_Left_ItemList_Item_Name"
                            style={{ fontSize: "15px" }}
                          >
                            {item.sn_}
                          </div>

                          <div
                            className="DAT_GR_Content_DevideTable_Left_ItemList_Item_Info"
                            style={{
                              fontSize: "13px",
                              color: "grey",
                              maxWidth: "200px",
                            }}
                          >
                            {item.name_}
                          </div>
                        </div>
                        <div
                          className="DAT_GR_Content_DevideTable_Left_ItemList_Item_Shortcut"
                          //   id={item.id_ + "_dot"}
                          onClick={() => {
                            changePopupstate();
                            setStatePopup("addNewReg");
                          }}
                        >
                          <IoMdAdd size={20} color="grey" />
                        </div>

                        <div
                          className="DAT_GR_Content_DevideTable_Left_ItemList_Item_More"
                          //   id={item.id_ + "_function"}
                          style={{ display: "none" }}
                          //   onMouseLeave={(e) => handleShowFunction(e)}
                        >
                          {/* {item.id_ === 1 ? (
                        <></>
                      ) : ( */}
                          <div
                            className="DAT_GR_Content_DevideTable_Left_ItemList_Item_More_Delete"
                            //   id={item.id_}
                            //   onClick={() => props.groupDelState()}
                          >
                            <IoTrashOutline size={18} />
                          </div>
                          {/* )} */}
                          <div
                            className="DAT_GR_Content_DevideTable_Left_ItemList_Item_More_Edit"
                            style={{ right: "40px" }}
                            // id={item.id_}
                            // onClick={(e) => handleEditGroup(e)}
                          >
                            <FiEdit size={18} />
                          </div>

                          <div
                            className="DAT_GR_Content_DevideTable_Left_ItemList_Item_More_Add"
                            // onClick={() => props.addState()}
                          >
                            <AiOutlineUserAdd size={18} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="DAT_GR_Content_DevideTable_Right">
                  <div className="DAT_GR_Content_DevideTable_Right_ItemList">
                    {dataRegister === undefined ? (
                      <Empty />
                    ) : (
                      <DataTable
                        className="DAT_Table_GroupRole"
                        columns={columnGroupRole}
                        data={dataRegister}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        // fixedHeader={true}
                        noDataComponent={<Empty />}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="DAT_ProjectHeaderMobile">
            <div className="DAT_ProjectHeaderMobile_Top">
              <div
                className="DAT_ProjectHeaderMobile_Top_Filter"
                style={{
                  backgroundColor: regList ? "rgb(235, 235, 228)" : "white",
                }}
              >
                <CiSearch color="gray" size={20} />
                <input
                  disabled={regList ? true : false}
                  type="text"
                  placeholder={dataLang.formatMessage({ id: "enterInfo" })}
                  onChange={(e) => handleFilter(e)}
                />
              </div>
              {regList ? (
                <button
                  className="DAT_ProjectHeaderMobile_Top_New"
                  onClick={() => {
                    changePopupstate();
                    setStatePopup("addNewReg");
                  }}
                >
                  <IoAddOutline color="white" size={20} />
                </button>
              ) : (
                <></>
              )}
            </div>

            <div
              className="DAT_ProjectHeaderMobile_Title"
              style={{ marginBottom: "10px" }}
            >
              <PiUsersFour color="gray" size={25} />
              <span>{dataLang.formatMessage({ id: "roleList" })}</span>
            </div>
          </div>

          {regList ? (
            <div className="DAT_GRMobile_Content_DevideTable_Right">
              <div className="DAT_GRMobile_Content_DevideTable_Right_Head">
                <IoCaretBackOutline
                  style={{ cursor: "pointer" }}
                  size={20}
                  color="white"
                  onClick={() => {
                    setRegList(false);
                    groupRegID.value = 0;
                  }}
                />
                <div>{dataLang.formatMessage({ id: "roleList" })}</div>
              </div>
              <div className="DAT_GRMobile_Content_DevideTable_Right_ItemList">
                {groupRegID.value === 0 ? (
                  <Empty />
                ) : (
                  <div className="DAT_RegSetMobile">
                    {dataRegister.map((item, index) => {
                      return (
                        <div key={index} className="DAT_RegSetMobile_Content">
                          <div className="DAT_RegSetMobile_Content_Top">
                            <div className="DAT_RegSetMobile_Content_Top_Type">
                              {item.addrcode}
                            </div>
                            <div className="DAT_RegSetMobile_Content_Top_Info">
                              <div className="DAT_RegSetMobile_Content_Top_Info_Cause">
                                <span>
                                  {dataLang.formatMessage({ id: "config" })}
                                </span>
                                <div className="DAT_RegSetMobile_Content_Top_Info_Cause_Row1">
                                  {/* <div className="DAT_RegSetMobile_Content_Top_Info_Cause_Row1_En">
                                    en:
                                  </div> */}
                                </div>

                                <div>
                                  {item.register.map((cause, i) => {
                                    return (
                                      <div
                                        key={i}
                                        className="DAT_RegSetMobile_Content_Top_Info_Cause_Row2"
                                      >
                                        <div className="DAT_RegSetMobile_Content_Top_Info_Cause_Row2_Vi">
                                          {i + 1}.{" "}
                                          {`${cause.addr}: ${cause.val}`}
                                        </div>
                                        <div className="DAT_RegSetMobile_Content_Top_Info_Cause_Row2_Func">
                                          <FiEdit
                                            size={14}
                                            id={`${item.id}_${cause.id}_EDIT`}
                                            onClick={(e) => {
                                              changePopupstate();
                                              setStatePopup("editConfig");
                                              handleSetConfig(e);
                                            }}
                                          />
                                          <IoTrashOutline
                                            size={16}
                                            id={`${item.id}_${cause.id}_REMOVE`}
                                            onClick={(e) => {
                                              changePopupstate();
                                              setStatePopup("removeConfig");
                                              handleSetConfig(e);
                                            }}
                                          />
                                          {parseInt(i) ===
                                          item.register.length - 1 ? (
                                            <IoIosAddCircleOutline
                                              size={16}
                                              style={{ cursor: "pointer" }}
                                              id={`${item.id}_ADD`}
                                              onClick={(e) => {
                                                handleAddConfig(e);
                                                handleSetConfig(e);
                                              }}
                                            />
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
                          </div>

                          <div className="DAT_RegSetMobile_Content_Bottom">
                            <div
                              className="DAT_RegSetMobile_Content_Bottom_Item"
                              id={item.id}
                              onClick={(e) => {
                                changePopupstate();
                                setStatePopup("removeError");
                                configEdit.value = e.currentTarget.id;
                                console.log(configEdit.value);
                              }}
                            >
                              <IoTrashOutline size={16} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              className="DAT_GRMobile_Content_DevideTable_Left"
              style={{ width: "100% !important", height: "100%" }}
            >
              <div className="DAT_GRMobile_Content_DevideTable_Left_Head">
                {dataLang.formatMessage({ id: "RegisterSetting" })}
              </div>

              <div className="DAT_GRMobile_Content_DevideTable_Left_ItemList">
                {dataGateway.map((item, index) => (
                  <div
                    className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item"
                    key={index}
                    style={{
                      backgroundColor:
                        groupRegID.value === item.sn_
                          ? "rgb(207, 207, 207, 0.4)"
                          : "",
                    }}
                  >
                    <div>
                      <div
                        className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_Name"
                        style={{ fontSize: "16px" }}
                        id={item.sn_}
                        onClick={(e) => {
                          handleChangeGroup(e);
                          setRegList(true);
                        }}
                      >
                        {item.sn_}
                      </div>

                      <div
                        className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_Info"
                        style={{
                          fontSize: "14px",
                          color: "grey",
                          maxWidth: "100px",
                        }}
                      >
                        {item.nam_}
                      </div>
                    </div>
                    <div
                      className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_Shortcut"
                      // id={item.sn_ + "_dot"}
                      onClick={(e) => {
                        groupRegID.value = item.sn_;
                      }}
                    >
                      <IoMdMore size={20} color="grey" />
                    </div>

                    <div
                      className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_More"
                      // id={item.id_ + "_function"}
                      style={{ display: "none" }}
                      // onMouseLeave={(e) => handleShowFunction(e)}
                    >
                      {item.id_ === 1 ? (
                        <></>
                      ) : (
                        <div
                          className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_More_Delete"
                          id={item.sn_}
                          // onClick={() => props.groupDelState()}
                        >
                          <IoTrashOutline size={18} />
                        </div>
                      )}
                      <div
                        className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_More_Edit"
                        style={{ right: "40px" }}
                        id={item.sn_}
                        // onClick={(e) => handleEditGroup(e)}
                      >
                        <FiEdit size={18} />
                      </div>

                      <div
                        className="DAT_GRMobile_Content_DevideTable_Left_ItemList_Item_More_Add"
                        // onClick={() => props.addState()}
                      >
                        <AiOutlineUserAdd size={18} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {popup ? (
        <div className="DAT_PopupBG">
          <Popup
            closeopen={changePopupstate}
            type={statePopup}
            data={dataRegister}
            handleSubmitAddNewReg={handleSubmitAddNewReg}
            handleEditConfig={handleEditConfig}
            handleRemoveConfig={handleRemoveConfig}
            handleDelErr={handleDelErr}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
