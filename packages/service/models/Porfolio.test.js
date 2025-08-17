const { buildGetPortfolioExperimental } = require('./Portfolio')
const { BPCT, uniqueCollectedItem, daysAfterStart } = require('../test')

const bpct = new BPCT() // init user
bpct.buildUsers(2) // create number of proxy users, default 1
const { u, it, p, c } = bpct.db()

// first, we wont worry about the current status (if its sold or if it was added to lot since the purchase)
// just worry about the acquisition

bpct.test('imported item that is not sold is present in portfolio', () => {
    // create data
    const { collectedItem, createdImport } = bpct.import()
    // build query
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, createdImport.time))
    // write check
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})


bpct.test('two imported items, added to lot, that are not sold are present in portfolio as lot items', () => {
    const { collectedItem: collectedItemA } = bpct.import()
    const { collectedItem: collectedItemB } = bpct.import()
    const { lotEdit } = bpct.createLot([collectedItemA.id, collectedItemB.id])

    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, lotEdit.time))
    const check = (rows) => {
        const filteredByCiId = rows.filter(row => {
            return row.id === collectedItemA.id
                || row.id === collectedItemB.id
        })
        expect(filteredByCiId.length).toEqual(2)
    }
    return { builtQuery, check }
})


bpct.test('purchasing previously imported item yeilds one instance of that item', () => {
    const { collectedItem, sale } = bpct.import().list(10).sale(u[1].user_id)
    .list(9).sale(u[2].user_id)
    .list(7).sale(u[0].user_id)

    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})


bpct.test('purchasing lot containing previously imported item yeilds one instance of that item', () => {
    const { collectedItem } = bpct.import().list(5).sale(u[1].user_id)
    const { sale } = bpct.createLot([collectedItem.id])
        .list(4).sale(u[0].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})
bpct.test('purchasing previously purchased item yeilds one instance of that item', () => {
    const { collectedItem, sale } = bpct.import()
        .list(5).sale(u[1].user_id)
        .list(6).sale(u[2].user_id)
        .list(7).sale(u[1].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[1].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})
bpct.test('purchasing lot containing previously purchased item yeilds one instance of that item', () => {
    const { collectedItem } = bpct.import()
        .list(5).sale(u[1].user_id)
        .list(6).sale(u[2].user_id)
    const { sale } = bpct.createLot([collectedItem.id])
        .list(7).sale(u[1].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[1].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})
bpct.test('purchasing previously purchased lot item yeilds one instance of that item', () => {
    const { collectedItem } = bpct.import()
    const { lot } = bpct.createLot([collectedItem.id])
        .list(5).sale(u[1].user_id)
        .list(6).sale(u[2].user_id)
    bpct.createLotEdit(lot.id, [], [collectedItem.id])
    const { sale } = bpct.listItem(collectedItem.id, 10).sale(u[1].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[1].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})
bpct.test('purchasing lot containing previously purchased lot item yeilds one instance of that item', () => {
    const { collectedItem } = bpct.import()
    const { lot: lotA } = bpct.createLot([collectedItem.id])
        .list(5).sale(u[1].user_id)
        .list(6).sale(u[2].user_id)
    bpct.createLotEdit(lotA.id, [], [collectedItem.id])

    const { sale } = bpct.createLot([collectedItem.id])
        .list(5).sale(u[1].user_id)

    const builtQuery = buildGetPortfolioExperimental(u[1].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        expect(uniqueCollectedItem(rows, collectedItem.id)).toBeTruthy()
    }
    return { builtQuery, check }
})
bpct.test(
    `previously imported item, previously purchased lot item, 
    and brand new item are purchased within a new lot`, 
    () => {
        const { collectedItem: collectedItemA } = bpct.import()
            .list(4).sale(u[2].user_id)
        const { collectedItem: collectedItemB } = bpct.import(
            u[1].user_id,
            c[0].condition_id, 
            p[0].printing_id, 
            it[0].id
        )
        const { lot: lotA } = bpct.createLot([collectedItemB.id])
            .list(60).sale(u[0].user_id)
            .list(50).sale(u[2].user_id)
        bpct.createLotEdit(lotA.id, [], [collectedItemB.id])
        const { collectedItem: collectedItemC } = bpct.import(
            u[2].user_id,
            c[0].condition_id, 
            p[0].printing_id, 
            it[0].id
        )
        const { sale } = bpct.createLot([
            collectedItemA.id,
            collectedItemB.id,
            collectedItemC.id
        ]).list(20).sale(u[0].user_id)

        const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, sale.time))
        const check = (rows) => {
            expect(uniqueCollectedItem(rows, collectedItemA.id)).toBeTruthy()
            expect(uniqueCollectedItem(rows, collectedItemB.id)).toBeTruthy()
            expect(uniqueCollectedItem(rows, collectedItemC.id)).toBeTruthy()
        }
        return { builtQuery, check }
    }
)


bpct.test('imported item that is sold is not present in portfolio', 
    () => {
        const { collectedItem, sale } = bpct.import().list(13).sale(u[1].user_id)
        const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, sale.time))
        const check = (rows) => {
            const filteredByCiId = rows.filter(row => row.id === collectedItem.id)
            expect(filteredByCiId.length).toEqual(0)
        }
        return { builtQuery, check }
    }
)

bpct.test('imported item, added to lot, that is sold is not present in portfolio', () => {
    const { collectedItem } = bpct.import()
    const { sale } = bpct.createLot([collectedItem.id]).list(200).sale(u[1].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        const filteredByCiId = rows.filter(row => row.id === collectedItem.id)
        expect(filteredByCiId.length).toEqual(0)
    }
    return { builtQuery, check }
})

bpct.test('imported item, added to lot, removed from lot, is still in portfolio after the lot sells', () => {
    const { collectedItem } = bpct.import()
    const { collectedItem: collectedItemB } = bpct.import()
    const lot = bpct.createLot([collectedItem.id, collectedItemB.id])
    lot.edit([], [collectedItem.id])
    const { sale } = lot.list(200).sale(u[1].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, sale.time))
    const check = (rows) => {
        const filteredByCiId = rows.filter(row => row.id === collectedItem.id)
        expect(filteredByCiId.length).toEqual(1)
    }
    return { builtQuery, check }
})

bpct.test('item sold within lot, which is removed after the sale, is not present within portfolio',
    () => {
        const { collectedItem } = bpct.import()
        const soldLot = bpct.createLot([collectedItem.id]).list(200).sale(u[1].user_id)
        const { lotEdit } = soldLot.edit([], [collectedItem.id])
        const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, lotEdit.time))
        
        const check = (rows) => {
            const filteredByCiId = rows.filter(row => row.id === collectedItem.id)
            expect(filteredByCiId.length).toEqual(0)
        }
        return { builtQuery, check }
    }
)
bpct.test(`purchased lot item, removed from lot, added to another lot which sells, 
    then is removed by purchaser is not present in portfolio`,
    () => {
        const { collectedItem } = bpct.import(
            u[1].user_id,
            c[0].condition_id, 
            p[0].printing_id, 
            it[0].id
        )
        const soldLot = bpct.createLot([collectedItem.id]).list(2).sale(u[0].user_id)
        soldLot.edit([], [collectedItem.id])
        const soldAnotherLot = bpct.createLot([collectedItem.id]).list(3).sale(u[2].user_id)
        const { lotEdit: lotEditAgain } = soldAnotherLot.edit([], [collectedItem.id])
        const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, lotEditAgain.time))

        const check = (rows) => {
            const filteredByCiId = rows.filter(row => row.id === collectedItem.id)
            expect(filteredByCiId.length).toEqual(0)
        }
        return { builtQuery, check }
    }
)
bpct.test('appraisal value reflects correct condition at time of query', () => {
    const imported = bpct.import(
        u[0].user_id,
        c[0].condition_id, 
        p[0].printing_id, 
        it[0].id
    )
    const { appraisal } = imported.appraise(c[1].condition_id, u[1].user_id)
        .appraise(c[2].condition_id, u[1].user_id)

    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, appraisal.time))

    const check = (rows) => {
        const collectedItem = rows.find(row => row.id === imported.collectedItem.id)
        expect(collectedItem.appraisal.id).toEqual(appraisal.id)
        expect(collectedItem.appraisal.condition.id).toEqual(appraisal.conditionId)
    }
    return { builtQuery, check }
})
bpct.test('item within unsold lot includes correct lot information', () => {
    const imported = bpct.import(
        u[0].user_id,
        c[0].condition_id, 
        p[0].printing_id, 
        it[0].id
    )
    const firstLot = bpct.createLot([imported.collectedItem.id])
    firstLot.edit([], [imported.collectedItem.id])
    const secondLot = bpct.createLot([imported.collectedItem.id])
    
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, secondLot.lotEdit.time))

    const check = (rows) => {
        const collectedItem = rows.find(row => row.id === imported.collectedItem.id)
        expect(collectedItem.lot.id).toEqual(secondLot.lot.id)
        expect(collectedItem.lot.edit.id).toEqual(secondLot.lotEdit.id)
        const targetInsert = secondLot.lotInserts.find(insert => insert.collectedItemId === imported.collectedItem.id)
        expect(collectedItem.lot.edit.insert.id).toEqual(targetInsert.id)
    }
    return { builtQuery, check }
})

