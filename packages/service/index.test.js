const { buildGetByIdQuery } = require('./models/CollectedItem')
const { v4: uuid } = require('uuid')
const { 
    testItems, 
    testPrintings, 
    testConditions, 
    buildTestData, 
    daysAfterStart, 
    BPCT
} = require('./test')

const { testPool } = globalThis
let connection = undefined

// collectionBuilder(
    
// )

// ci(u(),i(),p(),a())

// bpt.import()
// bpct.u.filter(u => u.proxyCreatorId)[0]
// buildTransactions(
//     import(ci),
//     ci(),
//     li(),
//     lp(),
//     s(),
//     relist(),
//     le(),

// )

// const bpct = bptcInit(
//     createUsers()
// )

// create users 
// create collected items
// create transactions in order


// bpct.ci[0].i // import of first collected item
// bpct.ci[0].a[0]
// bpct.li[0].lp[0] // first listing price of first listing
// bpct.li[0].listR[0]


// const bpct = initSnapshot({}) // create ci, import, first appraisal
//     .newSnapshot() // each additional method is an event occuring after the prev and before the next.
//     .l() // multiple transactions can occur during each snapshot... maybe
//     .lr() 

// 3 users independantly import items into their collection
// transactions intertwice between the 3, at times only 2 are interacting while the 3 is doing their own thing
// test config generation clearly shows where items are at any given time
// it rejects creating a lot when an item is clearly elsewhere in its transaction lifecycle


// const user1Transactions = ['import', 'appraisal', 'listing']

// import = ci.import({ importerId: 123 })

// listing = import.listing({ price: 12 })

// import   listing sale
//      import      purchase    lotInsert
//          import

// const ci1 = import().appraisal().listing() // time is not required. This config will be passed into a generator which  will auto calc the time

const bpct = new BPCT(uuid()) // init user
bpct.buildUsers(2) // create number of proxy users, default 1
const users = bpct.getUsers()
const user = users[0]
const proxyUser1 = users[1]
const proxyUser2 = users[2]

// create first collected item
const { collectedItem: firstCollectedItem, createdImport: firstCollectedItemImport,  appraisal: firstCollectedItemFirstAppraisal } = bpct.import(
    testItems[0].id, 
    testPrintings[0].printing_id, 
    testConditions[0].condition_id, 
    user.user_id
)
const { id: firstCollectedItemId } = bpct.getCollectedItems()[0]
const firstCollectedItemSecondAppraisal = bpct.appraise(firstCollectedItemId, testConditions[1].condition_id, user.user_id)
const firstCollectedItemFirstListing = bpct.listItem(firstCollectedItemId, 10)
const firstItemFirstListingPrice = bpct.priceListing(firstCollectedItemFirstListing.id, firstCollectedItemFirstListing.price + 5)
const firstItemFirstListingRemoval = bpct.removeListing(firstCollectedItemFirstListing.id)
const firstItemSecondListingPrice = bpct.priceListing(firstCollectedItemFirstListing.id, firstItemFirstListingPrice.price-2)
const firstItemThirdListingPrice = bpct.priceListing(firstCollectedItemFirstListing.id, firstItemFirstListingPrice.price+10)
const firstItemFirstListingSale = bpct.sale(firstCollectedItemFirstListing.id, proxyUser1.user_id)
const firstItemSecondListing = bpct.listItem(firstCollectedItemId, 30)
bpct.sale(firstItemSecondListing.id, proxyUser2.user_id)
const firstItemThirdListing = bpct.listItem(firstCollectedItemId, 35)
bpct.sale(firstItemThirdListing.id, user.user_id)

// create second collected item
bpct.import(
    testItems[0].id, 
    testPrintings[0].printing_id, 
    testConditions[0].condition_id, 
    proxyUser1.user_id
)
const { id: secondCollectedItemId } = bpct.getCollectedItems()[1]
bpct.appraise(secondCollectedItemId, testConditions[1].condition_id, proxyUser1.user_id)
const secondItemFirstListing = bpct.listItem(secondCollectedItemId, 100)
bpct.sale(secondItemFirstListing.id, user.user_id)
const secondItemSecondListing = bpct.listItem(secondCollectedItemId, 110)
const secondItemSecondListingFirstPrice = bpct.priceListing(secondItemSecondListing.id, secondItemSecondListing.price + 50)
bpct.removeListing(secondItemSecondListing.id)
const secondItemSecondListingFirstRelisting = bpct.priceListing(secondItemSecondListing.id, secondItemSecondListingFirstPrice.price - 20)
bpct.priceListing(secondItemSecondListing.id, secondItemSecondListingFirstRelisting.price - 80)
bpct.sale(secondItemSecondListing.id, proxyUser1.user_id)
const secondItemThirdListing = bpct.listItem(secondCollectedItemId, 300)
bpct.sale(secondItemThirdListing.id, proxyUser2.user_id)

