const router = require('express').Router()
const { registerVerification, checkEmailFormat } = require('../middlewares/register-middleware')

const User = require('../models/user-model')

router.post('/register', registerVerification, checkEmailFormat, (req, res, next) => {
    
})

router.post('/login', (req, res, next) => {

})

router.use((err, req, res, next) => { //eslint-disable-line
    res.status( err.status || 500 )
        .json(err)
})

module.exports = router