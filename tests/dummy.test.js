const { describe } = require('node:test')
const listHelper = require('../utils/list_helper')
const blogs = require('./test_helper').initialBlog

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      expect(result).toBe(5)
    })
  })

  describe('favourite blog', () => {
      test('favourite blog', () => {
        expect(listHelper.favouriteBlog(blogs)).toStrictEqual(
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12
              }
        )
      })
  })

  describe('most blog', () => {
    test('most blog', () => {
        expect(listHelper.mostBlogs(blogs)).toEqual(
            {
                author: "Robert C. Martin",
                blogs: 3
            }
        )
    })
  })

  describe('most like', () => {
    test('most like', () => {
        expect(listHelper.mostLikes(blogs)).toEqual(
            {
                author: "Edsger W. Dijkstra",
                likes: 17
            }
        )
    })
  })