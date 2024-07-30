import React, { useEffect, useRef, useState } from "react";
import "./Warn.scss";

import DataTable from "react-data-table-component";
import { signal } from "@preact/signals-react";
import { Empty, partnerInfor, userInfor } from "../../App";
import {
  datePickedSignal,
  isMobile,
  notifid,
  warnfilter,
} from "../Navigation/Navigation";
import WarnPopup from "./WarnPopup";
import { useIntl } from "react-intl";
import { ruleInfor } from "../../App";
// import Filter from "../Project/Filter";
import moment from "moment-timezone";

import { CiSearch } from "react-icons/ci";
import { LuMailWarning } from "react-icons/lu";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
  IoMdMore,
} from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { AiOutlineAlert } from "react-icons/ai";
import { GoAlert } from "react-icons/go";
import PopupState, { bindMenu, bindToggle } from "material-ui-popup-state";
import { Menu, MenuItem } from "@mui/material";
import { isBrowser, useMobileOrientation } from "react-device-detect";
import { device } from "../Control/Device";
import { plantnameFilterSignal } from "../Control/Dashboard";
import { PiExportBold } from "react-icons/pi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import { lowercasedata } from "../ErrorSetting/ErrorSetting";

export const tabLable = signal("");
export const open = signal([]);
export const closed = signal([]);
export const temp = signal([]);
export const idDel = signal();
export const idInfo = signal();
export const dataWarn = signal([]);
export const dataWarnNoti = signal([]);
export const seeAll = signal(false);

const warntab = signal("all");
const tabMobile = signal(false);

