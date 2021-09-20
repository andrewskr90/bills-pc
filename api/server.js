const express = require('express')
const cors = require('cors')

const server = express()

server.use(express.json())
server.use(cors())

server.get('/api', (req, res) => {
    res.json({ message: 'Bills PC api!' })
})

module.exports = server