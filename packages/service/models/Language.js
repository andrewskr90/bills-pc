const { executeQueries } = require("../db")

const find = async () => {
    let query = `SELECT * FROM Language`
    const req = { queryQueue: [query] }
    const res = {}
    let languages
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        languages = req.results
    })
    return languages
}

module.exports = { find }
