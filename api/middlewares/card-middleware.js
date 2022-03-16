const checkCardDatatypes = (req, res, next) => {
    if (Array.isArray(req.body)) {
        const cardArray = req.body
        cardArray.map(card => {
            if (!card.card_name) {
                next({
                    status: 400,
                    message: 'Missing card_name value.'
                })
            }
            if (typeof card.card_name !== 'string') {
                next({
                    status: 400,
                    message: 'Incorrect data type for card_name.'
                })
            }
            if (!card.card_set_id) {
                next({
                    status: 400,
                    message: `${card.card_name}, #${card.card_number} has missing set_id.`
                })
            }
        })
    }
    next()
}

module.exports = {
    checkCardDatatypes
}