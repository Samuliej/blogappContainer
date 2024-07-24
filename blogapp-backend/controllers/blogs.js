const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})


blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.status(200).json(blog)
  } else {
    response.status(404).end()
  }
})


blogsRouter.post('/', async (request, response) => {
  const body = request.body
  // Varmistetaan tokenin oikeellisuus
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(decodedToken)
  if(!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  console.log(body)
  let blog = new Blog()
  if (!body.title || !body.url) {
    response.status(400).json({error: 'Title or Url field missing.'})
    return;
  }

  if (!body.likes) {
    blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: 0,
      user: user
    })
  } else {
      blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user
      })
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {
  console.log(request)
  console.log(request.params.id)
  const blog = await Blog.findById(request.params.id)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if ( blog.user.toString() === decodedToken.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(404).json({ error: 'You are not authorized to delete this blog' })
  }
})


blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new:true})
  response.status(200).json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { id } = request.params
  const { content } = request.body

  console.log(request.body)

  console.log('backend comment content', content)

  const blog = await Blog.findById(id)

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  const comment = {
    content
  }

  blog.comments.push(comment)
  const updatedBlog = await blog.save()

  response.status(200).json(updatedBlog)
})


module.exports = blogsRouter