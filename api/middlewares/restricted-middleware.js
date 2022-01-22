const { JWT_SECRET } = require('../secrets')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/user-model')


const hashPassword = (req, res, next) => {
    const password = req.body.password
    const hash = bcrypt.hashSync(password, 8)
    req.body.password = hash
    next()
}

const comparePasswordHash = (req, res, next) => {
    
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
    comparePasswordHash,
    verifyToken
}
