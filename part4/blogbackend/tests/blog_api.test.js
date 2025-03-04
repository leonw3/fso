const config = require('../utils/config')
const { before, test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

// Register a user before the tests 
before(async () => { 
  const newUser = {
    username: "timmy",
    name: "Leon",
    password: "password"
  }
  
  await api
    .post('/api/users')
    .send(newUser)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared blogs from database')
  // await Blog.insertMany(helper.initialBlogs)
  // console.log('initialised blogs in database')
})

// describe('miscellaneous', () => {
//   test('correct amount of blogs returned and in JSON', async () => {
//     const response = await api.get('/api/blogs') 
//                               .expect(200)
//                               .expect('Content-Type', /application\/json/)
//     console.log(response.body)
//     assert.strictEqual(response.body.length, helper.initialBlogs.length) 
//   })
  
//   test('unique identifier property of the blog posts is named id', async () => {
//     const blogs = await helper.blogsInDb()
//     blogs.forEach((blog) => {
//       assert(blog.hasOwnProperty('id'))
//       assert(!blog.hasOwnProperty('_id'))
//     })
//   })  
// })

describe('adding new blog: POST requests to /api/blogs', () => {
  test('making POST request to /api/blogs URL creates new blog', async () => {
    const blogsAtStart = await helper.blogsInDb()

    // Login first
    const user = {
      username: "timmy",
      password: "password"
    }

    const response = await api
                          .post('/api/login')
                          .send(user)

    const newBlog = {
      title: 'if-else-switch',
      author: 'Robert C. Martin',
      url: 'https://blog.cleancoder.com/uncle-bob/2021/03/06/ifElseSwitch.html',
      likes: 5
    }
  
    await api.post('/api/blogs')
             .set('Authorization', 'Bearer ' + response.body.token)
             .send(newBlog)                            
             .expect(201)
             .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
  
    const urls = blogsAtEnd.map(blog => blog.url)
    assert(urls.includes('https://blog.cleancoder.com/uncle-bob/2021/03/06/ifElseSwitch.html'))
  })

  test('creating new blog fails with 401 if token not provided', async () => {
    const blogsAtStart = await helper.blogsInDb()

    // Login first
    const user = {
      username: "timmy",
      password: "password"
    }

    const response = await api
                          .post('/api/login')
                          .send(user)

    const newBlog = {
      title: 'if-else-switch',
      author: 'Robert C. Martin',
      url: 'https://blog.cleancoder.com/uncle-bob/2021/03/06/ifElseSwitch.html',
      likes: 5
    }
  
    await api.post('/api/blogs')
             .send(newBlog)                            
             .expect(401)
             .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  
    const urls = blogsAtEnd.map(blog => blog.url)
    assert(!(urls.includes('https://blog.cleancoder.com/uncle-bob/2021/03/06/ifElseSwitch.html')))
  })
  
  test('if likes property is missing from POST request, it will default to the value 0.', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const user = {
      username: "timmy",
      password: "password"
    }

    const response = await api
                          .post('/api/login')
                          .send(user)
             
    const newBlog = {
      title: 'if-else-switch',
      author: 'Robert C. Martin',
      url: 'https://blog.cleancoder.com/uncle-bob/2021/03/06/ifElseSwitch.html',
    }
  
    await api.post('/api/blogs')
             .set('Authorization', 'Bearer ' + response.body.token)
             .send(newBlog)                            
             .expect(201)
             .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
  
    const addedBlog = blogsAtEnd.find(blog => blog.url === newBlog.url)
    assert(addedBlog.hasOwnProperty('likes'))
    assert.strictEqual(addedBlog.likes, 0)
  })
  
  test('if title or url properties are missing from request, backend responds with status code 400 Bad Request', async () => {
    const user = {
      username: "timmy",
      password: "password"
    }

    const response = await api
                          .post('/api/login')
                          .send(user)

    let newBlog = {
      author: 'Robert C. Martin',
      url: 'https://blog.cleancoder.com/uncle-bob/2021/03/06/ifElseSwitch.html',
      likes: 5
    }
  
    await api.post('/api/blogs')
             .set('Authorization', 'Bearer ' + response.body.token)
             .send(newBlog)                            
             .expect(400)
             .expect('Content-Type', /application\/json/)
  
    newBlog = {
      title: 'if-else-switch-fake',
      author: 'Robert C. Martin',
      likes: 5
    }
  
    await api.post('/api/blogs')
             .set('Authorization', 'Bearer ' + response.body.token)
             .send(newBlog)                            
             .expect(400)
             .expect('Content-Type', /application\/json/)
    
  })
})

describe('testing DELETE requests to /api/blogs', () => {
  test('successful deletion of note with status code 204 if id is valid', async () => {
    // Creating blog first
    const user = {
      username: "timmy",
      password: "password"
    }

    const response = await api
                          .post('/api/login')
                          .send(user)
    const token = response.body.token

    const newBlog = {
      title: 'if-else-switch',
      author: 'Robert C. Martin',
      url: 'https://blog.cleancoder.com/uncle-bob/2021/03/06/ifElseSwitch.html',
      likes: 5
    }
  
    await api.post('/api/blogs')
             .set('Authorization', 'Bearer ' + token)
             .send(newBlog)                            
             .expect(201)
             .expect('Content-Type', /application\/json/)

    // Deleting blog
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    console.log('BLOG TO DELETE ' + blogToDelete)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const contents = blogsAtEnd.map(b => b.url)
    assert(!contents.includes(blogToDelete.url))
  })
})

// describe('testing PUT requests to /api/blogs', () => {
//   test('successful update of blog with status code 200 if id is valid', async () => {
//     const blogsAtStart = await helper.blogsInDb()
//     const blogToUpdate = blogsAtStart[0]
//     blogToUpdate.likes++;

//     await api
//       .put(`/api/blogs/${blogToUpdate.id}`)
//       .send(blogToUpdate)
//       .expect(200)
//       .expect('Content-Type', /application\/json/)

//     const blogsAtEnd = await helper.blogsInDb()
//     assert.strictEqual(blogsAtEnd[0].likes, blogToUpdate.likes)
//   })
// })


after(async () => {
  await User.deleteMany({})

  await mongoose.connection.close() 
  console.log('disconnected from database')
})