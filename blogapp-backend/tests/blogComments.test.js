const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

describe('commenting on a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const user = new User({
      username: 'testuser',
      password: 'testpassword',
      name: 'Test User',
    })
    await user.save()

    const blog = new Blog({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://example.com',
      likes: 5,
      user: user._id,
      comments: [],
    })
    await blog.save()
  })

  test('a valid comment can be added to a blog', async () => {
    const blogs = await helper.blogsInDb()
    const blog = blogs[0]

    const newComment = {
      content: 'This is a test comment.',
    }

    await api
      .post(`/api/blogs/${blog.id}/comments`)
      .send(newComment)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = await Blog.findById(blog.id)
    expect(updatedBlog.comments).toHaveLength(1)
    expect(updatedBlog.comments[0].content).toBe('This is a test comment.')
  })

  test('a comment without content is not added to the blog', async () => {
    const blogs = await helper.blogsInDb()
    const blog = blogs[0]

    const newComment = {
      content: 'asd'
    }

    await api
      .post(`/api/blogs/${blog.id}/comments`)
      .send(newComment)
      .expect(400)

    const updatedBlog = await Blog.findById(blog.id)
    expect(updatedBlog.comments).toHaveLength(0)
  })

  test('a comment can be retrieved along with the blog', async () => {
    const blogs = await helper.blogsInDb()
    const blog = blogs[0]
    const newComment = {
      content: 'This is a test comment.',
    }

    await api.post(`/api/blogs/${blog.id}/comments`).send(newComment)

    const response = await api.get(`/api/blogs/${blog.id}`)
    const returnedBlog = response.body

    expect(returnedBlog.comments).toHaveLength(1)
    expect(returnedBlog.comments[0].content).toBe('This is a test comment.')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
