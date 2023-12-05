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
  
function VolumeVsOICall(props) {
    const {data:{data = [], updatedAt=null, date=null, noNewData=false }} = props

    // const putData = data.filter(item => item.type === 'put')
    const callData = data.filter(item => item.type === 'call')
    
    // const totalPutOI = putData.filter(item => item.time === updatedAt).reduce((total, current) => (total + current.openInterest), 1)
    // const totalCallOI = callData.filter(item => item.time === updatedAt).reduce((total, current) => (total + current.openInterest), 1)
    // const currentPCR = Math.round(100 * totalPutOI / totalCallOI)
    
    let timeSeries = []
    data.filter(item => item.type === 'put').map((item) => {
        if(!timeSeries.includes(item.time)) timeSeries.push(item.time)
    })

    let callOiSeries = []
    let callVolumeSeries = []
    // let indexPriceSeries = []
    for(let time of timeSeries){
        // let putOI = putData.filter(item => item.time === time).reduce((total, current) => (total + current.openInterest), 0)
        let callOI = callData.filter(item => item.time === time).reduce((total, current) => (total + current.openInterest), 0)
        // let putVolume = putData.filter(item => item.time === time).reduce((total, current) => (total + current.totalTradedVolume), 0)
        let callVolume = callData.filter(item => item.time === time).reduce((total, current) => (total + current.totalTradedVolume), 0)
        // let indexPrice = callData.filter(item => item.time === time).reduce((total, current) => (current.underlyingValue), 0)
        // chartData.push({time, putOI, callOI, PCR: putOI/callOI, indexPrice })
        callOiSeries.push(callOI)
        // putOiSeries.push(putOI)
        callVolumeSeries.push(callVolume)
        // putVolumeSeries.push(putVolume)
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
            text: 'Volume vs OI - CALL',
          },
        },
        scales: {
          callVolume: {
            type: 'linear',
            display: true,
            position: 'right',
          },
          callOI: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      };
    
    const chartData = {
        labels: [...timeSeries],
        datasets: [
          {
            label: 'Call OI',
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
            yAxisID: 'callOI',
            data: [...callOiSeries],
          },
          {
            label: 'Call Volume',
            fill: true,
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
            yAxisID: 'callVolume',
            data: [...callVolumeSeries]
          }
        ]
      };
  
    return (<>
    <Line data={chartData} options={options}/>
    </>)
}

export default VolumeVsOICall
