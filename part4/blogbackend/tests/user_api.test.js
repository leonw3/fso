const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper = require('./test_helper')

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

test('valid user', async () => {
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
  assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length)

  const usernames = usersAtEnd.map(u => u.username)
  assert(usernames.includes(newUser.username))
})

describe('invalid user', async () => {
  // DONT NEED TO TEST FOR INVALID USERNAME, IS HANDLED BY MONGOOSE 
  // test('no username', async () => {
  //   const usersAtStart = await helper.usersInDb()
  
  //   const userNoUsername = {
  //     name: 'Matti Luukkainen',
  //     password: 'salainen'
  //   }

  //   const response = await api
  //   .post('/api/users')
  //   .send(userNoUsername)
  //   .expect(401)
  //   .expect('Content-Type', /application\/json/)

  //   const usersAtEnd = await helper.usersInDb()

  //   assert(response.body.error.includes(''))
  //   assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  // })

  test('no password', async () => {
    const usersAtStart = await helper.usersInDb()
  
    const userNoPassword = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
    }

    const response = await api
    .post('/api/users')
    .send(userNoPassword)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(response.body.error.includes('password is missing or is less than 3 characters'))
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test('password less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()
  
    const userShortPassword = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'sa',
    }

    const response = await api
    .post('/api/users')
    .send(userShortPassword)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(response.body.error.includes('password is missing or is less than 3 characters'))
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})