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
import { IoAddOutline, IoCaretBackOutline, IoTrashOutline } from 'react-icons/io5';
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
import { isBrowser } from 'react-device-detect';
import { AiOutlineAppstoreAdd } from 'react-icons/ai';
import PopupMonitor from './PopupMonitor';


export const device = signal([]);
export const deviceData = signal([]);
export const deviceCurrent = signal(0);


function Device(props) {
    const dataLang = useIntl();
    // const [device, setDevice] = useState([]);

    const { toolDispatch } = useContext(ToolContext);
    const { currentID, settingDispatch } = useContext(SettingContext);
    const [popupState, setPopupState] = useState(false);
    const [popupMonitor, setPopupMonitor] = useState(false);
    const [popupType, setPopupType] = useState("");
    const [dev, setDev] = useState({});
    const [monitor, setMonitor] = useState({});
    const [monitorList, setMonitorList] = useState(false);



    const handleEdit = (e) => {
        let arr = e.currentTarget.id.split("_");
        console.log(arr)
        let index = device.value.findIndex((data) => data.id_ == arr[0]);
        setDev(device.value[index]);
        setPopupState(true);
        setPopupType(arr[1]);

    }

    const handleEditMonitor = (e) => {
        let arr = e.currentTarget.id.split("_");
        console.log(arr)
        let index = deviceData.value.findIndex((data) => data.id_ == arr[0]);
        setMonitor(deviceData.value[index]);
        setPopupMonitor(true);
        setPopupType(arr[1]);
    }
    const handleAddMonitor = (e) => {
        console.log(deviceCurrent.value);
        setMonitor([]);
        setPopupMonitor(true);
        setPopupType('add');
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

        // console.log(currentID)
        const getGateway = async () => {
            let res = await callApi("post", host.DATA + "/getLogger", {
                plantid: props.data.plantid_,

            })
            // console.log(res)
            if (res.status) {
                // setDevice(res.data)
                device.value = res.data
            }
        }

        getGateway()

    }, [])

    const handleClosePopup = () => {
        setPopupState(false);
    };

    const handleCloseMonitor = () => {
        setPopupMonitor(false);
    };



    const handleShowInfo = (e) => {
        let arr = e.currentTarget.id.split("_");
        console.log(arr);
        deviceCurrent.value = arr[0]
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

            {isBrowser
                ? <>
                    <div className="DAT_Screen"  >
                        <div className='DAT_Screen_main' >
                            {device.value.map((data, i) => {
                                return (
                                    <div className="DAT_Screen_main_item" key={i} style={{ backgroundColor: Number(data.id_) === Number(deviceCurrent.value) ? 'rgb(175, 175, 175,.5)' : 'rgb(250, 250, 250)' }}   >
                                        <div className='DAT_Screen_main_item_content'  >
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
                                                            id={`${data.id_}_edit`}
                                                            onClick={(e) => { handleEdit(e); popupState.close(); }}

                                                        >
                                                            <FiEdit size={14} />
                                                            &nbsp;
                                                            {dataLang.formatMessage({ id: "edit" })}
                                                        </MenuItem>
                                                        <MenuItem
                                                            id={`${data.id_}_delete`}
                                                            onClick={(e) => { handleEdit(e); popupState.close(); }}
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
                            <div className='DAT_Screen_sub_add'>
                                {/* <button>{dataLang.formatMessage({ id: "add" })}</button> */}
                                <div>
                                    {dataLang.formatMessage({ id: 'monitorlist' })}
                                </div>
                                {deviceCurrent.value === 0
                                    ? <></>
                                    : <AiOutlineAppstoreAdd size={25} style={{ cursor: "pointer" }} onClick={() => { handleAddMonitor() }} />
                                }
                            </div>
                            <div className='DAT_Screen_sub_list' >
                                {deviceData.value.map((data, i) => {
                                    return (
                                        <div className="DAT_Screen_sub_list_item" key={i}  >
                                            <div className='DAT_Screen_sub_list_item_content' >
                                                <div className='DAT_Screen_sub_list_item_content_name' id={`${data.id_}_SCREEN`} onClick={(e) => handleScreen(e)} >
                                                    <div className='DAT_Screen_sub_list_item_content_name_icon' ><FiMonitor size={30} /></div> &nbsp; <div className='DAT_Screen_sub_list_item_content_name_text' >{data.name_}</div>
                                                </div>
                                            </div>
                                            <div className='DAT_Screen_sub_list_item_modify' >
                                                <FiEdit
                                                    size={16}
                                                    color='gray'
                                                    style={{ cursor: 'pointer' }}
                                                    id={`${data.id_}_edit`}
                                                    onClick={(e) => { handleEditMonitor(e) }}
                                                />
                                                <RiDeleteBin6Line
                                                    size={16}
                                                    color='red'
                                                    style={{ cursor: 'pointer' }}
                                                    id={`${data.id_}_delete`}
                                                    onClick={(e) => { handleEditMonitor(e) }}
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
                        <Popup handleClose={handleClosePopup} popupType={popupType} type={"device"} data={dev} plant={props.data} />
                    </div>
                    <div className="DAT_PopupBG"
                        style={{ display: popupMonitor ? "block" : "none" }}
                    >
                        <PopupMonitor handleClose={handleCloseMonitor} popupType={popupType} type={"monitor"} monitor={monitor} plant={props.data} />
                    </div>
                </>
                : <>
                    {monitorList

                        ? <div className="DAT_ScreenMobile">
                            <div className="DAT_ScreenMobile_Tit">
                                <IoCaretBackOutline
                                    size={20}
                                    color="white"
                                    onClick={() => setMonitorList(false)}
                                />
                                {dataLang.formatMessage({ id: 'monitorlist' })}
                                <IoAddOutline
                                    size={20}
                                    color="white"
                                    onClick={() => { handleAddMonitor() }} 
                                />
                            </div>
                            <div className='DAT_ScreenMobile_sub'>
                                <div className='DAT_ScreenMobile_sub_list'>
                                    {deviceData.value.map((data, i) => {
                                        return (
                                            <div className="DAT_ScreenMobile_sub_list_item" key={i}>
                                               <div className='DAT_ScreenMobile_sub_list_item_content_name' id={`${data.id_}_SCREEN`} onClick={(e) => handleScreen(e)} >
                                                    <div className='DAT_ScreenMobile_sub_list_item_content_name_icon' ><FiMonitor size={30} /></div> &nbsp; <div className='DAT_ScreenMobile_sub_list_item_content_name_text' >{data.name_}</div>
                                                </div>
                                                <div className='DAT_ScreenMobile_sub_list_item_modify'>
                                                    <FiEdit
                                                        size={16}
                                                        color='gray'
                                                        style={{ cursor: 'pointer' }}
                                                        id={`${data.id_}_edit`}
                                                        onClick={(e) => { handleEditMonitor(e) }}
                                                    />
                                                    <RiDeleteBin6Line
                                                        size={16}
                                                        color='red'
                                                        style={{ cursor: 'pointer' }}
                                                        id={`${data.id_}_delete`}
                                                        onClick={(e) => { handleEditMonitor(e) }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        :
                        <div className="DAT_ScreenMobile">
                            <div className="DAT_ScreenMobile_Tit">
                                {dataLang.formatMessage({ id: 'devicelist' })}
                                <IoAddOutline
                                    size={20}
                                    color="white"
                                    onClick={() => props.popupGateway()}
                                />
                            </div>
                            <div className="DAT_ScreenMobile_main">
                                {device.value.map((data, i) => {
                                    return (
                                        <div className="DAT_ScreenMobile_main_item" key={i}    >
                                            <div className='DAT_ScreenMobile_main_item_content' >
                                                <div className='DAT_ScreenMobile_main_item_content_name'
                                                    id={`${data.id_}_${data.sn_}`}
                                                    onClick={(e) => { handleShowInfo(e); setMonitorList(true) }}
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

                                                <PopupState variant="popper" popupId="demo-popup-popper">
                                                    {(popupState) => (<div className="DAT_TableEdit">
                                                        <IoMdMore size={20}   {...bindToggle(popupState)} />
                                                        <Menu {...bindMenu(popupState)}>

                                                            <MenuItem
                                                                id={`${data.id_}_edit`}
                                                                onClick={(e) => { handleEdit(e); popupState.close(); }}

                                                            >
                                                                <FiEdit size={14} />
                                                                &nbsp;
                                                                {dataLang.formatMessage({ id: "edit" })}
                                                            </MenuItem>
                                                            <MenuItem
                                                                id={`${data.id_}_delete`}
                                                                onClick={(e) => { handleEdit(e); popupState.close(); }}
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

                    <div className="DAT_PopupBG"
                        style={{ display: popupState ? "block" : "none" }}
                    >
                        <Popup handleClose={handleClosePopup} popupType={popupType} type={"device"} data={dev} plant={props.data} />
                    </div>
                    <div className="DAT_PopupBG"
                        style={{ display: popupMonitor ? "block" : "none" }}
                    >
                        <PopupMonitor handleClose={handleCloseMonitor} popupType={popupType} type={"monitor"} monitor={monitor} plant={props.data} />
                    </div>
                </>

            }

        </>
    );
}

export default Device;