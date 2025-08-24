const Portfolio = require('../models/Portfolio')
const User = require('../models/User')

const getPortfolioItems = async (req, res, next) => {
    let userId = req.claims.user_id
    if (req.query.proxyUserId) {
        const proxyUser = await User.findProxyByCreatorId(req.claims.user_id, req.query.proxyUserId)
        if (proxyUser.length === 1) {
            userId = proxyUser[0].user_id
        }
    }
    let time = req.query.time
    if (!time) {
        const today = new Date()
        time = today.toISOString()
    }
    try {
        const portfolio = await Portfolio.getPortfolio(userId, time, req.query)
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


const formatPortfolioItems = (req, res, next) => {
    req.results.items = req.results.items.reduce((acc, cur) => {
        const {
            collectedItemId,
            itemId,
            setName,
            name,
            tcgpId,
            lotId,
            purchaseId,
            purchaseTime,
            purchasePrice,
            acceptedOfferPrice,
            quantity
        } = cur
        const foundItem = acc.find(item => item.itemId === cur.itemId)
        if (foundItem) {
            return acc.map(item => {
                if (item.itemId === foundItem.itemId) {
                    return {
                        ...item,
                        collectedItems: [
                            ...item.collectedItems,
                            {
                                collectedItemId,
                                lotId,
                                purchaseId,
                                purchaseTime,
                                purchasePrice,
                                acceptedOfferPrice,
                            }
                        ]
                    }
                }
                return item
            })
        }
        const newItem = {
            itemId,
            name,
            setName,
            setName,
            tcgpId
        }
        if (req.query.itemId) {
            newItem.collectedItems = [{
                collectedItemId,
                lotId,
                purchaseId,
                purchaseTime,
                purchasePrice,
                acceptedOfferPrice
            }]
        }
        else newItem.quantity = quantity
        return [...acc, newItem]
    },[])
    next()
}

module.exports = { getPortfolioItems, formatPortfolioItems }
