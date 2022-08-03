const { v4: uuidV4 } = require('uuid')
const { getSetByPtcgioIdMySQL } = require('../db/queries/setQueries')

const findCardSetId = async (req, res, next) => {
    req.setPtcgioId = req.body[0].card_ptcgio_id 
    await getSetByPtcgioIdMySQL(req, res, (err) => {
        if (err) return next(err)
        req.set_id = req.set.set_id
        next()
    })
}

const alterCardSetIds = (req, res, next) => {
    const cardsWithBPCSetId = req.body.map(card => {
        const cardWithBPCSetId = {
            ...card,
            card_set_id: req.set_id
        }
        return cardWithBPCSetId
    })
    req.body = cardsWithBPCSetId
    next()
}

const generateCardIds = (req, res, next) => {
    const cardsWithIds = req.body.map(card => {
        return {
            ...card,
            card_id: uuidV4()
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
    findCardSetId,
    alterCardSetIds,
    generateCardIds,
    formatCardFromTcgPlayerDetails
}
