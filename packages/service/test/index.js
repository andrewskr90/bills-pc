const QueryFormatters = require("../utils/queryFormatters")

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
    lotRemoval: 'lr',
}

const testSets = [
    { set_v2_id: '0', set_v2_name: 'Test Set 0', set_v2_tcgplayer_set_id: '0' }
]
const testItems = [
    { id: '0', name: 'Test Item 0', setId: testSets[0].set_v2_id, tcgpId: '0' }
]
const testPrintings = [
    { printing_id: '0', printing_name: 'Test Printing 0', printing_tcgp_printing_id: '0' },
    { printing_id: '1', printing_name: 'Test Printing 1', printing_tcgp_printing_id: '1' },
    { printing_id: '2', printing_name: 'Test Printing 2', printing_tcgp_printing_id: '2' }
]
const testConditions = [
    { condition_id: '0', condition_name: 'Test Condition 0', condition_tcgp_condition_id: '0' },
    { condition_id: '1', condition_name: 'Test Condition 1', condition_tcgp_condition_id: '1' },
    { condition_id: '2', condition_name: 'Test Condition 2', condition_tcgp_condition_id: '2' }
]

const executeQueryQueue = async (queryQueue, connection) => {
    for (let i=0; i<queryQueue.length; i++) {
        const { query, variables } = queryQueue[i]
        await connection.query(query, variables)
    }
}

const buildTestData = async (rowConfigs, connection) => {
    await executeQueryQueue(
        rowConfigs.map(rowConfig => {
            return QueryFormatters.bpcQueryObjectsToInsert(
                [rowConfig.data], 
                rowConfig.table, 
                []
            )
        }),
        connection
    )
}

const daysAfterStart = (days, startISO) => {
    const startDate = new Date(startISO)
    const daysInt = Math.floor(days)
    let hours = 0
    if (days - daysInt > 0) hours = Math.floor(24*(days-daysInt))
    let unixDate = startDate.setDate(startDate.getDate()+days)
    if (hours > 0) {
        unixDate = new Date(unixDate).setHours(startDate.getHours()+hours)
    }
    const newDate = new Date(unixDate)
    return new Date(unixDate)
        .toISOString()
        .split('Z')[0]
}

const buildTableBaseIds = (testId) => {
    return {
        userBaseId: `-${tableIds.user}-${testId}`,
        collectedItemBaseId: `-${tableIds.collectedItem}-${testId}`,
        importBaseId: `-${tableIds.import}-${testId}`,
        appraisalBaseId: `-${tableIds.appraisal}-${testId}`,
        listingBaseId: `-${tableIds.listing}-${testId}`,
        listingPriceBaseId: `-${tableIds.listingPrice}-${testId}`,
        listingRemovalBaseId: `-${tableIds.listingRemoval}-${testId}`,
        saleBaseId: `-${tableIds.sale}-${testId}`,
        lotBaseId: `-${tableIds.lot}-${testId}`,
        lotEditBaseId: `-${tableIds.lotEdit}-${testId}`,
        lotInsertBaseId: `-${tableIds.lotInsert}-${testId}`,
        lotRemovalBaseId: `-${tableIds.lotRemoval}-${testId}`,
    }
}

class BPCT {
    constructor(testId) {
        const startISO = new Date()
        this.startISO = startISO.toISOString()
        this.tableBaseIds = buildTableBaseIds(testId)
        const baseUserId = this.buildId(0, this.tableBaseIds.userBaseId)
        const baseUser = { user_id: baseUserId, user_name: baseUserId, user_password: '12345', user_role: 'Gym Leader' }
        this.u = [baseUser]
        this.se = []
        this.it = []
        this.p = []
        this.c = []
        this.ci = [] // ci
        this.i = [] // ci.import
        this.a = [] // ci.appraisal
        this.l = [] // ci.listing
        this.lp = [] // ci.listing[0].updatedPrice
        this.listR = []
        this.s = []
        this.lo = []
        this.le = []
        this.li = []
        this.lr = []
    }
    compileTransactions() {
        return [
            ...this.i.map(row => ({ table: 'i', row })),
            ...this.a.map(row => ({ table: 'a', row })),
            ...this.l.map(row => ({ table: 'l', row })),
            ...this.lp.map(row => ({ table: 'lp', row })),
            ...this.listR.map(row => ({ table: 'listR', row })),
            ...this.s.map(row => ({ table: 's', row })),
            ...this.le.map(row => ({ table: 'le', row })),
        ].sort((a, b) => {
            if (a.row.time < b.row.time) return -1
            else if (a.row.time > b.row.time) return 1
            else return 0
        })
    }
    // groupTransactionsByAsset() {
    //     const groupedTransactionsByAsset = this.compileTransactions().reduce((prev, cur) => {
    //         if (cur.table === 'i') {
    //             const { collectedItemId } = cur.row
    //             return {
    //                 ...prev,
    //                 [collectedItemId]: [cur]
    //             }
    //         } else if (cur.table === 'a') {

