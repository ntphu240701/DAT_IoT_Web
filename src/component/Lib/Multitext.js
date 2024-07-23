import React, { useEffect, useState } from 'react';

function Multitext(props) {

    const [data, setData] = useState(props.data)
    const [setting, setSetting] = useState(props.setting)
    useEffect(function () {
        setData(props.data)
    }, [props.data])

    useEffect(function () {
        setSetting(props.setting)
    }, [props.setting])


    const hexToRgbA = (hex, opacity) => {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
        }
        throw new Error('Bad Hex');
    }

    return (
        <div className="DAT_Multitext" style={{ overflow: "hidden", height: props.height + "px", fontSize: setting?.size + "px" || "16px", color: setting?.color || "black", backgroundColor: hexToRgbA(setting?.bgcolor || "#FFFFFF", setting?.opacity || "1"), border: `solid  ${setting?.borderwidth || 1}px ${setting?.bordercolor || "black"}`, textAlign: "justify", borderRadius: setting?.radius + "px" || "10px" }}>
            {Object.keys(setting?.data).map((key, index) => (
                    <div key={key} style={{width: props.width-3 + "px", display: "flex", justifyContent: setting?.align || "left", fontSize: setting?.size + "px" || "16px" }} >{setting?.data[key].text}</div>
            ))}
        </div>
    );
}

export default Multitext;