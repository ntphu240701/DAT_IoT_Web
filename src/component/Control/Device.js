import React, { useContext, useEffect, useState } from 'react';
import { callApi } from '../Api/Api';
import { host } from '../Lang/Contant';
import { FaCheckCircle, FaRegFileAlt } from 'react-icons/fa';
import { useIntl } from 'react-intl';
import DataTable from 'react-data-table-component';
import { ruleInfor } from '../../App';
import { MdOutlineError } from 'react-icons/md';
import { IoMdMore } from 'react-icons/io';
import { Menu, MenuItem, snackbarClasses } from '@mui/material';
import PopupState, { bindMenu, bindToggle } from 'material-ui-popup-state';
import { FiEdit, FiMonitor } from 'react-icons/fi';
import { IoAddOutline, IoTrashOutline } from 'react-icons/io5';
import { get, last, snakeCase } from 'lodash';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { signal } from '@preact/signals-react';
import { ToolContext } from '../Context/ToolContext';
import { OverviewContext } from '../Context/OverviewContext';
import { SettingContext } from '../Context/SettingContext';
import { current } from '@reduxjs/toolkit';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Popup from './Popup';
import { isBrowser } from 'react-device-detect';

const setting = signal({
    status: false,
    currentID: 0,
    lasttab: 0,
    tab: 0,
    defaulttab: 0,
    name: "",
});


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


