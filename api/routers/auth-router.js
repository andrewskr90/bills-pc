const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user-model')
const { sanitizeUsername, registerVerification, checkEmailFormat } = require('../middlewares/register-middleware')
const { hashPassword } = require('../middlewares/restricted-middleware')
const { tokenBuilder } = require('../jwt')

router.post('/register', 
    sanitizeUsername,
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

router.post('/login', sanitizeUsername, async (req, res, next) => {
    const { username, password } = req.body
    try {
        const [existingUser] = await User.findBy({ username })
        if (existingUser && bcrypt.compareSync(password, existingUser.password)) {
            const token = tokenBuilder(existingUser)
            res.status(200).json({
                user_id: existingUser.user_id,
                username: existingUser.username,
                favoriteGen: existingUser.favoriteGen,
                role: existingUser.role,
                message: `Welcome, ${existingUser.username}!`,
                token
            })
        } else {
            next({
                status: 401,
                message: `Invalid password for username, ${existingUser.username}`
            })
        }
    } catch (err) {
        err.message = 'Username does not exist.'
        err.status = 404
        next(err)
    }
})

module.exports = router