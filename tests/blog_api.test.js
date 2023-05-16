const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const api = supertest(app)
const helper = require('./test_helper')

describe('tests for blogs', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('skertek', 10)
        const user = new User({username: 'root', passwordHash})
        await user.save()
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
    test('post new blog with login', async () => {
        const newBlog = {
            title: 'React development for beginner',
            author: 'root',
            url: 'www.reactdevelopment/beginner.com',
            likes: 15,
        }
        const loginData = await api 
            .post('/api/login')
            .send({
                "username": "root",
                "password": "skertek"
            })
            .expect(200)
        const token = loginData.body.token

        await api
            .post('/api/blogs')
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs').set("Authorization", `Bearer ${token}`)
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
        const loginData = await api 
            .post('/api/login')
            .send({
                "username": "root",
                "password": "skertek"
            })
            .expect(200)
        const token = loginData.body.token

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)
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
        const loginData = await api 
            .post('/api/login')
            .send({
                "username": "root",
                "password": "skertek"
            })
            .expect(200)
        const token = loginData.body.token
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(401)
        const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)
        expect(response.body).toHaveLength(helper.initialBlog.length)
    })

    test('deletion of a blog', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(
            helper.initialBlog.length-1
            )
        const titles = blogsAtEnd.map(b => b.title)

        expect(titles).not.toContain(blogToDelete.title)
    })

    test('update likes', async () => {
        const blogAtStart = await helper.blogsInDb()
        const blogToUpdate = blogAtStart[0]
        blogToUpdate.likes = 100
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)

        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlog = blogsAtEnd.filter(b => b.id === blogToUpdate.id)
        expect(updatedBlog[0].likes).toBe(100)
    })
})
describe('tests for users', () => {
    beforeEach( async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('skertek', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test('creation succeeds', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'mluukkai',
          name: 'Matti Luukkainen',
          password: 'salainen',
        }
    
        await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
      })
    
      test('creation fails', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('expected `username` to be unique')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })
})

afterAll(async () => {
    await mongoose.connection.close()
})