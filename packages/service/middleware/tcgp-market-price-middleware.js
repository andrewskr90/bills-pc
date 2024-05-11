const { v4: uuidV4 } = require('uuid')
const TCGPMarketPrice = require('../models/TCGPMarketPrice')


const createPrices = async (req, res, next) => {
    const formattedMarketPrices = req.body.map(price => ({ id: uuidV4(), ...price }))
    req.ids = await TCGPMarketPrice.create(formattedMarketPrices)
    next()
}

module.exports = { createPrices }