// create third collected item
const { collectedItem: thirdCollectedItem, createdImport: thirdCollectedItemImport } = bpct.import(
    testItems[0].id, 
    testPrintings[0].printing_id, 
    testConditions[0].condition_id, 
    user.user_id
)
const thirdCollectedItemLotItem = { collectedItemId: thirdCollectedItem.id }
const { lot: thirdCollectedItemFirstLot, lotEdit: thirdCollectedItemFirstLotEdit } = bpct.createLot([thirdCollectedItemLotItem]) // first insert
const { lotEdit: thirdCollectedItemSecondLotEdit } = bpct.createLotEdit(thirdCollectedItemFirstLot.id, [], [thirdCollectedItemLotItem]) // first removal
const { lot: thirdCollectedItemSecondLot, lotEdit: thirdCollectedItemThirdLotEdit } = bpct.createLot([thirdCollectedItemLotItem]) // first insert
const thirdCollectedItemLotFirstListing = bpct.listLot(thirdCollectedItemSecondLot.id, 16)
const thirdCollectedItemLotFirstSale = bpct.sale(thirdCollectedItemLotFirstListing.id, proxyUser1.user_id)

// create fourth collected item
const { collectedItem: fourthCollectedItem, createdImport: fourthCollectedItemImport } = bpct.import(
    testItems[0].id, 
    testPrintings[0].printing_id, 
    testConditions[0].condition_id, 
    user.user_id
)
// create lot
const fourthCollectedItemLotItem = { collectedItemId: fourthCollectedItem.id }
const { lot: fourthCollectedItemFirstLot } = bpct.createLot([fourthCollectedItemLotItem])
// list lot
const fourthCollectedItemLotFirstListing = bpct.listLot(fourthCollectedItemFirstLot.id, 16)
// remove from lot
bpct.createLotEdit(fourthCollectedItemFirstLot.id, [], [fourthCollectedItemLotItem])
// sell lot
const fourthCollectedItemLotFirstSale = bpct.sale(fourthCollectedItemLotFirstListing.id, proxyUser1.user_id)

// create fifth collected item
const { collectedItem: fifthCollectedItem, createdImport: fifthCollectedItemImport } = bpct.import(
    testItems[0].id, 
    testPrintings[0].printing_id, 
    testConditions[0].condition_id, 
    user.user_id
)
// create lot
const fifthCollectedItemLotItem = { collectedItemId: fifthCollectedItem.id }
const { lot: fifthCollectedItemFirstLot, lotEdit: fifthCollectedItemLotFirstLotEdit } = bpct.createLot([fifthCollectedItemLotItem])
// list lot
const fifthCollectedItemLotFirstListing = bpct.listLot(fifthCollectedItemFirstLot.id, 16)
// sell lot
const fifthCollectedItemLotFirstSale = bpct.sale(fifthCollectedItemLotFirstListing.id, proxyUser1.user_id)
// list lot, next user
const fifthCollectedItemLotSecondListing = bpct.listLot(fifthCollectedItemFirstLot.id, 16)
// sell lot to third user
const fifthCollectedItemLotSecondSale = bpct.sale(fifthCollectedItemLotSecondListing.id, proxyUser2.user_id)

