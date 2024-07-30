/* eslint no-unused-vars: "off"*/
import React, { useContext, useEffect, useState } from "react"
import "./Tool.scss";
import { host } from "../Lang/Contant";
import { callApi } from "../Api/Api";
import { ToolContext } from "../Context/ToolContext";
import { SettingContext } from "../Context/SettingContext";
import { plantState } from "../Control/Signal";




export default function Note(props) {
    const [data, setData] = useState(props.data)
    const [setting, setSetting] = useState(props.setting)
    const { toolDispatch } = useContext(ToolContext);
    const { settingDispatch } = useContext(SettingContext);
    useEffect(function () {
        setData(props.data)
    }, [props.data])

    useEffect(function () {
        setSetting(props.setting)
    }, [props.setting])


    const hexToRgbA = (hex, opacity) => {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
        }
        throw new Error('Bad Hex');
    }

    const handleScreen = async () => {


        if (setting?.link) {
            let res = await callApi("post", host.DATA + "/getLoggerDataUnit", {
                loggerdataid: setting?.loggerdataid || 0,
                sn: setting.deviceid,
            });
            console.log(res);

            if (res.status) {
                let res2 = await callApi("post", host.DATA + "/getLoggerScreen", {
                    id: res.data.id_,
                });
                console.log(res2);
                if (res2.status) {


                    settingDispatch({
                        type: "LOAD_SCREEN",
                        payload: {
                            currentID: res.data.id_,
                            currentSN: res.data.sn_,
                            currentName: res.data.name_,
                            screen: res2.data,
                        },
                    });

                    settingDispatch({
                        type: "LOAD_LASTTAB",
                        payload: parseInt(res.data.tab_),
                    });
                    settingDispatch({
                        type: "LOAD_DEFAULT",
                        payload: parseInt(res.data.defaulttab_),
                    });

                    res2.data.map((data2, index) => {
                        toolDispatch({
                            type: "LOAD_DEVICE",
                            payload: {
                                tab: data2.tab_,
                                visual: data2.data_.data,
                                setting: data2.setting_,
                                name: data2.name_,
                                lastid: data2.data_.id,
                            },
                        });
                    });


                    plantState.value = "toollist";


                }


            }
        }
    }


    return (
        <div className="DAT_Note" onClick={() => handleScreen()} style={{ whiteSpace: 'pre-line', height: props.height + "px", alignItems: setting?.justify || "center", justifyContent: setting?.align || "left", fontSize: setting?.size + "px" || "16px", color: setting?.color || "black", backgroundColor: hexToRgbA(setting?.bgcolor || "#FFFFFF", setting?.opacity || "1"), border: `solid  ${setting?.borderwidth || 1}px ${setting?.bordercolor || "black"}`, textAlign: "justify", borderRadius: setting?.radius + "px" || "10px" }}>
            {setting?.text || "Note"}
        </div>
    )
}