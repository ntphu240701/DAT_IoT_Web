import React, { useContext, useEffect, useState } from "react";
import "./Control.scss";

// import ProjectData from "./ProjectData";
// import EditProject from "./EditProject";
// import AddProject from "./AddProject";
// import Filter from "./Filter";
import Popup from "./Popup";
// import ShareBox from "./ShareBox";
import { warnfilter } from "../Navigation/Navigation";
import { sidebartab, sidebartabli } from "../Sidenar/Sidenar";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { alertDispatch } from "../Alert/Alert";
import { ruleInfor, Token, partnerInfor, userInfor, convertUnit, showUnitk, showUnit, } from "../../App";
import { useSelector } from "react-redux";
import { signal } from "@preact/signals-react";
import { useIntl } from "react-intl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { lowercasedata } from "../ErrorSetting/ErrorSetting";

import { FaCheckCircle, FaRegFileAlt, FaStar } from "react-icons/fa";
import { MdOutlineError, MdAddchart } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { GoProject } from "react-icons/go";
import { IoIosArrowDown, IoIosArrowForward, IoIosArrowUp, IoMdMore } from "react-icons/io";
import { IoAddOutline, IoTrashOutline } from "react-icons/io5";
import { FiEdit, FiFilter } from "react-icons/fi";
import { RiShareForwardLine } from "react-icons/ri";
import PopupState, { bindToggle, bindMenu } from "material-ui-popup-state";
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { isBrowser, isMobile } from "react-device-detect";
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


const online = signal([]);
const offline = signal([]);
const warn = signal([]);
const demo = signal([]);
const care = signal([]);


