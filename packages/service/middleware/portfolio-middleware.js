const MarketPrice = require('../models/MarketPrice')

const stringifyDateYYYYMMDD = (date) => date.toISOString().split('T')[0]

const formatInventory = (inventory) => {
    const keys = Object.keys(inventory)
    return keys.map(key => {
        return {
            card_v2_id: inventory[key][0].card_v2_id,
            product_id: inventory[key][0].product_id,
            card_v2_name: inventory[key][0].card_v2_name,
            product_name: inventory[key][0].product_name,
            card_v2_number: inventory[key][0].card_v2_number,
            card_v2_rarity: inventory[key][0].card_v2_rarity,
            tcgplayer_product_id: inventory[key][0].tcgplayer_product_id,
            card_v2_foil_only: inventory[key][0].card_v2_foil_only,
            inventory: inventory[key].map(item => {
                return {
                    sale_card_id: item.sale_card_id,
                    sale_product_id: item.sale_product_id,
                    sale_card_price: item.sale_card_price,
                    sale_product_price: item.sale_product_price,
                    collected_card_id: item.collected_card_id,
                    collected_product_id: item.collected_product_id,      
                    collected_card_note_id: item.collected_card_note_id,
                    collected_product_note_id: item.collected_product_note_id,
                    collected_card_note_note: item.collected_card_note_note,
                    collected_product_note_note: item.collected_product_note_note,
                }
            })
        }
    })
}

