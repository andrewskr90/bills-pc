const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')


const server = express()

if (process.env.NODE_ENV === 'development') {
    const corsOptions = {
        origin: 'http://localhost:8080',
        credentials: true
    }
    server.use(cors(corsOptions))
}

server.use(bodyParser.json({ limit: '50mb' }))
server.use(cookieParser(process.env.COOKIE_SECRET))

const rootRouter = require('./router/index')

server.use('/api', rootRouter)

server.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).json({
        success: false,
        status: err.status || 500,
        message: err.message
    })
})

module.exports = server
