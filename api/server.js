const express = require('express')
const cors = require('cors')

const authRouter = require('../api/routers/auth-router')

const server = express()


server.use(express.json())
server.use(cors())

server.use('/api/auth', authRouter)

server.get('/api', (req, res) => {
    res.json({ message: 'Bills PC api!' })
})

server.use((err, req, res, next) => { //eslint-disable-line
    res.status( err.status || 500 ).json({
        errorStatus: err.status,
        message: err.message,
    })
  })

module.exports = server