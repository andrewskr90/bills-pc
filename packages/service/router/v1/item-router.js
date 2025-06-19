const { executeQueries } = require('../../db')
const { formatItems } = require('../../middleware')
const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { createItems, getItems, patchItem } = require('../../middleware/item-middleware')
const QueueQueries = require('../../middleware/QueueQueries')

const itemRouter = require('express').Router()

itemRouter.post('/',
    verifyCookie, 
    decodeSessionToken,
    gymLeaderOnly,
    createItems,
    (req, res, next) => {
        res.status(201).json(req.ids)
})

itemRouter.get('/', 
    QueueQueries.init,
    getItems,
    executeQueries,
    formatItems,
    (req, res, next) => {
        res.status(200).json(req.results)
})

itemRouter.patch('/', 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    patchItem,
    (req, res, next) => {
        res.status(200).json(req.results)
})

module.exports = itemRouter
