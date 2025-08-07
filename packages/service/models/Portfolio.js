const { executeQueries } = require("../db")
const { parseThenFormatLabels } = require("../middleware/collected-item-middleware")

const timeWithBackticks = '`time`'


const getItemsByUserId = async (userId, reqQuery) => {
    if (!userId) throw new Error(`Error: User Id required to query for collected items`)

    let query = `select 
        ci.id as collectedItemId,
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
    left join V3_Offer o on o.listingId = l.id and o.accepted = TRUE
    left join V3_Sale purchase on purchase.id = l.saleId
    left join V3_Lot lo on lo.id = l.lotId
    left join V3_LotEdit le on le.lotId = lo.id
    left join V3_LotInsert li on li.lotEditId = le.id
    left join V3_LotRemoval lr on lr.collectedItemId = li.collectedItemId or lr.bulkSplitId = li.bulkSplitId
    left join V3_LotEdit removalEdit on removalEdit.id = lr.lotEditId
    left join V3_CollectedItem ci on ci.id = li.collectedItemId or ci.id = l.collectedItemId
    left join Item i on i.id = ci.itemId
    left join sets_v2 s on s.set_v2_id = i.setId
    where purchase.purchaserId = ?
        and ((li.id is not null and li.collectedItemId is not null) or l.lotId is null) -- consider lot edits which only contain removals
        and l.bulkSplitId is null
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
    if (!reqQuery.itemId) groupBy += ` group by i.id`

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

const buildGetPortfolioExperimental = (userId, time) => {
    // TODO what if i use cte to query for edits that occur in between acquisitions and sales
    // first get all imports and purchases/sales from user, then get edits that occur between
    // I haven't thought much about it, but wanted to jot this down

    // purchLot     remove  addLot  remove  soldAsItem
    // purchLot     remove  addLot  remove  addLot      soldAsLot

    const itemJson = (id, name, setId, setName, tcgpId) => `
        json_object(
            'id', ${id},
            'name', ${name},
            'setId', ${setId},
            'setName', ${setName},
            'tcgpId', ${tcgpId}
        )
    `
    const printingJson = (id, name) => `
        json_object(
            'id', ${id},
            'name', ${name}
        )
    `
    const conditionJson = (id, name) => `
        json_object(
            'id', ${id}, 
            'name', ${name}
        )
    `
    const appraisalJson = (id, time, condition) => `
        json_object(
            'id', ${id},
            'time', ${time},
            'condition', 
                ${condition}
        )
    `
    const editJson = (id, time, insert) => `
        json_object(
            'id', ${id},
            'time', ${time},
            'insert', ${insert}
        )
    `
    const lotJson = (id, edit) => `
        json_object(
            'id', ${id},
            'edit', ${edit}
        )
    `
    const updatedPriceJson = (id, price) => `json_object('id', ${id}, 'price', ${price})`
    const listingJson = (id, time, price, relisted, updatedPrice, removal) => `
        json_object(
            'id', ${id},
            'time', ${time},
            'price', ${price},
            'relisted', ${relisted},
            'updatedPrice', ${updatedPrice},
            'removal', ${removal}
        )
    `
    const saleJson = (id, time, purchaser) => `
        json_object(
            'id', ${id},
            'time', ${time},
            'purchaser', ${purchaser}
        )
    `
    const creditJson = (appraisal, lot, listing, sale, imp) => `
        json_object(
            'appraisal', ${appraisal},
            'lot', ${lot},
            'listing', ${listing},
            'sale', ${sale},
            'import', ${imp}
        )
    `
    const userJson = (id, name) => `
        json_object(
            'id', ${id},
            'name', ${name}
        )
    `
    const idJson = (id) => `json_object('id', ${id})`
    const importJson = (id, time, importerId) => `
        json_object(
            'id', ${id},
            'time', ${time},
            'importerId', ${importerId}
        )
    `
    const itemSelect = `
        ${itemJson(
            'it.id',
            'it.name',
            'se.set_v2_id',
            'se.set_v2_name',
            'it.tcgpId'
        )} item
    `
    const printingSelect = `
        ${printingJson(
            'p.printing_id',
            'p.printing_name'
        )} printing
    `
    const appraisalSelect = `
        ${appraisalJson(
            'a.id', 
            'a.time', 
            conditionJson('c.condition_id', 'c.condition_name')
        )} appraisal
    `
    const lotSelect = `
        CASE WHEN sale.id is null
            THEN ${lotJson(
                'unsoldLot.lotId', 
                editJson(
                    'unsoldLot.insertEditId', 
                    'unsoldLot.insertTime', 
                    idJson('unsoldLot.lotInsertId')
                )
            )}
            ELSE ${lotJson(
                'sale.lotId',
                editJson(
                    'sale.insertEditId', 
                    'sale.insertTime', 
                    idJson('sale.lotInsertId')
                )
            )}
        END as lot
    `
    const listingSelect = `
        (CASE WHEN sale.listingId is null
            THEN ${listingJson(
                'unsoldListing.id',
                'unsoldListing.time',
                `(CASE WHEN unsoldListing.relistedPrice is null
                    THEN unsoldListing.price
                    ELSE unsoldListing.relistedPrice
                END)`,
                idJson('unsoldListing.relistedId'),
                `CASE WHEN unsoldListing.relistedId is null
                    THEN ${updatedPriceJson('unsoldListing.updatedPriceId', 'unsoldListing.updatedPrice')}
                    ELSE (CASE WHEN unsoldListing.relistedId != unsoldListing.updatedPriceId
                        THEN ${updatedPriceJson('unsoldListing.updatedPriceId', 'unsoldListing.updatedPrice')}
                        ELSE ${updatedPriceJson('null', 'null')}
                    END)
                END`,
                idJson(`(CASE WHEN unsoldListing.relistedId is null
                    THEN unsoldListing.listingRemovalId
                    ELSE null
                END)`)
            )}
            ELSE ${listingJson(
                'sale.listingId',
                'sale.listingTime',
                `(CASE WHEN sale.relistedPrice is null
                    THEN sale.price
                    ELSE sale.relistedPrice
                END)`,
                idJson('sale.relistedId'),
                updatedPriceJson(
                    'sale.updatedPriceId',
                    `(CASE WHEN sale.relistedId is null
                        THEN sale.updatedPrice
                        ELSE 
                            (CASE WHEN sale.relistedId != sale.updatedPriceId
                                THEN sale.updatedPrice
                                ELSE null
                            END)
                    END) `
                ),
                idJson(`(CASE WHEN sale.relistedId is null
                    THEN sale.listingRemovalId
                    ELSE null
                END)`)
            )}
        END) as listing
    `
    const saleSelect = `
        ${saleJson(
            'sale.id', 
            'sale.time', 
            userJson('salePurchaser.user_id', 'salePurchaser.user_name')
        )} sale
    `
    const creditSelect = `
        ${creditJson(
            `CASE WHEN purchase.id is null
                THEN ${appraisalJson(
                    'importAppraisal.id',
                    'importAppraisal.time',
                    conditionJson(
                        'importAppraisal.conditionId',
                        'importAppraisal.conditionName'
                    )                 
                )}
                ELSE ${appraisalJson(
                    'purchaseAppraisal.id',
                    'purchaseAppraisal.time',
                    conditionJson(
                        'purchaseAppraisal.conditionId',
                        'purchaseAppraisal.conditionName'
                    )  
                )}
            END`,
            lotJson(
                'purchase.lotId', 
                editJson(
                    'purchase.insertEditId', 
                    'purchase.insertTime', 
                    idJson('purchase.lotInsertId')
                )
            ),
            listingJson(
                'purchase.listingId',
                'purchase.time',
                `(CASE WHEN purchase.relistedPrice is null
                    THEN purchase.price
                    ELSE purchase.relistedPrice
                END)`,
                idJson('purchase.relistedId'),
                `CASE WHEN purchase.relistedId is null
                    THEN ${updatedPriceJson('purchase.updatedPriceId', 'purchase.updatedPrice')}
                    ELSE (CASE WHEN purchase.relistedId != purchase.updatedPriceId
                        THEN ${updatedPriceJson('purchase.updatedPriceId', 'purchase.updatedPrice')}
                        ELSE ${updatedPriceJson('null', 'null')}
                    END)
                END`,
                idJson('null')
            ),
            saleJson(
                'purchase.id',
                'purchase.time',
                `(CASE WHEN purchase.id is not null
                    THEN ${userJson('u.user_id', 'u.user_name')}
                    ELSE ${userJson('null', 'null')}
                END)`
            ),
            `(CASE WHEN purchase.id is null
                THEN ${importJson('i.id', 'i.time', userJson('u.user_id', 'u.user_name'))}
                ELSE ${importJson('null', 'null', userJson('null', 'null'))}
            END)`
        )} credit
    `
    const selectValues = `
        ci.id,
        ${itemSelect},
        ${printingSelect},
        ${appraisalSelect},
        ${lotSelect},
        ${listingSelect},
        ${saleSelect},
        ${creditSelect}
    `
    const query = `
        with appraisalCTE as (
            select
                a.id,
                a.time,
                a.collectedItemId,
                c.condition_id conditionId,
                c.condition_name conditionName
            from V3_Appraisal a
            left join conditions c
                on c.condition_id = a.conditionId
        ),
        insertEditCTE as (
            select
                le.id,
                le.lotId,
                le.time,
                li.id lotInsertId,
                li.collectedItemId
            from V3_LotEdit le
            left join V3_LotInsert li on li.lotEditId = le.id
            where le.time < '${time}'
        ),
        removalEditCTE as (
            select
                le.id,
                le.lotId,
                le.time,
                lr.collectedItemId
            from V3_LotEdit le
            left join V3_LotRemoval lr on lr.lotEditId = le.id
            where le.time < '${time}'
        ),
        insertAndRemovalCTE as (
            select
                insertEdit.lotId,
                insertEdit.id insertEditId,
                insertEdit.time insertTime,
                insertEdit.lotInsertId,
                insertEdit.collectedItemId,
                removalEdit.id removalEditId,
                removalEdit.time lotRemovalTime
            from insertEditCTE insertEdit
            left join removalEditCTE removalEdit
                on removalEdit.lotId = insertEdit.lotId
                and removalEdit.collectedItemId = insertEdit.collectedItemId
                and removalEdit.time > insertEdit.time
            left join removalEditCTE betweenRemovalEdit
                on betweenRemovalEdit.lotId = insertEdit.lotId
                and betweenRemovalEdit.collectedItemId = insertEdit.collectedItemId
                and betweenRemovalEdit.time > insertEdit.time
                and betweenRemovalEdit.time < removalEdit.time
            where betweenRemovalEdit.lotId is null
        ),
        listingCTE as (
            select
                l.id,
                l.collectedItemId,
                l.lotId,
                l.price,
                l.saleId,
                l.time,
                lp.id updatedPriceId,
                lp.price updatedPrice,
                listR.id listingRemovalId,
                relistP.id relistedId,
                relistP.price relistedPrice
            from V3_Listing l
            left join V3_ListingPrice lp
                on lp.listingId = l.id
                and lp.time < '${time}'
            left join V3_ListingPrice laterLp
                on laterLp.listingId = l.id
                and laterLp.time < '${time}'
                and laterLp.time > lp.time
            left join V3_ListingRemoval listR
                on listR.listingId = l.id
                and listR.time < '${time}'
            left join V3_ListingRemoval laterListR
                on laterListR.listingId = l.id
                and laterListR.time < '${time}'
                and laterListR.time > listR.time
            left join V3_ListingPrice relistP
                on relistP.listingId = listR.listingId
                    and relistP.time > listR.time
                    and relistP.time < '${time}'
            left join V3_ListingPrice betweenRelistP
                on betweenRelistP.listingId = listR.listingId
                    and betweenRelistP.time < relistP.time
                    and betweenRelistP.time > listR.time
            where laterLp.id is null
                and laterListR.id is null
                and betweenRelistP.id is null
                and l.time < '${time}'
        ),
        saleCTE as (
            select
                s.id,
                s.purchaserId,
                s.time,
                l.id listingId,
                l.lotId,
                l.price,
                l.time listingTime,
                l.updatedPriceId,
                l.updatedPrice,
                l.listingRemovalId,
                l.relistedId,
                l.relistedPrice,
                insertAndRemoval.insertEditId,
                insertAndRemoval.insertTime,
                insertAndRemoval.lotInsertId,
                insertAndRemoval.removalEditId,
                insertAndRemoval.lotRemovalTime,
                (CASE WHEN l.collectedItemId is not null
                    THEN l.collectedItemId
                    ELSE insertAndRemoval.collectedItemId
                END) collectedItemId
            from V3_Sale s
            left join listingCTE l on l.saleId = s.id
            left join insertAndRemovalCTE insertAndRemoval
                on insertAndRemoval.lotId = l.lotId
                and insertAndRemoval.insertTime < s.time
                and (
                    insertAndRemoval.lotRemovalTime is null
                    or insertAndRemoval.lotRemovalTime > s.time
                )
            where s.time < '${time}'
        ),
        purchaseCTE as (
            select
                s.id,
                s.time,
                s.purchaserId,
                s.listingId,
                s.lotId,
                s.price,
                s.listingTime,
                s.updatedPriceId,
                s.updatedPrice,
                s.listingRemovalId,
                s.relistedId,
                s.relistedPrice,
                s.insertEditId,
                s.insertTime,
                s.lotInsertId,
                s.removalEditId,
                s.lotRemovalTime,
                s.collectedItemId
            from saleCTE s
            where s.purchaserId = '${userId}'
        ),
        unsoldListingCTE as (
            select
                l.id,
                l.time,
                l.price,
                l.lotId,
                l.updatedPriceId,
                l.updatedPrice,
                l.listingRemovalId,
                l.relistedId,
                l.relistedPrice,
                insertAndRemoval.insertEditId,
                insertAndRemoval.insertTime,
                insertAndRemoval.removalEditId,
                insertAndRemoval.lotRemovalTime,
                (CASE WHEN l.collectedItemId is not null
                    THEN l.collectedItemId
                    ELSE insertAndRemoval.collectedItemId
                END) collectedItemId
            from listingCTE l
            left join insertAndRemovalCTE insertAndRemoval
                on insertAndRemoval.lotId = l.lotId
                and insertAndRemoval.lotRemovalTime is null
            where l.saleId is null
                and l.time < '${time}'
        )
        select
            ${selectValues}
        from purchaseCTE purchase
        left join purchaseCTE laterPurchase
            on laterPurchase.collectedItemId = purchase.collectedItemId
            and laterPurchase.time > purchase.time
        left join appraisalCTE purchaseAppraisal
            on purchaseAppraisal.collectedItemId = purchase.collectedItemId
            and purchaseAppraisal.time < purchase.time
        left join appraisalCTE betweenPurchaseAppraisal
            on betweenPurchaseAppraisal.collectedItemId = purchaseAppraisal.collectedItemId
            and betweenPurchaseAppraisal.time < purchase.time
            and betweenPurchaseAppraisal.time > purchaseAppraisal.time
        right join V3_Import i
            on i.collectedItemId = purchase.collectedItemId
        left join appraisalCTE importAppraisal
            on importAppraisal.collectedItemId = i.collectedItemId
        left join appraisalCTE earlierImportAppraisal
            on earlierImportAppraisal.collectedItemId = importAppraisal.collectedItemId
            and earlierImportAppraisal.time < importAppraisal.time
        left join saleCTE sale
            on (
                sale.collectedItemId = purchase.collectedItemId
                and sale.time > purchase.time
            ) or (
                purchase.id is null 
                and sale.collectedItemId = i.collectedItemId

            )
        left join saleCTE betweenSale
            on (
                (
                    betweenSale.collectedItemId = purchase.collectedItemId
                    and betweenSale.time > purchase.time
                ) or (
                    purchase.id is null 
                    and betweenSale.collectedItemId = i.collectedItemId
                )
            )
            and betweenSale.time < sale.time
        left join unsoldListingCTE unsoldListing
            on (
                unsoldListing.collectedItemId = purchase.collectedItemId
                or (
                    purchase.id is null 
                    and unsoldListing.collectedItemId = i.collectedItemId
                )
            )
        left join unsoldListingCTE laterUnsoldListing
            on (
                laterUnsoldListing.collectedItemId = purchase.collectedItemId
                or (
                    purchase.id is null 
                    and laterUnsoldListing.collectedItemId = i.collectedItemId
                )
            ) and laterUnsoldListing.time > unsoldListing.time
        -- latest lot status
        left join removalEditCTE immediateRemoval 
            on immediateRemoval.collectedItemId = purchase.collectedItemId
            and purchase.lotId is not null
            and immediateRemoval.time > purchase.time
        left join removalEditCTE betweenImmediateRemoval 
            on betweenImmediateRemoval.collectedItemId = purchase.collectedItemId
            and purchase.lotId is not null
            and betweenImmediateRemoval.time > purchase.time
            and betweenImmediateRemoval.time < immediateRemoval.time
        left join insertAndRemovalCTE unsoldLot
            on (
                unsoldLot.collectedItemId = purchase.collectedItemId
                or unsoldLot.collectedItemId = immediateRemoval.collectedItemId
                or (
                    purchase.id is null and unsoldLot.collectedItemId = i.collectedItemId
                )
            ) and unsoldLot.removalEditId is null
        left join insertAndRemovalCTE laterUnsoldLot
            on (
                laterUnsoldLot.collectedItemId = purchase.collectedItemId
                or laterUnsoldLot.collectedItemId = immediateRemoval.collectedItemId
            ) and laterUnsoldLot.removalEditId is null
            and laterUnsoldLot.insertTime > unsoldLot.insertTime
        left join V3_CollectedItem ci 
            on ci.id = purchase.collectedItemId 
            or ci.id = i.collectedItemId
        left join Item it on it.id = ci.itemId
        left join sets_v2 se on se.set_v2_id = it.setId
        left join V3_Appraisal a
            on a.collectedItemid = ci.id
            and a.time < '${time}'
        left join V3_Appraisal laterA
            on laterA.collectedItemId = ci.id
            and laterA.time < '${time}'
            and laterA.time > a.time
        left join conditions c on c.condition_id = a.conditionId
        left join printings p on p.printing_id = ci.printingId
        left join users u 
            on u.user_id = purchase.purchaserId
            or (purchase.id is null and u.user_id = i.importerId)
        left join users salePurchaser
            on salePurchaser.user_id = sale.purchaserId
        where sale.id is null
            and laterPurchase.id is null
            and (
                purchase.id is not null
                or (purchase.id is null and i.importerId = '${userId}' and i.time < '${time}')
            ) 
            and betweenPurchaseAppraisal.id is null
            and earlierImportAppraisal.id is null
            and betweenSale.id is null
            and laterUnsoldListing.id is null
            and betweenImmediateRemoval.id is null
            and laterUnsoldLot.lotId is null
            and laterA.id is null
    `

    return { query, variables: [] }
}

const getPortfolio = async (userId) => {

}

module.exports = { getItemsByUserId, getBulkSplitsByUserId, buildGetPortfolioExperimental }
