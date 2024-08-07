import { getGiftByFilter, getWatchedListings, loginBillsPc, patchGiftByFilter, patchLotEditByFilter, getLotEditsByFilter } from "./api/index.js";

const cookies = await loginBillsPc()
const v3watchedListings = await getWatchedListings(cookies)
for (let i=0; i<v3watchedListings.length; i++) {
    const listing = v3watchedListings[i]
    const listingTime = new Date(listing.listingTime)
    if (listing.collectedItem.id) {
        const collectedItemId = listing.collectedItem.id
        const giftRes = await getGiftByFilter({ collectedItemId }, cookies)
        if (giftRes.length > 0) {
            const gift = giftRes[0]
            const giftTime = new Date(gift.time)
            if (listingTime.toISOString() === giftTime.toISOString()) {
                giftTime.setHours(newGiftTime.getHours()-1)
                try {
                    const res = await patchGiftByFilter({ collectedItemId }, { time: giftTime.toISOString() }, cookies)
                    console.log(res)
                } catch (err) {
                    console.log(err)
                }
            } else if (giftTime > listingTime) {
                console.log('gift greater than listing')
            } else {
                console.log('gift less than listing')
            }
        }
    } else if (listing.lot.id) {
        // at point of writing this script, listings returned without sellerIds are most likely imports already
        const giftWithLotRes = await getGiftByFilter({ lotId: listing.lot.id }, cookies)
        if (giftWithLotRes.length > 0) {
            for (let i=0; i< giftWithLotRes.length; i++) {
                const giftWithLot = giftWithLotRes[0]
                const giftWithLotTime= new Date(giftWithLot.time)
                if (giftWithLotTime.toISOString() === listingTime.toISOString()) {
                    // subtract an hour from this specific gift
                    giftWithLotTime.setHours(giftWithLotTime.getHours()-1)
                    try {
                        const res = await patchGiftByFilter({ lotId: listing.lot.id }, { time: giftWithLotTime.toISOString() }, cookies)
                    } catch (err) {
                        console.log(err)
                    }
                } else if (giftWithLotTime > listingTime) {
                    console.log('gift greater than listing')
                } else {
                    console.log('gift less than listing')
                }
            }
            const lotEditRes = await getLotEditsByFilter({ lotId: listing.lot.id }, cookies)
            lotEditRes.sort((a, b) => {
                const aTime = new Date(a.time)
                const bTime = new Date(b.time)
                if (aTime < bTime) return -1
                if (aTime > bTime) return 1
                return 0
            })
            for (let i=0; i< lotEditRes.length; i++) {
                const lotEdit = lotEditRes[i]
                const lotEditTime = new Date(lotEdit.time)
                const listingTime = new Date(listing.listingTime)
                if (lotEditTime.toISOString() === listingTime.toISOString()) {
                    // subtract an hour from this specific edit
                    lotEditTime.setHours(lotEditTime.getHours()-2)
                    await patchLotEditByFilter({ id: lotEdit.id }, { time: lotEditTime.toISOString() }, cookies)
                }
                else if (lotEditTime > listingTime) console.log('edit greater than listing')
                else console.log('edit less than listing')
            }
        } else {
            console.log('no gift with lotId:', listing.lot.id)
        }
    } else {
        throw new Error('sad path')
    }
}

// lotEdit
// gift
// listing

// import x100
// lotEdit
// listing

// lotEdit subtract 1 minute
// create import for each item, time subtract 2 minutes
// delete gift

