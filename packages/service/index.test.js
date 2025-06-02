const { buildGetByIdQuery } = require('./models/CollectedItem')
const { v4: uuid } = require('uuid')
const { 
    buildTestData, 
    daysAfterStart, 
    BPCT
} = require('./test')

const bpct = new BPCT(uuid()) // init user
bpct.buildUsers(2) // create number of proxy users, default 1
const u = bpct.getUsers()
const it = bpct.getItems()
const p = bpct.getPrintings()
const c = bpct.getConditions()

// create first collected item
bpct.import(
    it[0].id, 
    p[0].printing_id, 
    c[0].condition_id, 
    u[0].user_id
)
// .appraise(c[1].condition_id, u[0].user_id)
// .list(10)
// .price(15)
// .removeListing()
// .priceListing(13)
// .priceListing()
const { id: firstCollectedItemId } = bpct.getCollectedItems()[0]
bpct.appraise(firstCollectedItemId, c[1].condition_id, u[0].user_id)
const firstCollectedItemFirstListing = bpct.listItem(firstCollectedItemId, 10)
const firstItemFirstListingPrice = bpct.priceListing(firstCollectedItemFirstListing.id, firstCollectedItemFirstListing.price + 5)
bpct.removeListing(firstCollectedItemFirstListing.id)
bpct.priceListing(firstCollectedItemFirstListing.id, firstItemFirstListingPrice.price-2)
bpct.priceListing(firstCollectedItemFirstListing.id, firstItemFirstListingPrice.price+10)
bpct.sale(firstCollectedItemFirstListing.id, u[1].user_id)
const firstItemSecondListing = bpct.listItem(firstCollectedItemId, 30)
bpct.sale(firstItemSecondListing.id, u[2].user_id)
const firstItemThirdListing = bpct.listItem(firstCollectedItemId, 35)
bpct.sale(firstItemThirdListing.id, u[0].user_id)

// create second collected item
bpct.import(
    it[0].id, 
    p[0].printing_id, 
    c[0].condition_id, 
    u[1].user_id
)
const { id: secondCollectedItemId } = bpct.getCollectedItems()[1]
bpct.appraise(secondCollectedItemId, c[1].condition_id, u[1].user_id)
const secondItemFirstListing = bpct.listItem(secondCollectedItemId, 100)
bpct.sale(secondItemFirstListing.id, u[0].user_id)
const secondItemSecondListing = bpct.listItem(secondCollectedItemId, 110)
const secondItemSecondListingFirstPrice = bpct.priceListing(secondItemSecondListing.id, secondItemSecondListing.price + 50)
bpct.removeListing(secondItemSecondListing.id)
const secondItemSecondListingFirstRelisting = bpct.priceListing(secondItemSecondListing.id, secondItemSecondListingFirstPrice.price - 20)
bpct.priceListing(secondItemSecondListing.id, secondItemSecondListingFirstRelisting.price - 80)
bpct.sale(secondItemSecondListing.id, u[1].user_id)
const secondItemThirdListing = bpct.listItem(secondCollectedItemId, 300)
bpct.sale(secondItemThirdListing.id, u[2].user_id)

// create third collected item
const { collectedItem: thirdCollectedItem } = bpct.import(
    it[0].id, 
    p[0].printing_id, 
    c[0].condition_id, 
    u[0].user_id
)
const thirdCollectedItemLotItem = { collectedItemId: thirdCollectedItem.id }
const { 
    lot: thirdCollectedItemFirstLot, 
} = bpct.createLot([thirdCollectedItemLotItem]) // first insert
bpct.createLotEdit(thirdCollectedItemFirstLot.id, [], [thirdCollectedItemLotItem]) // first removal
const { lot: thirdCollectedItemSecondLot } = bpct.createLot([thirdCollectedItemLotItem]) // first insert
const thirdCollectedItemLotFirstListing = 
    bpct.listLot(thirdCollectedItemSecondLot.id, 16)
