function verifyCard(req, res, next) {
    const { card_name, card_set_id } = req.body
    if (!card_name) {
        next({
            status: 400,
            message: 'Must include data type string, card_name'
        })
    } else if (!card_set_id) {
        next({
            status: 400,
            message: 'Must include foreign key, card_set_id'
        })
    }
    next()
}

module.exports = {
    verifyCard
}