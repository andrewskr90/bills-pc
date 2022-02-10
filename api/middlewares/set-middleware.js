function verifySet(req, res, next) {
    const { 
        set_name, 
        set_release_date, 
        set_logo, 
        set_number, 
        set_card_amount_denominator 
    } = req.body
    if (!set_name) {
        next({
            status: 400,
            message: 'Must include data type string, set_name'
        })
    } else if (!set_release_date) {
        next({
            status: 400,
            message: 'Must include set data type date, set_release_date'
        })
    } else if (!set_logo) {
        next({
            status: 400,
            message: 'Must include data type int, set_logo'
        })
    } else if (!set_number) {
        next({
            status: 400,
            message: 'Must include data type int, set_number'
        })
    } else if (!set_card_amount_denominator) {
        next({
            status: 400,
            message: 'Must include data type int, set_card_amount_denominator'
        })
    }
    next()
}

module.exports = {
    verifySet
}
