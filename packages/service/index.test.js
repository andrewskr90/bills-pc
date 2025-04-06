const QueryFormatters = require('./utils/queryFormatters')
const { buildGetByIdQuery } = require('./models/CollectedItem')
const { v4: uuid } = require('uuid')
const { testItems, testPrintings, testConditions, executeQueryQueue } = require('./test')

const { testPool } = globalThis
let connection = undefined
const testId = uuid()
const tableIds = {
    set: 'se',
    item: 'it',
    printing: 'p',
    condition: 'c',
    user: 'u',
    collectedItem: 'ci',
    import: 'i',
    appraisal: 'a',
    listing: 'l',
    listingPrice: 'lp',
    listingRemoval: 'lr',
    sale: 's'
}
const userBaseId = `-${tableIds.user}-${testId}`
const collectedItemBaseId = `-${tableIds.collectedItem}-${testId}`
const importBaseId = `-${tableIds.import}-${testId}`
const appraisalBaseId = `-${tableIds.appraisal}-${testId}`
const listingBaseId = `-${tableIds.listing}-${testId}`
const listingPriceBaseId = `-${tableIds.listingPrice}-${testId}`
const listingRemovalBaseId = `-${tableIds.listingRemoval}-${testId}`
const saleBaseId = `-${tableIds.sale}-${testId}`

const startISO = new Date().toISOString()
const daysAfterStart = (days, startISO) => {
    const startDate = new Date(startISO)
    const daysInt = Math.floor(days)
    let hours = 0
    if (days - daysInt > 0) hours = Math.floor(24*(days-daysInt))
    let unixDate = startDate.setDate(startDate.getDate()+days)
    if (hours > 0) unixDate = new Date(unixDate).setHours(startDate.getHours()+hours)
    return new Date(unixDate).toISOString().split('Z')[0]
}

const user = { user_id: '0'+userBaseId, user_name: '0'+userBaseId, user_password: '12345', user_role: 'Gym Leader' }
const proxyUser1 = { user_id: '1'+userBaseId, user_name: '1'+userBaseId, proxyCreatorId: user.user_id }
const collectedItem = { id: '0'+collectedItemBaseId, itemId: testItems[0].id, printingId: testPrintings[0].printing_id }
const import_collectedItem = { id: '0'+importBaseId, importerId: user.user_id, collectedItemId: collectedItem.id, time: daysAfterStart(0, startISO) }
const firstAppraisal = { id: '0'+appraisalBaseId, collectedItemId: collectedItem.id, conditionId: testConditions[0].condition_id, appraiserId: user.user_id, time: daysAfterStart(1, startISO) }
const secondAppraisal = { ...firstAppraisal, id: '1'+appraisalBaseId, conditionId: testConditions[1].condition_id, time: daysAfterStart(2, startISO) }
const firstListing = { id: '0'+listingBaseId, collectedItemId: collectedItem.id, saleId: null, price: 10, time: daysAfterStart(3, startISO) }
const firstPriceOfFirstListing = { id: '0'+listingPriceBaseId, listingId: firstListing.id, price: firstListing.price + 5, time: daysAfterStart(4, startISO) }
const firstRemovalOfFirstListing  = { id: '0'+listingRemovalBaseId, listingId: firstListing.id, time: daysAfterStart(5, startISO) }
const firstRelisting = { id: '1'+listingPriceBaseId, listingId: firstListing.id, price: firstPriceOfFirstListing.price -2, time: daysAfterStart(6, startISO) }
const firstPriceOfFirstRelisting = { id: '2'+listingPriceBaseId, listingId: firstListing.id, price: firstPriceOfFirstListing.price +10, time: daysAfterStart(7, startISO) }
// TODO incrementing id is something I'll forget to do when creating dummy data, maybe create a util
beforeAll(async () => {
    connection = await testPool.getConnection()
    await connection.query('START TRANSACTION')
    const insertUserQ = QueryFormatters.bpcQueryObjectsToInsert([user], 'users', [])
    const insertProxyUserQ = QueryFormatters.bpcQueryObjectsToInsert([proxyUser1], 'users', [])
    const insertCollectedItemsQ = QueryFormatters.bpcQueryObjectsToInsert([collectedItem], 'V3_CollectedItem', [])
    const insertImportsQ = QueryFormatters.bpcQueryObjectsToInsert([import_collectedItem], 'V3_Import', [])
    const firstAppraisalsQ = QueryFormatters.bpcQueryObjectsToInsert([firstAppraisal], 'V3_Appraisal', [])
    const secondAppraisalQ = QueryFormatters.bpcQueryObjectsToInsert([secondAppraisal],'V3_Appraisal', [])
    const firstListingQ = QueryFormatters.bpcQueryObjectsToInsert([firstListing], 'V3_Listing', [])
    const firstPriceOfFirstListingQ = QueryFormatters.bpcQueryObjectsToInsert([firstPriceOfFirstListing], 'V3_ListingPrice', [])
    const firstRemovalOfFirstListingQ = QueryFormatters.bpcQueryObjectsToInsert([firstRemovalOfFirstListing], 'V3_ListingRemoval', [])
    const firstRelistingQ = QueryFormatters.bpcQueryObjectsToInsert([firstRelisting], 'V3_ListingPrice', [])
    const firstPriceOfFirstRelistingQ = QueryFormatters.bpcQueryObjectsToInsert([firstPriceOfFirstRelisting], 'V3_ListingPrice', [])
    // const insertSaleQ = QueryFormatters.objectsToInsert([], 'V3_Sale')
    // const insertLotQ = QueryFormatters.objectsToInsert([], 'V3_Lot')
    // const insertLotEditQ = QueryFormatters.objectsToInsert([], 'V3_LotEdit')
    // const insertLotInsertQ = QueryFormatters.objectsToInsert([], 'V3_LotInsert')
    // const insertLotRemovalQ = QueryFormatters.objectsToInsert([], 'V3_LotRemoval')

    const queryQueue = [
        insertUserQ,
        insertProxyUserQ,
        insertCollectedItemsQ,
        insertImportsQ,
        firstAppraisalsQ,
        secondAppraisalQ,
        firstListingQ,
        firstPriceOfFirstListingQ,
        firstRemovalOfFirstListingQ,
        firstRelistingQ,
        firstPriceOfFirstRelistingQ
    ]
    await executeQueryQueue(queryQueue, connection)
})
afterAll(async () => {
    await connection.rollback()
    await connection.release()
})

