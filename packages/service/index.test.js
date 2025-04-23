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
    listingRemoval: 'listR',
    sale: 's',
    lot: 'lo',
    lotEdit: 'le',
    lotInsert: 'li',
    lotRemoval: 'lr'
}
const userBaseId = `-${tableIds.user}-${testId}`
const collectedItemBaseId = `-${tableIds.collectedItem}-${testId}`
const importBaseId = `-${tableIds.import}-${testId}`
const appraisalBaseId = `-${tableIds.appraisal}-${testId}`
const listingBaseId = `-${tableIds.listing}-${testId}`
const listingPriceBaseId = `-${tableIds.listingPrice}-${testId}`
const listingRemovalBaseId = `-${tableIds.listingRemoval}-${testId}`
const saleBaseId = `-${tableIds.sale}-${testId}`
const lotBaseId = `-${tableIds.lot}-${testId}`
const lotEditBaseId = `-${tableIds.lotEdit}-${testId}`
const lotInsertBaseId = `-${tableIds.lotInsert}-${testId}`
const lotRemovalBaseId = `-${tableIds.lotRemoval}-${testId}`

const startISO = new Date().toISOString()

const user = { user_id: '0'+userBaseId, user_name: '0'+userBaseId, user_password: '12345', user_role: 'Gym Leader' }
const proxyUser1 = { user_id: '1'+userBaseId, user_name: '1'+userBaseId, proxyCreatorId: user.user_id }
const proxyUser2 = { user_id: '2'+userBaseId, user_name: '2'+userBaseId, proxyCreatorId: user.user_id }
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
const secondListingAnotherUser = { id: '1'+listingBaseId, collectedItemId: collectedItem.id, saleId: null, price: 30, time: daysAfterStart(9, startISO) }
const secondListingSaleAnotherUser = { id: '1'+saleBaseId, purchaserId: proxyUser2.user_id, time: daysAfterStart(10, startISO) }
const thirdListingBackToUser = { id: '2'+listingBaseId, collectedItemId: collectedItem.id, saleId: null, price: 35, time: daysAfterStart(11, startISO) }
const thirdListingSaleBackToUser = { id: '2'+saleBaseId, purchaserId: user.user_id, time: daysAfterStart(12, startISO) }

const secondCollectedItem = { id: '1'+collectedItemBaseId, itemId: testItems[0].id, printingId: testPrintings[0].printing_id }
const secondCollectedItem_import = { id: '1'+importBaseId, importerId: proxyUser1.user_id, collectedItemId: secondCollectedItem.id, time: daysAfterStart(0, startISO) }
const secondCollectedItem_firstAppraisal = { id: '2'+appraisalBaseId, collectedItemId: secondCollectedItem.id, conditionId: testConditions[0].condition_id, appraiserId: proxyUser1.user_id, time: daysAfterStart(1, startISO) }
const secondCollectedItem_secondAppraisal = { ...secondCollectedItem_firstAppraisal, id: '3'+appraisalBaseId, conditionId: testConditions[1].condition_id, time: daysAfterStart(2, startISO) }
const secondCollectedItem_firstListing = { id: '3'+listingBaseId, collectedItemId: secondCollectedItem.id, saleId: null, price: 100, time: daysAfterStart(3, startISO) }
const secondCollectedItem_purchase = { id: '3'+saleBaseId, purchaserId: user.user_id, time: daysAfterStart(4, startISO) }
const secondCollectedItem_secondListing = { id: '4'+listingBaseId, collectedItemId: secondCollectedItem.id, saleId: null, price: 110, time: daysAfterStart(5, startISO) }
const firstPriceOfSecondListing = { id: '3'+listingPriceBaseId, listingId: secondCollectedItem_secondListing.id, price: secondCollectedItem_secondListing.price + 50, time: daysAfterStart(6, startISO) }
const firstRemovalOfSecondListing  = { id: '1'+listingRemovalBaseId, listingId: secondCollectedItem_secondListing.id, time: daysAfterStart(7, startISO) }
const firstRelistingOfSecondListing = { id: '4'+listingPriceBaseId, listingId: secondCollectedItem_secondListing.id, price: firstPriceOfSecondListing.price -20, time: daysAfterStart(8, startISO) }
const secondPriceOfSecondListing = { id: '5'+listingPriceBaseId, listingId: secondCollectedItem_secondListing.id, price: firstRelistingOfSecondListing.price -80, time: daysAfterStart(9, startISO) }
const secondCollectedItem_sale = { id: '4'+saleBaseId, purchaserId: proxyUser1.user_id, time: daysAfterStart(9, startISO) }
const secondCollectedItem_outOfScopeListing = { id: '5'+listingBaseId, collectedItemId: secondCollectedItem.id, saleId: null, price: 300, time: daysAfterStart(10, startISO) }
const secondCollectedItem_outOfScopeSale = { id: '5'+saleBaseId, purchaserId: proxyUser2.user_id, time: daysAfterStart(11, startISO) }

