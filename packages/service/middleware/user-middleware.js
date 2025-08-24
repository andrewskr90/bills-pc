const { v4: uuidV4 } = require('uuid')
const User = require('../models/User')

const createUser = async (req, res, next) => {
    if (req.query.proxy) {
        req.body.user_id = uuidV4()
        req.body.proxyCreatorId = req.claims.user_id
        req.body.user_name = req.body.user_name.toLowerCase()
        try {
            req.results = await User.createProxyUser(req.body)
        } catch (err) {
            if (err.message.includes('Duplicate entry')) {
                return next({ status: 400, message: 'You already created a vendor with this name.' })
            }
            return next(err)
        }
    } else {
        return next('Route does not exist')
    }
    next()
}

const selectUsers = async (req, res, next) => {
    if (req.query.proxy) {
        const { user_id } = req.claims
        const { proxyUserId, user_name, page, direction } = req.query
        const users = await User.findProxyByCreatorId(user_id, proxyUserId, user_name, page, direction)
        req.results = {
            count: users.length === 0 ? 0 : users[0].count,
            users: users.map(user => {
                delete user.count
                return user
            })
        }
    } else {
        return next('Route does not exist')
    }    
    next()
}

module.exports = {
    createUser,
    selectUsers
}