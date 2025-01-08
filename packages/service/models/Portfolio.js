const { executeQueries } = require("../db")
const { parseThenFormatLabels } = require("../middleware/collected-item-middleware")

const timeWithBackticks = '`time`'


const getItemsByUserId = async (userId, reqQuery) => {
    if (!userId) throw new Error(`Error: User Id required to query for collected items`)

    let query = `select 
        ci.id as collectedItemId,
        bs.id as bulkSplitId,
        i.id as itemId,
        i.name,
        i.tcgpId,
        s.set_v2_name as setName,
        le.lotId,
        le.id as lotEditId,
        li.id as lotInsertId,
        lr.id as lotRemovalId,
        purchase.id as purchaseId,
        purchase.${timeWithBackticks} as purchaseTime,
        l.price as initialPrice,
        lp.price as purchasePrice,
        o.amount as acceptedOfferPrice,
        ${reqQuery.itemId ? '' : `COUNT(ci.id) as quantity,`}
        count(*) OVER () as count
    from V3_Listing l
    left join V3_ListingPrice lp on lp.listingId = l.id
    left join V3_ListingPrice succeedingPrice on succeedingPrice.listingId = l.id and succeedingPrice.${timeWithBackticks} > lp.${timeWithBackticks}
    left join V3_Offer o on o.id = l.offerId
    left join V3_Sale purchase on purchase.id = l.saleId
    left join V3_Lot lo on lo.id = l.lotId
    left join V3_LotEdit le on le.lotId = lo.id
    left join V3_LotInsert li on li.lotEditId = le.id
    left join V3_LotRemoval lr on lr.collectedItemId = li.collectedItemId or lr.bulkSplitId = li.bulkSplitId
    left join V3_LotEdit removalEdit on removalEdit.id = lr.lotEditId
    left join V3_CollectedItem ci on ci.id = li.collectedItemId or ci.id = l.collectedItemId
    left join V3_BulkSplit bs on bs.id = li.bulkSplitId or bs.id = l.bulkSplitId
    left join Item i on i.id = ci.itemId
    left join sets_v2 s on s.set_v2_id = i.setId
    where purchase.purchaserId = ?
        and (li.id is not null or l.lotId is null) -- consider lot edits which only contain removals
        and (removalEdit.${timeWithBackticks} > purchase.${timeWithBackticks} or removalEdit.id is null)
        and succeedingPrice.id is null
    `

    let additionalWhere = ''

    if (reqQuery.searchvalue) {
        additionalWhere += ` AND i.name LIKE '%${reqQuery.searchvalue}%'`
    } else if (reqQuery.itemId) {
        additionalWhere += ` AND i.id = '${reqQuery.itemId}'`
    }

    const direction = reqQuery.direction ? reqQuery.direction.toLowerCase() : undefined 
    // const attribute = reqQuery.attribute ? reqQuery.attribute.toLowerCase() : undefined
    let orderBy =  ' ORDER BY name'
    if (direction && direction.toLowerCase() === 'desc') orderBy += ' DESC'
    else orderBy += ' ASC'
    let groupBy = ''
    if (!reqQuery.itemId) groupBy += ` group by i.id, bs.id`

    query += additionalWhere
    query += groupBy
    query += orderBy


    const variables = []
    variables.push(userId)

    const pageInt = parseInt(reqQuery.page)
    if (pageInt && pageInt > 0) {
        variables.push((pageInt-1)*20)
        query += ` LIMIT ?,20`
    } else {
        query += ` LIMIT 0,20;`
    }
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
}

