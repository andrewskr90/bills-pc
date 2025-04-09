const QueryFormatters = require('./utils/queryFormatters')
const { buildGetByIdQuery } = require('./models/CollectedItem')
const { v4: uuid } = require('uuid')
const { testItems, testPrintings, testConditions, buildTestData, daysAfterStart } = require('./test')

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
const firstListingSale = { id: '0'+saleBaseId, purchaserId: proxyUser1.user_id, time: daysAfterStart(8, startISO) }

const secondCollectedItem = { id: '1'+collectedItemBaseId, itemId: testItems[0].id, printingId: testPrintings[0].printing_id }
const secondCollectedItem_import = { id: '1'+importBaseId, importerId: proxyUser1.user_id, collectedItemId: secondCollectedItem.id, time: daysAfterStart(0, startISO) }
const secondCollectedItem_firstAppraisal = { id: '2'+appraisalBaseId, collectedItemId: secondCollectedItem.id, conditionId: testConditions[0].condition_id, appraiserId: proxyUser1.user_id, time: daysAfterStart(1, startISO) }
const secondCollectedItem_secondAppraisal = { ...secondCollectedItem_firstAppraisal, id: '3'+appraisalBaseId, conditionId: testConditions[1].condition_id, time: daysAfterStart(2, startISO) }
const secondCollectedItem_firstListing = { id: '1'+listingBaseId, collectedItemId: secondCollectedItem.id, saleId: null, price: 100, time: daysAfterStart(3, startISO) }
const secondCollectedItem_purchase = { id: '1'+saleBaseId, purchaserId: user.user_id, time: daysAfterStart(4, startISO) }
const secondCollectedItem_secondListing = { id: '2'+listingBaseId, collectedItemId: secondCollectedItem.id, saleId: null, price: 110, time: daysAfterStart(5, startISO) }
const firstPriceOfSecondListing = { id: '3'+listingPriceBaseId, listingId: secondCollectedItem_secondListing.id, price: secondCollectedItem_secondListing.price + 50, time: daysAfterStart(6, startISO) }
const firstRemovalOfSecondListing  = { id: '1'+listingRemovalBaseId, listingId: secondCollectedItem_secondListing.id, time: daysAfterStart(7, startISO) }
const firstRelistingOfSecondListing = { id: '4'+listingPriceBaseId, listingId: secondCollectedItem_secondListing.id, price: firstPriceOfSecondListing.price -20, time: daysAfterStart(8, startISO) }
const secondPriceOfSecondListing = { id: '5'+listingPriceBaseId, listingId: secondCollectedItem_secondListing.id, price: firstRelistingOfSecondListing.price -80, time: daysAfterStart(9, startISO) }
const secondCollectedItem_sale = { id: '2'+saleBaseId, purchaserId: proxyUser1.user_id, time: daysAfterStart(9, startISO) }
const secondCollectedItem_outOfScopeListing = { id: '3'+listingBaseId, collectedItemId: secondCollectedItem.id, saleId: null, price: 300, time: daysAfterStart(10, startISO) }
// TODO incrementing id is something I'll forget to do when creating dummy data, maybe create a util
beforeAll(async () => {
    connection = await testPool.getConnection()
    await connection.query('START TRANSACTION')
    
    await buildTestData([
        { data: user, table: 'users' },
        { data: proxyUser1, table: 'users' },
        { data: collectedItem, table: 'V3_CollectedItem' },
        { data: import_collectedItem, table: 'V3_Import' },
        { data: firstAppraisal, table: 'V3_Appraisal' },
        { data: secondAppraisal, table:'V3_Appraisal' },
        { data: firstListing, table: 'V3_Listing' },
        { data: firstPriceOfFirstListing, table: 'V3_ListingPrice' },
        { data: firstRemovalOfFirstListing, table: 'V3_ListingRemoval' },
        { data: firstRelisting, table: 'V3_ListingPrice' },
        { data: firstPriceOfFirstRelisting, table: 'V3_ListingPrice' },
        { data: firstListingSale, table: 'V3_Sale' },
        { data: secondCollectedItem, table: 'V3_CollectedItem' },
        { data: secondCollectedItem_import, table: 'V3_Import' },
        { data: secondCollectedItem_firstAppraisal, table: 'V3_Appraisal' },
        { data: secondCollectedItem_secondAppraisal, table: 'V3_Appraisal' },
        { data: secondCollectedItem_firstListing, table: 'V3_Listing' },
        { data: secondCollectedItem_purchase, table: 'V3_Sale' },
        { data: secondCollectedItem_secondListing, table: 'V3_Listing' },
        { data: firstPriceOfSecondListing, table: 'V3_ListingPrice' },
        { data: firstRemovalOfSecondListing, table: 'V3_ListingRemoval' },
        { data: firstRelistingOfSecondListing, table: 'V3_ListingPrice' },
        { data: secondPriceOfSecondListing, table: 'V3_ListingPrice' },
        { data: secondCollectedItem_sale, table: 'V3_Sale' },
        { data: secondCollectedItem_outOfScopeListing, table: 'V3_Listing' },
    ], connection)
})
afterAll(async () => {
    await connection.rollback()
    await connection.release()
})