bpct.test('listing info of unsold item includes correct listing info', () => {
    const imported = bpct.import(
        u[1].user_id,
        c[0].condition_id, 
        p[0].printing_id, 
        it[0].id
    )
    const { listing } = imported.list(10).sale(u[0].user_id).list(11)
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, listing.time))

    const check = (rows) => {
        const collectedItem = rows.find(row => row.id === imported.collectedItem.id)
        expect(collectedItem.listing.id).toEqual(listing.id)
        expect(collectedItem.listing.price).toEqual(listing.price)
    }
    return { builtQuery, check }
})
bpct.test('updated-price listing info of unsold item includes correct listing info', () => {
    const imported = bpct.import(
        u[1].user_id,
        c[0].condition_id, 
        p[0].printing_id, 
        it[0].id
    ).list(10).sale(u[0].user_id).list(11).price(12).price(13)
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, imported.listingPrice.time))

    const check = (rows) => {
        const collectedItem = rows.find(row => row.id === imported.collectedItem.id)
        expect(collectedItem.listing.id).toEqual(imported.listing.id)
        expect(collectedItem.listing.price).toEqual(imported.listing.price)
        expect(collectedItem.listing.updatedPrice.id).toEqual(imported.listingPrice.id)
        expect(collectedItem.listing.updatedPrice.price).toEqual(imported.listingPrice.price)
    }
    return { builtQuery, check }
})
bpct.test('re-listed listing info of unsold item includes correct listing info', () => {
    const imported = bpct.import(
        u[1].user_id,
        c[0].condition_id, 
        p[0].printing_id, 
        it[0].id
    ).list(10).sale(u[0].user_id).list(11).removeListing().relist(12)
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, imported.listingPrice.time))

    const check = (rows) => {
        const collectedItem = rows.find(row => row.id === imported.collectedItem.id)
        expect(collectedItem.listing.id).toEqual(imported.listing.id)
        expect(collectedItem.listing.price).toEqual(imported.listingPrice.price)
        expect(collectedItem.listing.updatedPrice.id).toBeNull()
        expect(collectedItem.listing.updatedPrice.price).toBeNull()

    }
    return { builtQuery, check }
})
bpct.test('previously listed item includes the removed listing information', () => {
    const { listing, price, collectedItem: listedCollectedItem } = bpct.import(
        u[1].user_id,
        c[0].condition_id, 
        p[0].printing_id, 
        it[0].id
    ).list(10).sale(u[0].user_id).list(11)
    const { listingPrice, removeListing } = price(12)
    const { listingRemoval } = removeListing()
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, listingRemoval.time))

    const check = (rows) => {
        const collectedItem = rows.find(row => row.id === listedCollectedItem.id)
        expect(collectedItem.listing.id).toEqual(listing.id)
        expect(collectedItem.listing.price).toEqual(listing.price)
        expect(collectedItem.listing.removal.id).toEqual(listingRemoval.id)
        expect(collectedItem.listing.updatedPrice.id).toEqual(listingPrice.id)
        expect(collectedItem.listing.updatedPrice.price).toEqual(listingPrice.price)
    }
    return { builtQuery, check }
})
bpct.test('item removed from listed lot does not appear as listed', () => {
    const imported = bpct.import(
        u[0].user_id,
        c[0].condition_id, 
        p[0].printing_id, 
        it[0].id
    )
    const secondImported = bpct.import(
        u[0].user_id,
        c[0].condition_id, 
        p[0].printing_id, 
        it[0].id
    )
    const firstLot = bpct.createLot([imported.collectedItem.id, secondImported.collectedItem.id])
    firstLot.edit([], [imported.collectedItem.id])

    const soldLot = firstLot.list(20).sale(u[1].user_id)
    
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, soldLot.sale.time))

    const check = (rows) => {
        const collectedItem = rows.find(row => row.id === imported.collectedItem.id)
        const secondCollectedItem = rows.find(row => row.id === secondImported.collectedItem.id)
        expect(secondCollectedItem).toEqual(undefined)
        expect(collectedItem.lot.id).toBeNull()
    }
    return { builtQuery, check }
})


