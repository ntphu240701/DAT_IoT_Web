import { Loader } from '@googlemaps/js-api-loader';
import React, { useContext, useEffect } from 'react';
import { isBrowser, useMobileOrientation } from 'react-device-detect';
import { IoClose } from 'react-icons/io5';
import { useIntl } from 'react-intl';
import { listDevice, plantState } from '../Control/Signal';
// import Project from '../Control/Project';
import { useSelector } from 'react-redux';
// import { deviceData } from '../Project/Project';
import { OverviewContext } from '../Context/OverviewContext';
import { callApi } from '../Api/Api';
import { host } from '../Lang/Contant';
import { ToolContext } from '../Context/ToolContext';



function Map(props) {
    const dataLang = useIntl();
    const user = useSelector((state) => state.admin.usr);
    const { isLandscape } = useMobileOrientation()
    const { overviewDispatch } = useContext(OverviewContext)
    const {toolDispatch} = useContext(ToolContext)

    const popup_state = {
        pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
        new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" }
    }


    const handlePopup = (state) => {
        const popup = document.getElementById("Popup-2")
        popup.style.transform = popup_state[state].transform;
        popup.style.transition = popup_state[state].transition;
        popup.style.color = popup_state[state].color;
    }

    const defaultProps = {
        center: {
            lat: 16.0544068,
            lng: 108.2021667,
        },
        zoom: 6,
        mapId: "my_map",
    };


    const loader = new Loader({
        apiKey: process.env.REACT_APP_GGKEY,
        version: "weekly",
        libraries: ["places"],
    });

    const initMap = async (data) => {
        const { AdvancedMarkerElement } = await loader.importLibrary("marker");
        const { Map } = await loader.importLibrary("maps");

        let map = new Map(document.getElementById("map"), defaultProps);

   
        

        data.map((item) => {
            const priceTag = document.createElement("div");
            const src = item?.img ? item.img : `/dat_picture/${item.type_}.jpg`
            priceTag.className = "price-tag";
            priceTag.innerHTML = `<img src='${src}'></img>`
            // priceTag.textContent = item.name_;
            const marker = { lat: parseFloat(item.lat_), lng: parseFloat(item.long_) };
            const markerElement = new AdvancedMarkerElement({
                position: marker,
                map: map,
                title: item.name_,
                content:  priceTag,
            });
            markerElement.addListener("click", async () => {
                console.log(item);
                plantState.value = "info";
                props.handleProject(item);
                props.handleClose();

                let sn = [0,]
                let res = await callApi("post", host.DATA + "/getLogger", {
                    plantid: item.plantid_,

                })
                // console.log(res)
                if (res.status) {
                    // setDevice(res.data)
                    listDevice.value = res.data
                    res.data.map((data, index) => {
                        sn.push(data.sn_)
                    })
                }

                // plantobjauto.value = newPlant;
                // setplantobjauto(newPlant);
                overviewDispatch({
                    type: "LOAD_DEVICE",
                    payload: {
                        id: item.plantid_,
                        visual: item.data_.data,
                        setting: item.setting_,
                        company: item.company_,
                        name: item.name_,
                    },
                });
                overviewDispatch({
                    type: "SET_LASTID",
                    payload: item.data_.id,
                })


                overviewDispatch({
                    type: "SET_ID",
                    payload: sn,
                })


                // console.log(overview_visual);
                



                // setPlant(item);
                // projectData.value = item;
                // sidebartab.value = "Monitor";
                // sidebartabli.value = "/Project";
            });
            return markerElement;

        });
    };

    useEffect(() => {
        console.log(props.plant);
        initMap(props.plant);
    }, [props.plant]);

    return (
        <>
            {isBrowser
                ? <div className='DAT_MapContainer' >
                    <div className='DAT_MapContainer_title' >
                        <div className="DAT_MapContainer_title_name">{dataLang.formatMessage({ id: "map" })}</div>

                        <div className="DAT_MapContainer_title_close"
                            onClick={() => { props.handleClose(); }}
                            id="Popup-2"
                            onMouseEnter={(e) => handlePopup("new")}
                            onMouseLeave={(e) => handlePopup("pre")}
                        >
                            <IoClose size={25} color='white' />
                        </div>

                    </div>
                    <div className='DAT_MapContainer_map' id='map' >

                    </div>
                </div>
                : <div className='DAT_MapContainerMobile' style={{ height: isLandscape ? 'calc(100vh - 80px)' : 'calc(100vh - 170px)' }} >
                    <div className='DAT_MapContainerMobile_title' >
                        <div className="DAT_MapContainerMobile_title_name">{dataLang.formatMessage({ id: "map" })}</div>

                        <div className="DAT_MapContainerMobile_title_close"
                            onClick={() => { props.handleClose(); }}
                            id="Popup-2"
                            onMouseEnter={(e) => handlePopup("new")}
                            onMouseLeave={(e) => handlePopup("pre")}
                        >
                            <IoClose size={25} color='white' />
                        </div>

                    </div>
                    <div className='DAT_MapContainerMobile_map' id='map' >

                    </div>
                </div>
            }



        </>
    );
}

export default Map;