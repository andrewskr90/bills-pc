const { v4: uuidV4 } = require('uuid')
const Label = require('../models/Label')
const { formatSingularComponent } = require('../utils/label')
const Listing = require('../models/Listing')
const { fetchOrCreateLabelIds } = require('../utils/bulk-splits')
const { formatSaleFromPortfolioResult } = require('../utils/sale')
const { parseThenFormatListingPrices } = require('./listing-middleware')
const QueryFormatters = require('../utils/queryFormatters')
const { adjustISOMinutes } = require('../utils/date')

const createSaleNote = (note, saleId, userId) => {
    if (!note) return null
    return {
        sale_note_id: uuidV4(),
        sale_note_sale_id: saleId,
        sale_note_user_id: userId,
        sale_note_note: note
    }
}

const createGiftNote = (note, giftId, userId) => {
    if (!note) return null
    return {
        gift_note_id: uuidV4(),
        gift_note_gift_id: giftId,
        gift_note_user_id: userId,
        gift_note_note: note
    }
}

const createSaleObject =(sale, sellerId, purchaserId) => {
    const { date, vendor, subtotal, discount, shipping, taxAmount, total, purchaserNote, sellerNote } = sale
    const saleId = uuidV4()
    return {
        sale_id: saleId,
        sale_seller_id: sellerId,
        sale_purchaser_id: purchaserId,
        sale_date: date,
        sale_vendor: vendor,
        sale_subtotal: subtotal,
        sale_discount: discount,
        sale_shipping: shipping,
        sale_tax_amount: taxAmount,
        sale_total: total,
        purchaserNote: createSaleNote(purchaserNote, saleId, purchaserId),
        sellerNote: createSaleNote(sellerNote, saleId, sellerId)
    }
}

const createCollectedCardNote = (note, collectedCardId, userId) => {
    if (!note) return null
    return {
        collected_card_note_id: uuidV4(),
        collected_card_note_collected_card_id: collectedCardId,
        collected_card_note_note: note,
        collected_card_note_user_id: userId
    }
}

const createCollectedCard = (cardId, note, userId) => {
    const collectedCardId = uuidV4()
    return {
        collected_card_id: collectedCardId,
        collected_card_card_id: cardId,
        collected_card_user_id: userId,
        collected_card_note: createCollectedCardNote(note, collectedCardId, userId)
    }
}

const createSaleCard = (saleId, collectedCardId, price) => {
    return {
        sale_card_id: uuidV4(),
        sale_card_sale_id: saleId,
        sale_card_collected_card_id: collectedCardId,
        sale_card_price: price
    }
}

const createGiftCard = (giftId, collectedCardId) => {
    return {
        gift_card_id: uuidV4(),
        gift_card_gift_id: giftId,
        gift_card_collected_card_id: collectedCardId
    }
}

const createCollectedProductNote = (note, collectedProductId, userId) => {
    if (!note) return null
    return {
        collected_product_note_id: uuidV4(),
        collected_product_note_collected_product_id: collectedProductId,
        collected_product_note_note: note,
        collected_product_note_user_id: userId
    }
}

const createCollectedProduct = (productId, note, userId) => {
    const collectedProductId = uuidV4()
    return {
        collected_product_id: collectedProductId,
        collected_product_product_id: productId,
        collected_product_user_id: userId,
        collected_product_note: createCollectedProductNote(note, collectedProductId, userId)
    }
}

const createSaleProduct = (saleId, collectedProductId, price) => {
    return {
        sale_product_id: uuidV4(),
        sale_product_sale_id: saleId,
        sale_product_collected_product_id: collectedProductId,
        sale_product_price: price
    }
}

const createGiftProduct = (giftId, collectedProductId) => {
    return {
        gift_product_id: uuidV4(),
        gift_product_gift_id: giftId,
        gift_product_collected_product_id: collectedProductId
    }
}

const createGift =(gift, giverId, receiverId) => {
    const { date, giverName, receiverNote, giver_note } = gift
    const giftId = uuidV4()
    return {
        gift_id: giftId,
        gift_giver_id: giverId,
        gift_receiver_id: receiverId,
        gift_date: date,
        gift_giver_name: giverName,
        receiverNote: createGiftNote(receiverNote, giftId, receiverId),
        giverNote: createGiftNote(giver_note, giftId, giverId)
    }
}

