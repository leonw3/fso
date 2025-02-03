const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body 

  // If likes property is missing from request then defaults to 0
  if (!request.body.hasOwnProperty('likes')) {
    request.body.likes = 0;
  }

  // if title or url properties are missing from request, respond with status code 400 Bad Request
  if (!request.body.hasOwnProperty('title') || 
  !request.body.hasOwnProperty('url') ) {
    return response.status(400).json({ error: 'title or url properties missing from requrest' })
  }

  // Get user from request object, processed through middleware
  const user = request.user
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save() 

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user

  // Check to see if token id matches the id of the user who created the blog, if not return error
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== user.id.toString()) return response.status(401).json({ error: 'user id is invalid' })
   
  await Blog.findByIdAndDelete(request.params.id)

  // Deleting blog from the array of blogs user collection 
  user.blogs = user.blogs.filter(potentialblogId => potentialblogId === blog._id)
  await user.save()

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