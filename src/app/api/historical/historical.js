import clientPromise from '../../../lib/mongodb'
// import { testData } from "../../../Fri-Dec-01-2023-BANKNIFTY"

export async function GET(request) {
  // const { searchParams } = new URL(request.url)
  let nseData, optionData, todayData, timeStamp, db
  let isDbConnectionError = false

  console.log('################### STARTS ###################')

  try {
    //*connect to mongo database*/
    const client = await clientPromise
    db = client.db('optionChainData')

    //* fetch today's data from mongo collection */
    todayData = await db
      .collection('option_chain_data')
      .find({ date: new Date(2023, 11, 22).toDateString() })
      .toArray()
    // todayData = await db.collection("option_chain_data").find({date:'Fri Dec 01 2023'}).toArray();
    console.log('db connected')
  } catch (error) {
    console.log('db connection issue', error.message)
    isDbConnectionError = true
  }

  if (!isDbConnectionError) {
      console.log('################### ENDS ###################')
      return Response.json(todayData[0])
  }
}