function Device(props) {
    const dataLang = useIntl();
    const [device, setDevice] = useState([]);
    const [deviceData, setDeviceData] = useState([]);
    const [deviceState, setDeviceState] = useState(false);
    const [popupState, setPopupState] = useState(false);
    const [popupType, setPopupType] = useState("");
    const [deviceSN, setDeviceSN] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const [deviceDes, setDeviceDes] = useState("");
    const [monitorList, setMonitorList] = useState(false);

    const paginationComponentOptions = {
        rowsPerPageText: dataLang.formatMessage({ id: "row" }),
        rangeSeparatorText: dataLang.formatMessage({ id: "to" }),
        selectAllRowsItem: true,
        selectAllRowsItemText: dataLang.formatMessage({ id: "showAll" }),
    };
    const columnDevice = [
        {
            name: dataLang.formatMessage({ id: "ordinalNumber" }),
            selector: (row, i) => i + 1,
            sortable: true,
            width: "80px",
            style: {
                justifyContent: "center",
            },
        },
        {
            name: dataLang.formatMessage({ id: "name" }),
            selector: (row) => (
                <div className="DAT_Table">
                    <div
                        className="DAT_Table_Infor"
                        id={`${row.id_}_${row.sn_}`}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => handleShowInfo(e)}
                    >
                        <div className="DAT_Table_Infor_Name">{row.name_}</div>
                        <div className="DAT_Table_Infor_Addr">{row.sn_}</div>
                    </div>
                </div>
            ),
            sortable: true,
            width: "330px",
            style: {
                justifyContent: "left !important",
            },
        },
        {
            name: dataLang.formatMessage({ id: "description" }),
            selector: (row) => row.description_,
            minWidth: "350px",
        },
        {
            name: dataLang.formatMessage({ id: "type" }),
            selector: (row) => row.type_,
            width: "120px",
        },
        {
            name: dataLang.formatMessage({ id: "status" }),
            selector: (row) => (
                <>
                    {row.state_ === 1 ? (
                        <FaCheckCircle size={20} color="green" />
                    ) : (
                        <MdOutlineError size={22} color="red" />
                    )}
                </>
            ),
            width: "110px",
        },
        {
            name: dataLang.formatMessage({ id: "edits" }),
            selector: (row) => (
                <>
                    {ruleInfor.value.setting.device.modify === true ||
                        ruleInfor.value.setting.device.delete === true ? (
                        // <div className="DAT_TableEdit">
                        //   <span
                        //     id={row.psn + "_MORE"}
                        //     onClick={(e) => handleModify(e, "block")}
                        //   >
                        //     <IoMdMore size={20} />
                        //   </span>
                        // </div>
                        <PopupState variant="popper" popupId="demo-popup-popper">
                            {(popupState) => (<div className="DAT_TableEdit">
                                <IoMdMore size={20}   {...bindToggle(popupState)} />
                                <Menu {...bindMenu(popupState)}>
                                    {ruleInfor.value.setting.device.modify === true ?
                                        <MenuItem id={`${row.psn}-${row.pname}-edit`} onClick={(e) => { handleEdit(e); popupState.close() }}>
                                            <FiEdit size={14} />&nbsp;
                                            {dataLang.formatMessage({ id: "change" })}
                                        </MenuItem>
                                        : <></>
                                    }
                                    {ruleInfor.value.setting.device.remove === true ?
                                        <MenuItem id={row.psn + "_" + row.pplantid + "_remove"} onClick={(e) => { handleRemove(e); popupState.close() }}>
                                            <IoTrashOutline size={16} />
                                            &nbsp;
                                            {dataLang.formatMessage({ id: "delete" })}
                                        </MenuItem>
                                        : <></>}


                                </Menu>
                            </div>)}
                        </PopupState>
                    ) : (
                        <div></div>
                    )}
                    {/* <div
                className="DAT_ModifyBox"
                id={row.psn + "_Modify"}
                style={{ display: "none", marginTop: "2px" }}
                onMouseLeave={(e) => handleModify(e, "none")}
              >
                <div
                  className="DAT_ModifyBox_Fix"
                  id={`${row.psn}-${row.pname}-edit`}
                  onClick={(e) => handleEdit(e)}
                >
                  <FiEdit size={14} />
                  &nbsp;
                  {dataLang.formatMessage({ id: "change" })}
                </div>
                <div
                  className="DAT_ModifyBox_Remove"
                  id={row.psn + "_" + row.pplantid + "_remove"}
                  onClick={(e) => handleRemove(e)}
                >
                  <IoTrashOutline size={16} />
                  &nbsp;
                  {dataLang.formatMessage({ id: "delete" })}
                </div>
              </div> */}
                </>
            ),
            width: "103px",
        },
    ];

    const handleEdit = (e) => {

    }

    const handleRemove = (e) => {

    }

    const handleScreen = (e) => {
        // console.log(e.currentTarget.id);
        let arr = e.currentTarget.id.split("_");
        // console.log(arr);
        const getScreen = async () => {
            let res = await callApi("post", host.DATA + "/getLoggerScreen", {
                id: arr[1],
            });
            console.log(res);
            if (res.status) {

            }
        }
        getScreen()
    }

    useEffect(() => {
        const getGateway = async () => {
            let res = await callApi("post", host.DATA + "/getLogger", {
                plantid: props.data.plantid_,

            })
            console.log(res)
            if (res.status) {
                setDevice(res.data)
            }
        }

        getGateway()

    }, [])


    const handleShowInfo = (e) => {
        let arr = e.currentTarget.id.split("_");
        console.log(arr);
        const getList = async () => {

            let res = await callApi("post", host.DATA + "/getLoggerData", {
                id: arr[0],
                sn: arr[1],
            });
            console.log(res);
            if (res.status) {
                setDeviceData(res.data)
                // setDeviceState(true)
            }
        };
        getList();
    }

    const handleClosePopup = () => {
        setPopupState(false);
    };

    const ExpandedComponent = ({ data }) => {
        const [list, setList] = useState([]);
        useEffect(() => {
            const getList = async () => {
                // console.log(data);
                let res = await callApi("post", host.DATA + "/getLoggerData", {
                    id: data.id_,
                    sn: data.sn_,
                });
                console.log(res);
                if (res.status) {

                    setList(res.data);
                }
            };
            getList();
        }, []);

        return (
            <>
                {list.map((data, i) => {
                    return (
                        <div className="DAT_TableGroup" key={i}>
                            <div className="DAT_TableGroup_ID">{i + 1}</div>
                            <div
                                className="DAT_TableGroup_Name"
                                id={`${data.sn_}_${data.id_}_SCREEN`}
                                onClick={(e) => {
                                    handleScreen(e);
                                }}
                            >
                                {data.name_}
                            </div>
                            <div className="DAT_TableGroup_Edit"><BsThreeDotsVertical /></div>
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <>
            {/* <div style={{ width: "100%", padding: "10px", boxSizing: "border-box", backgroundColor: "white" }}>
                <DataTable
                    className="DAT_Table_Container"
                    columns={columnDevice}
                    data={device}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    // expandableRows
                    // expandableRowsComponent={ExpandedComponent}
                    noDataComponent={<Empty />}
                />
            </div> */}

            {isBrowser
                ?
                <>
                    <div className="DAT_Screen">
                        <div className='DAT_Screen_main' >
                            {device.map((data, i) => {
                                return (
                                    <div className="DAT_Screen_main_item" key={i}    >
                                        <div className='DAT_Screen_main_item_content' >
                                            <div className='DAT_Screen_main_item_content_name'
                                                id={`${data.id_}_${data.sn_}`}
                                                onClick={(e) => handleShowInfo(e)}
                                            >
                                                {data.name_}
                                                &nbsp;
                                                {data.state_ === 1 ? <FaCheckCircle size={16} color="green" /> : <MdOutlineError size={16} color="red" />}
                                            </div>
                                            <div className='DAT_Screen_main_item_content_sn'>{data.sn_}</div>
                                        </div>

                                        <div className='DAT_Screen_main_item_des' >
                                            <div>{data.description_}</div>
                                        </div>

                                        <div className='DAT_Screen_main_item_modify'>
                                            {/* <BsThreeDotsVertical /> */}
                                            <PopupState variant="popper" popupId="demo-popup-popper">
                                                {(popupState) => (<div className="DAT_TableEdit">
                                                    <IoMdMore size={20}   {...bindToggle(popupState)} />
                                                    <Menu {...bindMenu(popupState)}>
                                                        <MenuItem
                                                            onClick={(e) => { setPopupState(true); setPopupType("add"); popupState.close() }}
                                                        >
                                                            <IoAddOutline size={16} />
                                                            &nbsp;
                                                            {dataLang.formatMessage({ id: "add" })}
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={(e) => { setPopupState(true); setPopupType("edit"); popupState.close() }}
                                                        // setDeviceName(data.name_); setDeviceDes(data.description_);
                                                        >
                                                            <FiEdit size={14} />
                                                            &nbsp;
                                                            {dataLang.formatMessage({ id: "edit" })}
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={(e) => { setPopupState(true); setPopupType("delete"); setDeviceSN(data.sn_); popupState.close() }}
                                                        >
                                                            <IoTrashOutline size={16} />
                                                            &nbsp;
                                                            {dataLang.formatMessage({ id: "delete" })}
                                                        </MenuItem>
                                                    </Menu>
                                                </div>)}
                                            </PopupState>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className='DAT_Screen_sub' >
                            <div className='DAT_Screen_sub_list'>
                                {deviceData.map((data, i) => {
                                    return (
                                        <div className="DAT_Screen_sub_list_item" key={i}  >
                                            <div className='DAT_Screen_sub_list_item_content' >
                                                {/* <div className='DAT_Screen_sub_list_item_content_ava'><FiMonitor size={20} /></div> */}
                                                <div className='DAT_Screen_sub_list_item_content_name' >
                                                    <FiMonitor size={20} /> &nbsp; {data.name_}
                                                </div>
                                            </div>
                                            <div className='DAT_Screen_sub_list_item_modify' >
                                                <FiEdit
                                                    size={16}
                                                    color='gray'
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={(e) => { setPopupState(true); setPopupType("edit-monitor") }}
                                                />
                                                <RiDeleteBin6Line
                                                    size={16}
                                                    color='red'
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={(e) => { setPopupState(true); setPopupType("delete-monitor"); setDeviceSN(data.name_) }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                        </div>
                    </div>

                    <div className="DAT_PopupBG"
                        style={{ display: popupState ? "block" : "none" }}
                    >
                        <Popup handleClose={handleClosePopup} popupType={popupType} type={"device"} name={deviceSN} devname={deviceName} devdes={deviceDes} />
                    </div>
                </>
                :
                <>
                    {monitorList
                        ? <></>
                        :
                        <div className="DAT_ScreenMobile">
                            <div className="DAT_ScreenMobile_Tit">Danh sách thiết bị</div>
                            <div className="DAT_ScreenMobile_main">
                                {device.map((data, i) => {
                                    return (
                                        <div className="DAT_ScreenMobile_main_item" key={i}    >
                                            <div className='DAT_ScreenMobile_main_item_content' >
                                                <div className='DAT_ScreenMobile_main_item_content_name'
                                                    id={`${data.id_}_${data.sn_}`}
                                                    onClick={(e) => handleShowInfo(e)}
                                                >
                                                    {data.name_}
                                                    &nbsp;
                                                    {data.state_ === 1 ? <FaCheckCircle size={16} color="green" /> : <MdOutlineError size={16} color="red" />}
                                                </div>
                                                <div className='DAT_ScreenMobile_main_item_content_sn'>{data.sn_}</div>
                                            </div>

                                            <div className='DAT_ScreenMobile_main_item_des' >
                                                <div>{data.description_}</div>
                                            </div>

                                            <div className='DAT_ScreenMobile_main_item_modify'>
                                                {/* <BsThreeDotsVertical /> */}
                                                <PopupState variant="popper" popupId="demo-popup-popper">
                                                    {(popupState) => (<div className="DAT_TableEdit">
                                                        <IoMdMore size={20}   {...bindToggle(popupState)} />
                                                        <Menu {...bindMenu(popupState)}>
                                                            <MenuItem
                                                                onClick={(e) => { setPopupState(true); setPopupType("add"); popupState.close() }}
                                                            >
                                                                <IoAddOutline size={16} />
                                                                &nbsp;
                                                                {dataLang.formatMessage({ id: "add" })}
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={(e) => { setPopupState(true); setPopupType("edit"); popupState.close() }}
                                                            // setDeviceName(data.name_); setDeviceDes(data.description_);
                                                            >
                                                                <FiEdit size={14} />
                                                                &nbsp;
                                                                {dataLang.formatMessage({ id: "edit" })}
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={(e) => { setPopupState(true); setPopupType("delete"); setDeviceSN(data.sn_); popupState.close() }}
                                                            >
                                                                <IoTrashOutline size={16} />
                                                                &nbsp;
                                                                {dataLang.formatMessage({ id: "delete" })}
                                                            </MenuItem>
                                                        </Menu>
                                                    </div>)}
                                                </PopupState>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    }
                </>
            }
        </>
    );
}

export default Device;