import React, {useEffect} from 'react'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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
    Legend
  );
  
function PCR(props) {
    const {data:{data = [], updatedAt=null, date=null, noNewData=false }, getLatestPCR} = props

    const putData = data.filter(item => item.type === 'put')
    const callData = data.filter(item => item.type === 'call')
    
    const totalPutOI = putData.filter(item => item.time === updatedAt).reduce((total, current) => (total + current.openInterest), 1)
    const totalCallOI = callData.filter(item => item.time === updatedAt).reduce((total, current) => (total + current.openInterest), 1)
    const currentPCR = Math.round(100 * totalPutOI / totalCallOI)
    useEffect(() => {
      getLatestPCR(currentPCR)
    },[currentPCR])
    
    let timeSeries = []
    data.filter(item => item.type === 'put').map((item) => {
        if(!timeSeries.includes(item.time)) timeSeries.push(item.time)
    })

    let pcrSeries = []
    let indexPriceSeries = []
    for(let time of timeSeries){
        let putOI = putData.filter(item => item.time === time).reduce((total, current) => (total + current.openInterest), 0)
        let callOI = callData.filter(item => item.time === time).reduce((total, current) => (total + current.openInterest), 0)
        let indexPrice = callData.filter(item => item.time === time).reduce((total, current) => (current.underlyingValue), 0)
        // chartData.push({time, putOI, callOI, PCR: putOI/callOI, indexPrice })
        pcrSeries.push(putOI/callOI)
        indexPriceSeries.push(indexPrice)
    }

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'PCR vs BANKNIFTY',
          },
        },
        scales: {
          pcr: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          index: {
            type: 'linear',
            display: true,
            position: 'right',
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
            label: 'PCR',
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
            data: [...pcrSeries],
            yAxisID: 'pcr',
          },
          {
            label: 'BANKNIFTY',
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
            yAxisID: 'index',
            data: [...indexPriceSeries]
          }
        ]
      };
  
    return (<>
    <Line data={chartData} options={options}/>
    </>)
}

export default PCR






    {/* <LineChart width={730} height={250} data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis yAxisId="PCR" />
        <YAxis yAxisId="IndexPrice" orientation="right"  tickCount={2}/>
        <Tooltip />
        <Legend />
        <Line yAxisId='PCR' type="monotone" dataKey="PCR" stroke="#ff0000" dot=''/>
        <Line yAxisId='IndexPrice' type="monotone" dataKey="indexPrice" stroke="#82ca9d" dot=''/>
    </LineChart> */}