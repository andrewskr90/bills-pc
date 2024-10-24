const { v4: uuidV4 } = require('uuid')
const { executeQueries } = require('../db')
const { objectsToInsert, filterConcatinated } = require('../utils/queryFormatters')

const getById = async (id) => {
    const indexWithBackticks = '`index`'
    const query = `
        SELECT
            le.id as lotEditId,
            le.time as lotEditTime,
            li.id as lotInsertId,
            null as lotRemovalId,
            li.collectedItemId,
            c.itemId,
            i.name,
            i.tcgpId,
            s.set_v2_id as setId,
            s.set_v2_name as setName,
            c.printingId,
            GROUP_CONCAT('[', UNIX_TIMESTAMP(a.time), ',', a.conditionId, ',', a.appraiserId, ']' ORDER BY a.time DESC SEPARATOR ',') as appraisals,
            li.bulkSplitId,
            GROUP_CONCAT(bsl.labelComponents SEPARATOR ',') as labels,
            bs.count,
            bs.estimate,
            li.index as ${indexWithBackticks}
        FROM V3_LotInsert li
        LEFT JOIN V3_LotEdit le on le.id = li.lotEditId
        LEFT JOIN V3_CollectedItem c on c.id = li.collectedItemId
        LEFT JOIN Item i on i.id = c.itemId
        LEFT JOIN sets_v2 s on s.set_v2_id = i.setId
        LEFT JOIN V3_BulkSplit bs on bs.id = li.bulkSplitId
        LEFT JOIN V3_Appraisal a
            on a.collectedItemId = c.id
        LEFT JOIN (
            SELECT
                bsl.id as bulkSplitLabelId,
                bsl.bulkSplitId,
                GROUP_CONCAT(
                    '[', 
                    IFNULL(la.id, 'NULL'), ',',
                    IFNULL(lc.id, 'NULL'), ',',
                    IFNULL(lc.rarityId, 'NULL'), ',',
                    IFNULL(lc.typeId, 'NULL'), ',',
                    IFNULL(lc.printingid, 'NULL'), ',',
                    IFNULL(lc.setId, 'NULL'),
                    ']' SEPARATOR ','
                ) as labelComponents
            FROM V3_BulkSplitLabel bsl
            LEFT JOIN V3_Label la on la.id = bsl.labelId
            LEFT JOIN V3_LabelComponent lc on lc.labelId = la.id
            GROUP BY bsl.bulkSplitId
        ) bsl on bsl.bulkSplitId = bs.id
        WHERE le.id = ?
        GROUP BY li.id
        UNION
        SELECT
            le.id as lotEditId,
            le.time as lotEditTime,
            null as lotInsertId,
            lr.id as lotRemovalId,
            lr.collectedItemId,
            c.itemId,
            i.name,
            i.tcgpId,
            s.set_v2_id as setId,
            s.set_v2_name as setName,
            c.printingId,
            null as appraisals,
            lr.bulkSplitId,
            null as labels,
            null as count,
            null as estimate,
            null as ${indexWithBackticks}
        FROM V3_LotRemoval lr 
        LEFT JOIN V3_LotEdit le on le.id = lr.lotEditId
        LEFT JOIN V3_CollectedItem c on c.id = lr.collectedItemId
        LEFT JOIN Item i on i.id = c.itemId
        LEFT JOIN sets_v2 s on s.set_v2_id = i.setId
        LEFT JOIN V3_BulkSplit bs on bs.id = lr.bulkSplitId
        WHERE le.id = ?
        GROUP BY lr.id
    `
    const queryQueue = [{ query, variables: [id, id] }]
    const req = { queryQueue }
    const res = {}
    let lotEditResults
    await executeQueries(req, res, (err) => {
        if (err) throw err
        lotEditResults = req.results
    })
    return lotEditResults
}

