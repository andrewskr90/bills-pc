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

const formatItems = (req, res, next) => {
    req.results = req.results.map(item => {
        return {
            card_id: item.card_v2_id,
            name: item.card_v2_name || item.product_name,
            number: item.card_v2_number,
            rarity: item.card_v2_rarity,
            foil_only: item.card_v2_foil_only,
            product_id: item.product_id,
            release_date: item.product_release_date,
            description: item.product_description,
            market_prices: item.market_price_prices,
            tcgplayer_product_id: item.tcgplayer_product_id,
            set: {
                id: item.set_v2_id,
                name: item.set_v2_name,
                series: item.set_v2_series,
                release_date: item.set_v2_release_date,
                ptcgio_id: item.set_v2_ptcgio_id
            }
        }
    })
    next()
}

module.exports = {
    checkReqBody,
    formatItems
}
