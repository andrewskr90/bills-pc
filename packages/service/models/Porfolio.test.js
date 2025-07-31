const { buildGetPortfolioExperimental } = require('./Portfolio')
const { BPCT, uniqueCollectedItem, daysAfterStart } = require('../test')

const bpct = new BPCT() // init user
bpct.buildUsers(2) // create number of proxy users, default 1
const { u, it, p, c } = bpct.db()

// first, we wont worry about the current status (if its sold or if it was added to lot since the purchase)
// just worry about the acquisition

bpct.test('imported item that is not sold is present in portfolio', () => {
    // create data
    const { collectedItem, createdImport } = bpct.import()
    // build query
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, createdImport.time))
    // write check
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})


bpct.test('two imported items, added to lot, that are not sold are present in portfolio as lot items', () => {
    const { collectedItem: collectedItemA } = bpct.import()
    const { collectedItem: collectedItemB } = bpct.import()
    const { lotEdit } = bpct.createLot([collectedItemA.id, collectedItemB.id])

    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, lotEdit.time))
    const check = (rows) => {
        const filteredByCiId = rows.filter(row => {
            return row.id === collectedItemA.id
                || row.id === collectedItemB.id
        })
        expect(filteredByCiId.length).toEqual(2)
    }
    return { builtQuery, check }
})


bpct.test('purchasing previously imported item yeilds one instance of that item', () => {
    const { collectedItem, sale } = bpct.import().list(10).sale(u[1].user_id)
    .list(9).sale(u[2].user_id)
    .list(7).sale(u[0].user_id)

    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})


bpct.test('purchasing lot containing previously imported item yeilds one instance of that item', () => {
    const { collectedItem } = bpct.import().list(5).sale(u[1].user_id)
    const { sale } = bpct.createLot([collectedItem.id])
        .list(4).sale(u[0].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})
bpct.test('purchasing previously purchased item yeilds one instance of that item', () => {
    const { collectedItem, sale } = bpct.import()
        .list(5).sale(u[1].user_id)
        .list(6).sale(u[2].user_id)
        .list(7).sale(u[1].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[1].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})
bpct.test('purchasing lot containing previously purchased item yeilds one instance of that item', () => {
    const { collectedItem } = bpct.import()
        .list(5).sale(u[1].user_id)
        .list(6).sale(u[2].user_id)
    const { sale } = bpct.createLot([collectedItem.id])
        .list(7).sale(u[1].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[1].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})
bpct.test('purchasing previously purchased lot item yeilds one instance of that item', () => {
    const { collectedItem } = bpct.import()
    const { lot } = bpct.createLot([collectedItem.id])
        .list(5).sale(u[1].user_id)
        .list(6).sale(u[2].user_id)
    bpct.createLotEdit(lot.id, [], [collectedItem.id])
    const { sale } = bpct.listItem(collectedItem.id, 10).sale(u[1].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[1].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})
bpct.test('purchasing lot containing previously purchased lot item yeilds one instance of that item', () => {
    const { collectedItem } = bpct.import()
    const { lot: lotA } = bpct.createLot([collectedItem.id])
        .list(5).sale(u[1].user_id)
        .list(6).sale(u[2].user_id)
    bpct.createLotEdit(lotA.id, [], [collectedItem.id])

    const { sale } = bpct.createLot([collectedItem.id])
        .list(5).sale(u[1].user_id)

    const builtQuery = buildGetPortfolioExperimental(u[1].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})
bpct.test(
    `previously imported item, previously purchased lot item, 
    and brand new item are purchased within a new lot`, 
    () => {
        const { collectedItem: collectedItemA } = bpct.import()
            .list(4).sale(u[2].user_id)
        const { collectedItem: collectedItemB } = bpct.import(
            u[1].user_id,
            c[0].condition_id, 
            p[0].printing_id, 
            it[0].id
        )
        const { lot: lotA } = bpct.createLot([collectedItemB.id])
            .list(60).sale(u[0].user_id)
            .list(50).sale(u[2].user_id)
        bpct.createLotEdit(lotA.id, [], [collectedItemB.id])
        const { collectedItem: collectedItemC } = bpct.import(
            u[2].user_id,
            c[0].condition_id, 
            p[0].printing_id, 
            it[0].id
        )
        const { sale } = bpct.createLot([
            collectedItemA.id,
            collectedItemB.id,
            collectedItemC.id
        ]).list(20).sale(u[0].user_id)

        const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, sale.time))
        const check = (rows) => {
            expect(uniqueCollectedItem(rows, collectedItemA.id)).toBeTruthy()
            expect(uniqueCollectedItem(rows, collectedItemB.id)).toBeTruthy()
            expect(uniqueCollectedItem(rows, collectedItemC.id)).toBeTruthy()
        }
        return { builtQuery, check }
    }
)


bpct.test('imported item that is sold is not present in portfolio', 
    () => {
        const { collectedItem, sale } = bpct.import().list(13).sale(u[1].user_id)
        const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, sale.time))
        const check = (rows) => {
            const filteredByCiId = rows.filter(row => row.id === collectedItem.id)
            expect(filteredByCiId.length).toEqual(0)
        }
        return { builtQuery, check }
    }
)

bpct.test('imported item, added to lot, that is sold is not present in portfolio', () => {
    const { collectedItem } = bpct.import()
    const { sale } = bpct.createLot([collectedItem.id]).list(200).sale(u[1].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        const filteredByCiId = rows.filter(row => row.id === collectedItem.id)
        expect(filteredByCiId.length).toEqual(0)
    }
    return { builtQuery, check }
})

bpct.test('imported item, added to lot, removed from lot, is still in portfolio after the lot sells', () => {
    const { collectedItem } = bpct.import()
    const { collectedItem: collectedItemB } = bpct.import()
    const lot = bpct.createLot([collectedItem.id, collectedItemB.id])
    lot.edit([], [collectedItem.id])
    const { sale } = lot.list(200).sale(u[1].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        const filteredByCiId = rows.filter(row => row.id === collectedItem.id)
        expect(filteredByCiId.length).toEqual(1)
    }
    return { builtQuery, check }
})

bpct.test('item sold within lot, which is removed after the sale, is not present within portfolio',
    () => {
        const { collectedItem } = bpct.import()
        const soldLot = bpct.createLot([collectedItem.id]).list(200).sale(u[1].user_id)
        const { lotEdit } = soldLot.edit([], [collectedItem.id])
        const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, lotEdit.time))
        
        const check = (rows) => {
            const filteredByCiId = rows.filter(row => row.id === collectedItem.id)
            expect(filteredByCiId.length).toEqual(0)
        }
        return { builtQuery, check }
    }
)
bpct.test(`purchased lot item, removed from lot, added to another lot which sells, 
    then is removed by purchaser is not present in portfolio`,
    () => {
        const { collectedItem } = bpct.import(
            u[1].user_id,
            c[0].condition_id, 
            p[0].printing_id, 
            it[0].id
        )
        const soldLot = bpct.createLot([collectedItem.id]).list(2).sale(u[0].user_id)
        soldLot.edit([], [collectedItem.id])
        const soldAnotherLot = bpct.createLot([collectedItem.id]).list(3).sale(u[2].user_id)
        const { lotEdit: lotEditAgain } = soldAnotherLot.edit([], [collectedItem.id])
        const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, lotEditAgain.time))
        
        const check = (rows) => {
            const filteredByCiId = rows.filter(row => row.id === collectedItem.id)
            expect(filteredByCiId.length).toEqual(0)
        }
        return { builtQuery, check }
    }
)

// TODO I think I will forget to run this every new test file
bpct.runTests()