const formatImportPurchase = async (req, res, next) => {
    const sales = req.body
    const sellerId = null
    const purchaserId = req.claims.user_id
    const createdSaleNotes = []
    const createdCollectedCards = []
    const createdCollectedProducts = []
    const createdCollectedCardNotes = []
    const createdCollectedProductNotes = []
    const createdSaleCards = []
    const createdSaleProducts = []
    const createdSales = []
    const createdBulkSplits = []

    for (let i=0; i<sales.length; i++) {
        const sale = sales[i]
        const createdSale = createSaleObject(sale, sellerId, purchaserId)
        req.body[i].sale_id = createdSale.sale_id
        if (createdSale.purchaserNote) {
            createdSaleNotes.push(createdSale.purchaserNote)
        }
        if (createdSale.sellerNote) {
            createdSaleNotes.push(createdSale.sellerNote)
        }
        delete createdSale.purchaserNote
        delete createdSale.sellerNote
        
        for (let j=0; j<sale.bulkSplits.length; j++) {
            const { count, estimate, rate, labels } = req.body[i].bulkSplits[j]
            req.body[i].bulkSplits[j] = {
                bulk_split_id: uuidV4(),
                sale_bulk_split_id: uuidV4(),
                bulk_split_count: count,
                bulk_split_estimate: estimate,
                sale_bulk_split_rate: rate,
                labels
            }
            try {
                const formattedLabels = await fetchOrCreateLabelIds(req.body[i].bulkSplits[j])
                req.body[i].bulkSplits[j] = {
                    ...req.body[i].bulkSplits[j],
                    labels: formattedLabels
                }
            } catch(err) {
                return next(err)
            }
        }

        sale.cards.forEach(card => {
            // consider the quantity of card in sale
            for (let i=0; i<card.quantity; i++) {
                const createdCollectedCard = createCollectedCard(
                    card.card_id, 
                    card.itemNote, 
                    purchaserId
                )
                const createdSaleCard = createSaleCard(
                    createdSale.sale_id, 
                    createdCollectedCard.collected_card_id, 
                    card.retail
                )
                if (createdCollectedCard.collected_card_note) { 
                    createdCollectedCardNotes.push(createdCollectedCard.collected_card_note)
                }
                delete createdCollectedCard.collected_card_note
                createdCollectedCards.push(createdCollectedCard)
                createdSaleCards.push(createdSaleCard)
            }
        })
        sale.products.forEach(product => {
            // consider the quantity of card in sale
            for (let i=0; i<product.quantity; i++) {
                const createdCollectedProduct = createCollectedProduct(
                    product.product_id, 
                    product.itemNote, 
                    purchaserId
                )
                const createdSaleProduct = createSaleProduct(
                    createdSale.sale_id, 
                    createdCollectedProduct.collected_product_id, 
                    product.retail
                )
                if (createdCollectedProduct.collected_product_note) { 
                    createdCollectedProductNotes.push(createdCollectedProduct.collected_product_note)
                }
                delete createdCollectedProduct.collected_product_note
                createdCollectedProducts.push(createdCollectedProduct)
                createdSaleProducts.push(createdSaleProduct)
            }
        })
        createdSales.push(createdSale)
    }
    

    req.sales = createdSales
    req.saleNotes = createdSaleNotes
    req.collectedCards = createdCollectedCards
    req.collectedProducts = createdCollectedProducts
    req.collectedCardNotes = createdCollectedCardNotes
    req.collectedProductNotes = createdCollectedProductNotes
    req.saleCards = createdSaleCards
    req.saleProducts = createdSaleProducts

    next()
}

const formatSaleResults = (req, res, next) => {
    const saleItems = req.results
    const sales = []

    // format is dependent on SQL query ordering by purchase date, then sale_id
    let currentSale = formatSaleFromPortfolioResult(saleItems[0])
    saleItems.forEach(saleItem => {
        if (currentSale.sale_id === saleItem.sale_id) {
            currentSale.items.push(formatSaleItemFromPortfolioResult(saleItem))
        } else {
            sales.push(currentSale)
            currentSale = formatSaleFromPortfolioResult(saleItem)
            currentSale.items.push(formatSaleItemFromPortfolioResult(saleItem))
        }
    })
    sales.push(currentSale)
    req.results = sales
    next()
}

