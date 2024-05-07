/* eslint no-eval: 0 */
/* eslint no-unused-vars: "off"*/
import React, { useEffect, useState } from "react"
import "./Tool.scss";



export default function Circle(props) {
    const [data, setData] = useState(props.data)
    const [setting, setSetting] = useState(props.setting)
    useEffect(function () {
        setData(props.data)
    }, [props.data])

    useEffect(function () {
        setSetting(props.setting)
    }, [props.setting])



    //Thao tác dành riêng cho circle
    const circleConfig = {
        cirWidth: '130',
        viewBox: '0 0 120 120',
        x: '60',
        y: '60',
        radius: '50',
        strwidth: '20px',
    }
    //...
    const dashArray = circleConfig.radius * Math.PI * 2;

    const handlegetnum = (numstring) => {
        try {
            var x = eval(numstring) || 0
            if(x <= 0){
                return 0
            }else if(x>setting.max){
                return setting.max
            }else{
                return parseFloat(x).toFixed(1)
            }
        } catch (e) {
            return 0;
        }
    }




    return (
 

            <div className="DAT_Circle" id={props.deviceid + "_" + props.tab + "_" + props.id + "_CIRCLE"} style={{position: "relative", zIndex: "0"}}>
                <div className="DAT_Circle_Main" >
                    <div className="DAT_Circle_Main-outer" style={{minWidth:(props.width-10)+"px", minHeight:(props.height-10)+"px"}}>
                        <div className="DAT_Circle_Main-inner">
                            <div className="DAT_Circle_Main-number" style={{fontSize:setting.size+"px", color:setting.color}}>{handlegetnum(setting.cal)}</div>
                        </div>
                        <svg className="DAT_Circle_Main-value" viewBox={circleConfig.viewBox} style={{minWidth:(props.width-10)+"px", minHeight:(props.height-10)+"px"}}>
                            <linearGradient id={"GradientColor_"+props.tab+props.id}>
                                <stop offset="0%" stopColor={setting.stopcolor} />
                                <stop offset="100%" stopColor={setting.startcolor} />
                                
                            </linearGradient>
                            <circle
                                cx={circleConfig.x}
                                cy={circleConfig.y}
                                r={circleConfig.radius}
                                strokeWidth={circleConfig.strwidth}
                                style={{
                                    strokeDasharray: dashArray,
                                    strokeDashoffset: (dashArray - (dashArray * handlegetnum(setting.cal)) / (setting.max)) || (dashArray - (dashArray * 0) / setting.max),
                                    fill: 'none',
                                    stroke: "url('#GradientColor_"+props.tab+props.id+"')",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                
                                }}
                                transform='rotate(-90 60 60)'
                            />
                        </svg>
                    </div>
                </div>
            </div>


        
    
    )
}