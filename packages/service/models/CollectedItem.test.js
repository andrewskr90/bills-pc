const { buildGetByIdQuery } = require('./CollectedItem')
const { 
    buildTestData, 
    daysAfterStart, 
    BPCT
} = require('../test')

const bpct = new BPCT() // init user
bpct.buildUsers(2) // create number of proxy users, default 1
const u = bpct.getUsers()
const it = bpct.getItems()
const p = bpct.getPrintings()
const c = bpct.getConditions()

// create first collected item
bpct.import().appraise(c[1].condition_id, u[0].user_id)
.list(10).price(15).removeListing()
.relist(13).price(25).sale(u[1].user_id)
.list(30).sale(u[2].user_id)
.list(35).sale(u[0].user_id)

// create second collected item
bpct.import(
    u[1].user_id,
    c[0].condition_id, 
    p[0].printing_id, 
    it[0].id
).appraise(c[1].condition_id, u[1].user_id)
.list(100).sale(u[0].user_id)
.list(110).price(160).removeListing()
.relist(140).price(60).sale(u[1].user_id)
.list(300).sale(u[2].user_id)

// create third collected item
const { collectedItem: thirdCollectedItem } = bpct.import()
bpct.createLot([thirdCollectedItem.id])
.edit([], [thirdCollectedItem.id])

bpct.createLot([thirdCollectedItem.id])
.list(16).sale(u[1].user_id)

// create fourth collected item
const { collectedItem: fourthCollectedItem } = bpct.import()
// create lot
bpct.createLot([fourthCollectedItem.id])
.list(16).edit([], [fourthCollectedItem.id]).sale(u[1].user_id)

// create fifth collected item
const { collectedItem: fifthCollectedItem } = bpct.import()
bpct.createLot([fifthCollectedItem.id])
.list(16).sale(u[1].user_id)
.list(16).sale(u[2].user_id)

// create sixth collected item
const sixthImport = bpct.import(
    u[1].user_id,
    c[0].condition_id, 
    p[0].printing_id, 
    it[0].id
)
bpct.createLot([sixthImport.collectedItem.id])
.list(12).sale(u[0].user_id)
.edit([], [sixthImport.collectedItem.id])
// TODO syntax enforces when an item can be added or removed from lot

bpct.createLot([sixthImport.collectedItem.id])
.edit([], [sixthImport.collectedItem.id])

const { collectedItem: seventhCollectedItem } = bpct.import()

const seventhLot = bpct.createLot([seventhCollectedItem.id])
.list(43).edit([sixthImport.collectedItem.id])

sixthImport.appraise(c[1].condition_id, u[0].user_id)

seventhLot.price(53).sale(u[2].user_id)

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

const { ci, lo } = bpct.compileAssets()

test('User imports item, no transactions', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[0].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[0].a[0].time)    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { id, item, printing, appraisal, listing, credit } = rows[0]
    expect(id).toEqual(ci[0].id)
    expect(item.id).toEqual(ci[0].itemId)
    expect(printing.id).toEqual(ci[0].printingId)
    expect(appraisal.id).toEqual(ci[0].a[0].id)
    expect(appraisal.condition.id).toEqual(ci[0].a[0].conditionId)
    expect(credit.import.id).toEqual(ci[0].i.id)
    expect(credit.listing.id).toBeNull()
    expect(credit.sale.id).toBeNull()
    expect(credit.sale.purchaser.id).toBeNull()
    expect(listing.id).toBeNull()
})

test('User imports item, appraises it, then creates listing', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[0].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[0].l[0].time)    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { appraisal, listing } = rows[0]
    expect(appraisal.id).toEqual(ci[0].a[1].id)
    expect(appraisal.condition.id).toEqual(ci[0].a[1].conditionId)
    expect(listing.id).toEqual(ci[0].l[0].id)
    expect(listing.removal.id).toBeNull()
})

test('adjusts price of listing', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[0].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[0].l[0].lp[0].time)    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.updatedPrice.price).toEqual(ci[0].l[0].lp[0].price)
})

test('removes listing', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[0].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[0].l[0].listR[0].time)    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.removal.id).toEqual(ci[0].l[0].listR[0].id)
    expect(listing.id).toEqual(ci[0].l[0].id)
    expect(listing.price).toBeNull()
    expect(listing.updatedPrice.price).toBeNull()
})

