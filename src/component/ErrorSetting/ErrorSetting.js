import React, { useEffect, useRef, useState } from "react";
import "./ErrorSetting.scss";

import { useIntl } from "react-intl";
import DataTable from "react-data-table-component";
import CreateErrSetting from "./CreateErrSetting";
import EditErr from "./EditErr";

import { IoMdMore, IoIosAddCircleOutline, IoMdAdd } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FiEdit } from "react-icons/fi";
import {
  IoAddOutline,
  IoCaretBackOutline,
  IoTrashOutline,
} from "react-icons/io5";
import RemoveErr from "./RemoveErr";
import { alertDispatch } from "../Alert/Alert";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import PopupState, {
  bindHover,
  bindMenu,
  bindPopper,
  bindToggle,
} from "material-ui-popup-state";
import { Fade, Menu, MenuItem, Paper, Popper, Typography } from "@mui/material";
import { Empty, partnerInfor, userInfor } from "../../App";
import { isBrowser } from "react-device-detect";
import { PiUsersFour } from "react-icons/pi";
import { signal } from "@preact/signals-react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useSelector } from "react-redux";
import { MdOutlineManageHistory } from "react-icons/md";
import ErrNameEdit from "./ErrNameEdit";
import { LuRouter } from "react-icons/lu";
import { BiMessageAltError } from "react-icons/bi";

export const groupErrSN = signal("");

export const lowercasedata = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

// data = [
//   {
//     warnid: 1,
//     boxid: "A_1_3",
//     cause: [{ id: 1, vi: "Lỗi điều khiển", en: "Control system error" }],
//     solution: [
//       { id: 1, vi: "Khôi phục cấu hình gốc", en: "Return factory config" },
//     ],
//   },
//   {
//     warnid: 1,
//     boxid: "A_1_3",
//     cause: [{ id: 1, vi: "Lỗi điều khiển", en: "Control system error" }],
//     solution: [
//       { id: 1, vi: "Khôi phục cấu hình gốc", en: "Return factory config" },
//     ],
//   },
// ];

