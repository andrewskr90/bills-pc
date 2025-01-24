const { executeQueries } = require("../db")
const { sortLotTransactions } = require("../utils/lot")

const selectForLot = async (lotId, limit, timeCutoff) => {
    const query = `
        (SELECT
            le.lotId,
            le.id as lotEditId,
            null as listingId,
            null as deletedListingId,
            null as saleId,
            null as giftId,
            le.time
        FROM V3_LotEdit le
        WHERE le.lotId = ?
            ${timeCutoff ? `AND le.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
        UNION
        (SELECT
            li.lotId as lotId,
            null as lotEditId,
            li.id as listingId,
            null as deletedListingId,
            null as saleId,
            null as giftId,
            li.time
        FROM V3_Listing li
        left join V3_ListingRemoval listR
            on listR.listingId = li.id
        WHERE listR.id is null
            AND li.saleId is null
            AND li.lotId = ?
            ${timeCutoff ? `AND li.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
        UNION
        (SELECT
            li.lotId as lotId,
            null as lotEditId,
            null as listingId,
            li.id as deletedListingId,
            null as saleId,
            null as giftId,
            listR.time as time
        FROM V3_Listing li
        left join V3_ListingRemoval listR
            on listR.listingId = li.id
        WHERE listR.id is not null
            AND li.lotId = ?
            ${timeCutoff ? `AND li.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
        UNION
        (SELECT
            li.lotId,
            null as lotEditId,
            null as listingId,
            null as deletedListingId,
            s.id as saleId,
            null as giftId,
            s.time
        FROM V3_Sale s
        LEFT JOIN V3_Listing li
            ON li.saleId = s.id
        WHERE li.lotId = ?
            ${timeCutoff ? `AND s.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
        UNION
        (SELECT
            g.lotId,
            null as lotEditId,
            null as listingId,
            null as deletedListingId,
            null as saleId,
            g.id as giftId,
            g.time
        FROM V3_Gift g
        WHERE g.lotId = ?
            ${timeCutoff ? `AND g.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
    ;`
    const req = { 
        queryQueue: [{ 
            query, 
            variables: [
                lotId, timeCutoff, limit, 
                lotId, timeCutoff, limit, 
                lotId, timeCutoff, limit, 
                lotId, timeCutoff, limit, 
                lotId, timeCutoff, limit
            ] 
        }] 
    }
    const res = {}
    let transactions
    await executeQueries(req, res, (err) => {
        if (err) throw err
        transactions = req.results
    })
    return sortLotTransactions(transactions)
}

const selectForBulkSplit = async (bulkSplitId, limit, timeCutoff) => {
    const query = `
        (SELECT
            le.id as lotEditId,
            li.id as lotInsertId,
            lr.id as lotRemovalId,
            null as listingId,
            null as deletedListingId,
            null as saleId,
            null as giftId,
            null as importId,
            le.time
        FROM V3_LotEdit le
        LEFT JOIN V3_LotInsert li
            ON li.lotEditId = le.id
        LEFT JOIN V3_LotRemoval lr
            ON lr.lotEditId = le.id
        WHERE (
            li.bulkSplitId = ?
            OR lr.bulkSplitId = ?
        ) ${timeCutoff ? `AND le.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
        UNION
        (SELECT
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            li.id as listingId,
            null as deletedListingId,
            null as saleId,
            null as giftId,
            null as importId,
            li.time
        FROM V3_Listing li
        left join V3_ListingRemoval listR
            on listR.listingId = li.id
        WHERE listR.id is null
            AND li.saleId is null
            AND li.bulkSplitId = ?
            ${timeCutoff ? `AND li.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
        UNION
        (SELECT
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            null as listingId,
            li.id as deletedListingId,
            null as saleId,
            null as giftId,
            null as importId,
            listR.time as time
        FROM V3_Listing li
        left join V3_ListingRemoval listR
            on listR.listingId = li.id
        WHERE listR.id is not null
            AND li.bulkSplitId = ?
            ${timeCutoff ? `AND li.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
        UNION
        (SELECT
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            null as listingId,
            null as deletedListingId,
            s.id as saleId,
            null as giftId,
            null as importId,
            s.time
        FROM V3_Sale s
        LEFT JOIN V3_Listing li
            ON li.saleId = s.id
        WHERE li.bulkSplitId = ?
            ${timeCutoff ? `AND s.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
        UNION
        (SELECT
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            null as listingId,
            null as deletedListingId,
            null as saleId,
            g.id as giftId,
            null as importId,
            g.time
        FROM V3_Gift g
        WHERE g.bulkSplitId = ?
            ${timeCutoff ? `AND g.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
        UNION
        (SELECT
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            null as listingId,
            null as deletedListingId,
            null as saleId,
            null as giftId,
            i.id as importId,
            i.time
        FROM V3_Import i
        WHERE i.bulkSplitId = ?
            ${timeCutoff ? `AND i.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
    ;`
    const req = { 
        queryQueue: [
            { 
                query, 
                variables: [
                    bulkSplitId, bulkSplitId, timeCutoff, limit, 
                    bulkSplitId, timeCutoff, limit, 
                    bulkSplitId, timeCutoff, limit, 
                    bulkSplitId, timeCutoff, limit, 
                    bulkSplitId, timeCutoff, limit, 
                    bulkSplitId, timeCutoff, limit 
                ]
            }
        ] 
    }
    const res = {}
    let transactions
    await executeQueries(req, res, (err) => {
        if (err) throw err
        transactions = req.results
    })
    return sortLotTransactions(transactions)
}

const selectForCollectedItem = async (collectedItemId, limit, timeCutoff) => {
    const query = `
        (SELECT
            le.id as lotEditId,
            li.id as lotInsertId,
            lr.id as lotRemovalId,
            null as listingId,
            null as deletedListingId,
            null as saleId,
            null as giftId,
            null as importId,
            le.time
        FROM V3_LotEdit le
        LEFT JOIN V3_LotInsert li
            ON li.lotEditId = le.id
        LEFT JOIN V3_LotRemoval lr
            ON lr.lotEditId = le.id
        WHERE (
            li.collectedItemId = ?
            OR lr.collectedItemId = ?
        ) ${timeCutoff ? `AND le.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
        UNION
        (SELECT
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            li.id as listingId,
            null as deletedListingId,
            null as saleId,
            null as giftId,
            null as importId,
            li.time
        FROM V3_Listing li
        left join V3_ListingRemoval listR
            on listR.listingId = li.id
        WHERE listR.id is null
            AND li.saleId is null
            AND li.collectedItemId = ?
            ${timeCutoff ? `AND li.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
        UNION
        (SELECT
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            null as listingId,
            li.id as deletedListingId,
            null as saleId,
            null as giftId,
            null as importId,
            listR.time as time
        FROM V3_Listing li
        left join V3_ListingRemoval listR
            on listR.listingId = li.id
        WHERE listR.id is not null
            AND li.collectedItemId = ?
            ${timeCutoff ? `AND li.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
        UNION
        (SELECT
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            null as listingId,
            null as deletedListingId,
            s.id as saleId,
            null as giftId,
            null as importId,
            s.time
        FROM V3_Sale s
        LEFT JOIN V3_Listing li
            ON li.saleId = s.id
        WHERE li.collectedItemId = ?
            ${timeCutoff ? `AND s.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
        UNION
        (SELECT
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            null as listingId,
            null as deletedListingId,
            null as saleId,
            g.id as giftId,
            null as importId,
            g.time
        FROM V3_Gift g
        WHERE g.collectedItemId = ?
            ${timeCutoff ? `AND g.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
        UNION
        (SELECT
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            null as listingId,
            null as deletedListingId,
            null as saleId,
            null as giftId,
            i.id as importId,
            i.time
        FROM V3_Import i
        WHERE i.collectedItemId = ?
            ${timeCutoff ? `AND i.time < ?` : ''}
        ${limit ? `LIMIT ?` : ''})
    ;`
    const req = { 
        queryQueue: [
            {
                query,
                variables: [
                    collectedItemId, collectedItemId, timeCutoff, limit, 
                    collectedItemId, timeCutoff, limit, 
                    collectedItemId, timeCutoff, limit, 
                    collectedItemId, timeCutoff, limit, 
                    collectedItemId, timeCutoff, limit, 
                    collectedItemId, timeCutoff, limit 
                ]
            }
        ] 
    }
    const res = {}
    let transactions
    await executeQueries(req, res, (err) => {
        if (err) throw err
        transactions = req.results
    })
    return sortLotTransactions(transactions)
}





const getByLotId = async (lotId) => {
    const query = `
        SELECT 
            lo.id, 
            null as listingId,
            null as saleId,
            null as giftId,
            le.id as lotEditId, 
            le.time,
            null as ownerId,
            null as ownerProxyCreatorId,
            null as ownerName
        FROM V3_Lot lo
        RIGHT JOIN V3_LotEdit le on le.lotId = lo.id
        LEFT JOIN V3_LotInsert li on li.lotEditId = le.id
        LEFT JOIN V3_LotRemoval lr on lr.lotEditId = le.id
        WHERE lo.id = ?
        UNION
        SELECT 
            lo.id, 
            null as listingId,
            null as saleId,
            g.id as giftId, 
            null as lotEditId,
            g.time,
            u.user_id as ownerId,
            u.proxyCreatorId as ownerProxyCreatorId,
            u.user_name as ownerName
        FROM V3_Lot lo
        RIGHT JOIN V3_Gift g on g.lotId = lo.id
        LEFT JOIN users u on u.user_id = g.recipientId
        WHERE lo.id = ?
        UNION
        SELECT 
            lo.id, 
            l.id as listingId,
            null as saleId,
            null as giftId, 
            null as lotEditId,
            l.time,
            u.user_id as ownerId,
            u.proxyCreatorId as ownerProxyCreatorId,
            u.user_name as ownerName
        FROM V3_Lot lo
        RIGHT JOIN V3_Listing l ON l.lotId = lo.id
        LEFT JOIN V3_Sale s on s.id = l.saleId
        LEFT JOIN users u on u.user_id = s.purchaserId
        WHERE lo.id = ?
        UNION
        SELECT 
            lo.id, 
            null as listingId,
            s.id as saleId,
            null as giftId, 
            null as lotEditId,
            l.time,
            u.user_id as ownerId,
            u.proxyCreatorId as ownerProxyCreatorId,
            u.user_name as ownerName
        FROM V3_Lot lo
        RIGHT JOIN V3_Listing l ON l.lotId = lo.id
        LEFT JOIN V3_Sale s on s.id = l.saleId
        LEFT JOIN users u on u.user_id = s.purchaserId
        WHERE lo.id = ? and s.id IS NOT NULL
    ;`
    const req = { queryQueue: [{ query, variables: [lotId, lotId, lotId, lotId] }] }
    const res = {}
    let transactions
    await executeQueries(req, res, (err) => {
        if (err) throw err
        transactions = req.results
    })
    return sortLotTransactions(transactions)
}

const getByCollectedItemId = async (collectedItemId) => {
    // every edit the item has been in
    // every time the item has been listed
    // every time the item has been gifted
    const query = `
        SELECT 
            ci.id as collectedItemId, 
            null as saleId,
            null as listingId,
            null as giftId,
            le.lotId,
            le.id as lotEditId, 
            li.id as lotInsertId,
            lr.id as lotRemovalId,
            le.time,
            null as ownerId,
            null as ownerProxyCreatorId,
            null as ownerName
        FROM V3_CollectedItem ci
        LEFT JOIN V3_LotInsert li on li.collectedItemId = ci.id
        LEFT JOIN V3_LotRemoval lr on lr.collectedItemid = ci.id
        LEFT JOIN V3_LotEdit le on le.id = li.lotEditId OR le.id = lr.lotEditId
        WHERE li.collectedItemId = ?
            OR lr.collectedItemId = ?
        GROUP BY le.id
        UNION
        SELECT 
            ci.id as collectedItemId, 
            s.id as saleId,
            null as listingId,
            null as giftId,
            null as lotId,
            null as lotEditId, 
            null as lotInsertId,
            null as lotRemovalId,
            s.time,
            u.user_id as ownerId,
            u.proxycreatorId as ownerProxyCreatorId,
            u.user_name as ownerName
        FROM V3_CollectedItem ci
        LEFT JOIN V3_Listing l on l.collectedItemId = ci.id
        LEFT JOIN V3_Sale s on s.id = l.saleid
        LEFT JOIN users u on u.user_id = s.purchaserId
        WHERE l.collectedItemId = ?
            AND s.id IS NOT NULL
        UNION
        SELECT 
            ci.id as collectedItemId, 
            null as saleId,
            l.id as listingId,
            null as giftId,
            null as lotId,
            null as lotEditId, 
            null as lotInsertId,
            null as lotRemovalId,
            l.time,
            u.user_id as ownerId,
            u.proxycreatorId as ownerProxyCreatorId,
            u.user_name as ownerName
        FROM V3_CollectedItem ci
        LEFT JOIN V3_Listing l on l.collectedItemId = ci.id
        LEFT JOIN V3_Sale s on s.id = l.saleid
        LEFT JOIN users u on u.user_id = s.purchaserId
        WHERE l.collectedItemId = ?
        UNION
        SELECT 
            ci.id as collectedItemId, 
            null as saleId,
            null as listingId,
            g.id as giftId,
            null as lotId,
            null as lotEditId, 
            null as lotInsertId,
            null as lotRemovalId, 
            g.time,
            u.user_id as ownerId,
            u.proxyCreatorId as ownerProxyCreatorId,
            u.user_name as ownerName
        FROM V3_CollectedItem ci
        LEFT JOIN V3_Gift g on g.collectedItemId = ci.id
        LEFT JOIN users u on u.user_id = g.recipientId
        WHERE ci.id = ?
    ;`
    const req = { 
        queryQueue: [
            { 
                query, 
                variables: [
                    collectedItemId, 
                    collectedItemId, 
                    collectedItemId, 
                    collectedItemId, 
                    collectedItemId
                ] 
            }
        ] 
    }
    const res = {}
    let transactions
    await executeQueries(req, res, (err) => {
        if (err) throw err
        transactions = req.results
    })
    return sortLotTransactions(transactions)
}

const getByCollectedCardIdNew = async (collectedItemId, userId) => {
    if (!userId) throw new Error(`Error: User Id required to query for collected item history`)
    if (!collectedItemId) throw new Error(`Error: collectedItemId required to query for collected item history`)

    const timeWithBackticks = `time`

    let query = `
        select
            le.id as lotEditId,
            li.id as lotInsertId,
            lr.id as lotRemovalId,
            lo.id as lotId,
            null as importId,
            null as importerId,
            null as importerName,
            null as listingId,
            null as initialPrice,
            null as listingPriceId,
            null as price,
            false as relisted,
            null as listingRemovalId,
            null as saleId,
            null as purchaserId,
            null as purchaserName,
            le.time
        from V3_LotEdit le
        left join V3_Lot lo on lo.id = le.lotId
        left join V3_LotInsert li on li.lotEditId = le.id
        left join V3_LotRemoval lr on lr.lotEditId = le.id
        left join V3_CollectedItem ci on ci.id = li.collectedItemId or ci.id = lr.collectedItemId
        where ci.id = '${collectedItemId}'
        union
        select
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            null as lotId,
            i.id as importId,
            i.importerId as importerId,
            u.user_name as importerName,
            null as listingId,
            null as initialPrice,
            null as listingPriceId,
            null as price,
            false as relisted,
            null as listingRemovalId,
            null as saleId,
            null as purchaserId,
            null as purchaserName,
            i.time
        from V3_Import i
        left join users u on u.user_id = i.importerId
        where i.collectedItemId = '${collectedItemId}'
        union
        select
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            lo.id as lotId,
            null as importId,
            null as importerId,
            null as importerName,
            l.id as listingId,
            l.price as initialPrice,
            null as listingPriceId,
            null as price,
            false as relisted,
            null as listingRemovalId,
            null as saleId,
            null as purchaserId,
            null as purchaserName,
            l.time
        from V3_Listing l
        left join V3_Lot lo on lo.id = l.lotId
        left join V3_LotEdit le on le.lotId = lo.id
        left join V3_LotInsert li on li.lotEditId = le.id
        left join V3_LotRemoval lr on lr.collectedItemId = li.collectedItemId or lr.bulkSplitId = li.bulkSplitId
        left join V3_LotEdit removalEdit on removalEdit.id = lr.lotEditId
        left join V3_CollectedItem ci on ci.id = l.collectedItemId or ci.id = li.collectedItemId
        where ci.id = '${collectedItemId}'
            and (li.id is not null or l.lotId is null) -- consider lot edits which only contain removals
            and (removalEdit.${timeWithBackticks} > l.${timeWithBackticks} or removalEdit.id is null)
        union
        select
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            lo.id as lotId,
            null as importId,
            null as importerId,
            null as importerName,
            l.id as listingId,
            l.price as initialPrice,
            lp.id as listingPriceId,
            lp.price,
            false as relisted,
            null as listingRemovalId,
            null as saleId,
            null as purchaserId,
            null as purchaserName,
            lp.time
        from V3_ListingPrice lp
        left join V3_Listing l on l.id = lp.listingId
        left join V3_ListingRemoval listR on listR.listingId = l.id and listR.${timeWithBackticks} < lp.${timeWithBackticks}
        left join V3_ListingPrice betweenPriceAndRemoval on betweenPriceAndRemoval.listingId = l.id and betweenPriceAndRemoval.${timeWithBackticks} < lp.${timeWithBackticks} and betweenPriceAndRemoval.${timeWithBackticks} > listR.${timeWithBackticks}
        left join V3_Lot lo on lo.id = l.lotId
        left join V3_LotEdit le on le.lotId = lo.id
        left join V3_LotInsert li on li.lotEditId = le.id
        left join V3_LotRemoval lr on lr.collectedItemId = li.collectedItemId or lr.bulkSplitId = li.bulkSplitId
        left join V3_LotEdit removalEdit on removalEdit.id = lr.lotEditId
        left join V3_CollectedItem ci on ci.id = l.collectedItemId or ci.id = li.collectedItemId
        where ci.id = '${collectedItemId}'
            and (li.id is not null or l.lotId is null) -- consider lot edits which only contain removals
            and (removalEdit.${timeWithBackticks} > lp.${timeWithBackticks} or removalEdit.id is null)
            and (betweenPriceAndRemoval.id is not null or listR.id is null)
        union
        select
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            lo.id as lotId,
            null as importId,
            null as importerId,
            null as importerName,
            l.id as listingId,
            l.price as initialPrice,
            lp.id as listingPriceId,
            lp.price,
            true as relisted,
            null as listingRemovalId,
            null as saleId,
            null as purchaserId,
            null as purchaserName,
            lp.time
        from V3_ListingPrice lp
        left join V3_Listing l on l.id = lp.listingId
        left join V3_ListingRemoval listR on listR.listingId = l.id and listR.${timeWithBackticks} < lp.${timeWithBackticks}
        left join V3_ListingPrice betweenPriceAndRemoval on betweenPriceAndRemoval.listingId = l.id and betweenPriceAndRemoval.${timeWithBackticks} < lp.${timeWithBackticks} and betweenPriceAndRemoval.${timeWithBackticks} > listR.${timeWithBackticks}
        left join V3_Lot lo on lo.id = l.lotId
        left join V3_LotEdit le on le.lotId = lo.id
        left join V3_LotInsert li on li.lotEditId = le.id
        left join V3_LotRemoval lr on lr.collectedItemId = li.collectedItemId or lr.bulkSplitId = li.bulkSplitId
        left join V3_LotEdit removalEdit on removalEdit.id = lr.lotEditId
        left join V3_CollectedItem ci on ci.id = l.collectedItemId or ci.id = li.collectedItemId
        where ci.id = '${collectedItemId}'
            and (li.id is not null or l.lotId is null) -- consider lot edits which only contain removals
            and (removalEdit.${timeWithBackticks} > lp.${timeWithBackticks} or removalEdit.id is null)
            and (betweenPriceAndRemoval.id is null and listR.id is not null)
        union
        select
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            lo.id as lotId,
            null as importId,
            null as importerId,
            null as importerName,
            listR.listingId as listingId,
            null as initialPrice,
            null as listingPriceId,
            null as price,
            false as relisted,
            listR.id as listingRemovalId,
            null as saleId,
            null as purchaserId,
            null as purchaserName,
            listR.time
        from V3_ListingRemoval listR
        left join V3_Listing l on l.id = listR.listingId
        left join V3_Lot lo on lo.id = l.lotId
        left join V3_LotEdit le on le.lotId = lo.id
        left join V3_LotInsert li on li.lotEditId = le.id
        left join V3_LotRemoval lr on lr.collectedItemId = li.collectedItemId or lr.bulkSplitId = li.bulkSplitId
        left join V3_LotEdit removalEdit on removalEdit.id = lr.lotEditId
        left join V3_CollectedItem ci on ci.id = l.collectedItemId or ci.id = li.collectedItemId
        where ci.id = '${collectedItemId}'
            and (li.id is not null or l.lotId is null) -- consider lot edits which only contain removals
            and (removalEdit.${timeWithBackticks} > listR.${timeWithBackticks} or removalEdit.id is null)
        union
        select
            null as lotEditId,
            null as lotInsertId,
            null as lotRemovalId,
            lo.id as lotId,
            null as importId,
            null as importerId,
            null as importerName,
            l.id as listingId,
            l.price as initialPrice,
            lp.id as listingPriceId,
            lp.price as price,
            false as relisted,
            null as listingRemovalId,
            s.id as saleId,
            s.purchaserId,
            u.user_name as purchaserName,
            s.time
        from V3_Sale s
        left join users u on u.user_id = s.purchaserId
        left join V3_Listing l on l.saleId = s.id
        left join V3_ListingPrice lp on lp.listingId = l.id and lp.${timeWithBackticks} < s.${timeWithBackticks}
        left join V3_ListingPrice laterPrices on laterPrices.listingId = l.id and laterPrices.${timeWithBackticks} > lp.${timeWithBackticks} and lp.${timeWithBackticks} < s.${timeWithBackticks}
        left join V3_Lot lo on lo.id = l.lotId
        left join V3_LotEdit le on le.lotId = lo.id
        left join V3_LotInsert li on li.lotEditId = le.id
        left join V3_LotRemoval lr on lr.collectedItemId = li.collectedItemId or lr.bulkSplitId = li.bulkSplitId
        left join V3_LotEdit removalEdit on removalEdit.id = lr.lotEditId
        left join V3_CollectedItem ci on ci.id = l.collectedItemId or ci.id = li.collectedItemId
        where ci.id = '${collectedItemId}'
            and (li.id is not null or l.lotId is null) -- consider lot edits which only contain removals
            and (removalEdit.${timeWithBackticks} > s.${timeWithBackticks} or removalEdit.id is null)
            and laterPrices.id is null
        order by time desc;
    `    
    // TODO add accepted offer price to sales
    const variables = []
    const req = { queryQueue: [{ query: query, variables }] }
    const res = {}
    try {
        let portfolio
        await executeQueries(req, res, (err) => {
            if (err) throw new Error(err)
            portfolio = req.results
        })
        return portfolio
    } catch (err) {
        throw err
    }

    
    next()
}

module.exports = {
     selectForLot, 
     selectForBulkSplit, 
     selectForCollectedItem, 
     getByLotId, 
     getByCollectedItemId,
     getByCollectedCardIdNew
}




// import
    // item, lot, or split
// gift
    // to or from
    // item, lot, or split
// sale
    // purchaser or seller
    // item, lot, or split
// listing
    // must be in ownership
    // 
// listing price updated to
// listing removed
// sold for 
// gifted to
//
// lot gifted
// lot purchased for
// added to lot
// added to lot listed for
// removed from lot
// lot listed for
// lot listing price updated to
// lot listing removed
// lot sold for
// lot gifted to

// every transaction type
// import - has to occur before all other transactions
// sale - has to occur after listing, and before listing has sold or has been removed
// gift - 
// lot edit
    // insert - lot must be in ownership, cannot occur if already inserted, or item is currently listed
    // removal - lot must be in ownership, cannot occur if already removed or never inserted
// listing - cannot occur if item is within lot. Item/lot must be in ownership
// listing price, must occur after listing created, cannot occur after listing sold
// listing removal, must occur after insertion, cannot occur if already sold



// lot edit edgecases
// lotId    giftId  editId  time    recipient
// 1        1               11      htmx
// 1                1       12       
// 1        2               13      frok
// 1        3               14      htmx
// 1                1       15       
// 1        4               16      tyles

const revisedUserLotEdits = `
    SELECT
		u.user_name,
		i.id as importId,
        i.time as importTime,
        prevSale.id as saleId,
        prevSale.time as saleTime,
		le.id as lotEditId,
        le.time as lotEditTime,
        COALESCE(li.collectedItemId, lr.collectedItemId) as collectedItemId,
        COALESCE(li.bulkSplitId, lr.bulkSplitId) as bulkSplitId,
        COALESCE(prevSale.purchaserId, prevGift.recipientId, i.importerId) AS ownerId,
        le.lotId
	FROM V3_LotEdit le
    LEFT JOIN V3_LotInsert li on li.lotEditId = le.id
    LEFT JOIN V3_LotInsert betweenInsert on betweenInsert.lotEditId = le.id AND betweenInsert.id > li.id
    LEFT JOIN V3_LotRemoval lr on lr.lotEditId = le.id AND li.id IS NULL
    LEFT JOIN V3_LotRemoval betweenRemoval on betweenRemoval.lotEditId = le.id AND betweenRemoval.id > lr.id
    LEFT JOIN V3_LotInsert otherLotInsert 
		ON otherLotInsert.collectedItemId = li.collectedItemId 
        OR otherLotInsert.collectedItemId = lr.collectedItemId
        OR otherLotInsert.bulkSplitId = li.bulkSplitId
        OR otherLotInsert.bulkSplitId = lr.bulkSplitId
	LEFT JOIN V3_LotEdit prevLotEdit 
        ON prevLotEdit.time < le.time
        AND prevLotEdit.id = otherLotInsert.lotEditId
    LEFT JOIN V3_Listing prevListing
		ON prevListing.time < le.time
		AND prevListing.saleId IS NOT NULL
        AND (
			prevListing.collectedItemId = li.collectedItemId
			OR prevListing.collectedItemId = lr.collectedItemId
			OR prevListing.bulkSplitId = li.bulkSplitId
			OR prevListing.bulkSplitId = lr.bulkSplitId
			OR prevListing.lotId = le.lotId
			OR prevListing.lotId = prevLotEdit.lotId
        )
	LEFT JOIN V3_Sale prevSale
        ON prevSale.id = prevListing.saleId
        AND prevSale.time < le.time
	LEFT JOIN V3_Sale saleBetween
		ON saleBetween.id = prevListing.saleId
        AND saleBetween.time < le.time AND saleBetween.time > prevSale.time
	LEFT JOIN V3_Gift prevGift
		ON prevGift.time < le.time
        AND prevGift.time > prevSale.time
        AND (
			prevGift.collectedItemId = li.collectedItemId
			OR prevGift.collectedItemId = lr.collectedItemId
			OR prevGift.bulkSplitId = li.bulkSplitId
			OR prevGift.bulkSplitId = lr.bulkSplitId
			OR prevGift.lotId = le.lotId
			OR prevGift.lotId = prevLotEdit.lotId
        )
	LEFT JOIN V3_Gift giftBetween
		ON (
			giftBetween.collectedItemId = li.collectedItemId
			OR giftBetween.collectedItemId = lr.collectedItemId
			OR giftBetween.bulkSplitId = li.bulkSplitId
			OR giftBetween.bulkSplitId = lr.bulkSplitId
			OR giftBetween.lotId = le.lotId
			OR giftBetween.lotId = prevLotEdit.lotId
        ) AND giftBetween.time < le.time 
        AND giftBetween.time > prevGift.time
	LEFT JOIN V3_Import i
		ON (
            i.collectedItemId = li.collectedItemId 
            OR i.collectedItemId = lr.collectedItemId
            OR i.bulkSplitId = li.bulkSplitId
            OR i.bulkSplitId = lr.bulkSplitId
        ) AND prevSale.id IS NULL 
        AND prevGift.id IS NULL
	LEFT JOIN users u on (
		u.user_id = prevSale.purchaserId
        OR u.user_id =  prevGift.recipientId
        OR u.user_id =  i.importerId
    )
    WHERE (
		(li.id IS NOT NULL AND betweenInsert.id IS NULL) 
        OR (li.id IS NULL AND betweenRemoval.id IS NULL)
	) AND saleBetween.id IS NULL 
    AND giftBetween.id IS NULL
    AND (
		prevSale.purchaserId = '86e099e9-3952-46fd-b65e-99fd57c7422f' 
        OR prevGift.recipientId = '86e099e9-3952-46fd-b65e-99fd57c7422f' 
        OR i.importerId = '86e099e9-3952-46fd-b65e-99fd57c7422f'
    );
`


const newQuery = `
    SELECT
        i.id as importId,
        null as saleId,
        null as giftId,
        null as listingId,
        null as listingPriceId,
        null as listingRemovalId,
        null as relistingId
    FROM V3_Import i
    WHERE i.importerId = ''
    UNION
    SELECT
        null as importId,
        s.id as saleId,
        null as giftId,
        null as listingId,
        null as listingPriceId,
        null as listingRemovalId,
        null as relistingId
    FROM V3_Sale s
    WHERE s.purchaserId = ''
        OR prevImporterId = '' OR prevPurchaserId = '' OR prevRecipientId = ''
    UNION
    SELECT
        null as importId,
        null as saleId,
        g.id as giftId,
        null as listingId,
        null as listingPriceId,
        null as listingRemovalId,
        null as relistingId
    FROM V3_Gift g
    WHERE g.recipientId = ''
        OR prevImporterId = '' OR prevPurchaserId = '' OR prevRecipientId = ''
    UNION
    SELECT
        null as importId,
        null as saleId,
        g.id as giftId,

        null as listingId,
        null as listingPriceId,
        null as listingRemovalId,
        null as relistingId
    FROM V3_LotEdit le
    UNION
    SELECT
        null as importId,
        null as saleId,
        null as giftId,
        l.id as listingId,
        null as listingPriceId,
        null as listingRemovalId,
        null as relistingId
    FROM V3_Listing l
    WHERE prevImporterId = '' OR prevPurchaserId = '' OR prevRecipientId = ''
    UNION
    SELECT
        null as importId,
        null as saleId,
        null as giftId,
        l.id as listingId,
        lp.id as listingPriceId,
        null as listingRemovalId,
        null as relistingId
    FROM V3_ListingPrice lp
    WHERE prevImporterId = '' OR prevPurchaserId = '' OR prevRecipientId = ''
    UNION
    SELECT
        null as importId,
        null as saleId,
        null as giftId,
        l.id as listingId,
        null as listingPriceId,
        listR.id as listingRemovalId,
        null as relistingId
    FROM V3_ListingRemoval listR
    WHERE prevImporterId = '' OR prevPurchaserId = '' OR prevRecipientId = ''
    UNION
    SELECT
        null as importId,
        null as saleId,
        null as giftId,
        l.id as listingId,
        lp.id as listingPriceId,
        null as listingRemovalId,
        relisting.id as relistingId
    FROM V3_ListingPrice relisting
    WHERE prevImporterId = '' OR prevPurchaserId = '' OR prevRecipientId = ''
    ; 
`

// FILTER BY
// collectedItemId
// saleId, giftId, etc.
// watched listings (listings where saleId is null, and watching is true)
// listingId (initial listing, price change, removal, relisting, lot update, lot update, sale)
// lotId (purchased, lot insert, lot removal, lot listed, lot removal, listing price change, lot sold)
// giftId (plain and simple? composition of lot at time of sale)