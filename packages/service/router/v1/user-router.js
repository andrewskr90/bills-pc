const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const { createUser, selectUsers } = require('../../middleware/user-middleware')

const userRouter = require('express').Router()

userRouter.get('/',
    verifyCookie,
    decodeSessionToken,
    selectUsers,
    (req, res, next) => {
        res.status(200).json(req.results)
    }
)

userRouter.post('/', 
    verifyCookie,
    decodeSessionToken,
    createUser,
    (req, res, next) => {
        try {
            res.status(201).json(req.results)
        } catch (err) {
            next(err)
        }
})

module.exports = userRouter