test('User imports item, no transactions', async () => {
    const { query, variables } = buildGetByIdQuery(
        collectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstAppraisal.time)
    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { id, item, printing, appraisal, listing, credit } = rows[0]
    expect(id).toEqual('0'+collectedItemBaseId)
    expect(item.id).toEqual(testItems[0].id)
    expect(printing.id).toEqual(testPrintings[0].printing_id)
    expect(appraisal.id).toEqual(firstAppraisal.id)
    expect(appraisal.condition.id).toEqual(testConditions[0].condition_id)
    expect(credit.import.id).toEqual(import_collectedItem.id)
    expect(credit.listing.id).toBeNull()
    expect(credit.sale.id).toBeNull()
    expect(credit.sale.purchaser.id).toBeNull()
    expect(listing.id).toBeNull()
})

test('User imports item, appraises it, then creates listing', async () => {
    const { query, variables } = buildGetByIdQuery(
        collectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstListing.time)
    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { appraisal, listing } = rows[0]
    expect(appraisal.id).toEqual('1'+appraisalBaseId)
    expect(appraisal.condition.id).toEqual(testConditions[1].condition_id)
    expect(listing.id).toEqual(firstListing.id)
    expect(listing.removal.id).toBeNull()
})

test('adjusts price of listing', async () => {
    const { query, variables } = buildGetByIdQuery(
        collectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstPriceOfFirstListing.time)
    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.updatedPrice.price).toEqual(firstPriceOfFirstListing.price)
})

test('removes listing', async () => {
    const { query, variables } = buildGetByIdQuery(
        collectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstRemovalOfFirstListing.time)
    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.removal.id).toEqual(firstRemovalOfFirstListing.id)
    expect(listing.id).toEqual(firstListing.id)
    expect(listing.price).toBeNull()
    expect(listing.updatedPrice.price).toBeNull()
})

test('relists listing', async () => {
    const { query, variables } = buildGetByIdQuery(
        collectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstRelisting.time)
    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.removal.id).toBeNull()
    expect(listing.updatedPrice.price).toBeNull()
    expect(listing.price).toEqual(firstRelisting.price)
    expect(listing.relisted.id).toEqual(firstRelisting.id)
})

test('price adjusted for relisted listing', async () => {
    const { query, variables } = buildGetByIdQuery(
        collectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstPriceOfFirstRelisting.time)
    
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing } = rows[0]
    expect(listing.removal.id).toBeNull()
    expect(listing.updatedPrice.price).toEqual(firstPriceOfFirstRelisting.price)
    expect(listing.price).toEqual(firstRelisting.price)
    expect(listing.relisted.id).toEqual(firstRelisting.id)
})