    //             // TODO should all ci transactions be nested within the ci,
    //             // so li then lr (le) transactions would appear back to back, then you would
    //             // need to refer to the lo transactions to see what happened within that span of time

    //             const { collectedItemId } = cur.row
    //             // will there ever be a case when prev[collectedItemId] is false?
    //             // if so it is a bug. The a cannot be created without an import, so no
    //             return { ...prev, [collectedItemId]: [...prev[collectedItemId], cur]}
    //         } else if (cur.table === 'le') {
    //             const lotInserts = this.li.filter(insert => insert.lotEditId === cur.row.id)
    //             const lotRemovals = this.li.filter(removal => removal.lotEditId === cur.row.id)
    //             lotInserts.forEach(insert => {
    //                 const { collectedItemId } = insert
    //                 // const inheritedListingTransactions = prev.listings
    //                 // TODO start working here
    //                 return { ...prev, [collectedItemId]: [...prev[collectedItemId], cur]}
    //             })
    //             lotRemovals.forEach(removal => {
    //                 const { collectedItemId } = removal
    //                 return { ...prev, [collectedItemId]: [...prev[collectedItemId], cur]}
    //             })
    //         } else if (cur.table === 'l') {
    //             const { lotId, collectedItemId } = cur.row
    //             if (lotId) {
    //                 const lotEdits =
    //             } else {

    //             }
    //         } else if (cur.table === 'lp') {
    //         } else if (cur.table === 'listR') {
    //         } else if (cur.table === 's') {}

