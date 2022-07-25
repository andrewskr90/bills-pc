const { v4: uuidV4 } = require('uuid')

const checkSaleType = (req, res, next) => {
    const sale = req.body
    let saleType
    if (sale.cards || sale.products) {
        saleType = 'importPurchase'
    } else if (sale.collectedCards || sale.collectedProducts) {

    }
    req.saleType = saleType
    next()
}

const formatSales = (req, res, next) => {
    let sale_purchaser_id
    const saleType = req.saleType
    const sale_id = uuidV4()
    const sales = []
    if (saleType === 'importPurchase') {
        sale_purchaser_id = req.claims.user_id
        const { date, vendor, subtotal, discount, shipping, taxAmount, taxRate, total } = req.body
        const sale = {
            sale_id: sale_id,
            sale_seller_id: null,
            sale_purchaser_id: sale_purchaser_id,
            sale_date: date,
            sale_vendor: vendor,
            sale_subtotal: subtotal,
            sale_discount: discount,
            sale_shipping: shipping,
            sale_tax_amount: taxAmount,
            sale_tax_rate: taxRate,
            sale_total: total
        }
        sales.push(sale)
    }
    req.sale_id = sale_id
    req.sales = sales
    next()
}

const formatSaleNotes = (req, res, next) => {
    const saleType = req.saleType
    const sale_id = req.sale_id
    let sale_note_user_id
    let salePurchaserNote
    const saleNotes = []
    //only handles one note from purchaser at this point
    //an array in order to handle multiple notes in future
    if (saleType === 'importPurchase') {
        if (req.body.saleNote) {
            sale_note_user_id = req.claims.user_id
            sale_note_note = req.body.saleNote
            salePurchaserNote = {
                sale_note_id: uuidV4(),
                sale_note_sale_id: sale_id,
                sale_note_user_id: sale_note_user_id,
                sale_note_note: sale_note_note
            }
            saleNotes.push(salePurchaserNote)
        }
    }
    req.saleNotes = saleNotes
    next()
}

const formatCollectedCards = (req, res, next) => {
    const saleType = req.saleType
    const collectedCards = []
    if (saleType === 'importPurchase') {
        req.body.cards.forEach(card => {
            for (let i=0; i<card.quantity; i++) {
                const collectedCard = {
                    collected_card_id: uuidV4(),
                    collected_card_card_id: card.card_id,
                    collected_card_user_id: req.claims.user_id
                
                }
                collectedCards.push(collectedCard)
            }
        })
    }
    req.collectedCards = collectedCards
    next()
}

const formatCollectedCardNotes = (req, res, next) => {
    const saleType = req.saleType
    const collectedCards = req.collectedCards
    const collectedCardNotes = []
    let collectedCardIdx = 0
    if (saleType === 'importPurchase') {
        req.body.cards.forEach((card, idx) => {
            if (saleType === 'importPurchase') {
                for (let i=0; i<card.quantity; i++) {
                    //cardNote will be the same for all cards 
                    //imported with a given quantity
                    if (card.cardNote) {
                        const collectedCardNote = {
                            collected_card_note_id: uuidV4(),
                            collected_card_note_collected_card_id: collectedCards[collectedCardIdx].collected_card_id,
                            collected_card_note_user_id: req.claims.user_id,
                            collected_card_note_note: card.cardNote
                        }
                        collectedCardNotes.push(collectedCardNote)
                        collectedCardIdx++
                    }
                }
            }
        })
        req.collectedCardNotes = collectedCardNotes
    }
    next()
}

const formatSaleCards = (req, res, next) => {
    const sale_id = req.sale_id
    const saleType = req.saleType
    const collectedCards = req.collectedCards
    const saleCards = []
    let collectedCardIdx = 0
    req.body.cards.forEach((card, idx) => {
        //importPurchase saleType needs to consider quantity
        //when resolving saleCards
        if (saleType === 'importPurchase') {
            for (let i=0; i<card.quantity; i++) {
                const saleCard = {
                    sale_card_id: uuidV4(),
                    sale_card_sale_id: sale_id,
                    sale_card_collected_card_id: collectedCards[collectedCardIdx].collected_card_id,
                    sale_card_price: card.retail
                }
                saleCards.push(saleCard)
                collectedCardIdx++
            }
        }
    })
    req.saleCards = saleCards
    next()
}

module.exports = {
    checkSaleType,
    formatSales,
    formatSaleNotes,
    formatCollectedCards,
    formatCollectedCardNotes,
    formatSaleCards
}