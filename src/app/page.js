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

import PCR from './charts/cumluative-data/PCR'
import OIputVsCall from './charts/cumluative-data/OIputVsCall'
import VolumeVsOIPut from './charts/cumluative-data/VolumeVsOIPut'
import VolumeVsOICall from './charts/cumluative-data/VolumeVsOICall'
import VolumeVsVolume from './charts/cumluative-data/VolumeVsVolume'
import VolumeOiQuantityCall from './charts/cumluative-data/VolumeOiQuantityCall'
import VolumeOiQuantityPut from './charts/cumluative-data/VolumeOiQuantityPut'
import LtpCallVsPut from './charts/individual-data/LtpCallVsPut'
import ChangeInOICallVsPut from './charts/individual-data/ChangeInOICallVsPut'
import RootChart from './charts/RootChart'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ globally default to 60 seconds
      staleTime: 1000 * 10,
    },
  },
})

// Invalidate every query in the cache
queryClient.invalidateQueries()

export default function App() {
  return (<QueryClientProvider client={queryClient}>
  <Home />
</QueryClientProvider>)
}


function Home() {
  const [data, setData] = useState('')
  const [pcr, setPCR] = useState([])
  const [switchToTrendingPage, setSwitchToTrendingPage] = useState(false)

  // let data, err
  // try {
  //   data = await queryClient.fetchQuery({  
  //     queryKey: ['optionChain'],
  //     queryFn: () => fetch('./api').then((res) => res.json()), 
  //     staleTime: 10000,
  //     refetchIntervalInBackground: 10000 })
  // } catch (error) {
  //   console.log(error)
  //   err = error
  // }

  // const {isLoading, error, data} = useQuery({
  //   queryKey: ['optionChain'],
  //   queryFn: () => fetch('./api').then((res) => res.json()),
  //   staleTime: 10000,
  //   refetchIntervalInBackground: 10000
  // })

  // console.log('optionData', data,isLoading, error)

  // if(error) return 'An error has occurred: ' + error.message
  // if (isLoading) return 'Loading...'

//  const getOptionData = async () => {
//    let data = await fetch('./api');
//    data = await data.json()
//    console.log(data)
//    return data?.data ? setData(data) : ''
//  }

 const getLatestPCR = (currentPCR) => setPCR(currentPCR)

useEffect(() => {
    function getAlerts() {
      fetch('./api')
        .then(result => result.json())
        .then(result => setData(result))
        .then((result) => console.log('fetch alerts', result))
    }
    getAlerts()
    let interval
    const d = new Date()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    // if(minutes == 21){
      interval = setInterval(() => getAlerts(), 60000)
    // }
    return () => {
      clearInterval(interval);
    }
}, [])

// console.log('render alerts', data);

  return (
    <main>
        <div className='h-16 bg-orange-400 flex gap-2 justify-end'>
        <button onClick={() => setSwitchToTrendingPage(!switchToTrendingPage) }>Trending</button>
            <p>BN - {data ? data?.data[data?.data?.length - 1]?.underlyingValue : ''}</p>
            <p>Strike Price - {data ? data?.data[data?.data?.length - 1]?.atmStrikePrice: ''}</p>
            <p>PCR - {pcr}</p>
            <p>Updated - {data?.updatedAt}</p>
            {/* <button onClick={getOptionData}>Refresh Data</button> */}
        </div>
        { !switchToTrendingPage ? 
        <>
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
        </> :
        <div className='h-1/2 w-6/12 flex gap-2'>
          <LtpCallVsPut data={data} pcr={pcr}/>
          <ChangeInOICallVsPut data={data} pcr={pcr}/>
        </div>}
        </main>
  )
}
