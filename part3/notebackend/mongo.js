const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://leon:${password}@fullstackopen.vxuaa.mongodb.net/noteApp?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.set('strictQuery',false)

mongoose.connect(url)

// The content field is now required to be at least five characters long and it is set as required, meaning that it can not be missing
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// // Generating new notes
// const note = new Note({
//   content: 'HTML is easy',
//   important: true,
// })

// // Saving notes to database
// note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })

// Fetching objects from the singular collection / database
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

