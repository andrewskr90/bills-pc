const { parseGroupConcat } = require("../utils")

const checkReqBody = (req, res, next) => {
    if (!Array.isArray(req.body)) { 
        return next({
            status: 400,
            message: 'Request body must be in form of array.'
        })
    }
    if (!req.body) {
        return next({
            status: 400,
            message: 'Missing request body.'
        })
    }
    if (req.body.length === 0) {
        return next({
            status: 400,
            message: 'Request body is empty.'
        })
    }
    next()
}

const formatPrintingsFromSkus = (skus) => {
    const visitedPrintings = {}
    return skus.filter(sku => {
        if (!visitedPrintings[sku[0]]) {
            visitedPrintings[sku[0]] = 1
            return true
        }
        return false
    }).map(sku => {
        return {
            id: sku[0],
            name: sku[1]
        }
    })
}

const formatItems = (req, res, next) => {
    let count = 0
    if (req.results.length > 0) {
        count = req.results[0].count
    }
    req.results = {
        items: req.results.map(item => {
            return {
                id: item.id,
                name: item.name,
                // number: item.card_v2_number,
                // rarity: item.card_v2_rarity,
                // foil_only: item.card_v2_foil_only,
                // product_id: item.product_id,
                // release_date: item.product_release_date,
                // description: item.product_description,
                prices: item.prices,
                tcgpId: item.tcgpId,
                printings: req.printingsAlreadyFormatted 
                    ? item.printings 
                    : formatPrintingsFromSkus(parseGroupConcat(item.printings)),
                sealed: item.sealed,
                set: {
                    id: item.set_v2_id,
                    name: item.set_v2_name,
                    series: item.set_v2_series,
                    release_date: item.set_v2_release_date,
                    ptcgio_id: item.set_v2_ptcgio_id
                }
            }
        }),
        count
    }
    next()
}

module.exports = {
    checkReqBody,
    formatItems
}