test('relists listing', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[0].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[0].l[0].lp[1].time)    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.removal.id).toBeNull()
    expect(listing.updatedPrice.price).toBeNull()
    expect(listing.price).toEqual(ci[0].l[0].lp[1].price)
    expect(listing.relisted.id).toEqual(ci[0].l[0].lp[1].id)
})

test('price adjusted for relisted listing', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[0].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[0].l[0].lp[2].time)    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.removal.id).toBeNull()
    expect(listing.updatedPrice.price).toEqual(ci[0].l[0].lp[2].price)
    expect(listing.price).toEqual(ci[0].l[0].lp[1].price)
    expect(listing.relisted.id).toEqual(ci[0].l[0].lp[1].id)
})

test('imported item sold', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[0].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[0].l[0].s.time)    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.removal.id).toBeNull()
    expect(listing.updatedPrice.price).toEqual(ci[0].l[0].lp[2].price)
    expect(listing.price).toEqual(ci[0].l[0].lp[1].price)
    expect(listing.relisted.id).toEqual(ci[0].l[0].lp[1].id)
    expect(sale.id).toEqual(ci[0].l[0].s.id)
    expect(sale.purchaser.id).toEqual(u[1].user_id)
})

test('sold imported item returns the correct purchaser id', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[0].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[0].l[1].s.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(ci[0].l[0].id)
    expect(sale.purchaser.id).toEqual(u[1].user_id)
})

// new item
test('purchased item', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[1].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[1].l[0].s.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { credit, listing, item, printing, appraisal } = rows[0]
    expect(listing.id).toBeNull()
    expect(item.id).toEqual(ci[1].itemId)
    expect(printing.id).toEqual(ci[1].printingId)
    expect(appraisal.id).toEqual(ci[1].a[1].id)
    expect(credit.listing.id).toEqual(ci[1].l[0].id)
    expect(credit.listing.price).toEqual(ci[1].l[0].price)
    expect(credit.import.id).toBeNull()
    expect(credit.sale.id).toEqual(ci[1].l[0].s.id)
})

test('purchased item listed', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[1].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[1].l[1].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(ci[1].l[1].id)
    expect(listing.price).toEqual(ci[1].l[1].price)
    expect(sale.id).toBeNull()
})
test('purchased item listing price updated', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[1].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[1].l[1].lp[0].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(ci[1].l[1].id)
    expect(listing.price).toEqual(ci[1].l[1].price)
    expect(listing.updatedPrice.price).toEqual(ci[1].l[1].lp[0].price)
    expect(sale.id).toBeNull()
})
test('purchased item listing removed', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[1].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[1].l[1].listR[0].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(ci[1].l[1].id)
    expect(listing.price).toBeNull()
    expect(listing.updatedPrice.price).toBeNull()
    expect(listing.removal.id).toEqual(ci[1].l[1].listR[0].id)
    expect(sale.id).toBeNull()
})
test('purchased item listing relisted', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[1].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[1].l[1].lp[1].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(ci[1].l[1].id)
    expect(listing.price).toEqual(ci[1].l[1].lp[1].price)
    expect(listing.updatedPrice.price).toBeNull()
    expect(listing.removal.id).toBeNull()
    expect(sale.id).toBeNull()
})
test('purchased item sold', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[1].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[1].l[1].s.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(ci[1].l[1].id)
    expect(listing.removal.id).toBeNull()
    expect(listing.price).toEqual(ci[1].l[1].lp[1].price)
    expect(listing.updatedPrice.price).toEqual(ci[1].l[1].lp[2].price)
    expect(sale.id).toEqual(ci[1].l[1].s.id)
    expect(sale.purchaser.id).toEqual(ci[1].l[1].s.purchaserId)
})

