const { executeQueries } = require('../db')
const { filterConcatinated } = require('../utils/queryFormatters')

const selectByFilter = async (filter) => {
    const query = `SELECT * FROM V3_LotInsert WHERE ${filterConcatinated(filter)};`
    const req = { queryQueue: [{ query, variables: [] }] }
    const res = {}
    let results
    await executeQueries(req, res, (err) => {
        if (err) throw err
        results = req.results
    })
    return results
}

module.exports= { selectByFilter }