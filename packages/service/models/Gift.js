const { executeQueries } = require("../db")
const { filterConcatinated } = require("../utils/queryFormatters")

const getById = async (id, userId) => {
    const query = `
        SELECT
            id,
            recipientId,
            u.user_name as recipientName,
            u.proxyCreatorId,
            collectedItemId,
            lotId,
            time
        FROM V3_Gift g
        LEFT JOIN users u
            ON u.user_id = g.recipientId OR u.proxyCreatorId = g.recipientId
        WHERE id = '${id}'
    ;`
    const req = { queryQueue: [query] }
    const res = {}
    let gift
    await executeQueries(req, res, (err) => {
        if (err) throw err
        gift = req.results
    })
    return gift[0]
}

const patchByFilter = async (filter, data) => {
    const query = `
        UPDATE V3_Gift
        SET ${filterConcatinated(data)}
        WHERE ${filterConcatinated(filter)}
    ;`
    const req = { queryQueue: [query] }
    const res = {}
    let results
    await executeQueries(req, res, (err) => {
        if (err) throw err
        results = req.results
    })
    return results
}

const selectByFilter = async (filter) => {
    const query = `SELECT * FROM V3_Gift WHERE ${filterConcatinated(filter)}`
    const req = { queryQueue: [query] }
    const res = {}
    let results
    await executeQueries(req, res, (err) => {
        if (err) throw err
        results = req.results
    })
    return results
}

const deleteById = async (giftId) => {
    const query = `DELETE FROM V3_Gift where id = '${giftId}';`
    const req = { queryQueue: [query] }
    const res = {}
    let results
    await executeQueries(req, res, (err) => {
        if (err) throw err
        results = req.results
    })
    return results
}

module.exports = { getById, selectByFilter, patchByFilter, deleteById }