test('imported item sold', async () => {
    const { query, variables } = buildGetByIdQuery(
        collectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstListingSale.time)
    
    )
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${firstListingSale.id}' 
        where id = '${firstListing.id}'
    `, [])
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.removal.id).toBeNull()
    expect(listing.updatedPrice.price).toEqual(firstPriceOfFirstRelisting.price)
    expect(listing.price).toEqual(firstRelisting.price)
    expect(listing.relisted.id).toEqual(firstRelisting.id)
    expect(sale.id).toEqual(firstListingSale.id)
    expect(sale.purchaser.id).toEqual(proxyUser1.user_id)
})

// earliest sale or the latest listing

// new item
test('purchased item', async () => {
    const { query, variables } = buildGetByIdQuery(
        secondCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, secondCollectedItem_purchase.time)
    )
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${secondCollectedItem_purchase.id}' 
        where id = '${secondCollectedItem_firstListing.id}'
    `, [])
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { credit, listing, item, printing, appraisal } = rows[0]
    expect(listing.id).toBeNull()
    expect(item.id).toEqual(secondCollectedItem.itemId)
    expect(printing.id).toEqual(secondCollectedItem.printingId)
    expect(appraisal.id).toEqual(secondCollectedItem_secondAppraisal.id)
    expect(credit.listing.id).toEqual(secondCollectedItem_firstListing.id)
    expect(credit.listing.price).toEqual(secondCollectedItem_firstListing.price)
    expect(credit.import.id).toBeNull()
    expect(credit.sale.id).toEqual(secondCollectedItem_purchase.id)
})

test('purchased item listed', async () => {
    const { query, variables } = buildGetByIdQuery(
        secondCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, secondCollectedItem_secondListing.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(secondCollectedItem_secondListing.id)
    expect(listing.price).toEqual(secondCollectedItem_secondListing.price)
    expect(sale.id).toBeNull()
})
test('purchased item listing price updated', async () => {
    const { query, variables } = buildGetByIdQuery(
        secondCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstPriceOfSecondListing.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(secondCollectedItem_secondListing.id)
    expect(listing.price).toEqual(secondCollectedItem_secondListing.price)
    expect(listing.updatedPrice.price).toEqual(firstPriceOfSecondListing.price)
    expect(sale.id).toBeNull()
})
test.skip('purchased item listing removed', async () => {
    const { query, variables } = buildGetByIdQuery(
        secondCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstRemovalOfSecondListing.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(secondCollectedItem_secondListing.id)
    expect(listing.price).toBeNull()
    expect(listing.updatedPrice.price).toBeNull()
    expect(listing.removal.id).toEqual(firstRemovalOfSecondListing.id)
    expect(sale.id).toBeNull()
})
test.skip('purchased item listing relisted', async () => {
    const { query, variables } = buildGetByIdQuery(
        secondCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstRelistingOfSecondListing.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(secondCollectedItem_secondListing.id)
    expect(listing.price).toEqual(secondCollectedItem_secondListing.price)
    expect(listing.updatedPrice.price).toBeNull()
    expect(listing.removal.id).toBeNull()
    expect(sale.id).toBeNull()
})
test('purchased item sold', async () => {
    const { query, variables } = buildGetByIdQuery(
        secondCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, secondCollectedItem_outOfScopeListing.time)
    )
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${secondCollectedItem_sale.id}' 
        where id = '${secondCollectedItem_secondListing.id}'
    `, [])
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(secondCollectedItem_secondListing.id)
    expect(listing.removal.id).toBeNull()
    expect(listing.price).toEqual(firstRelistingOfSecondListing.price)
    expect(listing.updatedPrice.price).toEqual(secondPriceOfSecondListing.price)
    expect(sale.id).toEqual(secondCollectedItem_sale.id)
    expect(sale.purchaser.id).toEqual(secondCollectedItem_sale.purchaserId)
})

// new item
test.skip('imported item added to lot', async () => {})
test.skip('imported item removed from lot', async () => {})
test.skip('imported item added to another lot', async () => {})
test.skip('imported item listed within lot', async () => {})
test.skip('imported item sold within lot', async () => {})

// new item
test.skip('purchased item within lot', async () => {})
test.skip('item removed from purchased lot', async () => {})
test.skip('item added to another lot', async () => {})
test.skip('item removed from lot, then added to another lot already listed', async () => {})
test.skip('item sold within listed lot', async () => {})

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
