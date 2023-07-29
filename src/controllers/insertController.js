import dataInsert from '../services/dataInsert'
//createPriceandAcrea
//insert
const insertData = async (req, res) => {
  try {
    let data = await dataInsert.insert()
    return res.status(200).json(data)
  } catch (error) {
    return res.status(400).json({
      errMessage: 'fail' + error
    })
  }
}
module.exports = {
  insertData: insertData
}