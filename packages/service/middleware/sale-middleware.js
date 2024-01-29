const { v4: uuidV4 } = require('uuid')
const Label = require('../models/Label')
const { formatSingularComponent } = require('../utils/label')
const Sale = require('../models/Sale')
const { fetchOrCreateLabelIds } = require('../utils/bulk-splits')
const { formatSaleFromPortfolioResult } = require('../utils/sale')

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

const createSale = async (req, res, next) => {
    if (req.query.listing) {
        try {
            const saleId = await Sale.createFromListing(req.body, req.claims.user_id)
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