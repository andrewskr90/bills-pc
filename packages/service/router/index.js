const router = require('express').Router()
const v1Router = require('./v1')

router.use('/v1', v1Router)
router.get('/healthcheck', (req, res, next) => {
    res.status(200).json({ status: 'ok' })
})

module.exports = router
