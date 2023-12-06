import clientPromise from "../../lib/mongodb";
// import { testData } from "../../../Fri-Dec-01-2023-BANKNIFTY"

export async function GET(request) {
    // const { searchParams } = new URL(request.url)
    //* fetch option data from nse website*/
    let nseData
    try {
      nseData = await fetch('https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY', { next: { revalidate: 45 } })
    } catch (error) {
      console.log('error', error)
    }
    const optionData = await nseData.json()
    
    console.log('-----------db connected')
    let todayData, timeStamp, db
    try {
      const client = await clientPromise;
      //*connect to mongo database*/
      db = client.db("optionChainData");

      //* use it to insert data from docs
      // const insertData = await db.collection("option_chain_data").insertOne({data:testData, date:"Fri Dec 01 2023",updatedAt:"15:30:00" });
      // console.log('data inserted', insertData)

      //* fetch today's data from mongo collection */
      todayData = await db.collection("option_chain_data").find({date:new Date().toDateString()}).toArray();
      // todayData = await db.collection("option_chain_data").find({date:'Fri Dec 01 2023'}).toArray();
      timeStamp = optionData.records.timestamp.substr(-8, 8)
    } catch (error) {
      console.log('----------error', error)
    }
    console.log('-----------timeStamp', timeStamp)
    

    //* if no existing data then create new reocrd or update the existing data*/
    if(todayData[0] === undefined || todayData[0]?.updatedAt !== timeStamp){
      let currentPrice = optionData.records.underlyingValue
      let strikePriceInterval = 100

      let latestAtm = Math.round(currentPrice / strikePriceInterval) * strikePriceInterval
      let existingPutData =todayData[0]?.putData || []
      let existingCallData =todayData[0]?.callData || []
      let callSell = todayData[0]?.callSell || 0
      let callBuy = todayData[0]?.callBuy || 0
      let putSell = todayData[0]?.putSell || 0
      let putBuy = todayData[0]?.putBuy || 0
      let filteredOptionData = {
        putData: [...existingPutData], 
        callData:[...existingCallData]
      }
      // console.log('----------optionData', optionData, atmIndex)
      for (let i = 0; i < optionData.filtered.data.length; i++) {
        const {expiryDate,underlying, underlyingValue, ...restPeData } = optionData.filtered.data[i].PE
        const {expiryDate: expiryDateCe,underlying:underlyingCe, underlyingValue:underlyingValueCe, ...restCeData } = optionData.filtered.data[i].CE
        let peData = {
          ...optionData.filtered.data[i].PE,
          // time: timeStamp,
          // type: 'put',
          // atmStrikePrice: latestAtm
        }
        putSell += optionData.filtered.data[i].PE.totalSellQuantity
        putBuy += optionData.filtered.data[i].PE.totalBuyQuantity
        
        let ceData = {
          ...optionData.filtered.data[i].CE,
          // time: timeStamp,
          // type: 'call',
          // atmStrikePrice: latestAtm
        }
        callSell += optionData.filtered.data[i].CE.totalSellQuantity
        callBuy += optionData.filtered.data[i].CE.totalBuyQuantity

        filteredOptionData.putData.push(restPeData)
        filteredOptionData.callData.push(restCeData)
      }
      
      filteredOptionData.putSell = putSell
      filteredOptionData.putBuy = putBuy
      filteredOptionData.callSell = callSell
      filteredOptionData.callBuy = callBuy

      const formattedData = {
        filteredOptionData,
        callOI: optionData.filtered.CE.totOI,
        callVolume: optionData.filtered.CE.totVol,
        pcr: optionData.filtered.PE.totOI/optionData.filtered.CE.totOI,
        putOI: optionData.filtered.PE.totOI,
        putVolume: optionData.filtered.PE.totVol,
        putSell,
        putBuy,
        callSell,
        callBuy,
        atm,
        time: timeStamp, 
      }

      const finalData = {
        date:new Date().toDateString(),
        updatedAt:timeStamp,
        data:[formattedData, ...todayData[0].data]
      }

    // insert to mongo db collection
        let uploadedOptionData = todayData[0] ? 
        await db.collection("option_chain_data")
        .replaceOne(
          {date:new Date().toDateString()},
          {date:new Date().toDateString(),
            updatedAt:timeStamp,
            data:[formattedData, ...todayData[0].data]})
        : await db.collection("option_chain_data")
        .insertOne(
          {date:new Date().toDateString(),
          updatedAt:timeStamp,
          data:[formattedData]});
        return Response.json(uploadedOptionData.acknowledged ? filteredOptionData :todayData[0])
    }
    return Response.json(todayData[0])
}