const createForExternal = async (lotEdit, sellerId, watcherId) => {
    const { lotId, time, lotInserts, lotRemovals } = lotEdit
    const queryQueue = []
    // create collected items
    if (lotInserts.length > 0) {
        const collectedItemsToInsert = []
        const appraisalsToInsert = []
        const collectedItemNotesToInsert = []
        lotInserts.forEach((item, idx) => {
            const { itemId, printingId, conditionId, note } = item
            const collectedItemId = uuidV4()
            const formattedItem = {
                id: collectedItemId,
                itemId,
                printingId
            }
            const appraisalId = uuidV4()
            const formattedAppraisal = {
                id: appraisalId,
                collectedItemId,
                conditionId,
                appraiserId: sellerId,
                time: lotEdit.time
            }
            if (note) {
                const itemNoteId = uuidV4()
                const formattedCollectedItemNote = {
                    id: itemNoteId, 
                    collectedItemId, 
                    takerId: watcherId,
                    note,
                    time: lotEdit.time
                }
                collectedItemNotesToInsert.push(formattedCollectedItemNote)
            }
            collectedItemsToInsert.push(formattedItem)
            appraisalsToInsert.push(formattedAppraisal)
            lotInserts[idx] = { ...item, collectedItemId }
        })
        queryQueue.push({ query: `${objectsToInsert(collectedItemsToInsert, 'V3_CollectedItem')};`, variables: [] })
        queryQueue.push({ query: `${objectsToInsert(appraisalsToInsert, 'V3_Appraisal')};`, variables: [] })        
        if (collectedItemNotesToInsert.length > 0) {
            queryQueue.push({ query: `${objectsToInsert(collectedItemNotesToInsert, 'V3_CollectedItemNote')};`, variables: [] })
        }
    }
    const lotEditId = uuidV4()
    const formattedLotEdit = {
        id: lotEditId,
        lotId,
        time
    }
    // create V3_LotInsert
    const formattedLotInserts = []
    lotInserts.forEach((item) => {
        const { collectedItemId, index } = item
        const lotInsertId = uuidV4()
        const formattedLotInsert = {
            id: lotInsertId,
            lotEditId,
            collectedItemId,
            index
        }
        formattedLotInserts.push(formattedLotInsert)
    })
    // create V3_LotRemoval
    const formattedLotRemovals = []
    lotRemovals.forEach((item) => {
        const { collectedItemId } = item
        const lotRemovalId = uuidV4()
        const formattedLotInsert = {
            id: lotRemovalId,
            lotEditId,
            collectedItemId
        }
        formattedLotRemovals.push(formattedLotInsert)
    })
    queryQueue.push({ query: `${objectsToInsert([formattedLotEdit], 'V3_LotEdit')};`, variables: [] })
    if (formattedLotInserts.length > 0) {
        queryQueue.push({ query: `${objectsToInsert(formattedLotInserts, 'V3_LotInsert')};`, variables: [] })  
    }
    if (formattedLotRemovals.length > 0) {
        queryQueue.push({ query: `${objectsToInsert(formattedLotRemovals, 'V3_LotRemoval')};`, variables: [] })  
    }
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
    return lotEditId
}

const selectByFilter = async (filter) => {
    const query = `SELECT * FROM V3_LotEdit WHERE ${filterConcatinated(filter)}`
    const req = { queryQueue: [{ query, variables: [] }] }
    const res = {}
    let results
    await executeQueries(req, res, (err) => {
        if (err) throw err
        results = req.results
    })
    return results
}

const patchByFilter = async (filter, data) => {
    const query = `
        UPDATE V3_LotEdit 
        SET ${filterConcatinated(data)}
        WHERE ${filterConcatinated(filter)}
    ;`
    const req = { queryQueue: [{ query, variables: [] }] }
    const res = {}
    let results
    await executeQueries(req, res, (err) => {
        if (err) throw err
        results = req.results
    })
    return results
}

module.exports= { getById, createForExternal, selectByFilter, patchByFilter }