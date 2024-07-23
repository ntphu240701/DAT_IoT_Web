/* eslint no-unused-vars: "off"*/
import React, { useEffect, useReducer, useRef, useState } from "react"
import "./Tool.scss";

import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

import zoomPlugin from "chartjs-plugin-zoom";
import axios from "axios";
import { host } from "../Lang/Contant";
import { _tab } from "./Toollist";
import { callApi } from "../Api/Api";

Chart.register(zoomPlugin);


export default function LineChart(props) {
  const [data, setData] = useState(props.data)
  const [setting, setSetting] = useState(props.setting)
  const [label, setlabel] = useState([])
  const [dtset, setDtset] = useState([])
  const [dataset, setDataset] = useState(() => {
    let x = []
    setting.dataset.map((data, index) => {
      x[index] = {
        label: data.label,
        fill: (data.fill === 'true') ? true : false,
        lineTension: 0.5,
        backgroundColor: data.backgroundColor,
        borderColor: data.borderColor,
        pointRadius: 0,
        borderWidth: 1.5,
        data: []
      }
    })

    return x
  })
  const counterRef = useRef([]);
  const intervalIDRef = useReducer(null);
  const zoomR = useRef(null);
  const [onzoom, setOnzoom] = useState(false)


  const datachart = {
    labels: label,
    datasets: dataset,
  };



  const config = {
    type: 'line',
    maintainAspectRatio: false,

    // scales: {

    //   x: {
    //     title: {
    //       display: true,
    //       text: setting.xlb
    //     },

    //   },
    //   y: {
    //     title: {
    //       display: true,
    //       text: setting.ylb
    //     }
    //   }
    // },

    plugins: {
      zoom: {
        // limits: {
        //   y: { min: -10, max: 500 },
        //   y2: { min: -1, max: 1 },
        // },
        limits: {
          x: { min: 'original', max: 'original' },
          y: { min: 'original', max: 'original' },
        },
        pan: {
          enabled: onzoom,
          mode: 'xy',
          modifierKey: 'ctrl',


        },
        zoom: {

          wheel: {
            enabled: onzoom
          },
          pinch: {
            enabled: onzoom
          },
          drag: {
            enabled: onzoom,
          },
          mode: 'xy'

        }
      },

    },



  }




  // const datachart = {
  //   labels: label,
  //   datasets: [
  //     {
  //       label: setting.name,
  //       fill: (setting.fill === 'true') ? true : false,
  //       lineTension: 0.5,
  //       backgroundColor: 'rgba(75,192,192,0.4)',
  //       borderColor: 'rgba(75,192,192,1)',
  //       // borderCapStyle: 'butt',
  //       // borderDash: [],
  //       // borderDashOffset: 0.0,
  //       // borderJoinStyle: 'miter',
  //       // pointBorderColor: 'rgba(75,192,192,1)',
  //       // pointBackgroundColor: '#fff',
  //       // pointBorderWidth: 5,
  //       // pointHoverRadius: 5,
  //       // pointHoverBackgroundColor: 'rgba(75,192,192,1)',
  //       // pointHoverBorderColor: 'rgba(220,220,220,1)',
  //       // pointHoverBorderWidth: 2,
  //       //pointRadius: 1,
  //       // pointHitRadius: 10,
  //       data: dtset,

  //     }
  //   ],
  // };




  const handlegetnum = (numstring) => {
    try {
      var x = eval(numstring) || 0
      return parseFloat(x).toFixed(1);
    } catch (e) {
      return 0;
    }
  }

  // useEffect(function () {


  //   if (label.length === 500) {
  //     var newdata = [...dataset]
  //     var newlabel = [...label]
  //     newlabel.shift()
  //     setlabel(newlabel)
  //     newdata.map((data, index) => {
  //       data.data.shift()
  //       //console.log(data.data)
  //     })
  //     setDataset(newdata)
  //   }
  //   //console.log(label)
  // }, [dataset])

  // var startTimer = (zoom) => {
  //   intervalIDRef.current = setInterval(async () => {
  //     var time = new Date()
  //     var time_ = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()
  //     setlabel(old => [...old, time_])
  //     const newState = [...dataset]
  //     newState.map((data, index) => {
  //       data.data.push(counterRef.current[index])
  //     })
  //     setDataset(newState)
  //   }, parseInt(setting.step) * 1000);
  // }

  // useEffect(function () {
  //   startTimer();
  //   return () => {
  //     clearInterval(intervalIDRef.current);
  //     intervalIDRef.current = null;
  //   }
  // }, [setting])

  useEffect(function () {




    const getchart = async () => {
      let res = await callApi("post", host.DATA + "/getChart", {
        deviceid: props.sn,
        tab: props.tab,
        id: props.id
      })
      console.log(res)
      if (res.status) {

        const newState = [...dataset]
        newState.map((data, index) => {
          data.data = res.data.value[index].data
        })
        setDataset(newState)

        setlabel(res.data.time)

      } else {
        const newState = [...dataset]
        newState.map((data, index) => {
          data.data = []
        })
        setDataset(newState)
        setlabel([])
      }

    }

    getchart()

    return () => {
      const newState = [...dataset]
      newState.map((data, index) => {
        data.data = []
      })
      setDataset(newState)
      setlabel([])
    }

  }, [_tab.value])


  useEffect(function () {
    setData(props.data)
    //counterRef.current[index] = handlegetnum(setting.dataset[index].cal)
    setDtset(props.data)
    dataset.map((data, index) => {
      counterRef.current[index] = handlegetnum(setting.dataset[index]?.cal || 10)
    })

    //console.log(counterRef.current)

  }, [props.data])

  useEffect(function () {
    setSetting(props.setting)
  }, [props.setting])


  const handleTabreset = () => {
    // if(zoomR.current){
    zoomR.current.resetZoom('reset');
    // }

  }

  const handleTabzoom = () => {
    // if(zoomR.current){
    setOnzoom(true)

    // }

  }


  const handleTabclose = () => {
    // if(zoomR.current){
    zoomR.current.resetZoom('reset');
    setOnzoom(false)
    // }

  }




  return (
    <div className="DAT_LineChart" style={{ width: (props.width) + "px", height: (props.height) + "px", }} >


      {(onzoom)
        ? <>
          <button onClick={handleTabreset} style={{ position: "absolute", top: "10px", right: "60px" }}><ion-icon name="expand-outline"></ion-icon></button>
          <button onClick={handleTabclose} ><ion-icon name="close-outline"></ion-icon></button>
        </>
        : <button onClick={handleTabzoom}><ion-icon name="hand-right-outline"></ion-icon></button>
      }
      <div className="DAT_LineChart-y" style={{ top: "calc(50% - 10px" }}>{setting.ylb}</div>
      <div className="DAT_LineChart-g" style={{ width: (props.width - 70) + "px", height: (props.height - 70) + "px", }} >
        <Line data={datachart} options={config} ref={zoomR} />
        <div className="DAT_LineChart-g-x">{setting.xlb}</div>
      </div>




    </div>
  )
}