'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'

import PCR from './cumluative-data/PCR'
import OIputVsCall from './cumluative-data/OIputVsCall'
import VolumeVsOIPut from './cumluative-data/VolumeVsOIPut'
import VolumeVsOICall from './cumluative-data/VolumeVsOICall'
import VolumeVsVolume from './cumluative-data/VolumeVsVolume'
import VolumeOiQuantityCall from './cumluative-data/VolumeOiQuantityCall'
import VolumeOiQuantityPut from './cumluative-data/VolumeOiQuantityPut'
import LtpCallVsPut from './individual-data/LtpCallVsPut'
import ChangeInOICallVsPut from './individual-data/ChangeInOICallVsPut'


export default function RootChart() {
  // const [data, setData] = useState('')
  const [pcr, setPCR] = useState([])
  const [switchToTrendingPage, setSwitchToTrendingPage] = useState(false)

  const { isLoading, error, data } = useQuery('optionChain', () =>
  fetch('./api').then(res =>
    res.json()
  )
)

if (isLoading) return 'Loading...'

if (error) return 'An error has occurred: ' + error.message


 const getOptionData = async () => {
   let data = await fetch('./api');
   data = await data.json()
   console.log(data)
   return data?.data ? setData(data) : ''
 }

 const getLatestPCR = (currentPCR) => setPCR(currentPCR)

// useEffect(() => {
//     function getAlerts() {
//       fetch('./api')
//         .then(result => result.json())
//         .then(result => setData(result))
//         .then((result) => console.log('fetch alerts', result))
//     }
//     getAlerts()
//     const interval = setInterval(() => getAlerts(), 10000)
//     return () => {
//       clearInterval(interval);
//     }
// }, [])

// console.log('render alerts', data);

  return (
      <main className='min-h-screen'>
        <div className='h-16 bg-orange-400 flex gap-2 justify-end'>
        <button onClick={() => setSwitchToTrendingPage(!switchToTrendingPage) }>Trending</button>
            {/* <p>BN - {data ? data?.data[data?.data?.length - 1]?.underlyingValue : ''}</p>
            <p>Strike Price - {data ? data?.data[data?.data?.length - 1]?.atmStrikePrice: ''}</p>
            <p>PCR - {pcr}</p>
            <p>Updated - {data?.updatedAt}</p>
            <button onClick={getOptionData}>Refresh Data</button> */}
        </div>
        <div className='h-1/2 w-6/12 flex gap-2 '>
          <PCR data={data} getLatestPCR={getLatestPCR}/>
          <VolumeVsVolume data={data}/>
        </div>
        <div className='h-1/2 w-6/12 flex gap-2 '>
          <VolumeVsOIPut data={data}/>
          <VolumeVsOICall data={data}/>
        </div>
        <div className='h-1/2 w-6/12 flex gap-2 '>
          <VolumeOiQuantityPut data={data}/>
          <VolumeOiQuantityCall data={data}/>
        </div>
        <div className='h-1/2 w-6/12 flex gap-2'>
          <LtpCallVsPut data={data} pcr={pcr}/>
          <ChangeInOICallVsPut data={data} pcr={pcr}/>
        </div>
      </main>
  )
}
