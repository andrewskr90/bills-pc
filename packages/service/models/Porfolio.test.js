const { buildGetPortfolioExperimental } = require('./Portfolio')
const { 
    buildTestData, 
    BPCT
} = require('../test')

const bpct = new BPCT() // init user
bpct.buildUsers(2) // create number of proxy users, default 1
const u = bpct.getUsers()
const it = bpct.getItems()
const p = bpct.getPrintings()
const c = bpct.getConditions()

// first, we wont worry about the current status (if its sold or if it was added to lot since the purchase)
// just worry about the acquisition

const uniqueCollectedItem = (rows, collectedItemId) => {
    const filteredByCiId = rows.filter(row => row.collectedItemId === collectedItemId)
    if (filteredByCiId.length === 1) return true
    return false
}

const tests = []

const buildTestConfig = (testCase, check, params) => ({ testCase, check, params })

// create data
const firstImport = bpct.import(
    it[0].id, 
    p[0].printing_id, 
    c[0].condition_id, 
    u[0].user_id
)
// create test config
tests.push(buildTestConfig(
    'imported item that is not sold is present in portfolio', // test case
    (rows) => { // logic to check to make with returned rows
        expect(uniqueCollectedItem(rows, firstImport.collectedItem.id)).toBeTruthy()
    },
    [u[0].user_id] // params the query builder will take
))

const secondImport = bpct.import(
    it[0].id, 
    p[0].printing_id, 
    c[0].condition_id, 
    u[0].user_id
)
const thirdImport = bpct.import(
    it[0].id, 
    p[0].printing_id, 
    c[0].condition_id, 
    u[0].user_id
)
bpct.createLot([secondImport.collectedItem.id, thirdImport.collectedItem.id])

tests.push(buildTestConfig(
    'two imported items, added to lot, that are not sold are present in portfolio as lot items',
    (rows) => {
        const filteredByCiId = rows.filter(row => {
            return row.collectedItemId === secondImport.collectedItem.id
                || row.collectedItemId === thirdImport.collectedItem.id
        })
        expect(filteredByCiId.length).toEqual(2)
    },
    [u[0].user_id]
))

const fourthImport = bpct.import(
    it[0].id, 
    p[0].printing_id, 
    c[0].condition_id, 
    u[0].user_id
).list(10).sale(u[1].user_id)
.list(9).sale(u[2].user_id)
.list(7).sale(u[0].user_id)

tests.push(buildTestConfig(
    'purchasing previously imported item yeilds one instance of that item',
    (rows) => {
        expect(uniqueCollectedItem(rows, fourthImport.collectedItem.id)).toBeTruthy()
    },
    [u[0].user_id]
))

const fifthImport = bpct.import(
    it[0].id, 
    p[0].printing_id, 
    c[0].condition_id, 
    u[0].user_id
).list(5).sale(u[1].user_id)
bpct.createLot([fifthImport.collectedItem.id])
    .list(4).sale(u[0].user_id)

tests.push(buildTestConfig(
    'purchasing lot containing previously imported item yeilds one instance of that item',
    (rows) => {
        expect(uniqueCollectedItem(rows, fifthImport.collectedItem.id)).toBeTruthy()
    },
    [u[0].user_id]
))
tests.push(buildTestConfig('purchasing previously purchased item yeilds one instance of that item'))
tests.push(buildTestConfig('purchasing lot containing previously purchased item yeilds one instance of that item'))
tests.push(buildTestConfig('purchasing previously purchased lot item yeilds one instance of that item'))
tests.push(buildTestConfig('purchasing lot containing previously purchased lot item yeilds one instance of that item'))
tests.push(buildTestConfig('previously imported item, previously purchased lot item within new lot, and brand new item are purchased within a lot'))

// TODO once sale status is in query
// const secondImport = bpct.import(
//     it[0].id, 
//     p[0].printing_id, 
//     c[0].condition_id, 
//     u[0].user_id
// ).list(13).sale(u[1].user_id)

tests.push(buildTestConfig(
    'imported item that is sold is not present in portfolio',
// TODO once sale status is in query
//     (rows) => {
//         expect(rows.length).toEqual(1)
//         const filteredByCiId = rows.filter(row => row.collectedItemId === secondImport.collectedItem.id)
//         expect(filteredByCiId.length).toEqual(0)
//     },
//     [u[0].user_id]
))
tests.push(buildTestConfig('imported item, added to lot, that is sold is not present in portfolio'))
tests.push(buildTestConfig('imported item, added to lot, removed from lot, is still in portfolio after the lot sells'))
tests.push(buildTestConfig('item sold within lot, which is removed after the sale, appears to have been sold within the lot'))
tests.push(buildTestConfig('accurately conveys purchased lot item, removed from lot, added to lot which sells, then is removed by purchaser'))

let connection = undefined
beforeAll(async () => {
    const { testPool } = globalThis
    connection = await testPool.getConnection()
    await buildTestData(bpct, connection)
})
afterAll(async () => {
    await connection.rollback()
    await connection.release()
})

const runTests = (configs) => {
    configs.forEach(config => {
        const { testCase, check, params } = config
        if (check) {
            test(testCase, async () => {
                const { query, variables } = await buildGetPortfolioExperimental(...params)
                const [rows] = await connection.query(query, variables)
                check(rows)
            })
        } else {
            test.todo(testCase)
        }
    })
}

runTests(tests)
