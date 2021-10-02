const router = require('express').Router()

router.post('register', (req, res, next) => {
    
})

router.post('login', (req, res, next) => {

})

router.use((err, req, res, next) => { //eslint-disable-line
    res.status( err.status || 500 )
        .json(err)
})

module.exports = router