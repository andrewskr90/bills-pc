const { v4: uuidV4 } = require('uuid')
const ProxyUser = require('../models/ProxyUser')

const createProxyUser = async (req, res, next) => {
    req.body.id = uuidV4()
    req.body.creatorId = req.claims.user_id
    req.body.name = req.body.name.toLowerCase()
    req.results = await ProxyUser.create(req.body)
    next()
}

const selectProxyUsers = async (req, res, next) => {
    req.results = await ProxyUser.findByUserId(req.claims.user_id)

    next()
}

module.exports = {
    createProxyUser,
    selectProxyUsers
}