const formatImportGift = (req, res, next) => {
    const gifts = req.body
    const giverId = null
    const receiverId = req.claims.user_id
    const createdGiftNotes = []
    const createdCollectedCards = []
    const createdCollectedProducts = []
    const createdCollectedCardNotes = []
    const createdCollectedProductNotes = []
    const createdGiftCards = []
    const createdGiftProducts = []
    const createdGifts = gifts.map(gift => {
        const createdGift = createGift(gift, giverId, receiverId)
        if (createdGift.receiverNote) {
            createdGiftNotes.push(createdGift.receiverNote)
        }
        if (createdGift.giverNote) {
            createdGiftNotes.push(createdGift.giverNote)
        }
        delete createdGift.receiverNote
        delete createdGift.giverNote
        gift.cards.forEach(card => {
            // consider the quantity of card in gift
            for (let i=0; i<card.quantity; i++) {
                const createdCollectedCard = createCollectedCard(
                    card.card_id, 
                    card.itemNote, 
                    receiverId
                )
                const createdGiftCard = createGiftCard(
                    createdGift.gift_id, 
                    createdCollectedCard.collected_card_id, 
                )
                if (createdCollectedCard.collected_card_note) { 
                    createdCollectedCardNotes.push(createdCollectedCard.collected_card_note)
                }
                delete createdCollectedCard.collected_card_note
                createdCollectedCards.push(createdCollectedCard)
                createdGiftCards.push(createdGiftCard)
            }
        })
        gift.products.forEach(product => {
            // consider the quantity of card in gift
            for (let i=0; i<product.quantity; i++) {
                const createdCollectedProduct = createCollectedProduct(
                    product.product_id, 
                    product.itemNote, 
                    receiverId
                )
                const createdGiftProduct = createGiftProduct(
                    createdGift.gift_id, 
                    createdCollectedProduct.collected_product_id
                )
                if (createdCollectedProduct.collected_product_note) { 
                    createdCollectedProductNotes.push(createdCollectedProduct.collected_product_note)
                }
                delete createdCollectedProduct.collected_product_note
                createdCollectedProducts.push(createdCollectedProduct)
                createdGiftProducts.push(createdGiftProduct)
            }
        })
        return createdGift
    })

    req.gifts = createdGifts
    req.giftNotes = createdGiftNotes
    req.collectedCards = createdCollectedCards
    req.collectedProducts = createdCollectedProducts
    req.collectedCardNotes = createdCollectedCardNotes
    req.collectedProductNotes = createdCollectedProductNotes
    req.giftCards = createdGiftCards
    req.giftProducts = createdGiftProducts
    next()
}

const checkPurchaseBulkLabels = async (req, res, next) => {
    const uniqueLabels = {}
    const cleanseLabelComponents = (component) => {
        if (!component) return false
        if (uniqueLabels[component]) return false
        uniqueLabels[component] = 1
        return true
    }
    const formattedSales = req.body.map(sale => {
        return {
            ...sale,
            bulkSplits: sale.bulkSplits.map(split => {
                return {
                    ...split,
                    estimate: split.estimate ? 1 : 0,
                    labels: split.labels.map(label => {
                        return {
                            ...label,
                            rarities: label.rarities.filter(cleanseLabelComponents),
                            types: label.types.filter(cleanseLabelComponents),
                            printings: label.printings.filter(cleanseLabelComponents),
                            expansions: label.expansions.filter(cleanseLabelComponents)
                        }
                    })
                }
            })
        }
    })
    next()
}