const evaluatePortfolio = async (req, res, next) => {
    let balance = 0
    let revenue = 0
    let profit = 0
    const cardInventory = {}
    const productInventory = {}
    const compileTransactions = (sales, rips, trades) => {
        const compiledTransactions = [
            ...sales,
            // ...rips,
            // ...trades
        ]
        compiledTransactions.sort((a, b) => {
            //sort by transaction date, then by transaction id
            if (a.transaction_date < b.transaction_date) return -1
            else if (a.transaction_date > b.transaction_date) return 1
            else {
                const aTransactionId = a.sale_id || a.rip_id || a.collected_card_note_id
                const bTransactionId = b.sale_id || b.rip_id || b.collected_card_note_id
                if (aTransactionId < bTransactionId) return -1
                else if (aTransactionId > bTransactionId) return 1
                else return 0
            }
        })
        return compiledTransactions
    }
    const transactions = compileTransactions(req.sales, req.rips, req.trades)
    const generateKeyMarketDates = (timeFrame) => {
        const keyMarketDates = []
        const today = new Date()
            .setUTCHours(0, 0, 0, 0)
        if (timeFrame === '2w') {
            for (let i=0; i<14; i++) {
                if (i === 0) keyMarketDates.push(new Date(today))
                else {
                    const previousDay = new Date(keyMarketDates[i-1])
                    previousDay.setDate(previousDay.getDate()-1)
                    keyMarketDates.push(previousDay)
                }
            }

        }
        return keyMarketDates.reverse()
    }
    const calculateDailyBalance = async (startOfDay, cardInventory, productInventory) => {
        const endOfDay = new Date(startOfDay)
        endOfDay.setDate(startOfDay.getDate()+1)
        let dailyBalance = 0
        let keyDateCardPrices
        if (Object.keys(cardInventory).length > 0) {
            const formattedInventory = formatInventory(cardInventory)
            const inventoryCardIds = formattedInventory.map(card => card.card_v2_id)
            try {
                keyDateCardPrices = await MarketPrice.selectByCardIdsBetweenDates(
                    inventoryCardIds, 
                    stringifyDateYYYYMMDD(startOfDay), 
                    stringifyDateYYYYMMDD(endOfDay)
                )
            } catch (err) {
                throw new Error(err)
            }
            keyDateCardPrices.forEach(price => {
                if (price.market_price_price) {
                    const priceCardId = price.market_price_card_id
                    const selectedItem = formattedInventory.filter(card => {
                        return card.card_v2_id === priceCardId
                    })[0]
                    const inventoryCount = selectedItem.inventory.length
                    dailyBalance+= parseFloat(price.market_price_price) * inventoryCount
                }
            })
        }
        let keyDateProductPrices
        if (Object.keys(productInventory).length > 0) {
            const formattedInventory = formatInventory(productInventory)
            const inventoryProductIds = formattedInventory.map(product => product.product_id)
            try {
                keyDateProductPrices = await MarketPrice.selectByProductIdsBetweenDates(
                    inventoryProductIds, 
                    stringifyDateYYYYMMDD(startOfDay), 
                    stringifyDateYYYYMMDD(endOfDay)
                )
            } catch (err) {
                throw new Error(err)
            }
            keyDateProductPrices.forEach(price => {
                if (price.market_price_price) {
                    const priceProductId = price.market_price_product_id
                    const selectedItem = formattedInventory.filter(product => {
                        return product.product_id === priceProductId
                    })[0]
                    const inventoryCount = selectedItem.inventory.length
                    dailyBalance+= parseFloat(price.market_price_price) * inventoryCount
                }
            })
        }
        return dailyBalance
    }
    const keyMarketDates = generateKeyMarketDates(req.query.timeFrame)
    /* history arrays keep track of portfolio stats tied to a point in time */
    const balanceHistory = []
    const investmentHistory = []
    let investmentCount = 0
    for (let i=0; i<transactions.length; i++) {
        if (transactions[i].sale_id) {
            const sale = transactions[i]
            /* check if user is purchaser in sale */
            if (sale.sale_purchaser_id === req.claims.user_id) {
                /* add sale amount to investmentCount */
                investmentCount += sale.sale_total
                investmentHistory.push({
                    investment: investmentCount,
                    date: sale.transaction_date,
                })

                /* collect purchase items */
                sale.items.forEach(saleItem => {
                    /* group saleItems by unique item types */
                    const formattedSaleItem = {
                        ...sale,
                        ...saleItem
                    }
                    delete formattedSaleItem.items
                    if (saleItem.card_v2_id) {
                        const itemId = saleItem.card_v2_id
                        if (!cardInventory[itemId]) {
                            cardInventory[itemId] = [formattedSaleItem]
                        } else {
                            cardInventory[itemId] = [
                                ...cardInventory[itemId],
                                formattedSaleItem
                            ]
                        }
                    } else {
                        const itemId = saleItem.product_id
                        if (!productInventory[itemId]) {
                            productInventory[itemId] = [formattedSaleItem]
                        } else {
                            productInventory[itemId] = [
                                ...productInventory[itemId],
                                formattedSaleItem
                            ]
                        }
                    }

                })
            /* otherwise, user is seller in sale */
            } else if (sale.sale_seller_id === req.claims.user_id) {
                revenue += sale.sale_total
            }
        }
        
        /** check if current transaction is last of the day */
        const currentTransactionDate = new Date(transactions[i].transaction_date).setHours(0, 0, 0, 0)
        let nextTransactionDate = false
        if (i < transactions.length - 1) {
            nextTransactionDate = new Date(transactions[i + 1].transaction_date).setHours(0, 0, 0, 0)
        }
        if (currentTransactionDate !== nextTransactionDate || !nextTransactionDate) {
            /** find market prices for the day's adjusted inventory */
            /** check if transactions date falls on keyMarketDate */
            if (!nextTransactionDate) {
                // no more transactions after current, 
                while (keyMarketDates.length > 0) {
                    const startOfDay = keyMarketDates.pop()
                    try {
                        const dailyBalance = await calculateDailyBalance(startOfDay, cardInventory, productInventory)
                        balanceHistory.push({ balance: dailyBalance, date: startOfDay })
                    } catch (err) {
                        next(err)
                    }
                }
            } else {
                while (keyMarketDates[0] < currentTransactionDate) keyMarketDates.pop()
                while (keyMarketDates[0] >= currentTransactionDate && keyMarketDates[0] < nextTransactionDate) {
                    const startOfDay = keyMarketDates.pop()
                    try {
                        const dailyBalance = await calculateDailyBalance(startOfDay, cardInventory, productInventory)
                        balanceHistory.push({ balance: dailyBalance, date: startOfDay })
                    } catch (err) {
                        next(err)
                    }
                }
            }
        }
    }
    
    req.results = {
        balanceHistory: balanceHistory,
        investmentHistory: investmentHistory,
        // revenue: revenue,
        sales: req.sales,
        // inventory: { 
        //     products: productInventoryWithPrices, 
        //     cards: cardInventoryWithPrices 
        // }
    }
    next()
}

module.exports = { evaluatePortfolio }
