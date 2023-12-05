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
    let callSellSeries = []
    let callBuySeries = []
    for(let time of timeSeries){
        let callOI = callData.filter(item => item.time === time).reduce((total, current) => (total + current.openInterest), 0)
        let callVolume = callData.filter(item => item.time === time).reduce((total, current) => (total + current.totalTradedVolume), 0)
        let callBuy = callData.filter(item => item.time === time).reduce((total, current) => (total + current.totalBuyQuantity), 0)
        let callSell = callData.filter(item => item.time === time).reduce((total, current) => (total + current.totalSellQuantity), 0)

        callOiSeries.push(callOI)
        callVolumeSeries.push(callVolume)
        callSellSeries.push(callSell)
        callBuySeries.push(callBuy)
    }

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Volume-OI-Quantity call',
          },
        },
        scales: {
          volume: {
            type: 'linear',
            display: true,
            position: 'right',
          },
          line: {
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
            yAxisID: 'volume',
            data: [...callVolumeSeries],
          },
          // {
          //   label: 'Call OI',
          //   fill: false,
          //   lineTension: 0.1,
          //   backgroundColor: 'rgba(200,75,200,0.4)',
          //   borderColor: 'rgba(200,75,200,1)',
          //   borderCapStyle: 'butt',
          //   borderDash: [],
          //   borderDashOffset: 0.0,
          //   borderJoinStyle: 'miter',
          //   pointBorderColor: 'rgba(200,75,200,1)',
          //   pointBackgroundColor: '#fff',
          //   pointBorderWidth: 1,
          //   pointHoverRadius: 5,
          //   pointHoverBackgroundColor: 'rgba(200,75,200,1)',
          //   pointHoverBorderColor: 'rgba(220,220,220,1)',
          //   pointHoverBorderWidth: 2,
          //   pointRadius: 1,
          //   pointHitRadius: 10,
          //   yAxisID: 'lines',
          //   data: [...callOiSeries]
          // },
          {
            label: 'Buy',
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
            yAxisID: 'line',
            data: [...callBuySeries]
          },
          {
            label: 'Sell',
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
            yAxisID: 'line',
            data: [...callSellSeries]
          }
        ]
      };
  
    return (<>
    <Line data={chartData} options={options}/>
    </>)
}

export default VolumeVsOIPut
