const { v4: uuidV4 } = require('uuid')
const User = require('../models/User')

const createUser = async (req, res, next) => {
    if (req.query.proxy) {
        req.body.user_id = uuidV4()
        req.body.proxyCreatorId = req.claims.user_id
        req.body.user_name = req.body.user_name.toLowerCase()
        req.results = await User.createProxyUser(req.body)
    } else {
        return next('Route does not exist')
    }
    next()
}

const selectUsers = async (req, res, next) => {
    if (req.query.proxy) {
        req.results = await User.findProxyByCreatorId(req.claims.user_id)
    } else {
        return next('Route does not exist')
    }    
    next()
}

module.exports = {
    createUser,
    selectUsers
}