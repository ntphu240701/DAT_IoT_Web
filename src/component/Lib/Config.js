/* eslint no-unused-vars: "off"*/
/* eslint eqeqeq: 0 */
import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import "./Tool.scss"
import { ToolContext } from "../Context/ToolContext";
import Circle from "./Circle";
import Switch from "./Switch";
import Input from "./Input";
import Note from "./Note";
import Value from "./Value";
import Dimmer from "./Dimmer";
import Elevroom from "./Elevroom";
import Status from "./Status";
import { useIntl } from "react-intl";
// import { AlertContext } from "../Context/AlertContext";
// import { action } from "../Control/Action";
import axios from "axios";
import { host } from "../Lang/Contant";
import { SettingContext } from "../Context/SettingContext";
import Valuev2 from "./Valuev2";
import Arrow from "./Arrow";
import Led from "./Led";
import Icon from "./Icon";
import Timer from "./Timer";
//import disableScroll from 'disable-scroll';
import LineChart from "./LineChart";
import Gauge from "./Gauge";
import Picture from "./Picture";
import SwitchToggle from "./SwitchToggle";
import { useSelector } from "react-redux";
import Tablepro from "./Tablepro";
import { coppyId, coppySetting, coppyState, coppyVisual } from "./Calculate";
import { Token, ruleInfor, view } from "../../App";
import View32bit from "./View32bit";
import { socket } from '../../App';
import { signal } from "@preact/signals-react";
import { CiAlignBottom, CiAlignLeft, CiAlignRight, CiAlignTop, CiEdit, CiViewTable } from "react-icons/ci";
import { RxInput, RxSlider } from "react-icons/rx";
import { IoBarChart, IoExit, IoInformation, IoSave, IoTextOutline, IoTimerOutline, IoToggle } from "react-icons/io5";
import { TbChartDonut2, TbCircleNumber1, TbDecimal, TbNumber0Small, TbTextSpellcheck } from "react-icons/tb";
import { GiChart, GiElevator } from "react-icons/gi";
import { LuArrowDownUp, LuCircleDashed, LuScrollText } from "react-icons/lu";
import { PiGaugeLight } from "react-icons/pi";
import { AiOutlineAppstore, AiOutlineAppstoreAdd, AiOutlinePicture } from "react-icons/ai";
import { VscFileBinary } from "react-icons/vsc";
import { MdDeleteForever, MdRadioButtonChecked } from "react-icons/md";
import { FaPager } from "react-icons/fa6";
import { IoMdAddCircleOutline, IoMdClose } from "react-icons/io";
import { callApi } from "../Api/Api";
import { alertDispatch } from "../Alert/Alert";
import { deviceData } from "../Control/Device";
import { RiDeleteBin6Line } from "react-icons/ri";
import { scales } from "chart.js";
import PopupState, { bindHover, bindPopper } from "material-ui-popup-state";
import { Fade, Paper, Popper, Typography } from "@mui/material";
import Img from "./Img";
import Multitext from "./Multitext";
import Moveable from "react-moveable";
import Selecto from "react-selecto";
import Calendar from "./Calendar";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import BarChart from "./BarChart";


const dragGroup = signal(false)
const dragState = signal(false)
const Element = signal('X_None')
const ListElement = signal([])
const offset = signal({ x: 0, y: 0 })
const history = signal([])
const idResize = signal('')
const idSize = signal('')
const offsetResize = signal({ x: 0, y: 0 })
const dragStateResize = signal(false)
const idDrag = signal('0')

const dragableState = signal(false)
const dragableID = signal('')

