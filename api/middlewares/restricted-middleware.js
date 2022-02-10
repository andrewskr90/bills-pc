const { JWT_SECRET } = require('../secrets')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const hashPassword = (req, res, next) => {
    const password = req.body.user_password
    const hash = bcrypt.hashSync(password, 8)
    req.body.user_password = hash
    next()
}

const verifyToken = (req, res, next) => {
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

module.exports = {
    hashPassword,
    verifyToken
}
