const users = require('./users')
const sets = require('./sets')
const collectedCards = require('./collectedCards')
const collectedProducts = require('./collectedProducts')
const cards = require('./cards')
const sales = require('./sales')
const saleNotes = require('./saleNotes')
const collectedCardNotes = require('./collectedCardNotes')
const collectedProductNotes = require('./collectedProductNotes')
const saleCards = require('./saleCards')
const saleProducts = require('./saleProducts')
const setsV2 = require('./setsV2')
const marketPrices = require('./marketPrices')
const cardsV2 = require('./cardsV2')
const products = require('./products')
const referenceData = require('./referenceData')
const portfolio = require('./portfolio')
const gifts = require('./gifts')
const giftNotes = require('./giftNotes')
const giftCards = require('./giftCards')
const giftProducts = require('./giftProducts')
const bulkSplits = require('./bulkSplits')
const saleBulkSplits = require('./saleBulkSplits')

const init = (req, res, next) => {
    req.queryQueue = []
    next()
}

module.exports = {
    init,
    users,
    sets,
    collectedCards,
    collectedProducts,
    cards,
    sales,
    saleNotes,
    collectedCardNotes,
    collectedProductNotes,
    saleCards, 
    saleProducts,
    setsV2,
    marketPrices,
    cardsV2,
    products,
    referenceData, 
    portfolio, 
    gifts,
    giftNotes,
    giftCards,
    giftProducts, 
    bulkSplits,
    saleBulkSplits
}
