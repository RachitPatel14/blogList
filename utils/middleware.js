
const logger = require('./logger')
const User  = require('../models/user')
const jwt = require('jsonwebtoken')
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

  const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
      if(!decodedToken.id) {
        return response.status(401).json({error: 'token invalid'})
      }
      else{
        const user = await User.findById(decodedToken.id)
        if(user){
          request.user = user
          next()
        }
        else{
          response.sendStatus(403)
        }
      }
    

  }
  module.exports = {
      errorHandler, tokenExtractor, userExtractor
    }