const thirdCollectedItem = { id: '2'+collectedItemBaseId, itemId: testItems[0].id, printingId: testPrintings[0].printing_id }
const thirdCollectedItem_import = { id: '2'+importBaseId, importerId: user.user_id, collectedItemId: thirdCollectedItem.id, time: daysAfterStart(0, startISO) }
const thirdCollectedItem_firstAppraisal = { id: '4'+appraisalBaseId, collectedItemId: thirdCollectedItem.id, conditionId: testConditions[0].condition_id, appraiserId: user.user_id, time: daysAfterStart(1, startISO) }
const thirdCollectedItem_firstLot = { id: '0'+lotBaseId }
const thirdCollectedItem_firstLotEdit = { id : '0'+lotEditBaseId, lotId: thirdCollectedItem_firstLot.id, time: daysAfterStart(2, startISO) }
const thirdCollectedItem_firstInsert = { id: '0'+lotInsertBaseId, lotEditId: thirdCollectedItem_firstLotEdit.id, collectedItemId: thirdCollectedItem.id, index: 0 }
const thirdCollectedItem_secondLotEdit = { id : '1'+lotEditBaseId, lotId: thirdCollectedItem_firstLot.id, time: daysAfterStart(3, startISO) }
const thirdCollectedItem_firstRemoval = { id: '0'+lotRemovalBaseId, lotEditId: thirdCollectedItem_secondLotEdit.id, collectedItemId: thirdCollectedItem.id }
const thirdCollectedItem_secondLot = { id: '1'+lotBaseId }
const thirdCollectedItem_thirdLotEdit = { id : '2'+lotEditBaseId, lotId: thirdCollectedItem_secondLot.id, time: daysAfterStart(4, startISO) }
const thirdCollectedItem_secondInsert = { id: '1'+lotInsertBaseId, lotEditId: thirdCollectedItem_thirdLotEdit.id, collectedItemId: thirdCollectedItem.id, index: 0 }
const thirdCollectedItem_firstListing = { id: '6'+listingBaseId, lotId: thirdCollectedItem_secondLot.id, saleId: null, price: 16, time: daysAfterStart(5, startISO) }
const thirdCollectedItem_firstSale = { id: '6'+saleBaseId, purchaserId: proxyUser1.user_id, time: daysAfterStart(6, startISO) }

const fourthCollectedItem = { id: '3'+collectedItemBaseId, itemId: testItems[0].id, printingId: testPrintings[0].printing_id }
const fourthCollectedItem_import = { id: '3'+importBaseId, importerId: user.user_id, collectedItemId: fourthCollectedItem.id, time: daysAfterStart(0, startISO) }
const fourthCollectedItem_firstAppraisal = { id: '5'+appraisalBaseId, collectedItemId: fourthCollectedItem.id, conditionId: testConditions[0].condition_id, appraiserId: user.user_id, time: daysAfterStart(1, startISO) }
const fourthCollectedItem_firstLot = { id: '2'+lotBaseId }
const fourthCollectedItem_firstLotEdit = { id : '3'+lotEditBaseId, lotId: fourthCollectedItem_firstLot.id, time: daysAfterStart(2, startISO) }
const fourthCollectedItem_firstInsert = { id: '2'+lotInsertBaseId, lotEditId: fourthCollectedItem_firstLotEdit.id, collectedItemId: fourthCollectedItem.id, index: 0 }
const fourthCollectedItem_firstListing = { id: '7'+listingBaseId, lotId: fourthCollectedItem_firstLot.id, saleId: null, price: 16, time: daysAfterStart(3, startISO) }
const fourthCollectedItem_secondLotEdit = { id : '4'+lotEditBaseId, lotId: fourthCollectedItem_firstLot.id, time: daysAfterStart(4, startISO) }
const fourthCollectedItem_firstRemoval = { id: '1'+lotRemovalBaseId, lotEditId: fourthCollectedItem_secondLotEdit.id, collectedItemId: fourthCollectedItem.id }
const fourthCollectedItem_firstSale = { id: '7'+saleBaseId, purchaserId: proxyUser1.user_id, time: daysAfterStart(5, startISO) }