const createSaleFromListing = async ({ sale, listing }, purchaserId) => {
    const queryQueue = []
    try {
        const fetchedListing = await Listing.getById(listing.id)
        fetchedListing.listingPrices = parseThenFormatListingPrices(fetchedListing.listingPrices)

        if (fetchedListing.saleId) throw new Error("Listing has already been sold.")
        if (fetchedListing.ownerProxyCreatorId && fetchedListing.ownerProxyCreatorId !== purchaserId) {
            throw new Error("You don't have permission to purchase this proxy listing.")
        }
        const saleTime = new Date(sale.time)
        if (fetchedListing.listingTime > saleTime) {
            throw new Error("Time of sale must be later than time listed.")
        }
        // TODO: offer is auto created, this form of listing creation will not
        // work if the offer already exists and the seller agrees to the offer.
        // making an offer does not exist in the app yet, for now it is just storing 
        // the final purchase price. *We are accepting an offer on behalf of the proxy user*
        if (listing.discounts.length > 0) {
            if (!parseFloat(listing.discounts[0].amount)) throw new Error("Listing discount is not a number.")
            if (parseFloat(listing.discounts[0].amount) <= 0) throw new Error("Listing discount must be greater than 0.")       
            const listingDiscounts = []
            listingDiscounts.push({
                id: uuidV4(),
                listingId: listing.id,
                amount: parseFloat(listing.discounts[0].amount),
                percentage: null
            })
            queryQueue.push({ query: QueryFormatters.objectsToInsert(listingDiscounts, 'V3_ListingDiscount'), variables: [] })
        }
        const offers = []
        if (listing.offers.length > 0) {
            if (!parseFloat(listing.offers[0].amount)) throw new Error("Offer amount is not a number.")
            if (parseFloat(listing.offers[0].amount) <= 0) throw new Error("Offer amount must be greater than 0.")     
            if (parseFloat(listing.offers[0].amount) === fetchedListing.listingPrices[0][1]) {
                throw new Error("Offer amount must vary from current listing price.")
            }
            // TODO theres a chance Listing time will be after offer time
            offers.push({
                id: uuidV4(),
                listingId: listing.id,
                makerId: purchaserId,
                amount: parseFloat(listing.offers[0].amount),
                time: adjustISOMinutes(saleTime, -1),
                accepted: true
            })
            queryQueue.push({ query: QueryFormatters.objectsToInsert(offers, 'V3_Offer'), variables: [] })
        }
        const { time } = sale
        let shipping = null
        let tax = null
        if (sale.shipping) {
            if (!parseFloat(sale.shipping)) throw new Error("Shipping is not a number.")
            if (parseFloat(sale.shipping) <= 0) throw new Error("Shipping must be greater than 0.")
            shipping = parseFloat(sale.shipping)
        }
        if (sale.tax) {
            if (!parseFloat(sale.tax)) throw new Error("Tax is not a number.")
            if (parseFloat(sale.tax) <= 0) throw new Error("Tax must be greater than 0.")  
            tax = parseFloat(sale.tax)
        }
        const formattedSale = {
            id: uuidV4(),
            purchaserId,
            shipping,
            tax,
            time
        }
        queryQueue.push({ query: `${QueryFormatters.objectsToInsert([formattedSale], 'V3_Sale')};`, variables: [] })
        const listingUpdateVariables = []
        let formattedListingUpdate = `UPDATE V3_Listing SET saleId = ?`
        listingUpdateVariables.push(formattedSale.id)
        formattedListingUpdate +=  ` WHERE V3_Listing.id = ?;`
        listingUpdateVariables.push(listing.id)
        queryQueue.push({ query: formattedListingUpdate, variables: listingUpdateVariables })
        if (sale.discounts.length > 0) {
            if (!parseFloat(sale.discounts[0].amount)) throw new Error("Sale discount is not a number.")
            if (parseFloat(sale.discounts[0].amount) <= 0) throw new Error("Sale discount must be greater than 0.")  
            const saleDiscounts = []
            saleDiscounts.push({
                id: uuidV4(),
                saleId: formattedSale.id,
                amount: parseFloat(sale.discounts[0].amount),
                percentage: null
            })
            queryQueue.push({ query: QueryFormatters.objectsToInsert(saleDiscounts, 'V3_SaleDiscount'), variables: [] })
        }
        if (sale.notes.length > 0) {
            const saleNotes = []
            saleNotes.push({
                id: uuidV4(),
                saleId: formattedSale.id,
                takerId: purchaserId,
                note: sale.notes[0].note,
                time
            })
            queryQueue.push({ query: `${QueryFormatters.objectsToInsert(saleNotes, 'V3_SaleNote')};`, variables: [] })
        }
        const req = { queryQueue }
        const res = {}
        await executeQueries(req, res, (err) => {
            if (err) throw new Error(err)
            sales = req.results
        })    
        return sale.id
    } catch (err) {
        throw err
    }
}

const createSale = async (req, res, next) => {
    if (req.query.listing) {
        try {
            const saleId = await createSaleFromListing(req.body, req.claims.user_id)
            req.results = { message: "Created.", data: saleId }
        } catch (err) {
            return next(err)
        }
    } else {
        return next({ status: 404, message: 'no such route' })
    }
    next()
}

module.exports = { 
    formatImportPurchase,
    formatSaleResults,
    formatImportGift,
    checkPurchaseBulkLabels,
    createCollectedCard,
    createCollectedCardNote, 
    createSale
}