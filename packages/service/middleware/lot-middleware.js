const Transaction = require('../models/Transaction')
const LotEdit = require('../models/LotEdit')
const { parseThenFormatAppraisals } = require('./collected-item-middleware')

const buildLotFromId = async (lotId) => {
    let lotItems = []
    const lotTransactions = await Transaction.getByLotId(lotId)
    // TODO: need start and end time, so edits from other users are not included
    const lotEdits = lotTransactions.filter(lt => lt.lotEditId)
    for (let i=0; i<lotEdits.length; i++) {
        const lotEditItems = await LotEdit.getById(lotEdits[i].lotEditId)
        const lotInserts = lotEditItems
            .filter(i => i.lotInsertId)
            .map(i => { 
                if (i.collectedItemId) {
                    return {
                        ...i, 
                        appraisals: parseThenFormatAppraisals(i.appraisals)
                    }
                } else if (i.bulkSplitId) {
                    return i
                }
            })
        const lotRemovals = lotEditItems.filter(i => i.lotRemovalId)
        const removalLookup = {}
        lotRemovals.forEach(lotRemoval => removalLookup[lotRemoval.collectedItemId] = 1)
        lotItems = [...lotItems, ...lotInserts]
        lotItems = lotItems.filter(lotItem => !removalLookup[lotItem.collectedItemId])
    }
    return lotItems
}

module.exports = { buildLotFromId }