const fifthCollectedItem = { id: '4'+collectedItemBaseId, itemId: testItems[0].id, printingId: testPrintings[0].printing_id }
const fifthCollectedItem_import = { id: '4'+importBaseId, importerId: user.user_id, collectedItemId: fifthCollectedItem.id, time: daysAfterStart(0, startISO) }
const fifthCollectedItem_firstAppraisal = { id: '6'+appraisalBaseId, collectedItemId: fifthCollectedItem.id, conditionId: testConditions[0].condition_id, appraiserId: user.user_id, time: daysAfterStart(1, startISO) }
const fifthCollectedItem_firstLot = { id: '3'+lotBaseId }
const fifthCollectedItem_firstLotEdit = { id : '5'+lotEditBaseId, lotId: fifthCollectedItem_firstLot.id, time: daysAfterStart(2, startISO) }
const fifthCollectedItem_firstInsert = { id: '3'+lotInsertBaseId, lotEditId: fifthCollectedItem_firstLotEdit.id, collectedItemId: fifthCollectedItem.id, index: 0 }
const fifthCollectedItem_firstListing = { id: '8'+listingBaseId, lotId: fifthCollectedItem_firstLot.id, saleId: null, price: 16, time: daysAfterStart(3, startISO) }
const fifthCollectedItem_firstSale = { id: '8'+saleBaseId, purchaserId: proxyUser1.user_id, time: daysAfterStart(4, startISO) }
const fifthCollectedItem_secondListing = { id: '9'+listingBaseId, lotId: fifthCollectedItem_firstLot.id, saleId: null, price: 16, time: daysAfterStart(5, startISO) }
const fifthCollectedItem_secondSale = { id: '9'+saleBaseId, purchaserId: proxyUser2.user_id, time: daysAfterStart(6, startISO) }

