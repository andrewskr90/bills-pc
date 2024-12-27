const v1Router = require('express').Router()

const authRouter = require('./auth-router')
const cardV2Router = require('./card-v2-router')
const setV2Router = require('./set-v2-router')
const transactionRouter = require('./transaction-router')
const marketPricesRouter = require('./market-prices-router')
const referenceDataRouter = require('./reference-data-router')
const saleRouter = require('./sale-router')
const portfolioRouter = require('./portfolio-router')
const typeRouter = require('./type-router')
const rarityRouter = require('./rarity-router')
const printingRouter = require('./printing-router')
const bulkSplitRouter = require('./bulk-split-router')
const sortingRouter = require('./sorting-router')
const userRouter = require('./user-router')
const listingRouter = require('./listing-router')
const itemRouter = require('./item-router')
const languageRouter = require('./language-router')
const conditionRouter = require('./condition-router')
const skuRouter = require('./sku-router')
const tcgpMarketPriceRouter = require('./tcgp-market-price-router')
const listingPriceRouter = require('./listing-price-router')
const lotEditRouter = require('./lot-edit-router')
const giftRouter = require('./gift-router')
const importRouter = require('./import-router')
const lotInsertRouter = require('./lot-insert-router')
const expansionSeriesRouter = require('./expansion-series-router')

v1Router.use('/auth', authRouter)
v1Router.use('/sets-v2', setV2Router)
v1Router.use('/cards-v2', cardV2Router)
v1Router.use('/transactions', transactionRouter)
v1Router.use('/market-prices', marketPricesRouter)
v1Router.use('/reference-data', referenceDataRouter)
v1Router.use('/sales', saleRouter)
v1Router.use('/portfolio', portfolioRouter)
v1Router.use('/types', typeRouter)
v1Router.use('/rarities', rarityRouter)
v1Router.use('/printings', printingRouter)
v1Router.use('/bulk-splits', bulkSplitRouter)
v1Router.use('/sortings', sortingRouter)
v1Router.use('/users', userRouter)
v1Router.use('/listings', listingRouter)
v1Router.use('/items', itemRouter)
v1Router.use('/languages', languageRouter)
v1Router.use('/conditions', conditionRouter)
v1Router.use('/skus', skuRouter)
v1Router.use('/tcgp-market-prices', tcgpMarketPriceRouter)
v1Router.use('/listing-prices', listingPriceRouter)
v1Router.use('/lot-edits', lotEditRouter)
v1Router.use('/gifts', giftRouter)
v1Router.use('/imports', importRouter)
v1Router.use('/lot-inserts', lotInsertRouter)
v1Router.use('/expansion-series', expansionSeriesRouter)




module.exports = v1Router
