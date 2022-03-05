const express = require('express')
const cors = require('cors')

const authRouter = require('../api/routers/auth-router')
const userRouter = require('../api/routers/user-router')
const vendorLocationRouter = require('../api/routers/vendor-location-router')
const setRouter = require('../api/routers/set-router')
const cardRouter = require('../api/routers/card-router')
const productRouter = require('../api/routers/product-router')

const server = express()


server.use(express.json())
server.use(cors())

server.use('/api/auth', authRouter)
server.use('/api/users', userRouter)
server.use('/api/vendor-locations', vendorLocationRouter)
server.use('/api/sets', setRouter)
server.use('/api/cards', cardRouter)
server.use('/api/products', productRouter)

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