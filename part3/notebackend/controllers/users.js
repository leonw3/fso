const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Create a new user 
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

// Returns all users in the database
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, important: 1 }) 
    // chained with populate method so the user objects also contain the contents of the user's notes and not just their id, 
    // but only the content and important property is needed  

  response.json(users)
})

module.exports = usersRouter