export const plantobj = signal({});

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
  const [tabState, setTabState] = useState(false)
  // const [plantobj, setPlantobj] = useState({})
  const bu = 'auto'
  const { screen } = useContext(SettingContext)
  const { toolDispatch } = useContext(ToolContext)
  const {overview_visual, overviewDispatch } = useContext(OverviewContext)


  const [datafilter, setDatafilter] = useState([]);
  const [display, setDisplay] = useState(false);
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
        <div className="DAT_Table"
          id={row.plantid_}
          style={{ cursor: "pointer" }}
          onClick={(e) => handlePlant(e)}
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
      }

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
          {ruleInfor.value.setting.project.modify == true || ruleInfor.value.setting.project.remove == true
            ?
            row.shared == 1
              ? <></>
              :
              <PopupState variant="popper" popupId="demo-popup-popper">
                {(popupState) => (<div className="DAT_TableEdit">
                  <IoMdMore size={20}   {...bindToggle(popupState)} />
                  <Menu {...bindMenu(popupState)}>
                    {ruleInfor.value.setting.project.modify === true ?
                      <MenuItem id={row.plantid_} onClick={(e) => { handleEdit(e); popupState.close() }}>
                        <FiEdit size={14} />&nbsp;
                        {dataLang.formatMessage({ id: "change" })}
                      </MenuItem>
                      : <></>
                    }
                    {ruleInfor.value.setting.project.remove === true ?
                      <MenuItem id={row.plantid_} onClick={(e) => { handleDelete(e); popupState.close() }}>
                        <IoTrashOutline size={16} />
                        &nbsp;
                        {dataLang.formatMessage({ id: "delete" })}
                      </MenuItem>
                      : <></>}

                    <MenuItem id={row.plantid_} onClick={(e) => { handleShare(e); popupState.close() }}>
                      <RiShareForwardLine size={16} />
                      &nbsp;
                      {dataLang.formatMessage({ id: "share" })}
                    </MenuItem>
                  </Menu>
                </div>)}
              </PopupState>
            // <div className="DAT_TableEdit">
            //   <span
            //     id={row.plantid_ + "_MORE"}
            //     onClick={(e) => handleModify(e, "block")}
            //   >
            //     <IoMdMore size={20} />
            //   </span>
            // </div>
            : <div></div>
          }

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



    let sn = [0,]
    let res = await callApi("post", host.DATA + "/getLogger", {
      plantid: newPlant.plantid_,

    })
    // console.log(res)
    if (res.status) {
      // setDevice(res.data)
      listDevice.value = res.data
      res.data.map((data, index) => {
        sn.push(data.sn_)
      })
    }

    plantobj.value = newPlant; 
    // setPlantobj(newPlant);
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
    })

   
    overviewDispatch({
      type: "SET_ID",
      payload: sn,
    })
    

    // console.log(overview_visual);
    deviceData.value = [];


  };

  const handleEdit = (e) => {
  
    let newPlant = plantData.value.find(
      (item) => item.plantid_ == e.currentTarget.id
    );
    console.log(newPlant);
    plantobj.value = {...newPlant}; 
    plantState.value = "edit";
    // setPlantobj(newPlant);
  };

  const handleDelete = (e) => {
    plantState.value = "drop";
    const newPlant = plantData.value.find(
      (item) => item.plantid_ == e.currentTarget.id
    );
    plantobj.value = newPlant; 
    // setPlantobj(newPlant);
  };

  const handleShare = (e) => {
    plantState.value = 'share';
    const newPlant = plantData.value.find(
      (item) => item.plantid_ == e.currentTarget.id
    );
    plantobj.value = newPlant; 
    // setPlantobj(newPlant);
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

  const invtCloud = async (data, token) => {
    var reqData = {
      data: data,
      token: token,
    };

    try {
      const response = await axios({
        url: host.CLOUD,
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: Object.keys(reqData)
          .map(function (key) {
            return (
              encodeURIComponent(key) + "=" + encodeURIComponent(reqData[key])
            );
          })
          .join("&"),
      });

      return response.data;
    } catch (e) {
      return { ret: 1, msg: "cloud err" };
    }
  };

  // const closeFilter = () => {
  //   setDisplay(false);
  // };

  // const handleResetFilter = () => {
  //   setSaveDataInputFilter({
  //     min: 0,
  //     max: 10000,
  //     location: "",
  //     elecmode: {
  //       grid: true,
  //       consumption: true,
  //       hybrid: true,
  //       ESS: true,
  //     },
  //   });
  //   setDisplay(false);
  //   setDatafilter(dataproject.value);
  // };

  // const handleApproveFilter = (_min, _max, _location, _elecmode) => {
  //   let temp = [];
  //   let min_ = _min === "" ? 0 : _min;
  //   let max_ = _max === "" ? 1000000000000000 : _max;
  //   // let elecmode_ = _elecmode;
  //   setSaveDataInputFilter({
  //     min: parseFloat(min_),
  //     max: parseFloat(max_),
  //     location: _location,
  //     elecmode: _elecmode,
  //   });
  //   let filter1 = dataproject.value.filter((item) => {
  //     if (
  //       parseFloat(item.capacity) >= parseFloat(min_) &&
  //       parseFloat(item.capacity) <= parseFloat(max_)
  //     ) {
  //       return item;
  //     }
  //   });
  //   let filter2 = dataproject.value.filter((item) => {
  //     if (_location) {
  //       return lowercasedata(item.addr).includes(lowercasedata(_location));
  //     } else {
  //       return item;
  //     }
  //   });
  //   let filter3 = [];
  //   if (_elecmode.grid === true) {
  //     let t = dataproject.value.filter((item) => item.plantmode === "grid");
  //     filter3 = [...filter3, ...t];
  //   }
  //   if (_elecmode.consumption === true) {
  //     let t = dataproject.value.filter(
  //       (item) => item.plantmode === "consumption"
  //     );
  //     filter3 = [...filter3, ...t];
  //   }
  //   if (_elecmode.hybrid === true) {
  //     let t = dataproject.value.filter((item) => item.plantmode === "hybrid");
  //     filter3 = [...filter3, ...t];
  //   }
  //   if (_elecmode.ESS === true) {
  //     let t = dataproject.value.filter((item) => item.plantmode === "ESS");
  //     filter3 = [...filter3, ...t];
  //   }


  //   const set1 = new Set(filter1.map((obj) => Object.values(obj)[0]));
  //   const set2 = new Set(filter2.map((obj) => Object.values(obj)[0]));
  //   const set3 = new Set(filter3.map((obj) => Object.values(obj)[0]));

  //   //TRẢ LẠI ARRAY [45, 68]
  //   const commonKeys = [...set1].filter(
  //     (value) => set2.has(value) && set3.has(value)
  //   );

  //   // TRẢ LẠI OBJECT {45, 68}
  //   // const y = set1.intersection(set2, set3);

  //   temp = dataproject.value.filter((item) =>
  //     commonKeys.includes(item.plantid_)
  //   );
  //   setDatafilter(temp);
  //   setDisplay(false);
  // };

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
        system: bu
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
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen])

  return (
    <>
      {isMobile ? (
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
              <GoProject color="gray" size={25} />
              <span>{dataLang.formatMessage({ id: bu })}</span>
            </div>
          </div>
          <div className="DAT_ProjectMobile">
            <div className="DAT_Toollist_Tab_Mobile">
              <button
                className="DAT_Toollist_Tab_Mobile_content"
                onClick={() => (setTabState(!tabState))}
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
                                        <FaCheckCircle size={14} color="green" />
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
                                        <FaCheckCircle size={14} color="green" />
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
                                  {dataLang.formatMessage({ id: "createdate" })}:
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
                                        <FaCheckCircle size={14} color="green" />
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
                                        <FaCheckCircle size={14} color="green" />
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
                                  {dataLang.formatMessage({ id: "createdate" })}:
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
                                        <FaCheckCircle size={14} color="green" />
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
                                        <FaCheckCircle size={14} color="green" />
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
                                  {dataLang.formatMessage({ id: "createdate" })}:
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
                                        <FaCheckCircle size={14} color="green" />
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
                                        <FaCheckCircle size={14} color="green" />
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
                                  {dataLang.formatMessage({ id: "createdate" })}:
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
                                        <FaCheckCircle size={14} color="green" />
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
                                        <FaCheckCircle size={14} color="green" />
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
                                  {dataLang.formatMessage({ id: "createdate" })}:
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
                                        <FaCheckCircle size={14} color="green" />
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
                                        <FaCheckCircle size={14} color="green" />
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
                                  {dataLang.formatMessage({ id: "createdate" })}:
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
        </>
      ) : (
        <>
          <div className="DAT_ProjectHeader">
            <div className="DAT_ProjectHeader_Title">
              <GoProject color="gray" size={25} />
              <span>{dataLang.formatMessage({ id: bu })}</span>
            </div>

            <div className="DAT_ProjectHeader_Filter">
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
                className="DAT_ProjectHeader_New"
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

              <div
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
              </div>
            </div >

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
          </div >
        </>
      )}



      <div className="DAT_ProjectInfor" style={{ height: plantState.value === "default" ? "0px" : "100vh", transition: "0.5s", }}>
        {(() => {
          switch (plantState.value) {
            case "info":
              return <Project usr={user} bu={bu} data={plantobj.value} />;
            case "edit":
              return <EditProject usr={user} bu={bu} data={plantobj.value} />;
            case "add":
              return <AddProject usr={user} type={bu} />;
            case "drop":
              return <Popup name={plantobj.value.name_} type={'plant'} usr={user} plantid={plantobj.value.plantid_} />;
            case 'share':
              return <ShareBox plantid={plantobj.value.plantid_} usr={user} />
            case "toollist":
              return <div className="DAT_Toollist">
                <div
                  className="DAT_Toollist-card"
                  id="CARD"
                >
                  <Toollist bu={bu} ></Toollist>
                </div>
              </div>;
            default:
              return <></>;
          }
        })()}
      </div>

    </>
  );
}