// create sixth collected item
const { collectedItem: sixthCollectedItem } = bpct.import(
    testItems[0].id, 
    testPrintings[0].printing_id, 
    testConditions[0].condition_id, 
    proxyUser1.user_id
)
// proxy user1 creates lot and lists it
const sixthCollectedItemLotItem = { collectedItemId: sixthCollectedItem.id }
const { lot: sixthCollectedItemFirstLot, lotEdit: sixthCollectedItemLotFirstLotEdit } = bpct.createLot([sixthCollectedItemLotItem])
const sixthCollectedItemLotFirstListing = bpct.listLot(sixthCollectedItemFirstLot.id, 12)
// user purchases lot
const sixthCollectedItemLotFirstSale = bpct.sale(sixthCollectedItemLotFirstListing.id, user.user_id)
// removes item from lot
const { lotEdit: sixthCollectedItemFirstLotSecondLotEdit } = bpct.createLotEdit(sixthCollectedItemFirstLot.id, [], [sixthCollectedItemLotItem])
// adds item to another lot
const { lot: sixthCollectedItemSecondLot, lotEdit: sixthCollectedItemSecondLotFirstLotEdit } = bpct.createLot([sixthCollectedItemLotItem])
// removes item from lot
bpct.createLotEdit(sixthCollectedItemSecondLot.id, [], [sixthCollectedItemLotItem])
// create a separate lot item and lot, then list it
const { collectedItem: seventhCollectedItem } = bpct.import(
    testItems[0].id, 
    testPrintings[0].printing_id, 
    testConditions[0].condition_id, 
    user.user_id
)
const seventhCollectedItemLotItem = { collectedItemId: seventhCollectedItem.id }
const { lot: seventhCollectedItemFirstLot } = bpct.createLot([seventhCollectedItemLotItem])
const seventhCollectedItemFirstLotFirstListing = bpct.listLot(seventhCollectedItemFirstLot.id, 43)
// adds item to another listed lot
const { lotEdit: sixthCollectedItemSecondLotFirstEdit } = bpct.createLotEdit(seventhCollectedItemFirstLot.id, [sixthCollectedItemLotItem])
// appraise sixth item, changes price of listing
const sixthCollectedItemFirstAppraisal = bpct.appraise(sixthCollectedItem.id, testConditions[1].condition_id, user.user_id)
const seventhCollectedItemFirstListingFirstPricing = bpct.priceListing(seventhCollectedItemFirstLotFirstListing.id, seventhCollectedItemFirstLotFirstListing.price + 10)
// sells lot
const seventhCollectedItemLotFirstSale = bpct.sale(seventhCollectedItemFirstLotFirstListing.id, proxyUser2.user_id)

const u = bpct.getUsers()
const ci = bpct.getCollectedItems()
const i = bpct.getImports()
const a = bpct.getAppraisals()
const l = bpct.getListings()
const lp = bpct.getListingPrices()
const listR = bpct.getListingRemovals()
const s = bpct.getSales()
const lo = bpct.getLots()
const le = bpct.getLotEdits()
const li = bpct.getLotInserts()
const lr = bpct.getLotRemovals()

// TODO incrementing id is something I'll forget to do when creating dummy data, maybe create a util
beforeAll(async () => {
    connection = await testPool.getConnection()
    await connection.query('START TRANSACTION')
    await buildTestData([
        ...u.map(data => ({ data, table: 'users' })),
        ...ci.map(data => ({ data, table: 'V3_CollectedItem' })),
        ...i.map(data => ({ data, table: 'V3_Import' })),
        ...a.map(data => ({ data, table: 'V3_Appraisal' })),
        ...lo.map(data => ({ data, table: 'V3_Lot' })),
        ...le.map(data => ({ data, table: 'V3_LotEdit' })),
        ...li.map(data => ({ data, table: 'V3_LotInsert' })),        
        ...lr.map(data => ({ data, table: 'V3_LotRemoval' })),        
        ...s.map(data => ({ data, table: 'V3_Sale' })),
        ...l.map(data => ({ data, table: 'V3_Listing' })),
        ...lp.map(data => ({ data, table: 'V3_ListingPrice' })),
        ...listR.map(data => ({ data, table: 'V3_ListingRemoval' })),
    ], connection)
})
afterAll(async () => {
    await connection.rollback()
    await connection.release()
})

// ci[0].l[0].lp[1]
// ci[0].l[0].s

