const router = require('express').Router()
const { registerVerification, checkEmailFormat } = require('../middlewares/register-middleware')
const { hashPassword } = require('../middlewares/restricted-middleware')

const User = require('../models/user-model')

router.post('/register', 
    registerVerification, 
    checkEmailFormat, 
    hashPassword, 
    async (req, res, next) => {
        const newUser = req.body
        try {
            await User.add(newUser)
            res.status(201).json(newUser)
        } catch (err) {
            next(err)
        }
})

router.post('/login', (req, res, next) => {

})

router.use((err, req, res, next) => { //eslint-disable-line
    res.status( err.status || 500 )
        .json(err)
})

module.exports = router