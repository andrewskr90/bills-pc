const portfolioRouter = require('express').Router()
const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const { getPortfolioItems, formatPortfolioItems } = require('../../middleware/portfolio-middleware')

portfolioRouter.get('/', 
    verifyCookie,
    decodeSessionToken,
    getPortfolioItems,
    async (req, res, next) => {
        res.status(200).json(req.results)
})

module.exports = portfolioRouter
