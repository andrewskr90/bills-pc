const { buildGetPortfolioExperimental } = require('./Portfolio')
const { BPCT, uniqueCollectedItem } = require('../test')

const bpct = new BPCT() // init user
bpct.buildUsers(2) // create number of proxy users, default 1
const { u, it, p, c } = bpct.db()

// first, we wont worry about the current status (if its sold or if it was added to lot since the purchase)
// just worry about the acquisition

bpct.test('imported item that is not sold is present in portfolio', () => {
    // create data
    const { collectedItem } = bpct.import()
    // build query
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id)
    // write check
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})


bpct.test('two imported items, added to lot, that are not sold are present in portfolio as lot items', () => {
    const { collectedItem: collectedItemA } = bpct.import()
    const { collectedItem: collectedItemB } = bpct.import()
    bpct.createLot([collectedItemA.id, collectedItemB.id])

    const builtQuery = buildGetPortfolioExperimental(u[0].user_id)
    const check = (rows) => {
        const filteredByCiId = rows.filter(row => {
            return row.collectedItemId === collectedItemA.id
                || row.collectedItemId === collectedItemB.id
        })
        expect(filteredByCiId.length).toEqual(2)
    }
    return { builtQuery, check }
})


bpct.test('purchasing previously imported item yeilds one instance of that item', () => {
    const { collectedItem } = bpct.import().list(10).sale(u[1].user_id)
    .list(9).sale(u[2].user_id)
    .list(7).sale(u[0].user_id)

    const builtQuery = buildGetPortfolioExperimental(u[0].user_id)
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})


bpct.test('purchasing lot containing previously imported item yeilds one instance of that item', () => {
    const { collectedItem } = bpct.import().list(5).sale(u[1].user_id)
    bpct.createLot([collectedItem.id])
        .list(4).sale(u[0].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id)
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})
bpct.test('purchasing previously purchased item yeilds one instance of that item')
bpct.test('purchasing lot containing previously purchased item yeilds one instance of that item')
bpct.test('purchasing previously purchased lot item yeilds one instance of that item')
bpct.test('purchasing lot containing previously purchased lot item yeilds one instance of that item')
bpct.test('previously imported item, previously purchased lot item within new lot, and brand new item are purchased within a lot')


bpct.test('imported item that is sold is not present in portfolio', 
    // () => {
    //     // TODO once sale status is in query
    //     const secondImport = bpct.import().list(13).sale(u[1].user_id)
    //     const builtQuery = buildGetPortfolioExperimental(u[0].user_id)
    //     const check = (rows) => {
    //         const filteredByCiId = rows.filter(row => row.collectedItemId === secondImport.collectedItem.id)
    //         expect(filteredByCiId.length).toEqual(0)
    //     }
    //     return { builtQuery, check }
    // }
)

bpct.test('imported item, added to lot, that is sold is not present in portfolio')
bpct.test('imported item, added to lot, removed from lot, is still in portfolio after the lot sells')
bpct.test('item sold within lot, which is removed after the sale, appears to have been sold within the lot')
bpct.test('accurately conveys purchased lot item, removed from lot, added to lot which sells, then is removed by purchaser')

// TODO I think I will forget to run this every new test file
bpct.runTests()
