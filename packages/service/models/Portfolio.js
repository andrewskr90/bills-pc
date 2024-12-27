const { executeQueries } = require("../db")
const { parseThenFormatLabels } = require("../middleware/collected-item-middleware")

const timeWithBackticks = '`time`'


const getItemsByUserId = async (userId, reqQuery) => {
    if (!userId) throw new Error(`Error: User Id required to query for `)

    let query = `
        select 
            ci1.id as collectedItemId,
            ci1.printingId,
            i.id as itemId,
            i.name,
            i.tcgpId
        from V3_CollectedItem ci1
        LEFT JOIN Item i on i.id = ci1.itemId
        WHERE (
            ci1.id in (
                -- bought item
                SELECT 
                    ci2.id 
                from V3_Listing l1
                right JOIN V3_CollectedItem ci2 on ci2.id = l1.collectedItemId
                right JOIN V3_Sale s1 on s1.id = l1.saleId
                WHERE s1.id is not null
                and ci2.id = ci1.id
                and s1.purchaserId = ?
                and (
                    ci2.id not in ( -- that is not sold afterward as a lone item
                        select 
                            ci3.id 
                        from V3_Listing l2
                        right JOIN V3_CollectedItem ci3 on ci3.id = l2.collectedItemId
                        right JOIN V3_Sale s2 on s2.id = l2.saleId
                        where s2.id is not null
                        and ci3.id = ci2.id
                        and s2.${timeWithBackticks} > s1.${timeWithBackticks}
                    ) or ci2.id not in ( -- and that is not in a lot that is sold afterward
                        select 
                            ci3.id 
                        from V3_Listing l2
                        right join V3_Lot lo1 on lo1.id = l2.lotId
                        right join V3_LotEdit le1 on le1.lotId = lo1.id
                        right join V3_LotInsert li1 on li1.lotEditId = le1.id
                        right join V3_CollectedItem ci3 on ci3.id = li1.collectedItemId
                        right join V3_Sale s2 on s2.id = l2.saleId
                        where s2.id is not null
                        and ci3.id = ci2.id
                        and s2.${timeWithBackticks} > s1.${timeWithBackticks}
                        and ci3.id not in ( -- a lot which it was not removed from
                            select 
                                lr1.collectedItemId id 
                            from V3_LotEdit le2
                            right join V3_LotRemoval lr1 on lr1.lotEditId = le2.id
                            where le2.lotId = le1.lotId
                            and lr1.collectedItemId = ci3.id
                            and le2.${timeWithBackticks} > le1.${timeWithBackticks}
                            and le2.${timeWithBackticks} < s2.${timeWithBackticks}
                        )
                    )
                )
            ) or ci1.id in ( -- bought within a lot
                select 
                    ci2.id 
                from V3_Listing l1
                right join V3_Lot lo1 on lo1.id = l1.lotId
                right join V3_LotEdit le1 on le1.lotId = lo1.id
                right join V3_LotInsert li1 on li1.lotEditId = le1.id
                right join V3_CollectedItem ci2 on ci2.id = li1.collectedItemId
                right join V3_Sale s1 on s1.id = l1.saleId
                where s1.id is not null
                and ci2.id = ci1.id
                and ci2.id not in ( -- which was not removed from lot before lot was purchased
                    select 
                        lr1.collectedItemId id 
                    from V3_LotEdit le2
                    right join V3_LotRemoval lr1 on lr1.lotEditId = le2.id
                    where le2.lotId = le1.lotId
                    and lr1.collectedItemId = ci2.id
                    and le1.${timeWithBackticks} < s1.${timeWithBackticks}
                ) and (
                    ci2.id not in ( -- that is not sold afterward as lone item
                        select 
                            ci3.id 
                        from V3_Listing l2
                        right JOIN V3_CollectedItem ci3 on ci3.id = l2.collectedItemId
                        right JOIN V3_Sale s2 on s2.id = l2.saleId
                        where s2.id is not null
                        and ci3.id = ci2.id
                        and s2.${timeWithBackticks} > s1.${timeWithBackticks}
                    ) or ci2.id not in ( -- and not in a lot that was sold afterwards
                        select 
                            ci3.id 
                        from V3_Listing l2
                        right join V3_Lot lo1 on lo1.id = l2.lotId
                        right join V3_LotEdit le1 on le1.lotId = lo1.id
                        right join V3_LotInsert li1 on li1.lotEditId = le1.id
                        right join V3_CollectedItem ci3 on ci3.id = li1.collectedItemId
                        right join V3_Sale s2 on s2.id = l2.saleId
                        where s2.id is not null
                        and ci3.id = ci2.id
                        and s2.${timeWithBackticks} > s1.${timeWithBackticks}
                        and ci3.id not in ( -- was not removed before this lot was sold
                            select 
                                lr1.collectedItemId id 
                            from V3_LotEdit le2
                            right join V3_LotRemoval lr1 on lr1.lotEditId = le2.id
                            where le2.lotId = le1.lotId
                            and lr1.collectedItemId = ci3.id
                            and le2.${timeWithBackticks} > le1.${timeWithBackticks}
                            and le2.${timeWithBackticks} < s2.${timeWithBackticks}
                        )
                    )
                ) -- TODO items that were pulled from bulk as bulk gem
            )
        )
    `

    let additionalWhere = ''

    if (reqQuery.searchvalue) {
        additionalWhere += ` AND i.name LIKE '%${reqQuery.searchvalue}%'`
    }

    const direction = reqQuery.direction ? reqQuery.direction.toLowerCase() : undefined 
    // const attribute = reqQuery.attribute ? reqQuery.attribute.toLowerCase() : undefined
    let orderBy = ``
    // if (attribute && attribute.toLowerCase() === 'expansionname') {
    //     orderBy = ' ORDER BY set_v2_name'
    //     if (direction && direction.toLowerCase() === 'desc') orderBy += ' DESC'
    //     else orderBy += ' ASC'
    // } else {
        orderBy =  ' ORDER BY name'
        if (direction && direction.toLowerCase() === 'desc') orderBy += ' DESC'
        else orderBy += ' ASC'
        // orderBy += ', set_v2_name ASC'
    // }
    let groupBy = ' GROUP BY ci1.id'

    query += additionalWhere
    query += groupBy
    query += orderBy


    const variables = []
    variables.push(userId)

    const finalQuery = `
        select
            itemId,
            name,
            tcgpId,
            COUNT(collectedItemId) as quantity,
            count(*) OVER () as count
        from (
            ${query}
        ) as collectedItems
        group by itemId
    `
    const pageInt = parseInt(reqQuery.page)
    if (pageInt && pageInt > 0) {
        variables.push((pageInt-1)*20)
        query += ` LIMIT ?,20`
    } else {
        query += ` LIMIT 0,20;`
    }
    const req = { queryQueue: [{ query: finalQuery, variables }] }
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
