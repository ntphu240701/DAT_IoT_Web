/* eslint no-eval: 0 */
/* eslint no-unused-vars: "off"*/
import React, { useContext, useEffect, useState } from "react"
import "./Tool.scss";
// import { action } from "../Control/Action";
import { useIntl } from "react-intl";
// import { AlertContext } from "../Context/AlertContext";
import axios from "axios";
import { host } from "../Lang/Contant";
import { useSelector } from "react-redux";



export default function Input(props) {
    const token = useSelector((state) => state.admin.token)
    const dataLang = useIntl();
    // const { alertDispatch } = useContext(AlertContext);
    const [data, setData] = useState(props.data)
    const [setting, setSetting] = useState(props.setting)


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
            return({ret:1,msg:"cloud err"})
        }

    
    }





    useEffect(function () {
        setData(props.data)
    }, [props.data])

    useEffect(function () {
        setSetting(props.setting)
    }, [props.setting])

    const handleInput = async(e) => {


        if (e.key === "Enter") {
        let InputArray = e.currentTarget.id.split("_");
        console.log(InputArray)
        //console.log(setting)

        var get = document.getElementById(InputArray[0]+"_"+InputArray[1]+"_"+InputArray[2]+"_GETINP")

        if (get.value !== '') {
                var INP = get.value
                setting[InputArray[2]].curr = get.value
                //settingDispatch({ type: "LOAD_STATE", payload: false })
                // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_19" }), show: 'block' }))
                console.log("INP: ", parseInt(eval(setting[InputArray[2]].cal)), setting[InputArray[2]].register)

                const res = await remotecloud('{"deviceCode": "' + InputArray[0] + '","address":"' + setting[InputArray[2]].register + '","value":"' + parseInt(eval(setting[InputArray[2]].cal)) + '"}', token);

                console.log(res)
                if(res.ret === 0){
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
                    axios.post(host.DEVICE + "/setRegisterDevice", { id: InputArray[0], data: JSON.stringify(setting), tab: InputArray[1] }, { secure: true, reconnect: true }).then(
                        function (res) {
                            if (res.data) {
                                console.log("save dat true")
                            } else {
                                console.log("save dat false")
                            }
                        })
                }else{
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
                }
                console.log(setting[InputArray[2]])

        } else {
                //console.log("không được để trống")
                // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_1" }), show: 'block' }))
        }
    }
        


    }

    const handlegetnum = (numstring) => {
        try {
            var x = eval(numstring)
            return parseFloat(x).toFixed(1);
        } catch (e) {
            return 0;
        }
    }


    return (
        <div className="DAT_Input" style={{height:props.height+"px", width:props.width+"px"}}>
            <input  style={{width:(props.width-2)+"px", height:(props.height-2)+"px", textAlign:setting[props.id]?.align || "left", fontSize:setting[props.id]?.size+"px" ?? "12px", color:setting[props.id]?.color || "black", backgroundColor:setting[props.id]?.bgcolor ?? "white", borderRadius:setting[props.id]?.radius+"px" || "0px", border:"solid 3px "+setting[props.id]?.bordercolor ?? "solid 3px black" }} type="number" id={props.deviceid + "_" + props.tab + "_" + props.id + "_GETINP"}  name="Value" placeholder={handlegetnum(setting[props.id]?.curr || 0)} onKeyDownCapture={(e) => { handleInput(e)}}></input>
            {/* <button className="DAT_Input-save" style={{height:props.height+"px"}}   id={props.deviceid + "_" + props.tab + "_" + props.id + "_INP"} onClick={(e) => { handleInput(e) }}>Lưu</button> */}
        </div>
    )
}