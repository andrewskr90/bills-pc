const users = require('./users')
const sets = require('./sets')
const collectedCards = require('./collectedCards')
const cards = require('./cards')
const sales = require('./sales')
const saleNotes = require('./saleNotes')
const collectedCardNotes = require('./collectedCardNotes')
const saleCards = require('./saleCards')


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
    saleCards
}
