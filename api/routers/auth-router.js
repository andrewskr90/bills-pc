const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user-model')
const { 
    userObjectVerification, 
    sanitizeUsername 
    } = require('../middlewares/user-middleware')
const { sanitizeObjectStrings } = require('../middlewares/universal-middleware')
const { hashPassword } = require('../middlewares/restricted-middleware')
const { tokenBuilder } = require('../jwt')

router.post('/register', 
    sanitizeUsername,
    userObjectVerification,
    sanitizeObjectStrings,
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
    const { user_name, user_password } = req.body
    try {
        const [existingUser] = await User.findBy({ user_name })
        if (existingUser && bcrypt.compareSync(user_password, existingUser.user_password)) {
            const token = tokenBuilder(existingUser)
            res.status(200).json({
                user_id: existingUser.user_id,
                user_name: existingUser.user_name,
                user_favorite_gen: existingUser.user_favorite_gen,
                user_role: existingUser.user_role,
                message: `Welcome, ${existingUser.user_name}!`,
                token
            })
        } else {
            next({
                status: 401,
                message: `Invalid user_password for user_name, ${existingUser.user_name}`
            })
        }
    } catch (err) {
        err.message = 'user_name does not exist.'
        err.status = 404
        next(err)
    }
})

module.exports = router
