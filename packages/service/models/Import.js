const { executeQueries } = require("../db")
const { createItemImportQueries } = require("../utils/imports")
const QueryFormatters = require("../utils/queryFormatters")
const User = require('../models/User')

const create = async (importData, proxyCreatorId) => {
    const { items, importerId, time } = importData
    if (items.length === 0) throw new Error('No items provided to import')
    const proxyUsers = await User.findProxyByCreatorId(proxyCreatorId, importerId)
    if (proxyUsers.length === 0) throw new Error('Vendor does not exist')
    if (proxyUsers[0].user_id !== importerId) throw new Error('Vendor does not exist')

    try {
        const { collectedItemIds, queries: queryQueue } = createItemImportQueries(items, importerId, time)
        const req = { queryQueue }
        const res = {}
        await executeQueries(req, res, (err) => {
            if (err) throw err
        })
        return collectedItemIds
    } catch (err) {
        throw err
    }
}

const createConvertedFromGift = async (imports) => {
    const queryQueue = []
    const query = QueryFormatters.objectsToInsert(imports, 'V3_Import')
    queryQueue.push({ query, variables: [] })
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
    return imports.map(sku => sku.id)
}

const getById = async (id) => {
    const query = `
        SELECT
            id,
            importerId,
            u.user_name as importerName,
            u.proxyCreatorId,
            collectedItemId,
            bulkSplitId,
            time
        FROM V3_Import i
        LEFT JOIN users u
            ON u.user_id = i.importerId OR u.proxyCreatorId = i.importerId
        WHERE id = ?
    ;`
    const req = { queryQueue: [{ query, variables: [id] }] }
    const res = {}
    let imp
    await executeQueries(req, res, (err) => {
        if (err) throw err
        imp = req.results
    })
    return imp[0]
}

module.exports = { createConvertedFromGift, getById, create }
