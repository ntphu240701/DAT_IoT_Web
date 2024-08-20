/* eslint eqeqeq: 0 */
/* eslint no-unused-vars: 0*/
/* eslint no-lone-blocks: 0*/
import React, { useContext, useEffect, useRef, useState } from "react";
import "./Tooloverview.scss"
import { OverviewContext } from "../Context/OverviewContext";

import { SettingContext } from "../Context/SettingContext";

import { host } from "../Lang/Contant";
// import { action } from "../Control/Action";
import { useIntl } from "react-intl";
// import { AlertContext } from "../Context/AlertContext";

import { signal } from "@preact/signals-react";
import { IoMdAddCircleOutline, IoMdClose, IoMdMore } from "react-icons/io";
import Circle from "../Lib/Circle";
import LineChart from "../Lib/LineChart";
import Switch from "./Switch";
import SwitchToggle from "./SwitchToggle";
import Input from "./Input";
import Note from "../Lib/Note";
import Value from "../Lib/Value";
import Valuev2 from "../Lib/Valuev2";
import Dimmer from "./Dimmer";
import Elevroom from "../Lib/Elevroom";
import Status from "../Lib/Status";
import Arrow from "../Lib/Arrow";
import Led from "../Lib/Led";
import Icon from "../Lib/Icon";
import Timer from "../Lib/Timer";
import Gauge from "../Lib/Gauge";
import Tablepro from "../Lib/Tablepro";
import Picture from "../Lib/Picture";
import View32bit from "../Lib/View32bit";
import { MdRadioButtonChecked } from "react-icons/md";
import { IoInformation, IoSave, IoTextOutline, IoTimerOutline, IoToggle } from "react-icons/io5";
import { RxInput, RxSlider } from "react-icons/rx";
import { TbChartDonut2, TbDecimal, TbNumber0Small, TbTextSpellcheck } from "react-icons/tb";
import { VscFileBinary } from "react-icons/vsc";
import { GiChart, GiElevator } from "react-icons/gi";
import { PiGaugeLight } from "react-icons/pi";
import { AiOutlineAppstoreAdd, AiOutlinePicture } from "react-icons/ai";
import { LuArrowDownUp, LuCircleDashed } from "react-icons/lu";
import { CiAlignBottom, CiAlignLeft, CiAlignRight, CiAlignTop, CiEdit, CiViewTable } from "react-icons/ci";
import { callApi } from "../Api/Api";
import Img from "../Lib/Img";
import { coppySetting, coppyState, coppyVisual } from "./Calculateoverview";
import { useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { alertDispatch } from "../Alert/Alert";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import Calendar from "./Calendar";

const dragGroupOV = signal(false)
const dragStateOV = signal(false)
const ElementOV = signal('X_None')
const ListElementOV = signal([])
const offsetOV = signal({ x: 0, y: 0 })
const historyOV = signal([])

const offsetResize = signal({ x: 0, y: 0 })
const dragStateResize = signal(false)
const idResize = signal('')
const idDrag = signal('0')




export default function Configoverview(props) {
    // const { alertDispatch } = useContext(AlertContext);
    const usr = useSelector((state) => state.admin.usr)
    const dataLang = useIntl();
    const { overview_lastid, overview_visual, overview_setting, overview_control, overviewDispatch } = useContext(OverviewContext)
    // const { listdevice } = useContext(SettingContext)
    const [dropdowm, setDropdown] = useState(false)
    const [invt, setInvt] = useState({})
    // const [singlevisualDATA, setSinglevisualDATA] = useState({ id: 0, type: '', deviceid: '0', name: 'DATA' })
    // const [createSVG, setCreateSVG] = useState(false)        // trạng thái tạo dữ liệu trên SVG
    // const [visualeditDATA, setVisualeditDATA] = useState([])         // giao diện di chuyển theo chuột
    // const [typeSVG, setTypeSVG] = useState('')               // loại dữ liệu muốn tạo
    // const [deviceSVG, setDeviceSVG] = useState('')               // loại dữ liệu muốn tạo
    // const [nameSVG, setNameSVG] = useState('')               // loại dữ liệu muốn tạo
    // const [moveforwhat, setMoveforwhat] = useState('')               // loại dữ liệu muốn tạo
    const [datastore, setDatastore] = useState([])
    const [store, setStore] = useState(false)
    const [getstore, setGetstore] = useState(false)
    const storename = useRef()
    const [idstorage, setIdstorage] = useState(0)



    const control_ = [
        { id: 'switch', icon: <MdRadioButtonChecked size={18} /> },
        { id: 'switchtoggle', icon: <IoToggle size={18} /> },
        { id: 'input', icon: <RxInput size={18} /> },
        { id: 'slider', icon: <RxSlider size={18} /> },
        // { id: 'timer', icon: <IoTimerOutline size={18} /> },

    ]

    const textxnumber_ = [

        { id: 'text', icon: <IoTextOutline size={18} /> },
        { id: 'status', icon: <TbTextSpellcheck size={18} /> },
        { id: 'view', icon: <TbDecimal size={18} /> },
        { id: 'view2', icon: <TbNumber0Small size={18} /> },
        { id: 'view32bit', icon: <VscFileBinary size={18} /> }
    ]

    const chart_ = [

        // { id: 'lineChart', icon: <GiChart size={18} /> },
        { id: 'circle', icon: <TbChartDonut2 size={18} /> },
        { id: 'gauge', icon: <PiGaugeLight size={18} /> },

    ]

    const extension_ = [
        { id: 'image', icon: <AiOutlinePicture size={18} /> },
        { id: 'icon', icon: <IoInformation size={18} /> },
        { id: 'led', icon: <LuCircleDashed size={18} /> },
        // { id: 'tablepro', icon: <CiViewTable size={18} /> },
        { id: 'elev', icon: <GiElevator size={18} /> },
        { id: 'arrow', icon: <LuArrowDownUp size={18} /> },
        { id: 'calendar', icon: <HiOutlineCalendarDays size={18} /> },

    ]


    const configdata = {
        circle: {
            name: 'Biểu đồ tròn',
            w: "130",
            h: "130",
            setting: { deviceid: '0', cal: '8', max: 10, size: '15', color: '#673ab7', startcolor: "#e91e63", stop: "#673ab7", zindex: '0' },
            //visual: <Circle deviceid="001" tab="1" id="0" data={props.invt} setting={{ cal: '8', max: 10, size: '15', color: '#673ab7', startcolor: "#e91e63", stop: "#673ab7", zindex: '0' }} width='130' height='130' />
        },
        switch: {
            name: 'ON/OFF',
            w: "80",
            h: "80",
            setting: { deviceid: '0', on: '1', off: '0', stt: 'off', register: '0', cal: '0', size: '15', color: 'black', zindex: '0' },
            //visual: <Switch deviceid="001" tab="1" id="0" data={props.invt} setting={{ 0: { on: '1', cal: '0', off: '0', stt: 'on', register: '0', size: '15', color: 'black', zindex: '0' } }} width='80' height='80' />
        },
        switchtoggle: {
            name: 'ON/OFF 2.0',
            w: "200",
            h: "60",
            setting: { deviceid: '0', cal: '0', on: '1', off: '0', stt: 'off', register: '0', texton: "Bật", textoff: "Tắt", bgon: "#ffffff", bgoff: "#ffffff", txtcoloron: "#000000", txtcoloroff: "#000000", textsize: 20, border: "6", borderradius: "20", bordercolor: "#04da97", borderradiusicon: "0", zindex: '0' },
            //visual: <SwitchToggle deviceid="001" tab="1" id="0" data={props.invt} setting={{ 0: { cal: '0', on: '1', off: '0', stt: 'off', register: '0', texton: "Bật", textoff: "Tắt", bgon: "#ffffff", bgoff: "#ffffff", txtcoloron: "#000000", txtcoloroff: "#000000", textsize: 20, border: "6", borderradius: "20", bordercolor: "#04da97", borderradiusicon: "0", zindex: '0' } }} width='200' height='60' />
        },
        input: {
            name: 'Nhập liệu',
            w: "150",
            h: "40",
            setting: { deviceid: '0', register: '0', cal: '0', curr: '0', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' },
            //visual: <Input deviceid="001" tab="1" id="0" data={props.invt} setting={{ 0: { cal: '0', register: '0', curr: '0', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' } }} width='150' height='40' />
        },
        text: {
            name: 'Văn bản',
            w: "150",
            h: "40",
            setting: { link:'false',  deviceid: '0', loggerdataid:'0', text: 'Văn bản', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' },
            //visual: <Note deviceid="001" tab="1" id="0" data={props.invt} setting={{ text: 'Văn bản', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' }} width='150' height='40' />
        },
        view: {
            name: 'Số Thực X.X',
            w: "150",
            h: "40",
            setting: { deviceid: '0', base: '10', cal: '123', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' },
            //visual: <Value deviceid="001" tab="1" id="0" data={props.invt} setting={{ base: '10', cal: '123', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' }} width='150' height='40' />
        },
        slider: {
            name: 'Thanh Trượt',
            w: "600",
            h: "100",
            setting: { deviceid: '0', step: '10', min: '0', max: '100', cal: '30', register: '0', default: '30', ori: "horizontal", thumbbgcolor: "#1976d2", thumbradius: "0", trackbgcolor: "#1976d2", trackradius: "0", railbgcolor: "#1976d2", zindex: '0' },
            //visual: <Dimmer deviceid="001" tab="1" id="0" data={props.invt} setting={{ 0: { min: '0', max: '100', cal: '30', default: '30', step: '10', register: '0', ori: "horizontal", thumbbgcolor: "#1976d2", thumbradius: "0", trackbgcolor: "#1976d2", trackradius: "0", railbgcolor: "#1976d2", zindex: '0' } }} width='600' height='100' />
        },
        elev: {
            name: 'Thang máy',
            w: "300",
            h: "440",
            setting: { deviceid: '0', open: '1', close: '0', cal: '0', base: '10', zindex: '0' },
            //visual: <Elevroom deviceid="001" tab="1" id="0" data={props.invt} setting={{ door: '0', open: '1', close: '0', cal: '0', base: '10', zindex: '0' }} width='300' height='440' />
        },
        status: {
            name: 'Văn bản 2.0',
            w: "150",
            h: "40",
            setting: { deviceid: '0', data: { 0: { color: "#000000", text: "Văn bản 2.0" } }, size: '15', cal: '0', base: '10', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' },
            //visual: <Status deviceid="001" tab="1" id="0" data={props.invt} setting={{ data: { 0: { color: "#000000", text: "Văn bản 2.0" } }, size: '15', cal: '0', base: '10', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' }} width='150' height='40' />
        },
        view2: {
            name: 'Số Nguyên X',
            w: "150",
            h: "40",
            setting: { deviceid: '0', base: '10', cal: '123', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' },
            //visual: <Valuev2 deviceid="001" tab="1" id="0" data={props.invt} setting={{ base: '10', cal: '0', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' }} width='150' height='40' />
        },
        calendar: {
            name: 'Lịch',
            w: "150",
            h: "40",
            setting: { borderwidth: '1', date: '2022-01-01', pwd: '123456', size: '15', color: '#000000', align: "center", ispwd: 'false', justify: 'center', bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' },

        },
        arrow: {
            name: 'Mũi tên',
            w: "35",
            h: "35",
            setting: { deviceid: '0', base: '10', cal: '0', animation: '0', direct: 'down', zindex: '0' },
            //visual: <Arrow deviceid="001" tab="1" id="0" data={props.invt} setting={{ base: '10', cal: '0', animation: '0', direct: 'down', zindex: '0' }} width='35' height='35' />
        },
        led: {
            name: 'LED',
            w: "50",
            h: "50",
            setting: { deviceid: '0', data: { 0: { color: "white" } }, cal: '0', base: '10', text: '', zindex: '0' },
            //visual: <Led deviceid="001" tab="1" id="0" data={props.invt} setting={{ data: { 0: { color: "white" } }, cal: '0', base: '10', text: '', zindex: '0' }} width='50' height='50' />
        },
        icon: {
            name: 'Icon',
            w: "60",
            h: "60",
            setting: { deviceid: '0', data: { 0: { color: "#000000" } }, cal: '0', base: '10', img: "Icon", zindex: '0' },
            //visual: <Icon deviceid="001" tab="1" id="0" data={props.invt} setting={{ data: { 0: { color: "#000000" } }, cal: '0', base: '10', img: "Icon", zindex: '0' }} width='60' height='60' />
        },
        picture: {
            name: 'Hình ảnh',
            w: "300",
            h: "300",
            setting: { deviceid: '0', pic: 'valve', zindex: '0' },
            //visual: <Picture deviceid="001" tab="1" id="0" data={props.invt} setting={{ pic: 'valve', zindex: '0' }} width='300' height='300' />
        },
        image: {
            name: 'Hình nền',
            w: "300",
            h: "300",
            setting: { pic: '/dat_picture/Embody_APP_22.jpg', zindex: '0' },
            visual: <Img deviceid="001" tab="1" id="0" data={props.invt} setting={{ pic: '/dat_picture/Embody_APP_22.jpg', zindex: '0' }} width='300' height='300' />
        },
        lineChart: {
            name: 'Biểu đồ đ.thẳng',
            w: "800",
            h: "400",
            setting: { deviceid: '0', step: '1', fill: 'true', xlb: "Thời gian", ylb: "Dữ liệu", dataset: [{ label: 'Dữ liệu 1', fill: 'true', lineTension: 0.5, backgroundColor: 'rgba(255,99,132,0.5)', borderColor: 'rgba(255,99,132,0.5)', cal: '10', zindex: '0' }] },
            //visual: <LineChart deviceid="001" tab="1" id="0" data={props.invt} setting={{ step: "1", fill: true, xlb: "Thời gian", ylb: "Dữ liệu", dataset: [{ label: 'Dữ liệu 1', fill: 'true', lineTension: 0.5, backgroundColor: 'rgba(255,99,132,0.5)', borderColor: 'rgba(255,99,132,0.5)', cal: '10', zindex: '0' }] }} width='800' height='400' />
        },
        gauge: {
            name: 'Đồng hồ',
            w: "500",
            h: "300",
            setting: { deviceid: '0', cal: '30', label: "Dữ liệu", unit: "unit", valuesize: "20", valuecolor: "#000000", min: 0, max: 100, segment: 10, needlecolor: "#ff0000", startcolor: "#60d277", endcolor: "#dc0909", zindex: '0' },
            //visual: <Gauge deviceid="001" tab="1" id="0" data={props.invt} setting={{ cal: '30', label: "Dữ liệu", unit: "unit", valuesize: "20px", valuecolor: "#000000", min: 0, max: 100, segment: 10, needlecolor: "#ff0000", startcolor: "#60d277", endcolor: "#dc0909", zindex: '0' }} width='500' height='300' />
        },

        tablepro: {
            name: 'Bảng dữ liệu',
            w: "500",
            h: "104",
            setting: { deviceid: '0', data: [{ id: 1, val_1: 0, },], head: [{ name: "STT", code: "id", }, { name: "Giá Trị 1", code: "val_1", },], row: 2, col: 2, zindex: '0' },
            //visual: <Tablepro deviceid="001" tab="1" id="0" data={props.invt} setting={{ data: [{ id: 1, val_1: 0, },], head: [{ name: "STT", code: "id", }, { name: "Giá Trị 1", code: "val_1", },], row: 2, col: 2, zindex: '0' }} width='500' height='104' />
        },
        view32bit: {
            name: 'số 32bit',
            w: "200",
            h: "40",
            setting: { deviceid: '0', cal: ['10', '10'], type: 'int', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' },
            //visual: <View32bit deviceid="001" tab="1" id="0" data={props.invt} setting={{ cal: ['10', '10'], type: 'int', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' }} width='200' height='40' />
        },


        timer: {
            name: 'Chu trình',
            w: "800",
            h: "650",
            setting: {
                deviceid: '0',
                1: { time: "00:00:00", value: "0", input: "0" },
                2: { time: "00:00:00", value: "0", input: "0" },
                3: { time: "00:00:00", value: "0", input: "0" },
                4: { time: "00:00:00", value: "0", input: "0" },
                5: { time: "00:00:00", value: "0", input: "0" },
                6: { time: "00:00:00", value: "0", input: "0" },
                7: { time: "00:00:00", value: "0", input: "0" },
                8: { time: "00:00:00", value: "0", input: "0" },
                unit: '',
                register: "0",
                cal: "0",
                enable: "1",
                zindex: '0'
            },

            // visual: <Timer deviceid="001" tab="1" id="0" data={props.invt}

            //     setting={{
            //         1: { time: "00:00:00", value: "0", input: "0" },
            //         2: { time: "00:00:00", value: "0", input: "0" },
            //         3: { time: "00:00:00", value: "0", input: "0" },
            //         4: { time: "00:00:00", value: "0", input: "0" },
            //         5: { time: "00:00:00", value: "0", input: "0" },
            //         6: { time: "00:00:00", value: "0", input: "0" },
            //         7: { time: "00:00:00", value: "0", input: "0" },
            //         8: { time: "00:00:00", value: "0", input: "0" },
            //         unit: '',
            //         register: "0",
            //         cal: "0",
            //         enable: "1",
            //         zindex: '0'
            //     }}
            //     width='800' height='650'
            // />


        },
    }



    const visdata = (type, id, w, h) => {


        switch (type) {
            case 'circle':
                return <Circle id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'lineChart':
                return <LineChart id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'switch':
                return <Switch plantid={props.id} deviceid={overview_setting[id].deviceid} tab="0" id={id} data={invt} setting={overview_setting} width={w} height={h} />
            case 'switchtoggle':
                return <SwitchToggle plantid={props.id} deviceid={overview_setting[id].deviceid} tab="0" id={id} data={invt} setting={overview_setting} width={w} height={h} />
            case 'input':
                return <Input plantid={props.id} deviceid={overview_setting[id].deviceid} tab="0" id={id} data={invt} setting={overview_setting} width={w} height={h} />
            case 'text':
                return <Note  id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'view':
                return <Value id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'view2':
                return <Valuev2 id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'slider':
                return <Dimmer plantid={props.id} deviceid={overview_setting[id].deviceid} tab="0" id={id} data={invt} setting={overview_setting} width={w} height={h} />
            case 'elev':
                return <Elevroom id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'status':
                return <Status id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'arrow':
                return <Arrow id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'led':
                return <Led id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'icon':
                return <Icon id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'timer':
                return <Timer id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'gauge':
                return <Gauge id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'tablepro':
                return <Tablepro id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'picture':
                return <Picture id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'image':
                return <Img id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'view32bit':
                return <View32bit id={id} data={invt} setting={overview_setting[id]} width={w} height={h} />
            case 'calendar':
                return <Calendar plantid={props.id} deviceid={overview_setting[id].deviceid} tab="0" id={id} data={invt} setting={overview_setting} width={w} height={h} />
            default:
                return <></>
        }


    }

    useEffect(() => {
        //console.log(props.invt)
        setInvt(props.invt)
    }, [props])

    useEffect(() => {
        dragGroupOV.value = false
        dragStateOV.value = false
        ElementOV.value = 'X_None'
        ListElementOV.value = []
        offsetOV.value = { x: 0, y: 0 }
        historyOV.value = []

        const getStore = async () => {
            // await axios.post(host.DEVICE + "/getStorage", { user: manager }, { withCredentials: true }).then(
            //     function (res) {
            //         //console.log("store", res.data)
            //         setDatastore(res.data)

            //     })
            // console.log(usr)
            let res = await callApi("post", host.DATA + "/getplantStorage", {
                usr: usr,
            })
            console.log(res)
            if (res.status) {
                let x = res.data.sort((a, b) => a.id_ - b.id_)
                setDatastore(x)
            }


        }

        getStore()
    }, [])
    //Bật/tắt menu
    const handleMenu = (event) => {
        if (dropdowm) {
            setDropdown(false)
        } else {
            setDropdown(true)
        }

    }

    //Di chuyển: 1A.chọn thành phần muốn Thêm
    const handleType = (e) => {
        //console.log(e.currentTarget.id)
        coppyState.value = 0
        const type = e.currentTarget.id;
        overview_setting[parseInt(overview_lastid) + 1] = configdata[type].setting
        overviewDispatch({ type: "LOAD_VISUAL", payload: [...overview_visual, { id: parseInt(overview_lastid) + 1, type: type, w: configdata[type].w, h: configdata[type].h, x: 20, y: 20 }] })
        overviewDispatch({ type: "SET_LASTID", payload: parseInt(overview_lastid) + 1 })
    }



    const handleExit = (e) => {
        coppyState.value = 0
        overviewDispatch({ type: "SET_CONFIG", payload: false })
    }

    const handleSave = async (e) => {
        coppyState.value = 0
        overviewDispatch({ type: "SET_CONFIG", payload: false })
        console.log(props.id)

        let res = await callApi("post", host.DATA + "/updatePlantMonitor", {
            id: props.id,
            data: { data: overview_visual, id: overview_lastid },
            setting: overview_setting
        })

        console.log(res)

        // axios.post(host.DEVICE + "/setMonitorProject", { id: props.id, data: '{"data": ' + JSON.stringify(overview_visual) + ',"id":"' + overview_lastid + '"}' }, { secure: true, reconnect: true }).then(
        //     function (res) {

        //         if (res.data) {
        //             console.log(res.data)
        //             axios.post(host.DEVICE + "/setRegisterProject", { id: props.id, data: JSON.stringify(overview_setting) }, { secure: true, reconnect: true }).then(
        //                 function (res) {
        //                     if (res.data) {
        //                         console.log("save dat visual", res.data)
        //                         // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
        //                     } else {
        //                         // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
        //                     }

        //                 })

        //         } else {
        //             // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
        //         }

        //     }
        // )
    }



    const handleSetting = (ID) => {

        var typearr = ID.split("_")
        //console.log(typearr)
        let obj = overview_visual.find(obj => obj.id == typearr[0])
        //console.log(obj)
        overview_control.stt = true
        overview_control.id = typearr[0]
        overview_control.type = obj.type
        overview_control.w = obj.w
        overview_control.h = obj.h
        overviewDispatch({ type: "SET_CONFIG", payload: overview_control })

        console.log(overview_control)

    }

    const handleStart = (e) => {
        setDropdown(false)
        // console.log(e.target.id)
     
        let arr = e.target.id.split("_")
        let svg = document.getElementById("OVERVIEW_SVG")
        let point = svg.getBoundingClientRect()
        if (arr[arr.length - 1] !== 'SVG' && arr[arr.length - 1] !== 'Edit') {

            if (e.shiftKey) {

                let NewList = ListElementOV.value.filter(item => item.obj == `${arr[0]}_Drag`)
                if (NewList.length === 0) {
                    ListElementOV.value.push({ obj: `${arr[0]}_Drag`, offset: { x: 0, y: 0 } })
                    let obj = document.getElementById(`${arr[0]}_Drag`)
                    obj.style.border = "solid 2px rgb(54, 148, 255)"
                } else {
                    ListElementOV.value = ListElementOV.value.filter(item => item.obj != `${arr[0]}_Drag`)
                    let obj = document.getElementById(`${arr[0]}_Drag`)
                    obj.style.border = "dashed 1px #326ba8"
                }
                dragGroupOV.value = true
            } else {

                if (dragGroupOV.value) {
                    historyOV.value.push(overview_visual)
                    ElementOV.value = `${arr[0]}_Drag`
                    ListElementOV.value.map(
                        item => {
                            let obj_ = document.getElementById(item.obj)
                            item.offset = { x: e.clientX - point.left - obj_.getAttributeNS(null, 'x'), y: e.clientY - point.top - obj_.getAttributeNS(null, 'y') }
                            // if (e.ctrlKey) {
                            //     svg.prepend(obj_)
                            // } else {
                            //     svg.appendChild(obj_)
                            // }
                        }
                    )
                    dragStateOV.value = true
                    console.log(ListElementOV.value)
                } else {
                    historyOV.value.push(overview_visual)
                    let obj = document.getElementById(`${arr[0]}_Drag`)
                    if (!obj) return
                    obj.style.border = "solid 2px rgb(54, 148, 255)"
                    ElementOV.value = `${arr[0]}_Drag`
                    dragStateOV.value = true
                    offsetOV.value = { x: e.clientX - point.left - obj.getAttributeNS(null, 'x'), y: e.clientY - point.top - obj.getAttributeNS(null, 'y') }
                    //console.log("Drag", e.ctrlKey)
                    if (e.ctrlKey) {
                        svg.prepend(obj)
                    } else {
                        svg.appendChild(obj)
                    }

                }

            }





        }

        if (arr[arr.length - 1] === 'Edit') {
            handleSetting(e.target.id)
        }

    }

    const handleDrag = (e) => {
        let svg = document.getElementById("OVERVIEW_SVG")
        let point = svg.getBoundingClientRect()
        let coordnates = [parseFloat(e.clientX - point.left), parseFloat(e.clientY - point.top)]
        if (dragStateOV.value) {
            if (dragGroupOV.value) {
                ListElementOV.value.map(
                    (item) => {
                        let obj_ = document.getElementById(item.obj)
                        obj_.setAttributeNS(null, 'x', coordnates[0] - item.offset.x)
                        obj_.setAttributeNS(null, 'y', coordnates[1] - item.offset.y)
                    }
                )
            } else {


                let obj = document.getElementById(ElementOV.value)
                obj.setAttributeNS(null, 'x', coordnates[0] - offsetOV.value.x)
                obj.setAttributeNS(null, 'y', coordnates[1] - offsetOV.value.y)
            }
        }
    }

    const handleStop = (e) => {
        if (ElementOV.value !== 'X_None') {
            // let newvis = [...overview_visual]
            if (dragGroupOV.value) {
                dragStateOV.value = false
                let newvis = [...overview_visual]
                ListElementOV.value.map(
                    (item, i) => {
                        let arr = item.obj.split("_")
                        let index = newvis.findIndex(x => x.id == arr[0])

                        let obj_ = document.getElementById(item.obj)
                        obj_.style.border = "dashed 1px #326ba8"

                        let data = { ...newvis[index] }
                        data = {
                            ...data,
                            x: parseFloat(obj_.getAttributeNS(null, 'x')),
                            y: parseFloat(obj_.getAttributeNS(null, 'y'))
                        }

                        // let newvis = [...overview_visual]
                        newvis = newvis.filter(data => data.id != arr[0])
                        newvis.push(data)

                        if (i === ListElementOV.value.length - 1) {
                            overviewDispatch({ type: "LOAD_VISUAL", payload: newvis })
                        }

                        // overviewDispatch({ type: "LOAD_VISUAL", payload: newvis })
                    }
                )
                ListElementOV.value = []
                dragGroupOV.value = false
                // overviewDispatch({ type: "LOAD_VISUAL", payload: overview_visual })


            } else {

                dragStateOV.value = false


                let arr = ElementOV.value.split("_")
                idDrag.value = arr[0]
                let obj = document.getElementById(ElementOV.value)

                obj.style.border = "dashed 1px #326ba8"
                //console.log(overview_visual)
                let index = overview_visual.findIndex(x => x.id == arr[0])
                let data = { ...overview_visual[index] }
                data = {
                    ...data,
                    x: parseFloat(obj.getAttributeNS(null, 'x')),
                    y: parseFloat(obj.getAttributeNS(null, 'y'))
                }



                // let newvis = [...newvis] //coppy old array
                let newvis = [...overview_visual]
                newvis = newvis.filter(data => data.id != arr[0])
                if (e.ctrlKey) {
                    newvis.unshift(data)
                } else {
                    newvis.push(data)
                }

                overviewDispatch({ type: "LOAD_VISUAL", payload: newvis })




            }

            ElementOV.value = "X_None"

        }
    }

    const handleAlign = (e) => {
        let arr = e.currentTarget.id.split("_")
        idDrag.value = 0
        //console.log(arr[1], ListElement.value)
        let newVis = []
        ListElementOV.value.map(
            (item) => {

                let arr = item.obj.split("_")
                newVis = [...newVis, overview_visual.find(x => x.id == arr[0])]

            }
        )
        let Vis = [...overview_visual]
        historyOV.value.push(overview_visual)

        if (arr[1] == 'Top') {

            let smallestY = Math.min(...newVis.map(p => p.y))

            ListElementOV.value.map(
                (item, i) => {
                    let arr = item.obj.split("_")
                    let index = Vis.findIndex(x => x.id == arr[0])
                    let obj_ = document.getElementById(item.obj)
                    obj_.setAttributeNS(null, 'y', smallestY)
                    //visual[props.tab][index] = { ...visual[props.tab][index], y: smallestY }
                    let data = { ...Vis[index] }
                    data = {
                        ...data,
                        x: parseFloat(obj_.getAttributeNS(null, 'x')),
                        y: smallestY
                    }
                    Vis = Vis.filter(data => data.id != arr[0])
                    Vis.push(data)
                    if (i === ListElementOV.value.length - 1) {
                        overviewDispatch({ type: "LOAD_VISUAL", payload: Vis })
                    }


                }
            )
        }
        if (arr[1] == 'Left') {
            let smallestX = Math.min(...newVis.map(p => p.x))

            ListElementOV.value.map(
                (item, i) => {
                    let arr = item.obj.split("_")
                    let index = Vis.findIndex(p => p.id == arr[0])
                    let obj_ = document.getElementById(item.obj)
                    obj_.setAttributeNS(null, 'x', smallestX)
                    //visual[props.tab][index] = { ...visual[props.tab][index], x: smallestX }
                    let data = { ...Vis[index] }
                    data = {
                        ...data,
                        x: smallestX,
                        y: parseFloat(obj_.getAttributeNS(null, 'y'))
                    }
                    Vis = Vis.filter(data => data.id != arr[0])
                    Vis.push(data)
                    if (i === ListElementOV.value.length - 1) {
                        overviewDispatch({ type: "LOAD_VISUAL", payload: Vis })
                    }

                    // overviewDispatch({ type: "LOAD_VISUAL", payload: Vis })

                }
            )
        }

        if (arr[1] == 'Bottom') {
            //console.log(newVis.sort((prev, curr) =>   parseFloat(curr.y + curr.h)- parseFloat(prev.y + prev.h)))
            let largest = newVis.reduce((prev, current) => (prev.y + prev.h) > (current.y + current.h) ? prev : current, newVis[0]);

            let largestY = parseFloat(largest.y) + parseFloat(largest.h)
            ListElementOV.value.map(
                (item, i) => {
                    let arr = item.obj.split("_")
                    let index = Vis.findIndex(x => x.id == arr[0])
                    let obj_ = document.getElementById(item.obj)
                    obj_.setAttributeNS(null, 'y', largestY - parseFloat(obj_.getAttribute('height')))

                    let data = { ...Vis[index] }
                    data = {
                        ...data,
                        x: parseFloat(obj_.getAttributeNS(null, 'x')),
                        y: largestY - parseFloat(obj_.getAttribute('height'))
                    }
                    Vis = Vis.filter(data => data.id != arr[0])
                    Vis.push(data)
                    if (i === ListElementOV.value.length - 1) {
                        overviewDispatch({ type: "LOAD_VISUAL", payload: Vis })
                    }
                    // overviewDispatch({ type: "LOAD_VISUAL", payload: Vis })

                }
            )
        }
        if (arr[1] == 'Right') {
            let largest = newVis.sort((prev, curr) => (curr.x + curr.w) - (prev.x + prev.w))[0];

            let largestX = parseFloat(largest.x) + parseFloat(largest.w)
            ListElementOV.value.map(
                (item, i) => {
                    let arr = item.obj.split("_")
                    let index = Vis.findIndex(x => x.id == arr[0])
                    let obj_ = document.getElementById(item.obj)
                    obj_.setAttributeNS(null, 'x', largestX - parseFloat(obj_.getAttribute('width')))
                    //visual[props.tab][index] = { ...visual[props.tab][index], x: largestX - parseFloat(obj_.getAttribute('width')) }

                    let data = { ...Vis[index] }
                    data = {
                        ...data,
                        x: largestX - parseFloat(obj_.getAttribute('width')),
                        y: parseFloat(obj_.getAttributeNS(null, 'y'))
                    }
                    Vis = Vis.filter(data => data.id != arr[0])
                    Vis.push(data)
                    if (i === ListElementOV.value.length - 1) {
                        overviewDispatch({ type: "LOAD_VISUAL", payload: Vis })
                    }
                    // overviewDispatch({ type: "LOAD_VISUAL", payload: Vis })



                }
            )
        }






    }


    const handlePast = (e) => {

        // console.log(coppyVisual.value, coppySetting.value)
        var newlastid = parseInt(overview_lastid) + 1

        // console.log(console.overview_setting)

        let setting = { ...overview_setting }
        setting = {
            ...setting,
            [newlastid]: coppySetting.value
        }

        let visual = [...overview_visual]
        visual = [
            ...visual,
            { id: newlastid, type: coppyVisual.value.type, w: coppyVisual.value.w, h: coppyVisual.value.h, x: coppyVisual.value.x + 20, y: coppyVisual.value.y + 20 }
        ]

        coppyVisual.value = { id: newlastid, type: coppyVisual.value.type, w: coppyVisual.value.w, h: coppyVisual.value.h, x: coppyVisual.value.x + 20, y: coppyVisual.value.y + 20 }

        console.log(newlastid, setting, visual)
        overviewDispatch({ type: "SET_LASTID", payload: newlastid })
        overviewDispatch({ type: "LOAD_SETTING", payload: setting })
        overviewDispatch({ type: "LOAD_VISUAL", payload: visual })



        // coppyState.value = 0

    }

    const handleStartResize = (e) => {

        let svg = document.getElementById("OVERVIEW_SVG")
        let point = svg.getBoundingClientRect()

        // console.log(e.target)
        offsetResize.value = {
            x: e.clientX - point.left,
            y: e.clientY - point.top
        }
        dragStateResize.value = true

        idResize.value = e.currentTarget.id

    }

    const handleDragResize = (e) => {
        let svg = document.getElementById("OVERVIEW_SVG")
        let point = svg.getBoundingClientRect()
        if (dragStateResize.value) {
            let coordnates = [parseFloat(e.clientX - point.left), parseFloat(e.clientY - point.top)]
            let arr = idResize.value.split("_")
            let resize = document.getElementById(idResize.value)
            let obj = document.getElementById(arr[0] + "_Drag")
            var w = parseFloat(obj.getAttributeNS(null, 'width'));
            var h = parseFloat(obj.getAttributeNS(null, 'height'));
            let objx = parseFloat(obj.getAttributeNS(null, 'x'));
            let objy = parseFloat(obj.getAttributeNS(null, 'y'));

            // if(w<50 || h<30){
            //     w = 50
            //     h = 30
            //     dragStateResize.value = false
            // }


            obj.setAttributeNS(null, 'width', w + (coordnates[0] - offsetResize.value.x))
            obj.setAttributeNS(null, 'height', h + (coordnates[1] - offsetResize.value.y))


            resize.setAttributeNS(null, 'x', objx + (w - 12))
            resize.setAttributeNS(null, 'y', objy + (h - 12))

            offsetResize.value = {
                x: coordnates[0],
                y: coordnates[1]
            }

        }
    }

    const handleStopResize = (e) => {
        if (!dragStateResize.value) return
        dragStateResize.value = false
        let arr = idResize.value.split("_")
        // console.log(arr)
        let obj = document.getElementById(arr[0] + "_Drag")
        if (!obj) return;

        let index = overview_visual.findIndex(x => x.id == arr[0])
        let data = { ...overview_visual[index] }
        // console.log(data)
        data = {
            ...data,
            w: parseFloat(obj.getAttributeNS(null, 'width')),
            h: parseFloat(obj.getAttributeNS(null, 'height'))
        }
        let newvis = [...overview_visual] //coppy old array
        newvis = newvis.filter(data => data.id != arr[0])

        newvis.push(data)

        overviewDispatch({ type: "LOAD_VISUAL", payload: newvis })

        // let index = visual[props.tab].findIndex(x => x.id == arr[0])
        // let data = { ...visual[props.tab][index] }
        // console.log(data)
        // data = {
        //     ...data,
        //     w: w,
        //     h: h
        // }
        // visual[props.tab] = visual[props.tab].filter(data => data.id != arr[0])
        // visual[props.tab].push(data)

        // toolDispatch({
        //     type: "LOAD_VISUAL", payload: { tab: props.tab, visual: visual[props.tab] }
        // })

    }

    useEffect(() => {

        const handleKeyDown = (event) => {
            //event.preventDefault();
            const code = event.which || event.keyCode;
            let charCode = String.fromCharCode(code).toLowerCase();
            if ((event.ctrlKey || event.metaKey) && charCode === 'z') {

                if (historyOV.value.length > 0) {
                    historyOV.value[historyOV.value.length - 1].map(
                        item => {
                            let obj = document.getElementById(`${item.id}_Drag`)
                            obj.setAttributeNS(null, 'x', item.x)
                            obj.setAttributeNS(null, 'y', item.y)
                            item.x = parseFloat(obj.getAttribute('x'))
                            item.y = parseFloat(obj.getAttribute('y'))
                        }
                    )
                    overviewDispatch({ type: "LOAD_VISUAL", payload: historyOV.value[historyOV.value.length - 1] })
                    historyOV.value.pop()

                }
                //console.log("history new", history.value)



            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [])

    const handleOpenStore = () => {
        if (store) {
            setStore(false)
        } else {
            setStore(true)
        }
    }

    //Storage add
    const handleStorage = async (e) => {
        e.preventDefault();
        const arr = e.currentTarget.id.split("_")
        const data = { id: overview_lastid, data: overview_visual }
        const setting_ = overview_setting
        console.log(storename.current.value, data, setting_)


        let res = await callApi("post", host.DATA + "/addplantStorage", {
            name: storename.current.value,
            data: data,
            setting: setting_,
            usr: usr
        })

        console.log(res)
        if (res.status) {
            alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
            setDatastore([...datastore, { id_: res.data, name_: storename.current.value, data_: data, setting_: setting_, usr_: usr }])
        }



    }

    //Storage remove
    const handleRemoveStore = async (e) => {
        let id = e.currentTarget.id
        let res = await callApi("post", host.DATA + "/dropplantStorage", { id: e.currentTarget.id })
        // console.log(res)
        if (res.status) {
            let newStore = datastore
            newStore = newStore.filter(data => data.id_ != id)
            // console.log(newStore)
            setDatastore([...newStore])
            alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
        }

    }

    //Storage ?
    const handleOpenGetStore = (e) => {


        if (getstore) {
            setGetstore(false)
        } else {
            setGetstore(true)
            let arr = e.currentTarget.id.split("_")
            console.log(arr)
            var newStore = datastore
            newStore = newStore.find(data => data.id_ == arr[1])
            document.getElementById("storename").value = newStore.name_
            setIdstorage(newStore.id_)

        }
    }

    //Storage ?
    const handleGetStore = (e) => {
        e.preventDefault();
        const arr = e.currentTarget.id.split("_")
        var newStore = datastore
        newStore = newStore.find(data => data.id_ == arr[1])

        console.log(newStore)


        overviewDispatch({ type: "SET_LASTID", payload: newStore.data_.id })
        overviewDispatch({ type: "LOAD_VISUAL", payload: newStore.data_.data })
        overviewDispatch({ type: "LOAD_SETTING", payload: newStore.setting_ })

    }

    //Storage update name
    const handleUpdateStore = async (e) => {
        e.preventDefault();
        let newStore = datastore
        let index = newStore.findIndex(x => x.id_ == idstorage)
        newStore[index] = { ...newStore[index], name_: document.getElementById("storename").value }
        setDatastore([...newStore])

        const res = await callApi("post", host.DATA + "/updateplantStorage", { id: idstorage, name: document.getElementById("storename").value })
        console.log(res)

    }


    return (
        <div className="DAT_TlOverview"
        // onMouseEnter={(e) => { disableScroll.on() }}
        // onMouseLeave={(e) => { disableScroll.off() }}

        >



            <div className="DAT_TlOverviewMenu" style={{ display: (coppyState.value) ? "block" : "none", top: '10px', right: '50px' }} onClick={(event) => { handlePast(event) }}>
                <ion-icon name="clipboard-outline"></ion-icon>
            </div>

            {dragGroupOV.value
                ? <>
                    <div className="DAT_Align" style={{ top: '10px', right: '10px' }} id="Align_Top" onClick={(event) => { handleAlign(event) }}>
                        <CiAlignTop size={25} />
                    </div>
                    <div className="DAT_Align" style={{ top: '50px', right: '10px' }} id="Align_Bottom" onClick={(event) => { handleAlign(event) }}>
                        <CiAlignBottom size={25} />
                    </div>
                    <div className="DAT_Align" style={{ top: '90px', right: '10px' }} id="Align_Left" onClick={(event) => { handleAlign(event) }}>
                        <CiAlignLeft size={25} />
                    </div>
                    <div className="DAT_Align" style={{ top: '130px', right: '10px' }} id="Align_Right" onClick={(event) => { handleAlign(event) }}>
                        <CiAlignRight size={25} />
                    </div>

                </>
                : <>
                    <div className="DAT_TlOverviewMenu" style={{ top: "50px", right: "10px" }} onClick={(event) => { handleMenu(event) }}>
                        <IoMdMore size={20} />
                    </div>
                    <div className="DAT_Editor" style={{ top: '10px', right: '10px' }} onClick={(event) => { handleExit(event) }}>
                        <IoMdClose size={20} />
                    </div>
                    <div className="DAT_Editor" style={{ top: '90px', right: '10px' }} onClick={(event) => { handleSave(event) }}>
                        <IoSave size={20} color="rgb(10, 10, 255,0.7)" />
                    </div>

                    <div className="DAT_Editor" style={{ top: '170px', right: '10px' }} onClick={(event) => { handleOpenStore(event) }}>
                        <AiOutlineAppstoreAdd size={20} />
                    </div>
                </>
            }



            {/* <div className="DAT_Align" style={{ display: (dragGroupOV.value) ? "block" : "none", top: '10px', right: '10px' }} id="Align_Top" onClick={(event) => { handleAlign(event) }}>
                <CiAlignTop size={25} />
            </div>
            <div className="DAT_Align" style={{ display: (dragGroupOV.value) ? "block" : "none", top: '50px', right: '10px' }} id="Align_Bottom" onClick={(event) => { handleAlign(event) }}>
                <CiAlignBottom size={25} />
            </div>
            <div className="DAT_Align" style={{ display: (dragGroupOV.value) ? "block" : "none", top: '90px', right: '10px' }} id="Align_Left" onClick={(event) => { handleAlign(event) }}>
                <CiAlignLeft size={25} />
            </div>
            <div className="DAT_Align" style={{ display: (dragGroupOV.value) ? "block" : "none", top: '130px', right: '10px' }} id="Align_Right" onClick={(event) => { handleAlign(event) }}>
                <CiAlignRight size={25} />
            </div> */}


            <div className="DAT_ToolMenu" style={{ display: (dropdowm) ? "block" : "none", height: "450px" }}>

                <div className="DAT_ToolMenu-content">
                    <div className="DAT_ToolMenu-content-tit" style={{ backgroundColor: "rgb(255, 68, 68,0.5)" }} >Controller</div>
                    <div className="DAT_ToolMenu-content-group">
                        {control_.map((data, index) => (
                            <div className="DAT_ToolMenu-content-group-item" key={index} id={data.id} onClick={(event) => { handleType(event) }}>{data.icon}</div>
                        ))}
                    </div>
                </div>
                <div className="DAT_ToolMenu-content">
                    <div className="DAT_ToolMenu-content-tit" style={{ backgroundColor: "rgb(68, 87, 255,0.7)" }}>Text & Number</div>
                    <div className="DAT_ToolMenu-content-group">
                        {textxnumber_.map((data, index) => (
                            <div className="DAT_ToolMenu-content-group-item" key={index} id={data.id} onClick={(event) => { handleType(event) }}>{data.icon}</div>
                        ))}
                    </div>
                </div>

                <div className="DAT_ToolMenu-content">
                    <div className="DAT_ToolMenu-content-tit" style={{ backgroundColor: "rgb(97, 245, 92,0.7)" }}>Chart</div>
                    <div className="DAT_ToolMenu-content-group">
                        {chart_.map((data, index) => (
                            <div className="DAT_ToolMenu-content-group-item" key={index} id={data.id} onClick={(event) => { handleType(event) }}>{data.icon}</div>
                        ))}
                    </div>
                </div>

                <div className="DAT_ToolMenu-content">
                    <div className="DAT_ToolMenu-content-tit" style={{ backgroundColor: "rgb(96, 96, 96,0.5)" }}>Extension</div>
                    <div className="DAT_ToolMenu-content-group">
                        {extension_.map((data, index) => (
                            <div className="DAT_ToolMenu-content-group-item" key={index} id={data.id} onClick={(event) => { handleType(event) }}>{data.icon}</div>
                        ))}
                    </div>
                </div>



                {/* <div className="DAT_Tool_Menu-action" style={{ color: "red" }} onClick={(event) => { handleOpenRemove(event) }}>Xóa</div> */}
                {/* <div className="DAT_Tool_Menu-action" style={{ color: "green" }} id={props.id + "_" + props.tab + "_TAB"} onClick={(e) => handleDropTit(e)}>Đổi tên</div> */}
                {/* <div className="DAT_Tool_Menu-action" style={{ color: "green" }} onClick={(event) => { handleSave(event) }}>Lưu</div> */}
                {/* <div className="DAT_Tool_Menu-action" style={{ color: "green" }} onClick={(event) => { handleOpenStore(event) }}>Lưu vào kho </div>
    <div className="DAT_Tool_Menu-action" style={{ color: "green" }} onClick={(event) => { handleOpenGetStore(event) }}>Kho giao diện</div> */}
                {/* <div className="DAT_Tool_Menu-action" style={{ color: "green" }} onClick={(event) => { handledefault(event) }}>Trang mặc định </div> */}
                {/* <div className="DAT_Tool_Menu-action" style={{ color: "green" }} onClick={(event) => { handleExit(event) }}>Thoát</div> */}

            </div>

            <div className="DAT_ToolStore" style={{ display: (store) ? "block" : "none" }}>
                <div className="DAT_ToolStore-group">
                    <div className="DAT_ToolStore-group-close" onClick={(event) => { handleOpenStore(event) }}><ion-icon name="close-outline"></ion-icon></div>

                    <form className="DAT_ToolStore-group-action" id={props.id + "_STORE"} onSubmit={e => handleStorage(e)}>
                        <input type="text" ref={storename} minLength={8} required placeholder="Tên giao diện" ></input>
                        <button><IoMdAddCircleOutline size={20} color="gray" /></button>
                    </form>
                    <div className="DAT_ToolStore-group-list" >
                        {datastore.map((data, index) => {
                            return <div key={index} className="DAT_ToolStore-group-list-item" >
                                <div className="DAT_ToolStore-group-list-item-index" >{index + 1}</div>
                                <div className="DAT_ToolStore-group-list-item-name" id={`${props.id}_${data.id_}`} onClick={(e) => { handleGetStore(e) }}  >{data.name_}</div>
                                <div className="DAT_ToolStore-group-list-item-edit" ><CiEdit id={`${props.id}_${data.id_}`} onClick={(event) => { handleOpenGetStore(event) }} /><RiDeleteBin6Line id={`${data.id_}`} onClick={(event) => { handleRemoveStore(event) }} /></div>
                            </div>
                        })}
                    </div>
                </div>
            </div>

            <div className="DAT_ToolStore" style={{ display: (getstore) ? "block" : "none", }}>
                <div className="DAT_ToolStore-group" style={{ width: "300px" }}>
                    <div className="DAT_ToolStore-group-close" onClick={(event) => { handleOpenGetStore(event) }}><ion-icon name="close-outline"></ion-icon></div>
                    <form className="DAT_ToolStore-group-action" id={props.id + "_" + props.tab + "_STORE"} style={{ width: "250px" }} onSubmit={e => handleUpdateStore(e)}>
                        <input placeholder="Nhập tên mới" id="storename" ></input>
                        <button>Lưu</button>
                    </form>
                </div>
            </div>


            <div className="DAT_TlOverview_SVG">
                <div className="DAT_TlOverview_SVG-content" id="OVERVIEW_SVGCONTAINNER" >
                    <svg
                        id="OVERVIEW_SVG"
                        style={{ border: "solid 1px #326ba8", backgroundSize: '20px 20px', backgroundImage: 'linear-gradient(to right, rgba(152, 152, 152, 0.3) 1px, transparent 1px),linear-gradient(to bottom, rgba(152, 152, 152, 0.3) 1px, transparent 1px)' }}
                        className="DAT_TlOverview_SVG-content-view"
                        // onClick={(event) => { handlePut(event) }}
                        // onMouseMove={(event) => { handleMove(event) }}
                        onMouseDown={(event) => { handleStart(event) }}
                        onMouseMove={(event) => { handleDrag(event); handleDragResize(event) }}
                        onMouseUp={(event) => { handleStop(event); handleStopResize(event) }}
                    >
                        {overview_visual.map((data, index) => (
                            <React.Fragment key={data.id}>
                                <foreignObject
                                    x={data.x} y={data.y} width={data.w} height={data.h}
                                    style={{ border: "dashed 1px #326ba8" }}
                                    id={`${data.id}_Drag`}
                                   
                                >
                                    <div className="DAT_Edit" >
                                        <div className="DAT_Edit-view" id={data.id + "_" + data.type}></div>
                                        {visdata(data.type, data.id, data.w, data.h - 2)}
                                        <div className="DAT_Edit-setting"
                                        >
                                            <ion-icon name="ellipsis-horizontal-outline" id={`${data.id}_Edit`}></ion-icon>
                                        </div>
                                    </div>
                                </foreignObject>

                                {
                                    dragStateOV.value
                                    ? <></>
                                    :Number(idDrag.value) === Number(data.id)
                                    ? <foreignObject id={data.id + "_Resize"}
                                        onMouseDown={(e) => { handleStartResize(e) }}
                                        // onMouseUp={(event) => { handleStopResize(event) }}
                                        x={data.x + (data?.w - 15)} y={data.y + (data?.h - 15)} width="20px" height="20px">
                                        <div style={{ cursor: "nwse-resize", zIndex: 1, borderBottom: "dashed 3px red", borderRight: "dashed 3px red", width: "15px", height: "15px" }}></div>
                                    </foreignObject>
                                    :<></>
                                
                                }
                                {/* {dragStateOV.value
                                    ? <></>
                                    : <foreignObject id={data.id + "_Rezise"}
                                        onMouseDown={(e) => { handleStartResize(e) }}
                                        // onMouseUp={(event) => { handleStopResize(event) }}
                                        x={data.x + (data?.w - 15)} y={data.y + (data?.h - 15)} width="20px" height="20px">
                                        <div style={{ cursor: "nwse-resize", zIndex: 1, borderBottom: "dashed 3px red", borderRight: "dashed 3px red", width: "15px", height: "15px" }}></div>
                                    </foreignObject>
                                } */}
                            </React.Fragment>

                            

                        ))}

                    </svg>
                </div>
            </div>




        </div >
    )
}