test('User imports item, no transactions', async () => {
    const { query, variables } = buildGetByIdQuery(collectedItem.id, user.user_id, daysAfterStart(0.5, firstAppraisal.time))
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { id, item, printing, appraisal, listing } = rows[0]
    expect(id).toEqual('0'+collectedItemBaseId)
    expect(item.id).toEqual(testItems[0].id)
    expect(printing.id).toEqual(testPrintings[0].printing_id)
    expect(appraisal.id).toEqual(firstAppraisal.id)
    expect(appraisal.condition.id).toEqual(testConditions[0].condition_id)
    expect(listing.id).toBeNull()
})

test('User imports item, appraises it, then creates listing', async () => {
    const { query, variables } = buildGetByIdQuery(collectedItem.id, user.user_id, daysAfterStart(0.5, firstListing.time))
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { appraisal, listing } = rows[0]
    expect(appraisal.id).toEqual('1'+appraisalBaseId)
    expect(appraisal.condition.id).toEqual(testConditions[1].condition_id)
    expect(listing.id).toEqual(firstListing.id)
    expect(listing.removal.id).toBeNull()
})

test('adjusts price of listing', async () => {
    const { query, variables } = buildGetByIdQuery(collectedItem.id, user.user_id, daysAfterStart(0.5, firstPriceOfFirstListing.time))
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.updatedPrice.price).toEqual(firstPriceOfFirstListing.price)
})

test('removes listing', async () => {
    const { query, variables } = buildGetByIdQuery(collectedItem.id, user.user_id, daysAfterStart(0.5, firstRemovalOfFirstListing.time))
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.removal.id).toEqual(firstRemovalOfFirstListing.id)
    expect(listing.id).toEqual(firstListing.id)
    expect(listing.price).toBeNull()
    expect(listing.updatedPrice.price).toBeNull()
})

test('relists listing', async () => {
    const { query, variables } = buildGetByIdQuery(collectedItem.id, user.user_id, daysAfterStart(0.5, firstRelisting.time))
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.removal.id).toBeNull()
    expect(listing.updatedPrice.price).toBeNull()
    expect(listing.price).toEqual(firstRelisting.price)
    expect(listing.relisted.id).toEqual(firstRelisting.id)
})

test('price adjusted for relisted listing', async () => {
    const { query, variables } = buildGetByIdQuery(collectedItem.id, user.user_id, daysAfterStart(0.5, firstPriceOfFirstRelisting.time))
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.removal.id).toBeNull()
    expect(listing.updatedPrice.price).toEqual(firstPriceOfFirstRelisting.price)
    expect(listing.price).toEqual(firstRelisting.price)
    expect(listing.relisted.id).toEqual(firstRelisting.id)
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