const Transaction = require('../models/Transaction')
const LotEdit = require('../models/LotEdit')
const Lot = require('../models/Lot')
const { parseThenFormatAppraisals, parseThenFormatLabels } = require('./collected-item-middleware')

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
                return {
                    ...i, 
                    appraisals: i.appraisals ? parseThenFormatAppraisals(i.appraisals) : null,
                    labels: i.labels ? parseThenFormatLabels(i.labels) : null
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

const getLotById = async (req, res, next) => {
    try {
        const id = req.params.id
        const lotItems = await Lot.selectById(id, req.claims.user_id, req.query)
        if (lotItems.length === 0) throw { status: 403, message: 'You do not have permission to view this lot.' }
        const {
            acquisitionSaleId,
            acquisitionSellerId,
            acquisitionSellerName,
            acquisitionSaleTime,
            acquisitionGiftId, 
            acquisitionGiverId,
            acquisitionGiverName,
            acquisitionGiftTime,
            creationEditId,
            creationTime,
            count
        } = lotItems[0]
        let description = ''
        if (acquisitionSaleId) description += `Purchased ${new Date(acquisitionSaleTime).toLocaleDateString()}`
        else if (acquisitionGiftTime) description += `Received ${new Date(acquisitionGiftTime).toLocaleDateString()}`
        else if (creationTime) description += `Created ${new Date(creationTime).toLocaleDateString()}`
             
        const items = lotItems.map(({
                collectedItemId,
                itemId,
                name,
                setName,
                tcgpId,
                appraisalId,
                conditionId,
                conditionName,
                printingId,
                printingName
        }) => {
            return {
                collectedItemId,
                itemId,
                name,
                setName,
                tcgpId,
                appraisalId,
                conditionId,
                conditionName,
                printingId,
                printingName
            }
        })
        req.results = {
            id,
            acquisition: {
                description,
                sale: {
                    id: acquisitionSaleId,
                    sellerId: acquisitionSellerId,
                    sellerName: acquisitionSellerName,
                    time: acquisitionSaleTime
                },
                gift: {
                    id: acquisitionGiftId, 
                    giverId: acquisitionGiverId,
                    giverName: acquisitionGiverName,
                    time: acquisitionGiftTime
                },
                creation: {
                    lotEditId: creationEditId,
                    time: creationTime
                }
            },
            count,
            items
        }
        next()
    } catch (err) {
        next(err)
    }
    
}

module.exports = { buildLotFromId, getLotById }