bpct.test('imported item appraisal value reflects correct condition at time of import', () => {
    const imported = bpct.import(
        u[0].user_id,
        c[0].condition_id, 
        p[0].printing_id, 
        it[0].id
    )
    const appraised = imported.appraise(c[1].condition_id, u[0].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, appraised.appraisal.time))

    const check = (rows) => {
        const collectedItem = rows.find(row => row.id === imported.collectedItem.id)
        expect(collectedItem.appraisal.id).toEqual(appraised.appraisal.id)
        expect(collectedItem.appraisal.condition.id).toEqual(appraised.appraisal.conditionId)
        expect(collectedItem.credit.appraisal.id).toEqual(imported.appraisal.id)
        expect(collectedItem.credit.appraisal.condition.id).toEqual(imported.appraisal.conditionId)
    }
    return { builtQuery, check }

})
bpct.test('purchased item appraisal value reflects correct condition at time of purchase', () => {
    const appraised = bpct.import(
        u[1].user_id,
        c[0].condition_id, 
        p[0].printing_id, 
        it[0].id
    ).appraise(c[1].condition_id, u[1].user_id)
    const purchased = appraised.list(40).sale(u[0].user_id).appraise(c[2].condition_id, u[0].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, purchased.appraisal.time))

    const check = (rows) => {
        const collectedItem = rows.find(row => row.id === purchased.collectedItem.id)
        expect(collectedItem.appraisal.id).toEqual(purchased.appraisal.id)
        expect(collectedItem.appraisal.condition.id).toEqual(purchased.appraisal.conditionId)
        expect(collectedItem.credit.appraisal.id).toEqual(appraised.appraisal.id)
        expect(collectedItem.credit.appraisal.condition.id).toEqual(appraised.appraisal.conditionId)
    }
    return { builtQuery, check }
})
bpct.test('purchased item shows correct credit lot information', () => {
    const imported = bpct.import(
        u[0].user_id,
        c[0].condition_id, 
        p[0].printing_id, 
        it[0].id
    ).list(45).sale(u[1].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[1].user_id, daysAfterStart(0.5, imported.sale.time))

    const check = (rows) => {
        const collectedItem = rows.find(row => row.id === imported.collectedItem.id)
        expect(collectedItem.credit.lot.id).toBeNull()
    }
    return { builtQuery, check }
})
bpct.test('purchased lot item shows correct credit lot information', () => {
    const imported = bpct.import(
        u[0].user_id,
        c[0].condition_id, 
        p[0].printing_id, 
        it[0].id
    )
    const createdLot = bpct.createLot([imported.collectedItem.id])
    const soldLot = createdLot.list(45).sale(u[1].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[1].user_id, daysAfterStart(0.5, soldLot.sale.time))

    const check = (rows) => {
        const collectedItem = rows.find(row => row.id === imported.collectedItem.id)
        expect(collectedItem.credit.lot.id).toEqual(soldLot.lot.id)
        expect(collectedItem.credit.lot.edit.id).toEqual(createdLot.lotEdit.id)
        const lotInsert = createdLot.lotInserts.find(insert => insert.collectedItemId = imported.collectedItem.id)
        expect(collectedItem.credit.lot.edit.insert.id).toEqual(lotInsert.id)
    }
    return { builtQuery, check }
})
bpct.test('purchased item which was relisted shows correct credit listing information', () => {
    const removedListing = bpct.import(
        u[0].user_id,
        c[0].condition_id, 
        p[0].printing_id, 
        it[0].id
    ).list(7).removeListing()
    const relistedItem = removedListing.relist(6)
    const purchasedItem = relistedItem.sale(u[1].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[1].user_id, daysAfterStart(0.5, purchasedItem.sale.time))

    const check = (rows) => {
        const collectedItem = rows.find(row => row.id === purchasedItem.collectedItem.id)
        expect(collectedItem.credit.listing.id).toEqual(relistedItem.listing.id)
        expect(collectedItem.credit.listing.price).toEqual(relistedItem.listingPrice.price)
        expect(collectedItem.credit.listing.relisted.id).toEqual(relistedItem.listingPrice.id)
        expect(collectedItem.credit.listing.updatedPrice.id).toBeNull()
        expect(collectedItem.credit.listing.removal.id).toBeNull()
    }
    return { builtQuery, check }
})
bpct.test('purchased item listing with price update shows correct credit listing information', () => {
    const updatedPrice = bpct.import(
        u[0].user_id,
        c[0].condition_id, 
        p[0].printing_id, 
        it[0].id
    ).list(7).price(5)
    const purchasedItem = updatedPrice.sale(u[1].user_id)
    const builtQuery = buildGetPortfolioExperimental(u[1].user_id, daysAfterStart(0.5, purchasedItem.sale.time))

    const check = (rows) => {
        const collectedItem = rows.find(row => row.id === purchasedItem.collectedItem.id)
        expect(collectedItem.credit.listing.id).toEqual(purchasedItem.listing.id)
        expect(collectedItem.credit.listing.price).toEqual(purchasedItem.listing.price)
        expect(collectedItem.credit.listing.relisted.id).toBeNull()
        expect(collectedItem.credit.listing.updatedPrice.id).toEqual(updatedPrice.listingPrice.id)
        expect(collectedItem.credit.listing.updatedPrice.price).toEqual(updatedPrice.listingPrice.price)
        expect(collectedItem.credit.listing.removal.id).toBeNull()
    }
    return { builtQuery, check }
})

