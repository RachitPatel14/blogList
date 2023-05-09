const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
  response.json(blogs)  
  })
  
  blogsRouter.post('/', async (request, response) => {
    const body = request.body
    console.log(body.userId)
    const user = await User.findById(body.userId)
    console.log(user.id)
    const blog = new Blog({
      title: body.title,
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
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
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