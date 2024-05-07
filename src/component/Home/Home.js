import React, { useContext, useEffect, useReducer, useState } from "react";
import "./Home.scss";
// import {useIntl} from 'react-intl';
// import { AlertContext } from "../Context/AlertContext";
// import { AuthContext, EnvContext } from "../Context/EnvContext";

import { Link, useNavigate } from 'react-router-dom';
//import Card from 'react-bootstrap/Card';
// import { SettingContext } from "../Context/SettingContext";
import { effect, signal } from "@preact/signals-react";
import { pageDefault } from "../../App";
import { useSelector } from "react-redux";
import { useRef } from "react";
// import MenuTop from "../MenuTop/MenuTop";



const x = signal(66);
const s = signal(7);
const movestart = signal(0);


export default function Home(props) {
        // const { settingDispatch } = useContext(SettingContext)
        const type = useSelector((state) => state.admin.type)
        // const user = useSelector((state) => state.admin.user)
        const navigate = useNavigate()
        const boxRef = useRef(null);
        let [isDragging, setIsDragging] = useState(false);
        const [startX, setStartX] = useState(0);
        const nevigate = useNavigate();

        const which = {
                AUTO: 'Auto',
                SOL: 'Solar',
                ELEV: 'Elev',
                UPS: 'UPS',

        }


        const startDragging = (e, type) => {
                setIsDragging(true);
                movestart.value = new Date().getTime();
                (type === 'mouse') ? setStartX(e.clientX - boxRef.current.offsetLeft) : setStartX(e.changedTouches[0].clientX - boxRef.current.offsetLeft);
        };

        const dragging = (e, type) => {
            
                if (!isDragging) return;
                const x_ = type === 'mouse' ?  e.clientX - boxRef.current.offsetLeft : e.changedTouches[0].clientX - boxRef.current.offsetLeft;
                const scrollLeft = x_ - startX;
                if (scrollLeft > 0) {
                        if (x.value < 150) {
                                x.value += 42
                                setIsDragging(false);    
                        }
                }
                if (scrollLeft < 0) {
                        if (x.value > 24) {
                                x.value -= 42
                                setIsDragging(false);            
                        }
                }
                s.value = parseInt((360 - x.value) / 42);
                // console.log(x.value, s.value)


        };

        const stopDragging = () => {
                
                setIsDragging(false);
        };

        const handlePage = (page) => {
                // console.log(new Date().getTime() - movestart.value)
                console.log(new Date().getTime() - movestart.value)
                if((new Date().getTime() - movestart.value) < 120) {
                        // console.log(page)
                        movestart.value = 0
                        nevigate('/' + page)
                }
               
        }



        useEffect(() => {
                let box = document.querySelector('.DAT_viewIOT-3D')
                box.style.transform = `perspective(1000px) rotateY(${x.value}deg)`;
                return (() => {
                        // settingDispatch({ type: "RESET", payload: [] })

                })
        }, [x.value])

        // useEffect(() => {
        //         if (type === 'user') {
        //                 console.log(pageDefault.value)
        //                 if (pageDefault.value.status) {
        //                         navigate('/' + which[pageDefault.value.code])
        //                 }
        //         }
        // }, [pageDefault.value])

        // const handeAction = (e) => {

        //         if (e.currentTarget.id === 'pre') {
        //                 x.value += 42;
        //         }

        //         if (e.currentTarget.id === 'next') {
        //                 x.value -= 42;
        //         }

        //         s.value = parseInt((360 - x.value) / 42);
        // }



        return (
                <>
                        {/* <MenuTop user={user} /> */}
                        <div className="DAT_viewIOT">
                             
                                {/* <div className="DAT_viewIOT-Arrow" style={{ visibility: (s.value !== 5) ? "visible" : "hidden", }} id="pre" onClick={(e) => { handeAction(e) }}><ion-icon name="chevron-back-outline"></ion-icon></div> */}
                                <div></div>
                                <div className="DAT_viewIOT-3D"
                                        ref={boxRef}
                                        onMouseDown={(e) => startDragging(e,'mouse')}
                                        onMouseMove={(e) => dragging(e,'mouse')}
                                        onMouseUp={stopDragging}
                                        onMouseLeave={stopDragging}

                                        onTouchStart={(e) => startDragging(e,'touch')}
                                        onTouchMove={(e)=>dragging(e,'touch')}
                                        onTouchEnd={stopDragging}

                                        // onPointerDown={(e) => startDragging(e,'mouse')}
                                        // onPointerMove={(e) => dragging(e,'mouse')}
                                        // onPointerUp={stopDragging}

                                >
                                        <span style={{ "--i": 1 }} className="DAT_viewIOT-3D-Item" id="move">
                                                {/* <Link to={(s.value === 1) ? "/UPS" : "/"} style={{ textDecoration: 'none' }}>
                                                        <img alt="" src="dat_icon/ups.png" ></img>
                                                        <label style={{ color: (s.value === 1) ? "white" : "gray", transition: "1s" }} >UPS</label>
                                                </Link> */}
                                        </span>
                                        <span style={{ "--i": 2 }} className="DAT_viewIOT-3D-Item">
                                                {/* <Link to={(s.value === 2)?"/Solar": "/" } style={{ textDecoration: 'none' }}>
                                                                <img alt="" src="dat_icon/solar.png"></img>
                                                                <label style={{ color: (s.value === 2)?"white": "gray", transition: "1s" }}>Solar</label>
                                                        </Link> */}
                                        </span>
                                        <span style={{ "--i": 3 }} className="DAT_viewIOT-3D-Item">
                                                {/* < Link to={(s.value === 3)?"/Elev": "/" } style={{ textDecoration: 'none' }}>
                                                                <img alt="" src="dat_icon/elev.png"></img>
                                                                <label style={{ color: (s.value === 3)?"white": "gray", transition: "1s" }} >Elevator</label>
                                                        </Link> */}
                                        </span>
                                        <span style={{ "--i": 4 }} className="DAT_viewIOT-3D-Item">
                                                {/* <Link to={(s.value === 4)?"/Auto": "/" } style={{ textDecoration: 'none' }}>
                                                                <img alt="" src="dat_icon/auto.png"></img>
                                                                <label style={{ color: (s.value === 4)?"white": "gray", transition: "1s" }}>Automation</label>
                                                        </Link> */}
                                        </span>


                                        <span style={{ "--i": 5 }} className="DAT_viewIOT-3D-Item">
                                                        {/* <img alt="" draggable="false" onMouseUp={()=> handlePage('UPS') } src="dat_icon/ups.png"></img>
                                                        <label style={{ color: (s.value === 5) ? "white" : "gray", transition: "1s" }}>UPS</label> */}
                                        </span>
                                        <span style={{ "--i": 6 }} className="DAT_viewIOT-3D-Item">
                                                        <img alt="" draggable="false" onPointerUp={()=> handlePage('SOLAR')} src="dat_icon/solar.png"></img>
                                                        <label style={{ color: (s.value === 6) ? "white" : "gray", transition: "1s" }}>Solar</label>
                                        </span>
                                        <span style={{ "--i": 7 }} className="DAT_viewIOT-3D-Item">
                                                        <img alt="" draggable="false" onPointerUp={()=> handlePage('AUTO') } src="dat_icon/auto.png"></img>
                                                        <label style={{ color: (s.value === 7) ? "white" : "gray", transition: "1s" }}>Automation</label>
                                        </span>
                                        <span style={{ "--i": 8 }} className="DAT_viewIOT-3D-Item">
                                                        <img alt="" draggable="false" onPointerUp={()=> handlePage('ELEV') } src="dat_icon/elev.png"></img>
                                                        <label style={{ color: (s.value === 8) ? "white" : "gray", transition: "1s" }}>Elevator</label>
                                        </span>

                                </div>
                                <div></div>
                                {/* <div className="DAT_viewIOT-Arrow" style={{ visibility: (s.value !== 8) ? "visible" : "hidden" }} id="next" onClick={(e) => { handeAction(e) }}><ion-icon name="chevron-forward-outline"></ion-icon></div> */}
       
                        </div >

                </>
        );

}

