const { v4: uuidV4 } = require('uuid')

const createSaleNote = (note, saleId, userId) => {
    if (!note) return null
    return {
        sale_note_id: uuidV4(),
        sale_note_sale_id: saleId,
        sale_note_user_id: userId,
        sale_note_note: note
    }
}

const createSale =(sale, sellerId, purchaserId) => {
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




const formatImportPurchase = (req, res, next) => {
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
    const createdSales = sales.map(sale => {
        const createdSale = createSale(sale, sellerId, purchaserId)
        if (createdSale.purchaserNote) {
            createdSaleNotes.push(createdSale.purchaserNote)
        }
        if (createdSale.sellerNote) {
            createdSaleNotes.push(createdSale.sellerNote)
        }
        delete createdSale.purchaserNote
        delete createdSale.sellerNote
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
        return createdSale
    })

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

module.exports = { formatImportPurchase }