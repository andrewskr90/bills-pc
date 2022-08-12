require('dotenv').config()
const express = require('express')
const path = require('path')

const PORT = process.env.PORT || 7070
const server = require('./service.js')

server.use(express.static(path.join(__dirname, '../client/dist')))

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
})


server.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}`)
})
