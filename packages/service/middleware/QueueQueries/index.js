const users = require('./users')
const sets = require('./sets')
const collectedCards = require('./collectedCards')
const cards = require('./cards')
const sales = require('./sales')
const saleNotes = require('./saleNotes')
const collectedCardNotes = require('./collectedCardNotes')
const saleCards = require('./saleCards')
const setsV2 = require('./setsV2')
const marketPrices = require('./marketPrices')
const cardsV2 = require('./cardsV2')
const products = require('./products')


const init = (req, res, next) => {
    req.queryQueue = []
    next()
}

module.exports = {
    init,
    users,
    sets,
    collectedCards,
    cards,
    sales,
    saleNotes,
    collectedCardNotes,
    saleCards, 
    setsV2,
    marketPrices,
    cardsV2,
    products
}
