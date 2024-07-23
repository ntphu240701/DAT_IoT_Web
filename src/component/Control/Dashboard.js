import React, { useEffect, useState } from "react";
import "./Control.scss";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { LuInfo } from "react-icons/lu";
import { Loader } from "@googlemaps/js-api-loader";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { IoCalendarOutline, IoLocationSharp } from "react-icons/io5";
import { IoMdContact } from "react-icons/io";
import { IoCalendar } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import { signal } from "@preact/signals-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { isBrowser } from "react-device-detect";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { sidebartab, sidebartabli } from "../Sidenar/Sidenar";
import { mode } from "./Signal";

export const plantnameFilterSignal = signal("");

export default function Dashboard(props) {
  const [devicedata, setDevicedata] = useState([]);
  const [chart, setChart] = useState("year");
  const [d, setD] = useState({
    month: moment(new Date()).format("MM/YYYY"),
    year: moment(new Date()).format("YYYY"),
  });

  const datalang = useIntl();
  const v = datalang.formatMessage({ id: "monthOutput" });
  const data = [
    {
      name: "1",
      [v]: 0,
    },
    {
      name: "2",
      [v]: 0,
    },
    {
      name: "3",
      [v]: 0,
    },
    {
      name: "4",
      [v]: 0,
    },
    {
      name: "5",
      [v]: 0,
    },
    {
      name: "6",
      [v]: 0,
    },
    {
      name: "7",
      [v]: 0,
    },
    {
      name: "8",
      [v]: 0,
    },
    {
      name: "9",
      [v]: 0,
    },
    {
      name: "10",
      [v]: 0,
    },
    {
      name: "11",
      [v]: 0,
    },
    {
      name: "12",
      [v]: 0,
    },
  ];
  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={"rgb(4,143,255)"}
        rx="3"
        ry="3"
        opacity="1"
      ></rect>
    );
  };

  // const defaultProps = {
  //   center: {
  //     lat: 16.0544068,
  //     lng: 108.2021667,
  //   },
  //   zoom: 5,
  //   mapId: "my_map2",
  // };

  const loader = new Loader({
    apiKey: process.env.REACT_APP_GGKEY,
    version: "weekly",
    libraries: ["places"],
  });

  const initMap = async (data) => {
    loader.load().then(async (google) => {
      const defaultProps = {
        center: {
          lat: parseFloat(data?.lat_ ? data.lat_ : 16.0544068),
          lng: parseFloat(data?.long_ ? data.long_ : 108.2021667),
        },
        zoom: 15.0,
        mapId: "my_map2",
      };

      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary(
        "marker"
      );
      let map = new Map(document.getElementById("map2"), defaultProps);
   
      const marker = {
        lat: parseFloat(data?.lat_ ? data.lat_ : 16.0544068),
        lng: parseFloat(data?.long_ ? data.long_ : 108.2021667),
      };
      const markerElement = new AdvancedMarkerElement({
        position: marker,
        map: map,
        title: data.name_,
      });
      return markerElement;
    });
  };

  useEffect(() => {
    if (props.data) {
      if (props.data) {
        // console.log(props.data);
      
          initMap(props.data);
        
        const getGateway = async () => {
          let res = await callApi("post", host.DATA + "/getLogger", {
            plantid: props.data.plantid_,
          });
          if (res.status) {
            console.log(res.data.sort((a, b) => a.id_ - b.id_));
            setDevicedata(res.data.sort((a, b) => a.id_ - b.id_));
          }
        };

        getGateway();
      }
    }
  }, [props.data, mode.value]);

  return (
    <>
      {isBrowser ? (
        <div className="DAT_MainInfo">
          {/* <div className="DAT_MainInfo_Title">Tổng số thiết bị : 3</div> */}
          <div className="DAT_MainInfo_Status">
            <div className="DAT_MainInfo_Status_Item">
              <div
                className="DAT_MainInfo_Status_Item_Header"
                style={{ color: "rgba(13, 190, 0)" }}
              >
                <span>{datalang.formatMessage({ id: "online" })}</span>
                <LuInfo />
              </div>
              <div
                className="DAT_MainInfo_Status_Item_State"
                style={{ color: "#0B1967" }}
              >
                {devicedata.filter((item) => item.state_ === 1).length}/
                {devicedata.length}
              </div>
            </div>
            <div className="DAT_MainInfo_Status_Item">
              <div
                className="DAT_MainInfo_Status_Item_Header"
                style={{ color: "rgba(117, 117, 117)" }}
              >
                <span>{datalang.formatMessage({ id: "offline" })}</span>
                <LuInfo />
              </div>
              <div
                className="DAT_MainInfo_Status_Item_State"
                style={{ color: "#0B1967" }}
              >
                {devicedata.filter((item) => item.state_ === 0).length}/
                {devicedata.length}
              </div>
            </div>
            <Link
              className="DAT_MainInfo_Status_Item"
              to="/Warn"
              style={{ textDecoration: "none" }}
              onClick={() => {
                plantnameFilterSignal.value = props.data.name_;
                sidebartab.value = "Monitor";
                sidebartabli.value = "/Warn";
              }}
            >
              <div
                className="DAT_MainInfo_Status_Item_Header"
                style={{ color: "rgba(158, 0, 0, 0.8)" }}
              >
                <span>{datalang.formatMessage({ id: "erroccur" })}</span>
                <LuInfo />
              </div>
              <div
                className="DAT_MainInfo_Status_Item_State"
                style={{ color: "#0B1967" }}
              >
                0/
                {devicedata.length}
              </div>
            </Link>
            <div className="DAT_MainInfo_Status_Item">
              <div
                className="DAT_MainInfo_Status_Item_Header"
                style={{ color: "rgba(209, 118, 0, 0.9)" }}
              >
                <span>{datalang.formatMessage({ id: "maintenance" })}</span>
                <LuInfo />
              </div>
              <div
                className="DAT_MainInfo_Status_Item_State"
                style={{ color: "#0B1967" }}
              >
                0/
                {devicedata.length}
              </div>
            </div>
          </div>

          {/* <div className="DAT_MainInfo_Title">Thông tin dự án</div> */}
          <div className="DAT_MainInfo_Map">
            <div className="DAT_MainInfo_Map_Item1">
              <div
                id="map2"
                style={{ width: "100%", height: "100%", borderRadius: "5px" }}
              ></div>
            </div>
            <div className="DAT_MainInfo_Map_Item2">
              <div className="DAT_MainInfo_Map_Item2_Info">
                <div className="DAT_MainInfo_Map_Item2_Info_Row">
                  <div className="DAT_MainInfo_Map_Item2_Info_Row_Head">
                    <MdDriveFileRenameOutline size={23} color="white" />
                  </div>
                  <div className="DAT_MainInfo_Map_Item2_Info_Row_Data">
                    <div className="DAT_MainInfo_Map_Item2_Info_Row_Data_Tit">
                      {datalang.formatMessage({ id: "companyName" })}
                    </div>
                    {props.data.company_}
                  </div>
                </div>
                <div className="DAT_MainInfo_Map_Item2_Info_Row">
                  <div className="DAT_MainInfo_Map_Item2_Info_Row_Head">
                    <IoLocationSharp size={23} color="white" />
                  </div>
                  <div className="DAT_MainInfo_Map_Item2_Info_Row_Data">
                    <div className="DAT_MainInfo_Map_Item2_Info_Row_Data_Tit">
                      {datalang.formatMessage({ id: "address" })}
                    </div>
                    {props.data.addr_}
                  </div>
                </div>
                <div className="DAT_MainInfo_Map_Item2_Info_Row">
                  <div className="DAT_MainInfo_Map_Item2_Info_Row_Head">
                    <IoMdContact size={23} color="white" />
                  </div>
                  <div className="DAT_MainInfo_Map_Item2_Info_Row_Data">
                    <div className="DAT_MainInfo_Map_Item2_Info_Row_Data_Tit">
                      {datalang.formatMessage({ id: "contact" })}
                    </div>
                    {props.data.contact_}
                  </div>
                </div>
                <div className="DAT_MainInfo_Map_Item2_Info_Row">
                  <div className="DAT_MainInfo_Map_Item2_Info_Row_Head">
                    <FaPhone size={18} color="white" />
                  </div>
                  <div className="DAT_MainInfo_Map_Item2_Info_Row_Data">
                    <div className="DAT_MainInfo_Map_Item2_Info_Row_Data_Tit">
                      {datalang.formatMessage({ id: "phone" })}
                    </div>
                    {props.data.phone_}
                  </div>
                </div>
                <div className="DAT_MainInfo_Map_Item2_Info_Row">
                  <div className="DAT_MainInfo_Map_Item2_Info_Row_Head">
                    <IoCalendar size={20} color="white" />
                  </div>
                  <div className="DAT_MainInfo_Map_Item2_Info_Row_Data">
                    <div className="DAT_MainInfo_Map_Item2_Info_Row_Data_Tit">
                      {datalang.formatMessage({ id: "createdate" })}
                    </div>
                    {props.data.createdate_}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="DAT_MainInfo_Graph">
            {/* <div className="DAT_MainInfo_Graph_Header"></div> */}
            <div className="DAT_MainInfo_Graph_Head">
              <div className="DAT_MainInfo_Graph_Head_Title">
                {datalang.formatMessage({ id: "history" })}
              </div>
              <div className="DAT_MainInfo_Graph_Head_Option">
                <span
                  style={{
                    backgroundColor:
                      chart === "year" ? "rgb(11, 25, 103)" : "white",
                    color: chart === "year" ? "white" : "black",
                  }}
                  onClick={() => {
                    setChart("year");
                  }}
                >
                  {datalang.formatMessage({ id: "year" })}
                </span>
                <span
                  style={{
                    backgroundColor:
                      chart === "month" ? "rgb(11, 25, 103)" : "white",
                    color: chart === "month" ? "white" : "black",
                  }}
                  onClick={() => {
                    setChart("month");
                  }}
                >
                  {datalang.formatMessage({ id: "month" })}
                </span>
              </div>
              <div className="DAT_MainInfo_Graph_Head_Datetime">
                {/* <DatePicker
                  // id="datepicker"
                  // onChange={(date) => handleChart(date)}
                  showMonthYearPicker={chart === "year" ? false : true}
                  showYearPicker={chart === "month" ? false : true}
                  customInput={
                    <button className="DAT_CustomPicker">
                      <span>{d[chart]}</span>
                      <IoCalendarOutline color="gray" />
                    </button>
                  }
                /> */}
                <input type="date" />
              </div>
            </div>

            <div className="DAT_MainInfo_Graph_Group">
              {/* <div className="DAT_MainInfo_Graph_Group_Unit">Unit</div> */}
              <div className="DAT_MainInfo_Graph_Group_Label">
                {chart === "year"
                  ? datalang.formatMessage({ id: "yearOutput" })
                  : datalang.formatMessage({ id: "monthOutput" })}
                : 0 kWh
              </div>
            </div>
            <div style={{ width: "100%", height: "250px" }}>
              <ResponsiveContainer style={{ width: "100%", height: "100%" }}>
                <BarChart width={150} height={100} data={data}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    shape={<TriangleBar />}
                    dataKey={v}
                    fill="#6495ed"
                    barSize={15}
                    legendType="circle"
                    style={{ fill: "#6495ed" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="DAT_MainInfoMobile">
          {/* <div className="DAT_MainInfo_Title">Tổng số thiết bị : 3</div> */}
          <div className="DAT_MainInfoMobile_Status">
            <div className="DAT_MainInfoMobile_Status_Item">
              <div
                className="DAT_MainInfoMobile_Status_Item_Header"
                style={{ color: "rgba(13, 190, 0)" }}
              >
                <span>{datalang.formatMessage({ id: "online" })}</span>
                <LuInfo />
              </div>
              <div
                className="DAT_MainInfoMobile_Status_Item_State"
                style={{ color: "#0B1967" }}
              >
                {devicedata.filter((item) => item.state_ === 1).length}/
                {devicedata.length}
              </div>
            </div>
            <div className="DAT_MainInfoMobile_Status_Item">
              <div
                className="DAT_MainInfoMobile_Status_Item_Header"
                style={{ color: "rgba(117, 117, 117)" }}
              >
                <span>{datalang.formatMessage({ id: "offline" })}</span>
                <LuInfo />
              </div>
              <div
                className="DAT_MainInfoMobile_Status_Item_State"
                style={{ color: "#0B1967" }}
              >
                {devicedata.filter((item) => item.state_ === 0).length}/
                {devicedata.length}
              </div>
            </div>
            <div className="DAT_MainInfoMobile_Status_Item">
              <div
                className="DAT_MainInfoMobile_Status_Item_Header"
                style={{ color: "rgba(158, 0, 0, 0.8)" }}
              >
                <span>{datalang.formatMessage({ id: "erroccur" })}</span>
                <LuInfo />
              </div>
              <div
                className="DAT_MainInfoMobile_Status_Item_State"
                style={{ color: "#0B1967" }}
              >
                0/
                {devicedata.length}
              </div>
            </div>
            <div className="DAT_MainInfoMobile_Status_Item">
              <div
                className="DAT_MainInfoMobile_Status_Item_Header"
                style={{ color: "rgba(209, 118, 0, 0.9)" }}
              >
                <span>{datalang.formatMessage({ id: "maintenance" })}</span>
                <LuInfo />
              </div>
              <div
                className="DAT_MainInfoMobile_Status_Item_State"
                style={{ color: "#0B1967" }}
              >
                0/
                {devicedata.length}
              </div>
            </div>
          </div>

          {/* <div className="DAT_MainInfo_Title">Thông tin dự án</div> */}
          <div className="DAT_MainInfoMobile_Map">
            <div className="DAT_MainInfoMobile_Map_Item1">
              <div
                id="map2"
                style={{ width: "100%", height: "100%", borderRadius: "5px" }}
              ></div>
            </div>
            <div className="DAT_MainInfoMobile_Map_Item2">
              <div className="DAT_MainInfoMobile_Map_Item2_Info">
                <div className="DAT_MainInfoMobile_Map_Item2_Info_Row">
                  <div className="DAT_MainInfoMobile_Map_Item2_Info_Row_Head">
                    <MdDriveFileRenameOutline size={23} color="white" />
                  </div>
                  <div className="DAT_MainInfoMobile_Map_Item2_Info_Row_Data">
                    <div className="DAT_MainInfoMobile_Map_Item2_Info_Row_Data_Tit">
                      {datalang.formatMessage({ id: "companyName" })}
                    </div>
                    {props.data.company_}
                  </div>
                </div>
                <div className="DAT_MainInfoMobile_Map_Item2_Info_Row">
                  <div className="DAT_MainInfoMobile_Map_Item2_Info_Row_Head">
                    <IoLocationSharp size={23} color="white" />
                  </div>
                  <div className="DAT_MainInfoMobile_Map_Item2_Info_Row_Data">
                    <div className="DAT_MainInfoMobile_Map_Item2_Info_Row_Data_Tit">
                      {datalang.formatMessage({ id: "address" })}
                    </div>
                    {props.data.addr_}
                  </div>
                </div>
                <div className="DAT_MainInfoMobile_Map_Item2_Info_Row">
                  <div className="DAT_MainInfoMobile_Map_Item2_Info_Row_Head">
                    <IoMdContact size={23} color="white" />
                  </div>
                  <div className="DAT_MainInfoMobile_Map_Item2_Info_Row_Data">
                    <div className="DAT_MainInfoMobile_Map_Item2_Info_Row_Data_Tit">
                      {datalang.formatMessage({ id: "contact" })}
                    </div>
                    {props.data.contact_}
                  </div>
                </div>
                <div className="DAT_MainInfoMobile_Map_Item2_Info_Row">
                  <div className="DAT_MainInfoMobile_Map_Item2_Info_Row_Head">
                    <FaPhone size={18} color="white" />
                  </div>
                  <div className="DAT_MainInfoMobile_Map_Item2_Info_Row_Data">
                    <div className="DAT_MainInfoMobile_Map_Item2_Info_Row_Data_Tit">
                      {datalang.formatMessage({ id: "phone" })}
                    </div>
                    {props.data.phone_}
                  </div>
                </div>
                <div className="DAT_MainInfoMobile_Map_Item2_Info_Row">
                  <div className="DAT_MainInfoMobile_Map_Item2_Info_Row_Head">
                    <IoCalendar size={20} color="white" />
                  </div>
                  <div className="DAT_MainInfoMobile_Map_Item2_Info_Row_Data">
                    <div className="DAT_MainInfoMobile_Map_Item2_Info_Row_Data_Tit">
                      {datalang.formatMessage({ id: "createdate" })}
                    </div>
                    {props.data.createdate_}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="DAT_MainInfoMobile_Graph">
            {/* <div className="DAT_MainInfo_Graph_Header"></div> */}
            <div className="DAT_MainInfoMobile_Graph_Head">
              <div className="DAT_MainInfoMobile_Graph_Head_Title">
                {datalang.formatMessage({ id: "history" })}
              </div>
              <div className="DAT_MainInfoMobile_Graph_Head_Option">
                <span
                  style={{
                    backgroundColor:
                      chart === "year" ? "rgb(11, 25, 103)" : "white",
                    border:
                      chart === "year"
                        ? "solid 1.5px rgb(11, 25, 103)"
                        : "solid 1.5px 0 1.5px 1.5px rgb(11, 25, 103)",
                    color: chart === "year" ? "white" : "black",
                    borderRadius: "5px 0px 0px 5px",
                  }}
                  onClick={() => {
                    setChart("year");
                  }}
                >
                  {datalang.formatMessage({ id: "year" })}
                </span>
                <span
                  style={{
                    backgroundColor:
                      chart === "month" ? "rgb(11, 25, 103)" : "white",
                    border:
                      chart === "month"
                        ? "solid 1.5px rgb(11, 25, 103) !important"
                        : "solid 1.5px 1.5px 1.5px 0 rgb(11, 25, 103)",
                    color: chart === "month" ? "white" : "black",
                    borderRadius: "0px 5px 5px 0",
                  }}
                  onClick={() => {
                    setChart("month");
                  }}
                >
                  {datalang.formatMessage({ id: "month" })}
                </span>
              </div>
              <div className="DAT_MainInfoMobile_Graph_Head_Datetime">
                {/* <DatePicker
                  // id="datepicker"
                  // onChange={(date) => handleChart(date)}
                  showMonthYearPicker={chart === "year" ? false : true}
                  showYearPicker={chart === "month" ? false : true}
                  customInput={
                    <button className="DAT_CustomPicker">
                      <span>{[chart]}</span>
                      <IoCalendarOutline color="gray" />
                    </button>
                  }
                /> */}
                <input type="date" />
              </div>
            </div>

            <div className="DAT_MainInfoMobile_Graph_Group">
              {/* <div className="DAT_MainInfo_Graph_Group_Unit">Unit</div> */}
              <div className="DAT_MainInfoMobile_Graph_Group_Label">
                {datalang.formatMessage({ id: "yearlyReport" })}: 0 Wh
              </div>
            </div>
            <div style={{ width: "100%", height: "250px" }}>
              <ResponsiveContainer style={{ width: "100%", height: "100%" }}>
                <BarChart width={150} height={100} data={data}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    shape={<TriangleBar />}
                    dataKey={v}
                    fill="#6495ed"
                    barSize={15}
                    legendType="circle"
                    style={{ fill: "#6495ed" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
