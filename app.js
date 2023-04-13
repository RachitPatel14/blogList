const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('connected to MONGODB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB', error.message)
    })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
