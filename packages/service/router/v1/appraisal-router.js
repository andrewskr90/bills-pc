const { createAppraisal } = require('../../middleware/appraisal-middleware')
const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')

const appraisalRouter = require('express').Router()

appraisalRouter.post('/', 
    verifyCookie,
    decodeSessionToken,
    createAppraisal,
    (req, res, next) => {
        res.status(201).json(req.results)
})

module.exports = appraisalRouter