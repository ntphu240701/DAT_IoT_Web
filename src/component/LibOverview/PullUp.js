import React, { Component, useContext, useEffect, useState } from "react";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { useSelector } from "react-redux";
import { partnerInfor, ruleInfor, userInfor } from "../../App";
import { useIntl } from "react-intl";
import PopupState, { bindMenu } from "material-ui-popup-state";
import { IoMdClose, IoMdMore } from "react-icons/io";
import { Menu } from "@mui/material";
import DataTable from "react-data-table-component";
import { Empty } from "../Control/Auto";
import { set } from "lodash";
import { plantobjauto } from "../Control/Signal";
import WarnPopup from "../Warn/WarnPopup";
import { SettingContext } from "../Context/SettingContext";
import { isBrowser } from "react-device-detect";
import { GoAlert } from "react-icons/go";
import { AiOutlineAlert } from "react-icons/ai";

function PullUp(props) {
    const { currentName } = useContext(SettingContext)
    const dataLang = useIntl();
    const usr = useSelector((state) => state.admin.usr);
    const [data, setData] = useState([]);
    const [popupState, setPopupState] = useState(false);
    const [dataMore, setDataMore] = useState({});
    const [type, setType] = useState("");
    const [inf, setInf] = useState({
        boxid: 0,
        name: "--",
        level: "warn",
        device: "",
        plant: "--",
        cause: [],
        solution: [],
    });

    const handleInfo = async (e) => {
        let temp = data.find((item) => item.boxid === e.currentTarget.id);
        console.log(temp);
        setDataMore(temp);

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
            setPopupState(true);
        }
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
                    id={row.boxid}
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
    ];

    const paginationComponentOptions = {
        rowsPerPageText: dataLang.formatMessage({ id: "row" }),
        rangeSeparatorText: dataLang.formatMessage({ id: "to" }),
        selectAllRowsItem: true,
        selectAllRowsItemText: dataLang.formatMessage({ id: "showAll" }),
    };

    const handleClosePopup = () => {
        setPopupState(false);
    };

    const popup_state = {
        pre: { transform: "rotate(0deg)", transition: "0.5s", color: "rgba(11, 25, 103)" },
        new: { transform: "rotate(90deg)", transition: "0.5s", color: "rgba(11, 25, 103)" }
    }

    const handlePopup = (state) => {
        const popup = document.getElementById("PullUp")
        popup.style.transform = popup_state[state].transform;
        popup.style.transition = popup_state[state].transition;
        popup.style.color = popup_state[state].color;
    }

    useEffect(() => {
        const getWarn = async () => {
            const warn = await callApi("post", host.DATA + "/getWarn", {
                usr: usr,
                partnerid: partnerInfor.value.partnerid,
                type: userInfor.value.type,
            });
            console.log(warn.data);
            console.log(plantobjauto.value.namewarn_);
            if (warn.status) {
                let newdb = warn.data.sort(
                    (a, b) =>
                        new Date(`${b.opendate_} ${b.opentime_}`) -
                        new Date(`${a.opendate_} ${a.opentime_}`)
                );
                if (props.type === "detail") {
                    const updatedData = newdb.map((item, index) => {
                        return {
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
                        };
                    }).filter(item => item.plantid === plantobjauto.value.plantid_ && item.name === currentName);
                    setData(updatedData);
                } else {
                    const updatedData = newdb.map((item, index) => {
                        return {
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
                        };
                    }).filter(item => item.plantid === plantobjauto.value.plantid_);
                    setData(updatedData);
                }
            }
        };
        getWarn();
    }, [plantobjauto.value.name_]);

    return (
        <div className="DAT_PullUp">
            <div className="DAT_PullUp_Box">
                <div className="DAT_PullUp_Box_Header">Danh sách lỗi

                    <div className="DAT_PullUp_Box_Header_Close"
                        onClick={() => props.handleClose()}
                        id="PullUp"
                        onMouseEnter={(e) => handlePopup("new")}
                        onMouseLeave={(e) => handlePopup("pre")} l
                    ><IoMdClose size={20} color="white" /></div>
                </div>
                {isBrowser ? (
                    <div className="DAT_PullUp_Box_Content" style={{ justifyContent: "center" }}>
                        <DataTable
                            className="DAT_Table_Container"
                            columns={columnWarn}
                            data={data}
                            pagination
                            paginationComponentOptions={paginationComponentOptions}
                            // fixedHeader={true}
                            noDataComponent={<Empty />}
                        />
                    </div>

                ) : (
                    <div className="DAT_PullUp_Box_Content"
                        style={{ height: "80%", overflow: "auto" }}>
                        {data.length !== 0 ? data.map((item, i) => {
                            return (
                                <div key={i} className="DAT_WarnMobile_Content" style={{ width: "100%" }}>
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
                                                    id: "openWarnDate",
                                                })}
                                                : {item.opendate}
                                            </div>
                                        </div>
                                        <div className="DAT_WarnMobile_Content_Bottom_Right">
                                            {/* <div
                                            className="DAT_WarnMobile_Content_Bottom_Right_Item"
                                            id={item.boxid + "_" + item.device}
                                            onClick={(e) => handleDeleteWarn(e)}
                                        >
                                            <IoTrashOutline size={16} />
                                        </div> */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                            :
                            <div className="DAT_PullUp_Box_Content"
                                style={{ height: "80%", overflow: "auto" }}>
                                <Empty />
                            </div>
                        }
                    </div>
                )}
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
    );
}

export default PullUp;