test('User imports item, no transactions', async () => {
    const { query, variables } = buildGetByIdQuery(
        firstCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstCollectedItemFirstAppraisal.time)
    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { id, item, printing, appraisal, listing, credit } = rows[0]
    expect(id).toEqual(firstCollectedItem.id)
    expect(item.id).toEqual(firstCollectedItem.itemId)
    expect(printing.id).toEqual(firstCollectedItem.printingId)
    expect(appraisal.id).toEqual(firstCollectedItemFirstAppraisal.id)
    expect(appraisal.condition.id).toEqual(firstCollectedItemFirstAppraisal.conditionId)
    expect(credit.import.id).toEqual(firstCollectedItemImport.id)
    expect(credit.listing.id).toBeNull()
    expect(credit.sale.id).toBeNull()
    expect(credit.sale.purchaser.id).toBeNull()
    expect(listing.id).toBeNull()
})

test('User imports item, appraises it, then creates listing', async () => {
    const { query, variables } = buildGetByIdQuery(
        firstCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstCollectedItemFirstListing.time)
    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { appraisal, listing } = rows[0]
    expect(appraisal.id).toEqual(firstCollectedItemSecondAppraisal.id)
    expect(appraisal.condition.id).toEqual(firstCollectedItemSecondAppraisal.conditionId)
    expect(listing.id).toEqual(firstCollectedItemFirstListing.id)
    expect(listing.removal.id).toBeNull()
})

test('adjusts price of listing', async () => {
    const { query, variables } = buildGetByIdQuery(
        firstCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstItemFirstListingPrice.time)
    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.updatedPrice.price).toEqual(firstItemFirstListingPrice.price)
})

test('removes listing', async () => {
    const { query, variables } = buildGetByIdQuery(
        firstCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstItemFirstListingRemoval.time)
    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.removal.id).toEqual(firstItemFirstListingRemoval.id)
    expect(listing.id).toEqual(firstCollectedItemFirstListing.id)
    expect(listing.price).toBeNull()
    expect(listing.updatedPrice.price).toBeNull()
})

test('relists listing', async () => {
    const { query, variables } = buildGetByIdQuery(
        firstCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstItemSecondListingPrice.time)
    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.removal.id).toBeNull()
    expect(listing.updatedPrice.price).toBeNull()
    expect(listing.price).toEqual(firstItemSecondListingPrice.price)
    expect(listing.relisted.id).toEqual(firstItemSecondListingPrice.id)
})

test('price adjusted for relisted listing', async () => {
    const { query, variables } = buildGetByIdQuery(
        firstCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstItemThirdListingPrice.time)
    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.removal.id).toBeNull()
    expect(listing.updatedPrice.price).toEqual(firstItemThirdListingPrice.price)
    expect(listing.price).toEqual(firstItemSecondListingPrice.price)
    expect(listing.relisted.id).toEqual(firstItemSecondListingPrice.id)
})

test('imported item sold', async () => {
    const { query, variables } = buildGetByIdQuery(
        firstCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, s[0].time)
    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.removal.id).toBeNull()
    expect(listing.updatedPrice.price).toEqual(firstItemThirdListingPrice.price)
    expect(listing.price).toEqual(firstItemSecondListingPrice.price)
    expect(listing.relisted.id).toEqual(firstItemSecondListingPrice.id)
    expect(sale.id).toEqual(firstItemFirstListingSale.id)
    expect(sale.purchaser.id).toEqual(proxyUser1.user_id)
})

