const { executeQueries } = require("../db")

const getByLotId = async (lotId) => {
    const indexWithBackticks = '`index`'
    const query = `
    SELECT 
        lo.id, 
        null as listingId,
        null as giftId,
        le.id as lotEditId, 
        le.time,
        null as ownerId,
        null as proxyOwnerId
    FROM V3_Lot lo
    LEFT JOIN V3_LotEdit le on le.lotId = lo.id
    LEFT JOIN V3_LotInsert li on li.lotEditId = le.id
    LEFT JOIN V3_LotRemoval lr on lr.lotEditId = le.id
    WHERE lo.id = '${lotId}'
    UNION
    SELECT 
        lo.id, 
        null as listingId,
        g.id as giftId, 
        null as lotEditId,
        g.time,
        u.user_id as ownerId,
        u.proxyCreatorId as proxyOwnerId
    FROM V3_Lot lo
    LEFT JOIN V3_Gift g on g.lotId = lo.id
    LEFT JOIN users u on u.user_id = g.recipientId
    WHERE lo.id = '${lotId}'
    UNION
    SELECT 
        lo.id, 
        l.id as listingId,
        null as giftId, 
        null as lotEditId,
        l.time,
        u.user_id as ownerId,
        u.proxyCreatorId as proxyOwnerId
    FROM V3_Lot lo
    LEFT JOIN V3_Listing l ON l.lotId = lo.id
    LEFT JOIN V3_Sale s on s.id = l.saleId
    LEFT JOIN users u on u.user_id = s.purchaserId
    WHERE lo.id = '${lotId}'
    ;`
    const req = { queryQueue: [query] }
    const res = {}
    let transactions
    await executeQueries(req, res, (err) => {
        if (err) throw err
        transactions = req.results
    })
    return transactions
}

module.exports = { getByLotId }
