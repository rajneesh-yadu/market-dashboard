import React, {useEffect, useState} from 'react'

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
  
function TrendingOi({timeSeries, data, strikePrice}) {

    // const putArr = data[data?.data?.length - 1]?.filteredOptionData?.putData
    // const sortedCoiArr = putArr?.map(item => item.pchangeinOpenInterest)?.sort((a,b) => a-b)
    // console.log('sortedCoiArr', sortedCoiArr, putArr,data)
    const [putIOI, setPutIOI] = useState([])
    const [callIOI, setCallIOI] = useState([])
  useEffect(() => {
    if(data?.data?.length > 0){
      // const putArr = data?.data[data?.data?.length - 1]?.filteredOptionData?.putData
      // const sortedCoiArr = putArr?.map(item => item.pchangeinOpenInterest)?.sort((a,b) => a-b)
      // console.log('sortedCoiArr', sortedCoiArr,'new', putArr,)
      const tempPutArr = []
      const tempCallArr = []
      for (let item of data.data){
        for (let i of item.filteredOptionData.putData){
          if(i.strikePrice === strikePrice){
            tempPutArr.push(i.openInterest)
          }
        }
        for (let i of item.filteredOptionData.callData){
          if(i.strikePrice === strikePrice){
            tempCallArr.push(i.openInterest)
          }
        }
      }
      setPutIOI([...tempPutArr])
      setCallIOI([...tempCallArr])
    }
  },[data])

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Individual OI put',
          },
        },
        scales: {
          // volume: {
          //   type: 'linear',
          //   display: true,
          //   position: 'right',
          // },
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
            label: `PUT OI ${strikePrice}`,
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
            data: [...putIOI],
          },
          {
            label: `CALL OI ${strikePrice}`,
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,75,75,0.4)',
            borderColor: 'rgba(75,75,75,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,75,75,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,75,75,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            yAxisID: 'line',
            data: [...callIOI]
          },
          // {
          //   label: 'Buy',
          //   fill: false,
          //   lineTension: 0.1,
          //   backgroundColor: 'rgba(200,75,75,0.4)',
          //   borderColor: 'rgba(200,75,75,1)',
          //   borderCapStyle: 'butt',
          //   borderDash: [],
          //   borderDashOffset: 0.0,
          //   borderJoinStyle: 'miter',
          //   pointBorderColor: 'rgba(200,75,75,1)',
          //   pointBackgroundColor: '#fff',
          //   pointBorderWidth: 1,
          //   pointHoverRadius: 5,
          //   pointHoverBackgroundColor: 'rgba(200,75,75,1)',
          //   pointHoverBorderColor: 'rgba(220,220,220,1)',
          //   pointHoverBorderWidth: 2,
          //   pointRadius: 1,
          //   pointHitRadius: 10,
          //   yAxisID: 'line',
          //   data: [...callBuySeries]
          // },
          // {
          //   label: 'Sell',
          //   fill: false,
          //   lineTension: 0.1,
          //   backgroundColor: 'rgba(75,192,225,0.4)',
          //   borderColor: 'rgba(75,192,225,1)',
          //   borderCapStyle: 'butt',
          //   borderDash: [],
          //   borderDashOffset: 0.0,
          //   borderJoinStyle: 'miter',
          //   pointBorderColor: 'rgba(75,192,225,1)',
          //   pointBackgroundColor: '#fff',
          //   pointBorderWidth: 1,
          //   pointHoverRadius: 5,
          //   pointHoverBackgroundColor: 'rgba(75,192,225,1)',
          //   pointHoverBorderColor: 'rgba(220,155,220,1)',
          //   pointHoverBorderWidth: 2,
          //   pointRadius: 1,
          //   pointHitRadius: 10,
          //   yAxisID: 'line',
          //   data: [...callSellSeries]
          // }
        ]
      };
  
    return (<>
    <Line data={chartData} options={options}/>
    </>)
}

export default TrendingOi
