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
    BarElement
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
    Filler,
    BarElement
  );
  
function VolumeVsOIPut({timeSeries, putBuySeries, putSellSeries, putOiSeries, putVolumeSeries}) {
   
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Volume vs OI - PUT',
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
            label: 'Put Volume',
            fill: true,
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
            yAxisID: 'volume',
            data: [...putVolumeSeries],
          },
          // {
          //   label: 'Put OI',
          //   fill: false,
          //   lineTension: 0.1,
          //   backgroundColor: 'rgba(200,150,200,0.4)',
          //   borderColor: 'rgba(200,150,200,1)',
          //   borderCapStyle: 'butt',
          //   borderDash: [],
          //   borderDashOffset: 0.0,
          //   borderJoinStyle: 'miter',
          //   pointBorderColor: 'rgba(200,150,200,1)',
          //   pointBackgroundColor: '#fff',
          //   pointBorderWidth: 1,
          //   pointHoverRadius: 5,
          //   pointHoverBackgroundColor: 'rgba(200,150,200,1)',
          //   pointHoverBorderColor: 'rgba(220,155,220,1)',
          //   pointHoverBorderWidth: 2,
          //   pointRadius: 1,
          //   pointHitRadius: 10,
          //   yAxisID: 'lines',
          //   data: [...putOiSeries]
          // },
          {
            label: 'Buy',
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
            data: [...putBuySeries]
          },
          {
            label: 'Sell',
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
            data: [...putSellSeries]
          }
        ]
      };
  
    return (<>
    <Line data={chartData} options={options}/>
    </>)
}

export default VolumeVsOIPut