export default function Config(props) {
    const usr = useSelector((state) => state.admin.usr)
    //const { token } = useContext(EnvContext);
    //const intervalIDRef = useReducer(null);
    const [invt, setInvt] = useState()
    // const { alertDispatch } = useContext(AlertContext);
    const dataLang = useIntl();
    //const [data, setData] = useState()
    const { settingDispatch } = useContext(SettingContext)
    const { control, config, setting, visual, name, lastid, toolDispatch } = useContext(ToolContext)
    const [dropdowm, setDropdown] = useState(false)
    // const [singlevisualDATA, setSinglevisualDATA] = useState({ id: 0, type: '', w: '', h: '' })
    // const [createSVG, setCreateSVG] = useState(false)        // trạng thái tạo dữ liệu trên SVG
    // const [visualeditDATA, setVisualeditDATA] = useState([])         // giao diện di chuyển theo chuột
    const [typeSVG, setTypeSVG] = useState('')               // loại dữ liệu muốn tạo
    // const [moveforwhat, setMoveforwhat] = useState('')               // loại dữ liệu muốn tạo
    const [tit, setTit] = useState(false)
    const [remove, setRemove] = useState(false)
    const [datastore, setDatastore] = useState([])
    const [store, setStore] = useState(false)
    const [getstore, setGetstore] = useState(false)
    const storename = useRef()
    const [idstorage, setIdstorage] = useState(0)

    const [targets, setTargets] = useState([]);
    const moveableRef = useRef(null);
    const selectoRef = useRef(null);


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

    // const content = ['switch', 'switchtoggle', 'input', 'text', 'status', 'view', 'view2', 'slider', 'elev', 'arrow', 'led', 'icon', 'timer', 'lineChart', 'circle', 'gauge', 'picture', 'tablepro', 'view32bit']


    const control_ = [
        { id: 'switch', icon: <MdRadioButtonChecked size={18} />, name: 'Circle switch' },
        { id: 'switchtoggle', icon: <IoToggle size={18} />, name: 'Toggle switch' },
        { id: 'input', icon: <RxInput size={18} />, name: 'Input' },
        { id: 'slider', icon: <RxSlider size={18} />, name: 'Dimmer' },
        { id: 'timer', icon: <IoTimerOutline size={18} />, name: 'Timer' },

    ]

    const textxnumber_ = [

        { id: 'text', icon: <IoTextOutline size={18} />, name: 'Text' },
        { id: 'multitext', icon: <LuScrollText size={18} />, name: 'MultiText' },
        { id: 'status', icon: <TbTextSpellcheck size={18} />, name: 'Text 2.0' },
        { id: 'view', icon: <TbDecimal size={18} />, name: 'Float number' },
        { id: 'view2', icon: <TbNumber0Small size={18} />, name: 'Integer number' },
        { id: 'view32bit', icon: <VscFileBinary size={18} />, name: 'Word number' },
    ]

    const chart_ = [

        { id: 'lineChart', icon: <GiChart size={18} />, name: 'Line chart' },
        { id: 'barChart', icon: <IoBarChart size={18} />, name: 'Bar chart' },
        { id: 'circle', icon: <TbChartDonut2 size={18} />, name: 'Circle chart' },
        { id: 'gauge', icon: <PiGaugeLight size={18} />, name: 'Gauge chart' },

    ]

    const extension_ = [
        { id: 'image', icon: <AiOutlinePicture size={18} />, name: 'Image' },
        { id: 'icon', icon: <IoInformation size={18} />, name: 'Icon' },
        { id: 'led', icon: <LuCircleDashed size={18} />, name: 'LED' },
        // { id: 'tablepro', icon: <CiViewTable size={18} />, name: 'Table' },
        { id: 'elev', icon: <GiElevator size={18} />, name: 'Elevator pro' },
        { id: 'arrow', icon: <LuArrowDownUp size={18} />, name: 'Arrow' },
        { id: 'calendar', icon: <HiOutlineCalendarDays size={18} />, name: 'Calendar' },
    ]



    const configdata = {
        circle: {
            name: 'Biểu đồ tròn',
            w: "130",
            h: "130",
            setting: { cal: '8', max: 10, size: '15', color: '#673ab7', startcolor: "#e91e63", stop: "#673ab7", zindex: '0' },
            // visual: <Circle deviceid="001" tab="1" id="0" data={props.invt} setting={{ cal: '8', max: 10, size: '15', color: '#673ab7', startcolor: "#e91e63", stop: "#673ab7", zindex: '0' }} width='130' height='130' />
        },
        switch: {
            name: 'ON/OFF',
            w: "80",
            h: "80",
            setting: { on: '1', off: '0', stt: 'off', register: '0', cal: '0', size: '15', color: 'black', zindex: '0' },
            // visual: <Switch deviceid="001" tab="1" id="0" data={props.invt} setting={{ 0: { on: '1', cal: '0', off: '0', stt: 'on', register: '0', size: '15', color: 'black', zindex: '0' } }} width='80' height='80' />
        },
        switchtoggle: {
            name: 'ON/OFF 2.0',
            w: "200",
            h: "60",
            setting: { cal: '0', on: '1', off: '0', stt: 'off', register: '0', texton: "Bật", textoff: "Tắt", bgon: "#ffffff", bgoff: "#ffffff", txtcoloron: "#000000", txtcoloroff: "#000000", textsize: 20, border: "6", borderradius: "20", bordercolor: "#04da97", borderradiusicon: "0", zindex: '0' },
            // visual: <SwitchToggle deviceid="001" tab="1" id="0" data={props.invt} setting={{ 0: { cal: '0', on: '1', off: '0', stt: 'off', register: '0', texton: "Bật", textoff: "Tắt", bgon: "#ffffff", bgoff: "#ffffff", txtcoloron: "#000000", txtcoloroff: "#000000", textsize: 20, border: "6", borderradius: "20", bordercolor: "#04da97", borderradiusicon: "0", zindex: '0' } }} width='200' height='60' />
        },
        input: {
            name: 'Nhập liệu',
            w: "150",
            h: "40",
            setting: { borderwidth: '1', register: '0', cal: '0', curr: '0', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' },
            // visual: <Input deviceid="001" tab="1" id="0" data={props.invt} setting={{ 0: { borderwidth: '1', cal: '0', register: '0', curr: '0', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' } }} width='150' height='40' />
        },
        text: {
            name: 'Văn bản',
            w: "150",
            h: "40",
            setting: { borderwidth: '1', text: 'Văn bản', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' },
            // visual: <Note deviceid="001" tab="1" id="0" data={props.invt} setting={{ borderwidth: '1', text: 'Văn bản', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' }} width='150' height='40' />
        },
        view: {
            name: 'Số Thực X.X',
            w: "150",
            h: "40",
            setting: { borderwidth: '1', decimal: '1', base: '10', cal: '123', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' },
            // visual: <Value deviceid="001" tab="1" id="0" data={props.invt} setting={{ borderwidth: '1', decimal: '1', base: '10', cal: '123', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' }} width='150' height='40' />
        },
        slider: {
            name: 'Thanh Trượt',
            w: "600",
            h: "100",
            setting: { step: '10', min: '0', max: '100', cal: '30', register: '0', default: '30', ori: "horizontal", thumbbgcolor: "#1976d2", thumbradius: "0", trackbgcolor: "#1976d2", trackradius: "0", railbgcolor: "#1976d2", zindex: '0' },
            // visual: <Dimmer deviceid="001" tab="1" id="0" data={props.invt} setting={{ 0: { min: '0', max: '100', cal: '30', default: '30', step: '10', register: '0', ori: "horizontal", thumbbgcolor: "#1976d2", thumbradius: "0", trackbgcolor: "#1976d2", trackradius: "0", railbgcolor: "#1976d2", zindex: '0' } }} width='600' height='100' />
        },
        elev: {
            name: 'Thang máy',
            w: "300",
            h: "440",
            setting: { open: '1', close: '0', cal: '0', base: '10', zindex: '0' },
            // visual: <Elevroom deviceid="001" tab="1" id="0" data={props.invt} setting={{ door: '0', open: '1', close: '0', cal: '0', base: '10', zindex: '0' }} width='300' height='440' />
        },
        status: {
            name: 'Văn bản 2.0',
            w: "150",
            h: "40",
            setting: { data: { 0: { color: "#000000", text: "Văn bản 2.0" } }, borderwidth: '1', size: '15', cal: '0', base: '10', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", decimal: '1' },
            // visual: <Status deviceid="001" tab="1" id="0" data={props.invt} setting={{ data: { 0: { color: "#000000", text: "Văn bản 2.0" } }, borderwidth: '1', size: '15', cal: '0', base: '10', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", decimal: '1' }} width='150' height='40' />
        },
        multitext: {
            name: 'Đa Văn bản',
            w: "150",
            h: "80",
            setting: { data: { 0: { text: "Dòng 1" }, 1: { text: "Dòng 2" } }, borderwidth: '1', size: '15', cal: '0', base: '10', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", },
            // visual: <Multitext deviceid="001" tab="1" id="0" data={props.invt} setting={{ data: { 0: { text: "Dòng 1" }, 1: { text: "Dòng 2" } }, borderwidth: '1', size: '15', cal: '0', base: '10', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0" }} width='150' height='80' />
        },
        view2: {
            name: 'Số Nguyên X',
            w: "150",
            h: "40",
            setting: { borderwidth: '1', base: '10', cal: '123', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' },
            // visual: <Valuev2 deviceid="001" tab="1" id="0" data={props.invt} setting={{ borderwidth: '1', base: '10', cal: '0', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' }} width='150' height='40' />
        },
        arrow: {
            name: 'Mũi tên',
            w: "35",
            h: "35",
            setting: { base: '10', cal: '0', animation: '0', direct: 'down', zindex: '0' },
            // visual: <Arrow deviceid="001" tab="1" id="0" data={props.invt} setting={{ base: '10', cal: '0', animation: '0', direct: 'down', zindex: '0' }} width='35' height='35' />
        },
        led: {
            name: 'LED',
            w: "50",
            h: "50",
            setting: { data: { 0: { color: "white" } }, cal: '0', base: '10', text: '', zindex: '0' },
            // visual: <Led deviceid="001" tab="1" id="0" data={props.invt} setting={{ data: { 0: { color: "white" } }, cal: '0', base: '10', text: '', zindex: '0' }} width='50' height='50' />
        },
        icon: {
            name: 'Icon',
            w: "60",
            h: "60",
            setting: { data: { 0: { color: "#000000" } }, cal: '0', base: '10', img: "Icon", zindex: '0' },
            // visual: <Icon deviceid="001" tab="1" id="0" data={props.invt} setting={{ data: { 0: { color: "#000000" } }, cal: '0', base: '10', img: "Icon", zindex: '0' }} width='60' height='60' />
        },
        picture: {
            name: 'Hình ảnh',
            w: "300",
            h: "300",
            setting: { pic: 'vale', zindex: '0' },
            // visual: <Picture deviceid="001" tab="1" id="0" data={props.invt} setting={{ pic: 'valve', zindex: '0' }} width='300' height='300' />
        },
        image: {
            name: 'Hình nền',
            w: "300",
            h: "300",
            setting: { pic: '/dat_picture/Embody_APP_22.jpg', zindex: '0' },
            // visual: <Img deviceid="001" tab="1" id="0" data={props.invt} setting={{ pic: '/dat_picture/Embody_APP_22.jpg', zindex: '0' }} width='300' height='300' />
        },
        lineChart: {
            name: 'Biểu đồ đ.thẳng',
            w: "800",
            h: "400",
            setting: { step: '1',  xlb: "Thời gian", ylb: "Dfill: 'true',ữ liệu", dataset: [] },
            // visual: <LineChart deviceid="001" tab="1" id="0" data={props.invt} setting={{ step: "1", fill: true, xlb: "Thời gian", ylb: "Dữ liệu", dataset: [] }} width='800' height='400' />
        },
        barChart: {
            name: 'Biểu đồ cột',
            w: "800",
            h: "400",
            setting: { step: '1', fill: 'true', xlb: "Thời gian", ylb: "Dữ liệu", dataset: [] },
            // visual: <LineChart deviceid="001" tab="1" id="0" data={props.invt} setting={{ step: "1", fill: true, xlb: "Thời gian", ylb: "Dữ liệu", dataset: [] }} width='800' height='400' />
        },
        gauge: {
            name: 'Đồng hồ',
            w: "500",
            h: "300",
            setting: { cal: '30', label: "Dữ liệu", unit: "unit", valuesize: "20", valuecolor: "#000000", min: 0, max: 100, segment: 10, needlecolor: "#ff0000", startcolor: "#60d277", endcolor: "#dc0909", zindex: '0' },
            // visual: <Gauge deviceid="001" tab="1" id="0" data={props.invt} setting={{ cal: '30', label: "Dữ liệu", unit: "unit", valuesize: "20px", valuecolor: "#000000", min: 0, max: 100, segment: 10, needlecolor: "#ff0000", startcolor: "#60d277", endcolor: "#dc0909", zindex: '0' }} width='500' height='300' />
        },

        tablepro: {
            name: 'Bảng dữ liệu',
            w: "500",
            h: "104",
            setting: { data: [{ id: 1, val_1: 0, },], head: [{ name: "STT", code: "id", }, { name: "Giá Trị 1", code: "val_1", },], row: 2, col: 2, zindex: '0' },
            // visual: <Tablepro deviceid="001" tab="1" id="0" data={props.invt} setting={{ data: [{ id: 1, val_1: 0, },], head: [{ name: "STT", code: "id", }, { name: "Giá Trị 1", code: "val_1", },], row: 2, col: 2, zindex: '0' }} width='500' height='104' />
        },
        view32bit: {
            name: 'số 32bit',
            w: "200",
            h: "40",
            setting: { boderwidth: '1', cal: ['10', '10'], type: 'int', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", decimal: '2', scale: '1' },
            // visual: <View32bit deviceid="001" tab="1" id="0" data={props.invt} setting={{ boderwidth: '1', cal: ['10', '10'], type: 'int', size: '15', color: '#000000', align: "left", bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", decimal: '2', scale: '1' }} width='200' height='40' />
        },
        calendar: {
            name: 'Lịch',
            w: "150",
            h: "40",
            setting: { borderwidth: '1', date: '2022-01-01', pwd: '123456', size: '15', color: '#000000', align: "center", ispwd: 'false', justify: 'center', bgcolor: "#ffffff", bordercolor: "#ffffff", radius: "0", zindex: '0' },
        },
        timer: {
            name: 'Chu trình',
            w: "800",
            h: "650",
            setting: {
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



    const visdata = (type, deviceid, sn, tab, id, w, h) => {


        switch (type) {
            case 'circle':
                return <Circle deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'lineChart':
                return <LineChart deviceid={deviceid} sn={sn} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'barChart':
                return <BarChart deviceid={deviceid} sn={sn} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'switch':
                return <Switch deviceid={deviceid} sn={sn} tab={tab} id={id} data={invt} setting={setting[tab]} width={w} height={h} />
            case 'switchtoggle':
                return <SwitchToggle deviceid={deviceid} sn={sn} tab={tab} id={id} data={invt} setting={setting[tab]} width={w} height={h} />
            case 'input':
                return <Input deviceid={deviceid} sn={sn} tab={tab} id={id} data={invt} setting={setting[tab]} width={w} height={h} />
            case 'text':
                return <Note deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'view':
                return <Value deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'view2':
                return <Valuev2 deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'slider':
                return <Dimmer deviceid={deviceid} sn={sn} tab={tab} id={id} data={invt} setting={setting[tab]} width={w} height={h} />
            case 'elev':
                return <Elevroom deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'status':
                return <Status deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'multitext':
                return <Multitext deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'arrow':
                return <Arrow deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'led':
                return <Led deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'icon':
                return <Icon deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'timer':
                return <Timer deviceid={deviceid} sn={sn} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'gauge':
                return <Gauge deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'tablepro':
                return <Tablepro deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'picture':
                return <Picture deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'image':
                return <Img deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'view32bit':
                return <View32bit deviceid={deviceid} tab={tab} id={id} data={invt} setting={setting[tab][id]} width={w} height={h} />
            case 'calendar':
                return <Calendar deviceid={deviceid} sn={sn} tab={tab} id={id} data={invt} setting={setting[tab]} width={w} height={h} />
            default:
                return <></>
        }


    }

    // Bật/Tắt menu
    const handleMenu = (event) => {
        if (dropdowm) {
            setDropdown(false)
        } else {
            setDropdown(true)
        }
    }

    //Bật/tắt tiêu đề
    const handleDropTit = (e) => {
        if (tit) {
            setTit(false)
        } else {
            setTit(true)
        }
    }

    //lưu tiêu để mới
    const handleTit = async (e) => {

        var ID = e.currentTarget.id
        var arr = ID.split("_")
        // console.log(arr)
        var tit = document.getElementById(arr[0] + "_" + arr[1] + "_TITTEXT")
        if (tit.value !== '') {
            // console.log(tit.value)


            let res = await callApi("post", host.DATA + "/updateNameLoggerScreen", {
                id: arr[0],
                name: tit.value,
                tab: arr[1]
            })

            // console.log(res)
            if (res.status) {
                alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
                name[arr[1]] = tit.value
                toolDispatch({ type: "RE_NAME", payload: name })
                // console.log(name)

                setTit(false)
            }



            // axios.post(host.DEVICE + "/setNameTabMD", { id: arr[0], name: tit.value, tab: arr[1] }, { secure: true, reconnect: true }).then(
            //     function (res) {
            //         if (res.data) {
            //             // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
            //         } else {
            //             // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
            //         }

            //     }



            // )
        } else {
            // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_1" }), show: 'block' }))
        }

    }

    // Thoát cài đặt
    const handleExit = (e) => {
        coppyState.value = 0
        //config[props.tab].stt = false
        //toolDispatch({ type: "SET_CONFIG", payload: config })
        toolDispatch({
            type: "SET_CONFIG", payload: {
                ...config,
                [props.tab]: {
                    stt: false
                }
            }
        })
    }


    // Xóa màn hình[0]
    const handleOpenRemove = (e) => {

        if (remove) {
            setRemove(false)
        } else {
            setRemove(true)
        }
    }

    // Xóa màn hình[1]
    const handleRemove = async (e) => {

        const ID = e.currentTarget.id;
        if (ID === props.id + "_" + props.tab + "_TAB") {

            // console.log(props.id, props.tab)

            let res = await callApi("post", host.DATA + "/dropLoggerScreen", {
                id: props.id,
                tab: props.tab
            })

            // console.log(res)
            if (res.status) {
                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
                settingDispatch({ type: "REMOVE_SCREEN", payload: props.tab })
                toolDispatch({ type: "REMOVE_NAME", payload: props.tab })
                setRemove(false)
            }


        }

    }


    //Lưu thiết  lập 
    const handleSave = async (e) => {
        coppyState.value = 0
        if (config[props.tab].stt) {
            toolDispatch({
                type: "SET_CONFIG", payload: {
                    ...config,
                    [props.tab]: {
                        stt: false
                    }
                }
            })
            setDropdown(false)
            // console.log(props.id, props.tab)
            const res = await callApi("post", host.DATA + "/updateLoggerScreen", {
                id: props.id,
                data: { data: visual[props.tab], id: lastid[props.tab] },
                setting: setting[props.tab],
                tab: props.tab
            })

            // console.log(res)
            if (res.status) {
                alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
            }



        } else {



        }

    }

    //Nhân đôi thành phần
    const handlePast = (e) => {
        var newlastid = parseInt(lastid[props.tab]) + 1
        visual[props.tab] = [...visual[props.tab], { id: newlastid, type: coppyVisual.value.type, w: coppyVisual.value.w, h: coppyVisual.value.h, x: coppyVisual.value.x + 20, y: coppyVisual.value.y + 20 }]
        coppyVisual.value = { id: newlastid, type: coppyVisual.value.type, w: coppyVisual.value.w, h: coppyVisual.value.h, x: coppyVisual.value.x + 20, y: coppyVisual.value.y + 20 }
        lastid[props.tab] = newlastid
        setting[props.tab] = {
            ...setting[props.tab],
            [newlastid]: coppySetting.value
        }

        toolDispatch({ type: "LOAD_VISUAL", payload: { tab: props.tab, visual: visual[props.tab] } })
        toolDispatch({ type: "SET_SETTING", payload: { tab: props.tab, setting: setting[props.tab] } })

        // coppyState.value = 0

    }

    //Chọn thành phần muốn Thêm
    const handleType = (e) => {
        const type = e.currentTarget.id;
        setTypeSVG(type)
        var newlastid = parseInt(lastid[props.tab]) + 1
        visual[props.tab] = [...visual[props.tab], { id: newlastid, type: type, w: configdata[type].w, h: configdata[type].h, x: 50, y: 50 }]
        lastid[props.tab] = newlastid
        setting[props.tab] = {
            ...setting[props.tab],
            [newlastid]: configdata[type].setting
        }
    }

    //cài đặt thành phần
    const handleSetting = (ID) => {
        var typearr = ID.split("_")
        let obj = visual[props.tab].find(obj => obj.id == typearr[0])
        // console.log(obj)

        if (setting[props.tab][typearr[0]] !== undefined) {
            toolDispatch({
                type: "SET_CONTROL", payload: {
                    ...control,
                    [props.tab]: {
                        ...control[props.tab],
                        stt: true,
                        type: obj.type,
                        id: obj.id,
                        cal: setting[props.tab][typearr[0]].cal,
                        w: obj.w,
                        h: obj.h
                    }
                }
            })
        } else {
            var newdevice = [...visual[props.tab]] //coppy old array

            newdevice = newdevice.filter(newdevice => newdevice.id != obj.id)
            visual[props.tab] = newdevice
            //toollistDispatch({ type: "LOAD_VISUAL", payload: newdevice })
            delete setting[props.tab][obj.id]
            if (newdevice.length === 0) {
                lastid[props.tab] = 0
                //toollistDispatch({ type: "LOAD_ID", payload: 0 })
            }

            control[props.tab].stt = false
            control[props.tab].type = ''
            control[props.tab].id = 0
            toolDispatch({ type: "SET_CONTROL", payload: control })
            // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))

        }
        // control[props.tab].stt = true
        // control[props.tab].type = typearr[1]
        // control[props.tab].id = typearr[0]
        // control[props.tab].cal = setting[props.tab][typearr[0]].cal
        // control[props.tab].w = visual[props.tab][objIndex].w 
        // control[props.tab].h = visual[props.tab][objIndex].h 
        // toolDispatch({ type: "SET_CONTROL", payload: control })




    }


    //Nhận dữ liệu full và kho giao diện
    useEffect(function () {
        dragGroup.value = false
        dragState.value = false
        Element.value = 'X_None'
        ListElement.value = []
        offset.value = { x: 0, y: 0 }
        history.value = []
        const getStore = async () => {
            // await axios.post(host.DEVICE + "/getStorage", { user: manager }, { withCredentials: true }).then(
            //     function (res) {
            //         //console.log("store", res.data)
            //         setDatastore(res.data)

            //     })
            // console.log(usr)
            let res = await callApi("post", host.DATA + "/getStorage", {
                usr: usr,
            })
            if (res.status) {
                let x = res.data.sort((a, b) => a.id_ - b.id_)
                setDatastore(x)
            }


        }

        const getData = async () => {
            const res = await cloud('{"deviceCode":"' + props.sn + '"}', Token.value.token);
            if (res.ret === 0) {
                setInvt(res.data)
            } else {
                //alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_42" }), show: 'block' }))
            }
        };
        getData();
        getStore();
    }, [])

    //Socket IO
    useEffect(() => {

        try {
            socket.value.on("Server/" + props.sn, function (data) {
                if (data.deviceid === props.sn) {
                    //console.log(data.data)
                    console.log("Toollist socket")
                    Object.keys(data.data).map((keyName, i) => {
                        setInvt(invt => ({ ...invt, [keyName]: data.data[keyName] }))
                    })
                }
            })
            socket.value.on("Server/up/" + props.sn, function (data) {
                if (data.deviceid === props.sn) {
                    console.log("Toollist up")
                    setInvt(invt => ({ ...invt, enabled: '1' }))

                }
            })
            socket.value.on("Server/down/" + props.sn, function (data) {
                if (data.deviceid === props.sn) {
                    console.log("Toollist down")
                    setInvt(invt => ({ ...invt, enabled: '0' }))


                }
            })

        } catch (error) {
            console.log(error)
        }

        return () => {
            socket.value.off("Server/" + props.sn);
            socket.value.off("Server/up/" + props.sn)
            socket.value.off("Server/down/" + props.sn)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //Storage 0
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
        const data = { id: lastid[arr[1]], data: visual[arr[1]] }
        const setting_ = setting[arr[1]]
        // console.log(storename.current.value, data, setting_)


        let res = await callApi("post", host.DATA + "/addStorage", {
            name: storename.current.value,
            data: data,
            setting: setting_,
            usr: usr
        })

        // console.log(res)
        if (res.status) {
            alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
            setDatastore([...datastore, { id_: res.data, name_: storename.current.value, data_: data, setting_: setting_, usr_: usr }])
        }


        // axios.post(host.DEVICE + "/addStore", { user: manager, name: storename.current.value, data: JSON.stringify(data), setting: JSON.stringify(setting_) }, { withCredentials: true }).then(
        //     function (res) {
        //         //console.log(res.data)
        //         if (res.data.status) {
        //             // alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_15" }), show: 'block' } })
        //         } else {
        //             switch (res.data.number) {
        //                 case 1:
        //                     // alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_14" }), show: 'block' } })
        //                     break
        //                 default:
        //                     // alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
        //                     break

        //             }
        //         }
        //     })
    }

    //Storage remove
    const handleRemoveStore = async (e) => {
        let id = e.currentTarget.id
        let res = await callApi("post", host.DATA + "/dropStorage", { id: e.currentTarget.id })
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
            var newStore = datastore
            newStore = newStore.filter(data => data.id_ == arr[2])
            document.getElementById("storename").value = newStore[0].name_
            setIdstorage(newStore[0].id_)

        }
    }

    //Storage ?
    const handleGetStore = (e) => {
        e.preventDefault();
        const arr = e.currentTarget.id.split("_")
        var newStore = datastore
        newStore = newStore.filter(data => data.id_ == arr[2])

        // console.log(newStore, arr)

        //setting[arr[1]] = newStore[0].setting
        //visual[arr[1]]= newStore[0].data.data
        lastid[arr[1]] = newStore[0].data_.id


        toolDispatch({
            type: "LOAD_VISUAL", payload: { tab: [arr[1]], visual: newStore[0].data_.data }
        })
        toolDispatch({
            type: "LOAD_SETTING", payload: { tab: [arr[1]], setting: newStore[0].setting_ }
        })






    }

    //Storage update name
    const handleUpdateStore = async (e) => {
        e.preventDefault();
        let newStore = datastore
        let index = newStore.findIndex(x => x.id_ == idstorage)
        newStore[index] = { ...newStore[index], name_: document.getElementById("storename").value }
        setDatastore([...newStore])

        const res = await callApi("post", host.DATA + "/updateStorage", { id: idstorage, name: document.getElementById("storename").value })
        // console.log(res)

    }


    const handledefault = async (e) => {
        // console.log(props.tab, props.id)
        const res = await callApi("post", host.DATA + "/updateDefaultScreen", { tab: props.tab, id: props.id })
        // console.log(res)
        if (res.status) {
            alertDispatch(dataLang.formatMessage({ id: "alert_6" }))
            let indx = deviceData.value.findIndex(x => x.id_ == props.id)
            deviceData.value[indx].defaulttab_ = props.tab
            // console.log(deviceData.value, props.tab, props.id)
        }
        // if (view.value.type === 'single') {
        //     axios.post(host.DEVICE + "/setTabMD", { tab: props.tab, id: props.id }, { withCredentials: true }).then(
        //         function (res) {
        //             if (res.data.status) {
        //                 // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
        //             }


        //         })
        // } else {
        //     axios.post(host.DEVICE + "/setTabMDG", { tab: props.tab, id: props.id, groupid: view.value.id }, { withCredentials: true }).then(
        //         function (res) {
        //             if (res.data.status) {
        //                 // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
        //             }
        //         })
        // }

    }

    //Editer drag 
    const handleStart = (e) => {
        //console.log(e.target.id)
        setTit(false)
        setDropdown(false)
        let arr = e.target.id.split("_")
        idSize.value = arr[0]
        let svg = document.getElementById(props.id + "_" + props.tab + "_SVG")
        let point = svg.getBoundingClientRect()

        if (arr[arr.length - 1] !== 'SVG' && arr[arr.length - 1] !== 'Edit') {

            if (e.shiftKey) {

                let NewList = ListElement.value.filter(item => item.obj == arr[0] + "_Drag")
                if (NewList.length === 0) {
                    ListElement.value.push({ obj: arr[0] + "_Drag", offset: { x: 0, y: 0 } })
                    let obj = document.getElementById(arr[0] + "_Drag")
                    obj.style.border = "solid 2px rgb(54, 148, 255)"
                } else {
                    ListElement.value = ListElement.value.filter(item => item.obj != arr[0] + "_Drag")
                    let obj = document.getElementById(arr[0] + "_Drag")
                    obj.style.border = "dashed 1px #326ba8"
                }
                dragGroup.value = true
            } else {
                if (dragGroup.value) {
                    history.value.push(visual[props.tab])
                    Element.value = arr[0] + "_Drag"
                    ListElement.value.map(
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
                    dragState.value = true
                    //console.log(ListElement.value)
                } else {
                    history.value.push(visual[props.tab])
                    let obj = document.getElementById(arr[0] + "_Drag")
                    if (obj) {
                        obj.style.border = "solid 2px rgb(54, 148, 255)"
                        Element.value = arr[0] + "_Drag"
                        dragState.value = true
                        offset.value = { x: e.clientX - point.left - obj.getAttributeNS(null, 'x'), y: e.clientY - point.top - obj.getAttributeNS(null, 'y') }
                        //console.log("Drag", e.ctrlKey)
                        if (e.ctrlKey) {
                            svg.prepend(obj)
                        } else {
                            svg.appendChild(obj)
                        }
                    }

                }

            }





        }

        if (arr[arr.length - 1] === 'SVG') {
            // if(e.shiftKey){

            //     Element.value.map(
            //         (item) => {
            //             let obj_ = document.getElementById(item)
            //             obj_.style.border = "dashed 1px #326ba8"
            //         }
            //     )
            //     ListElement.value = [] 
            //     dragGroup.value = false
            // }
        }

        if (arr[arr.length - 1] === 'Edit') {
            handleSetting(e.target.id)
        }



    }

    //Editer move 
    const handleDrag = (e) => {
        let svg = document.getElementById(props.id + "_" + props.tab + "_SVG")
        let point = svg.getBoundingClientRect()
        let coordnates = [parseFloat(e.clientX - point.left), parseFloat(e.clientY - point.top)]
        if (dragState.value) {
            if (dragGroup.value) {
                ListElement.value.map(
                    (item) => {
                        let obj_ = document.getElementById(item.obj)
                        obj_.setAttributeNS(null, 'x', coordnates[0] - item.offset.x)
                        obj_.setAttributeNS(null, 'y', coordnates[1] - item.offset.y)
                    }
                )
            } else {


                let obj = document.getElementById(Element.value)
                obj.setAttributeNS(null, 'x', coordnates[0] - offset.value.x)
                obj.setAttributeNS(null, 'y', coordnates[1] - offset.value.y)
            }
        }
    }
    //Editer drop
    const handleStop = (e) => {


        //dragGroup.value = false
        if (Element.value !== 'X_None') {

            if (dragGroup.value) {
                dragState.value = false

                ListElement.value.map(
                    item => {
                        let arr = item.obj.split("_")
                        let index = visual[props.tab].findIndex(x => x.id == arr[0])
                        let obj_ = document.getElementById(item.obj)
                        obj_.style.border = "dashed 1px #326ba8"

                        let data = { ...visual[props.tab][index] }
                        data = {
                            ...data,
                            x: parseFloat(obj_.getAttributeNS(null, 'x')),
                            y: parseFloat(obj_.getAttributeNS(null, 'y'))
                        }
                        visual[props.tab] = visual[props.tab].filter(data => data.id != arr[0])
                        visual[props.tab].push(data)
                    }
                )
                ListElement.value = []
                dragGroup.value = false
            } else {

                dragState.value = false
                let arr = Element.value.split("_")
                idDrag.value = arr[0]
                let obj = document.getElementById(Element.value)
                obj.style.border = "dashed 1px #326ba8"
                let index = visual[props.tab].findIndex(x => x.id == arr[0])
                let data = { ...visual[props.tab][index] }
                data = {
                    ...data,
                    x: parseFloat(obj.getAttributeNS(null, 'x')),
                    y: parseFloat(obj.getAttributeNS(null, 'y'))
                }
                visual[props.tab] = visual[props.tab].filter(data => data.id != arr[0])
                if (e.ctrlKey) {
                    visual[props.tab].unshift(data)
                } else {
                    visual[props.tab].push(data)
                }



            }

            Element.value = "X_None"

        }

        //console.log(visual[props.tab])


    }

    //Editor align
    const handleAlign = (e) => {
        idDrag.value = 0
        let arr = e.currentTarget.id.split("_")
        //console.log(arr[1], ListElement.value)
        let newVis = []
        ListElement.value.map(
            (item) => {

                let arr = item.obj.split("_")
                newVis = [...newVis, visual[props.tab].find(x => x.id == arr[0])]

            }
        )
        history.value.push(visual[props.tab])
        if (arr[1] == 'Top') {

            let smallestY = Math.min(...newVis.map(p => p.y))
            ListElement.value.map(
                (item) => {
                    let arr = item.obj.split("_")
                    let index = visual[props.tab].findIndex(x => x.id == arr[0])
                    let obj_ = document.getElementById(item.obj)
                    obj_.setAttributeNS(null, 'y', smallestY)
                    //visual[props.tab][index] = { ...visual[props.tab][index], y: smallestY }
                    let data = { ...visual[props.tab][index] }
                    data = {
                        ...data,
                        x: parseFloat(obj_.getAttributeNS(null, 'x')),
                        y: smallestY
                    }
                    visual[props.tab] = visual[props.tab].filter(data => data.id != arr[0])
                    visual[props.tab].push(data)

                }
            )
        }
        if (arr[1] == 'Left') {
            let smallestX = Math.min(...newVis.map(p => p.x))
            ListElement.value.map(
                (item) => {
                    let arr = item.obj.split("_")
                    let index = visual[props.tab].findIndex(p => p.id == arr[0])
                    let obj_ = document.getElementById(item.obj)
                    obj_.setAttributeNS(null, 'x', smallestX)
                    //visual[props.tab][index] = { ...visual[props.tab][index], x: smallestX }
                    let data = { ...visual[props.tab][index] }
                    data = {
                        ...data,
                        x: smallestX,
                        y: parseFloat(obj_.getAttributeNS(null, 'y'))
                    }
                    visual[props.tab] = visual[props.tab].filter(data => data.id != arr[0])
                    visual[props.tab].push(data)

                }
            )
        }

        if (arr[1] == 'Bottom') {
            //console.log(newVis.sort((prev, curr) =>   parseFloat(curr.y + curr.h)- parseFloat(prev.y + prev.h)))
            let largest = newVis.reduce((prev, current) => (prev.y + prev.h) > (current.y + current.h) ? prev : current, newVis[0]);

            let largestY = parseFloat(largest.y) + parseFloat(largest.h)
            ListElement.value.map(
                (item) => {
                    let arr = item.obj.split("_")
                    let index = visual[props.tab].findIndex(x => x.id == arr[0])
                    let obj_ = document.getElementById(item.obj)
                    obj_.setAttributeNS(null, 'y', largestY - parseFloat(obj_.getAttribute('height')))
                    //visual[props.tab][index] = { ...visual[props.tab][index], y: largestY - parseFloat(obj_.getAttribute('height')) }

                    let data = { ...visual[props.tab][index] }
                    data = {
                        ...data,
                        x: parseFloat(obj_.getAttributeNS(null, 'x')),
                        y: largestY - parseFloat(obj_.getAttribute('height'))
                    }
                    visual[props.tab] = visual[props.tab].filter(data => data.id != arr[0])
                    visual[props.tab].push(data)

                }
            )
        }
        if (arr[1] == 'Right') {
            let largest = newVis.sort((prev, curr) => (curr.x + curr.w) - (prev.x + prev.w))[0];

            let largestX = parseFloat(largest.x) + parseFloat(largest.w)
            ListElement.value.map(
                (item) => {
                    let arr = item.obj.split("_")
                    let index = visual[props.tab].findIndex(x => x.id == arr[0])
                    let obj_ = document.getElementById(item.obj)
                    obj_.setAttributeNS(null, 'x', largestX - parseFloat(obj_.getAttribute('width')))
                    //visual[props.tab][index] = { ...visual[props.tab][index], x: largestX - parseFloat(obj_.getAttribute('width')) }

                    let data = { ...visual[props.tab][index] }
                    data = {
                        ...data,
                        x: largestX - parseFloat(obj_.getAttribute('width')),
                        y: parseFloat(obj_.getAttributeNS(null, 'y'))
                    }
                    visual[props.tab] = visual[props.tab].filter(data => data.id != arr[0])
                    visual[props.tab].push(data)



                }
            )
        }






    }

    //Key down crt z
    useEffect(() => {

        const handleKeyDown = (event) => {
            //event.preventDefault();
            const code = event.which || event.keyCode;

            let charCode = String.fromCharCode(code).toLowerCase();
            if ((event.ctrlKey || event.metaKey) && charCode === 'z') {

                if (history.value.length > 0) {
                    history.value[history.value.length - 1].map(
                        item => {
                            let obj = document.getElementById(item.id + "_Drag")
                            obj.setAttributeNS(null, 'x', item.x)
                            obj.setAttributeNS(null, 'y', item.y)
                            item.x = parseFloat(obj.getAttribute('x'))
                            item.y = parseFloat(obj.getAttribute('y'))
                        }
                    )
                    visual[props.tab] = history.value[history.value.length - 1]
                    history.value.pop()

                }
                //console.log("history new", history.value)



            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [])

    //Resize
    const handleStartResize = (e) => {

        let svg = document.getElementById(props.id + "_" + props.tab + "_SVG")
        let point = svg.getBoundingClientRect()

        // console.log(e.target)
        offsetResize.value = {
            x: e.clientX - point.left,
            y: e.clientY - point.top
        }
        dragStateResize.value = true

        idResize.value = e.currentTarget.id

    }
    //Resize
    const handleDragResize = (e) => {
        let svg = document.getElementById(props.id + "_" + props.tab + "_SVG")
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
    //Resize
    const handleStopResize = (e) => {
        dragStateResize.value = false
        let arr = idResize.value.split("_")
        let obj = document.getElementById(arr[0] + "_Drag")
        if (!obj) return;
        let w = parseFloat(obj.getAttributeNS(null, 'width'));
        let h = parseFloat(obj.getAttributeNS(null, 'height'));
        let index = visual[props.tab].findIndex(x => x.id == arr[0])
        let data = { ...visual[props.tab][index] }
        data = {
            ...data,
            w: w,
            h: h
        }
        visual[props.tab] = visual[props.tab].filter(data => data.id != arr[0])
        visual[props.tab].push(data)

        toolDispatch({
            type: "LOAD_VISUAL", payload: { tab: props.tab, visual: visual[props.tab] }
        })

    }


    const MoveableResize = (e) => {
        // console.log(e.target.id, e.width, e.height)
        let obj = document.getElementById(e.target.id)
        if (!obj) return;
        let arr = e.target.id.split("_")
        let index = visual[props.tab].findIndex(x => x.id == arr[0])
        let data = { ...visual[props.tab][index] }
        data = {
            ...data,
            w: e.width,
            h: e.height
        }
        visual[props.tab] = visual[props.tab].filter(data => data.id != arr[0])
        visual[props.tab].push(data)

        toolDispatch({
            type: "LOAD_VISUAL", payload: { tab: props.tab, visual: visual[props.tab] }
        })
    }


    const MoveableStartDrag = (e) => {
    }
    const MoveableDrag = (e) => {


    }

    const MoveableEndDrag = (e) => {

        let svg = document.getElementById(props.id + "_" + props.tab + "_SVG")
        let point = svg.getBoundingClientRect()
        const rect = e.target.getBoundingClientRect();
        const clientX = rect.left;
        const clientY = rect.top;
        console.log(e.target.id, clientX - point.left, clientY - point.top)
        // let obj = document.getElementById(e.target.id)
        // obj.setAttributeNS(null, 'x', clientX-point.left)
        // obj.setAttributeNS(null, 'y', clientY-point.top)

        // let svg = document.getElementById(props.id + "_" + props.tab + "_SVG")
        // let point = svg.getBoundingClientRect()
        // const rect = e.target.getBoundingClientRect();
        // const clientX = rect.left;
        // const clientY = rect.top;
        // console.log(e.target.id, clientX-point.left, clientY-point.top)

        let arr = e.target.id.split("_")
        let index = visual[props.tab].findIndex(x => x.id == arr[0])
        let data = { ...visual[props.tab][index] }
        data = {
            ...data,
            x: clientX - point.left,
            y: clientY - point.top
        }
        visual[props.tab] = visual[props.tab].filter(data => data.id != arr[0])
        if (e.ctrlKey) {
            visual[props.tab].unshift(data)
        } else {
            visual[props.tab].push(data)
        }


    }

    const MoveableEndDragGroup = (e) => {
        e.targets.map(
            item => {
                console.log(item.id)
            }
        )
    }



    return (
        <div className="DAT_Tool"
        // onMouseEnter={(e) => { disableScroll.on() }}
        // onMouseLeave={(e) => { disableScroll.off() }}

        >

            <div className="DAT_Tool_SVG" >


                {dragGroup.value
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

                        <div className="DAT_Editor" style={{ top: '10px', right: '10px' }} onClick={(event) => { handleExit(event) }}>
                            <IoMdClose size={20} />
                        </div>
                        <div className="DAT_Menu" style={{ top: '50px', right: '10px' }} onClick={(event) => { handleMenu(event) }}>
                            <ion-icon name="ellipsis-vertical"></ion-icon>
                        </div>


                        <div className="DAT_Editor" style={{ top: '90px', right: '10px' }} id={props.id + "_" + props.tab + "_TAB"} onClick={(e) => handleDropTit(e)}>
                            <CiEdit size={20} />
                        </div>
                        {/* <div className="DAT_Editor" style={{ display: (dragGroup.value) ? "none" : "block", top: '130px', right: '10px' }} onClick={(event) => { handleOpenGetStore(event) }}>
                    <AiOutlineAppstore size={20} />
                </div> */}
                        <div className="DAT_Editor" style={{ top: '170px', right: '10px' }} onClick={(event) => { handleOpenStore(event) }}>
                            <AiOutlineAppstoreAdd size={20} />
                        </div>
                        <div className="DAT_Editor" style={{ top: '210px', right: '10px' }} onClick={(event) => { handledefault(event) }}>
                            <FaPager size={20} />
                        </div>
                        <div className="DAT_Editor" style={{ top: '250px', right: '10px' }} onClick={(event) => { handleSave(event) }}>
                            <IoSave size={20} color="rgb(10, 10, 255,0.7)" />
                        </div>
                        {ruleInfor.value.setting.screen.remove
                            ? <div className="DAT_Editor" style={{ top: '290px', right: '10px' }} onClick={(event) => { handleOpenRemove(event) }}>
                                <MdDeleteForever size={20} color="rgb(255, 10, 10,0.7)" />
                            </div>
                            : <></>}


                    </>
                }
                <div className="DAT_Menu" style={{ display: (coppyState.value) ? "block" : "none", top: '10px', right: '50px' }} onClick={(event) => { handlePast(event) }}>
                    <ion-icon name="clipboard-outline"></ion-icon>
                </div>







                <div className="DAT_ToolMenu" style={{ display: (dropdowm) ? "block" : "none", height: "450px" }}>

                    <div className="DAT_ToolMenu-content">
                        <div className="DAT_ToolMenu-content-tit" style={{ backgroundColor: "rgb(255, 68, 68,0.5)" }} >Controller</div>
                        <div className="DAT_ToolMenu-content-group">

                            {control_.map((data, index) => (

                                <div className="DAT_ToolMenu-content-group-item" key={index} id={data.id} onClick={(event) => { handleType(event) }}>
                                    <PopupState variant="popper" popupId="demo-popup-popper">
                                        {(popupState) => (
                                            <>
                                                <span  {...bindHover(popupState)}>
                                                    {data.icon}
                                                </span>
                                                <Popper {...bindPopper(popupState)} transition>
                                                    {({ TransitionProps }) => (
                                                        <Fade {...TransitionProps} timeout={350}>
                                                            <Paper
                                                                sx={{
                                                                    // width: "400px",
                                                                    marginTop: "10px",
                                                                    p: 1,
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "13px",
                                                                        // textAlign: "justify",
                                                                        // marginBottom: 1.7,
                                                                    }}
                                                                >
                                                                    {data.name}
                                                                </Typography>

                                                            </Paper>
                                                        </Fade>
                                                    )}
                                                </Popper>
                                            </>
                                        )}
                                    </PopupState>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="DAT_ToolMenu-content">
                        <div className="DAT_ToolMenu-content-tit" style={{ backgroundColor: "rgb(68, 87, 255,0.7)" }}>Text & Number</div>
                        <div className="DAT_ToolMenu-content-group">
                            {textxnumber_.map((data, index) => (
                                <div className="DAT_ToolMenu-content-group-item" key={index} id={data.id} onClick={(event) => { handleType(event) }}>
                                    <PopupState variant="popper" popupId="demo-popup-popper">
                                        {(popupState) => (
                                            <>
                                                <span  {...bindHover(popupState)}>
                                                    {data.icon}
                                                </span>
                                                <Popper {...bindPopper(popupState)} transition>
                                                    {({ TransitionProps }) => (
                                                        <Fade {...TransitionProps} timeout={350}>
                                                            <Paper
                                                                sx={{
                                                                    // width: "400px",
                                                                    marginTop: "10px",
                                                                    p: 1,
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "13px",
                                                                        // textAlign: "justify",
                                                                        // marginBottom: 1.7,
                                                                    }}
                                                                >
                                                                    {data.name}
                                                                </Typography>

                                                            </Paper>
                                                        </Fade>
                                                    )}
                                                </Popper>
                                            </>
                                        )}
                                    </PopupState>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="DAT_ToolMenu-content">
                        <div className="DAT_ToolMenu-content-tit" style={{ backgroundColor: "rgb(97, 245, 92,0.7)" }}>Chart</div>
                        <div className="DAT_ToolMenu-content-group">
                            {chart_.map((data, index) => (
                                <div className="DAT_ToolMenu-content-group-item" key={index} id={data.id} onClick={(event) => { handleType(event) }}>
                                    <PopupState variant="popper" popupId="demo-popup-popper">
                                        {(popupState) => (
                                            <>
                                                <span  {...bindHover(popupState)}>
                                                    {data.icon}
                                                </span>
                                                <Popper {...bindPopper(popupState)} transition>
                                                    {({ TransitionProps }) => (
                                                        <Fade {...TransitionProps} timeout={350}>
                                                            <Paper
                                                                sx={{
                                                                    // width: "400px",
                                                                    marginTop: "10px",
                                                                    p: 1,
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "13px",
                                                                        // textAlign: "justify",
                                                                        // marginBottom: 1.7,
                                                                    }}
                                                                >
                                                                    {data.name}
                                                                </Typography>

                                                            </Paper>
                                                        </Fade>
                                                    )}
                                                </Popper>
                                            </>
                                        )}
                                    </PopupState>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="DAT_ToolMenu-content">
                        <div className="DAT_ToolMenu-content-tit" style={{ backgroundColor: "rgb(96, 96, 96,0.5)" }}>Extension</div>
                        <div className="DAT_ToolMenu-content-group">
                            {extension_.map((data, index) => (
                                <div className="DAT_ToolMenu-content-group-item" key={index} id={data.id} onClick={(event) => { handleType(event) }}>
                                    <PopupState variant="popper" popupId="demo-popup-popper">
                                        {(popupState) => (
                                            <>
                                                <span  {...bindHover(popupState)}>
                                                    {data.icon}
                                                </span>
                                                <Popper {...bindPopper(popupState)} transition>
                                                    {({ TransitionProps }) => (
                                                        <Fade {...TransitionProps} timeout={350}>
                                                            <Paper
                                                                sx={{
                                                                    // width: "400px",
                                                                    marginTop: "10px",
                                                                    p: 1,
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "13px"
                                                                        // textAlign: "justify",
                                                                        // marginBottom: 1.7,
                                                                    }}
                                                                >
                                                                    {data.name}
                                                                </Typography>

                                                            </Paper>
                                                        </Fade>
                                                    )}
                                                </Popper>
                                            </>
                                        )}
                                    </PopupState>
                                </div>
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

                <div className="DAT_ToolTit" style={{ display: (tit) ? "block" : "none" }}>
                    <div className="DAT_ToolTit-group">
                        <input type="text" id={props.id + "_" + props.tab + "_TITTEXT"} placeholder="Nhập tiêu đề"  ></input>
                        <div className="DAT_ToolTit-group-btn" id={props.id + "_" + props.tab + "_TIT"} onClick={(e) => handleTit(e)}>Lưu</div>
                    </div>
                </div>

                <div className="DAT_ToolRemove" style={{ display: (remove) ? "block" : "none" }}>
                    <div className="DAT_ToolRemove-group">
                        <span>Trang này sẻ bị xóa vĩnh viễn, tất cả dữ liệu của trang sẽ mất, bạn vẫn muốn xóa?</span>
                        <div className="DAT_ToolRemove-group-action">
                            <div className="DAT_ToolRemove-group-action-yes" id={props.id + "_" + props.tab + "_TAB"} onClick={(event) => { handleRemove(event) }}>Có</div>
                            <div className="DAT_ToolRemove-group-action-no" onClick={(event) => { handleOpenRemove(event) }}>Không</div>
                        </div>
                    </div>
                </div>

                <div className="DAT_ToolStore" style={{ display: (store) ? "block" : "none" }}>
                    <div className="DAT_ToolStore-group">
                        <div className="DAT_ToolStore-group-close" onClick={(event) => { handleOpenStore(event) }}><ion-icon name="close-outline"></ion-icon></div>

                        <form className="DAT_ToolStore-group-action" id={props.id + "_" + props.tab + "_STORE"} onSubmit={e => handleStorage(e)}>
                            <input type="text" ref={storename} minLength={8} required placeholder="Tên giao diện" ></input>
                            <button><IoMdAddCircleOutline size={20} color="gray" /></button>
                        </form>
                        <div className="DAT_ToolStore-group-list" >
                            {datastore.map((data, index) => {
                                return <div key={index} className="DAT_ToolStore-group-list-item" >
                                    <div className="DAT_ToolStore-group-list-item-index" >{index + 1}</div>
                                    <div className="DAT_ToolStore-group-list-item-name" id={`${props.id}_${props.tab}_${data.id_}`} onClick={(e) => { handleGetStore(e) }}  >{data.name_}</div>
                                    <div className="DAT_ToolStore-group-list-item-edit" ><CiEdit id={`${props.id}_${props.tab}_${data.id_}`} onClick={(event) => { handleOpenGetStore(event) }} /><RiDeleteBin6Line id={`${data.id_}`} onClick={(event) => { handleRemoveStore(event) }} /></div>
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

                <div className="DAT_Tool_SVG-content" >

                    <svg
                        version="1.1"
                        id={props.id + "_" + props.tab + "_SVG"}
                        className="DAT_Tool_SVG-content-view"
                        style={{ border: "solid 1px #326ba8", backgroundSize: '20px 20px', backgroundImage: 'linear-gradient(to right, rgba(152, 152, 152, 0.3) 1px, transparent 1px),linear-gradient(to bottom, rgba(152, 152, 152, 0.3) 1px, transparent 1px)' }}
                        onMouseDown={(event) => { handleStart(event) }}
                        onMouseMove={(event) => { handleDrag(event); handleDragResize(event) }}
                        onMouseUp={(event) => { handleStop(event); handleStopResize(event) }}
                        viewBox="0 0 1500 1500"



                    >


                        {visual[props.tab].map((data, index) => (

                            <React.Fragment key={data.id}>
                                <foreignObject

                                    id={data.id + "_Drag"}
                                    x={data.x} y={data.y} width={data?.w || 150} height={data?.h || 150}
                                    style={{ border: "dashed 1px #326ba8" }}
                                >
                                    <div className="DAT_Edit">
                                        <div id={data.id + "_" + data.type} className="DAT_Edit-view"></div>
                                        {visdata(data.type, props.id, props.sn, props.tab, data.id, data.w, data.h - 2)}
                                        <div className="DAT_Edit-setting"

                                        >
                                            <ion-icon name="ellipsis-horizontal-outline" id={data.id + "_Edit"} ></ion-icon>
                                        </div>
                                    </div>


                                </foreignObject>
                                {dragState.value
                                    ? <></>
                                    : Number(idDrag) === Number(data.id)
                                        ? <foreignObject id={data.id + "_Rezise"}
                                            onMouseDown={(e) => { handleStartResize(e) }}

                                            x={data.x + (data?.w - 15)} y={data.y + (data?.h - 15)} width="20" height="20">

                                            <div style={{ cursor: "nwse-resize", zIndex: 1, borderBottom: "dashed 3px red", borderRight: "dashed 3px red", width: "15px", height: "15px" }}></div>
                                        </foreignObject>
                                        : <></>

                                }

                            </React.Fragment>



                        ))}





                    </svg>


                </div>

                {/* <div className="scrollArea" style={{ height: "calc(100vh - 70px)", overflowY: "scroll" }}  >
                    <svg
                        id={props.id + "_" + props.tab + "_SVG"}
                        onMouseDown={() => { dragableState.value = true; }}
                        onWheel={() => { console.log("wheel"); dragableState.value = false }}
                        viewBox="0 0 1500 1500"
                        style={{
                            border: "1px solid black",
                            width: "1500px",
                            height: "1500px",

                        }}
                        className="SVG"
                    >

                        {visual[props.tab].map((data, index) => (


                            <foreignObject
                                key={data.id}
                                className="OBJ"
                                id={data.id + "_Drag"}
                                x={data.x} y={data.y} width={data?.w || 150} height={data?.h || 150}
                                style={{ border: "dashed 1px #326ba8" }}
                            >
                                <div className="DAT_Edit">
                                    {visdata(data.type, props.id, props.sn, props.tab, data.id, data.w, data.h - 2)}
                                    <div className="DAT_Edit-setting"

                                    >
                                        <ion-icon name="ellipsis-horizontal-outline" id={data.id + "_Edit"} ></ion-icon>
                                    </div>
                                </div>


                            </foreignObject>

                        ))}

                    </svg>
                    {dragableState.value
                        ? <Moveable
                            ref={moveableRef}
                            target={targets}
                            resizable={true}
                            draggable={true}
                            rotatable={true}
                            // scalable={true}
                            svgOrigin="50% 50%"

                            onClickGroup={e => {
                                selectoRef.current.clickTarget(e.inputEvent, e.inputTarget);
                            }}

                            onDragGroup={e => {
                                e.events.forEach(ev => {
                                    ev.target.style.transform = ev.transform;
                                });
                            }}


                            onDragStart={(e) => {
                                MoveableStartDrag(e)
                            }}

                            onDrag={e => {
                                e.target.style.transform = e.transform;
                                MoveableDrag(e)

                            }}

                            onRender={e => {
                                e.target.style.cssText += e.cssText;

                            }}

                            onDragEnd={e => {
                                MoveableEndDrag(e)
                            }}

                            onDragGroupEnd={e => {
                                MoveableEndDragGroup(e)
                            }}

                            onResize={e => {
                                MoveableResize(e)
                            }}

                        />
                        : <></>
                    }


                    <Selecto
                        ref={selectoRef}
                        dragContainer={window}
                        selectByClick={true}
                        selectFromInside={false}
                        selectableTargets={['.SVG .OBJ']}
                        onDragStart={(e) => {
                            const moveable = moveableRef.current;
                            const target = e.inputEvent.target;
                            if (moveable.isMoveableElement(target) || targets.some(t => t === target || t.contains(target))) {
                                e.stop();
                            }
                        }}

                        onSelectEnd={(e) => {
                            const moveable = moveableRef.current;
                            if (e.isDragStart) {
                                e.inputEvent.preventDefault();
                                moveable.waitToChangeTarget().then(() => {
                                    moveable.dragStart(e.inputEvent);
                                });
                            }
                            setTargets(e.selected);
                        }}

                    >
                    </Selecto>

                </div> */}

            </div>

        </div >
    )
}