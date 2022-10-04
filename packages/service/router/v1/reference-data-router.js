const referenceDataRouter = require('express').Router()
const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')
const { formatReferenceData } = require('../../middleware/reference-data-middleware')

referenceDataRouter.get('/', 
    QueueQueries.init,
    // QueueQueries.setsV2.select,
    QueueQueries.referenceData.select,
    executeQueries,
    formatReferenceData,
    (req, res, next) => {
        res.status(200).json(req.results)
})

module.exports = referenceDataRouter
