const { v4: uuid } = require('uuid')
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
    { set_v2_id: '0', set_v2_name: 'Test Set 0', set_v2_tcgplayer_set_id: '0' },
    { set_v2_id: '1', set_v2_name: 'Test Set 1', set_v2_tcgplayer_set_id: '1' }
]
const testItems = [
    { id: '0', name: 'Test Item 0', setId: testSets[0].set_v2_id, tcgpId: '0' },
    { id: '1', name: 'Test Item 1', setId: testSets[0].set_v2_id, tcgpId: '1' },
    { id: '2', name: 'Test Item 2', setId: testSets[1].set_v2_id, tcgpId: '2' },
    { id: '3', name: 'Test Item 3', setId: testSets[1].set_v2_id, tcgpId: '3' }
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

const buildTestData = async (bpct, connection) => {
    const generateConfigs = (bpct) => {
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
        return [
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
        ]
    }
    await connection.query('START TRANSACTION')
    await executeQueryQueue(
        generateConfigs(bpct).map(rowConfig => {
            return QueryFormatters.bpcQueryObjectsToInsert(
                [rowConfig.data], 
                rowConfig.table, 
                []
            )
        }),
        connection
    )
    return connection
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
    return new Date(unixDate)
        .toISOString()
        .split('Z')[0]
}

const buildTableBaseIds = (testId) => {
    return {
        userBaseId: `:${tableIds.user}:${testId}`,
        collectedItemBaseId: `:${tableIds.collectedItem}:${testId}`,
        importBaseId: `:${tableIds.import}:${testId}`,
        appraisalBaseId: `:${tableIds.appraisal}:${testId}`,
        listingBaseId: `:${tableIds.listing}:${testId}`,
        listingPriceBaseId: `:${tableIds.listingPrice}:${testId}`,
        listingRemovalBaseId: `:${tableIds.listingRemoval}:${testId}`,
        saleBaseId: `:${tableIds.sale}:${testId}`,
        lotBaseId: `:${tableIds.lot}:${testId}`,
        lotEditBaseId: `:${tableIds.lotEdit}:${testId}`,
        lotInsertBaseId: `:${tableIds.lotInsert}:${testId}`,
        lotRemovalBaseId: `:${tableIds.lotRemoval}:${testId}`,
    }
}

const uniqueCollectedItem = (rows, collectedItemId) => {
    const filteredByCiId = rows.filter(row => row.id === collectedItemId)
    if (filteredByCiId.length === 1) return true
    return false
}

class BPCT {
    constructor() {
        const testId = uuid()
        const startISO = new Date()
        this.startISO = startISO.toISOString()
        this.tableBaseIds = buildTableBaseIds(testId)
        const baseUserId = this.buildId(0, this.tableBaseIds.userBaseId)
        const baseUser = { user_id: baseUserId, user_name: baseUserId, user_password: '12345', user_role: 'Gym Leader' }
        this.u = [baseUser]
        this.se = [...testSets]
        this.it = [...testItems]
        this.p = [...testPrintings]
        this.c = [...testConditions]
        this.ci = []
        this.i = []
        this.a = []
        this.l = []
        this.lp = []
        this.listR = []
        this.s = []
        this.lo = []
        this.le = []
        this.li = []
        this.lr = []
        this.tests = []
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
    tableFromId(id) {
        return id.split(':')[1]
    }
    compileItemHistory(collectedItemId, time) {
        const collectedItem = this.ci.find(ci => ci.id === collectedItemId)
        let imported = false
        let listingId = undefined
        let listingRemovalId = undefined
        let saleId = undefined
        const nextInsert = this.li.find(li => li.collectedItemId === collectedItemId)
        let lotId = undefined
        let nextInsertLotEditId = nextInsert ? nextInsert.lotEditId : undefined
        let nextRemovalLotEditId = undefined
        let conditionId = undefined
        let printingId = collectedItem.printingId
        const transactions = this.compileTransactions().filter(transaction => {
            if (transaction.time > time) return false
            const { table, row: data } = transaction
            if (table === 'i' && data.collectedItemId === collectedItemId) {
                imported = true
                return true
            }
            if (imported) {
                if (table === 'a' && data.collectedItemId === collectedItemId) {
                    conditionId = data.conditionId
                    return true
                }
                if (table === 'le') {
                    if (data.id === nextInsertLotEditId) {
                        lotId = data.lotId
                        nextInsertLotEditId = undefined
                        const nextRemoval = this.lr.find(lr => {
                            if (lr.collectedItemId === collectedItemId) {
                                const removalEdit = this.le.find(le => le.id === lr.lotEditId)
                                if (removalEdit.time > data.time) return true
                            }
                        })
                        if (nextRemoval) nextRemovalLotEditId = nextRemoval.lotEditId
                        return true
                    } else if (data.id === nextRemovalLotEditId) {
                        nextRemovalLotEditId = undefined
                        const nextInsert = this.li.find(li => {
                            if (li.collectedItemId === collectedItemId) {
                                const insertEdit = this.le.find(le => le.id === li.lotEditId)
                                if (insertEdit.time > data.time) return true
                            }
                        })
                        if (nextInsert) nextInsertLotEditId = nextInsert.lotEditId
                        return true
                    }
                }
                if (table === 'l') {
                    if (data.collectedItemId === collectedItemId) {
                        listingId = data.id
                        saleId = data.saleId
                        return true
                    }
                }

                if (listingId) {
                    if (!listingRemovalId) {
                        if (table === 'lp' && data.listingId === listingId) {
                            return true
                        }
                        if (table === 'listR' && data.listingId === listingId) {
                            listingRemovalId = data.id
                            return true
                        }
                        if (table === 's' && data.id === saleId) {
                            listingId = undefined
                            saleId = undefined
                            return true
                        }
                    } else {
                        if (table === 'lp' && data.listingId === listingId) {
                            listingRemovalId = undefined
                            return true
                        }
                    }
                }
            }
            return false
        })
        return { 
            transactions,
            imported, 
            listingId, 
            listingRemovalId,
            lotId,
            conditionId,
            printingId
        }
    }

    contextualizeItemMethods(collectedItemId, time) {
        const {
            transactions,
            imported, 
            listingId, 
            listingRemovalId,
            lotId,
            conditionId,
            printingId
        } = this.compileItemHistory(collectedItemId, time)
        if (!imported) return {}
        const appraise = (conditionId, appraiserId) => {
            return this.appraise(collectedItemId, conditionId, appraiserId)
        }
        const contextualizedItemMethods = { appraise }
        if (!listingId && !listingRemovalId) {
            const list = (price) => {
                return this.listItem(collectedItemId, price)
            }
            contextualizedItemMethods.list = list
        }
        if (listingId) {
            const price = (price) => {
                return this.priceListing(listingId, price)
            }
            let priceMethodName = 'relist'
            if (!listingRemovalId) {
                priceMethodName = 'price'
                const removeListing = () => this.removeListing(listingId)
                contextualizedItemMethods.removeListing = removeListing
                const sale = (purchaserId) => this.sale(listingId, purchaserId)
                contextualizedItemMethods.sale = sale
            }
            contextualizedItemMethods[priceMethodName] = price
        }

        return contextualizedItemMethods
    }

    compileLotHistory(lotId, time) {
        const lot = this.lo.find(lo => lo.id === lotId)
        let created = false
        let listingId = undefined
        let listingRemovalId = undefined
        let saleId = undefined
        const transactions = this.compileTransactions().filter(transaction => {
            if (transaction.time > time) return false
            const { table, row: data } = transaction
            if (table === 'le' && data.lotId === lotId) {
                return true
            }
            if (table === 'l' && data.lotId === lotId) {
                listingId = data.id
                saleId = data.saleId
                return true
            }
            if (listingId) {
                if (!listingRemovalId) {
                    if (table === 'lp' && data.listingId === listingId) {
                        return true
                    }
                    if (table === 'listR' && data.listingId === listingId) {
                        listingRemovalId = data.id
                        return true
                    }
                    if (table === 's' && data.id === saleId) {
                        listingId = undefined
                        saleId = undefined
                        return true
                    }
                } else {
                    if (table === 'lp' && data.listingId === listingId) {
                        listingRemovalId = undefined
                        return true
                    }
                }
            }
            return false
        })
        return { 
            transactions, 
            created, 
            listingId, 
            listingRemovalId,
        }
    }

    contextualizeLotMethods(lotId, time) {
        const {
            created,
            listingId,
            listingRemovalId,
            collectedItemId
        } = this.compileLotHistory(lotId, time)
        const edit = (inserts, removals) => {
            return this.createLotEdit(lotId, inserts, removals)
        }
        const methods = { edit }
        if (!listingId && !listingRemovalId) {
            const list = (price) => {
                return this.listLot(lotId, price)
            }
            methods.list = list
        }
        if (listingId) {
            const price = (price) => {
                return this.priceListing(listingId, price)
            }
            let priceMethodName = 'relist'
            if (!listingRemovalId) {
                priceMethodName = 'price'
                const removeListing = () => this.removeListing(listingId)
                methods.removeListing = removeListing
                const sale = (purchaserId) => this.sale(listingId, purchaserId)
                methods.sale = sale
            }
            methods[priceMethodName] = price
        }

        return methods
    }

    import(
        importerId=this.u[0].user_id,
        conditionId=this.c[0].condition_id, 
        printingId=this.p[0].printing_id, 
        itemId=this.it[0].id, 
    ) {

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
        const { appraisal } = this.appraise(collectedItemId, conditionId, importerId)
        const methods = this.contextualizeItemMethods(collectedItemId, appraisal.time)
        return { 
            collectedItem, 
            createdImport, 
            appraisal, 
            ...methods 
        }
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
        const methods = this.contextualizeItemMethods(collectedItemId, appraisal.time)
        const collectedItem = this.ci.find(ci => ci.id === collectedItemId)
        return { appraisal, collectedItem, ...methods }
    }
    listItem(collectedItemId, price) {
        const id = this.buildId(this.l.length, this.tableBaseIds.listingBaseId)
        const listing = { id, collectedItemId, price, time: this.addDay() }
        this.l = [...this.l, listing]
        const methods = this.contextualizeItemMethods(collectedItemId, listing.time)
        const collectedItem = this.ci.find(ci => ci.id === collectedItemId)
        return { listing, collectedItem, ...methods }
    }
    listLot(lotId, price) {
        const id = this.buildId(this.l.length, this.tableBaseIds.listingBaseId)
        const listing = { id, lotId, price, time: this.addDay() }
        this.l = [...this.l, listing]
        const methods = this.contextualizeLotMethods(lotId, listing.time)
        return { listing, ...methods }
    }
    priceListing(listingId, price) {
        const listing = this.l.find(l => l.id === listingId)
        const id = this.buildId(this.lp.length, this.tableBaseIds.listingPriceBaseId)
        const listingPrice = { id, listingId, price, time: this.addDay() }
        this.lp = [...this.lp, listingPrice]
        if (listing.collectedItemId) {
            const collectedItem = this.ci.find(ci => ci.id === listing.collectedItemId)
            const methods = this.contextualizeItemMethods(collectedItem.id, listingPrice.time)
            return { collectedItem, listing, listingPrice, ...methods }
        } else if (listing.lotId) {
            const lot = this.lo.find(lo => lo.id === listing.lotId)
            const methods = this.contextualizeLotMethods(lot.id, listingPrice.time)
            return { lot, listing, listingPrice, ...methods }
        }
    }
    removeListing(listingId) {
        const listing = this.l.find(l => l.id === listingId)
        const id = this.buildId(this.listR.length, this.tableBaseIds.listingRemovalBaseId)
        const listingRemoval = { id, listingId, time: this.addDay() }
        this.listR = [...this.listR, listingRemoval]
        if (listing.collectedItemId) {
            const collectedItem = this.ci.find(ci => ci.id === listing.collectedItemId)
            const methods = this.contextualizeItemMethods(listing.collectedItemId, listingRemoval.time)
            return { listingRemoval, collectedItem, ...methods }
        } else {
            const lot = this.lo.find(lo => lo.id === listing.lotId)
            const methods = this.contextualizeLotMethods(listing.lotId, listingRemoval.time)
            return { listingRemoval, lot, ...methods }
        }
    }
    sale(listingId, purchaserId) {
        const listing = this.l.find(l => l.id === listingId)
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
        if (listing.collectedItemId) {
            const methods = this.contextualizeItemMethods(listing.collectedItemId, sale.time)
            const collectedItem = this.ci.find(ci => ci.id === listing.collectedItemId)
            return { sale, collectedItem, ...methods }
        } else {
            const methods = this.contextualizeLotMethods(listing.lotId, sale.time)
            const lot = this.lo.find(lo => lo.id === listing.lotId)
            return { sale, lot, ...methods }
        }
    }
    createLot(insertCollectedItemIds) {
        const id = this.buildId(this.lo.length, this.tableBaseIds.lotBaseId)
        const lot = { id }
        this.lo = [...this.lo, lot]
        const { lotEdit, lotInserts, lotRemovals } = this.createLotEdit(lot.id, insertCollectedItemIds)
        const methods = this.contextualizeLotMethods(id, lotEdit.time)
        return { lot, lotEdit, lotInserts, lotRemovals, ...methods }
    }
    createLotEdit(lotId, insertCollectedItemIds, removalCollectedItemIds) {
        const inserts = insertCollectedItemIds.map(collectedItemId => ({ collectedItemId }))
        const removals = removalCollectedItemIds ? removalCollectedItemIds.map(collectedItemId => ({ collectedItemId })) : []
        const id = this.buildId(this.le.length, this.tableBaseIds.lotEditBaseId)
        const lotEdit = { id, lotId, time: this.addDay() }
        this.le = [...this.le, lotEdit]
        const lotInserts = this.createLotInserts(lotEdit.id, inserts)
        const lotRemovals = this.createLotRemovals(lotEdit.id, removals)
        const methods = this.contextualizeLotMethods(lotId, lotEdit.time)
        return { lotEdit, lotInserts, lotRemovals, ...methods }
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
    getItems() {
        return this.it
    }
    getPrintings() {
        return this.p
    }
    getConditions() {
        return this.c
    }
    getCollectedItems() {
        return this.ci
    }
    compileAssets() {
        return {
            u: this.u,
            ci: this.getCollectedItemsPlus(),
            lo: this.getLotsPlus()
        }
    }
    getCollectedItemsPlus() {
        return this.ci.map(collectedItem => {
            return {
                ...collectedItem,
                it: {
                    ...this.it.find(it => it.id === collectedItem.itemId),
                    se: this.se.find(se => se.set_v2_id === it.setId),
                },
                i: this.i.find(imp => imp.collectedItemId === collectedItem.id),
                a: this.a.filter(appr => appr.collectedItemId === collectedItem.id),
                l: this.l.filter(l => l.collectedItemId === collectedItem.id).map(l => {
                    return {
                        ...l,
                        lp: this.lp.filter(lp => lp.listingId === l.id),
                        listR: this.listR.filter(listR => listR.listingId === l.id),
                        s: this.s.find(s => s.id === l.saleId)
                    }
                }),
                le: this.le.filter(le => {
                    const li = this.li.find(li => li.collectedItemId === collectedItem.id && li.lotEditId === le.id)
                    const lr = this.lr.find(lr => lr.collectedItemId === collectedItem.id && lr.lotEditId === le.id)
                    if (li || lr) return true
                }).map(le => {
                    const li = this.li.find(li => li.collectedItemId === collectedItem.id && li.lotEditId === le.id)
                    const lr = this.lr.find(lr => lr.collectedItemId === collectedItem.id && lr.lotEditId === le.id)
                    return { ...le, li, lr }
                })
            }
        })
    }
    getLotsPlus() {
        return this.lo.map(lo => {
            return {
                ...lo,
                le: this.le.filter(le => le.lotId === lo.id).map(le => {
                    return {
                        ...le,
                        li: this.li.filter(li => li.lotEditId === le.id),
                        lr: this.lr.filter(lr => lr.lotEditId === le.id)
                    }
                }),
                l: this.l.filter(l => l.lotId === lo.id).map(l => {
                    return {
                        ...l,
                        lp: this.lp.filter(lp => lp.listingId === l.id),
                        listR: this.listR.filter(listR => listR.listingId === l.id),
                        s: this.s.find(s => s.id === l.saleId)
                    }
                }),
            }
        })
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
    db() {
        return {
            u: this.u,
            se: this.se,
            it: this.it,
            p: this.p,
            c: this.c,
            ci: this.ci,
            i: this.i,
            a: this.a,
            l: this.l,
            lp: this.lp,
            listR: this.listR,
            s: this.s,
            lo: this.lo,
            le: this.le,
            li: this.li,
            lr: this.lr
        }
    }
    test(testCase, cb) {
        this.tests = [...this.tests, { testCase, cb }]
    }
    getTests() {
        return this.tests
    }
    runTests() {
        let connection = undefined
        beforeAll(async () => {
            const { testPool } = globalThis
            connection = await testPool.getConnection()
            await buildTestData(this, connection)
        })
        afterAll(async () => {
            await connection.rollback()
            await connection.release()
        })

        this.tests.forEach(async (config) => {
            const { testCase, cb } = config
            if (cb) {
                const { builtQuery, check } = cb()
                test(testCase, async () => {
                    const { query, variables } = builtQuery
                    const [rows] = await connection.query(query, variables)
                    check(rows)
                })
            } else {
                test.todo(testCase)
            }
        })
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
    uniqueCollectedItem,
    BPCT
}