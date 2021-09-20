require('dotenv').config()
const express = require('express')

const path = require('path')

const PORT = process.env.PORT || 5000

const server = require('./api/server')

server.use(express.static(path.join(__dirname, '../front-end/build')))

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../front-end/build', 'index.html'))
})
server.listen(PORT, () => {
    console.log(`listening on localhost: ${PORT}`)
})