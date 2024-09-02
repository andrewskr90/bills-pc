import { 
    getGiftByFilter, 
    getWatchedListings, 
    loginBillsPc,
    createImports,
    deleteGiftById,
    getLotInsertsByFilter,
    getLotEditsByFilter
} from "./api/index.js";

const cookies = await loginBillsPc()
const v3watchedListings = await getWatchedListings(cookies)
for (let i=0; i<v3watchedListings.length; i++) {
    const listing = v3watchedListings[i]
    if (listing.collectedItem.id) {
        const collectedItemId = listing.collectedItem.id
        const giftRes = await getGiftByFilter({ collectedItemId }, cookies)
        if (giftRes.length > 0) {
            // create import, subtracting 1 day from time
            const {
                id: giftId,
                recipientId: importerId,
                collectedItemId,
                bulkSplitId,
                time
            } = giftRes[0]
            const adjustedTime = new Date(time)
            adjustedTime.setDate(adjustedTime.getDate()-1)
            const createdImport = {
                importerId, 
                collectedItemId, 
                bulkSplitId, 
                time: adjustedTime.toISOString()
            }
            try {
                await createImports([createdImport], cookies)
                await deleteGiftById(giftId, cookies)
            } catch (err) {
                console.log(err)
            }
        } else {
            console.log('no gifts')
        }
    } else if (listing.lot.id) {
         // at point of writing this script, listings returned without sellerIds are most likely imports already
        const giftWithLotRes = await getGiftByFilter({ lotId: listing.lot.id }, cookies)
        if (giftWithLotRes.length > 0) {

            const { id: giftId, recipientId: importerId } = giftWithLotRes[0]
            

            const lotEditRes = await getLotEditsByFilter({ lotId: listing.lot.id }, cookies)
            const allInserts = []
            let earliestEditTime
            for (let i=0; i< lotEditRes.length; i++) {
                const { id: lotEditId, time } = lotEditRes[i]
                const lotEditTime = new Date(time).toISOString()
                if (!earliestEditTime) earliestEditTime = lotEditTime
                else {
                    if (lotEditTime < earliestEditTime) earliestEditTime = lotEditTime
                }
                const inserts = await getLotInsertsByFilter({ lotEditId }, cookies)
                allInserts.push(...inserts)
            }
            const importTime = new Date(earliestEditTime)
            importTime.setDate(importTime.getDate()-1)
            const formattedImports = allInserts.map(insert => {
                const { collectedItemId, bulkSplitId } = insert
                return {
                    collectedItemId,
                    bulkSplitId,
                    time: importTime.toISOString(),
                    importerId
                }
            })
            const postedImportRes = await createImports(formattedImports, cookies)
            console.log(postedImportRes)
            const deletedGiftRes = await deleteGiftById(giftId, cookies)
            console.log(deletedGiftRes)
        } else {
            console.log('no gift with lotId:', listing.lot.id)
        }
    } else {
        throw new Error('sad path')
    }
}