export default function ErrorSetting(props) {
  const dataLang = useIntl();
  const [createState, setCreateState] = useState(false);
  const [editState, setEditState] = useState(false);
  const [editNS, setEditNS] = useState(false);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [removeState, setRemoveState] = useState(false);
  const [removeType, setRemoveType] = useState("");
  const [arrayData, setArrayData] = useState();
  const [dataApi, setDataApi] = useState([]);
  const [data, setData] = useState(dataApi);
  const [editVi, setEditVi] = useState("");
  const [editEn, setEditEn] = useState("");
  const [editarray, setEditarray] = useState();
  // const filterRef = useRef();
  const [dataGateway, setDataGateway] = useState([]);
  const [dataGatewaySub, setDataGatewaySub] = useState([]);
  const [dataErr, setDataErr] = useState([]);
  const [errList, setErrList] = useState(false);
  const [filterType, setFilterType] = useState(true);

  const paginationComponentOptions = {
    rowsPerPageText: dataLang.formatMessage({ id: "row" }),
    rangeSeparatorText: dataLang.formatMessage({ id: "to" }),
    selectAllRowsItem: true,
    selectAllRowsItemText: dataLang.formatMessage({ id: "showAll" }),
  };

  const columnLog = [
    {
      name: dataLang.formatMessage({ id: "ordinalNumber" }),
      selector: (row, index) => index + 1,
      sortable: true,
      width: "50px",
      style: {
        justifyContent: "left",
        height: "auto !important",
      },
    },
    //ERRCODE
    {
      name: dataLang.formatMessage({ id: "errcode" }),
      selector: (row) => row.boxid_,
      sortable: true,
      width: "60px",
      style: {
        height: "auto !important",
        justifyContent: "left !important",
      },
    },
    //ERRNAME
    {
      name: dataLang.formatMessage({ id: "errname" }),
      selector: (row) => {
        return (
          <div>
            <div
              className="DAT_TableText"
              id={row.boxid_}
              onClick={(e) => {
                setEditNS(!editNS);
                setEditName(row.name_);
                setEditarray(e.currentTarget.id);
              }}
            >
              {row.name_}
            </div>
          </div>
        );
      },
      sortable: true,
      width: "300px",
      style: {
        cursor: "pointer",
        height: "auto !important",
        justifyContent: "left !important",
      },
    },
    //CAUSE
    {
      name: dataLang.formatMessage({ id: "causeViEn" }),
      selector: (row) => {
        let cause = row.cause_.sort((a, b) => a.id - b.id);
        // console.log(dataErr, row);
        // let cause = row.cause_;
        return (
          <div style={{ height: "auto" }}>
            {cause.map((err, index) => {
              return (
                <div
                  key={err.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 0",
                    gap: "20px",
                  }}
                >
                  <div className="DAT_TableText">{err.vi}</div>
                  <div className="DAT_TableText">{err.en}</div>
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
                      id={`${row.boxid_}-${err.id}-EDITCAUSE`}
                      onClick={(e) => handleEdit(e)}
                    />
                    <IoTrashOutline
                      size={16}
                      style={{ cursor: "pointer" }}
                      id={`${row.boxid_}_${err.id}_REMOVECAUSE`}
                      onClick={(e) => handleDelete(e)}
                    />
                    {parseInt(index) === cause.length - 1 ? (
                      <IoIosAddCircleOutline
                        size={16}
                        style={{ cursor: "pointer" }}
                        id={`${row.boxid_}-ADDCAUSE`}
                        onClick={(e) => handleAdd(e)}
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
    //SOLUTION
    {
      name: dataLang.formatMessage({ id: "solutionViEn" }),
      selector: (row) => {
        let solution = row.solution_.sort((a, b) => a.id - b.id);
        return (
          <div style={{ height: "auto" }}>
            {solution.map((err, index) => {
              return (
                <div
                  key={err.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 0",
                    gap: "20px",
                  }}
                >
                  <div className="DAT_TableText">{err.vi}</div>
                  <div className="DAT_TableText">{err.en}</div>
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
                      id={`${row.boxid_}-${err.id}-EDITSOLUTION`}
                      onClick={(e) => handleEdit(e)}
                    />
                    <IoTrashOutline
                      size={16}
                      style={{ cursor: "pointer" }}
                      id={`${row.boxid_}_${err.id}_REMOVESOLUTION`}
                      onClick={(e) => handleDelete(e)}
                    />
                    {parseInt(index) === solution.length - 1 ? (
                      <IoIosAddCircleOutline
                        size={16}
                        style={{ cursor: "pointer" }}
                        id={`${row.boxid_}-ADDSOLUTION`}
                        onClick={(e) => handleAdd(e)}
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
    //SETTING
    {
      name: dataLang.formatMessage({ id: "setting" }),
      selector: (row) => (
        <>
          {row.type_ === "master" ? (
            <></>
          ) : (
            // <div className="DAT_TableEdit">
            //   <span
            //     id={row.warnid_ + "_MORE"}
            //     onClick={(e) => handleModify(e, "block")}
            //   >
            //     <IoMdMore size={20} />
            //   </span>
            // </div>
            <PopupState variant="popper" popupId="demo-popup-popper">
              {(popupState) => (
                <div className="DAT_TableEdit">
                  <IoMdMore size={20} {...bindToggle(popupState)} />
                  <Menu {...bindMenu(popupState)}>
                    <MenuItem
                      id={row.boxid_}
                      onClick={(e) => {
                        handleDelete(e);
                        popupState.close();
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
          {/* <div
            className="DAT_ModifyBox"
            id={row.warnid_ + "_Modify"}
            style={{ display: "none", width: "80px" }}
            onMouseLeave={(e) => handleModify(e, "none")}
          >
            <div
              className="DAT_ModifyBox_Remove"
              id={row.boxid_}
              onClick={(e) => handleDelete(e)}
            >
              <IoTrashOutline size={16} />
              &nbsp;
              {dataLang.formatMessage({ id: "remove" })}
            </div>
          </div> */}
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

  // const handleModify = (e, type) => {
  //   const id = e.currentTarget.id;
  //   var arr = id.split("_");

  //   const mod = document.getElementById(arr[0] + "_Modify");
  //   mod.style.display = type;
  // };
  const handleChangeGroup = (e) => {
    groupErrSN.value = e.currentTarget.id;
    console.log(groupErrSN.value);
    const getRegister = async (sn) => {
      let inf = await callApi("post", host.DATA + "/getWarnBox", {
        sn: sn,
      });
      console.log(inf);
      if (inf.status === true) {
        if (inf.data.length > 0) {
          setDataErr(inf.data.sort((a, b) => a.boxid_ - b.boxid_));
          setDataApi(inf.data.sort((a, b) => a.boxid_ - b.boxid_));
          console.log(dataErr);
        } else {
          setDataErr([]);
          setDataApi([]);
        }
      }
    };
    console.log(dataErr);
    getRegister(e.currentTarget.id);
  };

  const handleCloseCreate = () => {
    setCreateState(false);
  };

  const handleCloseEditName = (e) => {
    setEditNS(!editNS);
  };

  const handleConfirmCreate = async (e, code, name, num2) => {
    e.preventDefault();
    if (code === "" || name === "") {
      alertDispatch(dataLang.formatMessage({ id: "alert_17" }));
    } else {
      const t = dataErr.find((item) => item.boxid_ === code);
      if (t !== undefined) {
        alertDispatch(dataLang.formatMessage({ id: "alert_49" }));
      } else {
        let req = await callApi("post", `${host.DATA}/updateWarnBox`, {
          sn: groupErrSN.value,
          boxid: code,
          name: name,
          cause: JSON.stringify([
            { id: 1, vi: "Nguyên nhân 1", en: "Cause 1" },
          ]),
          solution: JSON.stringify([
            { id: 1, vi: "Giải pháp 1", en: "Solution 1" },
          ]),
        });
        console.log(req);
        if (req.status) {
          const newdata = dataErr;
          newdata.push({
            boxid_: code,
            name_: name,
            cause_: [{ id: 1, vi: "Nguyên nhân 1", en: "Cause 1" }],
            solution_: [{ id: 1, vi: "Giải pháp 1", en: "Solution 1" }],
          });
          setDataErr([...newdata]);
          console.log(dataErr);
          setCreateState(false);
        }
        // alertDispatch(dataLang.formatMessage({ id: "alert_59" }));
      }
    }
  };

  const handleEdit = (e) => {
    const arr = e.currentTarget.id.split("-");
    setEditarray(arr);
    switch (arr[2]) {
      case "EDITCAUSE":
        const index = dataErr
          .find((item) => item.boxid_ === arr[0])
          .cause_.findIndex((item) => item.id === parseInt(arr[1]));
        setEditVi(
          dataErr.find((item) => item.boxid_ === arr[0]).cause_[index].vi
        );
        setEditEn(
          dataErr.find((item) => item.boxid_ === arr[0]).cause_[index].en
        );
        break;
      case "EDITSOLUTION":
        const i = dataErr
          .find((item) => item.boxid_ === arr[0])
          .solution_.findIndex((item) => item.id === parseInt(arr[1]));
        setEditVi(
          dataErr.find((item) => item.boxid_ === arr[0]).solution_[i].vi
        );
        setEditEn(
          dataErr.find((item) => item.boxid_ === arr[0]).solution_[i].en
        );
        break;
      default:
        break;
    }

    setEditType(arr[2]);
    setEditState(true);
  };

  const confirmEdit = async (e, editvi, editen) => {
    e.preventDefault();
    switch (editarray[2]) {
      case "EDITCAUSE":
        const index = data
          .find((item) => item.boxid_ === editarray[0])
          .cause_.findIndex((item) => item.id === parseInt(editarray[1]));
        dataErr.find((item) => item.boxid_ === editarray[0]).cause_[index].vi =
          editvi;
        dataErr.find((item) => item.boxid_ === editarray[0]).cause_[index].en =
          editen;
        break;
      case "EDITSOLUTION":
        const i = data
          .find((item) => item.boxid_ === editarray[0])
          .solution_.findIndex((item) => item.id === parseInt(editarray[1]));
        dataErr.find((item) => item.boxid_ === editarray[0]).solution_[i].vi =
          editvi;
        dataErr.find((item) => item.boxid_ === editarray[0]).solution_[i].en =
          editen;
        break;
      default:
        break;
    }
    let req = await callApi("post", `${host.DATA}/updateWarnBox`, {
      sn: groupErrSN.value,
      name: dataErr.find((item) => item.boxid_ === editarray[0]).name_,
      boxid: editarray[0],
      cause: JSON.stringify(
        dataErr.find((item) => item.boxid_ === editarray[0]).cause_
      ),
      solution: JSON.stringify(
        dataErr.find((item) => item.boxid_ === editarray[0]).solution_
      ),
    });

    // console.log(JSON.stringify(data, (key, value) => {
    //   if (key === 'cause' || key === 'solution') {
    //     return JSON.stringify(value);
    //   }
    //   return value;
    // }, 2));

    if (req.status) {
      alertDispatch(dataLang.formatMessage({ id: "alert_58" }));
      setEditState(false);
    } else {
      alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
    }
  };

  const handleCloseEdit = () => {
    setEditState(false);
  };

  const handleDelete = (e) => {
    let arr = e.currentTarget.id.split("_");
    console.log(arr);
    setArrayData(arr);
    setRemoveType(arr[4]);
    setRemoveState(true);
  };

  const confirmDelete = async (e) => {
    e.preventDefault();
    const boxid = `${arrayData[0]}`;
    console.log(boxid);
    console.log(arrayData);
    // console.log(arrayData[2]);
    switch (arrayData[2]) {
      case "REMOVECAUSE":
        let tremovecause = dataErr.find((item) => item.boxid_ === boxid);
        // let indexcause = dataErr.findIndex((item) => item.boxid_ === boxid);
        if (tremovecause.cause_.length === 1) {
          alertDispatch(dataLang.formatMessage({ id: "alert_50" }));
        } else {
          const temp = tremovecause.cause_.filter(
            (item) => item.id !== parseInt(arrayData[1])
          );
          tremovecause.cause_ = temp;
          // data[indexcause] = tremovecause;
          let req1 = await callApi("post", `${host.DATA}/updateWarnBox`, {
            sn: groupErrSN.value,
            boxid: boxid,
            name: dataErr.find((item) => item.boxid_ === boxid).name_,
            cause: JSON.stringify(
              dataErr.find((item) => item.boxid_ === boxid).cause_
            ),
            solution: JSON.stringify(
              dataErr.find((item) => item.boxid_ === boxid).solution_
            ),
          });
          // console.log(req1);
          if (req1.status) {
            setRemoveState(false);
          }
        }
        break;
      case "REMOVESOLUTION":
        let tremovesolution = dataErr.find((item) => item.boxid_ === boxid);
        let indexsolution = dataErr.findIndex((item) => item.boxid_ === boxid);
        if (tremovesolution.solution_.length === 1) {
          alertDispatch(dataLang.formatMessage({ id: "alert_51" }));
        } else {
          const temp = tremovesolution.solution_.filter(
            (item) => item.id !== parseInt(arrayData[1])
          );
          tremovesolution.solution_ = temp;
          data[indexsolution] = tremovesolution;
        }
        let req2 = await callApi("post", `${host.DATA}/updateWarnBox`, {
          sn: groupErrSN.value,
          boxid: boxid,
          name: dataErr.find((item) => item.boxid_ === boxid).name_,
          cause: JSON.stringify(
            dataErr.find((item) => item.boxid_ === boxid).cause_
          ),
          solution: JSON.stringify(
            dataErr.find((item) => item.boxid_ === boxid).solution_
          ),
        });
        console.log(req2);
        if (req2.status) {
          setRemoveState(false);
        }
        break;
      default:
        let req = await callApi("post", `${host.DATA}/removeWarnBox`, {
          sn: groupErrSN.value,
          boxid: boxid,
        });
        console.log(req);
        if (req.status) {
          setDataErr(dataErr.filter((item) => item.boxid_ !== boxid));
          setRemoveState(false);
          alertDispatch(dataLang.formatMessage({ id: "alert_60" }));
        } else {
          alertDispatch(dataLang.formatMessage({ id: "alert_7" }));
        }
        break;
    }
  };

  const handleCloseRemove = () => {
    setRemoveState(false);
  };

  const handleAdd = async (e) => {
    const arr = e.currentTarget.id.split("-");
    const bigdata = dataErr;
    const index = bigdata.findIndex((item) => item.boxid_ === arr[0]);
    switch (arr[1]) {
      case "ADDCAUSE":
        const causelength = bigdata[index].cause_.length;
        bigdata[index].cause_ = [
          ...bigdata[index].cause_,
          {
            id: bigdata[index].cause_[causelength - 1].id + 1,
            vi: `Nguyên nhân ${bigdata[index].cause_[causelength - 1].id + 1}`,
            en: `Cause ${bigdata[index].cause_[causelength - 1].id + 1}`,
          },
        ];
        setDataErr([...bigdata]);
        break;
      case "ADDSOLUTION":
        const solutionlength = bigdata[index].solution_.length;
        bigdata[index].solution_ = [
          ...bigdata[index].solution_,
          {
            id: bigdata[index].solution_[solutionlength - 1].id + 1,
            vi: `Giải pháp ${
              bigdata[index].solution_[solutionlength - 1].id + 1
            }`,
            en: `Solution ${
              bigdata[index].solution_[solutionlength - 1].id + 1
            }`,
          },
        ];
        setDataErr([...bigdata]);
        break;
      default:
        break;
    }
    await callApi("post", `${host.DATA}/updateWarnBox`, {
      sn: groupErrSN.value,
      boxid: arr[0],
      name: dataErr.find((item) => item.boxid_ === arr[0]).name_,
      cause: JSON.stringify(
        dataErr.find((item) => item.boxid_ === arr[0]).cause_
      ),
      solution: JSON.stringify(
        dataErr.find((item) => item.boxid_ === arr[0]).solution_
      ),
    });
  };

  const handleConfirmEditName = async (editname) => {
    console.log(editname);
    console.log(editarray);
    let un = await callApi("post", `${host.DATA}/updateWarnBox`, {
      sn: groupErrSN.value,
      boxid: editarray,
      name: editname,
      cause: JSON.stringify(
        dataErr.find((item) => item.boxid_ === editarray).cause_
      ),
      solution: JSON.stringify(
        dataErr.find((item) => item.boxid_ === editarray).solution_
      ),
    });

    if (un.status) {
      setEditNS(false);
      const boxid = editarray;
      const index = dataErr.findIndex((item) => item.boxid_ === editarray);
      const t = dataErr;
      t[index].name_ = editname;
      setDataErr([...t]);
    }
  };

  const handleFilter = (e) => {
    const input = lowercasedata(e.currentTarget.value);
    const t = dataGatewaySub;
    if (input == "") {
      setDataGateway([...t]);
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

  const handleFilterDataErr = (e) => {
    // if (dataErr.length > 0) {
    //   const input = lowercasedata(e.currentTarget.value);
    //   console.log(input);
    //   const t = dataErr;
    //   if (input == "") {
    //     setDataErr([...dataErr]);
    //   } else {
    //     const temp = t.filter((item) => {
    //       return (
    //         lowercasedata(item.boxid_).includes(input) ||
    //         lowercasedata(item.name_).includes(input) ||
    //         item.cause_.some(
    //           (cause) =>
    //             lowercasedata(cause.vi).includes(input) ||
    //             lowercasedata(cause.en).includes(input)
    //         ) ||
    //         item.solution_.some(
    //           (solution) =>
    //             lowercasedata(solution.vi).includes(input) ||
    //             lowercasedata(solution.en).includes(input)
    //         )
    //       );
    //     });
    //     console.log(temp);
    //     // setDataErr([...temp]);
    //   }
    // }
    const input = lowercasedata(e.currentTarget.value);
    console.log(input, "filter gateway");
    const t = dataApi;
    if (input == "") {
      setDataErr([...t]);
    } else {
      let temp = t.filter((data) => {
        return (
          lowercasedata(data.boxid_).includes(input) ||
          lowercasedata(data.name_).includes(input) ||
          data.cause_.some(
            (cause) =>
              lowercasedata(cause.vi).includes(input) ||
              lowercasedata(cause.en).includes(input)
          ) ||
          data.solution_.some(
            (solution) =>
              lowercasedata(solution.vi).includes(input) ||
              lowercasedata(solution.en).includes(input)
          )
        );
      });
      setDataErr([...temp]);
    }
  };

  useEffect(() => {
    if (groupErrSN.value === "") {
      console.log(true);
    } else {
      console.log(false);
    }
  }, [groupErrSN.value]);

  // useEffect(() => {
  //   console.log(editNS);
  // }, [editNS]);

  useEffect(() => {
    setData(dataApi);
  }, [dataApi]);

  const usr = useSelector((state) => state.admin.usr);
  useEffect(() => {
    const getAllLogger = async (usr, id, type) => {
      let res = await callApi("post", host.DATA + "/getAllLogger", {
        usr: usr,
        partnerid: id,
        type: type,
      });
      if (res.status) {
        setDataGateway([...res.data.sort((a, b) => a.id_ - b.id_)]);
        setDataGatewaySub([...res.data.sort((a, b) => a.id_ - b.id_)]);
        console.log(res.data.sort((a, b) => a.id_ - b.id_));
      }
    };

    if (partnerInfor.value) {
      getAllLogger(usr, partnerInfor.value.partnerid, userInfor.value.type);
    }
  }, [partnerInfor.value]);

  return (
    <div
      style={{
        position: "relative",
        top: "0",
        left: "0",
        width: "100%",
        height: "100vh",
      }}
    >
      {/* BẢN MỚI ĐANG UPDATE */}
      {isBrowser ? (
        <>
          <div className="DAT_Header">
            <div className="DAT_Header_Title">
              <PiUsersFour color="gray" size={25} />
              <span>{dataLang.formatMessage({ id: "errorsetting" })}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
              <PopupState variant="popper" popupId="demo-popup-popper">
                {(popupState) => (
                  <div style={{ cursor: "pointer" }}>
                    <div
                      className="DAT_Header_Select"
                      onClick={() => setFilterType(!filterType)}
                      {...bindHover(popupState)}
                    >
                      {filterType ? (
                        <LuRouter size={17} color="#0b1967" />
                      ) : (
                        <BiMessageAltError size={17} color="#0b1967" />
                      )}
                    </div>
                    <Popper {...bindPopper(popupState)} transition>
                      {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                          <Paper
                            sx={{
                              width: "fit-content",
                              marginLeft: "0px",
                              marginTop: "5px",
                              height: "20px",
                              p: 2,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "12px",
                                textAlign: "justify",
                                justifyItems: "center",
                                // marginBottom: 1.7,
                              }}
                            >
                              {dataLang.formatMessage({
                                id: filterType ? "devicelist" : "errlist",
                              })}
                            </Typography>
                          </Paper>
                        </Fade>
                      )}
                    </Popper>
                  </div>
                )}
              </PopupState>

              <div
                className="DAT_Header_Filter2"
                style={{
                  backgroundColor: "white",
                }}
              >
                <input
                  type="text"
                  id="search"
                  // autoComplete="on"
                  placeholder={dataLang.formatMessage({ id: "enterInfo" })}
                  onChange={(e) => {
                    handleFilter(e);
                    console.log(e.currentTarget.value);
                  }}
                  style={{
                    display: filterType ? "block" : "none",
                  }}
                />
                <input
                  type="text"
                  id="search2"
                  // autoComplete="on"
                  placeholder={dataLang.formatMessage({ id: "enterInfo" })}
                  onChange={(e) => handleFilterDataErr(e)}
                  style={{ display: filterType ? "none" : "block" }}
                />
                {/* <span
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "Montserrat-Bold",
                      fontSize: "13px",
                      color: "#0B1967",
                    }}
                    onClick={() => setFilterType(!filterType)}
                  >
                    {dataLang.formatMessage({
                      id: filterType ? "devicelist" : "errlist",
                    })}
                  </span> */}

                <CiSearch color="gray" size={20} />
              </div>
            </div>

            <div className=""></div>
          </div>

          <div className="DAT_ES">
            <div className="DAT_ES_Header">
              {dataLang.formatMessage({ id: "errorsetting" })}
            </div>
            <div className="DAT_ES_Content">
              <div className="DAT_ES_Content_DevideTable">
                <div
                  className="DAT_ES_Content_DevideTable_Left"
                  style={{ width: "300px" }}
                >
                  <div className="DAT_ES_Content_DevideTable_Left_Head">
                    {dataLang.formatMessage({ id: "devicelist" })}
                  </div>

                  <div className="DAT_ES_Content_DevideTable_Left_ItemList">
                    {dataGateway.map((item, index) => (
                      <div
                        className="DAT_ES_Content_DevideTable_Left_ItemList_Item"
                        key={index}
                        id={item.sn_}
                        style={{
                          backgroundColor:
                            groupErrSN.value === item.sn_
                              ? "rgb(207, 207, 207, 0.4)"
                              : "",
                        }}
                        onClick={(e) => handleChangeGroup(e)}
                      >
                        <div>
                          <div
                            className="DAT_ES_Content_DevideTable_Left_ItemList_Item_Name"
                            style={{ fontSize: "15px" }}
                          >
                            {item.sn_}
                          </div>

                          <div
                            className="DAT_ES_Content_DevideTable_Left_ItemList_Item_Info"
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
                          className="DAT_ES_Content_DevideTable_Left_ItemList_Item_Shortcut"
                          //   id={item.id_ + "_dot"}
                          onClick={() => setCreateState(true)}
                        >
                          <IoMdAdd size={20} color="grey" />
                        </div>

                        <div
                          className="DAT_ES_Content_DevideTable_Left_ItemList_Item_More"
                          //   id={item.id_ + "_function"}
                          style={{ display: "none" }}
                          //   onMouseLeave={(e) => handleShowFunction(e)}
                        >
                          {/* {item.id_ === 1 ? (
                        <></>
                      ) : ( */}
                          <div
                            className="DAT_ES_Content_DevideTable_Left_ItemList_Item_More_Delete"
                            //   id={item.id_}
                            //   onClick={() => props.groupDelState()}
                          >
                            <IoTrashOutline size={18} />
                          </div>
                          {/* )} */}
                          <div
                            className="DAT_ES_Content_DevideTable_Left_ItemList_Item_More_Edit"
                            style={{ right: "40px" }}
                            // id={item.id_}
                            // onClick={(e) => handleEditGroup(e)}
                          >
                            <FiEdit size={18} />
                          </div>

                          <div
                            className="DAT_ES_Content_DevideTable_Left_ItemList_Item_More_Add"
                            // onClick={() => props.addState()}
                          >
                            <AiOutlineUserAdd size={18} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="DAT_ES_Content_DevideTable_Right">
                  <div className="DAT_ES_Content_DevideTable_Right_ItemList">
                    {dataErr === undefined ? (
                      <Empty />
                    ) : (
                      <DataTable
                        className="DAT_Table_GroupRole"
                        columns={columnLog}
                        data={dataErr}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        noDataComponent={<Empty />}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {createState ? (
            <div className="DAT_PopupBG">
              <CreateErrSetting
                handleClose={handleCloseCreate}
                handleConfirm={handleConfirmCreate}
              />
            </div>
          ) : (
            <></>
          )}

          {editState ? (
            <div className="DAT_PopupBG">
              <EditErr
                type={editType}
                handleClose={handleCloseEdit}
                editVi={editVi}
                editEn={editEn}
                confirmEdit={confirmEdit}
              />
            </div>
          ) : (
            <></>
          )}

          {editNS ? (
            <div className="DAT_PopupBG">
              <ErrNameEdit
                handleClose={handleCloseEditName}
                editName={editName}
                confirmEdit={confirmEdit}
                handleConfirmEditName={handleConfirmEditName}
              />
            </div>
          ) : (
            <></>
          )}

          {removeState ? (
            <div className="DAT_PopupBG">
              <RemoveErr
                type={removeType}
                handleClose={handleCloseRemove}
                handleDel={handleDelete}
                confirmDel={confirmDelete}
              />
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          <div className="DAT_ProjectHeaderMobile">
            <div className="DAT_ProjectHeaderMobile_Top">
              {errList ? (
                <IoCaretBackOutline
                  size={40}
                  color="#0B1967"
                  onClick={() => setErrList(false)}
                />
              ) : (
                <></>
              )}
              <div className="DAT_ProjectHeaderMobile_Top_Filter">
                <CiSearch color="gray" size={20} />
                {filterType ? (
                  <input
                    type="text"
                    placeholder={dataLang.formatMessage({ id: "enterInfo" })}
                    onChange={(e) => handleFilter(e)}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={dataLang.formatMessage({ id: "enterInfo" })}
                    onChange={(e) => handleFilterDataErr(e)}
                  />
                )}
              </div>
              {errList ? (
                <button
                  className="DAT_ProjectHeaderMobile_Top_New"
                  onClick={() => setCreateState(true)}
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
              <PiUsersFour color="gray" size={25} />{" "}
              <span>{dataLang.formatMessage({ id: "errlist" })}</span>
            </div>
          </div>

          {errList ? (
            <div className="DAT_ESMobile_Content_DevideTable_Right">
              {/* <div className="DAT_ESMobile_Content_DevideTable_Right_Head">
                <IoCaretBackOutline
                  style={{ cursor: "pointer" }}
                  size={20}
                  color="white"
                  onClick={() => {
                    setErrList(false);
                    groupErrSN.value = "";
                  }}
                />
                <div>{dataLang.formatMessage({ id: "previous" })}</div>
              </div> */}
              <div className="DAT_ESMobile_Content_DevideTable_Right_ItemList">
                {dataErr === undefined ? (
                  <Empty />
                ) : (
                  <div className="DAT_ErrSetMobile">
                    {dataErr.map((item, index) => {
                      return (
                        <div key={index} className="DAT_ErrSetMobile_Content">
                          <div className="DAT_ErrSetMobile_Content_Top">
                            <div className="DAT_ErrSetMobile_Content_Top_Type">
                              {item.boxid_}
                            </div>
                            <div className="DAT_ErrSetMobile_Content_Top_Info">
                              {/* <div className="DAT_ErrSetMobile_Content_Top_Info_Name">
                                {item.name_}
                              </div> */}
                              <span
                                id={item.boxid_}
                                onClick={(e) => {
                                  setEditNS(!editNS);
                                  setEditName(item.name_);
                                  setEditarray(e.currentTarget.id);
                                }}
                              >
                                {item.name_}
                              </span>
                              <div className="DAT_ErrSetMobile_Content_Top_Info_Cause">
                                <span>
                                  {dataLang.formatMessage({ id: "cause" })}
                                </span>
                                <div className="DAT_ErrSetMobile_Content_Top_Info_Cause_Row1">
                                  <div className="DAT_ErrSetMobile_Content_Top_Info_Cause_Row1_En">
                                    En:
                                  </div>
                                  <div className="DAT_ErrSetMobile_Content_Top_Info_Cause_Row1_Vi">
                                    Vi:
                                  </div>
                                </div>

                                <div>
                                  {item.cause_.map((cause, i) => {
                                    return (
                                      <div
                                        key={i}
                                        className="DAT_ErrSetMobile_Content_Top_Info_Cause_Row2"
                                      >
                                        <div className="DAT_ErrSetMobile_Content_Top_Info_Cause_Row2_Vi">
                                          {i + 1}. {`${cause.vi}`}
                                        </div>
                                        <div className="DAT_ErrSetMobile_Content_Top_Info_Cause_Row2_En">
                                          {`${cause.en}`}
                                        </div>
                                        <div className="DAT_ErrSetMobile_Content_Top_Info_Cause_Row2_Func">
                                          <FiEdit
                                            size={14}
                                            style={{ cursor: "pointer" }}
                                            id={`${item.boxid_}-${cause.id}-EDITCAUSE`}
                                            onClick={(e) => handleEdit(e)}
                                          />
                                          <IoTrashOutline
                                            size={16}
                                            style={{ cursor: "pointer" }}
                                            id={`${item.boxid_}_${cause.id}_REMOVECAUSE`}
                                            onClick={(e) => handleDelete(e)}
                                          />
                                          {parseInt(i) ===
                                          item.cause_.length - 1 ? (
                                            <IoIosAddCircleOutline
                                              size={16}
                                              style={{ cursor: "pointer" }}
                                              id={`${item.boxid_}-ADDCAUSE`}
                                              onClick={(e) => handleAdd(e)}
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
                              <div className="DAT_ErrSetMobile_Content_Top_Info_Solution">
                                <span>
                                  {dataLang.formatMessage({ id: "solution" })}
                                </span>
                                <div className="DAT_ErrSetMobile_Content_Top_Info_Solution_Row1">
                                  <div className="DAT_ErrSetMobile_Content_Top_Info_Solution_Row1_En">
                                    En:
                                  </div>
                                  <div className="DAT_ErrSetMobile_Content_Top_Info_Solution_Row1_Vi">
                                    Vi:
                                  </div>
                                </div>

                                <div>
                                  {item.solution_.map((solution, i) => {
                                    return (
                                      <div
                                        key={i}
                                        className="DAT_ErrSetMobile_Content_Top_Info_Solution_Row2"
                                      >
                                        <div className="DAT_ErrSetMobile_Content_Top_Info_Solution_Row2_Vi">
                                          {i + 1}. {`${solution.vi}`}
                                        </div>
                                        <div className="DAT_ErrSetMobile_Content_Top_Info_Solution_Row2_En">
                                          {`${solution.en}`}
                                        </div>
                                        <div className="DAT_ErrSetMobile_Content_Top_Info_Solution_Row2_Func">
                                          <FiEdit
                                            size={14}
                                            id={`${item.boxid_}-${solution.id}-EDITSOLUTION`}
                                            onClick={(e) => handleEdit(e)}
                                          />
                                          <IoTrashOutline
                                            size={16}
                                            id={`${item.boxid_}_${solution.id}_REMOVESOLUTION`}
                                            onClick={(e) => handleDelete(e)}
                                          />
                                          {parseInt(i) ===
                                          item.solution_.length - 1 ? (
                                            <IoIosAddCircleOutline
                                              size={16}
                                              style={{ cursor: "pointer" }}
                                              id={`${item.boxid_}-ADDSOLUTION`}
                                              onClick={(e) => handleAdd(e)}
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

                          <div className="DAT_ErrSetMobile_Content_Bottom">
                            <div
                              className="DAT_ErrSetMobile_Content_Bottom_Item"
                              id={item.boxid_}
                              onClick={(e) => {
                                handleDelete(e);
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
              className="DAT_ESMobile_Content_DevideTable_Left"
              style={{ width: "100% !important", height: "100%" }}
            >
              {/* <div className="DAT_ESMobile_Content_DevideTable_Left_Head">
                {dataLang.formatMessage({ id: "errorsetting" })}
              </div> */}

              <div className="DAT_ESMobile_Content_DevideTable_Left_ItemList">
                {dataGateway.map((item, index) => (
                  <div
                    className="DAT_ESMobile_Content_DevideTable_Left_ItemList_Item"
                    key={index}
                    id={item.sn_}
                    style={{
                      backgroundColor:
                        groupErrSN.value === item.sn_
                          ? "rgb(207, 207, 207, 0.4)"
                          : "",
                    }}
                    onClick={(e) => {
                      handleChangeGroup(e);
                      setErrList(true);
                      setFilterType(false);
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <div
                        className="DAT_ESMobile_Content_DevideTable_Left_ItemList_Item_ID"
                        style={{ fontSize: "16px" }}
                      >
                        {item.id_}
                      </div>
                      <div className="DAT_ESMobile_Content_DevideTable_Left_ItemList_Item_Container">
                        <div
                          className="DAT_ESMobile_Content_DevideTable_Left_ItemList_Item_Container_Name"
                          style={{ fontSize: "16px" }}
                        >
                          {item.sn_}
                        </div>

                        <div
                          className="DAT_ESMobile_Content_DevideTable_Left_ItemList_Item_Container_Info"
                          style={{
                            fontSize: "14px",
                            color: "grey",
                            minWidth: "100px",
                          }}
                        >
                          {item.name_}
                        </div>
                      </div>
                    </div>
                    <div
                      className="DAT_ESMobile_Content_DevideTable_Left_ItemList_Item_Shortcut"
                      // id={item.sn_ + "_dot"}
                      onClick={(e) => {
                        groupErrSN.value = item.sn_;
                      }}
                    >
                      {/* <IoMdMore size={20} color="grey" /> */}
                    </div>

                    <div
                      className="DAT_ESMobile_Content_DevideTable_Left_ItemList_Item_More"
                      // id={item.id_ + "_function"}
                      style={{ display: "none" }}
                      // onMouseLeave={(e) => handleShowFunction(e)}
                    >
                      {item.id_ === 1 ? (
                        <></>
                      ) : (
                        <div
                          className="DAT_ESMobile_Content_DevideTable_Left_ItemList_Item_More_Delete"
                          id={item.sn_}
                          // onClick={() => props.groupDelState()}
                        >
                          <IoTrashOutline size={18} />
                        </div>
                      )}
                      <div
                        className="DAT_ESMobile_Content_DevideTable_Left_ItemList_Item_More_Edit"
                        style={{ right: "40px" }}
                        id={item.sn_}
                        // onClick={(e) => handleEditGroup(e)}
                      >
                        <FiEdit size={18} />
                      </div>

                      <div
                        className="DAT_ESMobile_Content_DevideTable_Left_ItemList_Item_More_Add"
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

          {editNS ? (
            <div className="DAT_PopupBGMobile">
              <ErrNameEdit
                handleClose={handleCloseEditName}
                editName={editName}
                confirmEdit={confirmEdit}
                handleConfirmEditName={handleConfirmEditName}
              />
            </div>
          ) : (
            <></>
          )}

          {createState ? (
            <div className="DAT_PopupBGMobile">
              <CreateErrSetting
                handleClose={handleCloseCreate}
                handleConfirm={handleConfirmCreate}
              />
            </div>
          ) : (
            <></>
          )}

          {editState ? (
            <div className="DAT_PopupBGMobile">
              <EditErr
                type={editType}
                handleClose={handleCloseEdit}
                editVi={editVi}
                editEn={editEn}
                confirmEdit={confirmEdit}
              />
            </div>
          ) : (
            <></>
          )}

          {removeState ? (
            <div className="DAT_PopupBGMobile">
              <RemoveErr
                type={removeType}
                handleClose={handleCloseRemove}
                handleDel={handleDelete}
                confirmDel={confirmDelete}
              />
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
}
