const { executeQueries } = require("../db")

const find = async () => {
    let query = `SELECT * FROM conditions;`
    const req = { queryQueue: [{ query, variables: [] }] }
    const res = {}
    let conditions
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        conditions = req.results
    })
    return conditions
}

module.exports = { find }