// proxy user import add to lot
const sixthCollectedItem = { id: '5'+collectedItemBaseId, itemId: testItems[0].id, printingId: testPrintings[0].printing_id }
const sixthCollectedItem_import = { id: '5'+importBaseId, importerId: proxyUser1.user_id, collectedItemId: sixthCollectedItem.id, time: daysAfterStart(0, startISO) }
const sixthCollectedItem_firstAppraisal = { id: '7'+appraisalBaseId, collectedItemId: sixthCollectedItem.id, conditionId: testConditions[0].condition_id, appraiserId: user.user_id, time: daysAfterStart(1, startISO) }
const sixthCollectedItem_firstLot = { id: '4'+lotBaseId }
const sixthCollectedItem_firstLotEdit = { id : '6'+lotEditBaseId, lotId: sixthCollectedItem_firstLot.id, time: daysAfterStart(2, startISO) }
const sixthCollectedItem_firstInsert = { id: '4'+lotInsertBaseId, lotEditId: sixthCollectedItem_firstLotEdit.id, collectedItemId: sixthCollectedItem.id, index: 0 }
const sixthCollectedItem_firstListing = { id: '10'+listingBaseId, lotId: sixthCollectedItem_firstLot.id, saleId: null, price: 12, time: daysAfterStart(3, startISO) }
// user purchases lot
const sixthCollectedItem_firstSale = { id: '10'+saleBaseId, purchaserId: user.user_id, time: daysAfterStart(4, startISO) }
// user removes item from lot
const sixthCollectedItem_secondLotEdit = { id : '7'+lotEditBaseId, lotId: sixthCollectedItem_firstLot.id, time: daysAfterStart(5, startISO) }
const sixthCollectedItem_firstRemoval = { id: '2'+lotRemovalBaseId, lotEditId: sixthCollectedItem_secondLotEdit.id, collectedItemId: sixthCollectedItem.id }
// user adds item to another lot
const sixthCollectedItem_secondLot = { id: '5'+lotBaseId }
const sixthCollectedItem_thirdLotEdit = { id : '8'+lotEditBaseId, lotId: sixthCollectedItem_secondLot.id, time: daysAfterStart(6, startISO) }
const sixthCollectedItem_secondInsert = { id: '5'+lotInsertBaseId, lotEditId: sixthCollectedItem_thirdLotEdit.id, collectedItemId: sixthCollectedItem.id, index: 0 }
// user removes item from lot
const sixthCollectedItem_fourthLotEdit = { id : '9'+lotEditBaseId, lotId: sixthCollectedItem_secondLot.id, time: daysAfterStart(7, startISO) }
const sixthCollectedItem_secondRemoval = { id: '3'+lotRemovalBaseId, lotEditId: sixthCollectedItem_fourthLotEdit.id, collectedItemId: sixthCollectedItem.id }
// user adds item to already listed lot
const sixthCollectedItem_thirdLot = { id: '6'+lotBaseId }
const sixthCollectedItem_secondListing = { id: '11'+listingBaseId, lotId: sixthCollectedItem_thirdLot.id, saleId: null, price: 43, time: daysAfterStart(8, startISO) }
const sixthCollectedItem_fifthLotEdit = { id : '10'+lotEditBaseId, lotId: sixthCollectedItem_thirdLot.id, time: daysAfterStart(9, startISO) }
const sixthCollectedItem_thirdInsert = { id: '6'+lotInsertBaseId, lotEditId: sixthCollectedItem_fifthLotEdit.id, collectedItemId: sixthCollectedItem.id, index: 0 }
// item sold within already listed lot
const sixthCollectedItem_secondAppraisal = { id: '8'+appraisalBaseId, collectedItemId: sixthCollectedItem.id, conditionId: testConditions[1].condition_id, appraiserId: user.user_id, time: daysAfterStart(10, startISO) }
const sixthCollectedItem_firstPrice = { id: '6'+listingPriceBaseId, listingId: sixthCollectedItem_secondListing.id, price: sixthCollectedItem_secondListing.price +10, time: daysAfterStart(11, startISO) }
const sixthCollectedItem_secondSale = { id: '11'+saleBaseId, purchaserId: proxyUser2.user_id, time: daysAfterStart(12, startISO) }