const getBulkSplitsByUserId = async (userId) => {
    if (!userId) throw new Error(`Error: User Id required to query for `)

    let query = `
        SELECT 
            bs1.id as bulkSplitId,
            GROUP_CONCAT(bsl.labelComponents SEPARATOR ',') as labels,
            count(*) OVER () as count
        FROM V3_BulkSplit bs1
        LEFT JOIN (
            SELECT
                bsl.id as bulkSplitLabelId,
                bsl.bulkSplitId,
                GROUP_CONCAT(
                    JSON_ARRAY(
                        '[', 
                        IFNULL(la.id, 'NULL'), ',',
                        IFNULL(lc.id, 'NULL'), ',',
                        IFNULL(lc.rarityId, 'NULL'), ',',
                        IFNULL(lc.typeId, 'NULL'), ',',
                        IFNULL(lc.printingid, 'NULL'), ',',
                        IFNULL(lc.setId, 'NULL'),
                        ']'
                    ) SEPARATOR ','
                ) as labelComponents
            FROM V3_BulkSplitLabel bsl
            LEFT JOIN V3_Label la on la.id = bsl.labelId
            LEFT JOIN V3_LabelComponent lc on lc.labelId = la.id
            GROUP BY bsl.bulkSplitId
        ) bsl on bsl.bulkSplitId = bs1.id
        WHERE bs1.id in (
            -- bought bulk split
            SELECT 
                bs2.id 
            from V3_Listing l1
            right JOIN V3_BulkSplit bs2 on bs2.id = l1.bulkSplitId
            right JOIN V3_Sale s1 on s1.id = l1.saleId
            WHERE s1.id is not null
            and bs2.id = bs1.id
            and s1.purchaserId = ?
            and (
                bs2.id not in ( -- that is not sold afterward as a lone item
                    select 
                        bs3.id 
                    from V3_Listing l2
                    right JOIN V3_BulkSplit bs3 on bs3.id = l2.bulkSplitId
                    right JOIN V3_Sale s2 on s2.id = l2.saleId
                    where s2.id is not null
                    and bs3.id = bs2.id
                    and s2.${timeWithBackticks} > s1.${timeWithBackticks}
                ) or bs2.id not in ( -- and that is not in a lot that is sold afterward
                    select 
                        bs3.id 
                    from V3_Listing l2
                    right join V3_Lot lo1 on lo1.id = l2.lotId
                    right join V3_LotEdit le1 on le1.lotId = lo1.id
                    right join V3_LotInsert li1 on li1.lotEditId = le1.id
                    right join V3_BulkSplit bs3 on bs3.id = li1.bulkSplitId
                    right join V3_Sale s2 on s2.id = l2.saleId
                    where s2.id is not null
                    and bs3.id = bs2.id
                    and s2.${timeWithBackticks} > s1.${timeWithBackticks}
                    and bs3.id not in ( -- a lot which it was not removed from
                        select 
                            lr1.bulkSplitId id 
                        from V3_LotEdit le2
                        right join V3_LotRemoval lr1 on lr1.lotEditId = le2.id
                        where le2.lotId = le1.lotId
                        and lr1.bulkSplitId = bs3.id
                        and le2.${timeWithBackticks} > le1.${timeWithBackticks}
                        and le2.${timeWithBackticks} < s2.${timeWithBackticks}
                    )
                ) -- TODO or not in a bulk sort that takes place afterward
            )
        ) or bs1.id in ( -- bought within a lot
            select 
                bs2.id 
            from V3_Listing l1
            right join V3_Lot lo1 on lo1.id = l1.lotId
            right join V3_LotEdit le1 on le1.lotId = lo1.id
            right join V3_LotInsert li1 on li1.lotEditId = le1.id
            right join V3_BulkSplit bs2 on bs2.id = li1.bulkSplitId
            right join V3_Sale s1 on s1.id = l1.saleId
            where s1.id is not null
            and bs2.id = bs1.id
            and bs2.id not in ( -- which was not removed
                select 
                    lr1.bulkSplitId id 
                from V3_LotEdit le2
                right join V3_LotRemoval lr1 on lr1.lotEditId = le2.id
                where le2.lotId = le1.lotId
                and lr1.bulkSplitId = bs2.id
                and le1.${timeWithBackticks} < s1.${timeWithBackticks}
            ) and (
                bs2.id not in ( -- that is not sold afterward as lone item
                    select 
                        bs3.id 
                    from V3_Listing l2
                    right JOIN V3_BulkSplit bs3 on bs3.id = l2.bulkSplitId
                    right JOIN V3_Sale s2 on s2.id = l2.saleId
                    where s2.id is not null
                    and bs3.id = bs2.id
                    and s2.${timeWithBackticks} > s1.${timeWithBackticks}
                ) or bs2.id not in ( -- and not in a lot that was sold afterwards
                    select 
                        bs3.id 
                    from V3_Listing l2
                    right join V3_Lot lo1 on lo1.id = l2.lotId
                    right join V3_LotEdit le1 on le1.lotId = lo1.id
                    right join V3_LotInsert li1 on li1.lotEditId = le1.id
                    right join V3_BulkSplit bs3 on bs3.id = li1.bulkSplitId
                    right join V3_Sale s2 on s2.id = l2.saleId
                    where s2.id is not null
                    and bs3.id = bs2.id
                    and s2.${timeWithBackticks} > s1.${timeWithBackticks}
                    and bs3.id not in ( -- was not removed before this lot was sold
                        select 
                            lr1.bulkSplitId id 
                        from V3_LotEdit le2
                        right join V3_LotRemoval lr1 on lr1.lotEditId = le2.id
                        where le2.lotId = le1.lotId
                        and lr1.bulkSplitId = bs3.id
                        and le2.${timeWithBackticks} > le1.${timeWithBackticks}
                        and le2.${timeWithBackticks} < s2.${timeWithBackticks}
                    )
                ) -- TODO or not in a bulk sort that takes place afterward
            )
        )
        GROUP BY bs1.id
        ;
    `
    const req = { queryQueue: [{ query, variables: [userId] }] }
    const res = {}
    try {
        let portfolioBulkSplits
        await executeQueries(req, res, (err) => {
            if (err) throw new Error(err)
            portfolioBulkSplits = req.results
        })
        return portfolioBulkSplits.map(bulkSplit => ({
            ...bulkSplit,
            labels: bulkSplit.labels ? parseThenFormatLabels(bulkSplit.labels) : null
        }))
    } catch (err) {
        throw err
    }
}

module.exports = { getItemsByUserId, getBulkSplitsByUserId }
