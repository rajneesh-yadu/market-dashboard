'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import PCR from './charts/cumluative-data/PCR'
import OIputVsCall from './charts/cumluative-data/OIputVsCall'
import VolumeVsOIPut from './charts/cumluative-data/VolumeVsOIPut'
import VolumeVsOICall from './charts/cumluative-data/VolumeVsOICall'
import VolumeVsVolume from './charts/cumluative-data/VolumeVsVolume'
import VolumeOiQuantityCall from './charts/cumluative-data/VolumeOiQuantityCall'
import VolumeOiQuantityPut from './charts/cumluative-data/VolumeOiQuantityPut'
import TrendingOi from './charts/individual-data/TrendingOi'
import TrendingIV from './charts/individual-data/IV'

import LtpCallVsPut from './charts/individual-data/LtpCallVsPut'
import ChangeInOICallVsPut from './charts/individual-data/ChangeInOICallVsPut'
import RootChart from './charts/RootChart'

export default function Home() {
  const [data, setData] = useState([])
  const [switchToTrendingPage, setSwitchToTrendingPage] = useState(false)

  let timeSeries = []
  let pcrSeries = []
  let underlyingValueSeries = []
  let callOiSeries = []
  let putOiSeries = []
  let callBuySeries = []
  let callSellSeries = []
  let putBuySeries = []
  let putSellSeries = []
  let putVolumeSeries = []
  let callVolumeSeries = []

  const getOptionData = async () => {
    let data = await fetch('./api/historical')
    data = await data.json()
    console.log(data)
    // hkbj[; ]
    return data?.data ? setData(data) : ''
  }

  useEffect(() => {}, [data])

  if (data?.data) {
    const filteredArr = data.data //.splice(0,59)
    for (let item of filteredArr) {
      timeSeries = [...timeSeries, item.time]
      pcrSeries = [...pcrSeries, item.pcr]
      underlyingValueSeries = [...underlyingValueSeries, item.underlyingValue]
      callOiSeries = [...callOiSeries, item.callOI]
      putOiSeries = [...putOiSeries, item.putOI]
      callBuySeries = [...callBuySeries, item.callBuy]
      callSellSeries = [...callSellSeries, item.callSell]
      putBuySeries = [...putBuySeries, item.putBuy]
      putSellSeries = [...putSellSeries, item.putSell]
      putVolumeSeries = [...putVolumeSeries, item.putVolume]
      callVolumeSeries = [...callVolumeSeries, item.callVolume]
    }
  }

  useEffect(() => {
    function getAlerts() {
      fetch('./api')
        .then((result) => result.json())
        .then((result) => {
          if (typeof result === 'object') setData(result)
        })
        .then((result) => console.log('fetch alerts', data))
    }
    let interval
    const d = new Date()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const day = d.getDay()
    console.log('day', day)
    // if((day !== 6 || day !== 7) && (hours >= 9 && minutes >= 10) && (hours <= 15 && minutes <= 40)){
    getAlerts()
    // }
    interval = setInterval(() => getAlerts(), 60 * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <main>
      <div className='h-16 bg-orange-400 flex gap-2 justify-end'>
        <button onClick={() => setSwitchToTrendingPage(!switchToTrendingPage)}>
          Trending
        </button>
        {/* <p>BN - {data ? data?.data[data?.data?.length - 1]?.underlyingValue : ''}</p> */}
        {/* <p>ATM Strike - {data ? data?.data[data?.data?.length - 1]?.latestAtm: ''}</p> */}
        {/* <p>PCR - {data ? data?.data[data?.data?.length - 1]?.pcr : ''}</p> */}
        <p>Updated - {data?.updatedAt}</p>
        <button onClick={getOptionData}>Refresh Data</button>
      </div>
      <>
        {!switchToTrendingPage && (
          <>
            <div className='h-1/2 w-6/12 flex gap-2 '>
              <PCR
                data={data}
                pcrSeries={pcrSeries}
                underlyingValueSeries={underlyingValueSeries}
                timeSeries={timeSeries}
              />
              <VolumeVsVolume
                data={data}
                callOiSeries={callOiSeries}
                putOiSeries={putOiSeries}
                putVolumeSeries={putVolumeSeries}
                callVolumeSeries={callVolumeSeries}
                timeSeries={timeSeries}
              />
            </div>
            <div className='h-1/2 w-6/12 flex gap-2 '>
              <VolumeOiQuantityPut
                data={data}
                timeSeries={timeSeries}
                putVolumeSeries={putVolumeSeries}
                putOiSeries={putOiSeries}
                putBuySeries={putBuySeries}
                putSellSeries={putSellSeries}
              />
              <VolumeOiQuantityCall
                data={data}
                timeSeries={timeSeries}
                callVolumeSeries={callVolumeSeries}
                callOiSeries={callOiSeries}
                callBuySeries={callBuySeries}
                callSellSeries={callSellSeries}
              />
            </div>
          </>
        )}
        {switchToTrendingPage && (
          <>
            <div className='h-1/2 w-3/12 flex gap-2'>
              <TrendingOi
                data={data}
                timeSeries={timeSeries}
                strikePrice={48000}
              />
              <TrendingOi
                data={data}
                timeSeries={timeSeries}
                strikePrice={48100}
              />
              <TrendingOi
                data={data}
                timeSeries={timeSeries}
                strikePrice={47700}
              />
              <TrendingOi
                data={data}
                timeSeries={timeSeries}
                strikePrice={47800}
              />
              {/* <LtpCallVsPut data={data} pcr={pcr} timeSeries={timeSeries}/>
          <ChangeInOICallVsPut data={data} pcr={pcr} timeSeries={timeSeries}/> */}
            </div>
            <div className='h-1/2 w-6/12 flex gap-2'>
              <TrendingOi
                data={data}
                timeSeries={timeSeries}
                strikePrice={47400}
              />
              <TrendingOi
                data={data}
                timeSeries={timeSeries}
                strikePrice={47500}
              />
            </div>
            <div className='h-1/2 w-6/12 flex gap-2'>
              <TrendingIV
                data={data}
                timeSeries={timeSeries}
                strikePrice={47500}
              />
            </div>
          </>
        )}
      </>
    </main>
  )
}

// const [timeSeries, setTimeSeries] = useState([])
// const [pcrSeries, setPcrSeries] = useState([])
// const [underlyingValueSeries, setUnderlyingValueSeries] = useState([])
// const [callOiSeries, setCallOiSeries] = useState([])
// const [putOiSeries, setPutOiSeries] = useState([])
// const [callBuySeries, setCallBuySeries] = useState([])
// const [callSellSeries, setCallSellSeries] = useState([])
// const [putBuySeries, setPutBuySeries] = useState([])
// const [putSellSeries, setPutSellSeries] = useState([])
// const [putVolumeSeries, setPutVolumeSeries] = useState([])
// const [callVolumeSeries, setCallVolumeSeries] = useState([])

// import {
//   useQuery,
//   useMutation,
//   useQueryClient,
//   QueryClient,
//   QueryClientProvider,
// } from 'react-query'

// Create a client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       // ✅ globally default to 60 seconds
//       staleTime: 1000 * 10,
//     },
//   },
// })

// // Invalidate every query in the cache
// queryClient.invalidateQueries()

// export default function App() {
//   return (<QueryClientProvider client={queryClient}>
//   <Home />
// </QueryClientProvider>)
// }

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
