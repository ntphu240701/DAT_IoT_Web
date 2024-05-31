import React, { useContext, useEffect, useState } from "react";
import "./Control.scss";
import Popup from "./Popup";
import { sidenar } from "../Sidenar/Sidenar";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { alertDispatch } from "../Alert/Alert";
import { ruleInfor, userInfor } from "../../App";
import { useSelector } from "react-redux";
import { signal } from "@preact/signals-react";
import { useIntl } from "react-intl";
import DataTable from "react-data-table-component";
import { lowercasedata } from "../ErrorSetting/ErrorSetting";
import { FaCheckCircle, FaRegFileAlt, FaStar } from "react-icons/fa";
import { MdOutlineError, MdAddchart } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown, IoIosArrowForward, IoMdMore } from "react-icons/io";
import { IoAddOutline, IoTrashOutline } from "react-icons/io5";
import { FiEdit, FiFilter } from "react-icons/fi";
import { RiShareForwardLine } from "react-icons/ri";
import PopupState, { bindToggle, bindMenu } from "material-ui-popup-state";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { isBrowser } from "react-device-detect";
import EditProject from "./EditProject";
import AddProject from "./AddProject";
import { listDevice, plantData, plantState } from "./Signal";
import ShareBox from "./ShareBox";
import Project from "./Project";
import Toollist from "../Lib/Toollist";
import { SettingContext } from "../Context/SettingContext";
import { ToolContext } from "../Context/ToolContext";
import { deviceData } from "./Device";
import { OverviewContext } from "../Context/OverviewContext";
import { PiElevatorDuotone } from "react-icons/pi";

const online = signal([]);
const offline = signal([]);
const warn = signal([]);
const demo = signal([]);
const care = signal([]);

export const plantobjauto = signal({});

export const Empty = (props) => {
  const dataLang = useIntl();

  return (
    <div
      className="DAT_TableEmpty"
      style={{
        backgroundColor: props.backgroundColor
          ? props.backgroundColor
          : "white",
        height: props.height ? props.height : "calc(100vh - 180px)",
        width: props.width ? props.width : "100%",
      }}
    >
      <div className="DAT_TableEmpty_Group">
        <div className="DAT_TableEmpty_Group_Icon">
          <FaRegFileAlt size={50} color="gray" />
        </div>
        <div className="DAT_TableEmpty_Group_Text">
          {dataLang.formatMessage({ id: "empty" })}
        </div>
        <div className="DAT_TableEmpty_Group_Text">
          {dataLang.formatMessage({ id: "enterMore" })}
        </div>
      </div>
    </div>
  );
};