test('sold imported item returns the correct purchaser id', async () => {
    const { query, variables } = buildGetByIdQuery(
        firstCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, s[1].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(l[0].id)
    expect(sale.purchaser.id).toEqual(proxyUser1.user_id)
})

// new item
test('purchased item', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[1].id, 
        user.user_id, 
        daysAfterStart(0.5, s[3].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { credit, listing, item, printing, appraisal } = rows[0]
    expect(listing.id).toBeNull()
    expect(item.id).toEqual(ci[1].itemId)
    expect(printing.id).toEqual(ci[1].printingId)
    expect(appraisal.id).toEqual(a[3].id)
    expect(credit.listing.id).toEqual(l[3].id)
    expect(credit.listing.price).toEqual(l[3].price)
    expect(credit.import.id).toBeNull()
    expect(credit.sale.id).toEqual(s[3].id)
})

test('purchased item listed', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[1].id, 
        user.user_id, 
        daysAfterStart(0.5, l[4].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(l[4].id)
    expect(listing.price).toEqual(l[4].price)
    expect(sale.id).toBeNull()
})
test('purchased item listing price updated', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[1].id, 
        user.user_id, 
        daysAfterStart(0.5, lp[3].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(l[4].id)
    expect(listing.price).toEqual(l[4].price)
    expect(listing.updatedPrice.price).toEqual(lp[3].price)
    expect(sale.id).toBeNull()
})
test('purchased item listing removed', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[1].id, 
        user.user_id, 
        daysAfterStart(0.5, listR[1].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(l[4].id)
    expect(listing.price).toBeNull()
    expect(listing.updatedPrice.price).toBeNull()
    expect(listing.removal.id).toEqual(listR[1].id)
    expect(sale.id).toBeNull()
})
test('purchased item listing relisted', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[1].id, 
        user.user_id, 
        daysAfterStart(0.5, lp[4].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(l[4].id)
    expect(listing.price).toEqual(lp[4].price)
    expect(listing.updatedPrice.price).toBeNull()
    expect(listing.removal.id).toBeNull()
    expect(sale.id).toBeNull()
})
test('purchased item sold', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[1].id, 
        user.user_id, 
        daysAfterStart(0.5, s[5].time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(l[4].id)
    expect(listing.removal.id).toBeNull()
    expect(listing.price).toEqual(lp[4].price)
    expect(listing.updatedPrice.price).toEqual(lp[5].price)
    expect(sale.id).toEqual(s[4].id)
    expect(sale.purchaser.id).toEqual(s[4].purchaserId)
})

// new item
test('imported item added to lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[2].id, 
        user.user_id, 
        daysAfterStart(0.5, thirdCollectedItemFirstLotEdit.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { id, item, printing, appraisal, listing, credit, lot } = rows[0]
    expect(id).toEqual(ci[2].id)
    expect(item.id).toEqual(ci[2].itemId)
    expect(printing.id).toEqual(ci[2].printingId)
    expect(appraisal.id).toEqual(a[4].id)
    expect(appraisal.condition.id).toEqual(a[4].conditionId)
    expect(credit.import.id).toEqual(thirdCollectedItemImport.id)
    expect(credit.listing.id).toBeNull()
    expect(credit.sale.id).toBeNull()
    expect(credit.sale.purchaser.id).toBeNull()
    expect(listing.id).toBeNull()
    expect(lot.id).toEqual(thirdCollectedItemFirstLot.id)
})
test('imported item removed from lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[2].id, 
        user.user_id, 
        daysAfterStart(0.5, thirdCollectedItemSecondLotEdit.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot } = rows[0]
    expect(lot.id).toBeNull()
})
test('imported item added to another lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[2].id, 
        user.user_id, 
        daysAfterStart(0.5, thirdCollectedItemThirdLotEdit.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot } = rows[0]
    expect(lot.id).toEqual(thirdCollectedItemSecondLot.id)
})
test('imported item listed within lot', async () => {
    // thirdCollectedItem_firstListing
    const { query, variables } = buildGetByIdQuery(
        ci[2].id, 
        user.user_id, 
        daysAfterStart(0.5, thirdCollectedItemLotFirstListing.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot, listing } = rows[0]
    expect(lot.id).toEqual(thirdCollectedItemSecondLot.id)
    expect(listing.id).toEqual(thirdCollectedItemLotFirstListing.id)
})
test('imported item sold within lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[2].id, 
        user.user_id, 
        daysAfterStart(0.5, thirdCollectedItemLotFirstSale.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale, lot } = rows[0]
    expect(listing.id).toEqual(thirdCollectedItemLotFirstListing.id)
    expect(lot.id).toEqual(thirdCollectedItemSecondLot.id)
    expect(lot.edit.id).toEqual(thirdCollectedItemThirdLotEdit.id)
    expect(sale.id).toEqual(thirdCollectedItemLotFirstSale.id)
    expect(sale.purchaser.id).toEqual(proxyUser1.user_id)
})

