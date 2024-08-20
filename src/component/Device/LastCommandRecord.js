import React from 'react';
import "./Device.scss";

import { useIntl } from 'react-intl';
import { isMobile } from '../Navigation/Navigation';

import { FaCheckCircle } from 'react-icons/fa';

export default function LastCommandRecord(props) {
    const dataLang = useIntl();

    return (
        <div className="DAT_Info_Databox" id="LastCommandRecord">
            <div className="DAT_Info_Databox_Title">
                <div className="DAT_Info_Databox_Title_Left">{dataLang.formatMessage({ id: 'LastCommandRecord' })}</div>
            </div>

            <div className="DAT_Info_Databox_LastCommandRecord">
                <div className="DAT_Info_Databox_LastCommandRecord_Content">
                    <div className="DAT_Info_Databox_LastCommandRecord_Content_Left">
                        <div className="DAT_Info_Databox_LastCommandRecord_Content_Left_Item" style={{ marginBottom: isMobile.value ? "8px" : "24px" }}>
                            <div className="DAT_Info_Databox_LastCommandRecord_Content_Left_Item_Tit">
                                {dataLang.formatMessage({ id: 'InverterStatus' })}:
                            </div>
                            <div className="DAT_Info_Databox_LastCommandRecord_Content_Left_Item_Content">
                                {dataLang.formatMessage({ id: 'ReadACStartHighVolt' })}
                            </div>
                        </div>
                        <div className="DAT_Info_Databox_LastCommandRecord_Content_Left_Item">
                            <div className="DAT_Info_Databox_LastCommandRecord_Content_Left_Item_Tit">
                                {dataLang.formatMessage({ id: 'ReadResult' })}:
                            </div>
                            <div className="DAT_Info_Databox_LastCommandRecord_Content_Left_Item_Content">
                                264.5 V
                            </div>
                        </div>
                    </div>
                    <div className="DAT_Info_Databox_LastCommandRecord_Content_Center">
                        <div className="DAT_Info_Databox_LastCommandRecord_Content_Center_Item" style={{ marginBottom: isMobile.value ? "8px" : "24px" }}>
                            <div className="DAT_Info_Databox_LastCommandRecord_Content_Center_Item_Tit">
                                {dataLang.formatMessage({ id: 'CommandType' })}:
                            </div>
                            <div className="DAT_Info_Databox_LastCommandRecord_Content_Center_Item_Content">
                                {dataLang.formatMessage({ id: 'read' })}
                            </div>
                        </div>
                        <div className="DAT_Info_Databox_LastCommandRecord_Content_Center_Item">
                            <div className="DAT_Info_Databox_LastCommandRecord_Content_Center_Item_Tit">
                                {dataLang.formatMessage({ id: 'SendTime' })}:
                            </div>
                            <div className="DAT_Info_Databox_LastCommandRecord_Content_Center_Item_Content">
                                2024/03/25 10:30:49 UTC+07:00
                            </div>
                        </div>
                    </div>
                    <div className="DAT_Info_Databox_LastCommandRecord_Content_Right">
                        <div className="DAT_Info_Databox_LastCommandRecord_Content_Right_Item" style={{ marginBottom: isMobile.value ? "8px" : "24px" }}>
                            <div className="DAT_Info_Databox_LastCommandRecord_Content_Right_Item_Tit">
                                {dataLang.formatMessage({ id: 'CommandState' })}:
                            </div>
                            <div className="DAT_Info_Databox_LastCommandRecord_Content_Right_Item_Content">
                                <FaCheckCircle size={16} color="green" />
                                <span style={{ color: "green" }}>
                                    {dataLang.formatMessage({ id: 'success' })}
                                </span>
                            </div>
                        </div>
                        <div className="DAT_Info_Databox_LastCommandRecord_Content_Right_Item">
                            <div className="DAT_Info_Databox_LastCommandRecord_Content_Right_Item_Tit">
                                {dataLang.formatMessage({ id: 'FeedbackTime' })}:
                            </div>
                            <div className="DAT_Info_Databox_LastCommandRecord_Content_Right_Item_Content">
                                2024/03/25 10:30:50 UTC+07:00
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
