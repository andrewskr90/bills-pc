const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

if (process.env.NODE_ENV === 'development') {
    const corsOptions = {
        origin: 'http://localhost:8080',
        credentials: true
    }
    app.use(cors(corsOptions))
}

app.use(bodyParser.json({ limit: '50mb' }))
app.use(cookieParser(process.env.COOKIE_SECRET))

const rootRouter = require('./router/index')

app.use('/api', rootRouter)

app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).json({
        success: false,
        status: err.status || 500,
        message: err.message
    })
})

module.exports = app
