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
                    (CASE WHEN sale.listingId is null
                        THEN
                            (CASE WHEN 
                                unsoldListR.id is null
                                THEN unsoldL.price
                                ELSE
                                    (CASE WHEN unsoldRelistP.id is null
                                        THEN null
                                        ELSE unsoldRelistP.price 
                                    END)
                            END)
                        ELSE
                            (CASE WHEN 
                                soldListR.id is null
                                THEN sale.price
                                ELSE
                                    (CASE WHEN soldRelistP.id is null
                                        THEN null
                                        ELSE soldRelistP.price 
                                    END)
                            END)
                    END),
                'relisted',
                    json_object(
                        'id',
                        unsoldRelistP.id
                    ),
                'updatedPrice',
                    json_object(
                        'price',
                            (CASE WHEN sale.listingId is null
                                THEN
                                    (CASE WHEN (
                                        (unsoldListR.id is null) 
                                        or (unsoldRelistP.id is not null and unsoldRelistP.id != unsoldListP.id)
                                    )
                                        THEN unsoldListP.price
                                        ELSE
                                            null
                                    END)
                                ELSE 
                                    -- soldListR, soldRelistP
                                    (CASE WHEN (
                                        (soldListR.id is null) 
                                        or (soldRelistP.id is not null and soldRelistP.id != saleListingP.id)
                                    )
                                        THEN saleListingP.price
                                        ELSE
                                            null
                                    END)
                            END)
                    ),
                'removal',
                    json_object(
                        'id',
                        (CASE WHEN unsoldRelistP.id is null
                            THEN unsoldListR.id
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
                and s.time < '${time}'
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
                and s.time < '${time}'
        ) laterPurchase 
            on laterPurchase.collectedItemId = ci.id
            and laterPurchase.time > purchase.time
        -- current
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
            where l.collectedItemId = '${id}'
                and s.time < '${time}'
        ) sale
            on sale.collectedItemId = ci.id
            and (
                (purchase.id is null and sale.time > i.time)
                or (purchase.id is not null and sale.listingTime > purchase.time)
            )
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
            where l.collectedItemId = '${id}'
                and s.time < '${time}'
        ) betweenSale
            on betweenSale.collectedItemId = ci.id
            and (
                (purchase.id is null and betweenSale.listingTime > i.time)
                or (purchase.id is not null and betweenSale.listingTime > purchase.time)
            )
            and betweenSale.time < sale.time
        left join V3_ListingPrice saleListingP
            on saleListingP.listingId = sale.listingId
            and saleListingP.time < '${time}'
        left join V3_ListingPrice laterSoldListP
            on laterSoldListP.listingId = sale.listingId
            and laterSoldListP.time > saleListingP.time
            and laterSoldListP.time < '${time}'
        left join V3_ListingRemoval soldListR
            on soldListR.listingId = sale.listingId
            and soldListR.time > sale.listingTime
            and soldListR.time < '${time}'
        left join V3_ListingRemoval laterSoldListR
            on laterSoldListR.listingId = sale.listingId
            and laterSoldListR.time > soldListR.time
            and laterSoldListR.time < '${time}'
        left join V3_ListingPrice soldRelistP
            on soldRelistP.listingId = soldListR.listingId
            and soldRelistP.time > soldListR.time
            and soldRelistP.time < '${time}'
        left join V3_ListingPrice betweenSoldRelistP
            on betweenSoldRelistP.listingId = soldListR.listingId
            and betweenSoldRelistP.time < soldRelistP.time
            and betweenSoldRelistP.time > soldListR.time
        left join V3_Listing unsoldL
            on (
                (
                    purchase.id is null 
                    and unsoldL.collectedItemId = i.collectedItemId
                    and unsoldL.time > i.time
                ) or (
                    purchase.id is not null 
                    and unsoldL.collectedItemId = purchase.collectedItemId
                    and unsoldL.time > purchase.time
                )
            )
            and unsoldL.time < '${time}'
        left join V3_Listing laterUnsoldL
            on laterUnsoldL.collectedItemId = i.collectedItemId
            and laterUnsoldL.time > unsoldL.time
            and laterUnsoldL.time < '${time}'
        left join V3_ListingPrice unsoldListP
            on unsoldListP.listingId = unsoldL.id
            and unsoldListP.time < '${time}'
        left join V3_ListingPrice laterUnsoldListP
            on laterUnsoldListP.listingId = unsoldL.id
            and laterUnsoldListP.time > unsoldListP.time
            and laterUnsoldListP.time < '${time}'
        left join V3_ListingRemoval unsoldListR
            on unsoldListR.listingId = unsoldL.id
            and unsoldListR.time > unsoldL.time
            and unsoldListR.time < '${time}'
        left join V3_ListingRemoval laterUnsoldListR
            on laterUnsoldListR.listingId = unsoldL.id
            and laterUnsoldListR.time > unsoldListR.time
            and laterUnsoldListR.time < '${time}'
        left join V3_ListingPrice unsoldRelistP
            on unsoldRelistP.listingId = unsoldListR.listingId
            and unsoldRelistP.time > unsoldListR.time
            and unsoldRelistP.time < '${time}'
        left join V3_ListingPrice betweenRelistP
            on betweenRelistP.listingId = unsoldListR.listingId
            and betweenRelistP.time < unsoldRelistP.time
            and betweenRelistP.time > unsoldListR.time
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
            and betweenSale.id is null
            and laterSoldListP.id is null
            and laterSoldListR.id is null
            and betweenSoldRelistP.id is null
            and laterUnsoldL.id is null
            and laterUnsoldListP.id is null
            and laterUnsoldListR.id is null
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