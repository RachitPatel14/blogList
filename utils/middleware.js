
const logger = require('./logger')
const User  = require('../models/user')
const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }
      else if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ error: error.message })
      }
    
      next(error)
    }
  
  const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if(authorization && authorization.startsWith('Bearer ')) {
      const bearerToken = authorization.replace('Bearer ', '')
      request.token = bearerToken
      next()
    }else{
      response.sendStatus(403)
    }
  }

  const userExtractor = (request, response, next) => {
    const id = request.body.user
    const user = User.findById(id)
    request.user = user
    next()
  }
  module.exports = {
      errorHandler, tokenExtractor, userExtractor
    }