export default function Warn(props) {
  const dataLang = useIntl();
  // const [filter, setFilter] = useState(false);
  const [datafilter, setDatafilter] = useState([]);
  const [datafilteropen, setDatafilteropen] = useState(open.value);
  const [datafilterclosed, setDatafilterclosed] = useState(closed.value);
  const [display, setDisplay] = useState(false);
  const [popupState, setPopupState] = useState(false);
  const [type, setType] = useState("");
  const warn = useRef();
  const notice = useRef();
  const { isLandscape } = useMobileOrientation();
  // const [seeAll, setSeeAll] = useState(false);
  const [dataMore, setDataMore] = useState({});

  const [inf, setInf] = useState({
    boxid: 0,
    name: "--",
    level: "warn",
    device: "",
    plant: "--",
    cause: [],
    solution: [],
  });

  const listTab = [
    { id: "all", name: dataLang.formatMessage({ id: "total" }) },
    // { id: "open", name: dataLang.formatMessage({ id: "unresolvewarn" }) },
    // { id: "closed", name: dataLang.formatMessage({ id: "resolve" }) },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: dataLang.formatMessage({ id: "row" }),
    rangeSeparatorText: dataLang.formatMessage({ id: "to" }),
    selectAllRowsItem: true,
    selectAllRowsItemText: dataLang.formatMessage({ id: "showAll" }),
  };

  const columnWarn = [
    {
      name: dataLang.formatMessage({ id: "ordinalNumber" }),
      selector: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: dataLang.formatMessage({ id: "errcode" }),
      selector: (row) => (
        <div
          style={{ cursor: "pointer", color: "red" }}
          onClick={(e) => handleInfo(e)}
          id={row.boxid} // E_1_3_warn....
        >
          {dataLang.formatMessage({ id: row.boxid, defaultMessage: row.boxid })}
        </div>
      ),
      sortable: true,
      width: "100px",
      style: {
        justifyContent: "left !important",
      },
    },
    {
      name: dataLang.formatMessage({ id: "name" }),
      selector: (row) => row.name,
      sortable: true,
      minWidth: "250px",
      style: {
        justifyContent: "left !important",
      },
    },
    {
      name: dataLang.formatMessage({ id: "project" }),
      selector: (row) => row.plant,
      sortable: true,
      minWidth: "250px",
      style: {
        justifyContent: "left !important",
      },
    },
    {
      name: dataLang.formatMessage({ id: "device" }),
      selector: (row) => row.device,
      sortable: true,
      width: "140px",
      style: {
        justifyContent: "left",
      },
    },
    // {
    //   name: "ID",
    //   selector: (row) => row.warnid,
    //   sortable: true,
    // },
    {
      name: dataLang.formatMessage({ id: "level" }),
      selector: (row) => (
        <>
          {row.level === "warn" ? (
            <div className="DAT_TableWarning">
              {dataLang.formatMessage({ id: "warn" })}
            </div>
          ) : (
            <div className="DAT_TableNotice">
              {dataLang.formatMessage({ id: "notice" })}
            </div>
          )}
        </>
      ),
      sortable: true,
      width: "120px",
    },
    {
      name: dataLang.formatMessage({ id: "openWarnTime" }),
      selector: (row) => row.opentime,
      sortable: true,
      width: "180px",
    },
    {
      name: dataLang.formatMessage({ id: "date" }),
      selector: (row) => row.opendate,
      sortable: true,
      width: "180px",
    },
    // {
    //   name: dataLang.formatMessage({ id: "closeWarnTime" }),
    //   selector: (row) => row.closedtime,
    //   sortable: true,
    //   width: "180px",
    // },
    {
      name: dataLang.formatMessage({ id: "edits" }),
      selector: (row) => (
        <>
          {ruleInfor.value.setting.warn.modify === true ||
          ruleInfor.value.setting.warn.remove === true ? (
            <PopupState variant="popper" popupId="demo-popup-popper">
              {(popupState) => (
                <div className="DAT_TableEdit">
                  <IoMdMore size={20} {...bindToggle(popupState)} />
                  <Menu {...bindMenu(popupState)}>
                    {ruleInfor.value.setting.warn.remove === true ? (
                      <MenuItem
                        id={row.boxid + "_" + row.device}
                        onClick={(e) => {
                          handleDeleteWarn(e);
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
                  </Menu>
                </div>
              )}
            </PopupState>
          ) : (
            // <div className="DAT_TableEdit">
            //   <span
            //     id={row.boxid + "_" + row.warnid + "_MORE"}
            //     onClick={(e) => handleModify(e, "block")}
            //   >
            //     <IoMdMore size={20} />
            //   </span>
            // </div>
            <div></div>
          )}

          {/* <div
            className="DAT_ModifyBox"
            id={row.boxid + "_" + row.warnid + "_Modify"}
            style={{ display: "none", marginTop: "3px", marginRight: "3px" }}
            onMouseLeave={(e) => handleModify(e, "none")}
          >
            {ruleInfor.value.setting.warn.remove === true ? (
              <div
                className="DAT_ModifyBox_Remove"
                id={row.boxid + "_" + row.device}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
                onClick={(e) => handleDeleteWarn(e)}
              >
                <IoTrashOutline size={16} />
                &nbsp;
                {dataLang.formatMessage({ id: "delete" })}
              </div>
            ) : (
              <div></div>
            )}
          </div> */}
        </>
      ),
      width: "100px",
    },
  ];

  const handleInfo = async (e) => {
    let temp = dataWarn.value.find((item) => item.boxid === e.currentTarget.id);
    console.log(temp);
    setDataMore(temp);
    // const id = `${temp[0]}_${temp[1]}_${temp[2]}`;

    let req = await callApi("post", `${host.DATA}/getWarninf`, {
      boxid: temp.boxid,
      sn: temp.device,
    });
    console.log(req);
    if (req.status) {
      setType("info");
      setInf({
        ...inf,
        boxid: temp.boxid,
        name: req.data.name_,
        level: temp.level,
        plant: temp.plant,
        device: temp.device,
        cause: req.data.cause_,
        solution: req.data.solution_,
      });
      // setN(req.data.name_);
      // setBoxid(temp[0]);
      // setLevel(temp[1]);
      // setPlant(temp[2]);
      // setDevice(temp[3]);
      // setCause(req.data.cause_);
      // setSolution(req.data.solution_);
      setPopupState(true);
    } else {
      setType("info");
      setInf({
        ...inf,
        boxid: temp.boxid,
        name: "--",
        level: temp.level,
        plant: temp.plant,
        device: temp.device,
        cause: [],
        solution: [],
      });
      // setN('No name');
      // setBoxid(temp[0]);
      // setLevel(temp[1]);
      // setPlant(temp[2]);
      // setDevice(temp[3]);
      // setCause([]);
      // setSolution([]);
      setPopupState(true);
    }
  };

  const handleDeleteWarn = (e) => {
    setPopupState(true);
    setType("delete");
    idDel.value = e.currentTarget.id;
  };

  const handleClosePopup = () => {
    setPopupState(false);
  };

  const closeFilter = () => {
    setDisplay(false);
  };

  // const handleModify = (e, type) => {
  //   const id = e.currentTarget.id;
  //   var arr = id.split("_");
  //   const mod = document.getElementById(
  //     `${arr[0]}_${arr[1]}_${arr[2]}_${arr[3]}_Modify`
  //   );
  //   mod.style.display = type;
  // };

  const handleTabMobile = (e) => {
    const id = e.currentTarget.id;
    warntab.value = id;
    const newLabel = listTab.find((item) => item.id == id);
    tabLable.value = newLabel.name;
  };

  useEffect(() => {
    setDatafilteropen(open.value);
    setDatafilterclosed(closed.value);

    // eslint-disable-next-line
  }, [open.value, closed.value]);

  // by Mr Loc
  const handleSearch = (e) => {
    const searchTerm = lowercasedata(e.currentTarget.value);

    if (searchTerm === "") {
      setDatafilter([...dataWarn.value]);
      warnfilter.value = {};
      // projectwarnfilter.value = 0;
    } else {
      let temp = dataWarn.value.filter(
        (item) =>
          lowercasedata(item.plant).includes(searchTerm) ||
          lowercasedata(item.device).includes(searchTerm) ||
          lowercasedata(item.boxid).includes(searchTerm) ||
          dataLang
            .formatMessage({ id: item.boxid, defaultMessage: item.boxid })
            .toLowerCase()
            .includes(searchTerm)
      );
      setDatafilter([...temp]);
      let temp2 = open.value.filter(
        (item) =>
          lowercasedata(item.plant).includes(searchTerm) ||
          lowercasedata(item.device).includes(searchTerm) ||
          lowercasedata(item.boxid).includes(searchTerm) ||
          dataLang
            .formatMessage({ id: item.boxid, defaultMessage: item.boxid })
            .toLowerCase()
            .includes(searchTerm)
      );
      setDatafilteropen([...temp2]);
      let temp3 = closed.value.filter(
        (item) =>
          lowercasedata(item.plant).includes(searchTerm) ||
          lowercasedata(item.device).includes(searchTerm) ||
          lowercasedata(item.boxid).includes(searchTerm) ||
          dataLang
            .formatMessage({ id: item.boxid, defaultMessage: item.boxid })
            .toLowerCase()
            .includes(searchTerm)
      );
      setDatafilterclosed([...temp3]);

      warnfilter.value = {};
    }
  };

  const handleResetFilter = () => {
    setDisplay(false);
    setDatafilter(dataWarn.value);
  };

  const handleCloseFilter = () => {
    setDisplay(false);
  };

  const handleWarnFilter = (opentime, closetime) => {
    //Bật tắt filter layout
    setDisplay(false);

    //Gọi biến thời gian nhập vào
    const openInput = moment(opentime).format("MM/DD/YYYY");
    const closeInput = moment(closetime).format("MM/DD/YYYY");

    const newdb = dataWarn.value.filter((item) => {
      // Gọi biến thời gian trong dataWarn
      const openData = moment(item.opentime).format("MM/DD/YYYY");
      const closeData = moment(item.closetime).format("MM/DD/YYYY");

      // Nếu người dùng không chỉnh ngày thì vẫn chạy điều kiện checkbox
      if (openInput == "Invalid date" && closeInput == "Invalid date") {
        const levelChange =
          item.level == warn.value || item.level == notice.value;
        return levelChange;
      }

      // Trường hợp 1 : Nhập ngày vào open time thì những ngày sau open time xuất hiện
      else if (closeInput === "Invalid date") {
        const timeChange = moment(openData).isSameOrAfter(openInput);
        return timeChange;
      }

      // Trường hợp 2 : Nhập ngày vào close time thì những trước sau close time xuất hiện
      else if (openInput === "Invalid date") {
        const timeChange = moment(openData).isSameOrBefore(closeInput);
        return timeChange;
      }

      // Nếu người dùng không check type warning thì vẫn chạy điều kiện thời gian
      else if (warn.value == null && notice.value == null) {
        const timeChange =
          (openData >= openInput && openData <= closeInput) ||
          (closeData >= openInput && closeData < closeInput);
        return timeChange;
      } else {
        const levelChange =
          item.level == warn.value || item.level == notice.value;
        const timeChange =
          (openData >= openInput && openData <= closeInput) ||
          (closeData >= openInput && closeData < closeInput);
        return levelChange && timeChange;
      }
    });
    setDatafilter(newdb);
  };

  const handleSeeAll = async () => {
    console.log(datePickedSignal.value);
    const t = datePickedSignal.value.split("-");
    const reformat = t[1] + "/" + t[2] + "/" + t[0];
    if (seeAll.value === false) {
      const warn = await callApi("post", host.DATA + "/getWarn", {
        usr: usr,
        partnerid: partnerInfor.value.partnerid,
        type: userInfor.value.type,
      });
      console.log(warn);
      if (warn.status) {
        seeAll.value = !seeAll.value;
        dataWarn.value = [];
        let newdb = warn.data.sort(
          (a, b) =>
            new Date(`${b.opendate_} ${b.opentime_}`) -
            new Date(`${a.opendate_} ${a.opentime_}`)
        );
        newdb.map((item, index) => {
          dataWarn.value = [
            ...dataWarn.value,
            {
              boxid: item.boxid_,
              warnid: item.warnid_,
              plant: item.name_,
              device: item.sn_,
              name: item.namewarn_,
              opentime: item.opentime_,
              opendate: item.opendate_,
              state: item.state_, // 1:false, 0:true
              level: item.level_,
              plantid: item.plantid_,
              more: item.more_,
            },
          ];
        });
      }
    } else {
      const warn = await callApi("post", host.DATA + "/getWarn2", {
        usr: usr,
        partnerid: partnerInfor.value.partnerid,
        type: userInfor.value.type,
        date: reformat,
      });
      console.log(warn);
      if (warn.status) {
        seeAll.value = !seeAll.value;
        dataWarn.value = [];
        let newdb = warn.data.sort(
          (a, b) =>
            new Date(`${b.opendate_} ${b.opentime_}`) -
            new Date(`${a.opendate_} ${a.opentime_}`)
        );
        newdb.map((item, index) => {
          dataWarn.value = [
            ...dataWarn.value,
            {
              boxid: item.boxid_,
              warnid: item.warnid_,
              plant: item.name_,
              device: item.sn_,
              name: item.namewarn_,
              opentime: item.opentime_,
              opendate: item.opendate_,
              state: item.state_, // 1:false, 0:true
              level: item.level_,
              plantid: item.plantid_,
              more: item.more_,
            },
          ];
        });
      }
    }
  };

  useEffect(() => {
    if (plantnameFilterSignal.value !== "") {
      let search = document.getElementById("warnsearch");
      search.value = plantnameFilterSignal.value;
      const newdb = dataWarn.value.filter((item) =>
        lowercasedata(item.plant).includes(
          lowercasedata(plantnameFilterSignal.value)
        )
      );
      setDatafilter([...newdb]);
    } else {
      setDatafilter([...dataWarn.value]);
    }
    // eslint-disable-next-line
  }, [plantnameFilterSignal.value, dataWarn.value]);

  useEffect(() => {
    const getWarn = async () => {
      const warn = await callApi("post", host.DATA + "/getWarn2", {
        usr: usr,
        partnerid: partnerInfor.value.partnerid,
        type: userInfor.value.type,
        date: notifid.value.date,
      });
      console.log(warn);
      if (warn.status) {
        dataWarn.value = [];
        let newdb = warn.data.sort(
          (a, b) =>
            new Date(`${b.opendate_} ${b.opentime_}`) -
            new Date(`${a.opendate_} ${a.opentime_}`)
        );
        newdb.map((item, index) => {
          dataWarn.value = [
            ...dataWarn.value,
            {
              boxid: item.boxid_,
              warnid: item.warnid_,
              plant: item.name_,
              device: item.sn_,
              name: item.namewarn_,
              opentime: item.opentime_,
              opendate: item.opendate_,
              state: item.state_, // 1:false, 0:true
              level: item.level_,
              plantid: item.plantid_,
              more: item.more_,
            },
          ];
        });

        setDatafilter([...dataWarn.value]);
        let search = document.getElementById("warnsearch");
        search.value = notifid.value.name;
        let date = document.getElementById("inputdate");
        date.value = `${notifid.value.date.split("/")[2]}-${
          notifid.value.date.split("/")[0]
        }-${notifid.value.date.split("/")[1]}`;
      }
    };
    if (notifid.value.name !== "") {
      getWarn();
    }
  }, [notifid.value.name]);

  // useEffect(() => {console.log(datafilter)}, [datafilter]);

  const handleExport = () => {
    console.log(datafilter);
    let data = [];
    data = datafilter.map((item) => {
      if (item.more === null || Object.keys(item.more).length === 0) {
        return {
          "Error code": item.boxid,
          Plant: item.plant,
          Device: item.device,
          Opentime: item.opentime,
          Opendate: item.opendate,
          Level: item.level,
        };
      } else {
        const parseBase16 = (num) => {
          var n = eval(num);
          if (n < 0) {
            n = 0xffffffff + n + 1;
          }
          return parseInt(n, 10).toString(16) || 0;
        };

        const inputstate1 = parseBase16(item.more.inputstate1);
        const inputstate2 = parseBase16(item.more.inputstate2);
        const outputstate = parseBase16(item.more.outputstate);

        return {
          "Error code": item.boxid,
          Plant: item.plant,
          Device: item.device,
          Opentime: item.opentime,
          Opendate: item.opendate,
          Level: item.level,
          "Current (A)": parseFloat(item.more.current) * 0.1,
          "DC bus (V)": parseFloat(item.more.dcbus) * 0.1,
          Floor: item.more.floor,
          "Frequency (Hz)": parseFloat(item.more.frequency) * 0.01,
          "Input state 1": inputstate1,
          "Input state 2": inputstate2,
          "Output state": outputstate,
          "Position (mm)": parseFloat(item.more.position) * 10,
          "Speed (mm/s)": item.more.speed,
        };
      }
    });
    console.log(data);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Buffer to store the generated Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "WarnList.xlsx");
  };
  const usr = useSelector((state) => state.admin.usr);

  const handlePickDate = async (e) => {
    let d = document.getElementById("warnsearch");
    d.value = "";
    plantnameFilterSignal.value = "";
    const temp = e.currentTarget.value.split("-");
    // console.log(e.currentTarget.value, datePickedSignal.value);
    const reformat = temp[1] + "/" + temp[2] + "/" + temp[0];
    // console.log(reformat);
    const warn = await callApi("post", host.DATA + "/getWarn2", {
      usr: usr,
      partnerid: partnerInfor.value.partnerid,
      type: userInfor.value.type,
      date: reformat,
    });
    // console.log(warn.data);
    if (warn.status) {
      dataWarn.value = [];
      let newdb = warn.data.sort(
        (a, b) =>
          new Date(`${b.opendate_} ${b.opentime_}`) -
          new Date(`${a.opendate_} ${a.opentime_}`)
      );
      newdb.map((item, index) => {
        dataWarn.value = [
          ...dataWarn.value,
          {
            boxid: item.boxid_,
            warnid: item.warnid_,
            plant: item.name_,
            device: item.sn_,
            name: item.namewarn_,
            opentime: item.opentime_,
            opendate: item.opendate_,
            state: item.state_, // 1:false, 0:true
            level: item.level_,
            plantid: item.plantid_,
            more: item.more_,
          },
        ];
      });
    }
  };

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
              <LuMailWarning color="gray" size={25} />
              <span>{dataLang.formatMessage({ id: "warn" })}</span>
            </div>
            <div className="DAT_Header_Filter">
              <input
                type="text"
                placeholder={dataLang.formatMessage({ id: "enterWarn" })}
                id="warnsearch"
                autoComplete="off"
                onChange={(e) => handleSearch(e)}
              />
              <CiSearch color="gray" size={20} />
            </div>
            <div></div>
          </div>

          <div className="DAT_Warn">
            <div
              className="DAT_Toollist_Tab"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              {listTab.map((item, i) => {
                return warntab.value === item.id ? (
                  <div key={i} className="DAT_Toollist_Tab_main">
                    <p className="DAT_Toollist_Tab_main_left"></p>
                    <span
                      className="DAT_Toollist_Tab_main_content1"
                      id={item.id}
                      style={{
                        backgroundColor: "White",
                        color: "black",
                        borderRadius: "10px 10px 0 0",
                      }}
                      onClick={(e) => (warntab.value = item.id)}
                    >
                      {item.name}
                    </span>
                    <p className="DAT_Toollist_Tab_main_right"></p>
                  </div>
                ) : (
                  <span
                    className="DAT_Toollist_Tab_main_content2"
                    key={i}
                    id={item.id}
                    style={{ backgroundColor: "#dadada" }}
                    onClick={(e) => (warntab.value = item.id)}
                  >
                    {item.name}
                  </span>
                );
              })}

              <div className="DAT_Warn_Export">
                {seeAll.value ? (
                  <></>
                ) : (
                  <input
                    type="date"
                    id="inputdate"
                    defaultValue={datePickedSignal.value}
                    max={moment(new Date()).format("YYYY-MM-DD")}
                    onChange={(e) => {
                      handlePickDate(e);
                      datePickedSignal.value = e.target.value;
                    }}
                  ></input>
                )}

                <div
                  className="DAT_Warn_Datepicker_SeeAll"
                  onClick={() => {
                    handleSeeAll();
                  }}
                  style={{ color: seeAll.value ? "#195ede" : "black" }}
                >
                  {dataLang.formatMessage({
                    id: seeAll.value ? "pickdate" : "seeall",
                  })}
                </div>
                <div
                  className="DAT_Warn_Export_Icon"
                  onClick={() => handleExport()}
                >
                  <PiExportBold />
                </div>
              </div>
            </div>

            <div className="DAT_Warn_Content">
              {(() => {
                switch (warntab.value) {
                  case "all":
                    return (
                      <DataTable
                        className="DAT_Table_Container"
                        columns={columnWarn}
                        data={datafilter}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        // fixedHeader={true}
                        noDataComponent={<Empty />}
                      />
                    );
                  case "open":
                    return (
                      <DataTable
                        className="DAT_Table_Container"
                        columns={columnWarn}
                        data={datafilteropen}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        // fixedHeader={true}
                        noDataComponent={<Empty />}
                      />
                    );
                  case "closed":
                    return (
                      <DataTable
                        className="DAT_Table_Container"
                        columns={columnWarn}
                        data={datafilterclosed}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        // fixedHeader={true}
                        noDataComponent={<Empty />}
                      />
                    );
                  default:
                    return <></>;
                }
              })()}

              {/* <Filter
                type="warn"
                display={display}
                warn={warn}
                notice={notice}
                handleFilter={handleWarnFilter}
                handleClose={handleCloseFilter}
                handleReset={handleResetFilter}
                handleCancel={closeFilter}
              /> */}
            </div>
          </div>

          <div
            className="DAT_PopupBG"
            style={{ height: popupState ? "100vh" : "0px" }}
          >
            <WarnPopup
              data={inf}
              type={type}
              handleClose={handleClosePopup}
              more={dataMore.more}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="DAT_WarnHeaderMobile">
            <div className="DAT_WarnHeaderMobile_Top">
              <div className="DAT_WarnHeaderMobile_Top_Filter">
                <input
                  type="text"
                  placeholder={dataLang.formatMessage({ id: "enterWarn" })}
                  id="warnsearch"
                  autoComplete="off"
                  onChange={(e) => handleSearch(e)}
                />
                <CiSearch color="gray" size={20} />
              </div>
            </div>

            <div className="DAT_WarnHeaderMobile_Title">
              <LuMailWarning color="gray" size={25} />
              <span>{dataLang.formatMessage({ id: "warn" })}</span>
            </div>
          </div>

          <div className="DAT_WarnMobile">
            <div className="DAT_Toollist_Tab_Mobile">
              <button
                className="DAT_Toollist_Tab_Mobile_content"
                onClick={() => (tabMobile.value = !tabMobile.value)}
              >
                <span> {tabLable.value}</span>
                <div className="DAT_Toollist_Tab_Mobile_content_Icon">
                  <FiFilter />
                  {tabMobile.value ? <IoIosArrowDown /> : <IoIosArrowForward />}
                </div>
              </button>

              <div
                className="DAT_Toollist_Tab_Mobile_list"
                style={{
                  top: "50px",
                  height: tabMobile.value ? "100px" : "0",
                  transition: "0.5s",
                  boxShadow: tabMobile.value
                    ? "0 0 4px 4px rgba(193, 193, 193, 0.5)"
                    : "none",
                }}
              >
                {listTab.map((item, i) => {
                  return (
                    <div
                      className="DAT_Toollist_Tab_Mobile_list_item"
                      key={i}
                      id={item.id}
                      onClick={(e) => {
                        handleTabMobile(e);
                        tabMobile.value = false;
                      }}
                    >
                      {i + 1}: {item.name}
                    </div>
                  );
                })}
              </div>
            </div>

            {(() => {
              switch (warntab.value) {
                case "all":
                  return (
                    <>
                      {datafilter?.map((item, i) => {
                        return (
                          <div key={i} className="DAT_WarnMobile_Content">
                            <div className="DAT_WarnMobile_Content_Top">
                              <div className="DAT_WarnMobile_Content_Top_Level">
                                {item.level === "warn" ? (
                                  <div
                                    className="DAT_WarnMobile_Content_Top_Warning"
                                    style={{ flexDirection: "column" }}
                                    onClick={(e) => handleInfo(e)}
                                    id={item.boxid}
                                  >
                                    <GoAlert
                                      size={25}
                                      style={{ marginBottom: "5px" }}
                                    />
                                    {dataLang.formatMessage({ id: "warn" })}
                                  </div>
                                ) : (
                                  <div
                                    className="DAT_WarnMobile_Content_Top_Notice"
                                    style={{ flexDirection: "column" }}
                                    onClick={(e) => handleInfo(e)}
                                    id={item.boxid}
                                  >
                                    <AiOutlineAlert
                                      size={25}
                                      style={{ marginBottom: "5px" }}
                                    />
                                    {dataLang.formatMessage({ id: "notice" })}
                                  </div>
                                )}
                              </div>
                              <div className="DAT_WarnMobile_Content_Top_Info">
                                <div
                                  className="DAT_WarnMobile_Content_Top_Info_Name"
                                  onClick={(e) => handleInfo(e)}
                                  id={item.boxid}
                                >
                                  {dataLang.formatMessage({
                                    id: item.boxid,
                                    defaultMessage: item.boxid,
                                  })}
                                </div>
                                <div className="DAT_WarnMobile_Content_Top_Info_Device">
                                  {dataLang.formatMessage({ id: "device" })}:{" "}
                                  {item.device}
                                </div>
                                <div className="DAT_WarnMobile_Content_Top_Info_Project">
                                  {dataLang.formatMessage({ id: "project" })}:{" "}
                                  {item.plant}
                                </div>
                              </div>
                            </div>

                            <div className="DAT_WarnMobile_Content_Bottom">
                              <div className="DAT_WarnMobile_Content_Bottom_Left">
                                <div className="DAT_WarnMobile_Content_Bottom_Left_Open">
                                  {dataLang.formatMessage({
                                    id: "openWarnTime",
                                  })}
                                  : {item.opentime}
                                </div>
                                <div className="DAT_WarnMobile_Content_Bottom_Left_Close">
                                  {dataLang.formatMessage({
                                    id: "closeWarnTime",
                                  })}
                                  : {item.closedtime}
                                </div>
                              </div>
                              <div className="DAT_WarnMobile_Content_Bottom_Right">
                                <div
                                  className="DAT_WarnMobile_Content_Bottom_Right_Item"
                                  id={item.boxid + "_" + item.device}
                                  onClick={(e) => handleDeleteWarn(e)}
                                >
                                  <IoTrashOutline size={16} />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                case "open":
                  return (
                    <>
                      {datafilteropen?.map((item, i) => {
                        return (
                          <div key={i} className="DAT_WarnMobile_Content">
                            <div className="DAT_WarnMobile_Content_Top">
                              <div className="DAT_WarnMobile_Content_Top_Level">
                                {item.level === "warn" ? (
                                  <div
                                    className="DAT_WarnMobile_Content_Top_Warning"
                                    style={{ flexDirection: "column" }}
                                    onClick={(e) => handleInfo(e)}
                                    id={item.boxid}
                                  >
                                    <GoAlert
                                      size={25}
                                      style={{ marginBottom: "5px" }}
                                    />
                                    {dataLang.formatMessage({ id: "warn" })}
                                  </div>
                                ) : (
                                  <div
                                    className="DAT_WarnMobile_Content_Top_Notice"
                                    style={{ flexDirection: "column" }}
                                    onClick={(e) => handleInfo(e)}
                                    id={item.boxid}
                                  >
                                    <AiOutlineAlert
                                      size={25}
                                      style={{ marginBottom: "5px" }}
                                    />
                                    {dataLang.formatMessage({ id: "notice" })}
                                  </div>
                                )}
                              </div>
                              <div className="DAT_WarnMobile_Content_Top_Info">
                                <div
                                  className="DAT_WarnMobile_Content_Top_Info_Name"
                                  onClick={(e) => handleInfo(e)}
                                  id={item.boxid}
                                >
                                  {dataLang.formatMessage({
                                    id: item.boxid,
                                    defaultMessage: item.boxid,
                                  })}
                                </div>
                                <div className="DAT_WarnMobile_Content_Top_Info_Device">
                                  {dataLang.formatMessage({ id: "device" })}:{" "}
                                  {item.device}
                                </div>
                                <div className="DAT_WarnMobile_Content_Top_Info_Project">
                                  {dataLang.formatMessage({ id: "project" })}:{" "}
                                  {item.plant}
                                </div>
                              </div>
                            </div>

                            <div className="DAT_WarnMobile_Content_Bottom">
                              <div className="DAT_WarnMobile_Content_Bottom_Left">
                                <div className="DAT_WarnMobile_Content_Bottom_Left_Open">
                                  {dataLang.formatMessage({
                                    id: "openWarnTime",
                                  })}
                                  : {item.opentime}
                                </div>
                                <div className="DAT_WarnMobile_Content_Bottom_Left_Close">
                                  {dataLang.formatMessage({
                                    id: "closeWarnTime",
                                  })}
                                  : {item.closedtime}
                                </div>
                              </div>
                              <div className="DAT_WarnMobile_Content_Bottom_Right">
                                <div
                                  className="DAT_WarnMobile_Content_Bottom_Right_Item"
                                  id={item.boxid + "_" + item.device}
                                  onClick={(e) => handleDeleteWarn(e)}
                                >
                                  <IoTrashOutline size={16} />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                case "closed":
                  return (
                    <>
                      {datafilterclosed?.map((item, i) => {
                        return (
                          <div key={i} className="DAT_WarnMobile_Content">
                            <div className="DAT_WarnMobile_Content_Top">
                              <div className="DAT_WarnMobile_Content_Top_Level">
                                {item.level === "warn" ? (
                                  <div
                                    className="DAT_WarnMobile_Content_Top_Warning"
                                    style={{ flexDirection: "column" }}
                                    onClick={(e) => handleInfo(e)}
                                    id={item.boxid}
                                  >
                                    <GoAlert
                                      size={25}
                                      style={{ marginBottom: "5px" }}
                                    />
                                    {dataLang.formatMessage({ id: "warn" })}
                                  </div>
                                ) : (
                                  <div
                                    className="DAT_WarnMobile_Content_Top_Notice"
                                    style={{ flexDirection: "column" }}
                                    onClick={(e) => handleInfo(e)}
                                    id={item.boxid}
                                  >
                                    <AiOutlineAlert
                                      size={25}
                                      style={{ marginBottom: "5px" }}
                                    />
                                    {dataLang.formatMessage({ id: "notice" })}
                                  </div>
                                )}
                              </div>
                              <div className="DAT_WarnMobile_Content_Top_Info">
                                <div
                                  className="DAT_WarnMobile_Content_Top_Info_Name"
                                  onClick={(e) => handleInfo(e)}
                                  id={item.boxid}
                                >
                                  {dataLang.formatMessage({
                                    id: item.boxid,
                                    defaultMessage: item.boxid,
                                  })}
                                </div>
                                <div className="DAT_WarnMobile_Content_Top_Info_Device">
                                  {dataLang.formatMessage({ id: "device" })}:{" "}
                                  {item.device}
                                </div>
                                <div className="DAT_WarnMobile_Content_Top_Info_Project">
                                  {dataLang.formatMessage({ id: "project" })}:{" "}
                                  {item.plant}
                                </div>
                              </div>
                            </div>

                            <div className="DAT_WarnMobile_Content_Bottom">
                              <div className="DAT_WarnMobile_Content_Bottom_Left">
                                <div className="DAT_WarnMobile_Content_Bottom_Left_Open">
                                  {dataLang.formatMessage({
                                    id: "openWarnTime",
                                  })}
                                  : {item.opentime}
                                </div>
                                <div className="DAT_WarnMobile_Content_Bottom_Left_Close">
                                  {dataLang.formatMessage({
                                    id: "closeWarnTime",
                                  })}
                                  : {item.closedtime}
                                </div>
                              </div>
                              <div className="DAT_WarnMobile_Content_Bottom_Right">
                                <div
                                  className="DAT_WarnMobile_Content_Bottom_Right_Item"
                                  id={item.boxid + "_" + item.device}
                                  onClick={(e) => handleDeleteWarn(e)}
                                >
                                  <IoTrashOutline size={16} />
                                </div>
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

          {isLandscape ? (
            <div
              className="DAT_ViewPopupMobile"
              style={{ height: popupState ? "100vh" : "0px" }}
            >
              {/* <WarnPopup name={n} boxid={boxid} level={level} plant={plant} device={device} cause={cause} solution={solution} type={type} handleClose={handleClosePopup} /> */}
              <WarnPopup
                data={inf}
                type={type}
                handleClose={handleClosePopup}
                more={dataMore.more}
              />
            </div>
          ) : (
            <div
              className="DAT_PopupBGMobile"
              style={{ height: popupState ? "100vh" : "0px" }}
            >
              {/* <WarnPopup name={n} boxid={boxid} level={level} plant={plant} device={device} cause={cause} solution={solution} type={type} handleClose={handleClosePopup} /> */}
              <WarnPopup
                data={inf}
                type={type}
                handleClose={handleClosePopup}
                more={dataMore.more}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
