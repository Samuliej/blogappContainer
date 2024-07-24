const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
  
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })


  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  
  test('there are two blogs currently', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2)
  })
  
  test('objects have an field named "id"', async () => {
      const response = await api.get('/api/blogs')
      const blogArr = response.body
      blogArr.forEach(blog => { 
        expect(blog.id).toBeDefined()
      })
  })
  
})

describe('adding a blog', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    const passwordHash2 = await bcrypt.hash('salainen', 10)
    const user2 = new User({ username: 'samppa', passwordHash})
    await user2.save()
  })


  test('a valid blog can be added ', async () => {

    const currentUser = await User.findOne({ username: "samppa" })
    const token = helper.generateToken(currentUser)

    const newBlog = {
      "title": "TestiBlogi testien kautta",
      "author": "Samppa",
      "url": "https://www.eioleolemassa.fi",
      "likes": 1,
      "user": currentUser._id
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
  
    const title = response.body.map(r => r.title)
  
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(title).toContain('TestiBlogi testien kautta')
  })
  
  test('if an blog object is made without an likes field, it is set to zero', async () => {
    const currentUser = await User.findOne({ username: "samppa" })
    const token = helper.generateToken(currentUser)

    const newBlog = {
      "title": "TestiBlogi ilman likes kenttää",
      "author": "Samppa",
      "url": "https://www.eiolevielakaanolemassa.fi",
      "user": currentUser._id
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
    const addedBlog = response.body[response.body.length-1]
    expect(addedBlog.likes).toBe(0)
  })
  
  test('if blog is missing the title or the url field, server responds 400 Bad Request', async () => {
    let newBlog = {
      "author": "Samppa",
      "url": "https://www.eiolevielakaanolemassa.fi"
    }
  
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  
    newBlog = {
      "author": "Samppa",
      "title": "Testi"
    }
  
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  }) 
})

describe('deleting a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    
    const user = await User.create({
      username: 'testuser',
      password: 'testpassword',
      name: 'Test User'
    })

    
    const token = helper.generateToken(user)

    
    const newBlog = new Blog({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://example.com',
      likes: 5,
      user: user._id
    })
    await newBlog.save()


    await api
      .delete(`/api/blogs/${newBlog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(newBlog.title)
  })
})


describe('updating a blog', () => {
  test('succeeds with status code 200', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToModify = blogsAtStart[0]
    const originalBlogTitle = blogToModify.title
    console.log(blogToModify)
    
    const blog = {
      "title": "muokattu blogi testien kautta",
      "author": "Samppa",
      "url": "https://www.eiolfdsaeolemassa.fi",
      "likes": 66
    }

    await api
      .put(`/api/blogs/${blogToModify.id}`)
      .send(blog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(originalBlogTitle)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'samppa',
      name: 'samuli toppi',
      password: 'salasana'
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

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ab',
      name: 'ei toimi',
      password: 'fdsafads'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed: username: Path ' +
      '`username` ' + '(`' + newUser.username + '`)' + ' is shorter than the minimum allowed length (3).')
    
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password and username is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'cd',
      name: 'ei toimi',
      password: 'ab'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username and password should be longer than 3 characters')
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

  
afterAll(() => {
  mongoose.connection.close()
})
