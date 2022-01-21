const { JWT_SECRET } = require('../secrets')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        next({
            status: 401,
            message: 'token required'
        })
    } else {
        jwt.verify(
            token,
            JWT_SECRET,
            (err, decoded) => {
                if (err) {
                    next({
                        status: 401,
                        message: 'token invalid'
                    })
                } else {
                    req.decodeJwt = decoded
                    next()
                }
            }
        )
    }
}