// TODO sold items are not being returned in portfolio query, which is exptected. Adjust query
// to search for completed sales.

// bpct.test('item sold within lot includes lot information at time of sale', () => {
//     const imported = bpct.import(
//         u[0].user_id,
//         c[0].condition_id, 
//         p[0].printing_id, 
//         it[0].id
//     )
//     const firstLot = bpct.createLot([imported.collectedItem.id])
//     firstLot.list(12).sale(u[1].user_id)
//     firstLot.edit([], [imported.collectedItem.id])
//     const secondLot = bpct.createLot([imported.collectedItem.id])
    
//     const builtQuery = buildGetPortfolioExperimental(u[0].user_id, daysAfterStart(0.5, secondLot.lotEdit.time))

//     const check = (rows) => {
//         const collectedItem = rows.find(row => row.id === imported.collectedItem.id)
//         console.log(collectedItem)
//         expect(collectedItem.lot.id).toEqual(firstLot.lot.id)
//         expect(collectedItem.lot.edit.id).toEqual(firstLot.lotEdit.id)
//         const targetInsert = firstLot.lotInserts.find(insert => insert.collectedItemId === imported.collectedItem.id)
//         expect(collectedItem.lot.edit.insert.id).toEqual(targetInsert.id)
//     }
//     return { builtQuery, check }
// })

// bpct.test('listing info of sold item includes correct listing info')
// bpct.test('updated-price listing info of sold item includes correct listing info')
// bpct.test('re-listed listing info of sold item includes correct listing info')
// bpct.test('sold item shows correct information')
// bpct.test('sold item within lot shows correct information')

// TODO I think I will forget to run this every new test file
bpct.runTests()
