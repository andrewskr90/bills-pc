const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { patchGift, selectGifts, deleteGiftById } = require('../../middleware/gift-middleware')

const giftRouter = require('express').Router()

giftRouter.patch('/', 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    patchGift,
    (req, res, next) => {
        res.status(200).json(req.results)
})

giftRouter.get('/', 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    selectGifts,
    (req, res) => {
        res.status(200).json(req.results)
})

giftRouter.delete('/:id', 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    deleteGiftById,
    (req, res) => {
        res.status(200).json(req.results)
})

module.exports = giftRouter
