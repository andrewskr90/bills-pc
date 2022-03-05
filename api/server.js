const express = require('express')
const cors = require('cors')

const authRouter = require('../api/routers/auth-router')
const userRouter = require('../api/routers/user-router')
const vendorLocationRouter = require('../api/routers/vendor-location-router')
const saleRouter = require('../api/routers/sale-router')
const tradeRouter = require('../api/routers/trade-router')
const ripSessionRouter = require('../api/routers/rip-session-router')
const setRouter = require('../api/routers/set-router')
const productRouter = require('../api/routers/product-router')
const collectedProductRouter = require('../api/routers/collected-product-router')
const ripRouter = require('../api/routers/rip-router')
const cardRouter = require('../api/routers/card-router')
const productConnectionRouter = require('../api/routers/product-connection-router')
const collectedCardRouter = require('../api/routers/collected-card-router')
const collectedCardEventRouter = require('../api/routers/collected-card-event-router')
const collectedProductEventRouter = require('../api/routers/collected-product-event-router')
const saleCardRouter = require('../api/routers/sale-card-router')
const saleProductRouter = require('../api/routers/sale-product-router')
const tradeCardRouter = require('../api/routers/trade-card-router')
const tradeProductRouter = require('../api/routers/trade-product-router')

const server = express()


server.use(express.json())
server.use(cors())

server.use('/api/auth', authRouter)
server.use('/api/users', userRouter)
server.use('/api/vendor-locations', vendorLocationRouter)
server.use('/api/sales', saleRouter)
server.use('/api/trades', tradeRouter)
server.use('/api/rip-sessions', ripSessionRouter)
server.use('/api/sets', setRouter)
server.use('/api/products', productRouter)
server.use('/api/collected-products', collectedProductRouter)
server.use('/api/rips', ripRouter)
server.use('/api/cards', cardRouter)
server.use('/api/product-connections', productConnectionRouter)
server.use('/api/collected-cards', collectedCardRouter)
server.use('/api/collected-card-events', collectedCardEventRouter)
server.use('/api/collected-product-events', collectedProductEventRouter)
server.use('/api/sale-cards', saleCardRouter)
server.use('/api/sale-products', saleProductRouter)
server.use('/api/trade-cards', tradeCardRouter)
server.use('/api/trade-products', tradeProductRouter)

server.get('/api', (req, res) => {
    res.json({ message: 'Bills PC api!' })
})

server.use((err, req, res, next) => { //eslint-disable-line
    res.status( err.status || 500 ).json({
        error_status: err.status,
        message: err.message,
    })
  })

module.exports = server