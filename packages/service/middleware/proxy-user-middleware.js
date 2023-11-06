const { v4: uuidV4 } = require('uuid')
const ProxyUser = require('../models/ProxyUser')

const createProxyUser = async (req, res, next) => {
    req.body.user_id = uuidV4()
    req.body.proxyCreatorId = req.claims.user_id
    req.body.user_name = req.body.user_name.toLowerCase()
    req.results = await ProxyUser.create(req.body)
    next()
}

const selectProxyUsers = async (req, res, next) => {
    req.results = await ProxyUser.findProxyByCreatorId(req.claims.user_id)
    next()
}

module.exports = {
    createProxyUser,
    selectProxyUsers
}