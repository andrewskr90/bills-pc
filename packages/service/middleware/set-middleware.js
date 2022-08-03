const { v4: uuidV4 } = require('uuid')
const tcgPlayerFormatters = require('../utils/tcgPlayerFormatters')

const generateSetIds = (req, res, next) => {
    const setsWithIds = req.body.map(set => {
        return {
            ...set,
            set_id: uuidV4()
        }
    })
    req.sets = setsWithIds
    next()
}

const formatSetFromTcgPlayerDetails = (req, res, next) => {
    if (Object.keys(req.sets[0]).includes('tcgPlayerDetails')) {
        req.sets = tcgPlayerFormatters.formatTcgDetailsSets(req.sets)
    }
    next()
}

module.exports = {
    generateSetIds,
    formatSetFromTcgPlayerDetails
}