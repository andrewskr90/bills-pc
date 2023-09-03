const printingRouter = require('express').Router()
const Printing = require('../../models/Printing')

const { verifyCookie, decodeSessionToken, gymLeaderOnly } = require('../../middleware/auth-middleware')

printingRouter.get('/', 
    async (req, res, next) => {
        try {
            const results = await Printing.find()
            res.status(200).json(results)
        } catch (err) {
            next(err)
        }
    }
)

printingRouter.post('/', 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    async (req, res, next) => {
        try {
            const results = await Printing.create(req.body)
            res.status(201).json(results)
        } catch (err) {
            next(err)
        }
    }
)

printingRouter.put(`/:printingId`, 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    async (req, res, next) => {
        try {
            const results = await Printing.update(req.body, req.params.printingId)
            res.status(200).json(results)
        } catch (err) {
            next(err)
        }
    }
)

printingRouter.delete(`/:printingId`, 
    verifyCookie,
    decodeSessionToken,
    gymLeaderOnly,
    async (req, res, next) => {
        try {
            const results = await Printing.destroy(req.params.printingId)
            res.status(200).json(results)
        } catch (err) {
            next(err)
        }
    }
)

module.exports = printingRouter
