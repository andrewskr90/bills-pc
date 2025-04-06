const { executeQueries } = require("../db")

const buildGetByIdQuery = (id, userId, time) => {
    // rumcguire card 8d99baae-f268-4fa3-8862-bc030d541bc5

    const selectStatement = `
        SELECT
            ci.id,
            json_object(
                'id', it.id,
                'name', it.name,
                'setId', se.set_v2_id,
                'setName', se.set_v2_name
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
                'id', l.id,
                'time', l.time,
                'price',
                    (CASE WHEN 
                        listR.id is null
                        THEN l.price
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
                                or (relistP.id is not null and relistP.id != listP.id)
                            )
                                THEN listP.price
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
                'sale',
                    json_object(
                        'id', purchase.id,
                        'time', purchase.time,
                        'purchaser',
                            json_object(
                                'id', u.user_id,
                                'name', u.user_name
                            )
                    ),
                'listing',
                    json_object(
                        'id', purchase.listingId,
                        'time', purchase.listingTime,
                        'price', purchase.price
                    ),
                'import',
                    json_object(
                        'id', i.id,
                        'time', i.time,
                        'importer',
                            json_object(
                                'id', u.user_id,
                                'name', u.user_name
                            )
                    )
            ) credit
    `
    const query = `
        
        ${selectStatement}
        from V3_CollectedItem ci
        -- acquisition
        left join V3_Import i on i.collectedItemId = ci.id
        left join (
            select
                s.id,
                s.time,
                s.purchaserId,
                l.id listingId,
                l.collectedItemId,
                l.price price,
                l.time listingTime
            from V3_Sale s
            left join V3_Listing l
                on l.saleId = s.id
            where s.purchaserId = '${userId}'
                and l.collectedItemId = '${id}'
                and l.time < '${time}'
        ) purchase
            on purchase.collectedItemId = ci.id
        left join (
            select
                s.id,
                s.time,
                s.purchaserId,
                l.id listingId,
                l.collectedItemId,
                l.price price,
                l.time listingTime
            from V3_Sale s
            left join V3_Listing l
                on l.saleId = s.id
            where s.purchaserId = '${userId}'
                and l.collectedItemId = '${id}'
                and l.time < '${time}'
        ) laterPurchase 
            on laterPurchase.collectedItemId = ci.id
            and laterPurchase.time > purchase.time
        -- current
        left join V3_Listing l
            on l.collectedItemId = i.collectedItemId
            and (
                (purchase.id is null and l.time > i.time)
                or (purchase.id is not null and l.time > purchase.time)
            )
            and l.time < '${time}'
        left join V3_Listing laterL
            on laterL.collectedItemId = i.collectedItemId
            and laterL.time > l.time
            and laterL.time < '${time}'
        left join V3_ListingPrice listP
            on listP.listingId = l.id
            and listP.time < '${time}'
        left join V3_ListingPrice laterListP
            on laterListP.listingId = l.id
            and laterListP.time > listP.time
            and laterListP.time < '${time}'
        left join V3_ListingRemoval listR
            on listR.listingId = l.id
            and listR.time > l.time
            and listR.time < '${time}'
        left join V3_ListingRemoval laterListR
            on laterListR.listingId = l.id
            and laterListR.time > listR.time
            and laterListR.time < '${time}'
        left join V3_ListingPrice relistP
            on relistP.listingId = listR.listingId
            and relistP.time > listR.time
            and relistP.time < '${time}'
        left join V3_ListingPrice betweenRelistP
            on betweenRelistP.listingId = listR.listingId
            and betweenRelistP.time < relistP.time
            and betweenRelistP.time > listR.time
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
        where ci.id = '${id}'
            and u.user_id = '${userId}'
            and (
                (purchase.id is null and i.time < '${time}') 
                or (purchase.id is not null and purchase.time < '${time}')
            )
            and laterL.id is null
            and laterListP.id is null
            and laterListR.id is null
            and betweenRelistP.id is null
            and laterA.id is null
            and laterPurchase.id is null
            ;
    `
    return { query, variables: [] }
}
const getById = async (id, userId) => {

    const getByIdQuery = buildGetByIdQuery(id, userId)
    const queryQueue = [getByIdQuery]
    const req = { queryQueue }
    const res = {}
    let collectedItemResults
    await executeQueries(req, res, (err) => {
        if (err) throw err
        collectedItemResults = req.results
        console.log(collectedItemResults)
    })
    if (collectedItemResults.length > 1) throw new Error('Multiple rows returned.')
    return collectedItemResults[0]
}

const mostRecentAcquisition = async (id, userId) => {
    // this will not count instances where proxyUser imported card and user hs not yet purchased it.
    // only if user imported or purchased card
    const query = `
    SELECT
        *
    FROM V3_CollectedItem ci
    -- user imported it
    
    -- user purchased it
    left join (
        select
            l.collectedItemId,
            li.collectedItemId,
            s.time,
            s.purchaserId
        from V3_Sale s
        left join V3_Listing l
            on l.saleId = s.id
        left join V3_CollectedItem ci
            on ci.id = l.collectedItemId
        left join V3_LotEdit le
            on le.lotId = l.lotId
            and le.time < s.time
            and ci.id is null
        left join V3_LotInsert li
            on li.lotEditId = le.id
        left join V3_LotRemoval lr
            on lr.collectedItemId = li.collectedItemId
        left join V3_LotEdit leR
            on leR.id = lr.lotEditId
            and leR.lotId = le.lotId
            and leR.time > le.time
            and leR.time < s.time
        left join V3_LotEdit betweenLeR
            on betweenLeR.id = lr.lotEditId
            and betweenLeR.lotId = le.lotId
            and betweenLeR.time > le.time
            and betweenLeR.time < leR.time
        left join 
        where s.purchaserId = '${userId}'
            and (
                l.collectedItemId = '${id}'
                or li.collectedItemId = '${id}'
            )
    ) creditSale
        on creditSale.collectedItemId = ci.id
            or creditSale.lotInsert.collectedItemId = ci.id
    where (creditImport.importerId = '${userId}' )
`

} 

module.exports = { getById, buildGetByIdQuery }