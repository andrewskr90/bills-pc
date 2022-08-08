const { v4: uuidV4 } = require('uuid')
const tcgPlayerFormatters = require('../utils/tcgPlayerFormatters')

const generateProductIds = (req, res, next) => {
    const productsWithIds = req.body.map(product => {
        return {
            ...product,
            product_id: uuidV4()
        }
    })
    req.products = productsWithIds
    next()
}

const formatProductsFromTcgPlayerDetails = (req, res, next) => {
    if (Object.keys(req.products[0]).includes('tcgPlayerDetails')) {
        req.products = tcgPlayerFormatters.formatTcgDetailsProducts(req.products)
    }
    next()
}

module.exports = {
    generateProductIds,
    formatProductsFromTcgPlayerDetails
}

