function verifySet(req, res, next) {
    if (!req.body.set_name) {
        next({
            status: 400,
            message: 'Must include set name'
        })
    }
    next()
}

module.exports = {
    verifySet
}
