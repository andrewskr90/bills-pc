const checkReqBody = (req, res, next) => {
    if (typeof req.body !== 'Array') {
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
}

module.exports = {
    checkReqBody
}