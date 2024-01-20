require('dotenv').config()
const express = require('express')
const path = require('path')

const PORT = process.env.PORT || 7070
const app = require('./service.js')

app.use(express.static(path.join(__dirname, '../client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
})


app.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}`)
})
