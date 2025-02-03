const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { request } = require('express')
const loginRouter = require('express').Router()

// React code sends send the username and the password to the server address /api/login as an HTTP POST request.
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({username})
  let passwordCorrect = false
  if (user) passwordCorrect = await bcrypt.compare(password, user.passwordHash)

  if (!user || !passwordCorrect) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  // If the username and the password are correct, the server generates a token that somehow identifies the logged-in user.
  // The token is signed digitally, making it impossible to falsify (with cryptographic means)
  // Basically allows recipient to check if it has not been tampered with  
  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: 60*60 } // Expires in one hour (60 seconds times 60)
  )

  response
    .status(200)
    .send({
      token,
      username: user.username,
      name: user.name
    })

    // Router sends back token to the REACT code
    // {
    //   "token": "<JWT_TOKEN>",
    //   "username": "<USERNAME>",
    //   "name": "<USER_NAME>"
    // }
})

module.exports = loginRouter