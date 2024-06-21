const { v4: uuidV4 } = require('uuid')
const { executeQueries } = require('../db')
const { objectsToInsert } = require('../utils/queryFormatters')

const getById = async (id) => {
    const indexWithBackticks = '`index`'
    const query = `
        SELECT
            le.id as lotEditId,
            le.time as lotEditTime,
            li.id as lotInsertId,
            li.collectedItemId as insertedCollectedItemId,
            li.bulkSplitId,
            li.index as ${indexWithBackticks},
            lr.id as lotRemovalId,
            lr.collectedItemId as removedCollectedItemId,
            lr.bulkSplitId
        FROM V3_LotEdit le
        LEFT JOIN V3_LotInsert li on li.lotEditId = le.id
        LEFT JOIN V3_LotRemoval lr on lr.lotEditId = le.id
        WHERE le.id = '${id}'
    `
    const queryQueue = [query]
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
    if (lotEdit.lotInserts.length > 0) {
        const collectedItemsToInsert = []
        const appraisalsToInsert = []
        const collectedItemNotesToInsert = []
        lotEdit.lotInserts.forEach((item, idx) => {
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
            lotEdit.lotInserts[idx] = { ...item, collectedItemId }
        })
        queryQueue.push(`${objectsToInsert(collectedItemsToInsert, 'V3_CollectedItem')};`)
        queryQueue.push(`${objectsToInsert(appraisalsToInsert, 'V3_Appraisal')};`)        
        if (collectedItemNotesToInsert.length > 0) {
            queryQueue.push(`${objectsToInsert(collectedItemNotesToInsert, 'V3_CollectedItemNote')};`)
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
    lotEdit.lotInserts.forEach((item) => {
        const { collectedItemId, index } = item
        console.log(item)
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
    lotEdit.lotRemovals.forEach((item) => {
        const { collectedItemId } = item
        const lotRemovalId = uuidV4()
        const formattedLotInsert = {
            id: lotRemovalId,
            lotEditId,
            collectedItemId
        }
        formattedLotRemovals.push(formattedLotInsert)
    })
    queryQueue.push(`${objectsToInsert([formattedLotEdit], 'V3_LotEdit')};`)
    if (formattedLotInserts.length > 0) {
        queryQueue.push(`${objectsToInsert(formattedLotInserts, 'V3_LotInsert')};`)  
    }
    if (formattedLotRemovals.length > 0) {
        queryQueue.push(`${objectsToInsert(formattedLotRemovals, 'V3_LotRemoval')};`)  
    }
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
    return lotEditId
}

module.exports= { getById, createForExternal }