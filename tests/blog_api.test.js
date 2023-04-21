const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const helper = require('./test_helper')
const { json } = require('express')
beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlog) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('get all', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000)

test('verify the property', async () => {
    const response = await api.get('/api/blogs')

    const ids = response.body.map(r => r.id)
    for(let id of ids){
        console.log(typeof id)
        expect(id).not.toBe(json)
    }
})
    test('post new blog', async () => {
        const newBlog = {
            title: 'React development for beginner',
            author: 'rachit patel',
            url: 'www.reactdevelopment/beginner.com',
            likes: 15,
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
        const titles = response.body.map(b => b.title)
    
        expect(response.body).toHaveLength(helper.initialBlog.length + 1)
        expect(titles).toContain(
            'React development for beginner'
        )
    })

    test('post blog with 0 likes', async () => {
        const newBlog = {
            title: 'React development for beginner',
            author: 'rachit patel',
            url: 'www.reactdevelopment/beginner.com',
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
        const likes = response.body.map(b => b.likes)
    
        expect(response.body).toHaveLength(helper.initialBlog.length + 1)
        expect(likes).toContain(0)
    }, 1000000)  

    test('blog with no title or url', async () => {
        const newBlog = {
            title: 'ira today blog',
            author: 'ira desai',
            likes: 120
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlog.length)
    })

afterAll(async () => {
    await mongoose.connection.close()
})