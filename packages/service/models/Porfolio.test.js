const { buildGetByIdQuery } = require('./CollectedItem')
const { 
    buildTestData, 
    BPCT
} = require('../test')

const bpct = new BPCT() // init user
bpct.buildUsers(2) // create number of proxy users, default 1

let connection = undefined
beforeAll(async () => {
    const { testPool } = globalThis
    connection = await testPool.getConnection()
    console.log(connection)
    await buildTestData(bpct, connection)
})
afterAll(async () => {
    await connection.rollback()
    await connection.release()
})

test('test', async () => {
    const [rows, fields] = await connection.query('select * from users;', [])
    console.log(rows)
    expect(rows.length).toEqual(3)
})