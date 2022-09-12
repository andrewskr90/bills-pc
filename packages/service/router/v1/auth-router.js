const authRouter = require('express').Router()
const { addUserMySQL, findUsersByFilterMySQL } = require('../../db/queries/userQueries')
const QueueQueries = require('../../middleware/QueueQueries')
const { executeQueries } = require('../../db')

const { 
    formatUser, 
    createSession, 
    encryptSessionCookie, 
    verifyCookie,
    decodeSessionToken,
    encryptPassword,
    authenticateUser,
    prepUserFilter,
    checkRegisterValues
} = require('../../middleware/auth-middleware')

authRouter.post('/register', 
    checkRegisterValues,
    formatUser, 
    encryptPassword, 
    QueueQueries.init,
    QueueQueries.users.insert,
    executeQueries,
    (req, res, next) => {
        res.status(201).json(req.results)
})

authRouter.post('/login',
    QueueQueries.init,
    QueueQueries.users.select,
    executeQueries, 
    authenticateUser,
    createSession, 
    encryptSessionCookie,
    (req, res, next) => {
        res.status(200).json(req.results)
})

//authorize cookie
authRouter.post('/', verifyCookie, decodeSessionToken, (req, res, next) => {
    res.status(200).json(req.claims)
})

module.exports = authRouter
