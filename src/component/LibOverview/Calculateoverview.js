/* eslint eqeqeq: 0 */
/* eslint no-eval: 0 */
/* eslint  no-unused-vars: 0 */
import React, { useContext, useEffect, useState } from "react";
import "./Tooloverview.scss"
import { OverviewContext } from "../Context/OverviewContext";
import { useIntl } from "react-intl";
import { signal } from "@preact/signals-react";
import Resizer from "react-image-file-resizer";
import { alertDispatch } from "../Alert/Alert";
import { From } from "../Api/Api";
import { host } from "../Lang/Contant";


export const coppyState = signal(0)
export const coppySetting = signal({})
export const coppyVisual = signal({})
export const currentX = signal(0)
export const currentY = signal(0)
const img_ = signal('')
const data_ = signal({})
export default function Calculateoverview(props) {
    const dataLang = useIntl();
    const [data, setData] = useState()
    const { overview_device, overview_setting, overview_control, overview_visual, overviewDispatch } = useContext(OverviewContext)
    const [registerDATA, setRegisterDATA] = useState(overview_setting[overview_control.id].cal)             // thuật toán của thành phần trên giao diện
    const [filename, setFilename] = useState('No file')
    const align = ['left', 'center', 'right']
    const justify = ['flex-start', 'center', 'flex-end']
    const ori = ['horizontal', 'vertical']
    const type = ['int', 'float']
    const base = ['10', '16', '2_0', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6', '2_7', '2_8', '2_9', '2_10', '2_11', '2_12', '2_13', '2_14', '2_15']
    const icon = ['Valve', 'Valve2.0', 'Area', 'Door_lock', 'Hall_lock', 'Close_inside', 'Close_outside', 'Open_inside', 'Open_outside', 'Driver', 'Fault', 'Fire', 'Lock', 'Maintenance', 'Overload', 'Fullload', 'Parallel', 'Power', 'Safety', 'Setting', 'Trapped', 'Video', 'Up', 'Down', 'Icon']
    const pic = ['Valve', 'Valve2.0', 'AChau', 'DECC', 'PhucAn', 'factory', 'solar_light', 'road']
    const arrow = ['up', 'down']
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

    const handleCalculate = async (e) => {
        e.preventDefault();
        var id = e.currentTarget.id
        var name = e.currentTarget.name

        switch (id) {
            case 'leddel':

                data_.value = { ...overview_setting[overview_control.id].data }
                delete data_.value[name]

                let setting = { ...overview_setting }

                setting = {
                    ...setting,
                    [overview_control.id]: {
                        ...setting[overview_control.id],
                        data: data_.value
                    }
                }
                overviewDispatch({ type: "LOAD_SETTING", payload: setting })



                break;
            case 'ledadd':
                //console.log(name)
                let led_color = document.getElementById(`${name}_color`)
                let led_where = document.getElementById(`${name}_where`)
                //console.log(led_text.value, led_color.value, led_where.value)
                if (led_where.value) {
                    overview_setting[overview_control.id] = {
                        ...overview_setting[overview_control.id],
                        data: {
                            ...overview_setting[overview_control.id].data,
                            [led_where.value]: {
                                color: led_color.value,
                            }
                        }
                    }
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
                } else {
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_1" }), show: 'block' }))
                }
                break;
            case 'statusdel':


                data_.value = { ...overview_setting[overview_control.id].data }
                delete data_.value[name]

                let setting2 = { ...overview_setting }

                setting2 = {
                    ...setting2,
                    [overview_control.id]: {
                        ...setting2[overview_control.id],
                        data: data_.value
                    }
                }
                overviewDispatch({ type: "LOAD_SETTING", payload: setting2 })

                break;
            case 'statusadd':
                //console.log(name)
                let status_text = document.getElementById(`${name}_text`)
                let status_color = document.getElementById(`${name}_color`)
                let status_where = document.getElementById(`${name}_where`)
                //console.log(status_text.value, status_color.value, status_where.value)
                if (status_text.value && status_where.value) {
                    overview_setting[overview_control.id] = {
                        ...overview_setting[overview_control.id],
                        data: {
                            ...overview_setting[overview_control.id].data,
                            [status_where.value]: {
                                text: status_text.value,
                                color: status_color.value,
                            }
                        }
                    }
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
                } else {
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_1" }), show: 'block' }))
                }
                break;
            case 'word': //new
                let word_0 = document.getElementById("word_0")
                let word_1 = document.getElementById("word_1")
                try {
                    let word_cal_0 = eval(word_0.value);
                    let word_cal_1 = eval(word_1.value);
                    if (String(word_cal_0) !== 'NaN' && String(word_cal_1) !== 'NaN') {


                        overview_setting[overview_control.id] = {
                            ...overview_setting[overview_control.id],
                            cal: [word_0.value, word_1.value],
                        }

                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                    } else {
                        console.log("Thanh gi không có trong hệ thống")
                        overview_setting[overview_control.id] = {
                            ...overview_setting[overview_control.id],
                            cal: [word_0.value, word_1.value],
                        }
                        alertDispatch(dataLang.formatMessage({ id: "alert_66" }))
                    }

                } catch (error) {
                    console.log("Thanh gi err")
                    alertDispatch(dataLang.formatMessage({ id: "alert_33" }))
                }
                break;
            case 'box': //new
                //console.log(id, e.currentTarget.value, e.currentTarget.name)
                // overview_setting[overview_control.id][name] = e.currentTarget.value
                if (name == 'ori') {
                    let box_w = overview_control.w
                    let box_h = overview_control.h
                    let objIndex = overview_visual.findIndex(obj => obj.id == overview_control.id)
                    overview_visual[objIndex].w = box_h
                    overview_visual[objIndex].h = box_w
                    overview_control = {
                        ...overview_control,
                        w: box_h,
                        h: box_w
                    }


                }
                // overview_setting[overview_control.id][name] = rgbaToHex(e.currentTarget.value)
                overview_setting[overview_control.id] = { ...overview_setting[overview_control.id], [name]: rgbaToHex(e.currentTarget.value) }
                alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                break;
            case 'size': //new

                let size_val = document.getElementById(`${name}_INP`)
                let index = overview_visual.findIndex(obj => obj.id == overview_control.id)

                if (size_val.value !== '') {


                    if (overview_control.type === 'switch' || overview_control.type === 'circle' || overview_control.type === 'led' || overview_control.type === 'icon') {
                        overview_visual[index] = { ...overview_visual[index], w: size_val.value, h: size_val.value }
                    } else {
                        overview_visual[index] = { ...overview_visual[index], [name]: size_val.value }
                    }
                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                } else {
                    //console.log("khong duoc de trong")
                    alertDispatch(dataLang.formatMessage({ id: "alert_7" }))
                }

                break;
            case 'color': //new
                let color_val = document.getElementById(`${name}_COLOR`)
                overview_setting[overview_control.id] = { ...overview_setting[overview_control.id], [name]: color_val.value }
                alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                break;
            case 'inp': //new

                let inp_val = document.getElementById(`${name}_INP`)

                if (inp_val.value !== '') {
                    console.log(inp_val.value)
                    overview_setting[overview_control.id] = { ...overview_setting[overview_control.id], [name]: inp_val.value }
                    alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                } else {
                    //console.log("khong duoc de trong")
                    alertDispatch(dataLang.formatMessage({ id: "alert_7" }))

                }
                break;
            case 'read': //new
                let read_val = document.getElementById(`${name}_INP`)
                if (read_val.value !== '') {
                    setRegisterDATA(registerDATA + "parseFloat(data[\"" + overview_setting[overview_control.id].deviceid + "\"][\"" + read_val.value + "\"])")
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
                } else {
                    //console.log("khong duoc de trong")
                    alertDispatch(dataLang.formatMessage({ id: "alert_22" }))
                }
                break;
            case 'readword': //new
                var wordget_register = document.getElementById(`${name}_INP`)
                //console.log(wordget_register.value)
                if (wordget_register.value !== '') {
                    var word_ = document.getElementById("word_" + word)
                    word_.value = word_.value + "parseFloat(data[\"" + overview_setting[overview_control.id].deviceid + "\"][\"" + wordget_register.value + "\"])"
                } else {
                    //console.log("khong duoc de trong")
                    alertDispatch(dataLang.formatMessage({ id: "alert_33" }))
                }

                break;
            case 'num': //new
                const num_val = document.getElementById(`${id}_NUMB`).textContent
                setRegisterDATA(registerDATA + "parseFloat(" + num_val + ")")
                break;
            case 'result': //new
                setRegisterDATA(e.currentTarget.value)
                break;
            case 'calculate': //new
                try {
                    if (registerDATA === '') {
                        setRegisterDATA(overview_setting[overview_control.id].cal)

                    }
                    var NUMB = 10
                    var DIM = 10
                    var INP = 10

                    //console.log(registerDATA)
                    var result = eval(registerDATA);
                    if (String(result) !== 'NaN') {


                        overview_setting[overview_control.id] = { ...overview_setting[overview_control.id], cal: registerDATA }
                        overviewDispatch({ type: "SET_CONFIG", payload: overview_setting[overview_control.id] })
                        alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                    } else {
                        console.log("Thanh gi không có trong hệ thống")
                        overview_setting[overview_control.id] = { ...overview_setting[overview_control.id], cal: registerDATA }
                        overviewDispatch({ type: "SET_CONFIG", payload: overview_setting[overview_control.id] })
                        alertDispatch(dataLang.formatMessage({ id: "alert_66" }))
                    }

                } catch (e) {
                    //console.log("Thuật toán lỗi")
                    alertDispatch(dataLang.formatMessage({ id: "alert_33" }))
                    setRegisterDATA(overview_setting[overview_control.id].cal)
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


                var reader = new FileReader();
                setFilename(e.target.files[0].name)
                if (e.target.files[0].size > 5000000) {
                    // console.log('resized image')
                    // const image = await resizeFile(e.target.files[0]);

                    // let upload = await From(host.DATA + "/uploadFile", image)
                    // console.log(upload)
                    // if (upload.status) {
                    //     // img_.value = upload.data
                    //     overview_setting[overview_control.id] = {
                    //         ...overview_setting[overview_control.id],
                    //         pic: upload.data,
                    //         path: upload.path
                    //     }
                    // }

                    alertDispatch(dataLang.formatMessage({ id: "alert_67" }))


                    // reader.readAsDataURL(image);
                    // reader.onload = () => {
                    //     img_.value = reader.result
                    // };
                } else {

                    let upload = await From(host.DATA + "/uploadFile", e.target.files[0], `${props.id}_0_${overview_control.id}`)
                    console.log(upload)
                    if (upload.status) {
                        // img_.value = upload.data
                        overview_setting[overview_control.id] = {
                            ...overview_setting[overview_control.id],
                            pic: upload.data,
                            path: upload.path
                        }
                    }

                    // console.log('get this image')
                    // reader.readAsDataURL(e.target.files[0]);
                    // console.log(reader.result)
                    // reader.onload = () => {
                    //     img_.value = reader.result
                    // };
                }

                break;
            default:
                console.log("ERR")
                break;
        }
        overviewDispatch({ type: "LOAD_VISUAL", payload: overview_visual })
        // console.log(overview_setting[overview_control.id])
    }

    const status = (value) => {
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
                    {Object.keys(overview_setting[overview_control.id].data).map((keyName, i) => (
                        <div className="DAT_Calculateoverview-cover-showstatus-content" key={i} >
                            <span>{keyName}</span>
                            <span style={{ color: overview_setting[overview_control.id].data[keyName].color }}>{overview_setting[overview_control.id].data[keyName].text}</span>
                            <span style={{ color: overview_setting[overview_control.id].data[keyName].color }}>{overview_setting[overview_control.id].data[keyName].color}</span>
                            <button name={keyName} id="statusdel" onClick={(e) => handleCalculate(e)}>Xóa</button>
                        </div>
                    ))}
                </div>
            </>
        )
    }


    const led = (value) => {
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
                    {Object.keys(overview_setting[overview_control.id].data).map((keyName, i) => (
                        <div className="DAT_Calculateoverview-cover-showstatus-content" key={i} >
                            <span>{keyName}</span>
                            <span style={{ color: overview_setting[overview_control.id].data[keyName].color }}>{overview_setting[overview_control.id].data[keyName].color}</span>
                            <button name={keyName} id='leddel' onClick={(e) => handleCalculate(e)}>Xóa</button>
                        </div>
                    ))}
                </div>
            </>
        )
    }



    const [word, setWord] = useState(0)
    const view32bit = () => {

        return (

            < form className="DAT_Calculateoverview-cover-input" id="word" onSubmit={(e) => handleCalculate(e)}>

                <span>Bit0:Bit1</span>
                <div className="DAT_Calculateoverview-cover-input-content">
                    <input type="text" id="word_0" onClick={(e) => setWord(0)} defaultValue={overview_setting[overview_control.id].cal[0]} required></input>
                    <input type="text" id="word_1" onClick={(e) => setWord(1)} defaultValue={overview_setting[overview_control.id].cal[1]} required></input>
                    <button  >Xác nhận</button>
                </div>
            </form >
        )


    }


    const box = (id, label, list, value) => {
        return (
            <div className="DAT_Calculateoverview-cover-box">

                <span>{label}</span>
                <select id={id} name={value} defaultValue={overview_setting[overview_control.id][value]} onChange={(e) => handleCalculate(e)}>
                    {list.map((data, index) => (
                        <option key={index} value={data}  >{data}</option>
                    ))}
                </select>
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
                            <input type={type} id={`${value}_INP`} defaultValue={overview_setting[overview_control.id][value]} ></input>
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


                    <textarea type={type} id={`${value}_INP`} defaultValue={overview_setting[overview_control.id][value]} ></textarea>
                    <button name={value} id={id} onClick={(e) => handleCalculate(e)}>Xác nhận</button>

                </div>
            </div>
        )
    }

    const size = (id, label, value) => {
        return (
            <div className="DAT_Calculateoverview-cover-input">
                <span>{label}</span>
                <div className="DAT_Calculateoverview-cover-input-content">
                    <input type="text" id={`${value}_INP`} defaultValue={overview_control[value]}  ></input>
                    <button name={value} id={id} onClick={(e) => handleCalculate(e)}>Xác nhận</button>
                </div>
            </div>
        )
    }


    const color = (id, label, value) => {

        return (
            <div className="DAT_Calculateoverview-cover-color">
                <span>{label}</span>
                <div className="DAT_Calculateoverview-cover-color-content">

                    <input type="color" defaultValue={overview_setting[overview_control.id][value]} id={`${value}_COLOR`}></input>
                    <span style={{ color: overview_setting[overview_control.id][value] }} >  {overview_setting[overview_control.id][value]} </span>
                    <button name={value} id={id} onClick={(e) => handleCalculate(e)}>Xác nhận</button>
                </div>
            </div>


        )
    }



    const result = () => {
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

    const number = (id, label, num) => {
        return (
            <div className="DAT_Calculateoverview-cover-number">
                <span>{label}</span>
                <div className="DAT_Calculateoverview-cover-number-content">
                    <span id={`${id}_NUMB`} >{num}</span><button id={id} onClick={(e) => handleCalculate(e)}>Thêm</button>
                </div>
            </div>
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





    const handleClose = (e) => {
        overview_control.stt = false
        overview_control.type = ''
        overview_control.id = '0'
        overviewDispatch({ type: "SET_CONFIG", payload: overview_control })

    }

    const handleDel = (e) => {

        var newdevice = [...overview_visual] //coppy old array
        newdevice = newdevice.filter(newdevice => newdevice.id != overview_control.id)
        overviewDispatch({ type: "LOAD_VISUAL", payload: newdevice })
        delete overview_setting[overview_control.id]
        if (newdevice.length === 0) {
            overviewDispatch({ type: "SET_LASTID", payload: 0 })

        }

        overview_control.stt = false
        overview_control.type = ''
        overview_control.id = '0'
        overview_control.deviceid = '0'
        overview_control.cal = '0'

    }

    const handleCopy = (e) => {

        console.log(overview_setting[overview_control.id], overview_visual)

        coppySetting.value = overview_setting[overview_control.id]
        coppyVisual.value = { ...overview_visual.find(x => x.id == overview_control.id) }
        currentX.value = overview_visual.find(x => x.id == overview_control.id).x
        currentY.value = overview_visual.find(x => x.id == overview_control.id).y
        coppyState.value = 1

    }


    //Load dữ liệu liên tục
    useEffect(() => {
        setData(props.invt)
    }, [props])

    useEffect(function () {
        // console.log('new img')
        // overview_setting[overview_control.id] = {
        //     ...overview_setting[overview_control.id],
        //     pic: img_.value
        // }

        // overviewDispatch({ type: "LOAD_VISUAL", payload: overview_visual })
    }, [img_.value])


    return (
        <div className="DAT_Calculateoverview">

            <div className="DAT_Calculateoverview-cover">

                <div className="DAT_Calculateoverview-cover-head">
                    <span style={{ cursor: "pointer" }} onClick={(e) => handleCopy(e)}><ion-icon name="copy-outline"></ion-icon></span>
                    <span style={{ cursor: "pointer" }} onClick={(e) => handleDel(e)}><ion-icon name="trash-outline"></ion-icon></span>
                    <span style={{ cursor: "pointer" }} onClick={(e) => handleClose(e)}><ion-icon name="close-outline" style={{ color: "#326ba8" }} /></span>
                </div>

                {(() => {
                    switch (overview_control.type) {
                        case 'switch':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Circle Switch</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Diameter', 'w')}
                                    {/* {input('inp', 'Text size', "number", 'size')} */}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {box('box', 'Gateway', overview_device, 'deviceid')}
                                    {input('inp', 'Write register', "text", 'register')}
                                    {input('inp', 'ON', "number", 'on')}
                                    {input('inp', 'OFF', "number", 'off')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {number('num', 'Data(Control)', 'NUMB')}
                                    {result()}

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
                                    {color('color', 'Style', 'bordercolor')}

                                    {input('inp', 'Text ON', "text", 'texton')}
                                    {color('color', 'Text Color ON', 'txtcoloron')}
                                    {color('color', 'BG Color ON', 'bgon')}

                                    {input('inp', 'Text OFF', "text", 'textoff')}
                                    {color('color', 'Text Color ON', 'txtcoloroff')}
                                    {color('color', 'BG Color ON', 'bgoff')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {box('box', 'Gateway', overview_device, 'deviceid')}
                                    {input('inp', 'ON', "number", 'on')}
                                    {input('inp', 'OFF', "number", 'off')}
                                    {input('inp', 'Write register', "text", 'register')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {number('num', 'Data(Control)', 'NUMB')}
                                    {result()}
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
                                    {input('inp', 'Radius', "number", 'radius')}
                                    {input('inp', 'Border width', "number", 'borderwidth')}
                                    {box('box', 'Align', align, 'align')}
                                    {color('color', 'Text Color', 'color')}
                                    {color('color', 'Border Color', 'bordercolor')}
                                    {color('color', 'BG Color', 'bgcolor')}
                                    {input('inp', 'Opacity', "number", 'opacity')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {box('box', 'Gateway', overview_device, 'deviceid')}
                                    {input('inp', 'Write register', "text", 'register')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {number('num', 'Data(Control)', 'INP')}
                                    {result()}

                                </>
                            )


                        case 'slider':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Dimmer</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {box('box', 'ORI', ori, 'ori')}
                                    {input('inp', 'Thumb radius', "number", 'thumbradius')}
                                    {color('color', 'Thumb BGcolor', 'thumbbgcolor')}
                                    {input('inp', 'Track radius', "number", 'trackradius')}
                                    {color('color', 'Track BGcolor', 'trackbgcolor')}
                                    {color('color', 'Rail BGcolor', 'railbgcolor')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {box('box', 'Gateway', overview_device, 'deviceid')}
                                    {box('box', 'Bit', base, 'base')}
                                    {input('inp', 'Min', "number", 'min')}
                                    {input('inp', 'Max', "number", 'max')}
                                    {input('inp', 'Step', "number", 'step')}
                                    {input('inp', 'Write register', "text", 'register')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {number('num', 'Data(Control)', 'DIM')}
                                    {result()}
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
                                    {input('inp', 'Radius', "number", 'radius')}
                                    {input('inp', 'Border width', "number", 'borderwidth')}
                                    {box('box', 'Align', align, 'align')}
                                    {box('box', 'Justify', justify, 'justify')}
                                    {color('color', 'Text Color', 'color')}
                                    {color('color', 'Border Color', 'bordercolor')}
                                    {color('color', 'BG Color', 'bgcolor')}
                                    {input('inp', 'Opacity', "number", 'opacity')}

                                </>
                            )
                        case 'status':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Text 2.0</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {status('data')}
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {input('inp', 'Text size', "number", 'size')}
                                    {input('inp', 'Radius', "number", 'radius')}
                                    {input('inp', 'Border width', "number", 'borderwidth')}
                                    {box('box', 'Align', align, 'align')}
                                    {color('color', 'Border Color', 'bordercolor')}
                                    {color('color', 'BG Color', 'bgcolor')}
                                    {input('inp', 'Opacity', "number", 'opacity')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {box('box', 'Gateway', overview_device, 'deviceid')}
                                    {box('box', 'Bit', base, 'base')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {result()}
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
                                    {input('inp', 'Radius', "number", 'radius')}
                                    {input('inp', 'Border width', "number", 'borderwidth')}
                                    {box('box', 'Align', align, 'align')}
                                    {color('color', 'Text Color', 'color')}
                                    {color('color', 'Border Color', 'bordercolor')}
                                    {color('color', 'BG Color', 'bgcolor')}
                                    {input('inp', 'Opacity', "number", 'opacity')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {box('box', 'Gateway', overview_device, 'deviceid')}
                                    {box('box', 'Bit', base, 'base')}
                                    {input('inp', 'Decimal', "number", 'decimal')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {result()}
                                </>
                            )
                        case 'view2':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Integer number</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    {input('inp', 'Text size', "number", 'size')}
                                    {input('inp', 'Radius', "number", 'radius')}
                                    {input('inp', 'Border Width', "number", 'borderwidth')}
                                    {box('box', 'Align', align, 'align')}
                                    {color('color', 'Text Color', 'color')}
                                    {color('color', 'Border Color', 'bordercolor')}
                                    {color('color', 'BG Color', 'bgcolor')}
                                    {input('inp', 'Opacity', "number", 'opacity')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {box('box', 'Gateway', overview_device, 'deviceid')}
                                    {box('box', 'Bit', base, 'base')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {result()}
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
                                    {input('inp', 'Radius', "number", 'radius')}
                                    {input('inp', 'Border Width', "number", 'borderwidth')}
                                    {box('box', 'Align', align, 'align')}
                                    {color('color', 'Text Color', 'color')}
                                    {color('color', 'Border Color', 'bordercolor')}
                                    {color('color', 'BG Color', 'bgcolor')}
                                    {input('inp', 'Opacity', "number", 'opacity')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {box('box', 'Gateway', overview_device, 'deviceid')}
                                    {box('box', 'Type', type, 'type')}
                                    {input('inp', 'Decimal', "number", 'decimal')}
                                    {input('inp', 'Scale', "number", 'scale')}
                                    {input('readword', 'Read register(Control)', "text", 'NONE')}
                                    {view32bit()}
                                </>
                            )
                        case 'circle':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Circle chart</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Diameter', 'w')}
                                    {input('inp', 'Text size', "number", 'size')}
                                    {color('color', 'Text Color', 'color')}
                                    {color('color', 'Start Color', 'startcolor')}
                                    {color('color', 'Stop Color', 'stopcolor')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {box('box', 'Gateway', overview_device, 'deviceid')}
                                    {input('inp', 'Max', "number", 'max')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {result()}
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
                                    {color('color', 'Text Color', 'valuecolor')}
                                    {color('color', 'Start Color', 'startcolor')}
                                    {color('color', 'Stop Color', 'endcolor')}
                                    {color('color', 'Needle Color', 'needlecolor')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {box('box', 'Gateway', overview_device, 'deviceid')}
                                    {input('inp', 'Min', "number", 'min')}
                                    {input('inp', 'Max', "number", 'max')}
                                    {input('inp', 'Segment', "number", 'segment')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {result()}
                                </>
                            )
                        case 'led':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>LED</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {led('data')}
                                    {size('size', 'Diameter', 'w')}
                                    {input('inp', 'Text', "text", 'text')}
                                    {input('inp', 'Text size', "number", 'size')}
                                    {color('color', 'Text Color', 'textcolor')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {box('box', 'Gateway', overview_device, 'deviceid')}
                                    {box('box', 'Bit', base, 'base')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {result()}
                                </>
                            )
                        case 'icon':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Icon</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {led('data')}
                                    {size('size', 'Diameter', 'w')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {box('box', 'Gateway', overview_device, 'deviceid')}
                                    {box('box', 'Bit', base, 'base')}
                                    {box('box', 'Icon', icon, 'img')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {result()}
                                </>
                            )
                        case 'picture':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Picture</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {size('size', 'Width', 'w')}
                                    {size('size', 'Height', 'h')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {box('box', 'Picture', pic, 'pic')}
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
                        case 'arrow':
                            return (
                                <>
                                    <div className="DAT_Calculateoverview-tit" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: "22px", color: "#326ba8" }}>Arrow(Up & Down)</div>
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Display</div>
                                    {input('inp', 'Animation', "text", 'animation')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {box('box', 'Gateway', overview_device, 'deviceid')}
                                    {box('box', 'Bit', base, 'base')}
                                    {box('box', 'Arrow', arrow, 'direct')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {result()}
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
                                    {box('box', 'Gateway', overview_device, 'deviceid')}
                                    {box('box', 'Bit', base, 'base')}
                                    {input('read', 'Read register(Control)', "text", 'NONE')}
                                    {result()}
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
                                    {box('box', 'Align', align, 'align')}
                                    {box('box', 'Justify', justify, 'justify')}
                                    {input('inp', 'Radius', "number", 'radius')}
                                    {input('inp', 'Border width', "number", 'borderwidth')}
                                    {color('color', 'Text Color', 'color')}
                                    {color('color', 'Border Color', 'bordercolor')}
                                    {color('color', 'BG Color', 'bgcolor')}
                                    {input('inp', 'Opacity', "number", 'opacity')}
                                    <div className="DAT_Calculateoverview-line" style={{ fontSize: "18px", width: "100%", borderBottom: "1px solid #326ba8", marginBottom: "15px" }}>Control</div>
                                    {box('box', 'PWD State', pwd, 'ispwd')}
                                    {input('inp', 'Password', "text", 'pwd')}
                                </>
                            )
                        default: return <></>
                    }
                })()}





            </div>
        </div>
    )
}