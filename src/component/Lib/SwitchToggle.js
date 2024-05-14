import React, { useContext, useEffect, useState } from "react";
import "./Tool.scss";
// import { AlertContext } from "../Context/AlertContext";
import { useIntl } from "react-intl";
import axios from "axios";
// import { action } from "../Control/Action";
import { host } from "../Lang/Contant";
import { useSelector } from "react-redux";
import { Token } from "../../App";
import { callApi } from "../Api/Api";
import { alertDispatch } from "../Alert/Alert";

export default function SwitchToggle(props) {
  const token = useSelector((state) => state.admin.token)

  const dataLang = useIntl();
  // const { alertDispatch } = useContext(AlertContext);
  const [data, setData] = useState(props.data)
  const [setting, setSetting] = useState(props.setting)
  const [check, setCheck] = useState("off");


  const remotecloud = async (data, token) => {

    var reqData = {
      "data": data,
      "token": token
    };

    try {

      const response = await axios({
        url: host.RMCLOUD,
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: Object.keys(reqData).map(function (key) { return encodeURIComponent(key) + '=' + encodeURIComponent(reqData[key]) }).join('&'),
      });

      return response.data

    }

    catch (e) {
      return ({ ret: 1, msg: "cloud err" })
    }


  }

  useEffect(function () {
    setData(props.data)
    //console.log(setting)
  }, [props.data])

  useEffect(function () {
    setSetting(props.setting)
    //console.log("switch", setting)
  }, [props.setting])

  useEffect(function () {
    //console.log(setting[props.id].stt)
    if (setting[props.id].stt === 'on') {
      setCheck("on");
    } else {
      setCheck("off");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])






  const handleChange = async (e) => {

    var NUMB;
    if (check === "off") {
      setCheck("on");
      setting[props.id].stt = 'on'
      NUMB = setting[props.id].on
    } else {
      setCheck("off");
      setting[props.id].stt = 'off'
      NUMB = setting[props.id].off
    }
    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_19" }), show: 'block' }))
    //console.log(e.currentTarget.id);
    console.log(setting[props.id]);

    const res = await remotecloud('{"deviceCode": "' + props.sn + '","address":"' + setting[props.id].register + '","value":"' + parseInt(eval(setting[props.id].cal)) + '"}', Token.value.token);

    console.log(res)
    if (res.ret === 0) {
      // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
      
      let res = await callApi('post', host.DATA + "/updateRegisterScreen", { id: props.deviceid, setting: setting, tab: props.tab })
      // console.log(res)
      if (res.status) {
        // console.log("save dat true")
        alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
      }
    } else {
      // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
    }
  };

  return (
    <div className="DAT_SwitchToggle" style={{ width: props.width + "px", height: props.height + "px" }}>
      <form
        className="DAT_SwitchToggle-Toggle"
        id={check}
        onClick={(e) => handleChange(e)}
        style={{
          width: props.width + "px",
          height: props.height + "px",
          borderRadius: setting[props.id].borderradius + "px",
          overflow: "hidden",
          backgroundColor: check === "on" ? setting[props.id].bgon : setting[props.id].bgoff,
          transition: "0.2s ease-in-out",
          border:
            "solid " + setting[props.id].border + "px " + setting[props.id].bordercolor,
          borderColor: setting[props.id].bordercolor,
        }}
      >
        <div
          className="DAT_SwitchToggle-Toggle-Icon"
          style={{
            width: parseFloat(props.width) / 2 + "px",
            height: props.height + "px",
            backgroundColor: setting[props.id].bordercolor,
            borderradius: setting[props.id].borderradiusicon + "px",
            transform:
              check === "off" ? "translateX(0px)" : "translateX( 100% )",
            transition: "0.5s",
          }}
        ></div>
        {(check === "on")
          ? <label
            className="DAT_SwitchToggle-Toggle-Labelchoice1"
            style={{ color: setting[props.id].txtcoloron, fontSize: setting[props.id].textsize + "px" }}
          >
            {setting[props.id].texton}
          </label>
          : <label
            className="DAT_SwitchToggle-Toggle-Labelchoice2"
            style={{ color: setting[props.id].txtcoloroff, fontSize: setting[props.id].textsize + "px" }}
          >
            {setting[props.id].textoff}
          </label>
        }
      </form>
      {/* transform: translateY(-50%);
        transition: 0.9s; */}
    </div>
  );
}
