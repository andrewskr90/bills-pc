const { executeQueries } = require("../db")
const { parseThenFormatAppraisals } = require("../middleware/collected-item-middleware")

const timeWithBackticks = '`time`'


const getByUserId = async (userId) => {
    if (!userId) throw new Error(`Error: User Id required to query for `)

    let query = `
        select 
            ci1.id as collectedItemId,
            ci1.printingId,
            i.id as itemId,
            i.name,
            i.tcgpId,
            GROUP_CONCAT('[', UNIX_TIMESTAMP(a.time), ',', a.conditionId, ',', a.appraiserId, ']' ORDER BY a.time DESC SEPARATOR ',') as appraisals
        from V3_CollectedItem ci1
        LEFT JOIN Item i on i.id = ci1.itemId
        LEFT JOIN V3_Appraisal a on a.collectedItemId = ci1.id
        WHERE ci1.id in (
            -- bought item
            SELECT 
                ci2.id 
            from V3_Listing l1
            right JOIN V3_CollectedItem ci2 on ci2.id = l1.collectedItemId
            right JOIN V3_Sale s1 on s1.id = l1.saleId
            WHERE s1.id is not null
            and ci2.id = ci1.id
            and s1.purchaserId = '${userId}'
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
            and ci2.id not in ( -- which was not removed
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
            )
        )
        GROUP BY ci1.id;
    `
    const req = { queryQueue: [query] }
    const res = {}
    try {
        let portfolio
        await executeQueries(req, res, (err) => {
            if (err) throw new Error(err)
            portfolio = req.results
        })
        return portfolio.map(portfolioItem => ({
            ...portfolioItem,
            appraisals: parseThenFormatAppraisals(portfolioItem.appraisals)
        }))
    } catch (err) {
        throw err
    }
}

module.exports = { getByUserId }
