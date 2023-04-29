const portfolioRouter = require('express').Router()
const { checkUserSession } = require('../../middleware/auth-middleware')
const { evaluatePortfolio } = require('../../middleware/portfolio-middleware')
const Sale = require('../../models/Sale')
const CollectedCard = require('../../models/CollectedCard')

portfolioRouter.get('/', 
    checkUserSession,
    // Import.findByUserId,
    Sale.findByUserId,
    // Trade.findByUserId,
    // Rip.findByUserId,
    // Export.findByUserId,
    evaluatePortfolio,
    async (req, res, next) => {
        res.status(200).json(req.results)
})

module.exports = portfolioRouter
