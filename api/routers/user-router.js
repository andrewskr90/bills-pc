const router = require('express').Router()
const User = require('../models/user-model')
const { sanitizeUsername, updateVerification, checkEmailFormat } = require('../middlewares/user-middleware')

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', updateVerification, sanitizeUsername, checkEmailFormat, async (req, res, next) => {
    const user_id = req.params.id
    const changes = req.body
    try {
        const updatedUser = await User.update(user_id, changes)
        res.status(200).json(
            updatedUser
        )
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    const user_id = req.params.id
    try {
        const deletedUser = await User.remove(user_id)
        res.status(200).json(deletedUser)
    } catch (err) {
        next(err)
    }
})
 module.exports = router