const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Blog = require('../models/blog')
const userExtract = require('../utils/middleware').userExtractor
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
  response.json(blogs)  
  })
  
  blogsRouter.post('/', userExtract, async (request, response) => {
    const body = request.body
    console.log(request.user)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id) {
      return response.status(401).json({error: 'token invalid'})
    }

    const user = await User.findById(decodedToken.id)
    
    const blog = new Blog({
      title: body.title,
      author: body.author,
      user: user.id,
      url: body.url,
      likes: body.likes || 0
    })
    if(blog.title && blog.url) 
    {
      const savedBlog = await blog.save()
      
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()   
      response.status(201).json(savedBlog)  
    }
    response.status(400).end()
  })

  blogsRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    console.log(id)
    const blog = await Blog.findById(request.params.id)
    console.log(blog)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
      if(!decodedToken.id) {
        return response.status(401).json({error: 'token invalid'})
      }
      const user = await User.findById(decodedToken.id)
      console.log(user)
      if(blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndRemove(id)
        response.status(204).end()
      }
      else{
        return response.status(400).json({error: 'user can only delete their blogs.'})
      }
  })

  blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    }
     const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
      response.json(updatedBlog)
  })

module.exports = blogsRouter