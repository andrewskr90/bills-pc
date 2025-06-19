const Appraisal = require('../models/Appraisal')
const CollectedItem = require('../models/CollectedItem')

const createAppraisal = async (req, res, next) => {
    try {
        const { collectedItemId, conditionId, time } = req.body 
        if (!collectedItemId) return next({ status: 400, message: 'id of collected item to appraise requried.'})
        if (!time) return next({ status: 400, message: 'Time of appraisal requried.'})
        const collectedItem = await CollectedItem.getById(collectedItemId, req.claims.user_id, time)
        if (!collectedItem) return next({ status: 400, message: 'CollectedItem did not exist at specified time.' })
        if (collectedItem.appraisal.condition.id === conditionId) {
            return next({ status: 400, message: 'Appraisal condition must differ from current condition.' })
        }
        if (new Date(collectedItem.appraisal.time) > new Date(time)) {
            return next({ status: 400, message: 'New appraisal must occur after most recent appraisal' })
        }
        const postedAppraisalId = await Appraisal.create(req.body, req.claims.user_id)
        req.results = { createdId: postedAppraisalId }
        next()
    } catch (err) {
        return next(err)
    }
}

module.exports = { createAppraisal }