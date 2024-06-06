import React, { useContext, useEffect, useState } from 'react';
import { callApi } from '../Api/Api';
import { host } from '../Lang/Contant';
import { IoClose, IoSettings } from 'react-icons/io5';
import { ToolContext } from '../Context/ToolContext';
import { SettingContext } from '../Context/SettingContext';
import { FaArrowTurnUp } from 'react-icons/fa6';
import { MdScreenshotMonitor } from 'react-icons/md';
import { PiArrowElbowDownRightFill } from 'react-icons/pi';
import { HiArrowUturnLeft } from 'react-icons/hi2';
import { userInfor } from '../../App';
import { useSelector } from 'react-redux';
import { alertDispatch } from '../Alert/Alert';
import { useIntl } from 'react-intl';
import { CiEdit } from 'react-icons/ci';


function Widget(props) {
    const dataLang = useIntl();
    const user = useSelector((state) => state.admin.usr)
    const [config, setConfig] = useState('default');
    const [widget, setWidget] = useState({
        loggerdataid_: "",
        screenstate_: 0,
        sn_: "",
        usr_: user,
    });
    const [screenview, setScreenview] = useState({});

    const [myselect, setMyselect] = useState('0_0');

    const [deviceData, setDeviceData] = useState([]);
    const popup_state = {
        pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
        new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" }
    }

    useEffect(() => {
        console.log(props.loggerdata, props.widget);
        if (props.widget) {
            setWidget(props.widget)
        }
        if (props.loggerdata) {
            setScreenview(props.loggerdata)
        }

    }, [props.loggerdata, props.widget])


    const handlePopup = (state) => {
        const popup = document.getElementById("Popup-")
        popup.style.transform = popup_state[state].transform;
        popup.style.transition = popup_state[state].transition;
        popup.style.color = popup_state[state].color;
    }

    const handleDevice = async (e) => {
        let arr = e.currentTarget.id.split("_");

        let newwidget = widget
        newwidget = {
            ...newwidget,
            sn_: arr[1],
        }
        console.log(newwidget);
        setWidget(newwidget)

        setMyselect(e.currentTarget.id)
        setConfig('default');

    }

    const handleScreen = async (e) => {
        console.log(myselect);
        let arr = myselect.split("_");
        let res = await callApi("post", host.DATA + "/getLoggerData", {
            id: arr[0],
            sn: arr[1],
        });
        console.log(res);
        if (res.status) {
            // deviceData.value = res.data
            setDeviceData(res.data)
            setConfig('screen');
            // setDeviceState(true)
        }
    }

    const handleSetScreen = async (e) => {
        let arr = e.currentTarget.id.split("_");
        console.log(arr);


        let newwidget = {
            ...widget,
            loggerdataid_: arr[0],
        }

        console.log(newwidget);
        setWidget(newwidget)
        let res = await callApi("post", host.DATA + "/getLoggerDataUnit", {
            loggerdataid: newwidget.loggerdataid_,
            sn: newwidget.sn_,
        });
        console.log(res);
        if (res.status) {
            setScreenview(res.data)
        }


        setConfig('default');
    }

    const handleSave = async (e) => {

        if (widget.loggerdataid_ && widget.sn_) {
            console.log(widget, screenview);

            let res = await callApi("post", host.DATA + "/updateWidget", {
                usr: widget.usr_,
                sn: widget.sn_,
                loggerdataid: widget.loggerdataid_,
                screenstate: widget.screenstate_,
            })
            console.log(res);
            if (res.status) {
                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                props.handleClose(); setConfig('default')
            }

        } else {
            alertDispatch(dataLang.formatMessage({ id: "alert_22" }));
        }
    }




    // useEffect(() => {
    //     console.log(screen, currentID, currentSN, currentName, lasttab, defaulttab) 
    // },[currentName])

    return (
        <div className='DAT_WidgetContainer'>
            <div className='DAT_WidgetContainer_title' >
                <div className="DAT_WidgetContainer_title_name">{dataLang.formatMessage({ id: "utilities" })}</div>

                <div className="DAT_WidgetContainer_title_close"
                    onClick={() => { props.handleClose(); setConfig('default') }}
                    id="Popup-"
                    onMouseEnter={(e) => handlePopup("new")}
                    onMouseLeave={(e) => handlePopup("pre")}
                >
                    <IoClose size={25} color='white' />
                </div>

            </div>
            {(() => {
                switch (config) {
                    case "device":
                        return <>
                            <div className='DAT_WidgetContainer_titlesub'><span>{dataLang.formatMessage({ id: 'devicelist' })}</span> <HiArrowUturnLeft style={{ cursor: "pointer" }} onClick={() => setConfig('default')} /></div>
                            <div className='DAT_WidgetContainer_list'>
                                {props.logger.map((data, index) => {
                                    return (
                                        <div className='DAT_WidgetContainer_list_item' key={index}>
                                            <div className='DAT_WidgetContainer_list_item_index' >{index + 1}</div>
                                            <div className='DAT_WidgetContainer_list_item_sn' id={data.id_ + "_" + data.sn_} onClick={(e) => handleDevice(e)} >{data.name_}</div>
                                            <div className='DAT_WidgetContainer_list_item_sn' id={data.id_ + "_" + data.sn_} onClick={(e) => handleDevice(e)}  >{data.sn_}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    case "screen":
                        return <>
                            <div className='DAT_WidgetContainer_titlesub' >{dataLang.formatMessage({ id: 'monitorlist' })} <HiArrowUturnLeft style={{ cursor: "pointer" }} onClick={() => setConfig('default')} /></div>
                            <div className='DAT_WidgetContainer_list'>
                                {deviceData.map((data, index) => {
                                    return (
                                        <div className='DAT_WidgetContainer_list_item' key={index}>
                                            <div className='DAT_WidgetContainer_list_item_index' >{index + 1}</div>
                                            <div className='DAT_WidgetContainer_list_item_sn' id={`${data.id_}_SCREEN`} onClick={(e) => handleSetScreen(e)} >{data.name_}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    default:
                        return <>
                            <div className='DAT_WidgetContainer_data' >
                                <div className='DAT_WidgetContainer_data_sn'><span>SN: {widget.sn_}</span> <CiEdit size={20} color='gray' style={{ cursor: 'pointer' }} onClick={() => setConfig('device')} /></div>
                                <div className='DAT_WidgetContainer_data_screen'>
                                    <div className='DAT_WidgetContainer_data_screen_arrow' ><PiArrowElbowDownRightFill size={50} color='rgba(11, 25, 103' /></div>
                                    <div className='DAT_WidgetContainer_data_screen_name'>
                                        <MdScreenshotMonitor size={60} color='rgba(11, 25, 103)' />
                                        <div className='DAT_WidgetContainer_data_screen_name_config' > <div className='DAT_WidgetContainer_data_screen_name_config_name'>{screenview.name_}</div><CiEdit size={20} color='gray' style={{ cursor: 'pointer' }} onClick={(e) => handleScreen(e)} /></div>
                                    </div>
                                </div>

                            </div>
                            <div className='DAT_WidgetContainer_status'>
                                <input
                                    type='checkbox'
                                    style={{ cursor: 'pointer' }}
                                    checked={widget.screenstate_ === 1 ? true : false}
                                    onChange={() => setWidget({ ...widget, screenstate_: widget.screenstate_ === 1 ? 0 : 1 })}
                                />
                           
                                <div style={{ color: widget.screenstate_  ? 'green' : 'red' }} >{dataLang.formatMessage({ id: "on" })}</div>
                                 
                            </div>
                        </>
                }
            })()}

            {config === 'default'
                ? <div className='DAT_WidgetContainer_btn'>
                    <button onClick={() => handleSave()} >{dataLang.formatMessage({ id: "save" })}</button>
                </div>
                : <></>}
        </div>
    );
}

export default Widget;