    //     }, { ci: [], lo: []})
    // }
    addDay() {
        const allTransactions = this.compileTransactions()
        if (allTransactions.length === 0) {
            return daysAfterStart(1, this.startISO)
        } else {
            const latestTransactionValues = allTransactions[allTransactions.length-1]
            const latestTime = new Date(latestTransactionValues.row.time)
            const newTime = daysAfterStart(1, latestTime.toISOString())
            return newTime
        }
    }
    buildId(rowCount, baseId) {
        return `${rowCount}${baseId}`
    }
    buildUser() {
        const user_id = this.buildId(this.u.length, this.tableBaseIds.userBaseId)
        const proxyCreatorId = this.u[0].user_id
        this.u = [...this.u, { user_id, user_name: user_id, proxyCreatorId }]
        return user_id
    }
    // build proxy users with auto built user id as creator
    buildUsers(amount) {
        const realAmount = (Number.isInteger(amount) && amount > 0) ? amount : 1
        const builtUserIds = []
        for (let i=0; i<realAmount; i++) {
            const user_id = this.buildUser()
            builtUserIds.push(user_id)
        }
        return builtUserIds
    }
    import(itemId, printingId, conditionId, importerId) {
        /// TODO incorporate import into test
        const collectedItem = this.buildCollectedItem(itemId, printingId)
        const collectedItemId = collectedItem.id
        const createdImport = { 
            id: this.buildId(this.i.length, this.tableBaseIds.importBaseId),
            collectedItemId,
            time: this.addDay(),
            importerId
        }
        this.i = [...this.i, createdImport]
        const appraisal = this.appraise(collectedItemId, conditionId, importerId)
        return { collectedItem, createdImport, appraisal }
    }
    buildCollectedItem(itemId, printingId) {
        const id = this.buildId(this.ci.length, this.tableBaseIds.collectedItemBaseId)
        const collectedItem = { id, itemId, printingId }
        this.ci = [...this.ci, collectedItem]
        return collectedItem
    }
    appraise(collectedItemId, conditionId, appraiserId) {
        const id = this.buildId(this.a.length, this.tableBaseIds.appraisalBaseId)
        const appraisal = { id, collectedItemId, conditionId, time: this.addDay(), appraiserId }
        this.a = [...this.a, appraisal]
        return appraisal
    }
    listItem(collectedItemId, price) {
        const id = this.buildId(this.l.length, this.tableBaseIds.listingBaseId)
        const listing = { id, collectedItemId, price, time: this.addDay() }
        this.l = [...this.l, listing]
        return listing
    }
    listLot(lotId, price) {
        const id = this.buildId(this.l.length, this.tableBaseIds.listingBaseId)
        const listing = { id, lotId, price, time: this.addDay() }
        this.l = [...this.l, listing]
        return listing
    }
    priceListing(listingId, price) {
        const id = this.buildId(this.lp.length, this.tableBaseIds.listingPriceBaseId)
        const listingPrice = { id, listingId, price, time: this.addDay() }
        this.lp = [...this.lp, listingPrice]
        return listingPrice
    }
    removeListing(listingId) {
        const id = this.buildId(this.listR.length, this.tableBaseIds.listingRemovalBaseId)
        const listingRemoval = { id, listingId, time: this.addDay() }
        this.listR = [...this.listR, listingRemoval]
        return listingRemoval
    }
    sale(listingId, purchaserId) {
        const id = this.buildId(this.s.length, this.tableBaseIds.saleBaseId)
        const sale = { id, purchaserId, time: this.addDay() }
        this.s = [...this.s, sale]
        this.l = this.l.map(listing => {
            if (listing.id === listingId) {
                return {
                    ...listing,
                    saleId: id
                }
            }
            return listing
        })
        return sale
    }
    createLot(inserts) {
        const id = this.buildId(this.lo.length, this.tableBaseIds.lotBaseId)
        const lot = { id }
        this.lo = [...this.lo, lot]
        const { lotEdit, lotInserts, lotRemovals } = this.createLotEdit(lot.id, inserts)
        return { lot, lotEdit, lotInserts, lotRemovals }
    }
    createLotEdit(lotId, inserts, removals) {
        const id = this.buildId(this.le.length, this.tableBaseIds.lotEditBaseId)
        const lotEdit = { id, lotId, time: this.addDay() }
        this.le = [...this.le, lotEdit]
        const lotInserts = this.createLotInserts(lotEdit.id, inserts)
        const lotRemovals = removals ? this.createLotRemovals(lotEdit.id, removals) : []
        return { lotEdit, lotInserts, lotRemovals }
    }
    createLotInsert(lotEditId, { collectedItemId, bulkSplitId }, index) {
        const id = this.buildId(this.li.length, this.tableBaseIds.lotInsertBaseId)
        const insert = { id, lotEditId, collectedItemId, bulkSplitId, index }
        this.li = [...this.li, insert]
        return insert
    }
    createLotInserts(lotEditId, inserts) {
        const lotInserts = []
        for (let i=0; i<inserts.length; i++) {
            const insert = this.createLotInsert(lotEditId, inserts[i], i)
            lotInserts.push(insert)
        }
        return lotInserts
    }
    createLotRemoval(lotEditId, { collectedItemId, bulkSplitId }) {
        const id = this.buildId(this.lr.length, this.tableBaseIds.lotRemovalBaseId)
        const removal = { id, lotEditId, collectedItemId, bulkSplitId }
        this.lr = [...this.lr, removal]
        return removal
    }
    createLotRemovals(lotEditId, removals) {
        const lotRemovals = []
        for (let i=0; i<removals.length; i++) {
            const removal = this.createLotRemoval(lotEditId, removals[i])
            lotRemovals.push(removal)
        }
        return lotRemovals
    }
    getStartISO() {
        return this.startISO
    }
    getUsers() {
        return this.u
    }
    getCollectedItems() {
        return this.ci
    }
    getImports() {
        return this.i
    }
    getAppraisals() {
        return this.a
    }
    getListings() {
        return this.l
    }
    getListingPrices() {
        return this.lp
    }
    getListingRemovals() {
        return this.listR
    }
    getSales() {
        return this.s
    }
    getLots() {
        return this.lo
    }
    getLotEdits() {
        return this.le
    }
    getLotInserts() {
        return this.li
    }
    getLotRemovals() {
        return this.lr
    }
}

module.exports = {
    testSets,
    testItems,
    testPrintings,
    testConditions,
    buildTestData,
    daysAfterStart, 
    buildTableBaseIds,
    BPCT
}