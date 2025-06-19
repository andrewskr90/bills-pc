const { v4: uuidV4 } = require('uuid')
const tcgPlayerFormatters = require('../utils/tcgPlayerFormatters')

const generateSetV2Ids = (req, res, next) => {
    const setsWithIds = req.body.map(set => {
        return {
            ...set,
            set_v2_id: uuidV4()
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

const formatExpansions = (req, res, next) => {
    let count = 0
    if (req.results.length > 0) {
        count = req.results[0].count
    }
    req.results = {
        expansions: req.results.map(expansion => {
            delete expansion.count
            return expansion
        }),
        count
    }
    next()
}

module.exports = {
    generateSetV2Ids,
    formatSetFromTcgPlayerDetails,
    formatExpansions
}