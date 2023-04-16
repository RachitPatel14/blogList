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

afterAll(async () => {
    await mongoose.connection.close()
})