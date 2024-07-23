/* eslint no-eval: 0 */
/* eslint no-unused-vars: "off"*/
/* eslint eqeqeq: 0 */
import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import "./Tool.scss"
import { ToolContext } from "../Context/ToolContext";
import { useIntl } from "react-intl";
import axios from "axios";
import { useSelector } from "react-redux";
import { host } from "../Lang/Contant";
import { signal } from "@preact/signals-react";
import { Token, socket } from '../../App'
import { From, callApi } from "../Api/Api";
import { alertDispatch } from "../Alert/Alert";
import Resizer from "react-image-file-resizer";

export const coppyState = signal(0)
export const coppyId = signal(0)
export const coppySetting = signal({})
export const coppyVisual = signal({})
const img_ = signal('')

export default function Calculate(props) {
    const dataLang = useIntl();
    const [data, setData] = useState()
    const { control, setting, visual, lastid, toolDispatch } = useContext(ToolContext)
    const [registerDATA, setRegisterDATA] = useState(setting[props.tab][control[props.tab].id]?.cal)
    const color = useRef()
    const [word, setWord] = useState(0)
    const col_ = useRef(1)
    const row_ = useRef(1)
    const [filename, setFilename] = useState('No file')


    const icon = ['Valve', 'Valve2.0', 'Area', 'Door_lock', 'Hall_lock', 'Close_inside', 'Close_outside', 'Open_inside', 'Open_outside', 'Driver', 'Fault', 'Fire', 'Lock', 'Maintenance', 'Overload', 'Fullload', 'Parallel', 'Power', 'Safety', 'Setting', 'Trapped', 'Video', 'Up', 'Down', 'Icon']
    const base = ['10', '16', '2_0', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6', '2_7', '2_8', '2_9', '2_10', '2_11', '2_12', '2_13', '2_14', '2_15']
    const arrow = ['up', 'down']
    const fill = ['true', 'false']
    const align = ['left', 'center', 'right']
    const justify = ['flex-start', 'center', 'flex-end']
    const pic = ['Valve', 'Valve2.0', 'AChau', 'DECC', 'PhucAn']
    const ori = ['horizontal', 'vertical']
    const type = ['int', 'float']
    const pwd = ['true', 'false']

    const hexToRgbA = (hex) => {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.5)';
        }
        throw new Error('Bad Hex');
    }

    const rgbaToHex = (color) => {
        if (/^rgb/.test(color)) {
            const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');

            // rgb to hex
            // eslint-disable-next-line no-bitwise
            let hex = `#${((1 << 24) + (parseInt(rgba[0], 10) << 16) + (parseInt(rgba[1], 10) << 8) + parseInt(rgba[2], 10))
                .toString(16)
                .slice(1)}`;

            // added alpha param if exists
            if (rgba[4]) {
                const alpha = Math.round(0o1 * 255);
                const hexAlpha = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();
                hex += hexAlpha;
            }

            return hex;
        }
        return color;
    };

    const cloud = async (data, token) => {

        var reqData = {
            "data": data,
            "token": token
        };

        try {

            const response = await axios({
                url: host.CLOUD,
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


    const multiledit_box = (head, data) => {
        //console.log(col_.current.value, row_.current.value)
        return (
            <>
                <div className="DAT_Calculate-cover-box">
                    <select ref={col_} >

                        {head.map((data, index) => {
                            var x = data.code.split("_")

                            return (
                                (data.code != "id")
                                    ? <option key={index} value={x[1]}  >Col {x[1]}</option>
                                    : <React.Fragment key={index}></React.Fragment>
                            )
                        })}
                    </select>
                </div>
                <div className="DAT_Calculate-cover-box">
                    <select ref={row_}>

                        {data.map((data, index) => {


                            return (

                                <option key={index} value={index}  >Row {data.id}</option>

                            )
                        })}
                    </select>
                </div>

                <div className="DAT_Calculate-cover-number">
                    <input type="text" id="table_res_val" placeholder="Read Register" ></input><button id="table_res" onClick={(e) => handleCalculate(e)}>Chọn</button>
                </div>
                <div className="DAT_Calculate-cover-number">
                    <input type="text" id="table_name" placeholder={"Name"} ></input><button id="table_name" onClick={(e) => handleCalculate(e)}>Chọn</button>
                </div>

                <div className="DAT_Calculate-cover-result">
                    <input id="table_cal_val" defaultValue={data[row_.current.value || 0]['val_' + col_.current.value || 1]}></input>
                    <button id="table_cal" onClick={(e) => handleCalculate(e)}>Xác nhận</button>
                </div>

            </>
        )
    }


    const chart = () => {
        return (
            <>
                <div className="DAT_Calculate-cover-box">
                    <button id="chart_add" onClick={(e) => handleCalculate(e)} >+</button>
                </div>
                {setting[props.tab][control[props.tab].id].dataset.map((data, index) => (
                    <div className="DAT_Calculate-cover-chart" key={index}>
                        <button className="DAT_Calculate-cover-chart-remove" value={index} id="chart_del" onClick={(e) => handleCalculate(e)}><ion-icon name="trash-outline"></ion-icon></button>

                        <div className="DAT_Calculateoverview-cover-input">
                            <span>Label</span>
                            <div className="DAT_Calculateoverview-cover-input-content">
                                <input type={type} id={`${index}_labelchart`} defaultValue={data.label} ></input>
                                <button name={"label_" + index} id="chart" onClick={(e) => handleCalculate(e)}>Xác nhận</button>
                            </div>
                        </div>


                        <div className="DAT_Calculateoverview-cover-box">

                            <span>Fill</span>
                            <select defaultValue={data.fill} name={"fill_" + index} id="chart" onChange={(e) => handleCalculate(e)}>
                                {fill.map((data, index) => (
                                    <option key={index} value={data}  >{data}</option>
                                ))}
                            </select>
                        </div>

                        <div className="DAT_Calculateoverview-cover-color">
                            <span>BG Color</span>
                            <div className="DAT_Calculateoverview-cover-color-content">

                                <input type="color" defaultValue={rgbaToHex(data.backgroundColor) || "#000000"} id={`${index}_backgroundColorchart`}></input>
                                <span style={{ color: data.backgroundColor }} >  {rgbaToHex(data.backgroundColor)} </span>
                                <button name={"backgroundColor_" + index} id="chart" onClick={(e) => handleCalculate(e)}>Xác nhận</button>
                            </div>
                        </div>

                        <div className="DAT_Calculateoverview-cover-color">
                            <span>Border Color</span>
                            <div className="DAT_Calculateoverview-cover-color-content">

                                <input type="color" defaultValue={rgbaToHex(data.borderColor) || "#000000"} id={`${index}_borderColorchart`}></input>
                                <span style={{ color: data.borderColor }} >  {rgbaToHex(data.borderColor)} </span>
                                <button name={"borderColor_" + index} id="chart" onClick={(e) => handleCalculate(e)}>Xác nhận</button>
                            </div>
                        </div>

                        <div className="DAT_Calculateoverview-cover-input">
                            <span>Read Register</span>
                            <div className="DAT_Calculateoverview-cover-input-content">
                                <input type="text" id={`${index}_readchart`} ></input>
                                <button name={"read_" + index} id="chart" onClick={(e) => handleCalculate(e)}>Xác nhận</button>
                            </div>
                        </div>


                        <div className="DAT_Calculateoverview-cover-input">
                            <span>Control</span>
                            <div className="DAT_Calculateoverview-cover-input-content">
                                <input type="text" id={`${index}_calchart`} defaultValue={data.cal} ></input>
                                <button name={"cal_" + index} id="chart" onClick={(e) => handleCalculate(e)}>Xác nhận</button>
                            </div>
                        </div>

                    </div>
                ))

                }




            </>
        )
    }


    const handleClose = (e) => {
        control[props.tab].stt = false
        control[props.tab].type = ''
        control[props.tab].id = 0
        toolDispatch({ type: "SET_CONTROL", payload: control })
    }


    const handleCopy = (e) => {

        // console.log(setting[props.tab], visual[props.tab])

        coppySetting.value = setting[props.tab][control[props.tab].id]
        coppyVisual.value = { ...visual[props.tab].find(x => x.id == control[props.tab].id) }
        coppyState.value = 1


        // coppyVisual.value = visual[props.tab][control[props.tab].id]
        // coppyVisual.value.id = coppyId.value
    }


    const handleDel = (e) => {
        var newdevice = [...visual[props.tab]] //coppy old array
        newdevice = newdevice.filter(newdevice => newdevice.id != control[props.tab].id)
        visual[props.tab] = newdevice
        //toollistDispatch({ type: "LOAD_VISUAL", payload: newdevice })
        delete setting[props.tab][control[props.tab].id]
        if (newdevice.length === 0) {
            lastid[props.tab] = 0
            //toollistDispatch({ type: "LOAD_ID", payload: 0 })
        }

        control[props.tab].stt = false
        control[props.tab].type = ''
        control[props.tab].id = 0
        toolDispatch({ type: "SET_CONTROL", payload: control })
    }

    const handleCalculate = async (e) => {
        e.preventDefault();
        var id = e.currentTarget.id
        var val = e.currentTarget.value
        var name = e.currentTarget.name
        switch (id) {
            case 'readword': //new ver
                var wordget_register = document.getElementById(`${name}_INP`)
                //console.log(wordget_register.value)
                if (wordget_register.value !== '') {
                    var word_ = document.getElementById("word_" + word)
                    word_.value = word_.value + "parseFloat(data[\"" + wordget_register.value + "\"])"
                } else {
                    //console.log("khong duoc de trong")
                    alertDispatch(dataLang.formatMessage({ id: "alert_33" }))
                }
                break;
            case 'word'://new ver
                // console.log(word)
                var word_0 = document.getElementById("word_0")
                var word_1 = document.getElementById("word_1")
                try {
                    var word_cal_0 = eval(word_0.value);
                    var word_cal_1 = eval(word_1.value);
                    if (String(word_cal_0) !== 'NaN' && String(word_cal_1) !== 'NaN') {

                        setting[props.tab] = {
                            ...setting[props.tab],
                            [control[props.tab].id]: {
                                ...setting[props.tab][control[props.tab].id],
                                cal: [word_0.value, word_1.value],
                            }
                        }

                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                    } else {
                        // console.log("Thanh gi không có trong hệ thống")
                        setting[props.tab] = {
                            ...setting[props.tab],
                            [control[props.tab].id]: {
                                ...setting[props.tab][control[props.tab].id],
                                cal: [word_0.value, word_1.value],
                            }
                        }
                        alertDispatch(dataLang.formatMessage({ id: "alert_66" }))

                    }

                } catch (error) {
                    // console.log("Thanh gi err")
                    alertDispatch(dataLang.formatMessage({ id: "alert_33" }))
                }
                break;

            case 'table_name':
                var table_name = document.getElementById("table_name")
                // console.log(col_.current.value)
                // console.log(setting[props.tab][control[props.tab].id].head)
                var table_name_head = setting[props.tab][control[props.tab].id].head
                let table_name_index = table_name_head.findIndex(item => item.code == "val_" + col_.current.value)
                table_name_head[table_name_index].name = table_name.value
                // console.log(table_name_head)
                setting[props.tab][control[props.tab].id].head = table_name_head
                break;
            case 'table_res':

                var table_res_val = document.getElementById("table_res_val")
                var table_cal_val = document.getElementById("table_cal_val")
                if (table_res_val.value !== "") {
                    table_cal_val.value += "parseFloat(data[\"" + table_res_val.value + "\"])"
                    table_res_val.value = ""
                }
                //setting[props.tab][control[props.tab].id].data[row_.current.value]['val_'+col_.current.value]
                break;
            case 'table_cal':
                var table_cal_val = document.getElementById("table_cal_val")
                try {
                    var result = eval(table_cal_val.value);

                    if (String(result) !== 'NaN') {


                        setting[props.tab][control[props.tab].id].data[row_.current.value]['val_' + col_.current.value] = table_cal_val.value
                        // toolDispatch({ type: "SET_SETTING", payload: setting })
                        // setting[props.tab][control[props.tab].id]={
                        //     ...setting[props.tab][control[props.tab].id],
                        //     data:{
                        //         ...setting[props.tab][control[props.tab].id].data,
                        //         [row_.current.value]:{
                        //             ...setting[props.tab][control[props.tab].id].data[row_.current.value],
                        //             ['val_'+col_.current.value]:table_cal_val.value
                        //         }
                        //     }
                        // }




                        // console.log(setting[props.tab][control[props.tab].id].data[row_.current.value]['val_' + col_.current.value])


                        // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_4" }), show: 'block' }))
                    } else {
                        console.log("Thanh gi không có trong hệ thống")
                        // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_8" }), show: 'block' }))


                    }

                } catch (error) {
                    console.log("Thanh gi err")
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_2" }), show: 'block' }))
                }

                break;
            case 'table_delcol':
                const table_delcolfrom = document.getElementById("table_delcol_from")
                const table_delcolto = document.getElementById("table_delcol_to")
                // console.log(table_delcolfrom.value, table_delcolto.value)
                if (parseInt(table_delcolfrom.value) < 1 ||
                    parseInt(table_delcolto.value) < 1 ||
                    parseInt(table_delcolfrom.value) > parseInt(setting[props.tab][control[props.tab].id].col) ||
                    parseInt(table_delcolto.value) > parseInt(setting[props.tab][control[props.tab].id].col) ||
                    (parseInt(table_delcolfrom.value) > parseInt(table_delcolto.value))) {
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_20" }), show: 'block' }))
                } else {

                    const label = "val_";
                    var table_delcol_newHead = setting[props.tab][control[props.tab].id].head;
                    for (let i = table_delcolfrom.value; i <= table_delcolto.value; i++) {
                        table_delcol_newHead = table_delcol_newHead.filter((newHead) => newHead.code != label + i);
                    }
                    var table_delcol_newData = setting[props.tab][control[props.tab].id].data;
                    table_delcol_newData.map((data, index) => {
                        for (let i = table_delcolfrom.value; i <= table_delcolto.value; i++) {
                            delete data["val_" + i];
                        }
                    });
                    // console.log(table_delcol_newHead, table_delcol_newData)
                    if (table_delcol_newHead.length < 2) {
                        // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_28" }), show: 'block' }))
                    } else {
                        //setting[props.tab][control[props.tab].id].head = table_delcol_newHead
                        //setting[props.tab][control[props.tab].id].data = table_delcol_newData
                        setting[props.tab] = {
                            ...setting[props.tab],
                            [control[props.tab].id]: {
                                ...setting[props.tab][control[props.tab].id],
                                head: table_delcol_newHead,
                                data: table_delcol_newData
                            }
                        }
                    }

                    //console.log(table_delcol_newHead,table_delcol_newData)




                }
                break;
            case 'table_delrow':

                const table_delrowfrom = document.getElementById("table_delrow_from")
                const table_delrowto = document.getElementById("table_delrow_to")
                //console.log(table_delrowfrom.value, table_delrowto.value)
                if (parseInt(table_delrowfrom.value) < 1 ||
                    parseInt(table_delrowto.value) < 1 ||
                    parseInt(table_delrowfrom.value) > parseInt(setting[props.tab][control[props.tab].id].col) ||
                    parseInt(table_delrowto.value) > parseInt(setting[props.tab][control[props.tab].id].col) ||
                    (parseInt(table_delrowfrom.value) > parseInt(table_delrowto.value))) {
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_20" }), show: 'block' }))
                } else {

                    var table_delrow_Data = setting[props.tab][control[props.tab].id].data;
                    table_delrow_Data = table_delrow_Data.filter((Data) => {
                        return Data.id < parseInt(table_delrowfrom.value) || Data.id > parseInt(table_delrowto.value);
                    });

                    if (table_delrow_Data.length < 1) {
                        // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_28" }), show: 'block' }))
                    } else {
                        //setting[props.tab][control[props.tab].id].data = table_delrow_Data
                        setting[props.tab] = {
                            ...setting[props.tab],
                            [control[props.tab].id]: {
                                ...setting[props.tab][control[props.tab].id],
                                data: table_delrow_Data
                            }
                        }
                        let tableIndex = visual[props.tab].findIndex(obj => obj.id == control[props.tab].id)
                        visual[props.tab][tableIndex].h = parseInt(56 + (48 * table_delrow_Data.length))
                    }

                }
                break;
            case 'table_addcol':
                var table_col = document.getElementById(val)
                var table_updatecol = parseInt(setting[props.tab][control[props.tab].id].col) + parseInt(table_col.value);
                var table_addcol_newHead = setting[props.tab][control[props.tab].id].head;
                for (var i = setting[props.tab][control[props.tab].id].col + 1; i <= table_updatecol; i++) {
                    table_addcol_newHead.push({ name: "Giá Trị " + (i - 1), code: "val_" + (i - 1) });

                }
                var table_addcol_newData = [];
                setting[props.tab][control[props.tab].id].data.map((data, index) => {
                    var x = data;
                    for (var i = setting[props.tab][control[props.tab].id].col; i < table_updatecol; i++) {
                        x["val_" + i] = 0;
                    }
                    table_addcol_newData.push(x);
                });

                // console.log(table_addcol_newHead, table_addcol_newData, table_updatecol)
                //setting[props.tab][control[props.tab].id].col = table_updatecol
                //setting[props.tab][control[props.tab].id].head = table_addcol_newHead
                //setting[props.tab][control[props.tab].id].data = table_addcol_newData
                setting[props.tab] = {
                    ...setting[props.tab],
                    [control[props.tab].id]: {
                        ...setting[props.tab][control[props.tab].id],
                        col: table_updatecol,
                        head: table_addcol_newHead,
                        data: table_addcol_newData
                    }
                }


                break;
            case 'table_addrow':
                var table_row = document.getElementById(val)
                const table_arr = [];
                const table_updateRow = parseInt(setting[props.tab][control[props.tab].id].row) + parseInt(table_row.value)

                for (let i = 0; i < table_row.value; i++) {
                    var table_newRow = {};
                    setting[props.tab][control[props.tab].id].head.map((data, index) => {
                        if (index == 0) {
                            table_newRow[data.code] = parseInt(setting[props.tab][control[props.tab].id].row) + i;
                        } else {
                            table_newRow[data.code] = 0;
                        }
                    });
                    table_arr.push(table_newRow);
                }
                let tableIndex = visual[props.tab].findIndex(obj => obj.id == control[props.tab].id)
                visual[props.tab][tableIndex].h = parseInt(parseInt(visual[props.tab][tableIndex].h) + 48 * table_row.value)

                //console.log(visual[props.tab][tableIndex].h)

                const table_newDataTable = setting[props.tab][control[props.tab].id].data.concat(table_arr);
                // console.log(table_newDataTable)

                //setting[props.tab][control[props.tab].id].row = table_updateRow
                //setting[props.tab][control[props.tab].id].data = table_newDataTable
                setting[props.tab] = {
                    ...setting[props.tab],
                    [control[props.tab].id]: {
                        ...setting[props.tab][control[props.tab].id],
                        row: table_updateRow,
                        data: table_newDataTable
                    }
                }

                break;


            case 'chart_del': // new ver
                if (setting[props.tab][control[props.tab].id].dataset.length > 1) {
                    var newdevice = [...setting[props.tab][control[props.tab].id].dataset]
                    newdevice.splice(e.currentTarget.value, 1)


                    newdevice = newdevice.filter(newdevice => newdevice.label != setting[props.tab][control[props.tab].id].dataset[val].label)
                    setting[props.tab][control[props.tab].id].dataset = newdevice
                    const chart = async () => {
                        let res = await callApi('POST', host.DATA + '/dropChart', { deviceid: props.sn, tabid: `${props.tab}_${control[props.tab].id}`, index: e.currentTarget.value })
                        // console.log(res)
                    }
                    chart();
                }
                break;
            case 'chart_add': // new ver
                if (setting[props.tab][control[props.tab].id].dataset.length < 4) {
                    var newdevice = [...setting[props.tab][control[props.tab].id].dataset]
                    newdevice.push({
                        label: "Dữ liệu " + (setting[props.tab][control[props.tab].id].dataset.length + 1),
                        fill: "true",
                        lineTension: 0.5,
                        backgroundColor: "rgba(255,99,132,0.5)",
                        borderColor: "rgba(255,99,132,0.5)",
                        cal: "10"
                    })
                    setting[props.tab][control[props.tab].id].dataset = newdevice
                    // setting[props.tab]={
                    //     ...setting[props.tab],
                    //     [control[props.tab].id]: {
                    //         ...setting[props.tab][control[props.tab].id], 
                    //         dataset: newdevice
                    //     }
                    // }
                    console.log(setting[props.tab][control[props.tab].id])
                    const chart = async () => {
                        let res = await callApi('POST', host.DATA + '/addChart', { deviceid: props.sn, tabid: `${props.tab}_${control[props.tab].id}` })
                        // console.log(res)
                    }
                    chart();

                } else {
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_25" }), show: 'block' }))
                }

                break;
            case 'chart': // new ver
                let chart_arr = e.currentTarget.name.split("_")
                if (chart_arr[0] === "borderColor" || chart_arr[0] === "backgroundColor") {
                    let chart_val = document.getElementById(`${chart_arr[1]}_${chart_arr[0]}chart`)
                    setting[props.tab][control[props.tab].id].dataset[chart_arr[1]][chart_arr[0]] = hexToRgbA(chart_val.value)
                }

                if (chart_arr[0] === "fill") {
                    setting[props.tab][control[props.tab].id].dataset[chart_arr[1]][chart_arr[0]] = e.currentTarget.value
                }

                if (chart_arr[0] === "label") {
                    let chart_val = document.getElementById(`${chart_arr[1]}_${chart_arr[0]}chart`)
                    if (chart_val.value !== "") {
                        setting[props.tab][control[props.tab].id].dataset[chart_arr[1]][chart_arr[0]] = chart_val.value
                    } else {
                        alertDispatch(dataLang.formatMessage({ id: "alert_33" }))
                    }
                }

                if (chart_arr[0] === "read") {
                    let chart_val = document.getElementById(`${chart_arr[1]}_${chart_arr[0]}chart`)
                    let chart_math = document.getElementById(`${chart_arr[1]}_calchart`)
                    if (chart_val.value !== "") {
                        chart_math.value += "parseFloat(data[\"" + chart_val.value + "\"])"
                        chart_val.value = ""
                    }
                }

                if (chart_arr[0] === "cal") {
                    try {
                        let chart_val = document.getElementById(`${chart_arr[1]}_${chart_arr[0]}chart`)
                        var result = eval(chart_val.value);
                        if (String(result) !== 'NaN') {
                            setting[props.tab][control[props.tab].id].dataset[chart_arr[1]][chart_arr[0]] = chart_val.value
                            const chart = async () => {
                                let res = await callApi('POST', host.DATA + '/setChart', { deviceid: props.sn, tabid: `${props.tab}_${control[props.tab].id}`, index: chart_arr[1], cal: chart_val.value })
                                // console.log(res)
                            }
                            chart();
                            alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                        } else {
                            console.log("Thanh gi không có trong hệ thống")
                            alertDispatch(dataLang.formatMessage({ id: "alert_66" }))
                        }

                    } catch (error) {
                        console.log("Thanh gi err")
                        alertDispatch(dataLang.formatMessage({ id: "alert_33" }))
                    }

                }
                break;
            case 'box': //new ver

                if (e.currentTarget.name === 'ori') {
                    var box_w = control[props.tab].w
                    var box_h = control[props.tab].h
                    let objIndex = visual[props.tab].findIndex(obj => obj.id == control[props.tab].id)
                    // console.log(val, box_w, box_h)
                    visual[props.tab][objIndex].w = box_h
                    visual[props.tab][objIndex].h = box_w
                    control[props.tab].w = box_h
                    control[props.tab].h = box_w

                }

                setting[props.tab] = {
                    ...setting[props.tab],
                    [control[props.tab].id]: {
                        ...setting[props.tab][control[props.tab].id],
                        [e.currentTarget.name]: val
                    }
                }
                alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                break;
            case 'size': //new ver

                let size_val = document.getElementById(`${name}_INP`)
                let index = visual[props.tab].findIndex(obj => obj.id == control[props.tab].id)
                if (size_val.value !== '') {
                    if (control[props.tab].type === 'switch' || control[props.tab].type === 'circle' || control[props.tab].type === 'led' || control[props.tab].type === 'icon') {
                        visual[props.tab][index] = { ...visual[props.tab][index], w: size_val.value, h: size_val.value }
                    } else {
                        visual[props.tab][index] = { ...visual[props.tab][index], [name]: size_val.value }
                    }
                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                } else {
                    alertDispatch(dataLang.formatMessage({ id: "alert_7" }))
                }
                break;
            case 'leddel': // new ver
                delete setting[props.tab][control[props.tab].id].data[name]
                break;
            case 'ledadd': // new ver          
                let led_color = document.getElementById(`${name}_color`)
                let led_where = document.getElementById(`${name}_where`)
                if (led_where.value) {
                    setting[props.tab] = {
                        ...setting[props.tab],
                        [control[props.tab].id]: {
                            ...setting[props.tab][control[props.tab].id],
                            data: {
                                ...setting[props.tab][control[props.tab].id].data,
                                [led_where.value]: { color: led_color.value }
                            }
                        }
                    }
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
                } else {
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_1" }), show: 'block' }))
                }
                break;
            case 'statusdel': // new ver
                delete setting[props.tab][control[props.tab].id].data[name]
                break;
            case 'statusadd': // new ver
                //console.log(name)
                let status_text = document.getElementById(`${name}_text`)
                let status_color = document.getElementById(`${name}_color`)
                let status_where = document.getElementById(`${name}_where`)
                //console.log(status_text.value, status_color.value, status_where.value)
                if (status_text.value && status_where.value) {

                    setting[props.tab] = {
                        ...setting[props.tab],
                        [control[props.tab].id]: {
                            ...setting[props.tab][control[props.tab].id],
                            data: {
                                ...setting[props.tab][control[props.tab].id].data,
                                [status_where.value]: {
                                    text: status_text.value,
                                    color: status_color.value
                                }
                            }
                        }
                    }
                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                } else {
                    alertDispatch(dataLang.formatMessage({ id: "alert_66" }))
                }
                break;
            case 'multitextdel': // new ver
                delete setting[props.tab][control[props.tab].id].data[name]
                break;
            case 'multitextadd': // new ver

                let multitext_text = document.getElementById(`${name}_text`)
                // let text_color = document.getElementById(`${name}_color`)
                let multitext_where = document.getElementById(`${name}_where`)
                if (multitext_text.value && multitext_where.value) {
                    setting[props.tab] = {
                        ...setting[props.tab],
                        [control[props.tab].id]: {
                            ...setting[props.tab][control[props.tab].id],
                            data: {
                                ...setting[props.tab][control[props.tab].id].data,
                                [multitext_where.value]: {
                                    text: multitext_text.value,
                                }
                            }
                        }
                    }
                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                } else {
                    alertDispatch(dataLang.formatMessage({ id: "alert_66" }))
                }
                break;
            case 'inp': //new ver

                let inp_val = document.getElementById(`${name}_INP`)
                if (inp_val.value !== '') {
                    // setting[props.tab][control[props.tab].id][name] = inp_val.value

                    setting[props.tab] = {
                        ...setting[props.tab],
                        [control[props.tab].id]: {
                            ...setting[props.tab][control[props.tab].id],
                            [name]: inp_val.value
                        }
                    }

                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                } else {
                    alertDispatch(dataLang.formatMessage({ id: "alert_7" }))
                }

                break;
            case 'color': // new ver
                let color_val = document.getElementById(`${name}_COLOR`)
                setting[props.tab][control[props.tab].id][name] = color_val.value
                alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                break;
            case 'read': // new ver

                let read_val = document.getElementById(`${name}_INP`)
                if (read_val.value !== '') {
                    setRegisterDATA(registerDATA + "parseFloat(data[\"" + read_val.value + "\"])")
                    // alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                } else {
                    alertDispatch(dataLang.formatMessage({ id: "alert_22" }))

                }

                break;
            case 'num': //new ver
                let num_val = document.getElementById(`${id}_NUMB`).textContent
                setRegisterDATA(registerDATA + "parseFloat(" + num_val + ")")
                break;
            case 'result': // new ver
                setRegisterDATA(e.currentTarget.value)
                break;
            case 'calculate': // new ver

                try {
                    if (registerDATA === '') {
                        setRegisterDATA(setting[props.tab][control[props.tab].id].cal)

                    }
                    var NUMB = 10
                    var DIM = 10
                    var INP = 10
                    var TIME = 10
                    var result = eval(registerDATA);
                    if (String(result) !== 'NaN') {

                        //setting[props.tab][control[props.tab].id].cal = registerDATA

                        setting[props.tab] = {
                            ...setting[props.tab],
                            [control[props.tab].id]: {
                                ...setting[props.tab][control[props.tab].id],
                                cal: registerDATA
                            }
                        }
                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                    } else {
                        setting[props.tab] = {
                            ...setting[props.tab],
                            [control[props.tab].id]: {
                                ...setting[props.tab][control[props.tab].id],
                                cal: registerDATA
                            }
                        }
                        console.log("Thanh gi không có trong hệ thống")
                        alertDispatch(dataLang.formatMessage({ id: "alert_66" }))


                    }

                } catch (e) {
                    alertDispatch(dataLang.formatMessage({ id: "alert_33" }))
                    setRegisterDATA(setting[props.tab][control[props.tab].id].cal)
                }
                break;
            case 'file': // new ver
                e.preventDefault();
                const resizeFile = (file) =>
                    new Promise((resolve) => {
                        Resizer.imageFileResizer(
                            file,
                            1024,
                            768,
                            "PNG",
                            100,
                            0,
                            (uri) => {
                                resolve(uri);
                            },
                            "file"
                        );
                    });

                console.log('default size', e.target.files[0].size)



                var reader = new FileReader();
                setFilename(e.target.files[0].name)
                if (e.target.files[0].size > 5000000) {
                    // console.log('resized image')
                    // const image = await resizeFile(e.target.files[0]);
                    // console.log('resize', image.size)
                    // reader.readAsDataURL(image);
                    // reader.onload = () => {
                    //     img_.value = reader.result
                    // };

                    alertDispatch(dataLang.formatMessage({ id: "alert_67" }))

                    // let upload = await From(host.DATA + "/uploadFile", image)
                    // console.log(upload)
                    // if (upload.status) {
                    //     // img_.value = upload.data
                    //     setting[props.tab] = {
                    //         ...setting[props.tab],
                    //         [control[props.tab].id]: {
                    //             ...setting[props.tab][control[props.tab].id],
                    //             pic: upload.data,
                    //             path: upload.path
                    //         }
                    //     }
                    // }

                } else {
                    console.log('get this image')
                    // reader.readAsDataURL(e.target.files[0]);
                    // // console.log(reader.result)
                    // reader.onload = () => {
                    //     img_.value = reader.result
                    // };
                    let upload = await From(host.DATA + "/uploadFile", e.target.files[0], `${props.sn}_${props.id}_${props.tab}_${control[props.tab].id}`)
                    console.log(upload)
                    if (upload.status) {
                        // img_.value = upload.data
                        setting[props.tab] = {
                            ...setting[props.tab],
                            [control[props.tab].id]: {
                                ...setting[props.tab][control[props.tab].id],
                                pic: upload.data,
                                path: upload.path
                            }
                        }
                    }
                }

                break;
            default:
                break;

        }
        // toolDispatch({ type: "LOAD_SETTING", payload: setting })
        toolDispatch({ type: "LOAD_VISUAL", payload: { tab: props.tab, visual: visual[props.tab] } })
        toolDispatch({ type: "LOAD_SETTING", payload: { tab: props.tab, setting: setting[props.tab] } })

    }

    //Invt data
    useEffect(function () {
        var startTimer = async () => {
            // console.log("Tool Session read", props.sn)
            const res = await cloud('{"deviceCode":"' + props.sn + '"}', Token.value.token);
            // console.log(res)
            if (res.ret === 0) {
                setData(res.data)
            } else {
                //alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_42" }), show: 'block' }))
            }
        };
        startTimer();
    }, [])

    //Socket
    useEffect(() => {

        try {
            socket.value.on("Server/" + props.sn, function (data) {
                if (data.deviceid === props.sn) {
                    //console.log(data.data)
                    console.log("Toollist socket")
                    Object.keys(data.data).map((keyName, i) => {
                        setData(invt => ({ ...invt, [keyName]: data.data[keyName] }))
                    })
                }
            })
            socket.value.on("Server/up/" + props.sn, function (data) {
                if (data.deviceid === props.sn) {
                    console.log("Toollist up")
                    setData(invt => ({ ...invt, enabled: '1' }))

                }
            })
            socket.value.on("Server/down/" + props.sn, function (data) {
                if (data.deviceid === props.sn) {
                    console.log("Toollist down")
                    setData(invt => ({ ...invt, enabled: '0' }))


                }
            })

        } catch (error) {
            console.log(error)
        }

        return () => {
            socket.value.off("Server/" + props.id);
            socket.value.off("Server/up/" + props.id)
            socket.value.off("Server/down/" + props.id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(function () {
        // console.log('new img')
        // setting[props.tab] = {
        //     ...setting[props.tab],
        //     [control[props.tab].id]: {
        //         ...setting[props.tab][control[props.tab].id],
        //         pic: img_.value
        //     }
        // }
        // toolDispatch({ type: "LOAD_SETTING", payload: setting })
        // toolDispatch({ type: "LOAD_SETTING", payload: {tab:props.tab,setting:setting[props.tab]} })
    }, [img_.value])

    const size = (id, label, value) => {
        return (
            <div className="DAT_Calculateoverview-cover-input">
                <span>{label}</span>
                <div className="DAT_Calculateoverview-cover-input-content">
                    <input type="number" id={`${value}_INP`} defaultValue={control[props.tab][value]}  ></input>
                    <button name={value} id={id} onClick={(e) => handleCalculate(e)}>Xác nhận</button>
                </div>
            </div>
        )
    }

    const input = (id, label, type, value) => {
        return (
            <div className="DAT_Calculateoverview-cover-input">
                <span>{label}</span>
                <div className="DAT_Calculateoverview-cover-input-content">

                    {(value === 'NONE')
                        ? <>
                            <input type={type} id={`${value}_INP`} ></input>
                            <button name={value} id={id} onClick={(e) => handleCalculate(e)}>Thêm</button>
                        </>
                        : <>
                            <input type={type} id={`${value}_INP`} defaultValue={setting[props.tab][control[props.tab].id][value]}></input>
                            <button name={value} id={id} onClick={(e) => handleCalculate(e)}>Xác nhận</button>
                        </>
                    }




                </div>
            </div>
        )
    }

    const textarea = (id, label, type, value) => {
        return (
            <div className="DAT_Calculateoverview-cover-area">
                <span>{label}</span>
                <div className="DAT_Calculateoverview-cover-area-content">


                    <textarea type={type} id={`${value}_INP`} defaultValue={setting[props.tab][control[props.tab].id][value]} ></textarea>
                    <button name={value} id={id} onClick={(e) => handleCalculate(e)}>Xác nhận</button>

                </div>
            </div>
        )
    }

    const colorv2 = (id, label, value) => {

        return (
            <div className="DAT_Calculateoverview-cover-color">
                <span>{label}</span>
                <div className="DAT_Calculateoverview-cover-color-content">

                    <input type="color" defaultValue={setting[props.tab][control[props.tab].id]?.[value] || "#000000"} id={`${value}_COLOR`}></input>
                    <span style={{ color: setting[props.tab][control[props.tab].id][value] }} >  {setting[props.tab][control[props.tab].id][value]} </span>
                    <button name={value} id={id} onClick={(e) => handleCalculate(e)}>Xác nhận</button>
                </div>
            </div>


        )
    }

    const resultv2 = () => {
        return (
            <div className="DAT_Calculateoverview-cover-result">
                <span>Control</span>
                <div className="DAT_Calculateoverview-cover-result-content">
                    <input type="text" value={registerDATA} id="result" onChange={(e) => handleCalculate(e)}></input>
                    <button id="calculate" onClick={(e) => handleCalculate(e)}>Xác nhận</button>
                </div>

            </div>
        )
    }

    const numberv2 = (id, label, num) => {
        return (
            <div className="DAT_Calculateoverview-cover-number">
                <span>{label}</span>
                <div className="DAT_Calculateoverview-cover-number-content">
                    <span id={`${id}_NUMB`} >{num}</span><button id={id} onClick={(e) => handleCalculate(e)}>Thêm</button>
                </div>
            </div>
        )
    }

    const boxv2 = (id, label, list, value) => {
        return (
            <div className="DAT_Calculateoverview-cover-box">

                <span>{label}</span>
                <select id={id} name={value} defaultValue={setting[props.tab][control[props.tab].id][value]} onChange={(e) => handleCalculate(e)}>
                    {list.map((data, index) => (
                        <option key={index} value={data}  >{data}</option>
                    ))}
                </select>
            </div>
        )
    }

    const statusv2 = (value) => {
        return (
            <>
                <div className="DAT_Calculateoverview-cover-status">
                    <span>State</span>
                    <div className="DAT_Calculateoverview-cover-status-content">
                        <input type="text" id={`${value}_where`} placeholder="Key" ></input>
                        <input type="text" id={`${value}_text`} placeholder="Text" ></input>
                        <input type="color" id={`${value}_color`}></input>

                        <button name={value} style={{ borderRadius: "0 5px 5px 0" }} id='statusadd' onClick={(e) => handleCalculate(e)}>Xác nhận</button>
                    </div>
                </div>


                <div className="DAT_Calculateoverview-cover-showstatus">
                    {Object.keys(setting[props.tab][control[props.tab].id].data).map((keyName, i) => (
                        <div className="DAT_Calculateoverview-cover-showstatus-content" key={i} >
                            <span>{keyName}</span>
                            <span style={{ color: setting[props.tab][control[props.tab].id].data[keyName].color }}>{setting[props.tab][control[props.tab].id].data[keyName].text}</span>
                            <span style={{ color: setting[props.tab][control[props.tab].id].data[keyName].color }}>{setting[props.tab][control[props.tab].id].data[keyName].color}</span>
                            <button name={keyName} id="statusdel" onClick={(e) => handleCalculate(e)}>Xóa</button>
                        </div>
                    ))}
                </div>
            </>
        )
    }

    const multitext = (value) => {
        return (
            <>
                <div className="DAT_Calculateoverview-cover-status">
                    <span>Text</span>
                    <div className="DAT_Calculateoverview-cover-status-content">
                        <input type="text" id={`${value}_where`} placeholder="Key" ></input>
                        <input type="text" id={`${value}_text`} placeholder="Text" ></input>
                        <button name={value} style={{ borderRadius: "0 5px 5px 0" }} id='multitextadd' onClick={(e) => handleCalculate(e)}>Xác nhận</button>
                    </div>
                </div>


                <div className="DAT_Calculateoverview-cover-showstatus">
                    {Object.keys(setting[props.tab][control[props.tab].id].data).map((keyName, i) => (
                        <div className="DAT_Calculateoverview-cover-showstatus-content" key={i} >
                            <span>{keyName}</span>
                            <span style={{ color: setting[props.tab][control[props.tab].id].data[keyName].color }}>{setting[props.tab][control[props.tab].id].data[keyName].text}</span>
                            {/* <span style={{ color: setting[props.tab][control[props.tab].id].data[keyName].color }}>{setting[props.tab][control[props.tab].id].data[keyName].color}</span> */}
                            <button name={keyName} id="multitextdel" onClick={(e) => handleCalculate(e)}>Xóa</button>
                        </div>
                    ))}
                </div>
            </>
        )
    }

    const view32bitv2 = () => {

        return (

            < form className="DAT_Calculateoverview-cover-input" id="word" onSubmit={(e) => handleCalculate(e)}>

                <span>Bit0:Bit1</span>
                <div className="DAT_Calculateoverview-cover-input-content">
                    <input type="text" id="word_0" onClick={(e) => setWord(0)} defaultValue={setting[props.tab][control[props.tab].id].cal[0]} required></input>
                    <input type="text" id="word_1" onClick={(e) => setWord(1)} defaultValue={setting[props.tab][control[props.tab].id].cal[1]} required></input>
                    <button  >Xác nhận</button>
                </div>
            </form >
        )


    }

    const ledv2 = (value) => {
        return (
            <>
                <div className="DAT_Calculateoverview-cover-status">
                    <span>State</span>
                    <div className="DAT_Calculateoverview-cover-status-content">
                        <input type="text" id={`${value}_where`} placeholder="Position" ></input>
                        <input type="color" id={`${value}_color`}></input>
                        <button name={value} id='ledadd' onClick={(e) => handleCalculate(e)}>Xác nhận</button>
                    </div>
                </div>




                <div className="DAT_Calculateoverview-cover-showstatus">
                    {Object.keys(setting[props.tab][control[props.tab].id].data).map((keyName, i) => (
                        <div className="DAT_Calculateoverview-cover-showstatus-content" key={i} >
                            <span>{keyName}</span>
                            <span style={{ color: setting[props.tab][control[props.tab].id].data[keyName].color }}>{setting[props.tab][control[props.tab].id].data[keyName].color}</span>
                            <button name={keyName} id='leddel' onClick={(e) => handleCalculate(e)}>Xóa</button>
                        </div>
                    ))}
                </div>
            </>
        )
    }





    const image = () => {

        return (
            <>
                <div className="DAT_Calculateoverview-cover-img">
                    <input
                        type="file"
                        id="file"
                        accept="image/png, image/gif, image/jpeg"
                        onChange={(e) => handleCalculate(e)}
                    />
                    <span>{filename}</span>
                    <label htmlFor="file" style={{ cursor: "pointer" }}>
                        Select image
                    </label>
                </div>
            </>
        )
    }


    return (
        <div className="DAT_Calculate">

            <div className="DAT_Calculate-cover">

                <div className="DAT_Calculate-cover-head">
                    <span style={{ cursor: "pointer" }} onClick={(e) => handleCopy(e)}><ion-icon name="copy-outline"></ion-icon></span>
                    <span style={{ cursor: "pointer" }} onClick={(e) => handleDel(e)}><ion-icon name="trash-outline"></ion-icon></span>
                    <span style={{ cursor: "pointer" }} onClick={(e) => handleClose(e)}><ion-icon name="close-outline" style={{ color: "#326ba8" }} /></span>
                </div>


                {(() => {
                    switch (control[props.tab].type) {
                        case 'circle':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Circle chart</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Diameter', 'w')}
                                    {input('inp', 'Text size', "number", 'size')}
                                    {colorv2('color', 'Text Color', 'color')}
                                    {colorv2('color', 'Start Color', 'startcolor')}
                                    {colorv2('color', 'Stop Color', 'stopcolor')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {input('inp', 'Max', "number", 'max')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {resultv2()}

                                </>
                            )
                        case 'lineChart':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Line Chart</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {input('inp', 'X label', "text", 'xlb')}
                                    {input('inp', 'Y label', "text", 'ylb')}
                                    {input('inp', 'Step', "number", 'step')}
                                    {chart()}
                                </>
                            )
                        case 'switch':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Circle Switch</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Diameter', 'w')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {input('inp', 'Write register', "text", 'register')}
                                    {input('inp', 'ON', "number", 'on')}
                                    {input('inp', 'OFF', "number", 'off')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {numberv2('num', 'Data(Control)', 'NUMB')}
                                    {resultv2()}
                                </>
                            )
                        case 'switchtoggle':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Toggle Switch</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {input('inp', 'Text size', "number", 'textsize')}
                                    {input('inp', 'Radius', "number", 'borderradius')}
                                    {colorv2('color', 'Style', 'bordercolor')}

                                    {input('inp', 'Text ON', "text", 'texton')}
                                    {colorv2('color', 'Text Color ON', 'txtcoloron')}
                                    {colorv2('color', 'BG Color ON', 'bgon')}

                                    {input('inp', 'Text OFF', "text", 'textoff')}
                                    {colorv2('color', 'Text Color ON', 'txtcoloroff')}
                                    {colorv2('color', 'BG Color ON', 'bgoff')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {input('inp', 'ON', "number", 'on')}
                                    {input('inp', 'OFF', "number", 'off')}
                                    {input('inp', 'Write register', "text", 'register')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {numberv2('num', 'Data(Control)', 'NUMB')}
                                    {resultv2()}
                                </>
                            )
                        case 'input':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Input</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {input('inp', 'Text size', "number", 'size')}
                                    {boxv2('box', 'Align', align, 'align')}
                                    {input('inp', 'Radius', "number", 'radius')}
                                    {input('inp', 'Border width', "number", 'borderwidth')}
                                    {colorv2('color', 'Text Color', 'color')}
                                    {colorv2('color', 'Border Color', 'bordercolor')}
                                    {colorv2('color', 'BG Color', 'bgcolor')}
                                    {input('inp', 'Opacity', "number", 'opacity')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {input('inp', 'Write register', "text", 'register')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {numberv2('num', 'Data(Control)', 'INP')}
                                    {resultv2()}
                                </>
                            )
                        case 'text':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Text</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {/* {input('inp', 'Text', "text", 'text')} */}
                                    {textarea('inp', 'Text', "text", 'text')}
                                    {input('inp', 'Text size', "number", 'size')}
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {boxv2('box', 'Align', align, 'align')}
                                    {boxv2('box', 'Justify', justify, 'justify')}
                                    {input('inp', 'Radius', "number", 'radius')}
                                    {input('inp', 'Border width', "number", 'borderwidth')}
                                    {colorv2('color', 'Text Color', 'color')}
                                    {colorv2('color', 'Border Color', 'bordercolor')}
                                    {colorv2('color', 'BG Color', 'bgcolor')}
                                    {input('inp', 'Opacity', "number", 'opacity')}

                                </>
                            )
                        case 'multitext':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Text 2.0</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {multitext('data')}
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {input('inp', 'Text size', "number", 'size')}
                                    {boxv2('box', 'Align', align, 'align')}
                                    {input('inp', 'Radius', "number", 'radius')}
                                    {input('inp', 'Border width', "number", 'borderwidth')}
                                    {colorv2('color', 'Border Color', 'bordercolor')}
                                    {colorv2('color', 'BG Color', 'bgcolor')}
                                    {colorv2('color', 'Text Color', 'color')}
                                    {input('inp', 'Opacity', "number", 'opacity')}
                                    {/* <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {boxv2('box', 'Bit', base, 'base')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {resultv2()} */}
                                </>
                            )

                        case 'slider':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Dimmer</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {boxv2('box', 'ORI', ori, 'ori')}
                                    {input('inp', 'Thumb radius', "number", 'thumbradius')}
                                    {colorv2('color', 'Thumb BGcolor', 'thumbbgcolor')}
                                    {input('inp', 'Track radius', "number", 'trackradius')}
                                    {colorv2('color', 'Track BGcolor', 'trackbgcolor')}
                                    {colorv2('color', 'Rail BGcolor', 'railbgcolor')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {boxv2('box', 'Bit', base, 'base')}
                                    {input('inp', 'Min', "number", 'min')}
                                    {input('inp', 'Max', "number", 'max')}
                                    {input('inp', 'Step', "number", 'step')}
                                    {input('inp', 'Write register', "text", 'register')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {numberv2('num', 'Data(Control)', 'DIM')}
                                    {resultv2()}
                                </>
                            )
                        case 'view':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Float number</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {input('inp', 'Text size', "number", 'size')}
                                    {boxv2('box', 'Align', align, 'align')}
                                    {input('inp', 'Radius', "number", 'radius')}
                                    {input('inp', 'Border width', "number", 'borderwidth')}
                                    {colorv2('color', 'Text Color', 'color')}
                                    {colorv2('color', 'Border Color', 'bordercolor')}
                                    {colorv2('color', 'BG Color', 'bgcolor')}
                                    {input('inp', 'Opacity', "number", 'opacity')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {boxv2('box', 'Bit', base, 'base')}
                                    {input('inp', 'Decimal', "number", 'decimal')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {resultv2()}

                                </>
                            )

                        case 'view2':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Interger number</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {input('inp', 'Text size', "number", 'size')}
                                    {boxv2('box', 'Align', align, 'align')}
                                    {input('inp', 'Radius', "number", 'radius')}
                                    {input('inp', 'Border Width', "number", 'borderwidth')}
                                    {colorv2('color', 'Text Color', 'color')}
                                    {colorv2('color', 'Border Color', 'bordercolor')}
                                    {colorv2('color', 'BG Color', 'bgcolor')}
                                    {input('inp', 'Opacity', "number", 'opacity')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {boxv2('box', 'Bit', base, 'base')}
                                    {/* {input('inp', 'Decimal', "number", 'decimal')} */}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {resultv2()}
                                </>
                            )
                        case 'view32bit':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Word number</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {input('inp', 'Text size', "number", 'size')}
                                    {boxv2('box', 'Align', align, 'align')}
                                    {input('inp', 'Radius', "number", 'radius')}
                                    {input('inp', 'Border Width', "number", 'borderwidth')}
                                    {colorv2('color', 'Text Color', 'color')}
                                    {colorv2('color', 'Border Color', 'bordercolor')}
                                    {colorv2('color', 'BG Color', 'bgcolor')}
                                    {input('inp', 'Opacity', "number", 'opacity')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {boxv2('box', 'Type', type, 'type')}
                                    {input('inp', 'Decimal', "number", 'decimal')}
                                    {input('inp', 'Scale', "number", 'scale')}
                                    {input('readword', 'Read register(Control)', "text", 'NONE')}
                                    {view32bitv2()}
                                </>
                            )


                        case 'status':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Text 2.0</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {statusv2('data')}
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {input('inp', 'Text size', "number", 'size')}
                                    {boxv2('box', 'Align', align, 'align')}
                                    {input('inp', 'Radius', "number", 'radius')}
                                    {input('inp', 'Border width', "number", 'borderwidth')}
                                    {colorv2('color', 'Border Color', 'bordercolor')}
                                    {colorv2('color', 'BG Color', 'bgcolor')}
                                    {input('inp', 'Opacity', "number", 'opacity')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {boxv2('box', 'Bit', base, 'base')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {resultv2()}
                                </>
                            )
                        case 'icon':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Icon</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {ledv2('data')}
                                    {size('size', 'Diameter', 'w')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {boxv2('box', 'Bit', base, 'base')}
                                    {boxv2('box', 'Icon', icon, 'img')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {resultv2()}
                                </>
                            )

                        case 'led':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>LED</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {ledv2('data')}
                                    {size('size', 'Diameter', 'w')}
                                    {input('inp', 'Text', "text", 'text')}
                                    {input('inp', 'Text size', "number", 'size')}
                                    {colorv2('color', 'Text Color', 'textcolor')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {boxv2('box', 'Bit', base, 'base')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {resultv2()}
                                </>
                            )
                        case 'elev':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Elevator</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {input('inp', 'Open', "number", 'open')}
                                    {input('inp', 'Close', "number", 'close')}
                                    {input('inp', 'Scale', "number", 'scale')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {boxv2('box', 'Bit', base, 'base')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {resultv2()}
                                </>
                            )
                        case 'arrow':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Arrow</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {input('inp', 'Animation', "text", 'animation')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {boxv2('box', 'Bit', base, 'base')}
                                    {boxv2('box', 'Arrow', arrow, 'direct')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {resultv2()}
                                </>
                            )

                        case 'timer':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Timer</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {input('inp', 'Unit', "text", 'unit')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {input('inp', 'Write register', "text", 'register')}
                                    {numberv2('num', 'Data(Control)', 'TIME')}
                                    {resultv2()}
                                </>
                            )
                        case 'gauge':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Gauge chart</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {input('inp', 'Text', "text", 'label')}
                                    {input('inp', 'Unit', "text", 'unit')}
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {input('inp', 'Text size', "text", 'valuesize')}
                                    {colorv2('color', 'Text Color', 'valuecolor')}
                                    {colorv2('color', 'Start Color', 'startcolor')}
                                    {colorv2('color', 'Stop Color', 'endcolor')}
                                    {colorv2('color', 'Needle Color', 'needlecolor')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {input('inp', 'Min', "number", 'min')}
                                    {input('inp', 'Max', "number", 'max')}
                                    {input('inp', 'Segment', "number", 'segment')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {resultv2()}
                                </>
                            )

                        case 'tablepro':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Table pro</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Comming soon!</div>
                                    {/* {edit('text', 'edit_w', 'Width: ' + control[props.tab].w + "px", 'size')}
                                    {edit('text', 'edit_h', 'Height: ' + control[props.tab].h + "px", 'size')}
                                    {edit('number', 'edit_row', "Add row", 'table_addrow')}
                                    {multiledit("table_delrow", [{ id: "from", text: "Delete row: Form" }, { id: "to", text: "To" }])}
                                    {edit('number', 'edit_col', "Add col", 'table_addcol')}
                                    {multiledit("table_delcol", [{ id: "from", text: "Delete col: Form" }, { id: "to", text: "To" }])}
                                    {multiledit_box(setting[props.tab][control[props.tab].id].head, setting[props.tab][control[props.tab].id].data)} */}
                                </>
                            )
                        case 'picture':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Image</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {boxv2('box', 'Picture', pic, 'pic')}
                                </>
                            )
                        case 'image':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Image</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {input('inp', 'Radius', "number", 'radius')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {image('pic')}
                                </>
                            )
                        case 'calendar':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Calendar</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {input('inp', 'Text size', "number", 'size')}
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {boxv2('box', 'Align', align, 'align')}
                                    {boxv2('box', 'Justify', justify, 'justify')}
                                    {input('inp', 'Radius', "number", 'radius')}
                                    {input('inp', 'Border width', "number", 'borderwidth')}
                                    {colorv2('color', 'Text Color', 'color')}
                                    {colorv2('color', 'Border Color', 'bordercolor')}
                                    {colorv2('color', 'BG Color', 'bgcolor')}
                                    {input('inp', 'Opacity', "number", 'opacity')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {boxv2('box', 'PWD State', pwd, 'ispwd')}
                                    {input('inp', 'Password', "text", 'pwd')}
                                </>
                            )
                        default: return <></>
                    }
                })()}


            </div>
        </div >
    )
}