// TODO incrementing id is something I'll forget to do when creating dummy data, maybe create a util
beforeAll(async () => {
    connection = await testPool.getConnection()
    await connection.query('START TRANSACTION')
    
    await buildTestData([
        { data: user, table: 'users' },
        { data: proxyUser1, table: 'users' },
        { data: proxyUser2, table: 'users' },
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
        { data: secondCollectedItem_outOfScopeSale, table: 'V3_Sale' },
        { data: thirdCollectedItem, table: 'V3_CollectedItem' },
        { data: thirdCollectedItem_import, table: 'V3_Import' },
        { data: thirdCollectedItem_firstAppraisal, table: 'V3_Appraisal' },
        { data: thirdCollectedItem_firstLot, table: 'V3_Lot' },
        { data: thirdCollectedItem_firstLotEdit, table: 'V3_LotEdit' },
        { data: thirdCollectedItem_firstInsert, table: 'V3_LotInsert' },
        { data: thirdCollectedItem_secondLotEdit, table: 'V3_LotEdit' },
        { data: thirdCollectedItem_firstRemoval, table: 'V3_LotRemoval' },
        { data: thirdCollectedItem_secondLot, table: 'V3_Lot' },
        { data: thirdCollectedItem_thirdLotEdit, table: 'V3_LotEdit' },
        { data: thirdCollectedItem_secondInsert, table: 'V3_LotInsert' },
        { data: thirdCollectedItem_firstListing, table: 'V3_Listing' },
        { data: thirdCollectedItem_firstSale, table: 'V3_Sale' },
        { data: secondListingAnotherUser, table: 'V3_Listing' },
        { data: secondListingSaleAnotherUser, table: 'V3_Sale '},
        { data: thirdListingBackToUser, table: 'V3_Listing' },
        { data: thirdListingSaleBackToUser, table: 'V3_Sale '},
        { data: fourthCollectedItem, table: 'V3_CollectedItem' },
        { data: fourthCollectedItem_import, table: 'V3_Import' },
        { data: fourthCollectedItem_firstAppraisal, table: 'V3_Appraisal' },
        { data: fourthCollectedItem_firstLot, table: 'V3_Lot' },
        { data: fourthCollectedItem_firstLotEdit, table: 'V3_LotEdit' },
        { data: fourthCollectedItem_firstInsert, table: 'V3_LotInsert' },
        { data: fourthCollectedItem_firstListing, table: 'V3_Listing' },
        { data: fourthCollectedItem_secondLotEdit, table: 'V3_LotEdit' },
        { data: fourthCollectedItem_firstRemoval, table: 'V3_LotRemoval' },
        { data: fourthCollectedItem_firstSale, table: 'V3_Sale' },
        { data: fifthCollectedItem, table: 'V3_CollectedItem' },
        { data: fifthCollectedItem_import, table: 'V3_Import' },
        { data: fifthCollectedItem_firstAppraisal, table: 'V3_Appraisal' },
        { data: fifthCollectedItem_firstLot, table: 'V3_Lot' },
        { data: fifthCollectedItem_firstLotEdit, table: 'V3_LotEdit' },
        { data: fifthCollectedItem_firstInsert, table: 'V3_LotInsert' },
        { data: fifthCollectedItem_firstListing, table: 'V3_Listing' },
        { data: fifthCollectedItem_firstSale, table: 'V3_Sale' },
        { data: fifthCollectedItem_secondListing, table: 'V3_Listing' },
        { data: fifthCollectedItem_secondSale, table: 'V3_Sale' },
        { data: sixthCollectedItem, table: 'V3_CollectedItem' },
        { data: sixthCollectedItem_import, table: 'V3_Import' },
        { data: sixthCollectedItem_firstAppraisal, table: 'V3_Appraisal' },
        { data: sixthCollectedItem_firstLot, table: 'V3_Lot' },
        { data: sixthCollectedItem_firstLotEdit, table: 'V3_LotEdit' },
        { data: sixthCollectedItem_firstInsert, table: 'V3_LotInsert' },
        { data: sixthCollectedItem_firstListing, table: 'V3_Listing' },
        { data: sixthCollectedItem_firstSale, table: 'V3_Sale' },
        { data: sixthCollectedItem_secondLotEdit, table: 'V3_LotEdit' },
        { data: sixthCollectedItem_firstRemoval, table: 'V3_LotRemoval' },
        { data: sixthCollectedItem_secondLot, table: 'V3_Lot' },
        { data: sixthCollectedItem_thirdLotEdit, table: 'V3_LotEdit' },
        { data: sixthCollectedItem_secondInsert, table: 'V3_LotInsert' },
        { data: sixthCollectedItem_fourthLotEdit, table: 'V3_LotEdit' },
        { data: sixthCollectedItem_secondRemoval, table: 'V3_LotRemoval' },
        { data: sixthCollectedItem_thirdLot, table: 'V3_Lot' },
        { data: sixthCollectedItem_secondListing, table: 'V3_Listing' },
        { data: sixthCollectedItem_fifthLotEdit, table: 'V3_LotEdit' },
        { data: sixthCollectedItem_thirdInsert, table: 'V3_LotInsert' },
        { data: sixthCollectedItem_secondAppraisal, table: 'V3_Appraisal' },
        { data: sixthCollectedItem_firstPrice, table: 'V3_ListingPrice' },
        { data: sixthCollectedItem_secondSale, table: 'V3_Sale' },
        
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

test('sold imported item returns the correct purchaser id', async () => {
    const { query, variables } = buildGetByIdQuery(
        collectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, secondListingSaleAnotherUser.time)
    )
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${firstListingSale.id}' 
        where id = '${firstListing.id}'
    `, [])
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${secondListingSaleAnotherUser.id}' 
        where id = '${secondListingAnotherUser.id}'
    `, [])
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(firstListing.id)
    expect(sale.purchaser.id).toEqual(proxyUser1.user_id)
})

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
test('purchased item listing removed', async () => {
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
test('purchased item listing relisted', async () => {
    const { query, variables } = buildGetByIdQuery(
        secondCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, firstRelistingOfSecondListing.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale } = rows[0]
    expect(listing.id).toEqual(secondCollectedItem_secondListing.id)
    expect(listing.price).toEqual(firstRelistingOfSecondListing.price)
    expect(listing.updatedPrice.price).toBeNull()
    expect(listing.removal.id).toBeNull()
    expect(sale.id).toBeNull()
})
test('purchased item sold', async () => {
    const { query, variables } = buildGetByIdQuery(
        secondCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, secondCollectedItem_outOfScopeSale.time)
    )
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${secondCollectedItem_sale.id}' 
        where id = '${secondCollectedItem_secondListing.id}'
    `, [])
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${secondCollectedItem_outOfScopeSale.id}' 
        where id = '${secondCollectedItem_outOfScopeListing.id}'
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
test('imported item added to lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        thirdCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, thirdCollectedItem_firstLotEdit.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { id, item, printing, appraisal, listing, credit, lot } = rows[0]
    expect(id).toEqual(thirdCollectedItem.id)
    expect(item.id).toEqual(testItems[0].id)
    expect(printing.id).toEqual(testPrintings[0].printing_id)
    expect(appraisal.id).toEqual(thirdCollectedItem_firstAppraisal.id)
    expect(appraisal.condition.id).toEqual(testConditions[0].condition_id)
    expect(credit.import.id).toEqual(thirdCollectedItem_import.id)
    expect(credit.listing.id).toBeNull()
    expect(credit.sale.id).toBeNull()
    expect(credit.sale.purchaser.id).toBeNull()
    expect(listing.id).toBeNull()
    expect(lot.id).toEqual(thirdCollectedItem_firstLot.id)
})
test('imported item removed from lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        thirdCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, thirdCollectedItem_secondLotEdit.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot } = rows[0]
    expect(lot.id).toBeNull()
})
test('imported item added to another lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        thirdCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, thirdCollectedItem_thirdLotEdit.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot } = rows[0]
    expect(lot.id).toEqual(thirdCollectedItem_secondLot.id)
})
test('imported item listed within lot', async () => {
    // thirdCollectedItem_firstListing
    const { query, variables } = buildGetByIdQuery(
        thirdCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, thirdCollectedItem_firstListing.time)
    )
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot, listing } = rows[0]
    expect(lot.id).toEqual(thirdCollectedItem_secondLot.id)
    expect(listing.id).toEqual(thirdCollectedItem_firstListing.id)
})
test('imported item sold within lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        thirdCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, thirdCollectedItem_firstSale.time)
    )
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${thirdCollectedItem_firstSale.id}' 
        where id = '${thirdCollectedItem_firstListing.id}'
    `, [])
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale, lot } = rows[0]
    expect(listing.id).toEqual(thirdCollectedItem_firstListing.id)
    expect(lot.id).toEqual(thirdCollectedItem_secondLot.id)
    expect(lot.edit.id).toEqual(thirdCollectedItem_thirdLotEdit.id)
    expect(sale.id).toEqual(thirdCollectedItem_firstSale.id)
    expect(sale.purchaser.id).toEqual(proxyUser1.user_id)
})

test('item removed from lot before lot sold is still marked unsold', async () => {
    const { query, variables } = buildGetByIdQuery(
        fourthCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, fourthCollectedItem_firstSale.time)
    )
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${fourthCollectedItem_firstSale.id}' 
        where id = '${fourthCollectedItem_firstListing.id}'
    `, [])
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale, lot, credit } = rows[0]
    expect(listing.id).toBeNull()
    expect(lot.id).toBeNull()
    expect(lot.edit.id).toBeNull()
    expect(sale.id).toBeNull()
    expect(sale.purchaser.id).toBeNull()
    expect(credit.import.id).toEqual(fourthCollectedItem_import.id)
})
test('only most recent sold lot listing is returned', async () => {
    const { query, variables } = buildGetByIdQuery(
        fifthCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, fifthCollectedItem_secondSale.time)
    )
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${fifthCollectedItem_firstSale.id}' 
        where id = '${fifthCollectedItem_firstListing.id}'
    `, [])
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${fifthCollectedItem_secondSale.id}' 
        where id = '${fifthCollectedItem_secondListing.id}'
    `, [])
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { listing, sale, lot, credit } = rows[0]
    expect(listing.id).toEqual(fifthCollectedItem_firstListing.id)
    expect(lot.id).toEqual(fifthCollectedItem_firstLot.id)
    expect(lot.edit.id).toEqual(fifthCollectedItem_firstLotEdit.id)
    expect(sale.id).toEqual(fifthCollectedItem_firstSale.id)
    expect(sale.purchaser.id).toEqual(proxyUser1.user_id)
    expect(credit.import.id).toEqual(fifthCollectedItem_import.id)
})

// new item
test('purchased item within lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        sixthCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, sixthCollectedItem_firstSale.time)
    )
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${sixthCollectedItem_firstSale.id}' 
        where id = '${sixthCollectedItem_firstListing.id}'
    `, [])
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { credit, lot } = rows[0]
    expect(credit.listing.id).toEqual(sixthCollectedItem_firstListing.id)
    expect(credit.listing.price).toEqual(sixthCollectedItem_firstListing.price)
    expect(credit.sale.id).toEqual(sixthCollectedItem_firstSale.id)
    expect(credit.sale.purchaser.id).toEqual(user.user_id)
    expect(credit.lot.id).toEqual(sixthCollectedItem_firstLot.id)
    expect(lot.id).toEqual(sixthCollectedItem_firstLot.id)
})
test('purchased lot item removed from purchased lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        sixthCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, sixthCollectedItem_secondLotEdit.time)
    )
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${sixthCollectedItem_firstSale.id}' 
        where id = '${sixthCollectedItem_firstListing.id}'
    `, [])
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot } = rows[0]
    expect(lot.id).toBeNull()
})
test('purchased lot item added to another lot', async () => {
    const { query, variables } = buildGetByIdQuery(
        sixthCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, sixthCollectedItem_thirdLotEdit.time)
    )
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${sixthCollectedItem_firstSale.id}' 
        where id = '${sixthCollectedItem_firstListing.id}'
    `, [])
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot, credit } = rows[0]
    expect(credit.lot.id).toEqual(sixthCollectedItem_firstLot.id)
    expect(lot.id).toEqual(sixthCollectedItem_secondLot.id)
})
test('purchased lot item removed from lot, then added to another lot already listed', async () => {
    const { query, variables } = buildGetByIdQuery(
        sixthCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, sixthCollectedItem_fifthLotEdit.time)
    )
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${sixthCollectedItem_firstSale.id}' 
        where id = '${sixthCollectedItem_firstListing.id}'
    `, [])
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot, credit, listing, sale } = rows[0]
    expect(credit.lot.id).toEqual(sixthCollectedItem_firstLot.id)
    expect(lot.id).toEqual(sixthCollectedItem_thirdLot.id)
    expect(listing.id).toEqual(sixthCollectedItem_secondListing.id)
    expect(sale.id).toBeNull()
})
test('purchased lot item sold within listed lot, with correct appraisal and price', async () => {
    const { query, variables } = buildGetByIdQuery(
        sixthCollectedItem.id, 
        user.user_id, 
        daysAfterStart(0.5, sixthCollectedItem_secondSale.time)
    )
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${sixthCollectedItem_firstSale.id}' 
        where id = '${sixthCollectedItem_firstListing.id}'
    `, [])
    await connection.query(`
        UPDATE V3_Listing 
        set saleId = '${sixthCollectedItem_secondSale.id}' 
        where id = '${sixthCollectedItem_secondListing.id}'
    `, [])
    const [rows, fields] = await connection.query(query, variables)
    expect(rows.length).toEqual(1)
    const { lot, appraisal, listing, sale } = rows[0]
    expect(lot.id).toEqual(sixthCollectedItem_thirdLot.id)
    expect(listing.id).toEqual(sixthCollectedItem_secondListing.id)
    expect(listing.updatedPrice.price).toEqual(sixthCollectedItem_firstPrice.price)
    expect(sale.id).toEqual(sixthCollectedItem_secondSale.id)
    expect(appraisal.id).toEqual(sixthCollectedItem_secondAppraisal.id)
    expect(appraisal.condition.id).toEqual(sixthCollectedItem_secondAppraisal.conditionId)
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
