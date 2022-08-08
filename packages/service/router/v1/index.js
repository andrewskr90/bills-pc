const v1Router = require('express').Router()

const authRouter = require('./auth-router')
const cardRouter = require('./card-router')
const setRouter = require('./set-router')
const collectedCardRouter = require('./collected-card-router')
const transactionRouter = require('./transaction-router')
const productRouter = require('./product-router')

v1Router.use('/auth', authRouter)
v1Router.use('/sets', setRouter)
v1Router.use('/cards', cardRouter)
v1Router.use('/collected-cards', collectedCardRouter)
v1Router.use('/transactions', transactionRouter)
v1Router.use('/products', productRouter)

module.exports = v1Router
