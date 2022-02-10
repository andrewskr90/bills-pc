function verifyCard(req, res, next) {
    const { 
        card_name, 
        card_number, 
        card_rarity, 
        card_image_url, 
        card_card_amount_denominator 
    } = req.body
    if (!card_name) {
        next({
            status: 400,
            message: 'Must include data type string, card_name'
        })
    } else if (!card_number) {
        next({
            status: 400,
            message: 'Must include set data type date, card_number'
        })
    } else if (!card_rarity) {
        next({
            status: 400,
            message: 'Must include data type int, card_rarity'
        })
    } else if (!card_image_url) {
        next({
            status: 400,
            message: 'Must include data type string, card_image_url'
        })
    } else if (!card_card_amount_denominator) {
        next({
            status: 400,
            message: 'Must include data type int, card_card_amount_denominator'
        })
    }
    next()
}

module.exports = {
    verifyCard
}