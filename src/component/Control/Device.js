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
import Toollist from '../Lib/Toollist';
import { plantState } from './Signal';
import Popup from './Popup';

export const deviceData = signal([]);

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

    const { toolDispatch } = useContext(ToolContext);
    const { screen, settingDispatch } = useContext(SettingContext);
    const [popupState, setPopupState] = useState(false);
    const [popupType, setPopupType] = useState("");
    const [deviceSN, setDeviceSN] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const [deviceDes, setDeviceDes] = useState("");
    const [monitorList, setMonitorList] = useState(false);


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
                id: arr[0],
            });
            // console.log(res);
            if (res.status) {



                let index = deviceData.value.findIndex((data) => data.id_ == arr[0])
                console.log(res.data, arr[0], deviceData.value[index].sn_)

                settingDispatch({
                    type: "LOAD_SCREEN",
                    payload: {
                        currentID: arr[0],
                        currentSN: deviceData.value[index].sn_,
                        currentName: deviceData.value[index].name_,
                        screen: res.data,

                    },
                });

                settingDispatch({
                    type: "LOAD_LASTTAB",
                    payload: parseInt(deviceData.value[index].tab_),
                });
                settingDispatch({
                    type: "LOAD_DEFAULT",
                    payload: parseInt(deviceData.value[index].defaulttab_),
                });


                res.data.map((data, index) => {
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


                plantState.value = 'toollist';

            }
        }

        settingDispatch({ type: "RESET", payload: [] });
        getScreen()
    }

    useEffect(() => {
        const getGateway = async () => {
            let res = await callApi("post", host.DATA + "/getLogger", {
                plantid: props.data.plantid_,

            })
            // console.log(res)
            if (res.status) {
                setDevice(res.data)
            }
        }

        getGateway()

    }, [])

    const handleClosePopup = () => {
        setPopupState(false);
    };



    const handleShowInfo = (e) => {
        let arr = e.currentTarget.id.split("_");
        console.log(arr);
        const getList = async () => {

            let res = await callApi("post", host.DATA + "/getLoggerData", {
                id: arr[0],
                sn: arr[1],
            });
            // console.log(res);
            if (res.status) {
                deviceData.value = res.data

                // setDeviceState(true)
            }
        };
        getList();
    }


    return (
        <>

            <div className="DAT_Screen"  >
                <div className='DAT_Screen_main' >
                    {device.map((data, i) => {
                        return (
                            <div className="DAT_Screen_main_item" key={i}    >
                                <div className='DAT_Screen_main_item_content' >
                                    <div className='DAT_Screen_main_item_content_name' id={`${data.id_}_${data.sn_}`} onClick={(e) => handleShowInfo(e)}  >
                                        {data.name_}&nbsp;{data.state_ === 1 ? <FaCheckCircle size={16} color="green" /> : <MdOutlineError size={16} color="red" />}
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
                    <div className='DAT_Screen_sub_list' >
                        {deviceData.value.map((data, i) => {
                            return (
                                <div className="DAT_Screen_sub_list_item" key={i}  >
                                    <div className='DAT_Screen_sub_list_item_content' >
                                        <div className='DAT_Screen_sub_list_item_content_name' id={`${data.id_}_SCREEN`} onClick={(e) => handleScreen(e)} ><FiMonitor size={20} /> &nbsp; {data.name_}</div>
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
    );
}

export default Device;