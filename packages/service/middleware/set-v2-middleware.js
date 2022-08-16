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
    console.log(req.sets)
    next()
}

const formatSetFromTcgPlayerDetails = (req, res, next) => {
    if (Object.keys(req.sets[0]).includes('tcgPlayerDetails')) {
        req.sets = tcgPlayerFormatters.formatTcgDetailsSets(req.sets)
    }
    next()
}

module.exports = {
    generateSetV2Ids,
    formatSetFromTcgPlayerDetails
}