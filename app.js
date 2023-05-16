const express = require('express')
const config = require('./utils/config')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const midlleware = require('./utils/middleware')

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('connected to MONGODB')
    })
    .catch(error => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use('/api/login', loginRouter)
app.use(midlleware.tokenExtractor)
app.use('/api/blogs', midlleware.userExtractor, blogsRouter)
app.use('/api/users', userRouter)


app.use(midlleware.errorHandler)

module.exports = app
