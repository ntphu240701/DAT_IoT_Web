import React, { useEffect, useState } from "react";
import "./Control.scss";
import { signal } from "@preact/signals-react";
import { setKey, geocode, RequestType } from "react-geocode";
import moment from "moment-timezone";
import { Loader } from "@googlemaps/js-api-loader";
import { useIntl } from "react-intl";
import { IoClose, IoSaveOutline } from "react-icons/io5";
import { isMobile } from "react-device-detect";
import { plantData, plantState } from "./Signal";
import { alertDispatch } from "../Alert/Alert";
import { IoIosArrowUp } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";
import { userInfor } from "../../App";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";

const plantTemplate = signal({
  name: "",
  phone: "",
  addr: "",
  company: "",
  contact: "",
  createdate: moment(new Date()).format("MM/DD/YYYY HH:mm:ss"),
  lastupdate: moment(new Date()).format("MM/DD/YYYY HH:mm:ss"),
  lat: "",
  long: "",
  type: "",
});

export default function AddProject(props) {
  const dataLang = useIntl();
  const popup_state = {
    pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
    new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" },
  };


  useEffect(() => {
      plantTemplate.value = { 
        ...plantTemplate.value,
        type:props.type
       };
       return () => {
        plantTemplate.value = {
          name: "",
          phone: "",
          addr: "",
          company: "",
          contact: "",
          createdate: moment(new Date()).format("MM/DD/YYYY HH:mm:ss"),
          lastupdate: moment(new Date()).format("MM/DD/YYYY HH:mm:ss"),
          lat: "",
          long: "",
          type: "",
        };
        
       }

  },[])


  const handleSaveBasic = () => {
    var check = 0;
    Object.entries(plantTemplate.value).map(([key, value]) => {
      if (plantTemplate.value[key] === "") {
        check += 1;
      }
    });

    if (check !== 0) {
      alertDispatch(dataLang.formatMessage({ id: "alert_22" }));
    } else {
      const addProject = async () => {
        let d = await callApi("post", host.DATA + "/addPlant", {
          usr: props.usr,
          name: plantTemplate.value.name,
          addr: plantTemplate.value.addr,
          long: plantTemplate.value.long,
          lat: plantTemplate.value.lat,
          contact: plantTemplate.value.contact,
          phone: plantTemplate.value.phone,
          company: plantTemplate.value.company,
          type: plantTemplate.value.type,
          partnerid: userInfor.value.partnerid,
        });
        console.log(d);
        if (d.status === true) {
          alertDispatch(dataLang.formatMessage({ id: "alert_29" }));
          plantData.value = [...plantData.value, d.data];
          plantState.value = "default";
        }
      };

      addProject();
    }
  };
  const handlePopup = (state) => {
    const popup = document.getElementById("Popup");
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  };

  return (
    <div className="DAT_AddProject">
    <div className="DAT_AddProject_Header">
      <div className="DAT_AddProject_Header_Left">
        {dataLang.formatMessage({ id: "addProj" })}
      </div>

      <div className="DAT_AddProject_Header_Right">
        <div className="DAT_AddProject_Header_Right_Save"
          onClick={() => handleSaveBasic()}
        >
          <IoSaveOutline size={20} color="white" />
          <span>{dataLang.formatMessage({ id: "save" })}</span>
        </div>
        <div className="DAT_AddProject_Header_Right_Close"
          onClick={() => (plantState.value = "default")}
        >
          <IoClose
            size={25}
            id="Popup"
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
          />
        </div>
      </div>
    </div>

    <BasicInfo
      tit={dataLang.formatMessage({ id: "basicInfo" })}
      height={isMobile ? "580px" : "300px"}
    />

    {/* <SystemInfo
      tit={dataLang.formatMessage({ id: "systemInfo" })}
      height={isMobile.value ? "440px" : "190px"}
    /> */}

    {/* <YieldInfo
      tit={dataLang.formatMessage({ id: "yieldInfo" })}
      height={isMobile.value ? "180px" : "100px"}
    /> */}

    <OwnerInfo
      tit={dataLang.formatMessage({ id: "ownerInfo" })}
      height={isMobile ? "270px" : "100px"}
    />

    {/* <ImgInfo
      tit={dataLang.formatMessage({ id: 'imgInfo' })}
      height={isMobile.value ? "320px" : "260px"}
    /> */}
  </div>
  );
}