test('item removed from lot before lot sold is still marked unsold', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[3].id, 
        user.user_id, 
        daysAfterStart(0.5, fourthCollectedItemLotFirstSale.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale, lot, credit } = rows[0]
    expect(listing.id).toBeNull()
    expect(lot.id).toBeNull()
    expect(lot.edit.id).toBeNull()
    expect(sale.id).toBeNull()
    expect(sale.purchaser.id).toBeNull()
    expect(credit.import.id).toEqual(fourthCollectedItemImport.id)
})
test('only most recent sold lot listing is returned', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[4].id, 
        user.user_id, 
        daysAfterStart(0.5, fifthCollectedItemLotSecondSale.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale, lot, credit } = rows[0]
    expect(listing.id).toEqual(fifthCollectedItemLotFirstListing.id)
    expect(lot.id).toEqual(fifthCollectedItemFirstLot.id)
    expect(lot.edit.id).toEqual(fifthCollectedItemLotFirstLotEdit.id)
    expect(sale.id).toEqual(fifthCollectedItemLotFirstSale.id)
    expect(sale.purchaser.id).toEqual(proxyUser1.user_id)
    expect(credit.import.id).toEqual(fifthCollectedItemImport.id)
})

// new item
test('purchased item within lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[5].id, 
        user.user_id, 
        daysAfterStart(0.5, sixthCollectedItemLotFirstSale.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { credit, lot } = rows[0]
    expect(credit.listing.id).toEqual(sixthCollectedItemLotFirstListing.id)
    expect(credit.listing.price).toEqual(sixthCollectedItemLotFirstListing.price)
    expect(credit.sale.id).toEqual(sixthCollectedItemLotFirstSale.id)
    expect(credit.sale.purchaser.id).toEqual(user.user_id)
    expect(credit.lot.id).toEqual(sixthCollectedItemFirstLot.id)
    expect(lot.id).toEqual(sixthCollectedItemFirstLot.id)
})
test('purchased lot item removed from purchased lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[5].id, 
        user.user_id, 
        daysAfterStart(0.5, sixthCollectedItemFirstLotSecondLotEdit.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot } = rows[0]
    expect(lot.id).toBeNull()
})
test('purchased lot item added to another lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[5].id, 
        user.user_id, 
        daysAfterStart(0.5, sixthCollectedItemSecondLotFirstLotEdit.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot, credit } = rows[0]
    expect(credit.lot.id).toEqual(sixthCollectedItemFirstLot.id)
    expect(lot.id).toEqual(sixthCollectedItemSecondLot.id)
})
test('purchased lot item removed from lot, then added to another lot already listed', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[5].id, 
        user.user_id, 
        daysAfterStart(0.5, sixthCollectedItemSecondLotFirstEdit.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot, credit, listing, sale } = rows[0]
    expect(credit.lot.id).toEqual(sixthCollectedItemFirstLot.id)
    expect(lot.id).toEqual(seventhCollectedItemFirstLot.id)
    expect(listing.id).toEqual(seventhCollectedItemFirstLotFirstListing.id)
    expect(sale.id).toBeNull()
})
test('purchased lot item sold within listed lot, with correct appraisal and price', async () => {
    const { query, variables } = buildGetByIdQuery(
        ci[5].id, 
        user.user_id, 
        daysAfterStart(0.5, seventhCollectedItemLotFirstSale.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot, appraisal, listing, sale } = rows[0]
    expect(lot.id).toEqual(seventhCollectedItemFirstLot.id)
    expect(listing.id).toEqual(seventhCollectedItemFirstLotFirstListing.id)
    expect(listing.updatedPrice.price).toEqual(seventhCollectedItemFirstListingFirstPricing.price)
    expect(sale.id).toEqual(seventhCollectedItemLotFirstSale.id)
    expect(appraisal.id).toEqual(sixthCollectedItemFirstAppraisal.id)
    expect(appraisal.condition.id).toEqual(sixthCollectedItemFirstAppraisal.conditionId)
})

// before all
    // build entire collected item history
// after all
    //
// test - data stays the same, the time of the query changes

// acquired by import

// purchased

// purchased, having initially importing the item, then buying back from purchaser

// purchased, having previously purchased it before

// purchased, up to date listing status

// imported item, sold as lot

// purchased as lot, sold as item

// purchased as lot, sold within same lot

// purchased as lot, sold in different 

// listing price
// updated price
// relisted price

// price
// if













// earliest sold listing, or latest listing

// l1   lt1   snull
// l2   lt2   snull
// l3   lt3   s1
// l4   lt4   s2
// l5   lt5   snull