// new item
test('imported item added to lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[2].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[2].le[0].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { id, item, printing, appraisal, listing, credit, lot } = rows[0]
    expect(id).toEqual(ci[2].id)
    expect(item.id).toEqual(ci[2].itemId)
    expect(printing.id).toEqual(ci[2].printingId)
    expect(appraisal.id).toEqual(ci[2].a[0].id)
    expect(appraisal.condition.id).toEqual(ci[2].a[0].conditionId)
    expect(credit.import.id).toEqual(ci[2].i.id)
    expect(credit.listing.id).toBeNull()
    expect(credit.sale.id).toBeNull()
    expect(credit.sale.purchaser.id).toBeNull()
    expect(listing.id).toBeNull()
    expect(lot.id).toEqual(lo[0].id)
})
test('imported item removed from lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[2].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[2].le[1].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot } = rows[0]
    expect(lot.id).toBeNull()
})
test('imported item added to another lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[2].id, 
        u[0].user_id, 
        daysAfterStart(0.5, ci[2].le[2].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot } = rows[0]
    expect(lot.id).toEqual(lo[1].id)
})
test('imported item listed within lot', async () => {
    // thirdCollectedItem_firstListing
    const { query, variables } = buildGetByIdQuery(
        ci[2].id, 
        u[0].user_id, 
        daysAfterStart(0.5, lo[1].l[0].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot, listing } = rows[0]
    expect(lot.id).toEqual(lo[1].id)
    expect(listing.id).toEqual(lo[1].l[0].id)
})
test('imported item sold within lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[2].id, 
        u[0].user_id, 
        daysAfterStart(0.5, lo[1].l[0].s.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale, lot } = rows[0]
    expect(listing.id).toEqual(lo[1].l[0].id)
    expect(lot.id).toEqual(lo[1].id)
    expect(lot.edit.id).toEqual(lo[1].le[0].id)
    expect(sale.id).toEqual(lo[1].l[0].s.id)
    expect(sale.purchaser.id).toEqual(u[1].user_id)
})

test('item removed from lot before lot sold is still marked unsold', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[3].id, 
        u[0].user_id, 
        daysAfterStart(0.5, lo[2].l[0].s.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale, lot, credit } = rows[0]
    expect(listing.id).toBeNull()
    expect(lot.id).toBeNull()
    expect(lot.edit.id).toBeNull()
    expect(sale.id).toBeNull()
    expect(sale.purchaser.id).toBeNull()
    expect(credit.import.id).toEqual(ci[3].i.id)
})
test('only most recent sold lot listing is returned', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[4].id, 
        u[0].user_id, 
        daysAfterStart(0.5, lo[3].l[1].s.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale, lot, credit } = rows[0]
    expect(listing.id).toEqual(lo[3].l[0].id)
    expect(lot.id).toEqual(lo[3].id)
    expect(lot.edit.id).toEqual(lo[3].le[0].id)
    expect(sale.id).toEqual(lo[3].l[0].s.id)
    expect(sale.purchaser.id).toEqual(u[1].user_id)
    expect(credit.import.id).toEqual(ci[4].i.id)
})

// new item
test('purchased item within lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[5].id, 
        u[0].user_id, 
        daysAfterStart(0.5, lo[4].l[0].s.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { credit, lot } = rows[0]
    expect(credit.listing.id).toEqual(lo[4].l[0].id)
    expect(credit.listing.price).toEqual(lo[4].l[0].price)
    expect(credit.sale.id).toEqual(lo[4].l[0].s.id)
    expect(credit.sale.purchaser.id).toEqual(u[0].user_id)
    expect(credit.lot.id).toEqual(lo[4].id)
    expect(lot.id).toEqual(lo[4].id)
})
test('purchased lot item removed from purchased lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[5].id, 
        u[0].user_id, 
        daysAfterStart(0.5, lo[4].le[1].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot } = rows[0]
    expect(lot.id).toBeNull()
})
test('purchased lot item added to another lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[5].id, 
        u[0].user_id, 
        daysAfterStart(0.5, lo[5].le[0].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot, credit } = rows[0]
    expect(credit.lot.id).toEqual(lo[4].id)
    expect(lot.id).toEqual(lo[5].id)
})
test('purchased lot item removed from lot, then added to another lot already listed', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[5].id, 
        u[0].user_id, 
        daysAfterStart(0.5, lo[6].le[1].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot, credit, listing, sale } = rows[0]
    expect(credit.lot.id).toEqual(lo[4].id)
    expect(lot.id).toEqual(lo[6].id)
    expect(listing.id).toEqual(lo[6].l[0].id)
    expect(sale.id).toBeNull()
})
test('purchased lot item sold within listed lot, with correct appraisal and price', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[5].id, 
        u[0].user_id, 
        daysAfterStart(0.5, lo[6].l[0].s.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot, appraisal, listing, sale } = rows[0]
    expect(lot.id).toEqual(lo[6].id)
    expect(listing.id).toEqual(lo[6].l[0].id)
    expect(listing.updatedPrice.price).toEqual(lo[6].l[0].lp[0].price)
    expect(sale.id).toEqual(lo[6].l[0].s.id)
    expect(appraisal.id).toEqual(ci[5].a[1].id)
    expect(appraisal.condition.id).toEqual(ci[5].a[1].conditionId)
})
