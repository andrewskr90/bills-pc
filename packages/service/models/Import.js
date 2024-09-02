const { executeQueries } = require("../db")
const QueryFormatters = require("../utils/queryFormatters")

const create = async (imports) => {
    const queryQueue = []
    const query = QueryFormatters.objectsToInsert(imports, 'V3_Import')
    queryQueue.push(query)
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
    return imports.map(sku => sku.id)
}

const getById = async (id, userId) => {
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
        WHERE id = '${id}'
    ;`
    const req = { queryQueue: [query] }
    const res = {}
    let imp
    await executeQueries(req, res, (err) => {
        if (err) throw err
        imp = req.results
    })
    return imp[0]
}

module.exports = { create, getById }
