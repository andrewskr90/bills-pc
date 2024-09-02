const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')
const { selectLotInserts } = require('../../middleware/lot-insert-middleware')

const lotInsertRouter = require('express').Router()

lotInsertRouter.get('/', 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    selectLotInserts,
    (req, res) => {
        res.status(200).json(req.results)
})

module.exports = lotInsertRouter