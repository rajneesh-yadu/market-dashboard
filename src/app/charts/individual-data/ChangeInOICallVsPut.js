import React from 'react'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
  
function VolumeVsOIPut(props) {
    const {data:{data = [], updatedAt=null, date=null, noNewData=false }} = props

    const putData = data.filter(item => item.type === 'put')
    const callData = data.filter(item => item.type === 'call')
    
    // const totalPutOI = putData.filter(item => item.time === updatedAt).reduce((total, current) => (total + current.openInterest), 1)
    // const totalCallOI = callData.filter(item => item.time === updatedAt).reduce((total, current) => (total + current.openInterest), 1)
    // const currentPCR = Math.round(100 * totalPutOI / totalCallOI)
    
    let timeSeries = []
    data.filter(item => item.type === 'put').map((item) => {
        if(!timeSeries.includes(item.time)) timeSeries.push(item.time)
    })

    let putChangeinOISeries = []
    let callChangeinOISeries = []
    for(let time of timeSeries){
        let putChangeinOI = putData.filter(item => item.time === time && item.strikePrice === 44800).reduce((total, current) => (current.changeinOpenInterest), 0)
        let callChangeinOI = callData.filter(item => item.time === time && item.strikePrice === 44800).reduce((total, current) => (current.changeinOpenInterest), 0)
        // let indexPrice = callData.filter(item => item.time === time).reduce((total, current) => (current.underlyingValue), 0)
        // chartData.push({time, putOI, callOI, PCR: putOI/callOI, indexPrice })
        putChangeinOISeries.push(putChangeinOI)
        callChangeinOISeries.push(callChangeinOI)
        // indexPriceSeries.push(indexPrice)
    }

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Call vs Put - Change in OI',
          },
        }
      };

    const changeinOIData = {
        labels: [...timeSeries],
        datasets: [
          {
            label: 'Put COI',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,225,0.4)',
            borderColor: 'rgba(75,192,225,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,225,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,225,1)',
            pointHoverBorderColor: 'rgba(220,155,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            yAxisID: 'price',
            data: [...putChangeinOISeries],
          },
          {
            label: 'Call COI',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(200,75,75,0.4)',
            borderColor: 'rgba(200,75,75,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(200,75,75,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(200,75,75,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            yAxisID: 'price',
            data: [...callChangeinOISeries],
          }
        ]
      };
  
    return (<>
    <Line data={changeinOIData} options={options}/>
    </>)
}

export default VolumeVsOIPut
