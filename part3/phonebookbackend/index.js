const express = require('express')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

// MIDDLEWARE
app.use(express.static('dist'))

const cors = require('cors')
app.use(cors())

app.use(express.json())

const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// ROUTES
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// Returns how many people there is information from and the time
app.get('/info', (request, response, next) => {
  const currentTime = new Date().toString()

  Person.countDocuments()
    .then(count => {
      response.send(`
            <p>Phonebook has info for ${count} people</p>
            <p>${currentTime}</p>
        `)
    })
    .catch(error => next(error))
})

// Returns all the people in the phonebook
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Returns a person that matches the id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Deletes a person that matches the id from the phonebook
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Replaces number of a person already in the phonebook
app.put('/api/persons/:id', (request, response, next) => {
  const { name, phoneNumber } = request.body
  console.log(request.body)
  Person.findByIdAndUpdate(
    request.params.id,
    { name, phoneNumber },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


// Adds a person to the phonebook
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    phoneNumber: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.message === 'number or name missing' ) {
    return response.status(400).send({ error: error.message })
  }

  else if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  // All other errors passed into default express error handler
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})