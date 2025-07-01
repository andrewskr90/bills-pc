const { executeQueries } = require("../db")

const selectById = async (id, userId, reqQuery) => {
    let query = `
        select
            lo.id,
            creditSale.id acquisitionSaleId,
            creditSale.time acquisitionSaleTime,
            (CASE WHEN IFNULL(firstEverEdit.id, FALSE)
                THEN firstEverEdit.id
                ELSE NULL
            END) as creationEditId,
            (CASE WHEN IFNULL(firstEverEdit.id, FALSE)
                THEN firstEverEdit.time
                ELSE NULL
            END) as creationTime,
            debitSale.id nextSaleId,
            debitSale.time nextSaleTime,
            insertEdit.id lotEditId,
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
        from V3_Lot lo
        left join V3_Listing creditListing
            on creditListing.lotId = lo.id
        left join V3_Sale creditSale
            on creditSale.id = creditListing.saleId
        left join V3_Sale laterCreditSale
            on laterCreditSale.id = creditListing.saleId
            and laterCreditSale.time > creditSale.time
        -- if sale is null, user created it, this is the credit transactions1
        left join V3_LotEdit firstEverEdit
            on firstEverEdit.lotId = lo.id
        left join V3_LotEdit beforeFirstEverEdit
            on beforeFirstEverEdit.lotId = lo.id
            and beforeFirstEverEdit.time < firstEverEdit.time
        -- DEBIT --
        -- debit transaction
        left join (
            select
                s.id,
                s.time,
                l.collectedItemId,
                l.lotId
            from V3_Listing l
            left join V3_Sale s on s.id = l.saleId
            left join V3_ListingRemoval listR
                on s.id is null and listR.listingId = l.id
            left join V3_ListingRemoval laterListR
                on laterListR.listingId = listR.listingId and laterListR.time > listR.time
            left join V3_ListingPrice listPr
                on listPr.listingId = l.id
            left join V3_ListingPrice laterListPr
                on laterListPr.listingId = listPr.listingId and laterListPr.time > listPr.time
            where laterListR.id is null
                and laterListPr.id is null
        ) debitSale
            on (
                -- lot same lot
                (debitSale.lotId = creditListing.lotId and debitSale.time > creditSale.time)
            )
        left join (
            select
                s.id,
                s.time,
                l.collectedItemId,
                l.lotId
            from V3_Listing l
            left join V3_Sale s on s.id = l.saleId
            left join V3_ListingRemoval listR
                on s.id is null and listR.listingId = l.id
            left join V3_ListingRemoval laterListR
                on laterListR.listingId = listR.listingId and laterListR.time > listR.time
            left join V3_ListingPrice listPr
                on listPr.listingId = l.id
            left join V3_ListingPrice laterListPr
                on laterListPr.listingId = listPr.listingId and laterListPr.time > listPr.time
            where laterListR.id is null
                and laterListPr.id is null
        ) beforeDebitSale
            on (
                -- lot same lot
                (beforeDebitSale.lotId = creditListing.lotId and beforeDebitSale.time > creditSale.time)
            ) and beforeDebitSale.time < debitSale.time
        -- -- if debitSale is null, figure out the current state of the item
        left join (
            select
                l.id,
                l.time,
                l.collectedItemId,
                l.lotId,
                s.id saleId,
                s.time saleTime,
                listR.id listingRemovalId,
                listR.time listingRemovalTime,
                listPr.id listingPriceId,
                listPr.time listingPriceTime
            from V3_Listing l
            left join V3_Sale s on s.id = l.saleId
            left join V3_ListingRemoval listR
                on s.id is null and listR.listingId = l.id
            left join V3_ListingRemoval laterListR
                on laterListR.listingId = listR.listingId and laterListR.time > listR.time
            left join V3_ListingPrice listPr
                on listPr.listingId = l.id
            left join V3_ListingPrice laterListPr
                on laterListPr.listingId = listPr.listingId and laterListPr.time > listPr.time
            where laterListR.id is null
                and laterListPr.id is null
        ) debitListing
            on (
                -- lot same lot
                (debitListing.lotId = creditListing.lotId and debitListing.time > creditSale.time)
            )
        left join (
            select
                l.id,
                l.time,
                l.collectedItemId,
                l.lotId,
                s.id saleId,
                s.time saleTime,
                listR.id listingRemovalId,
                listR.time listingRemovalTime,
                listPr.id listingPriceId,
                listPr.time listingPriceTime
            from V3_Listing l
            left join V3_Sale s on s.id = l.saleId
            left join V3_ListingRemoval listR
                on s.id is null and listR.listingId = l.id
            left join V3_ListingRemoval laterListR
                on laterListR.listingId = listR.listingId and laterListR.time > listR.time
            left join V3_ListingPrice listPr
                on listPr.listingId = l.id
            left join V3_ListingPrice laterListPr
                on laterListPr.listingId = listPr.listingId and laterListPr.time > listPr.time
            where laterListR.id is null
                and laterListPr.id is null
        ) laterDebitListing
            on (
                -- lot same lot
                (laterDebitListing.lotId = creditListing.lotId and laterDebitListing.time > creditSale.time)
            ) and laterDebitListing.time > debitListing.time
            and debitSale.id is null -- important
        -- build lot
        left join V3_LotEdit insertEdit
            on insertEdit.lotId = lo.id
        left join V3_LotInsert li
            on li.lotEditId = insertEdit.id
        left join V3_LotRemoval lr
            on lr.collectedItemId = li.collectedItemid
        left join V3_LotEdit removeEdit
            on removeEdit.lotId = lo.id
            and removeEdit.id = lr.lotEditId
            and removeEdit.time > insertEdit.time
        left join V3_LotEdit earlierRemoveEdit
            on earlierRemoveEdit.lotId = lo.id
            and earlierRemoveEdit.id = lr.lotEditId
            and removeEdit.time > insertEdit.time
        left join V3_CollectedItem ci
            on ci.id = li.collectedItemId
        left join Item it on it.id = ci.itemId
        left join sets_v2 s on s.set_v2_id = it.setId
        left join printings p on p.printing_id = ci.printingId
        left join V3_Appraisal a on a.collectedItemId = ci.id
        left join V3_Appraisal laterA 
            on laterA.collectedItemId = ci.id
            and laterA.time > a.time
        left join V3_CollectedItemNote cin
            on cin.collectedItemId = ci.id
        left join conditions c on c.condition_id = a.conditionId
        left join SKU on SKU.itemId = it.id and SKU.conditionId = c.condition_id and SKU.printingId = p.printing_id
        where (creditSale.purchaserId = '${userId}' OR creditSale.id IS NULL)
            and lo.id = '${id}'
            and beforeFirstEverEdit.id is null
            and laterCreditSale.id IS NULL
            and beforeDebitSale.id is null
            and laterDebitListing.id is null
            and (removeEdit.id is null or earlierRemoveEdit.id is null)
            and li.id is not null
            and laterA.id is null
            and cin.id is null
    `
    const variables = []
    const direction = reqQuery.direction ? reqQuery.direction.toLowerCase() : undefined 
    // const attribute = reqQuery.attribute ? reqQuery.attribute.toLowerCase() : undefined
    let orderBy =  ' ORDER BY setName'
    if (direction && direction.toLowerCase() === 'desc') orderBy += ' DESC'
    else orderBy += ' ASC'
    orderBy += ', name'
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