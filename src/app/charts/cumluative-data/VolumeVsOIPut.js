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
  
function VolumeVsOIPut({putOiSeries, putVolumeSeries, timeSeries}) {

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
          putVolume: {
            type: 'linear',
            display: true,
            position: 'right',
          },
          putOI: {
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
            yAxisID: 'putVolume',
            data: [...putVolumeSeries],
          },
          {
            label: 'Put OI',
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
            yAxisID: 'putOI',
            data: [...putOiSeries]
          }
        ]
      };
  
    return (<>
    <Line data={chartData} options={options}/>
    </>)
}

export default VolumeVsOIPut
