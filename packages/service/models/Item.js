const { executeQueries } = require("../db")
const QueryFormatters = require("../utils/queryFormatters")
const { v4: uuidV4 } = require('uuid')


const create = async (itemArray) => {
    const queryQueue = []
    const formattedItemArray = itemArray.map(item => {
        if (!item.id) return { id: uuidV4(), ...item }
        return item
    })
    const query = QueryFormatters.objectsToInsert(formattedItemArray, 'Item')
    queryQueue.push(query)
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
    return formattedItemArray.map(item => item.id)
}

const selectBy = async (filter) => {
    const query = `
        SELECT * FROM Item
        WHERE ${QueryFormatters.filterConcatinated(filter)}
    `
    const req = { queryQueue: [query] }
    const res = {}
    let items
    await executeQueries(req, res, (err) => {
        if (err) throw err
        items = req.results
    })
    return items
}

const select = async () => {
        const query = `
        SELECT * FROM Items
        Limit 10
    `
    const req = { queryQueue: [query] }
    const res = {}
    let items
    await executeQueries(req, res, (err) => {
        if (err) throw err
        items = req.results
    })
    return items
}

module.exports = { create, selectBy, select }