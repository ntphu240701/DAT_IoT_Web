import React, { useEffect, useState } from 'react';
import { mode, plantState } from './Signal';
import { IoAddOutline, IoClose } from 'react-icons/io5';
import { FaCheckCircle } from 'react-icons/fa';
import { MdOutlineError } from 'react-icons/md';
import { useIntl } from 'react-intl';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { signal } from '@preact/signals-react';
import { ruleInfor } from '../../App';
import AddGateway from './AddGateway';
import Device, { deviceData } from './Device';
import { isBrowser } from 'react-device-detect';
import Dashboard from './Dashboard';

const viewNav = signal(false);
const viewStateNav = signal([false, false]);

export default function Project(props) {
    const dataLang = useIntl();
    const [gatewayState, setGatewayState] = useState(false);
    const [modeState, setModeState] = useState(false);
    // const [mode, setMode] = useState('Dashboard');

    const popup_state = {
        pre: { transform: "rotate(0deg)", transition: "0.5s", color: "rgba(11, 25, 103)", },
        new: { transform: "rotate(90deg)", transition: "0.5s", color: "rgba(11, 25, 103)", },
    };

    const handlePopup = (state) => {
        const popup = document.getElementById("Popup_");
        popup.style.transform = popup_state[state].transform;
        popup.style.transition = popup_state[state].transition;
        popup.style.color = popup_state[state].color;
    };

    const handleOutsideView = (e) => {
        setTimeout(() => {
            if (viewStateNav.value[1] == false) {
                viewNav.value = false;
                viewStateNav.value = [false, false];

            }
            clearTimeout();
        }, 15000);
    };

    const handleView = (e) => {
        var id = e.currentTarget.id;
        mode.value = id
        setModeState(false);
    };

    const handlePopupGateway = () => {
        setGatewayState(true);
        setModeState(false);
    };

    const handleCloseGateway = () => {
        setGatewayState(false);
    };

    useEffect(() => {
        if (viewNav.value === false) {
            setModeState(false);
        }

        return () => {
            mode.value = "dashboard";
        };
    }, [viewNav.value]);

    return (
        <>
            {isBrowser
                ? <div className="DAT_ProjectData">
                    <div className="DAT_ProjectData_Header">
                        <div className="DAT_ProjectData_Header_Left">
                            <div className="DAT_ProjectData_Header_Left_Top"
                                style={{ fontSize: 22 }}
                            >
                                <img src={props.data.img ? props.data.img : "/dat_picture/solar_panel.png"} alt="" />
                                <div className="DAT_ProjectData_Header_Left_Top_Content">
                                    <div className="DAT_ProjectData_Header_Left_Top_Content_Name">
                                        {props.data.name_}
                                        {props.data.state_ === 1 ? <FaCheckCircle size={20} color="green" /> : <MdOutlineError size={20} color="red" />}
                                    </div>
                                    {/* <div className="DAT_ProjectData_Header_Left_Top_Content_Addr">
                                        {props.data.addr_}
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        <div className="DAT_ProjectData_Header_Right">
                            <div className="DAT_ProjectData_Header_Right_More">
                                <BsThreeDotsVertical
                                    size={20}
                                    color="#9e9e9e"
                                    onClick={() => {
                                        setModeState(!modeState);
                                        viewNav.value = true;
                                        viewStateNav.value = [true, true];
                                    }}
                                    onMouseLeave={() => handleOutsideView()}
                                />
                            </div>

                            {ruleInfor.value.setting.device.add
                                ? props.data.shared_ === 1
                                    ? <></>
                                    : <div className="DAT_ProjectData_Header_Right_Add"
                                        style={{ display: mode.value === "device" ? "block" : "none" }}
                                    >
                                        <button
                                            id="add"
                                            onClick={() => {
                                                setGatewayState(true);
                                                setModeState(false);
                                            }}
                                        >
                                            <IoAddOutline size={25} color="white" />
                                        </button>
                                    </div>
                                : <></>
                            }

                            <div className="DAT_ProjectData_Header_Right_Close"
                                onClick={() => {
                                    plantState.value = "default";
                                    setModeState(false);
                                }}
                            >
                                <IoClose
                                    size={25} color="rgba(11, 25, 103)"
                                    id="Popup_"
                                    onMouseEnter={(e) => handlePopup("new")}
                                    onMouseLeave={(e) => handlePopup("pre")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="DAT_ProjectData_Content">
                        {(() => {
                            switch (mode.value) {
                                case "device":
                                    return (
                                        <Device data={props.data} />
                                    );
                                case "overview":
                                    return (
                                        <div>
                                            Tổng quan
                                        </div>
                                    );
                                default:
                                    return (
                                        <div>
                                            <Dashboard data={props.data} />
                                        </div>
                                    );
                            }
                        })()}
                    </div>

                    {modeState
                        ? <div className="DAT_ProjectDataDrop"
                            style={{ display: viewNav.value ? "block" : "none" }}
                            onMouseEnter={() => {
                                viewStateNav.value = [true, true];
                            }}
                            onMouseLeave={() => {
                                viewNav.value = false;
                                viewStateNav.value = [false, false];
                            }}
                        >
                            {(() => {
                                switch (mode.value) {
                                    case "device":
                                        return (
                                            <>
                                                <div className="DAT_ProjectDataDrop_Item"
                                                    id="dashboard"
                                                    onClick={(e) => handleView(e)}
                                                >
                                                    {dataLang.formatMessage({ id: "dashboard" })}
                                                </div>

                                                <div className="DAT_ProjectDataDrop_Item"
                                                    id="view"
                                                    onClick={(e) => handleView(e)}
                                                >
                                                    {dataLang.formatMessage({ id: "view" })}
                                                </div>
                                            </>
                                        );
                                    case "overview":
                                        return (
                                            <>
                                                <div className="DAT_ProjectDataDrop_Item"
                                                    id="dashboard"
                                                    onClick={(e) => handleView(e)}
                                                >
                                                    {dataLang.formatMessage({ id: "dashboard" })}
                                                </div>

                                                <div className="DAT_ProjectDataDrop_Item"
                                                    id="device"
                                                    onClick={(e) => handleView(e)}
                                                >
                                                    {dataLang.formatMessage({ id: "device" })}
                                                </div>
                                            </>
                                        );
                                    default:
                                        return (
                                            <>
                                                <div className="DAT_ProjectDataDrop_Item"
                                                    id="view"
                                                    onClick={(e) => handleView(e)}
                                                >
                                                    {dataLang.formatMessage({ id: "view" })}
                                                </div>

                                                <div className="DAT_ProjectDataDrop_Item"
                                                    id="device"
                                                    onClick={(e) => handleView(e)}
                                                >
                                                    {dataLang.formatMessage({ id: "device" })}
                                                </div>
                                            </>
                                        );
                                }
                            })()}
                        </div>
                        : <></>
                    }

                    {gatewayState
                        ? <div className="DAT_AddGatewayPopup">
                            <AddGateway
                                data={props.data}
                                // handleInvt={handleInvt}
                                handleClose={handleCloseGateway}
                            />
                        </div>
                        : <></>
                    }
                </div>
                : <div className="DAT_ProjectDataMobile">
                    <div className="DAT_ProjectDataMobile_Header">
                        <div className="DAT_ProjectDataMobile_Header_Left">
                            <div className="DAT_ProjectDataMobile_Header_Left_Top"
                                style={{ fontSize: 22 }}
                            >
                                <img src={props.data.img ? props.data.img : "/dat_picture/solar_panel.png"} alt="" />
                                <div className="DAT_ProjectDataMobile_Header_Left_Top_Content">
                                    <div className="DAT_ProjectDataMobile_Header_Left_Top_Content_Name">
                                        {props.data.name_}
                                    </div>
                                    <div>
                                        {props.data.state_ === 1 ? <FaCheckCircle size={16} color="green" /> : <MdOutlineError size={16} color="red" />}
                                    </div>
                                    {/* <div className="DAT_ProjectDataMobile_Header_Left_Top_Content_Addr">
                                    {props.data.addr_}
                                </div> */}
                                </div>
                            </div>
                        </div>

                        <div className="DAT_ProjectDataMobile_Header_Right">
                            <div className="DAT_ProjectDataMobile_Header_Right_More">
                                <BsThreeDotsVertical
                                    size={20}
                                    color="#9e9e9e"
                                    onClick={() => {
                                        setModeState(!modeState);
                                        viewNav.value = true;
                                        viewStateNav.value = [true, true];
                                    }}
                                    onMouseLeave={() => handleOutsideView()}
                                />
                            </div>

                            {/* {ruleInfor.value.setting.device.add
                                ? props.data.shared_ === 1
                                    ? <></>
                                    : <div className="DAT_ProjectDataMobile_Header_Right_Add"
                                        style={{ display: mode.value === "device" ? "block" : "none" }}
                                    >
                                        <button
                                            id="add"
                                            onClick={() => {
                                                setGatewayState(true);
                                                setModeState(false);
                                            }}
                                        >
                                            <IoAddOutline size={25} color="white" />
                                        </button>
                                    </div>
                                : <></>
                            } */}

                            <div className="DAT_ProjectDataMobile_Header_Right_Close"
                                onClick={() => {
                                    plantState.value = "default";
                                    setModeState(false);
                                }}
                            >
                                <IoClose
                                    size={25} color="rgba(11, 25, 103)"
                                    id="Popup_"
                                    onMouseEnter={(e) => handlePopup("new")}
                                    onMouseLeave={(e) => handlePopup("pre")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="DAT_ProjectDataMobile_Content">
                        {(() => {
                            switch (mode.value) {
                                case "device":
                                    return (
                                        <Device data={props.data} popupGateway={handlePopupGateway} />
                                    );
                                case "overview":
                                    return (
                                        <div>
                                            Tổng quan
                                        </div>
                                    );
                                default:
                                    return (
                                        <div>
                                            <Dashboard data={props.data} />
                                        </div>
                                    );
                            }
                        })()}
                    </div>

                    {modeState
                        ? <div className="DAT_ProjectDataDropMobile"
                            style={{ display: viewNav.value ? "block" : "none" }}
                            onMouseEnter={() => {
                                viewStateNav.value = [true, true];
                            }}
                            onMouseLeave={() => {
                                viewNav.value = false;
                                viewStateNav.value = [false, false];
                            }}

                        >
                            {(() => {
                                switch (mode) {
                                    case "device":
                                        return (
                                            <>
                                                <div className="DAT_ProjectDataDropMobile_Item"
                                                    id="dashboard"
                                                    onClick={(e) => handleView(e)}
                                                >
                                                    {dataLang.formatMessage({ id: "dashboard" })}
                                                </div>

                                                <div className="DAT_ProjectDataDropMobile_Item"
                                                    id="view"
                                                    onClick={(e) => handleView(e)}
                                                >
                                                    {dataLang.formatMessage({ id: "view" })}
                                                </div>
                                            </>
                                        );
                                    case "overview":
                                        return (
                                            <>
                                                <div className="DAT_ProjectDataDropMobile_Item"
                                                    id="dashboard"
                                                    onClick={(e) => handleView(e)}
                                                >
                                                    {dataLang.formatMessage({ id: "dashboard" })}
                                                </div>

                                                <div className="DAT_ProjectDataDropMobile_Item"
                                                    id="device"
                                                    onClick={(e) => handleView(e)}
                                                >
                                                    {dataLang.formatMessage({ id: "device" })}
                                                </div>
                                            </>
                                        );
                                    default:
                                        return (
                                            <>
                                                <div className="DAT_ProjectDataDropMobile_Item"
                                                    id="view"
                                                    onClick={(e) => handleView(e)}
                                                >
                                                    {dataLang.formatMessage({ id: "view" })}
                                                </div>

                                                <div className="DAT_ProjectDataDropMobile_Item"
                                                    id="device"
                                                    onClick={(e) => handleView(e)}
                                                >
                                                    {dataLang.formatMessage({ id: "device" })}
                                                </div>
                                            </>
                                        );
                                }
                            })()}
                        </div>
                        : <></>
                    }

                    {gatewayState
                        ? <div className="DAT_AddGatewayPopup">
                            <AddGateway
                                data={props.data}
                                // handleInvt={handleInvt}
                                handleClose={handleCloseGateway}
                            />
                        </div>
                        : <></>
                    }
                </div>
            }
        </>
    );
}
