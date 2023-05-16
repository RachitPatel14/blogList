const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
  response.json(blogs)  
  })
  
  blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const user = request.user
    
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
    response.status(401).end()
  })

  blogsRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const blog = await Blog.findById(request.params.id)
    const user = request.user

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