const Portfolio = require('../models/Portfolio')

const getPortfolioItems = async (req, res, next) => {
    const userId = req.claims.user_id
    try {
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate()-1)
        const portfolio = await Portfolio.getItemsByUserId(userId, req.query)
        
        let count = 0
        let countedCollectedItems = false
        req.results = {}
        req.results.items = portfolio.map(item => {
            if (!countedCollectedItems) {
                if (item.count !== null) {
                    count += parseInt(item.count)
                    countedCollectedItems = true
                }
            }
            delete item.count
            return item
        })
        req.results.count = count
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = { getPortfolioItems }
