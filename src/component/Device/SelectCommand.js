import React from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import PopupState, { bindHover, bindPopper } from "material-ui-popup-state";
import { Fade, Paper, Popper, Typography } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function SelectCommand(props) {
    const dataLang = useIntl();

    const commandName = [
        // AC Start Voltage
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACStartHighVoltage' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACStartHighVoltage' }),
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACStartLowVoltage' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACStartLowVoltage' }),
        },
        //AC Start Frequency 
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACStartHighFrequency' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACStartHighFrequency' }),
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACStartLowFrequency' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACStartLowFrequency' }),
        },
        //AC Start Volt level 1 
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt1' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt1' }),
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt1' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt1' }),
        },
        //AC Start Volt 1 Time
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt1Time' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt1Time' }),
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt1Time' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt1Time' }),
        },
        //AC Start Volt 2
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt2' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt2' }),
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt2' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt2' }),
        },
        //AC Start Volt 2 Time
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt2Time' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderVolt2Time' }),
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt2Time' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverVolt2Time' }),
        },
        //AC Frequency level 1
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq1' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq1' }),
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq1' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq1' }),
        },
        //AC Frequency 1 Time
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq1Time' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq1Time' }),
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq1Time' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq1Time' }),
        },
        //AC Frequency level 2
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq2' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq2' }),
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq2' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq2' }),
        },
        //AC Frequency 2 Time
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq2Time' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACUnderFreq2Time' }),
        },
        {
            name: dataLang.formatMessage({ id: 'read' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq2Time' }),
        },
        {
            name: dataLang.formatMessage({ id: 'Set' }) + " " + dataLang.formatMessage({ id: 'ACOverFreq2Time' }),
        },
        //Other Options
        {
            name: dataLang.formatMessage({ id: 'ReadInverters' })
        },
        {
            name: dataLang.formatMessage({ id: 'SetInverters' })
        },
        {
            name: dataLang.formatMessage({ id: 'ReadCTRatio' })
        },
        {
            name: dataLang.formatMessage({ id: 'SetCTRatio' })
        },
    ];

    return (
        <div className="DAT_Info_Databox" id="SelectCommand">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'SelCommand' })}</div>
            </div>

            <div className="DAT_Info_Databox_SelectCommand">
                <div className="DAT_Info_Databox_SelectCommand_Content">
                    <div className="DAT_Info_Databox_SelectCommand_Content_Left">
                        <div className="DAT_Info_Databox_SelectCommand_Content_Left_Item">
                            <div className="DAT_Info_Databox_SelectCommand_Content_Left_Item_Tit">
                                {dataLang.formatMessage({ id: 'InverterStatus' })}:
                            </div>
                            <div className="DAT_Info_Databox_SelectCommand_Content_Left_Item_Content">
                                <select>
                                    <option defaultValue={1} style={{ display: "none" }}>{dataLang.formatMessage({ id: 'PleaseSel' })}</option>
                                    {commandName.map((item, i) => {
                                        return <option key={i}>{item.name}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="DAT_Info_Databox_SelectCommand_Foot">
                    <div className="DAT_Info_Databox_SelectCommand_Foot_Item">
                        <span>
                            {dataLang.formatMessage({ id: 'Timeout' })}:
                        </span>
                        <input />
                        <span>{dataLang.formatMessage({ id: 'Timeout' })}</span>

                        <div className="DAT_Home_Overview-Main-Percent-Icon" style={{ cursor: 'pointer' }}>
                            <PopupState variant="popper" popupId="demo-popup-popper">
                                {(popupState) => (
                                    <div style={{ cursor: 'pointer' }}>
                                        <HelpOutlineIcon
                                            {...bindHover(popupState)}
                                            color="action"
                                            fontSize="9px" />
                                        <Popper {...bindPopper(popupState)} transition >
                                            {({ TransitionProps }) => (
                                                <Fade {...TransitionProps} timeout={350}>
                                                    <Paper sx={{ width: '400px', marginLeft: '200px', p: 2 }}>
                                                        <Typography sx={{ fontSize: '12px', textAlign: 'justify', marginBottom: 1.7 }}>
                                                            {dataLang.formatMessage({ id: 'timeoutInfo' })}
                                                        </Typography>
                                                    </Paper>
                                                </Fade>
                                            )}
                                        </Popper>
                                    </div>
                                )}
                            </PopupState>
                        </div>
                    </div>
                    <button>{dataLang.formatMessage({ id: 'SendCommand' })}</button>
                </div>
            </div >
        </div >
    );
}
