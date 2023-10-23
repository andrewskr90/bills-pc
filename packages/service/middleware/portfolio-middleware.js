const MarketPrice = require('../models/MarketPrice')
const SaleBulkSplit = require('../models/SaleBulkSplit')
const SaleProduct = require('../models/SaleProduct')
const SaleCard = require('../models/SaleCard')
const SortingGem = require('../models/SortingGem')
const SortingSplit = require('../models/SortingSplit')
const { formatSaleFromPortfolioResult } = require('../utils/sale')

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
    const { saleCards, saleProducts, saleBulkSplits, sortingSplits, sortingGems } = req
    let balance = 0
    let revenue = 0
    let profit = 0
    const cardInventory = {}
    const productInventory = {}
    let bulkSplitInventory = []
    const compileSales = (saleCards, saleProducts, saleBulkSplits) => {
        const saleRef = {}
        saleCards.forEach(card => {
            const { 
                sale_id,
                sale_seller_id,
                sale_purchaser_id,
                sale_date,
                sale_vendor,
                sale_subtotal,
                sale_discount,
                sale_shipping,
                sale_tax_amount,
                sale_tax_rate,
                sale_total,
                card_v2_id,
                collected_card_id,
                sale_card_id,
                sale_card_price
            } = card
            if (!saleRef[card.sale_id]) {
                saleRef[card.sale_id] = {
                    sale_id,
                    sale_seller_id,
                    sale_purchaser_id,
                    sale_date,
                    sale_vendor,
                    sale_subtotal,
                    sale_discount,
                    sale_shipping,
                    sale_tax_amount,
                    sale_tax_rate,
                    sale_total,
                    saleCards: [
                        {
                            card_v2_id,
                            collected_card_id,
                            sale_id,
                            sale_card_id,
                            sale_card_price
                        }
                    ],
                    saleProducts: [],
                    saleBulkSplits: []
                }
            } else {
                const existingSale = saleRef[card.sale_id]
                saleRef[card.sale_id] = {
                    ...existingSale,
                    saleCards: [
                        ...existingSale.saleCards,
                        {
                            card_v2_id,
                            collected_card_id,
                            sale_id,
                            sale_card_id,
                            sale_card_price
                        }
                    ]
                }
            }
        })
        saleProducts.forEach(product => {
            const { 
                sale_id,
                sale_seller_id,
                sale_purchaser_id,
                sale_date,
                sale_vendor,
                sale_subtotal,
                sale_discount,
                sale_shipping,
                sale_tax_amount,
                sale_tax_rate,
                sale_total,
                product_id,
                collected_product_id,
                sale_product_id,
                sale_product_price
            } = product
            if (!saleRef[product.sale_id]) {
                saleRef[product.sale_id] = {
                    sale_id,
                    sale_seller_id,
                    sale_purchaser_id,
                    sale_date,
                    sale_vendor,
                    sale_subtotal,
                    sale_discount,
                    sale_shipping,
                    sale_tax_amount,
                    sale_tax_rate,
                    sale_total,
                    saleCards: [],
                    saleProducts: [
                        {
                            product_id,
                            collected_product_id,
                            sale_id,
                            sale_product_id,
                            sale_product_price
                        }
                    ],
                    saleBulkSplits: []
                }
            } else {
                const existingSale = saleRef[product.sale_id]
                saleRef[product.sale_id] = {
                    ...existingSale,
                    saleProducts: [
                        ...existingSale.saleProducts,
                        {
                            product_id,
                            collected_product_id,
                            sale_id,
                            sale_product_id,
                            sale_product_price
                        }
                    ]
                }
            }
        })
        saleBulkSplits.forEach(saleBulkSplit => {
            const { 
                bulk_split_id,
                bulk_split_count,
                bulk_split_estimate,
                sale_bulk_split_id,
                sale_bulk_split_rate,
                labels,
                sale_id,
                sale_seller_id,
                sale_purchaser_id,
                sale_date,
                sale_vendor,
                sale_subtotal,
                sale_discount,
                sale_shipping,
                sale_tax_amount,
                sale_tax_rate,
                sale_total
            } = saleBulkSplit
            if (!saleRef[saleBulkSplit.sale_id]) {
                saleRef[saleBulkSplit.sale_id] = {
                    sale_id,
                    sale_seller_id,
                    sale_purchaser_id,
                    sale_date,
                    sale_vendor,
                    sale_subtotal,
                    sale_discount,
                    sale_shipping,
                    sale_tax_amount,
                    sale_tax_rate,
                    sale_total,
                    saleCards: [],
                    saleProducts: [],
                    saleBulkSplits: [
                        {
                            bulk_split_id,
                            bulk_split_count,
                            bulk_split_estimate,
                            sale_id,
                            sale_bulk_split_id,
                            sale_bulk_split_rate,
                            labels
                        }
                    ]
                }
            } else {
                const existingSale = saleRef[saleBulkSplit.sale_id]
                saleRef[saleBulkSplit.sale_id] = {
                    ...existingSale,
                    saleBulkSplits: [
                        ...existingSale.saleBulkSplits,
                        {
                            bulk_split_id,
                            bulk_split_count,
                            bulk_split_estimate,
                            sale_bulk_split_id,
                            sale_id,
                            sale_bulk_split_rate,
                            labels
                        }
                    ]
                }
            }
        })
        return Object.keys(saleRef).map(saleId => saleRef[saleId])
    }
    const compileSortings = (sortingSplits, sortingGems) => {
        const sortingRef = {}
        sortingSplits.forEach(split => {
            const { 
                sorting_id,
                sorting_sorter_id,
                sorting_bulk_split_id,
                sorting_date,
                sorting_split_id,
                bulk_split_id,
                bulk_split_count,
                bulk_split_estimate,
                labels,
            } = split
            if (!sortingRef[split.sorting_id]) {
                sortingRef[split.sorting_id] = {
                    sorting_id,
                    sorting_sorter_id,
                    sorting_date,
                    sorting_bulk_split_id,
                    sortingSplits: [
                        {
                            sorting_split_id,
                            bulk_split_id,
                            sorting_id,
                            bulk_split_count,
                            bulk_split_estimate,
                            labels
                        }
                    ],
                    sortingGems: [],
                }
            } else {
                const existingSorting = sortingRef[split.sorting_id]
                sortingRef[split.sorting_id] = {
                    ...existingSorting,
                    sortingSplits: [
                        ...existingSorting.sortingSplits,
                        {
                            sorting_split_id,
                            bulk_split_id,
                            sorting_id,
                            bulk_split_count,
                            bulk_split_estimate,
                            labels
                        }
                    ],
                }
            }
        })
        sortingGems.forEach(gem => {
            const { 
            card_v2_id,
            collected_card_id,
            set_v2_id,
            sorting_gem_id,
            sorting_id,
            sorting_bulk_split_id,
            sorting_sorter_id,
            sorting_date
            } = gem
            if (!sortingRef[gem.sorting_id]) {
                sortingRef[gem.sorting_id] = {
                    sorting_id,
                    sorting_sorter_id,
                    sorting_date,
                    sorting_bulk_split_id,
                    sortingSplits: [],
                    sortingGems: [
                        {
                            sorting_id,
                            card_v2_id,
                            collected_card_id,
                            set_v2_id,
                            sorting_gem_id
                        }
                    ],
                }
            } else {
                const existingSorting = sortingRef[gem.sorting_id]
                sortingRef[gem.sorting_id] = {
                    ...existingSorting,
                    sortingGems: [
                        ...existingSorting.sortingGems,
                        {
                            sorting_id,
                            card_v2_id,
                            collected_card_id,
                            set_v2_id,
                            sorting_gem_id
                        }
                    ],
                }
            }
        })
        return Object.keys(sortingRef).map(sortingId => sortingRef[sortingId])
    }
    const compileTransactions = (sales, sortings, rips, trades) => {
        const compiledTransactions = [
            ...sales,
            ...sortings,
            // ...rips,
            // ...trades
        ]
        compiledTransactions.sort((a, b) => {
            //sort by transaction date, then by transaction id
            let aDate
            let bDate
            if (a.sale_id) aDate = a.sale_date
            if (a.sorting_id) aDate = a.sorting_date
            if (a.rip_id) aDate = a.rip_date
            if (a.trade_id) aDate = a.trade_date
            if (b.sale_id) bDate = b.sale_date
            if (b.sorting_id) bDate = b.sorting_date
            if (b.rip_id) bDate = b.rip_date
            if (b.trade_id) bDate = b.trade_date
            
            if (aDate < bDate) return -1
            else if (aDate > bDate) return 1
            else {
                const aTransactionId = a.sale_id || a.sorting_id || a.rip_id || a.trade_id
                const bTransactionId = b.sale_id || b.sorting_id || b.rip_id || b.trade_id
                if (aTransactionId < bTransactionId) return -1
                else if (aTransactionId > bTransactionId) return 1
                else return 0
            }
        })
        return compiledTransactions
    }
    const compiledSales = compileSales(saleCards, saleProducts, saleBulkSplits)
    const compiledSortings = compileSortings(sortingSplits, sortingGems)
    const transactions = compileTransactions(compiledSales, compiledSortings, req.rips, req.trades)
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
    const findCardPricesBetweenDates = async (cardInventory, start, end) => {
        const formattedInventory = formatInventory(cardInventory)
        const inventoryCardIds = formattedInventory.map(card => card.card_v2_id)

        try {
            const keyDateCardPrices = await MarketPrice.selectByCardIdsBetweenDates(
                inventoryCardIds, 
                stringifyDateYYYYMMDD(start), 
                stringifyDateYYYYMMDD(end)
            )
            return keyDateCardPrices
        } catch (err) {
            throw new Error(err)
        }
    }
    const calculateDailyBalance = async (startOfDay, cardInventory, productInventory) => {
        const endOfDay = new Date(startOfDay)
        endOfDay.setDate(startOfDay.getDate()+1)
        let dailyBalance = 0
        if (Object.keys(cardInventory).length > 0) {
            let keyDateCardPrices
            const formattedInventory = formatInventory(cardInventory)
            try {
                keyDateCardPrices = await findCardPricesBetweenDates(cardInventory, startOfDay, endOfDay)
            } catch (err) {
                throw err
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
    const sales = []
    const sortings = []
    let investmentCount = 0
    for (let i=0; i<transactions.length; i++) {
        if (transactions[i].sale_id) {
            const sale = transactions[i]
            sales.push(sale)
            /* check if user is purchaser in sale */
            if (sale.sale_purchaser_id === req.claims.user_id) {
                /* add sale amount to investmentCount */
                investmentCount += parseFloat(sale.sale_total)
                investmentHistory.push({
                    investment: investmentCount,
                    date: sale.transaction_date,
                })

                sale.saleCards.forEach(card => {
                    const itemId = card.card_v2_id
                    if (!cardInventory[itemId]) {
                        cardInventory[itemId] = [card]
                    } else {
                        cardInventory[itemId] = [
                            ...cardInventory[itemId],
                            card
                        ]
                    }
                })
                sale.saleProducts.forEach(product => {
                    const itemId = product.product_id
                    if (!productInventory[itemId]) {
                        productInventory[itemId] = [product]
                    } else {
                        productInventory[itemId] = [
                            ...productInventory[itemId],
                            product
                        ]
                    }
                })
                sale.saleBulkSplits.forEach(split => bulkSplitInventory.push(split))
            /* otherwise, user is seller in sale */
            } else if (sale.sale_seller_id === req.claims.user_id) {
                revenue += parseFloat(sale.sale_total)
            }
        } else if (transactions[i].sorting_id) {
            const sorting = transactions[i]
            sortings.push(sorting)
            const sortedBulkSplitId = sorting.sorting_bulk_split_id
            bulkSplitInventory = bulkSplitInventory.filter(split => split.bulk_split_id !== sortedBulkSplitId)
            sorting.sortingSplits.forEach(split => bulkSplitInventory.push(split))
            sorting.sortingGems.forEach(gem => {
                const itemId = gem.card_v2_id
                if (!cardInventory[itemId]) {
                    cardInventory[itemId] = [gem]
                } else {
                    cardInventory[itemId] = [
                        ...cardInventory[itemId],
                        gem
                    ]
                }
            })
        }

        /** check if current transaction is last of the day */
        const currentTransactionDate = new Date(transactions[i].transaction_date).setHours(0, 0, 0, 0)
        let nextTransactionDate = false
        const transaction_date = transactions[i].sale_date || transactions[i].gift_date || transactions[i].sorting_date 
        if (i < transactions.length - 1) {
            nextTransactionDate = new Date(transaction_date).setHours(0, 0, 0, 0)
        }
        if (currentTransactionDate !== nextTransactionDate || !nextTransactionDate) {
            /** find market prices for the day's adjusted inventory */
            /** check if transactions date falls on keyMarketDate */
            if (!nextTransactionDate) {
                // no more transactions after current, 
                while (keyMarketDates.length > 0) {
                    const startOfDay = keyMarketDates.pop()
                    try {  
                        // const dailyBalance = await calculateDailyBalance(startOfDay, cardInventory, productInventory)
                        const dailyBalance = 'uncoment out calcDailyBalance'
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
        revenue: revenue,
        sales,
        sortings,
        inventory: { 
            products: Object.keys(productInventory).map(productId => productInventory[productId]), 
            cards: Object.keys(cardInventory).map(cardId => cardInventory[cardId]),
            bulkSplits: bulkSplitInventory
        }
    }
    next()
}

const combineSplitsWithSales = async (req, res, next) => {
    const saleBulkSplitsRef = {}
    req.saleBulkSplits.forEach(saleSplit => {
        if (!saleBulkSplitsRef[saleSplit.sale_id]) {
            saleBulkSplitsRef[saleSplit.sale_id] = [saleSplit]
        } else {
            saleBulkSplitsRef[saleSplit.sale_id] = [
                ...saleBulkSplitsRef[saleSplit.sale_id],
                saleSplit
            ]
        }
    })
    req.sales = req.sales.map(sale => {
        if (saleBulkSplitsRef[sale.sale_id]) {
            return {
                ...sale,
                saleBulkSplits: saleBulkSplitsRef[sale.sale_id]
            }
        } else {
            return {
                ...sale,
                saleBulkSplits: []
            }
        }
    })
    next()
}

const getPortfolio = async (req, res, next) => {
    const userId = req.claims.user_id
    try {
        req.saleCards = await SaleCard.select(userId)
        req.saleProducts = await SaleProduct.select(userId)
        req.saleBulkSplits = await SaleBulkSplit.select(userId)
        req.sortingSplits = await SortingSplit.select(userId)
        req.sortingGems = await SortingGem.select(userId)
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = { evaluatePortfolio, combineSplitsWithSales, getPortfolio }
