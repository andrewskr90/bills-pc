const { executeQueries } = require("../db")
const { parseThenFormatAppraisals } = require("../middleware/collected-item-middleware")

const getById = async (id) => {
    const query = `
        SELECT
            c.id as collectedItemId,
            c.itemId,
            i.name,
            i.tcgpId,
            s.set_v2_id as setId,
            s.set_v2_name as setName,
            c.printingId,
            GROUP_CONCAT('[', UNIX_TIMESTAMP(a.time), ',', a.conditionId, ',', a.appraiserId, ']' ORDER BY a.time DESC SEPARATOR ',') as appraisals
        FROM V3_CollectedItem c
        LEFT JOIN Item i on i.id = c.itemId
        LEFT JOIN sets_v2 s on s.set_v2_id = i.setId
        LEFT JOIN V3_Appraisal a
            on a.collectedItemId = c.id
        WHERE c.id = ?
        GROUP BY c.id
    `
    const queryQueue = [{ query, variables: [id] }]
    const req = { queryQueue }
    const res = {}
    let collectedItemResults
    await executeQueries(req, res, (err) => {
        if (err) throw err
        collectedItemResults = req.results
    })
    return {
        ...collectedItemResults[0],
        appraisals: parseThenFormatAppraisals(collectedItemResults[0].appraisals)
    }
}

module.exports = { getById }