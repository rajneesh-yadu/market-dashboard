import clientPromise from '../../lib/mongodb'
// import { testData } from "../../../Fri-Dec-01-2023-BANKNIFTY"

export async function GET(request) {
  // const { searchParams } = new URL(request.url)
  let nseData, optionData, todayData, timeStamp, db
  let isNseDataHasError = false
  let isDbConnectionError = false

  try {
    //* fetch option data from nse website*/
    nseData = await fetch(
      'https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY',
      { next: { revalidate: 45 } }
      )
    optionData = await nseData.json()
    timeStamp = optionData.records.timestamp.substr(-8, 8)
    console.log('-----------timeStamp', timeStamp)
  } catch (error) {
    console.log('----------error', error.message)
    isNseDataHasError = true
  }

  try {
    //*connect to mongo database*/
    const client = await clientPromise
    db = client.db('optionChainData')

    //* use it to insert data from docs
    // const insertData = await db.collection("option_chain_data").insertOne({data:testData, date:"Fri Dec 01 2023",updatedAt:"15:30:00" });
    // console.log('data inserted', insertData)
    
    //* fetch today's data from mongo collection */
    todayData = await db
    .collection('option_chain_data')
    .find({ date: new Date().toDateString() })
    .toArray()
    // todayData = await db.collection("option_chain_data").find({date:'Fri Dec 01 2023'}).toArray();
    console.log('-----------db connected')
  } catch (error) {
    console.log('-----------db connection issue', error.message)
    isDbConnectionError = true
  }

  //* if no existing data then create new reocrd or update the existing data*/
  if (!isNseDataHasError && !isDbConnectionError && (todayData[0] === undefined || todayData[0]?.updatedAt === "15:30:00" || (todayData[0]?.updatedAt < timeStamp && todayData[0]?.updatedAt <= "15:30:00" ))) {
    let currentPrice = optionData.records.underlyingValue
    let strikePriceInterval = 100

    let existingData = todayData[0] ? todayData[0].data : []
    let latestAtm =
      Math.round(currentPrice / strikePriceInterval) * strikePriceInterval
    let callSell = 0
    let callBuy = 0
    let putSell = 0
    let putBuy = 0
    let expiryDate, underlyingValue, underlying
    let filteredOptionData = {
      putData: [],
      callData: [],
    }
    for (let i = 0; i < optionData.filtered.data.length; i++) {
      try {
        const {
          expiryDate: ed,
          underlying: u,
          underlyingValue: uv,
          ...restPeData
        } = optionData.filtered.data[i].PE
        const {
          expiryDate: expiryDateCe,
          underlying: underlyingCe,
          underlyingValue: underlyingValueCe,
          ...restCeData
        } = optionData.filtered.data[i].CE
  
        putSell += optionData.filtered.data[i].PE.totalSellQuantity
        putBuy += optionData.filtered.data[i].PE.totalBuyQuantity
  
        callSell += optionData.filtered.data[i].CE.totalSellQuantity
        callBuy += optionData.filtered.data[i].CE.totalBuyQuantity
  
        filteredOptionData.putData.push(restPeData)
        filteredOptionData.callData.push(restCeData)
        expiryDate = ed
        underlying = u
        underlyingValue = uv
      } catch (error) {
        console.log('-------error in loop', `iteration-${i}`, error.message)
      }

    }

    const formattedData = {
      filteredOptionData,
      callOI: optionData.filtered.CE.totOI,
      callVolume: optionData.filtered.CE.totVol,
      pcr: optionData.filtered.PE.totOI / optionData.filtered.CE.totOI,
      putOI: optionData.filtered.PE.totOI,
      putVolume: optionData.filtered.PE.totVol,
      putBuy,
      callSell,
      callBuy,
      putSell,
      latestAtm,
      underlyingValue,
      time: timeStamp,
    }

    const finalData = {
      date: new Date().toDateString(),
      expiryDate,
      underlying,
      updatedAt: timeStamp,
      data: [...existingData, formattedData],
    }

    // insert to mongo db collection
    try {
      let uploadedOptionData = todayData[0]
        ? await db.collection('option_chain_data').updateOne(
            { date: new Date().toDateString() },
            {
              $set: { updatedAt: timeStamp },
              $push: { data: formattedData },
            }
          )
        : await db.collection('option_chain_data').insertOne(finalData)
      console.log('------------db updated------------------')
      return Response.json(
        uploadedOptionData.acknowledged ? finalData : todayData[0]
      )
    } catch (error) {
      console.log(
        '------------error',
        typeof error,
        '--',
        error.name,
        '--',
        error.message
      )
      if (error.message.includes('Size must be between 0 and 16793600(16MB)')) {
        console.log('got message')
        let existingData1 = todayData[1] ? todayData[1].data : []
        const finalData1 = {
          date: new Date().toDateString(),
          expiryDate,
          underlying,
          updatedAt: timeStamp,
          data: [...existingData1, formattedData],
        }
        if (todayData[1]) {
          if (todayData[1].updatedAt !== timeStamp) {
            let uploadedOptionData = await db
              .collection('option_chain_data')
              .updateOne(
                { _id: todayData[1]._id },
                {
                  $set: { updatedAt: timeStamp },
                  $push: { data: formattedData },
                }
              )
            const finalAggregatedData = {
              date: new Date().toDateString(),
              expiryDate,
              underlying,
              updatedAt: timeStamp,
              data: [...existingData, ...existingData1, formattedData],
            }
            return Response.json(
              uploadedOptionData.acknowledged
                ? finalAggregatedData
                : todayData[0]
            )
          } else {
            const finalAggregatedData = {
              date: new Date().toDateString(),
              expiryDate,
              underlying,
              updatedAt: timeStamp,
              data: [...existingData, ...existingData1],
            }
            return Response.json(
              uploadedOptionData.acknowledged
                ? finalAggregatedData
                : todayData[0]
            )
          }
        } else {
          let uploadedOptionData = await db
            .collection('option_chain_data')
            .insertOne(finalData1)
          const finalAggregatedData = {
            date: new Date().toDateString(),
            expiryDate,
            underlying,
            updatedAt: timeStamp,
            data: [...existingData, ...existingData1, formattedData],
          }
          return Response.json(
            uploadedOptionData.acknowledged ? finalAggregatedData : todayData[0]
          )
        }
      }
    }
  }
  console.log('--------------no new data------------------------')
  return Response.json(todayData[0])
}
