const { objectsToInsert } = require('../queryFormatters')

const { v4: uuidV4 } = require('uuid')

const formatCollectedItem = (id, itemId, printingId) => {
    return {
        id,
        itemId,
        printingId
    }
}

const formatAppraisal = (id, collectedItemId, conditionId, appraiserId, time) => {
    return {
        id,
        collectedItemId,
        conditionId,
        appraiserId,
        time
    }
}

const formatCollectedItemNote = (id, collectedItemId, takerId, note, time) => {
    return {
        id, 
        collectedItemId, 
        takerId,
        note,
        time
    }
}

const formatImport = (id, importerId, collectedItemId, bulkSplitId, time) => {
    return {
        id,
        importerId,
        collectedItemId,
        bulkSplitId,
        time
    }
}

const createItemImportQueries = (items, importerId, time, noteTakerId) => {
    const queries = []
    const collectedItemIds = []
    const collectedItemsToInsert = []
    const importsToInsert = []
    const appraisalsToInsert = []
    const collectedItemNotesToInsert = []
    items.forEach((item) => {
        if (
            !item.id || 
            !item.printingId || 
            !item.conditionId ||
            !importerId ||
            !time
        ) { 
            throw new Error('Item information must be complete to import.')
        }
        const collectedItemId = uuidV4()
        const formattedCollectedItem = formatCollectedItem(collectedItemId, item.id, item.printingId)
        // TODO after listing created, user can create their own appraisal
        const formattedAppraisal = formatAppraisal(uuidV4(), collectedItemId, item.conditionId, importerId, time)
        const formattedImport = formatImport(uuidV4(), importerId, collectedItemId, null, time)
        if (item.note) {
            // all notes are taken by the proxyCreator
            const formattedCollectedItemNote = formatCollectedItemNote(uuidV4(), collectedItemId, noteTakerId, item.note, time)
            collectedItemNotesToInsert.push(formattedCollectedItemNote)
        }
        collectedItemIds.push(collectedItemId)
        collectedItemsToInsert.push(formattedCollectedItem)
        appraisalsToInsert.push(formattedAppraisal)
        importsToInsert.push(formattedImport)
    })
    queries.push({ query: `${objectsToInsert(collectedItemsToInsert, 'V3_CollectedItem')};`, variables: [] })
    queries.push({ query: `${objectsToInsert(appraisalsToInsert, 'V3_Appraisal')};`, variables: [] })
    queries.push({ query: `${objectsToInsert(importsToInsert, 'V3_Import')};`, variables: [] })
    if (collectedItemNotesToInsert.length > 0) {
        queries.push({ query: `${objectsToInsert(collectedItemNotesToInsert, 'V3_CollectedItemNote')};`, variables: [] })
    }
    return { collectedItemIds, queries }
}

module.exports = { createItemImportQueries }