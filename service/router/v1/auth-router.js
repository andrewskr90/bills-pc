const authRouter = require('express').Router()
const { addUserMySQL, findUsersByFilterMySQL } = require('../../../db/queries/userQueries')
const { 
    formatUser, 
    createSession, 
    encryptSessionCookie, 
    verifySession,
    decodeJwt,
    encryptPassword,
    authenticateUser,
    prepUserFilter,
    checkRegisterValues
} = require('../../middleware/auth-middleware')

authRouter.post('/register', 
    checkRegisterValues,
    formatUser, 
    encryptPassword, 
    addUserMySQL,
    async (req, res, next) => {
    res.status(200).json(res.results)
})

authRouter.post('/login',
    prepUserFilter,
    findUsersByFilterMySQL, 
    authenticateUser,
    createSession, 
    encryptSessionCookie,
    (req, res, next) => {
    res.status(200).send(req.claims)
})

//authorize cookie
authRouter.post('/', verifySession, decodeJwt, (req, res, next) => {
    res.status(200).json(req.claims)
})

module.exports = authRouter
