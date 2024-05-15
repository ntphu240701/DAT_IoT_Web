import React, { useEffect, useState } from "react";
import "./Tool.scss";
import ReactSpeedometer from "react-d3-speedometer";

export default function Gauge(props) {
    const [data, setData] = useState(props.data)
    const [setting, setSetting] = useState(props.setting)
    useEffect(function () {
        setData(props.data)
    }, [props.data])

    useEffect(function () {
        setSetting(props.setting)
    }, [props.setting])

    var handlegetnum = (numstring) => {
        try {
           
            var x = eval(numstring) || 0
            if(x <= setting.min){
                return setting.min
            }else if(x>=setting.max){
                return setting.max
            }else{
                return parseFloat(x).toFixed(1)
            }


            //return parseFloat(x).toFixed(1);
        } catch (e) {
            return 0;
        }
    }
  
  return (
    <>
      

          <div className="DAT_Gauge" style={{width:props.width+"px",height: props.height+"px", position: "relative", zIndex: setting?.zindex }}>
           
              <ReactSpeedometer
                value={parseFloat(handlegetnum(setting?.cal))}
                currentValueText={String(setting?.label +" "+ handlegetnum(setting?.cal) + " " + setting?.unit) || "0"}
                valueTextFontSize={String(parseInt(setting?.valuesize)) || "20"}
                textColor={setting?.valuecolor || "#000000"}
                minValue={parseInt(setting?.min) || 0}
                maxValue={parseInt(setting?.max) || 100}
                width={parseInt(props.width) || 120}
                height={parseInt(props.height) || 120}
                startColor={setting?.startcolor || "#000000"}
                endColor={setting?.endcolor || "#000000"}
                segments={parseInt(setting?.segment) || 10}
                needleColor={setting?.needlecolor || "#000000"}
                needleTransition="easeCubicIn"
                needleTransitionDuration={1000}
              />           
          </div>
  
 
    </>
  );
}