bpct.sale(thirdCollectedItemLotFirstListing.id, u[1].user_id)

// create fourth collected item
const { collectedItem: fourthCollectedItem } = bpct.import(
    it[0].id, 
    p[0].printing_id, 
    c[0].condition_id, 
    u[0].user_id
)
// create lot
const fourthCollectedItemLotItem = { collectedItemId: fourthCollectedItem.id }
const { lot: fourthCollectedItemFirstLot } = bpct.createLot([fourthCollectedItemLotItem])
// list lot
const fourthCollectedItemLotFirstListing = bpct.listLot(fourthCollectedItemFirstLot.id, 16)
// remove from lot
bpct.createLotEdit(fourthCollectedItemFirstLot.id, [], [fourthCollectedItemLotItem])
// sell lot
bpct.sale(fourthCollectedItemLotFirstListing.id, u[1].user_id)

// create fifth collected item
const { collectedItem: fifthCollectedItem } = bpct.import(
    it[0].id, 
    p[0].printing_id, 
    c[0].condition_id, 
    u[0].user_id
)
// create lot
const fifthCollectedItemLotItem = { collectedItemId: fifthCollectedItem.id }
const { lot: fifthCollectedItemFirstLot } = bpct.createLot([fifthCollectedItemLotItem])
// list lot
const fifthCollectedItemLotFirstListing = bpct.listLot(fifthCollectedItemFirstLot.id, 16)
// sell lot
bpct.sale(fifthCollectedItemLotFirstListing.id, u[1].user_id)
// list lot, next user
const fifthCollectedItemLotSecondListing = bpct.listLot(fifthCollectedItemFirstLot.id, 16)
// sell lot to third user
bpct.sale(fifthCollectedItemLotSecondListing.id, u[2].user_id)

// create sixth collected item
const { collectedItem: sixthCollectedItem } = bpct.import(
    it[0].id, 
    p[0].printing_id, 
    c[0].condition_id, 
    u[1].user_id
)
// proxy user1 creates lot and lists it
const sixthCollectedItemLotItem = { collectedItemId: sixthCollectedItem.id }
const { lot: sixthCollectedItemFirstLot } = bpct.createLot([sixthCollectedItemLotItem])
const sixthCollectedItemLotFirstListing = bpct.listLot(sixthCollectedItemFirstLot.id, 12)
// user purchases lot
bpct.sale(sixthCollectedItemLotFirstListing.id, u[0].user_id)
// removes item from lot
bpct.createLotEdit(sixthCollectedItemFirstLot.id, [], [sixthCollectedItemLotItem])
// adds item to another lot
const { lot: sixthCollectedItemSecondLot } = bpct.createLot([sixthCollectedItemLotItem])
// removes item from lot
bpct.createLotEdit(sixthCollectedItemSecondLot.id, [], [sixthCollectedItemLotItem])
// create a separate lot item and lot, then list it
const { collectedItem: seventhCollectedItem } = bpct.import(
    it[0].id, 
    p[0].printing_id, 
    c[0].condition_id, 
    u[0].user_id
)
const seventhCollectedItemLotItem = { collectedItemId: seventhCollectedItem.id }
const { lot: seventhCollectedItemFirstLot } = bpct.createLot([seventhCollectedItemLotItem])
const seventhCollectedItemFirstLotFirstListing = bpct.listLot(seventhCollectedItemFirstLot.id, 43)
// adds item to another listed lot
bpct.createLotEdit(seventhCollectedItemFirstLot.id, [sixthCollectedItemLotItem])
// appraise sixth item, changes price of listing
bpct.appraise(sixthCollectedItem.id, c[1].condition_id, u[0].user_id)
bpct.priceListing(seventhCollectedItemFirstLotFirstListing.id, seventhCollectedItemFirstLotFirstListing.price + 10)
// sells lot
bpct.sale(seventhCollectedItemFirstLotFirstListing.id, u[2].user_id)


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
