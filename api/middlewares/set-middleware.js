function verifySet(req, res, next) {
    const { set_name } = req.body
    if (!set_name) {
        next({
            status: 400,
            message: 'Must include data type string, set_name'
        })
    }
    next()
}

module.exports = {
    verifySet
}