export default function Auto(props) {
  const dataLang = useIntl();
  const user = useSelector((state) => state.admin.usr);
  const [tab, setTab] = useState("total");
  const [tabMobile, setTabMobile] = useState("total");
  const [tabState, setTabState] = useState(false);
  const icon = <PiElevatorDuotone color="gray" size={25} />;
  const bu = "elev";
  const { screen, currentSN, settingDispatch } = useContext(SettingContext);
  const { toolDispatch } = useContext(ToolContext);
  const { overviewDispatch } = useContext(OverviewContext);
  const [datafilter, setDatafilter] = useState([]);
  const listTab = [
    { id: "total", name: dataLang.formatMessage({ id: "total" }) },
    { id: "online", name: dataLang.formatMessage({ id: "online" }) },
    { id: "offline", name: dataLang.formatMessage({ id: "offline" }) },
    { id: "warn", name: dataLang.formatMessage({ id: "warn" }) },
    { id: "care", name: dataLang.formatMessage({ id: "care" }) },
    { id: "demo", name: dataLang.formatMessage({ id: "demo" }) },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: dataLang.formatMessage({ id: "row" }),
    rangeSeparatorText: dataLang.formatMessage({ id: "to" }),
    selectAllRowsItem: true,
    selectAllRowsItemText: dataLang.formatMessage({ id: "showAll" }),
  };

  const columnproject = [
    {
      name: dataLang.formatMessage({ id: "name" }),
      selector: (row) => (
        <div
          className="DAT_Table"
          id={row.plantid_}
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            handlePlant(e);
            sidenar.value = false;
          }}
        >
          <img src={row.img ? row.img : `/dat_picture/${bu}.jpg`} alt="" />

          <div className="DAT_Table_Infor">
            <div className="DAT_Table_Infor_Name">{row.name_}</div>
            <div className="DAT_Table_Infor_Addr">{row.addr_}</div>
          </div>
        </div>
      ),
      sortable: true,
      width: "400px",
      style: {
        justifyContent: "left !important",
      },
    },
    {
      name: dataLang.formatMessage({ id: "connect" }),
      selector: (row) => (
        <div
          style={{ cursor: "pointer" }}
          id={row.name_}
          onClick={(e) => {
            // connectval.value = e.currentTarget.id;
            // sidebartab.value = "Monitor";
            // sidebartabli.value = "/Device";
            // navigate("/Device");
          }}
        >
          {row.state_ === 1 ? (
            <FaCheckCircle size={20} color="green" />
          ) : (
            <MdOutlineError size={22} color="red" />
          )}
        </div>
      ),
      width: "100px",
    },
    {
      name: dataLang.formatMessage({ id: "warn" }),
      selector: (row) => (
        <div
          style={{ cursor: "pointer" }}
          id={row.plantid_}
          onClick={(e) => {
            // projectwarnfilter.value = e.currentTarget.id;
            // warnfilter.value = {};
            // sidebartab.value = "Monitor";
            // sidebartabli.value = "/Warn";
            // navigate("/Warn");
          }}
        >
          {row.warn_ === 1 ? (
            <FaCheckCircle size={20} color="green" />
          ) : (
            <MdOutlineError size={22} color="red" />
          )}
        </div>
      ),
      width: "100px",
    },
    {
      name: dataLang.formatMessage({ id: "companyName" }),
      selector: (row) => row.company_,
      sortable: true,
      style: {
        justifyContent: "left !important",
      },
    },
    {
      name: dataLang.formatMessage({ id: "createdate" }),
      selector: (row) => row.createdate_,
      sortable: true,
      width: "180px",
    },
    {
      name: dataLang.formatMessage({ id: "edits" }),
      selector: (row) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {ruleInfor.value.setting.project.modify == true ||
          ruleInfor.value.setting.project.remove == true ? (
            row.shared == 1 ? (
              <></>
            ) : (
              <PopupState variant="popper" popupId="demo-popup-popper">
                {(popupState) => (
                  <div className="DAT_TableEdit">
                    <IoMdMore size={20} {...bindToggle(popupState)} />
                    <Menu {...bindMenu(popupState)}>
                      {ruleInfor.value.setting.project.modify === true ? (
                        <MenuItem
                          id={row.plantid_}
                          onClick={(e) => {
                            handleEdit(e);
                            popupState.close();
                          }}
                        >
                          <FiEdit size={14} />
                          &nbsp;
                          {dataLang.formatMessage({ id: "change" })}
                        </MenuItem>
                      ) : (
                        <></>
                      )}
                      {ruleInfor.value.setting.project.remove === true ? (
                        <MenuItem
                          id={row.plantid_}
                          onClick={(e) => {
                            handleDelete(e);
                            popupState.close();
                          }}
                        >
                          <IoTrashOutline size={16} />
                          &nbsp;
                          {dataLang.formatMessage({ id: "delete" })}
                        </MenuItem>
                      ) : (
                        <></>
                      )}

                      <MenuItem
                        id={row.plantid_}
                        onClick={(e) => {
                          handleShare(e);
                          popupState.close();
                        }}
                      >
                        <RiShareForwardLine size={16} />
                        &nbsp;
                        {dataLang.formatMessage({ id: "share" })}
                      </MenuItem>
                    </Menu>
                  </div>
                )}
              </PopupState>
            )
          ) : (
            // <div className="DAT_TableEdit">
            //   <span
            //     id={row.plantid_ + "_MORE"}
            //     onClick={(e) => handleModify(e, "block")}
            //   >
            //     <IoMdMore size={20} />
            //   </span>
            // </div>
            <div></div>
          )}

          <div className="DAT_TableMark">
            <FaStar
              id={row.plantid_}
              style={{
                color: row.mark_ ? "rgb(255, 233, 39)" : "rgb(190, 190, 190)",
                cursor: "pointer",
              }}
              onClick={(e) => handleLike(e)}
              size={17}
            />
          </div>
        </div>
      ),
      width: "110px",
      justifyContent: "center",
      alignItems: "center",
    },
  ];

  const handlePlant = async (e) => {
    plantState.value = "info";
    const newPlant = plantData.value.find(
      (item) => item.plantid_ == e.currentTarget.id
    );
    console.log(newPlant);

    let sn = [0];
    let res = await callApi("post", host.DATA + "/getLogger", {
      plantid: newPlant.plantid_,
    });
    // console.log(res)
    if (res.status) {
      // setDevice(res.data)
      listDevice.value = res.data;
      res.data.map((data, index) => {
        sn.push(data.sn_);
      });
    }

    plantobjauto.value = newPlant;
    // setplantobjauto(newPlant);
    overviewDispatch({
      type: "LOAD_DEVICE",
      payload: {
        id: newPlant.plantid_,
        visual: newPlant.data_.data,
        setting: newPlant.setting_,
        company: newPlant.company_,
        name: newPlant.name_,
      },
    });
    overviewDispatch({
      type: "SET_LASTID",
      payload: newPlant.data_.id,
    });

    overviewDispatch({
      type: "SET_ID",
      payload: sn,
    });

    // console.log(overview_visual);
    deviceData.value = [];
  };

  const handleEdit = (e) => {
    let newPlant = plantData.value.find(
      (item) => item.plantid_ == e.currentTarget.id
    );
    console.log(newPlant);
    plantobjauto.value = { ...newPlant };
    plantState.value = "edit";
    // setplantobjauto(newPlant);
  };

  const handleDelete = (e) => {
    plantState.value = "drop";
    const newPlant = plantData.value.find(
      (item) => item.plantid_ == e.currentTarget.id
    );
    plantobjauto.value = newPlant;
    // setplantobjauto(newPlant);
  };

  const handleShare = (e) => {
    plantState.value = "share";
    const newPlant = plantData.value.find(
      (item) => item.plantid_ == e.currentTarget.id
    );
    plantobjauto.value = newPlant;
    // setplantobjauto(newPlant);
  };

  const handleLike = async (e) => {
    // 0: UNMARK, 1: MARK
    const i = plantData.value.findIndex(
      (item) => item.plantid_ == e.currentTarget.id
    );
    let newData = plantData.value;

    const markplant = await callApi("post", host.DATA + "/setMark", {
      usr: user,
      plantid: e.currentTarget.id,
      action: newData[i].mark_ ? "unmark" : "mark",
      partnerid: userInfor.value.partnerid,
    });
    if (markplant.status == true) {
      if (newData[i].mark_) {
        newData[i] = {
          ...newData[i],
          mark_: 0,
        };
      } else {
        newData[i] = {
          ...newData[i],
          mark_: 1,
        };
      }
      plantData.value = [...newData];
    } else {
      alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
    }
  };

  // const handleModify = (e, type) => {
  //   const id = e.currentTarget.id;
  //   var arr = id.split("_");
  //   const mod = document.getElementById(arr[0] + "_Modify");
  //   mod.style.display = type;
  // };

  const handleTabMobile = (e) => {
    const id = e.currentTarget.id;
    console.log(id);
    setTabMobile(id);
    // projtab.value = id;
    // const newLabel = listTab.find((item) => item.id == id);
    // tabLable.value = newLabel.name;
  };

  const handleSearch = (e) => {
    if (e.target.value == "") {
      setDatafilter(plantData.value);
    } else {
      const t = lowercasedata(e.target.value);
      const db = plantData.value.filter((row) => {
        return (
          lowercasedata(row.name_).includes(t) ||
          lowercasedata(row.name_).includes(t)
        );
      });
      setDatafilter(db);
    }
  };

  useEffect(() => {
    online.value = plantData.value.filter((item) => item.state_ == 1);
    offline.value = plantData.value.filter((item) => item.state_ == 0);
    warn.value = plantData.value.filter((item) => item.warn_ == 0);
    care.value = plantData.value.filter((item) => item.mark_ == 1);
    demo.value = plantData.value.filter((item) => item.shared_ == 1);
    setDatafilter(plantData.value);
  }, [plantData.value, plantState.value]);

  useEffect(() => {
    const getPlant = async () => {
      let d = await callApi("post", host.DATA + "/getPlant", {
        usr: user,
        partnerid: userInfor.value.partnerid,
        type: userInfor.value.type,
        system: bu,
      });
      // console.log(d);
      if (d.status === true) {
        plantData.value = d.data.sort((a, b) => a.plantid_ - b.plantid_);
      }
    };
    getPlant();

    return () => {
      plantState.value = "default";
    };
  }, []);

  useEffect(() => {
    const setScreen = async () => {
      console.log(currentSN);
      let d = await callApi("post", host.DATA + "/resetLoggerData", {
        sn: currentSN,
      });

      console.log(d);
      if (d.status) {
        settingDispatch({ type: "LOAD_LASTTAB", payload: 0 });
        settingDispatch({ type: "LOAD_DEFAULT", payload: 0 });
      }
    };
    if (plantState.value === "toollist") {
      console.log(screen.length);
      screen.map((data, index) => {
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
      if (screen.length === 0) {
        setScreen();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  return (
    <>
      {isBrowser ? (
        <div
          style={{
            position: "relative",
            top: "0",
            left: "0",
            width: "100%",
            height: "100vh",
          }}
        >
          <div className="DAT_Header">
            <div className="DAT_Header_Title">
              {icon}
              <span>{dataLang.formatMessage({ id: bu })}</span>
            </div>

            <div className="DAT_Header_Filter">
              <input
                id="search"
                type="text"
                placeholder={
                  dataLang.formatMessage({ id: "enter" }) +
                  dataLang.formatMessage({ id: "project" })
                }
                autoComplete="off"
                onChange={(e) => handleSearch(e)}
              />
              <CiSearch color="gray" size={20} />
            </div>
            {ruleInfor.value.setting.project.add === true ? (
              <button
                className="DAT_Header_New"
                onClick={() => (plantState.value = "add")}
              >
                <span value={"createdate"}>
                  <MdAddchart color="white" size={20} />
                  &nbsp;
                  {dataLang.formatMessage({ id: "createNew" })}
                </span>
              </button>
            ) : (
              <div></div>
            )}
          </div>

          <div className="DAT_Project">
            <div className="DAT_Toollist_Tab">
              {listTab.map((item, i) => {
                return tab === item.id ? (
                  <div key={"tab_" + i} className="DAT_Toollist_Tab_main">
                    <p className="DAT_Toollist_Tab_main_left"></p>
                    <span
                      className="DAT_Toollist_Tab_main_content1"
                      id={item.id}
                      style={{
                        backgroundColor: "White",
                        color: "black",
                        borderRadius: "10px 10px 0 0",
                      }}
                      onClick={() => setTab(item.id)}
                    >
                      {item.name}
                    </span>
                    <p className="DAT_Toollist_Tab_main_right"></p>
                  </div>
                ) : (
                  <span
                    className="DAT_Toollist_Tab_main_content2"
                    key={"tab_" + i}
                    id={item.id}
                    style={{ backgroundColor: "#dadada" }}
                    onClick={() => setTab(item.id)}
                  >
                    {item.name}
                  </span>
                );
              })}

              {/* <div
                className="DAT_Project_Filter"
                onClick={(e) => setDisplay(!display)}
              >
                <FiFilter />
                <IoIosArrowUp
                  style={{
                    transform: display ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "0.5s",
                  }}
                />
              </div> */}
            </div>

            <div className="DAT_Project_Content">
              {(() => {
                switch (tab) {
                  case "total":
                    return (
                      <DataTable
                        className="DAT_Table_Container"
                        columns={columnproject}
                        data={datafilter}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        // fixedHeader={true}
                        noDataComponent={<Empty />}
                      />
                    );
                  case "online":
                    return (
                      <DataTable
                        className="DAT_Table_Container"
                        columns={columnproject}
                        data={online.value}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        fixedHeader={true}
                        noDataComponent={<Empty />}
                      />
                    );
                  case "offline":
                    return (
                      <DataTable
                        className="DAT_Table_Container"
                        columns={columnproject}
                        data={offline.value}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        fixedHeader={true}
                        noDataComponent={<Empty />}
                      />
                    );
                  case "demo":
                    return (
                      <DataTable
                        className="DAT_Table_Container"
                        columns={columnproject}
                        data={demo.value}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        fixedHeader={true}
                        noDataComponent={<Empty />}
                      />
                    );
                  case "warn":
                    return (
                      <DataTable
                        className="DAT_Table_Container"
                        columns={columnproject}
                        data={warn.value}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        fixedHeader={true}
                        noDataComponent={<Empty />}
                      />
                    );
                  case "care":
                    return (
                      <DataTable
                        className="DAT_Table_Container"
                        columns={columnproject}
                        data={care.value}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        fixedHeader={true}
                        noDataComponent={<Empty />}
                      />
                    );
                  default:
                    return <></>;
                }
              })()}

              {/* <Filter
              type="project"
              display={display}
              handleClose={handleApproveFilter}
              handleReset={handleResetFilter}
              handleCancel={closeFilter}
              data={saveDataInputFilter}
            /> */}
            </div>
          </div>

          {(() => {
            switch (plantState.value) {
              case "info":
                return (
                  <div
                    className="DAT_ViewPopup"
                    style={{
                      height: plantState.value === "default" ? "0px" : "100vh",
                      transition: "0.5s",
                    }}
                  >
                    <Project usr={user} bu={bu} data={plantobjauto.value} />
                  </div>
                );
              case "edit":
                return (
                  <div
                    className="DAT_ViewPopup"
                    style={{
                      height: plantState.value === "default" ? "0px" : "100vh",
                      transition: "0.5s",
                    }}
                  >
                    <EditProject usr={user} bu={bu} data={plantobjauto.value} />
                  </div>
                );
              case "add":
                return (
                  <div
                    className="DAT_ViewPopup"
                    style={{
                      height: plantState.value === "default" ? "0px" : "100vh",
                      transition: "0.5s",
                    }}
                  >
                    <AddProject usr={user} type={bu} />
                  </div>
                );
              case "drop":
                return (
                  <div
                    className="DAT_PopupBG"
                    style={{
                      height: plantState.value === "default" ? "0px" : "100vh",
                      transition: "0.5s",
                    }}
                  >
                    <Popup
                      name={plantobjauto.value.name_}
                      type={"plant"}
                      usr={user}
                      plantid={plantobjauto.value.plantid_}
                    />
                  </div>
                );
              case "share":
                return (
                  <div
                    className="DAT_PopupBG"
                    style={{
                      height: plantState.value === "default" ? "0px" : "100vh",
                      transition: "0.5s",
                    }}
                  >
                    <ShareBox
                      plantid={plantobjauto.value.plantid_}
                      usr={user}
                    />
                  </div>
                );
              case "toollist":
                return (
                  <div className="DAT_Toollist">
                    <div className="DAT_Toollist-card" id="CARD">
                      <Toollist bu={bu}></Toollist>
                    </div>
                  </div>
                );
              default:
                return <></>;
            }
          })()}
        </div>
      ) : (
        <>
          <div className="DAT_ProjectHeaderMobile">
            <div className="DAT_ProjectHeaderMobile_Top">
              <div className="DAT_ProjectHeaderMobile_Top_Filter">
                <CiSearch color="gray" size={20} />
                <input
                  id="search"
                  type="text"
                  placeholder={
                    dataLang.formatMessage({ id: "enter" }) +
                    dataLang.formatMessage({ id: "project" })
                  }
                  autoComplete="off"
                  onChange={(e) => handleSearch(e)}
                />
              </div>
              {ruleInfor.value.setting.project.add === true ? (
                <button
                  className="DAT_ProjectHeaderMobile_Top_New"
                  onClick={() => (plantState.value = "add")}
                >
                  <IoAddOutline color="white" size={20} />
                </button>
              ) : (
                <div></div>
              )}
            </div>

            <div className="DAT_ProjectHeaderMobile_Title">
              {icon}
              <span>{dataLang.formatMessage({ id: bu })}</span>
            </div>
          </div>

          <div className="DAT_ProjectMobile">
            <div className="DAT_Toollist_Tab_Mobile">
              <button
                className="DAT_Toollist_Tab_Mobile_content"
                onClick={() => setTabState(!tabState)}
              >
                <span>{dataLang.formatMessage({ id: tabMobile })}</span>
                <div className="DAT_Toollist_Tab_Mobile_content_Icon">
                  <FiFilter />
                  {tabState ? <IoIosArrowDown /> : <IoIosArrowForward />}
                </div>
              </button>
              <div
                className="DAT_Toollist_Tab_Mobile_list"
                style={{
                  top: "50px",
                  height: tabState ? "222px" : "0",
                  transition: "0.5s",
                  boxShadow: tabState
                    ? "0 0 4px 4px rgba(193, 193, 193, 0.5)"
                    : "none",
                }}
              >
                {listTab.map((item, i) => {
                  return (
                    <div
                      className="DAT_Toollist_Tab_Mobile_list_item"
                      key={"tabmobile_" + i}
                      id={item.id}
                      onClick={(e) => {
                        handleTabMobile(e);
                        setTabState(false);
                      }}
                    >
                      {i + 1}: {item.name}
                    </div>
                  );
                })}
              </div>
            </div>

            {(() => {
              switch (tabMobile) {
                case "total":
                  return (
                    <>
                      {datafilter?.map((item, i) => {
                        return (
                          <div key={i} className="DAT_ProjectMobile_Content">
                            <div className="DAT_ProjectMobile_Content_Top">
                              <div className="DAT_ProjectMobile_Content_Top_Avatar">
                                <img
                                  src={
                                    item.img
                                      ? item.img
                                      : `/dat_picture/${bu}.jpg`
                                  }
                                  alt=""
                                  id={item.plantid_}
                                  onClick={(e) => handlePlant(e)}
                                />
                              </div>

                              <div className="DAT_ProjectMobile_Content_Top_Info">
                                <div className="DAT_ProjectMobile_Content_Top_Info_Name">
                                  <div
                                    className="DAT_ProjectMobile_Content_Top_Info_Name_Left"
                                    id={item.plantid_}
                                    onClick={(e) => handlePlant(e)}
                                  >
                                    {item.name_}
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Name_Right">
                                    <FaStar
                                      size={14}
                                      id={item.plantid_}
                                      style={{
                                        color: item.mark_
                                          ? "rgb(255, 233, 39)"
                                          : "rgb(190, 190, 190)",
                                        cursor: "pointer",
                                      }}
                                      onClick={(e) => handleLike(e)}
                                    />
                                  </div>
                                </div>

                                <div className="DAT_ProjectMobile_Content_Top_Info_State">
                                  <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                    {item.state_ ? (
                                      <>
                                        <FaCheckCircle
                                          size={14}
                                          color="green"
                                        />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "online",
                                          })}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <MdOutlineError size={16} color="red" />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "offline",
                                          })}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                    {item.warn_ ? (
                                      <>
                                        <FaCheckCircle
                                          size={14}
                                          color="green"
                                        />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "noAlert",
                                          })}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <MdOutlineError size={16} color="red" />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "alert",
                                          })}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="DAT_ProjectMobile_Content_Top_Info_Data">
                                  {/* <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({
                                        id: "inCapacity",
                                      })}
                                    </div>
                                    <div>
                                      {Number(
                                        parseFloat(
                                          convertUnit(item.capacity)
                                        ).toFixed(2)
                                      ).toLocaleString("en-US")}
                                      &nbsp;
                                      {showUnitk(item.capacity)}Wp
                                    </div>
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({ id: "daily" })}
                                    </div>
                                    <div>
                                      {parseFloat(
                                        dailyProduction[item.plantid_]
                                      ).toFixed(2) === "NaN" ? (
                                        <>
                                          0 &nbsp;
                                          {showUnitk(
                                            dailyProduction[item.plantid_]
                                          )}
                                          Wh
                                        </>
                                      ) : (
                                        <>
                                          {Number(
                                            parseFloat(
                                              convertUnit(
                                                dailyProduction[item.plantid_]
                                              )
                                            ).toFixed(2)
                                          ).toLocaleString("en-US")}
                                          &nbsp;
                                          {showUnitk(
                                            dailyProduction[item.plantid_]
                                          )}
                                          Wh
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({ id: "power" })}
                                    </div>
                                    <div>
                                      {parseFloat(power[item.plantid_]).toFixed(
                                        2
                                      ) === "NaN" ? (
                                        <>
                                          0 &nbsp;
                                          {showUnitk(power[item.plantid_])}W
                                        </>
                                      ) : (
                                        <>
                                          {Number(
                                            parseFloat(
                                              convertUnit(
                                                power[item.plantid_] / 1000
                                              )
                                            ).toFixed(2)
                                          ).toLocaleString("en-US")}
                                          &nbsp;
                                          {showUnit(power[item.plantid_])}W
                                        </>
                                      )}
                                    </div>
                                  </div> */}
                                </div>
                              </div>
                            </div>

                            <div className="DAT_ProjectMobile_Content_Bottom">
                              <div className="DAT_ProjectMobile_Content_Bottom_Left">
                                <span>
                                  {dataLang.formatMessage({ id: "createdate" })}
                                  :
                                </span>
                                &nbsp;
                                <span>{item.createdate_}</span>
                              </div>

                              <div className="DAT_ProjectMobile_Content_Bottom_Right">
                                <div className="DAT_ProjectMobile_Content_Bottom_Right_Item">
                                  <RiShareForwardLine
                                    size={16}
                                    id={item.plantid_}
                                    onClick={(e) => handleShare(e)}
                                  />
                                </div>
                                {ruleInfor.value.setting.project.modify ===
                                true ? (
                                  <div
                                    className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                    id={item.plantid_}
                                    onClick={(e) => handleEdit(e)}
                                  >
                                    <FiEdit size={14} />
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                                {ruleInfor.value.setting.project.modify ===
                                true ? (
                                  <div
                                    className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                    id={item.plantid_}
                                    onClick={(e) => handleDelete(e)}
                                  >
                                    <IoTrashOutline size={16} />
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                case "online":
                  return (
                    <>
                      {online.value?.map((item, i) => {
                        return (
                          <div key={i} className="DAT_ProjectMobile_Content">
                            <div className="DAT_ProjectMobile_Content_Top">
                              <div className="DAT_ProjectMobile_Content_Top_Avatar">
                                <img
                                  src={
                                    item.img_
                                      ? item.img
                                      : `/dat_picture/${bu}.jpg`
                                  }
                                  alt=""
                                  id={item.plantid_}
                                  onClick={(e) => handlePlant(e)}
                                />
                              </div>

                              <div className="DAT_ProjectMobile_Content_Top_Info">
                                <div className="DAT_ProjectMobile_Content_Top_Info_Name">
                                  <div
                                    className="DAT_ProjectMobile_Content_Top_Info_Name_Left"
                                    id={item.plantid_}
                                    onClick={(e) => handlePlant(e)}
                                  >
                                    {item.name_}
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Name_Right">
                                    <FaStar
                                      size={14}
                                      id={item.plantid_}
                                      style={{
                                        color: item.mark_
                                          ? "rgb(255, 233, 39)"
                                          : "rgb(190, 190, 190)",
                                        cursor: "pointer",
                                      }}
                                      onClick={(e) => handleLike(e)}
                                    />
                                  </div>
                                </div>

                                <div className="DAT_ProjectMobile_Content_Top_Info_State">
                                  <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                    {item.state_ ? (
                                      <>
                                        <FaCheckCircle
                                          size={14}
                                          color="green"
                                        />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "online",
                                          })}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <MdOutlineError size={16} color="red" />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "offline",
                                          })}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                    {item.warn_ ? (
                                      <>
                                        <FaCheckCircle
                                          size={14}
                                          color="green"
                                        />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "noAlert",
                                          })}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <MdOutlineError size={16} color="red" />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "alert",
                                          })}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="DAT_ProjectMobile_Content_Top_Info_Data">
                                  {/* <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({ id: "power" })}
                                    </div>
                                    <div>
                                      {item.power}
                                      <span>%</span>
                                    </div>
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({ id: "capacity" })}
                                    </div>
                                    <div>
                                      {item.capacity}
                                      <span>kWp</span>
                                    </div>
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({
                                        id: "production",
                                      })}
                                    </div>
                                    <div>
                                      {item.production}
                                      <span>kWh</span>
                                    </div>
                                  </div> */}
                                </div>
                              </div>
                            </div>

                            <div className="DAT_ProjectMobile_Content_Bottom">
                              <div className="DAT_ProjectMobile_Content_Bottom_Left">
                                <span>
                                  {dataLang.formatMessage({ id: "createdate" })}
                                  :
                                </span>
                                &nbsp;
                                <span>{item.createdate_}</span>
                              </div>

                              <div className="DAT_ProjectMobile_Content_Bottom_Right">
                                <div className="DAT_ProjectMobile_Content_Bottom_Right_Item">
                                  <RiShareForwardLine
                                    size={16}
                                    id={item.plantid_}
                                    onClick={(e) => handleShare(e)}
                                  />
                                </div>
                                {ruleInfor.value.setting.project.modify ===
                                true ? (
                                  <div
                                    className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                    id={item.plantid_}
                                    onClick={(e) => handleEdit(e)}
                                  >
                                    <FiEdit size={14} />
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                                {ruleInfor.value.setting.project.modify ===
                                true ? (
                                  <div
                                    className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                    id={item.plantid_}
                                    onClick={(e) => handleDelete(e)}
                                  >
                                    <IoTrashOutline size={16} />
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                case "offline":
                  return (
                    <>
                      {offline.value?.map((item, i) => {
                        return (
                          <div key={i} className="DAT_ProjectMobile_Content">
                            <div className="DAT_ProjectMobile_Content_Top">
                              <div className="DAT_ProjectMobile_Content_Top_Avatar">
                                <img
                                  src={
                                    item.img_
                                      ? item.img
                                      : `/dat_picture/${bu}.jpg`
                                  }
                                  alt=""
                                  id={item.plantid_}
                                  onClick={(e) => handlePlant(e)}
                                />
                              </div>

                              <div className="DAT_ProjectMobile_Content_Top_Info">
                                <div className="DAT_ProjectMobile_Content_Top_Info_Name">
                                  <div
                                    className="DAT_ProjectMobile_Content_Top_Info_Name_Left"
                                    id={item.plantid_}
                                    onClick={(e) => handlePlant(e)}
                                  >
                                    {item.name_}
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Name_Right">
                                    <FaStar
                                      size={14}
                                      id={item.plantid_}
                                      style={{
                                        color: item.mark_
                                          ? "rgb(255, 233, 39)"
                                          : "rgb(190, 190, 190)",
                                        cursor: "pointer",
                                      }}
                                      onClick={(e) => handleLike(e)}
                                    />
                                  </div>
                                </div>

                                <div className="DAT_ProjectMobile_Content_Top_Info_State">
                                  <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                    {item.state_ ? (
                                      <>
                                        <FaCheckCircle
                                          size={14}
                                          color="green"
                                        />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "online",
                                          })}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <MdOutlineError size={16} color="red" />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "offline",
                                          })}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                    {item.warn_ ? (
                                      <>
                                        <FaCheckCircle
                                          size={14}
                                          color="green"
                                        />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "noAlert",
                                          })}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <MdOutlineError size={16} color="red" />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "alert",
                                          })}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="DAT_ProjectMobile_Content_Top_Info_Data">
                                  {/* <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({ id: "power" })}
                                    </div>
                                    <div>
                                      {item.power}
                                      <span>%</span>
                                    </div>
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({ id: "capacity" })}
                                    </div>
                                    <div>
                                      {item.capacity}
                                      <span>kWp</span>
                                    </div>
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({
                                        id: "production",
                                      })}
                                    </div>
                                    <div>
                                      {item.production}
                                      <span>kWh</span>
                                    </div>
                                  </div> */}
                                </div>
                              </div>
                            </div>

                            <div className="DAT_ProjectMobile_Content_Bottom">
                              <div className="DAT_ProjectMobile_Content_Bottom_Left">
                                <span>
                                  {dataLang.formatMessage({ id: "createdate" })}
                                  :
                                </span>
                                &nbsp;
                                <span>{item.createdate_}</span>
                              </div>

                              <div className="DAT_ProjectMobile_Content_Bottom_Right">
                                <div className="DAT_ProjectMobile_Content_Bottom_Right_Item">
                                  <RiShareForwardLine
                                    size={16}
                                    id={item.plantid_}
                                    onClick={(e) => handleShare(e)}
                                  />
                                </div>
                                {ruleInfor.value.setting.project.modify ===
                                true ? (
                                  <div
                                    className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                    id={item.plantid_}
                                    onClick={(e) => handleEdit(e)}
                                  >
                                    <FiEdit size={14} />
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                                {ruleInfor.value.setting.project.modify ===
                                true ? (
                                  <div
                                    className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                    id={item.plantid_}
                                    onClick={(e) => handleDelete(e)}
                                  >
                                    <IoTrashOutline size={16} />
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                case "demo":
                  return (
                    <>
                      {demo.value?.map((item, i) => {
                        return (
                          <div key={i} className="DAT_ProjectMobile_Content">
                            <div className="DAT_ProjectMobile_Content_Top">
                              <div className="DAT_ProjectMobile_Content_Top_Avatar">
                                <img
                                  src={
                                    item.img_
                                      ? item.img
                                      : `/dat_picture/${bu}.jpg`
                                  }
                                  alt=""
                                  id={item.plantid_}
                                  onClick={(e) => handlePlant(e)}
                                />
                              </div>

                              <div className="DAT_ProjectMobile_Content_Top_Info">
                                <div className="DAT_ProjectMobile_Content_Top_Info_Name">
                                  <div
                                    className="DAT_ProjectMobile_Content_Top_Info_Name_Left"
                                    id={item.plantid_}
                                    onClick={(e) => handlePlant(e)}
                                  >
                                    {item.name_}
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Name_Right">
                                    <FaStar
                                      size={14}
                                      id={item.plantid_}
                                      style={{
                                        color: item.mark_
                                          ? "rgb(255, 233, 39)"
                                          : "rgb(190, 190, 190)",
                                        cursor: "pointer",
                                      }}
                                      onClick={(e) => handleLike(e)}
                                    />
                                  </div>
                                </div>

                                <div className="DAT_ProjectMobile_Content_Top_Info_State">
                                  <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                    {item.state_ ? (
                                      <>
                                        <FaCheckCircle
                                          size={14}
                                          color="green"
                                        />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "online",
                                          })}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <MdOutlineError size={16} color="red" />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "offline",
                                          })}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                    {item.warn_ ? (
                                      <>
                                        <FaCheckCircle
                                          size={14}
                                          color="green"
                                        />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "noAlert",
                                          })}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <MdOutlineError size={16} color="red" />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "alert",
                                          })}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="DAT_ProjectMobile_Content_Top_Info_Data">
                                  {/* <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({ id: "power" })}
                                    </div>
                                    <div>
                                      {item.power}
                                      <span>%</span>
                                    </div>
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({ id: "capacity" })}
                                    </div>
                                    <div>
                                      {item.capacity}
                                      <span>kWp</span>
                                    </div>
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({
                                        id: "production",
                                      })}
                                    </div>
                                    <div>
                                      {item.production}
                                      <span>kWh</span>
                                    </div>
                                  </div> */}
                                </div>
                              </div>
                            </div>

                            <div className="DAT_ProjectMobile_Content_Bottom">
                              <div className="DAT_ProjectMobile_Content_Bottom_Left">
                                <span>
                                  {dataLang.formatMessage({ id: "createdate" })}
                                  :
                                </span>
                                &nbsp;
                                <span>{item.createdate_}</span>
                              </div>

                              <div className="DAT_ProjectMobile_Content_Bottom_Right">
                                <div className="DAT_ProjectMobile_Content_Bottom_Right_Item">
                                  <RiShareForwardLine
                                    size={16}
                                    id={item.plantid_}
                                    onClick={(e) => handleShare(e)}
                                  />
                                </div>
                                {ruleInfor.value.setting.project.modify ===
                                true ? (
                                  <div
                                    className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                    id={item.plantid_}
                                    onClick={(e) => handleEdit(e)}
                                  >
                                    <FiEdit size={14} />
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                                {ruleInfor.value.setting.project.modify ===
                                true ? (
                                  <div
                                    className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                    id={item.plantid_}
                                    onClick={(e) => handleDelete(e)}
                                  >
                                    <IoTrashOutline size={16} />
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                case "warn":
                  return (
                    <>
                      {warn.value?.map((item, i) => {
                        return (
                          <div key={i} className="DAT_ProjectMobile_Content">
                            <div className="DAT_ProjectMobile_Content_Top">
                              <div className="DAT_ProjectMobile_Content_Top_Avatar">
                                <img
                                  src={
                                    item.img_
                                      ? item.img
                                      : `/dat_picture/${bu}.jpg`
                                  }
                                  alt=""
                                  id={item.plantid_}
                                  onClick={(e) => handlePlant(e)}
                                />
                              </div>

                              <div className="DAT_ProjectMobile_Content_Top_Info">
                                <div className="DAT_ProjectMobile_Content_Top_Info_Name">
                                  <div
                                    className="DAT_ProjectMobile_Content_Top_Info_Name_Left"
                                    id={item.plantid_}
                                    onClick={(e) => handlePlant(e)}
                                  >
                                    {item.name_}
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Name_Right">
                                    <FaStar
                                      size={14}
                                      id={item.plantid_}
                                      style={{
                                        color: item.mark_
                                          ? "rgb(255, 233, 39)"
                                          : "rgb(190, 190, 190)",
                                        cursor: "pointer",
                                      }}
                                      onClick={(e) => handleLike(e)}
                                    />
                                  </div>
                                </div>

                                <div className="DAT_ProjectMobile_Content_Top_Info_State">
                                  <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                    {item.state_ ? (
                                      <>
                                        <FaCheckCircle
                                          size={14}
                                          color="green"
                                        />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "online",
                                          })}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <MdOutlineError size={16} color="red" />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "offline",
                                          })}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                    {item.warn_ ? (
                                      <>
                                        <FaCheckCircle
                                          size={14}
                                          color="green"
                                        />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "noAlert",
                                          })}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <MdOutlineError size={16} color="red" />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "alert",
                                          })}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="DAT_ProjectMobile_Content_Top_Info_Data">
                                  {/* <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({ id: "power" })}
                                    </div>
                                    <div>
                                      {item.power}
                                      <span>%</span>
                                    </div>
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({ id: "capacity" })}
                                    </div>
                                    <div>
                                      {item.capacity}
                                      <span>kWp</span>
                                    </div>
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({
                                        id: "production",
                                      })}
                                    </div>
                                    <div>
                                      {item.production}
                                      <span>kWh</span>
                                    </div>
                                  </div> */}
                                </div>
                              </div>
                            </div>

                            <div className="DAT_ProjectMobile_Content_Bottom">
                              <div className="DAT_ProjectMobile_Content_Bottom_Left">
                                <span>
                                  {dataLang.formatMessage({ id: "createdate" })}
                                  :
                                </span>
                                &nbsp;
                                <span>{item.createdate_}</span>
                              </div>

                              <div className="DAT_ProjectMobile_Content_Bottom_Right">
                                <div className="DAT_ProjectMobile_Content_Bottom_Right_Item">
                                  <RiShareForwardLine
                                    size={16}
                                    id={item.plantid_}
                                    onClick={(e) => handleShare(e)}
                                  />
                                </div>
                                {ruleInfor.value.setting.project.modify ===
                                true ? (
                                  <div
                                    className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                    id={item.plantid_}
                                    onClick={(e) => handleEdit(e)}
                                  >
                                    <FiEdit size={14} />
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                                {ruleInfor.value.setting.project.modify ===
                                true ? (
                                  <div
                                    className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                    id={item.plantid_}
                                    onClick={(e) => handleDelete(e)}
                                  >
                                    <IoTrashOutline size={16} />
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                case "care":
                  return (
                    <>
                      {care.value?.map((item, i) => {
                        return (
                          <div key={i} className="DAT_ProjectMobile_Content">
                            <div className="DAT_ProjectMobile_Content_Top">
                              <div className="DAT_ProjectMobile_Content_Top_Avatar">
                                <img
                                  src={
                                    item.img_
                                      ? item.img
                                      : `/dat_picture/${bu}.jpg`
                                  }
                                  alt=""
                                  id={item.plantid_}
                                  onClick={(e) => handlePlant(e)}
                                />
                              </div>

                              <div className="DAT_ProjectMobile_Content_Top_Info">
                                <div className="DAT_ProjectMobile_Content_Top_Info_Name">
                                  <div
                                    className="DAT_ProjectMobile_Content_Top_Info_Name_Left"
                                    id={item.plantid_}
                                    onClick={(e) => handlePlant(e)}
                                  >
                                    {item.name_}
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Name_Right">
                                    <FaStar
                                      size={14}
                                      id={item.plantid_}
                                      style={{
                                        color: item.mark_
                                          ? "rgb(255, 233, 39)"
                                          : "rgb(190, 190, 190)",
                                        cursor: "pointer",
                                      }}
                                      onClick={(e) => handleLike(e)}
                                    />
                                  </div>
                                </div>

                                <div className="DAT_ProjectMobile_Content_Top_Info_State">
                                  <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                    {item.state_ ? (
                                      <>
                                        <FaCheckCircle
                                          size={14}
                                          color="green"
                                        />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "online",
                                          })}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <MdOutlineError size={16} color="red" />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "offline",
                                          })}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <div className="DAT_ProjectMobile_Content_Top_Info_State_Item">
                                    {item.warn_ ? (
                                      <>
                                        <FaCheckCircle
                                          size={14}
                                          color="green"
                                        />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "noAlert",
                                          })}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <MdOutlineError size={16} color="red" />
                                        <span>
                                          {dataLang.formatMessage({
                                            id: "alert",
                                          })}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="DAT_ProjectMobile_Content_Top_Info_Data">
                                  {/* <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({ id: "power" })}
                                    </div>
                                    <div>
                                      {item.power}
                                      <span>%</span>
                                    </div>
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({ id: "capacity" })}
                                    </div>
                                    <div>
                                      {item.capacity}
                                      <span>kWp</span>
                                    </div>
                                  </div>

                                  <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item">
                                    <div className="DAT_ProjectMobile_Content_Top_Info_Data_Item_Name">
                                      {dataLang.formatMessage({
                                        id: "production",
                                      })}
                                    </div>
                                    <div>
                                      {item.production}
                                      <span>kWh</span>
                                    </div>
                                  </div> */}
                                </div>
                              </div>
                            </div>

                            <div className="DAT_ProjectMobile_Content_Bottom">
                              <div className="DAT_ProjectMobile_Content_Bottom_Left">
                                <span>
                                  {dataLang.formatMessage({ id: "createdate" })}
                                  :
                                </span>
                                &nbsp;
                                <span>{item.createdate_}</span>
                              </div>

                              <div className="DAT_ProjectMobile_Content_Bottom_Right">
                                <div className="DAT_ProjectMobile_Content_Bottom_Right_Item">
                                  <RiShareForwardLine
                                    size={16}
                                    id={item.plantid_}
                                    onClick={(e) => handleShare(e)}
                                  />
                                </div>
                                {ruleInfor.value.setting.project.modify ===
                                true ? (
                                  <div
                                    className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                    id={item.plantid_}
                                    onClick={(e) => handleEdit(e)}
                                  >
                                    <FiEdit size={14} />
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                                {ruleInfor.value.setting.project.modify ===
                                true ? (
                                  <div
                                    className="DAT_ProjectMobile_Content_Bottom_Right_Item"
                                    id={item.plantid_}
                                    onClick={(e) => handleDelete(e)}
                                  >
                                    <IoTrashOutline size={16} />
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                default:
                  return <></>;
              }
            })()}
          </div>

          {(() => {
            switch (plantState.value) {
              case "info":
                return (
                  <div
                    className="DAT_ViewPopup"
                    style={{
                      height: plantState.value === "default" ? "0px" : "100vh",
                      transition: "0.5s",
                    }}
                  >
                    <Project usr={user} bu={bu} data={plantobjauto.value} />
                  </div>
                );
              case "edit":
                return (
                  <div
                    className="DAT_ViewPopupMobile"
                    style={{
                      height: plantState.value === "default" ? "0px" : "100vh",
                      transition: "0.5s",
                    }}
                  >
                    <EditProject usr={user} bu={bu} data={plantobjauto.value} />
                  </div>
                );
              case "add":
                return (
                  <div
                    className="DAT_ViewPopupMobile"
                    style={{
                      height: plantState.value === "default" ? "0px" : "100vh",
                      transition: "0.5s",
                    }}
                  >
                    <AddProject usr={user} type={bu} />
                  </div>
                );
              case "drop":
                return (
                  <div
                    className="DAT_PopupBGMobile"
                    style={{
                      height: plantState.value === "default" ? "0px" : "100vh",
                      transition: "0.5s",
                    }}
                  >
                    <Popup
                      name={plantobjauto.value.name_}
                      type={"plant"}
                      usr={user}
                      plantid={plantobjauto.value.plantid_}
                    />
                  </div>
                );
              case "share":
                return (
                  <div
                    className="DAT_PopupBGMobile"
                    style={{
                      height: plantState.value === "default" ? "0px" : "100vh",
                      transition: "0.5s",
                    }}
                  >
                    <ShareBox
                      plantid={plantobjauto.value.plantid_}
                      usr={user}
                    />
                  </div>
                );
              case "toollist":
                return (
                  <div className="DAT_Toollist">
                    <div className="DAT_Toollist-card" id="CARD">
                      <Toollist bu={bu}></Toollist>
                    </div>
                  </div>
                );
              default:
                return <></>;
            }
          })()}
        </>
      )}
    </>
  );
}
