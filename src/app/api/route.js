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
      let atmIndex = optionData.filtered.data.findIndex(item => item.strikePrice == latestAtm)
      let existingData = todayData[0] ? todayData[0].data : []
      let filteredOptionData = {data:[...existingData],date:new Date().toDateString(), updatedAt:timeStamp}
      // console.log('----------optionData', optionData, atmIndex)
      for (let i = atmIndex - 20; i < atmIndex + 20; i++) {
        let peData = {
          ...optionData.filtered.data[i].PE,
          time: timeStamp,
          type: 'put',
          atmStrikePrice: latestAtm
        }
        let ceData = {
          ...optionData.filtered.data[i].CE,
          time: timeStamp,
          type: 'call',
          atmStrikePrice: latestAtm
        }
        filteredOptionData.data.push(peData)
        filteredOptionData.data.push(ceData)
      }


    // insert to mongo db collection
        let uploadedOptionData = todayData[0] ? 
        await db.collection("option_chain_data").replaceOne({date:new Date().toDateString()},filteredOptionData)
        : await db.collection("option_chain_data").insertOne(filteredOptionData);
        return Response.json(uploadedOptionData.acknowledged ? filteredOptionData :todayData[0])
    }
    return Response.json(todayData[0])
}