const { executeQueries } = require("../db")

const getByUserId = async (userId) => {
    if (!userId) throw new Error(`Error: User Id required to query for `)

    let query = `
        select * items
        right join sale s1
        where purchaser is user
        and item not in (
            select * sales s2
            where item is item and s2.time after s1.time
        )
        and item not in (
            select * sales s2
            left join lot
            left join lotEdits le1
            left join inserts
            left join item
            where s2.time after s1.time
            and item not in (
                select * from lotEdit le2
                left join lotRemoval lr
                where le2.lotId = lotId
                and lr.itemId = itemId
                and le2.time after le1.time
                and le2.time before s2.time
            )
        )
    `
    const req = { queryQueue: [query] }
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

module.exports = { getByUserId }
