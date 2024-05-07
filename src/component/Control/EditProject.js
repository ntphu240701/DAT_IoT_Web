import React, { useEffect, useState } from "react";
import "./Control.scss";
import { IoIosArrowDown } from "react-icons/io";
import Resizer from "react-image-file-resizer";
import { useIntl } from "react-intl";
import { signal } from "@preact/signals-react";
import { Loader } from "@googlemaps/js-api-loader";
import { plantData, plantState } from "./Signal";
import { setKey, geocode, RequestType } from "react-geocode";
import { alertDispatch } from "../Alert/Alert";
import { FaMapMarkerAlt } from "react-icons/fa";
import { userInfor } from "../../App";
import { callApi } from "../Api/Api";
import { host } from "../Lang/Contant";
import { isMobile } from "react-device-detect";
import { IoClose, IoSaveOutline } from "react-icons/io5";
import moment from "moment-timezone";


const projectData = signal({
  name: "",
  phone: "",
  addr: "",
  company: "",
  contact: "",
  lastupdate: moment(new Date()).format("MM/DD/YYYY HH:mm:ss"),
  lat: "16",
  long: "106",
  type: "",
  plantid: "",
  img: "",
})

export default function EditProject(props) {
  const dataLang = useIntl();

  const popup_state = {
    pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
    new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" },
  };

  const handlePopup = (state) => {
    const popup = document.getElementById("Popup");
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  };

  const handleSave = () => {
    var check = 0;
    Object.entries(projectData.value).map(([key, value]) => {
      if (projectData.value[key] === "") {
        check += 1;
      }
    });

    if (check !== 0) {
      alertDispatch(dataLang.formatMessage({ id: "alert_22" }));
    } else {
      console.log(projectData.value);
      const editProject = async () => {
        let d = await callApi("post", host.DATA + "/editPlant", {
          plantid: projectData.value.plantid,
          usr: props.usr,
          name: projectData.value.name,
          company: projectData.value.company,
          addr: projectData.value.addr,
          long: projectData.value.long,
          lat: projectData.value.lat,
          contact: projectData.value.contact,
          phone: projectData.value.phone,
          partnerid: userInfor.value.partnerid,
          usrtype: userInfor.value.type,
          img: projectData.value?.img
            ? projectData.value.img
            : "/dat_picture/solar_panel.png",
        });
 
        if (d.status === true) {
          alertDispatch(dataLang.formatMessage({ id: "alert_30" }));
         
          let index = plantData.value.findIndex(
            
            (item) => item.plantid_ == projectData.value.plantid
          )
         
          let newPlant  = [...plantData.value]

          newPlant[index] = {
            ...newPlant[index],
            name_: projectData.value.name,
            phone_: projectData.value.phone,
            addr_: projectData.value.addr,
            company_: projectData.value.company,
            contact_: projectData.value.contact,
            lastupdate: moment(new Date()).format("MM/DD/YYYY HH:mm:ss"),
            lat_: projectData.value.lat,
            long_: projectData.value.long,
            img: projectData.value.img,
          }

          plantData.value = [...newPlant]
          plantState.value = "default";
        }
      };
      editProject();
    }
  };

  useEffect(() => {
    projectData.value = {
      name:props.data.name_,
      phone:props.data.phone_,
      addr:props.data.addr_,
      company:props.data.company_,
      contact:props.data.contact_,
      createdate:props.data.createdate_,
      lastupdate:props.data.lastupdate_,
      lat:props.data.lat_,
      long:props.data.long_,
      type:props.data.type_,
      plantid:props.data.plantid_,
      img:props.data.img
    };
  },[])

  return (
    <div className="DAT_EditProject">
      <div className="DAT_EditProject_Header">
        <div className="DAT_EditProject_Header_Left">
          {" "}
          {dataLang.formatMessage({ id: "edits" })}{" "}
        </div>

        <div className="DAT_EditProject_Header_Right">
          <div className="DAT_EditProject_Header_Right_Save"
            onClick={() => handleSave()}
          >
            <IoSaveOutline size={20} color="white" />
            <span> {dataLang.formatMessage({ id: "save" })}</span>
          </div>
          <div className="DAT_EditProject_Header_Right_Close">
            <IoClose
              size={25}
              id="Popup"
              onMouseEnter={(e) => handlePopup("new")}
              onMouseLeave={(e) => handlePopup("pre")}
              onClick={() => (plantState.value = "default")}
            />
          </div>
        </div>
      </div>

      <BasicInfo
        tit={dataLang.formatMessage({ id: "basicInfo" })}
        height={isMobile ? "580px" : "300px"}
      />

      <OwnerInfo
        tit={dataLang.formatMessage({ id: "ownerInfo" })}
        height={isMobile ? "270px" : "100px"}
      />

      <ImgInfo
        tit={dataLang.formatMessage({ id: "imgInfo" })}
        height={isMobile ? "260px" : "260px"}
      />
    </div>
  );
}
const BasicInfo = (props) => {
  const dataLang = useIntl();
  const [state, setState] = useState(true);

  const handleBasic = (e) => {
    projectData.value[e.currentTarget.id] = e.currentTarget.value;
  };

  const loader = new Loader({
    apiKey: process.env.REACT_APP_GGKEY,
    version: "weekly",
    libraries: ["places"],
  });

  const initMap = async (name, lat, long) => {

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
        projectData.value = {
          ...projectData.value,
          lat: mapsMouseEvent.latLng.toJSON().lat,
          long: mapsMouseEvent.latLng.toJSON().lng
        };

        const index = plantData.value.findIndex(
          (item) => item.plantid_ == plantData.value.plantid_
        )
        plantData.value[index] = {
          ...plantData.value[index],
          lat_: mapsMouseEvent.latLng.toJSON().lat,
          long_: mapsMouseEvent.latLng.toJSON().lng
        }

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

    // const defaultProps = {
    //   center: {
    //     lat: lat,
    //     lng: long,
    //   },
    //   zoom: 15.0,
    //   mapId: "DEMO_MAP_ID",
    // };

    // const { AdvancedMarkerElement } = await loader.importLibrary("marker");
    // const { Map } = await loader.importLibrary("maps");

    // let map = new Map(document.getElementById("map"), defaultProps);

    // const marker = { lat: parseFloat(lat), lng: parseFloat(long) };
    // const markerElement = new AdvancedMarkerElement({
    //   position: marker,
    //   map: map,
    //   title: name,
    // });
    // markerElement.addListener("click", () => {
    //   // plantState.value = "info";
    //   // projectData.value = item;
    //   // sidebartab.value = "Monitor";
    //   // sidebartabli.value = "/Project";
    // });
    // return markerElement;
  };

  useEffect(() => {
    initMap(
      projectData.value.name,
      parseFloat(projectData.value.lat),
      parseFloat(projectData.value.long)
    );
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
        projectData.value = {
          ...projectData.value,
          lat: response.results[0].geometry.location.lat,
          long: response.results[0].geometry.location.lng,
        };
        initMap(
          projectData.value.name_,
          response.results[0].geometry.location.lat,
          response.results[0].geometry.location.lng
        );
      })
      .catch((error) => {
        alertDispatch(dataLang.formatMessage({ id: "alert_19" }));
      });
  };


  return (
    <div className="DAT_EditProject_BasicInfo">
      <div className="DAT_EditProject_BasicInfo_Tit">
        <div className="DAT_EditProject_BasicInfo_Tit_Left">{props.tit}</div>

        <div className="DAT_EditProject_BasicInfo_Tit_Right"
          onClick={() => setState(!state)}
        >
          <IoIosArrowDown
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
          <div className="DAT_EditProject_BasicInfo_Body">
            <div className="DAT_EditProject_BasicInfo_Body_Left">
              <div className="DAT_EditProject_BasicInfo_Body_Left_Item">
                <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "projname" })}
                  </span>
                </div>
                <input
                  id="name"
                  type="text"
                  defaultValue={projectData.value.name}
                  onChange={(e) => handleBasic(e)}
                />
              </div>

              <div className="DAT_EditProject_BasicInfo_Body_Left_Item">
                <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "address" })}:
                  </span>
                </div>
                {/* <input
                  id="addr"
                  type="text"
                  defaultValue={projectData.value.addr}
                  onChange={(e) => handleBasic(e)}
                /> */}

                <label htmlFor="copy-button" style={{ display: "flex", position: 'relative', alignItems: "center", gap: "5px", cursor: "pointer" }}>
                  <input name="copy-button" aria-label="copy-button" id="addr" type="text" defaultValue={projectData.value.addr} style={{ padding: '5px' }} onChange={(e) => handleBasic(e)} />
                  <FaMapMarkerAlt color="red" size={20} onClick={(e) => handleMap(e)} style={{ position: 'absolute', right: '10px', cursor: "pointer" }} />
                </label>
              </div>

              <div className="DAT_EditProject_BasicInfo_Body_Left_Item">
                <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "coord" })}
                  </span>
                </div>
                <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Posi">
                  <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Posi_Content">
                    <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Posi_Content_Tit">
                      {dataLang.formatMessage({ id: "longitude" })}
                    </div>
                    <input
                      id="long"
                      type="text"
                      defaultValue={projectData.value.long}
                      disabled
                    // onChange={(e) => handleBasic(e)}
                    // onClick={(e) => handleMap(e)}
                    />
                  </div>
                  <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Posi_Content">
                    <div className="DAT_EditProject_BasicInfo_Body_Left_Item_Posi_Content_Tit">
                      {dataLang.formatMessage({ id: "latitude" })}
                    </div>
                    <input
                      id="lat"
                      type="text"
                      defaultValue={projectData.value.lat}
                      disabled
                    // onChange={(e) => handleBasic(e)}
                    // onClick={(e) => handleMap(e)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="DAT_EditProject_BasicInfo_Body_Right">
              <div className="DAT_EditProject_BasicInfo_Body_Right_Item">
                <div className="DAT_EditProject_BasicInfo_Body_Right_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "location" })}
                  </span>
                </div>
                <div className="DAT_EditProject_BasicInfo_Body_Right_Item_Content">
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
    projectData.value[e.currentTarget.id] = e.currentTarget.value;
  };

  return (
    <div className="DAT_EditProject_OwnerInfo">
      <div className="DAT_EditProject_OwnerInfo_Tit">
        <div className="DAT_EditProject_OwnerInfo_Tit_Left">{props.tit}</div>

        <div className="DAT_EditProject_OwnerInfo_Tit_Right"
          onClick={() => setState(!state)}
        >
          <IoIosArrowDown
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
          <div className="DAT_EditProject_OwnerInfo_Body">
            <div className="DAT_EditProject_OwnerInfo_Body_Left">
              <div className="DAT_EditProject_OwnerInfo_Body_Left_Item">
                <div className="DAT_EditProject_OwnerInfo_Body_Left_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "contactName" })}:
                  </span>
                </div>
                <input
                  id="contact"
                  type="text"
                  defaultValue={projectData.value.contact}
                  onChange={(e) => handleOwner(e)}
                />
              </div>
            </div>

            <div className="DAT_EditProject_OwnerInfo_Body_Center">
              <div className="DAT_EditProject_OwnerInfo_Body_Center_Item">
                <div className="DAT_EditProject_OwnerInfo_Body_Center_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "phone" })}:
                  </span>
                </div>
                <input
                  id="phone"
                  type="text"
                  defaultValue={projectData.value.phone}
                  onChange={(e) => handleOwner(e)}
                />
              </div>
            </div>

            <div className="DAT_EditProject_OwnerInfo_Body_Right">
              <div className="DAT_EditProject_OwnerInfo_Body_Right_Item">
                <div className="DAT_EditProject_OwnerInfo_Body_Right_Item_Tit">
                  <span style={{ color: "red" }}>* </span>
                  <span style={{ color: "grey" }}>
                    {dataLang.formatMessage({ id: "companyName" })}:
                  </span>
                </div>
                <input
                  id="company"
                  type="text"
                  defaultValue={projectData.value.company}
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

const ImgInfo = (props) => {
  const dataLang = useIntl();
  const [state, setState] = useState(true);
  const [ava, setAva] = useState(
    projectData.value.img
      ? projectData.value.img
      : "/dat_picture/solar_panel.png"
  );
  const resizeFilAvatar = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        180,
        180,
        "PNG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });

  const handleChooseAvatar = async (e) => {
    // setAva(URL.createObjectURL(e.target.files[0]));
    // projectData.value[e.currentTarget.id] = e.current
    var reader = new FileReader();
    if (e.target.files[0].size > 50000) {
      const image = await resizeFilAvatar(e.target.files[0]);
      reader.readAsDataURL(image);
      reader.onload = () => {
        setAva(reader.result);
        projectData.value.img = reader.result;
      };
    } else {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setAva(reader.result);
        projectData.value.img = reader.result;
      };
    }
  };

  return (
    <div className="DAT_EditProject_ImgInfo">
      <div className="DAT_EditProject_ImgInfo_Tit">
        <div className="DAT_EditProject_ImgInfo_Tit_Left">{props.tit}</div>

        <div className="DAT_EditProject_ImgInfo_Tit_Right"
          onClick={() => setState(!state)}
        >
          <IoIosArrowDown
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
          <div className="DAT_EditProject_ImgInfo_Body">
            <div className="DAT_EditProject_ImgInfo_Body_Ava">
              <div className="DAT_EditProject_ImgInfo_Body_Ava_Img">
                <img src={ava} alt="" />
              </div>
              <input
                type="file"
                id="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => handleChooseAvatar(e)}
              />
              <label htmlFor="file" style={{ cursor: "pointer" }}>
                {dataLang.formatMessage({ id: "chooseImg" })}
              </label>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
