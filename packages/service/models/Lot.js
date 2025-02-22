const { executeQueries } = require("../db")

const selectById = async (id, userId, reqQuery) => {
    let query = `
        select
            lo.id,
            latestPurchase.id acquisitionSaleId,
            latestPurchase.time acquisitionSaleTime,
            latestGift.id acquisitionGiftId,
            latestGift.time acquisitionGiftTime,
            (CASE WHEN IFNULL(i.id, FALSE)
                THEN firstEdit.id
                ELSE NULL
            END) as creationEditId,
            (CASE WHEN IFNULL(i.id, FALSE)
                THEN firstEdit.time
                ELSE NULL
            END) as creationTime,
            nextSale.id nextSaleId,
            nextSale.time nextSaleTime,
            le.id lotEditId,
            ci.id collectedItemId,
            ci.printingId,
            p.printing_name printingName,
            it.id itemId,
            it.tcgpId,
            it.name,
            s.set_v2_name setName,
            a.id appraisalId,
            a.conditionId,
            c.condition_name conditionName,
            count(*) OVER () as count
        from users u
        LEFT JOIN V3_Sale latestPurchase
            ON latestPurchase.purchaserId = u.user_id
        LEFT JOIN V3_Listing l
            ON l.saleId = latestPurchase.id
        LEFT JOIN V3_Sale afterLatestPurchase
            ON afterLatestPurchase.id = l.saleId
            AND afterLatestPurchase.time > latestPurchase.time
        LEFT JOIN V3_Gift latestGift
            ON latestGift.recipientId = u.user_id
            AND latestGift.lotId = l.lotId
            AND latestGift.time > latestPurchase.time
        LEFT JOIN V3_Gift afterLatestGift
            ON afterLatestGift.lotId = latestGift.lotId
            AND afterLatestGift.time > latestGift.time
        LEFT JOIN V3_Import i
            ON i.importerId = u.user_id
        LEFT JOIN V3_LotInsert firstInsert
            ON firstInsert.collectedItemId = i.collectedItemId
        LEFT JOIN V3_LotInsert beforeFirstInsert
            ON beforeFirstInsert.lotEditId = firstInsert.lotEditId
            AND beforeFirstInsert.id < firstInsert.id
        -- TODO what if there areonly bulk splits
        LEFT JOIN V3_LotEdit firstEdit
            ON firstEdit.id = firstInsert.lotEditID
        LEFT JOIN V3_LotEdit beforeFirstEdit
            ON beforeFirstEdit.lotId = firstEdit.lotId
            AND beforeFirstEdit.time < firstEdit.time
        LEFT JOIN V3_Lot lo
            ON lo.id = l.lotId
            OR lo.id = latestGift.lotId
            OR lo.id = firstEdit.lotId
            
        LEFT JOIN V3_Sale nextSale
            ON nextSale.id = l.saleId
            AND (
                -- prev was purchase
                (latestGift.id IS NULL AND i.id IS NULL AND nextSale.time > latestPurchase.time)
                -- prev was gift
                OR (latestGift.id IS NOT NULL AND nextSale.time > latestGift.time)
                -- prev was import
                OR (i.id IS NOT NULL AND nextSale.time > i.time)
            )
        LEFT JOIN V3_Sale betweenAcquisitionAndNextSale
            ON betweenAcquisitionAndNextSale.id = l.saleId
            AND (
                -- prev was purchase
                (
                    latestGift.id IS NULL 
                    AND i.id IS NULL 
                    AND betweenAcquisitionAndNextSale.time > latestPurchase.time
                    AND betweenAcquisitionAndNextSale.time < nextSale.time
                )
                -- prev was gift
                OR (
                    latestGift.id IS NOT NULL 
                    AND betweenAcquisitionAndNextSale.time > latestGift.time
                    AND betweenAcquisitionAndNextSale.time < nextSale.time
                )
                -- prev was import
                OR (
                    i.id IS NOT NULL 
                    AND betweenAcquisitionAndNextSale.time > i.time
                    AND betweenAcquisitionAndNextSale.time < nextSale.time
                )
            )
        LEFT JOIN V3_Gift nextGift
            ON nextGift.lotId = lo.id
            AND nextGift.time < nextSale.time
            AND (
                nextGift.time > latestGift.time
                AND nextGift.time > latestPurchase.time
            )
        LEFT JOIN V3_Gift betweenAcquisitionAndNextGift
            ON betweenAcquisitionAndNextGift.lotId = lo.id
            AND betweenAcquisitionAndNextGift.time < nextGift.time
            AND betweenAcquisitionAndNextGift.time > latestPurchase.time
            AND betweenAcquisitionAndNextGift.time > latestGift.time
        -- edits before latestTransfer
        LEFT JOIN V3_LotEdit le
            ON le.lotId = lo.id
            AND (
                -- edits up until sold
                (
                    nextGift.id IS NULL AND nextSale.id IS NOT NULL
                    AND le.time < nextSale.time
                )
                -- edits up until gifted away
                OR (
                    nextGift.id IS NOT NULL
                    AND le.time < nextGift.time
                )
                -- all edits
                OR (
                    nextSale.id IS NULL AND nextGift.id IS NULL
                )
            )
        LEFT JOIN V3_LotInsert li on li.lotEditId = le.id
        LEFT JOIN V3_LotRemoval lr 
            ON lr.collectedItemId = li.collectedItemId
            AND (
                lr.collectedItemId = li.collectedItemId
                OR lr.bulkSplitId = li.bulkSplitId
            )
        LEFT JOIN V3_LotEdit leRemovalAfter 
            ON leRemovalAfter.lotId = le.lotId 
            AND leRemovalAfter.id = lr.lotEditId
            AND (
                -- edits up until sold
                (
                    nextGift.id IS NULL AND nextSale.id IS NOT NULL
                    AND leRemovalAfter.time < nextSale.time
                    AND leRemovalAfter.time > le.time
                )
                -- edits up until gifted away
                OR (
                    nextGift.id IS NOT NULL
                    AND leRemovalAfter.time < nextGift.time
                    AND leRemovalAfter.time > le.time
                )
                -- all edits
                OR (
                    nextSale.id IS NULL AND nextGift.id IS NULL
                    AND leRemovalAfter.time > le.time
                )
            )
        -- item info
        LEFT JOIN V3_CollectedItem ci
            ON ci.id = li.collectedItemId
        LEFT JOIN V3_BulkSplit bs
            ON bs.id = li.bulkSplitId
        LEFT JOIN Item it
            ON it.id = ci.itemId
        LEFT JOIN sets_v2 s
            ON s.set_v2_id = it.setId
        LEFT JOIN V3_Appraisal a
            ON a.collectedItemId = ci.id
        LEFT JOIN V3_Appraisal afterAppraisal
            ON afterAppraisal.collectedItemId = ci.id
            AND afterAppraisal.time > a.time
        LEFT JOIN conditions c
            ON c.condition_id = a.conditionId
        LEFT JOIN printings p
            ON p.printing_id = ci.printingId
        -- giftGiver and saleSeller for lot
        WHERE (
                u.user_id = '${userId}'
                OR u.proxyCreatorId = '${userId}'
            ) AND lo.id = '${id}'
            AND afterLatestPurchase.id IS NULL
            AND afterLatestGift.id IS NULL
            AND beforeFirstEdit.id IS NULL
            AND beforeFirstInsert.id IS NULL
    `
    const variables = []
    const direction = reqQuery.direction ? reqQuery.direction.toLowerCase() : undefined 
    // const attribute = reqQuery.attribute ? reqQuery.attribute.toLowerCase() : undefined
    let orderBy =  ' ORDER BY name'
    if (direction && direction.toLowerCase() === 'desc') orderBy += ' DESC'
    else orderBy += ' ASC'

    query += orderBy

    const pageInt = parseInt(reqQuery.page)
    if (pageInt && pageInt > 0) {
        variables.push((pageInt-1)*20)
        query += ` LIMIT ?,20`
    } else {
        query += ` LIMIT 0,20;`
    }


    const req = { queryQueue: [{ query, variables }] }
    const res = {}
    let lotItems
    await executeQueries(req, res, (err) => {
        if (err) throw err
        lotItems = req.results
    })
    return lotItems
}

module.exports = { selectById }