const BasicInfo = (props) => {
  const dataLang = useIntl();
  const [state, setState] = useState(true);

  const loader = new Loader({
    apiKey: process.env.REACT_APP_GGKEY,
    version: "weekly",
    libraries: ["places"],
  });

  const initMap = async (name, lat, long, state) => {

    loader.load().then(async (google) => {
      const defaultProps = {
        center: {
          lat: lat,
          lng: long,
        },
        zoom: 15.0,
        mapId: "DEMO_MAP_ID",
      };

      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      let map = new Map(document.getElementById("map"), defaultProps);

      const myLatlng = { lat: lat, lng: long };

      let infoWindow = new google.maps.InfoWindow({
        content: 'Your position',
        position: myLatlng,
      });

      // Configure the click listener.
      map.addListener("click", (mapsMouseEvent) => {
        // Close the current InfoWindow.
        infoWindow.close();
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
          position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
          JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2),
        );
        infoWindow.open(map);
        var long_ = document.getElementById("long");
        var lat_ = document.getElementById("lat");
        lat_.value = mapsMouseEvent.latLng.toJSON().lat;
        long_.value = mapsMouseEvent.latLng.toJSON().lng;
        plantTemplate.value = {
          ...plantTemplate.value,
          lat: mapsMouseEvent.latLng.toJSON().lat,
          long: mapsMouseEvent.latLng.toJSON().lng,
        };

      });

      if (state) {
        const marker = { lat: parseFloat(lat), lng: parseFloat(long) };
        const markerElement = new AdvancedMarkerElement({
          position: marker,
          map: map,
          title: name,
        });
        return markerElement;
      }
    })

    // const { AdvancedMarkerElement } = await loader.importLibrary("marker");
    // const { Map } = await loader.importLibrary("maps");
    // const { InfoWindow } = await loader.importLibrary("infowindow");

    // let map = new Map(document.getElementById("map"), defaultProps);
    // if (state) {
    //   const marker = { lat: parseFloat(lat), lng: parseFloat(long) };
    //   const markerElement = new AdvancedMarkerElement({
    //     position: marker,
    //     map: map,
    //     title: name,
    //   });
    // markerElement.addListener("click", () => {
    //   // plantState.value = "info";
    //   // projectData.value = item;
    //   // sidebartab.value = "Monitor";
    //   // sidebartabli.value = "/Project";
    // });
    // return markerElement;
    // }
  };

  useEffect(() => {
    initMap("", 16.123456789, 108.123456789, false);
    return () => { 
      
    };
  }, []);

  const handleMap = (e) => {
    const addr = document.getElementById("addr");
    setKey(process.env.REACT_APP_GGKEY);
    geocode(RequestType.ADDRESS, addr.value)
      .then((response) => {
        var long_ = document.getElementById("long");
        var lat_ = document.getElementById("lat");
        lat_.value = response.results[0].geometry.location.lat;
        long_.value = response.results[0].geometry.location.lng;
        plantTemplate.value = {
          ...plantTemplate.value,
          lat: response.results[0].geometry.location.lat,
          long: response.results[0].geometry.location.lng,
        };
        initMap(
          plantTemplate.value.name,
          response.results[0].geometry.location.lat,
          response.results[0].geometry.location.lng,
          true
        );
      })
      .catch((error) => {
        alertDispatch(dataLang.formatMessage({ id: "alert_19" }));
      });
  };

  const handleBasic = (e) => {
    plantTemplate.value[e.currentTarget.id] = e.currentTarget.value;
  };


 
  return (
    <div className="DAT_AddProject_BasicInfo">
      <div className="DAT_AddProject_BasicInfo_Tit">
        <div className="DAT_AddProject_BasicInfo_Tit_Left">{props.tit}</div>

        <div
          className="DAT_AddProject_BasicInfo_Tit_Right"
          onClick={() => setState(!state)}
        >
          <IoIosArrowUp
            size={20}
            style={{
              transform: state ? "rotate(0deg)" : "rotate(180deg)",
              transition: "0.5s",
            }}
          />
        </div>
      </div>

      <div
        style={{
          height: state ? props.height : "0px",
          transition: "0.5s",
          overflow: "hidden",
        }}
      >
        {state ? (
          <div className="DAT_AddProject_BasicInfo_Body">
            <div className="DAT_AddProject_BasicInfo_Body_Left">
              <div className="DAT_AddProject_BasicInfo_Body_Left_Item">
                <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "projname" })}
                  </span>
                </div>
                <input
                  id="name"
                  type="text"
                  onChange={(e) => handleBasic(e)}
                />
              </div>

              <div className="DAT_AddProject_BasicInfo_Body_Left_Item">
                <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "address" })}:
                  </span>
                </div>
                {/* <input id="addr" type="text" onChange={(e) => handleBasic(e)} /> */}

                <label htmlFor="copy-button" style={{ display: "flex", position: 'relative', alignItems: "center", gap: "5px", cursor: "pointer" }}>
                  <input name="copy-button" aria-label="copy-button" id="addr" type="text" style={{ padding: '5px' }} onChange={(e) => handleBasic(e)} />
                  <FaMapMarkerAlt color="red" size={20} onClick={(e) => handleMap(e)} style={{ position: 'absolute', right: '10px', cursor: "pointer" }} />
                </label>


              </div>

              <div className="DAT_AddProject_BasicInfo_Body_Left_Item">
                <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "coord" })}
                  </span>
                </div>
                <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Posi">
                  <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Posi_Content">
                    <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Posi_Content_Tit">
                      {dataLang.formatMessage({ id: "longitude" })}
                    </div>
                    <input
                      id="long"
                      type="text"
                      // onChange={(e) => handleBasic(e)}
                      // onClick={(e) => handleMap(e)}
                      disabled
                      required
                    />
                  </div>
                  <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Posi_Content">
                    <div className="DAT_AddProject_BasicInfo_Body_Left_Item_Posi_Content_Tit">
                      {dataLang.formatMessage({ id: "latitude" })}
                    </div>
                    <input
                      id="lat"
                      type="text"
                      // onChange={(e) => handleBasic(e)}
                      // onClick={(e) => handleMap(e)}
                      disabled
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="DAT_AddProject_BasicInfo_Body_Right">
              <div className="DAT_AddProject_BasicInfo_Body_Right_Item">
                <div className="DAT_AddProject_BasicInfo_Body_Right_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "location" })}
                  </span>
                </div>
                <div className="DAT_AddProject_BasicInfo_Body_Right_Item_Content">
                  <div id="map" style={{ width: "100%", height: "100%" }}></div>
                  {/* <GoogleMap
                    apiKey={process.env.REACT_APP_GGKEY}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                  //onGoogleApiLoaded={onGoogleApiLoaded}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};


const OwnerInfo = (props) => {
  const dataLang = useIntl();
  const [state, setState] = useState(true);

  const handleOwner = (e) => {
    plantTemplate.value[e.currentTarget.id] = e.currentTarget.value;
  };

  return (
    <div className="DAT_AddProject_OwnerInfo">
      <div className="DAT_AddProject_OwnerInfo_Tit">
        <div className="DAT_AddProject_OwnerInfo_Tit_Left">{props.tit}</div>

        <div
          className="DAT_AddProject_OwnerInfo_Tit_Right"
          onClick={() => setState(!state)}
        >
          <IoIosArrowUp
            size={20}
            style={{
              transform: state ? "rotate(0deg)" : "rotate(180deg)",
              transition: "0.5s",
            }}
          />
        </div>
      </div>

      <div
        style={{
          height: state ? props.height : "0px",
          transition: "0.5s",
          overflow: "hidden",
        }}
      >
        {state ? (
          <div className="DAT_AddProject_OwnerInfo_Body">
            <div className="DAT_AddProject_OwnerInfo_Body_Left">
              <div className="DAT_AddProject_OwnerInfo_Body_Left_Item">
                <div className="DAT_AddProject_OwnerInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "contactName" })}:
                  </span>
                </div>
                <input
                  id="contact"
                  type="text"
                  onChange={(e) => handleOwner(e)}
                />
              </div>
            </div>

            <div className="DAT_AddProject_OwnerInfo_Body_Center">
              <div className="DAT_AddProject_OwnerInfo_Body_Center_Item">
                <div className="DAT_AddProject_OwnerInfo_Body_Center_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "phone" })}:
                  </span>
                </div>
                <input
                  id="phone"
                  type="text"
                  onChange={(e) => handleOwner(e)}
                />
              </div>
            </div>

            <div className="DAT_AddProject_OwnerInfo_Body_Right">
              <div className="DAT_AddProject_OwnerInfo_Body_Right_Item">
                <div className="DAT_AddProject_OwnerInfo_Body_Right_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "companyName" })}:
                  </span>
                </div>
                <input
                  id="company"
                  type="text"
                  onChange={(e) => handleOwner(e)}
                />
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};