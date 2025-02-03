const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

// Moved to middleware.js
// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.post('/', async (request, response) => {
  const body = request.body 

  // Checking if token is valid using secret key
  // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // Decoded token is equivalent to userForToken object in login.js since it decodes the token / returns the Object which the token was based on.
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid'} )
  }

  // If likes property is missing from request then defaults to 0
  if (!request.body.hasOwnProperty('likes')) {
    request.body.likes = 0;
  }

  // if title or url properties are missing from request, respond with status code 400 Bad Request
  if (!request.body.hasOwnProperty('title') || 
  !request.body.hasOwnProperty('url') ) {
    return response.status(400).json({ error: 'title or url properties missing from requrest' })
  }

  const user = await User.findById(decodedToken.id)
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: body.userId,
    likes: body.likes,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save() 

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter