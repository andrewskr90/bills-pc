const { executeQueries } = require("../db")
const QueryFormatters = require("../utils/queryFormatters")

const find = async () => {
    let query = `SELECT * FROM SKU LIMIT 10;`
    const req = { queryQueue: [{ query, variables: [] }] }
    const res = {}
    let skus
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        skus = req.results
    })
    return skus
}

const findBy = async (filter) => {
    const query = `
        SELECT * FROM SKU
        WHERE ${QueryFormatters.filterConcatinated(filter)}
    `
    const req = { queryQueue: [{ query, variables: [] }] }
    const res = {}
    let skus
    await executeQueries(req, res, (err) => {
        if (err) throw err
        skus = req.results
    })
    return skus
}

const create = async (skus) => {
    const queryQueue = []
    const query = QueryFormatters.objectsToInsert(skus, 'SKU')
    queryQueue.push({ query, variables: [] })
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
    return skus.map(sku => sku.id)
}

const findByTcgpIds = async (tcgpIds) => {
    const query = `
        SELECT * FROM SKU
        WHERE ${tcgpIds.map((tcgpId, idx) => {
            if (idx === 0) return `tcgpId = '${tcgpId}'`
            else {
                return ` OR tcgpId = '${tcgpId}'`
            }
        }).join('')};
    `
    const req = { queryQueue: [{ query, variables: [] }] }
    const res = {}
    let skus
    await executeQueries(req, res, (err) => {
        if (err) throw err
        skus = req.results
    })
    return skus
}

module.exports = { find, findBy, create, findByTcgpIds }
