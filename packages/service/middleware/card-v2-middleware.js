const { v4: uuidV4 } = require('uuid')
const { getSetByPtcgioIdMySQL } = require('../db/queries/setV2Queries')
const tcgPlayerFormatters = require('../utils/tcgPlayerFormatters')

const generateCardV2Ids = (req, res, next) => {
    const cardsWithIds = req.body.map(card => {
        return {
            ...card,
            card_v2_id: uuidV4()
        }
    })
    req.cards = cardsWithIds
    next()
}

const formatCardFromTcgPlayerDetails = (req, res, next) => {
    if (Object.keys(req.cards[0]).includes('tcgPlayerDetails')) {
        req.cards = tcgPlayerFormatters.formatTcgDetailsCards(req.cards)
    }
    next()
}

module.exports = {
    generateCardV2Ids,
    formatCardFromTcgPlayerDetails
}
