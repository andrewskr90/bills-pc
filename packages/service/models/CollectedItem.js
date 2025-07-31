const { executeQueries } = require("../db")

const buildGetByIdQuery = (id, userId, time) => {
    // TODO - card that was giving me trouble... rumcguire card 8d99baae-f268-4fa3-8862-bc030d541bc5
    const selectStatement = `
        SELECT
            ci.id,
            json_object(
                'id', it.id,
                'name', it.name,
                'setId', se.set_v2_id,
                'setName', se.set_v2_name,
                'tcgpId', it.tcgpId
            ) item,
            json_object(
                'id', p.printing_id,
                'name', p.printing_name
            ) printing,
            json_object(
                'id', a.id,
                'time', a.time,
                'condition', 
                    json_object(
                        'id', c.condition_id, 
                        'name', c.condition_name
                    )
            ) appraisal,
            json_object(
                'id', 
                    (CASE WHEN sale.id is null
                        THEN 
                            (CASE WHEN removal.id is null 
                                THEN le.lotId 
                                ELSE null 
                            END)
                        ELSE 
                            (CASE WHEN sale.removalId is null 
                                THEN sale.lotId 
                                ELSE null 
                            END)
                    END),
                
                'edit',
                    (CASE WHEN sale.id is null
                        THEN
                            (CASE WHEN removal.id is null 
                                THEN 
                                    json_object(
                                        'id', le.id,
                                        'time', le.time,
                                        'insert',
                                            json_object(
                                                'id', li.id
                                            )
                                    )
                                ELSE
                                    json_object(
                                        'id', null, 
                                        'time', null, 
                                        'insert', 
                                            json_object(
                                                'id', null
                                            )
                                    )
                            END)
                        ELSE 
                            (CASE WHEN sale.removalId is null 
                                THEN 
                                    json_object(
                                        'id', sale.lotEditId,
                                        'time', sale.lotEditTime,
                                        'insert',
                                            json_object(
                                                'id', sale.insertId
                                            )
                                    )
                                ELSE
                                    json_object(
                                        'id', null, 
                                        'time', null, 
                                        'insert', 
                                            json_object(
                                                'id', null
                                            )
                                    )
                            END)
                    END)
            ) lot,
            json_object(
                'id', 
                    (CASE WHEN sale.listingId is null
                        THEN unsoldL.id
                        ELSE sale.listingId
                    END),
                'time', 
                    (CASE WHEN sale.listingId is null
                        THEN unsoldL.time
                        ELSE sale.listingTime
                    END),
                'price',
                    (CASE WHEN listR.id is null
                        THEN 
                            (CASE WHEN sale.listingId is null
                                THEN unsoldL.price
                                ELSE sale.price
                            END)
                        ELSE
                            (CASE WHEN relistP.id is null
                                THEN null
                                ELSE relistP.price 
                            END)
                    END),
                'relisted',
                    json_object(
                        'id',
                        relistP.id
                    ),
                'updatedPrice',
                    json_object(
                        'price',
                            (CASE WHEN (
                                (listR.id is null) 
                                or (relistP.id is not null and relistP.id != lp.id)
                            )
                                THEN lp.price
                                ELSE
                                    null
                            END)    
                    ),
                'removal',
                    json_object(
                        'id',
                        (CASE WHEN relistP.id is null
                            THEN listR.id
                            ELSE null
                        END)
                    )
            ) listing,
            json_object(
                'id', sale.id,
                'time', sale.time,
                'purchaser',
                    json_object(
                        'id', salePurchaser.user_id,
                        'name', salePurchaser.user_name
                    )
            ) sale,
            json_object(
                'lot',
                    json_object(
                        'id', purchase.lotId
                    ),
                'sale',
                    json_object(
                        'id', purchase.id,
                        'time', purchase.time,
                        'purchaser',
                            (CASE WHEN purchase.id is not null
                            THEN
                                json_object(
                                    'id', u.user_id,
                                    'name', u.user_name
                                )
                            ELSE 
                                json_object(
                                    'id', null,
                                    'name', null
                                )
                            END)
                    ),
                'listing',
                    json_object(
                        'id', purchase.listingId,
                        'time', purchase.listingTime,
                        'price', purchase.price
                    ),
                'import',
                    (CASE WHEN purchase.id is null
                        THEN 
                            json_object(
                                'id', i.id,
                                'time', i.time,
                                'importer',
                                    json_object(
                                        'id', u.user_id,
                                        'name', u.user_name
                                    )
                            )
                        ELSE 
                            json_object(
                                'id', null,
                                'time', null,
                                'importer',
                                    json_object(
                                        'id', null,
                                        'name', null
                                    )
                            )
                    END)
            ) credit
    `
    const query = `
        ${selectStatement}
        from V3_CollectedItem ci
        -- acquisition
        left join V3_Import i on i.collectedItemId = ci.id
            and i.time < '${time}'
        left join (
            select
                s.id,
                s.time,
                s.purchaserId,
                le.id lotEditId,
                le.time lotEditTime,
                l.id listingId,
                l.collectedItemId,
                l.lotId,
                li.id insertId,
                li.collectedItemId insertCollectedItemId,
                removal.id removalId,
                l.price price,
                l.time listingTime
            from V3_Sale s
            left join V3_Listing l
                on l.saleId = s.id
            left join V3_Lot lo on lo.id = l.lotId
            left join V3_LotEdit le 
                on le.lotId = lo.id
                and le.time < s.time
            left join V3_LotInsert li on li.lotEditId = le.id
            left join (
                select
                    lr.id,
                    le.lotId,
                    le.time,
                    lr.collectedItemId
                from V3_LotRemoval lr
                left join V3_LotEdit le 
                    on le.id = lr.lotEditId
                where lr.collectedItemId = '${id}'
            ) removal
                on removal.lotId = lo.id
                and removal.time > le.time
                and removal.time < s.time
            left join (
                select
                    lr.id,
                    le.lotId,
                    le.time,
                    lr.collectedItemId
                from V3_LotRemoval lr
                left join V3_LotEdit le 
                    on le.id = lr.lotEditId
                where lr.collectedItemId = '${id}'
            ) betweenRemoval
                on betweenRemoval.lotId = lo.id
                and betweenRemoval.time > le.time
                and betweenRemoval.time < removal.time
            where s.purchaserId = '${userId}'
            and (
                l.collectedItemId = '${id}' 
                or (li.collectedItemId = '${id}' and removal.id is null)
            )
            and s.time < '${time}'
            and betweenRemoval.id is null
        ) purchase
            on purchase.collectedItemId = ci.id
            or purchase.insertCollectedItemId = ci.id
        left join (
            select
                s.id,
                s.time,
                s.purchaserId,
                le.id lotEditId,
                le.time lotEditTime,
                l.id listingId,
                l.collectedItemId,
                l.lotId,
                li.id insertId,
                li.collectedItemId insertCollectedItemId,
                removal.id removalId,
                l.price price,
                l.time listingTime
            from V3_Sale s
            left join V3_Listing l
                on l.saleId = s.id
            left join V3_Lot lo on lo.id = l.lotId
            left join V3_LotEdit le 
                on le.lotId = lo.id
                and le.time < s.time
            left join V3_LotInsert li on li.lotEditId = le.id
            left join (
                select
                    lr.id,
                    le.lotId,
                    le.time,
                    lr.collectedItemId
                from V3_LotRemoval lr
                left join V3_LotEdit le 
                    on le.id = lr.lotEditId
                where lr.collectedItemId = '${id}'
            ) removal
                on removal.lotId = lo.id
                and removal.time > le.time
                and removal.time < s.time
            left join (
                select
                    lr.id,
                    le.lotId,
                    le.time,
                    lr.collectedItemId
                from V3_LotRemoval lr
                left join V3_LotEdit le 
                    on le.id = lr.lotEditId
                where lr.collectedItemId = '${id}'
            ) betweenRemoval
                on betweenRemoval.lotId = lo.id
                and betweenRemoval.time > le.time
                and betweenRemoval.time < removal.time
            where s.purchaserId = '${userId}'
            and (
                l.collectedItemId = '${id}' 
                or (li.collectedItemId = '${id}' and removal.id is null)
            )
            and s.time < '${time}'
            and betweenRemoval.id is null
        ) laterPurchase
            on (
                laterPurchase.collectedItemId = ci.id
                or purchase.insertCollectedItemId = ci.id
            )
            and laterPurchase.time > purchase.time
        -- current
        -- latest lot status, for when sale is null
        left join V3_LotInsert li
            on li.collectedItemId = ci.id
        left join V3_LotEdit le 
            on le.id = li.lotEditId
            and le.time < '${time}'
        left join (
            select
                le.id,
                li.collectedItemId,
                le.time
            from V3_LotInsert li
            left join V3_LotEdit le 
                on le.id = li.lotEditId
            where li.collectedItemId = '${id}'
        ) laterInsert
            on laterInsert.collectedItemId = li.collectedItemId
            and laterInsert.time > le.time
            and laterInsert.time < '${time}'
        left join (
            select 
                lr.id,
                le.lotId,
                le.time,
                lr.collectedItemId
            from V3_LotRemoval lr
            left join V3_LotEdit le
                on le.id = lr.lotEditId
            where lr.collectedItemId = '${id}'
        ) removal
            on removal.collectedItemId = ci.id
            and removal.lotId = le.lotId
            and removal.time > le.time
            and removal.time < '${time}'
        left join (
            select 
                lr.id,
                le.lotId,
                le.time,
                lr.collectedItemId
            from V3_LotRemoval lr
            left join V3_LotEdit le
                on le.id = lr.lotEditId
            where lr.collectedItemId = '${id}'
        ) betweenRemoval
            on betweenRemoval.collectedItemId = ci.id
            and betweenRemoval.lotId = le.lotId
            and betweenRemoval.time > le.time
            and betweenRemoval.time < removal.time
        left join (
            select
                s.id,
                s.time,
                s.purchaserId,
                le.id lotEditId,
                le.time lotEditTime,
                l.id listingId,
                l.collectedItemId,
                l.lotId,
                li.id insertId,
                li.collectedItemId insertCollectedItemId,
                removal.id removalId,
                l.price price,
                l.time listingTime
            from V3_Sale s
            left join V3_Listing l
                on l.saleId = s.id
            left join V3_Lot lo on lo.id = l.lotId
            left join V3_LotEdit le 
                on le.lotId = lo.id
                and le.time < s.time
            left join V3_LotInsert li on li.lotEditId = le.id
            left join (
                select
                    lr.id,
                    le.lotId,
                    le.time,
                    lr.collectedItemId
                from V3_LotRemoval lr
                left join V3_LotEdit le 
                    on le.id = lr.lotEditId
                where lr.collectedItemId = '${id}'
            ) removal
                on removal.lotId = lo.id
                and removal.time > le.time
                and removal.time < s.time
            left join (
                select
                    lr.id,
                    le.lotId,
                    le.time,
                    lr.collectedItemId
                from V3_LotRemoval lr
                left join V3_LotEdit le 
                    on le.id = lr.lotEditId
                where lr.collectedItemId = '${id}'
            ) betweenRemoval
                on betweenRemoval.lotId = lo.id
                and betweenRemoval.time > le.time
                and betweenRemoval.time < removal.time
            where (
                l.collectedItemId = '${id}' 
                or (li.collectedItemId = '${id}' and removal.id is null)
            )
            and s.time < '${time}'
            and betweenRemoval.id is null
        ) sale
            on (
                sale.collectedItemId = ci.id 
                or sale.insertCollectedItemId = ci.id
            )
            and (
                (purchase.id is null and sale.time > i.time)
                or (purchase.id is not null and sale.time > purchase.time)
            )
        left join (
            select
                s.id,
                s.time,
                s.purchaserId,
                le.id lotEditId,
                le.time lotEditTime,
                l.id listingId,
                l.collectedItemId,
                l.lotId,
                li.id insertId,
                li.collectedItemId insertCollectedItemId,
                removal.id removalId,
                l.price price,
                l.time listingTime
            from V3_Sale s
            left join V3_Listing l
                on l.saleId = s.id
            left join V3_Lot lo on lo.id = l.lotId
            left join V3_LotEdit le 
                on le.lotId = lo.id
                and le.time < s.time
            left join V3_LotInsert li on li.lotEditId = le.id
            left join (
                select
                    lr.id,
                    le.lotId,
                    le.time,
                    lr.collectedItemId
                from V3_LotRemoval lr
                left join V3_LotEdit le 
                    on le.id = lr.lotEditId
                where lr.collectedItemId = '${id}'
            ) removal
                on removal.lotId = lo.id
                and removal.time > le.time
                and removal.time < s.time
            left join (
                select
                    lr.id,
                    le.lotId,
                    le.time,
                    lr.collectedItemId
                from V3_LotRemoval lr
                left join V3_LotEdit le 
                    on le.id = lr.lotEditId
                where lr.collectedItemId = '${id}'
            ) betweenRemoval
                on betweenRemoval.lotId = lo.id
                and betweenRemoval.time > le.time
                and betweenRemoval.time < removal.time
            where (
                l.collectedItemId = '${id}' 
                or (li.collectedItemId = '${id}' and removal.id is null)
            )
            and s.time < '${time}'
            and betweenRemoval.id is null
        ) betweenSale
            on (
                betweenSale.collectedItemId = ci.id 
                or betweenSale.insertCollectedItemId = ci.id
            )
            and (
                (purchase.id is null and betweenSale.time > i.time)
                or (purchase.id is not null and betweenSale.time > purchase.time)
            )
            and betweenSale.time < sale.time
        left join V3_Listing unsoldL
            on (
                (
                    purchase.id is null 
                    and (
                        unsoldL.collectedItemId = i.collectedItemId
                        or (unsoldL.lotId = le.lotId and removal.id is null)
                    )
                    and unsoldL.time > i.time
                ) or (
                    purchase.id is not null 
                    and (
                        unsoldL.collectedItemId = purchase.collectedItemId
                        or (unsoldL.lotId = le.lotId and removal.id is null)
                    )   
                    and unsoldL.time > purchase.time
                )
            )
            and unsoldL.time < '${time}'
        left join V3_Listing laterUnsoldL
            on (
                (
                    purchase.id is null 
                    and (
                        laterUnsoldL.collectedItemId = i.collectedItemId
                        or (laterUnsoldL.lotId = le.lotId and removal.id is null)
                    )
                    and laterUnsoldL.time > i.time
                ) or (
                    purchase.id is not null 
                    and (
                        laterUnsoldL.collectedItemId = purchase.collectedItemId
                        or (laterUnsoldL.lotId = le.lotId and removal.id is null)
                    )   
                    and laterUnsoldL.time > purchase.time
                )
            )
            and laterUnsoldL.time < '${time}'
            and laterUnsoldL.time > unsoldL.time
        left join V3_ListingPrice lp
            on (
                (
                    sale.id is null 
                    and lp.listingId = unsoldL.id
                )
                or (
                    sale.id is not null 
                    and lp.listingId = sale.listingId
                )
            ) and lp.time < '${time}'
        left join V3_ListingPrice laterLp
            on (
                (
                    sale.id is null 
                    and laterLp.listingId = unsoldL.id
                )
                or (
                    sale.id is not null 
                    and laterLp.listingId = sale.listingId
                )
            ) and laterLp.time < '${time}'
            and laterLp.time > lp.time
        left join V3_ListingRemoval listR
            on (
                (
                    sale.id is null
                    and listR.listingId = unsoldL.id
                    and listR.time > unsoldL.time
                )
                or (
                    sale.id is not null
                    and listR.listingId = sale.listingId
                    and listR.time > sale.listingTime
                )
            ) and listR.time < '${time}'
        left join V3_ListingRemoval laterListR
            on (
                (
                    sale.id is null
                    and laterListR.listingId = unsoldL.id
                    and laterListR.time > unsoldL.time
                )
                or (
                    sale.id is not null
                    and laterListR.listingId = sale.listingId
                    and laterListR.time > sale.listingTime
                )
            ) and laterListR.time < '${time}'
            and laterListR.time > listR.time
        left join V3_ListingPrice relistP
            on (
                relistP.listingId = listR.listingId
                and relistP.time > listR.time
                and relistP.time < '${time}'
            )
        left join V3_ListingPrice betweenRelistP
            on (
                betweenRelistP.listingId = listR.listingId
                and betweenRelistP.time < relistP.time
                and betweenRelistP.time > listR.time
            )
        -- item info
        left join Item it on it.id = ci.itemId
        left join sets_v2 se
            on se.set_v2_id = it.setId
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
            on u.user_id = i.importerId 
            or u.user_id = purchase.purchaserId
        left join users salePurchaser
            on salePurchaser.user_id = sale.purchaserId
        where ci.id = '${id}'
            and u.user_id = '${userId}'
            and (
                (purchase.id is null and i.time < '${time}') 
                or (purchase.id is not null and purchase.time < '${time}')
            )
            and (li.id is null or le.id is not null)
            and betweenRemoval.id is null
            and laterInsert.id is null
            and betweenSale.id is null
            and laterUnsoldL.id is null
            and laterLp.id is null
            and laterListR.id is null
            and betweenRelistP.id is null
            and laterA.id is null
            and laterPurchase.id is null
            ;
    `
    return { query, variables: [] }
}
const getById = async (id, userId, time) => {
    const getByIdQuery = buildGetByIdQuery(id, userId, time)
    const queryQueue = [getByIdQuery]
    const req = { queryQueue }
    const res = {}
    let collectedItemResults
    await executeQueries(req, res, (err) => {
        if (err) throw err
        collectedItemResults = req.results
    })
    if (collectedItemResults.length > 1) throw new Error('Multiple rows returned.')
    return collectedItemResults[0]
}

module.exports = { getById, buildGetByIdQuery }