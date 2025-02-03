const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('not enough arguments')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://leon:${password}@fullstackopen.vxuaa.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const entrySchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
})

// Creates a collection called entries
const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length === 3) {
  Entry.find({}).then(result => {
    result.forEach(entry => {
      console.log(entry)
    })
    mongoose.connection.close()
  })
}

const name = process.argv[3]
const phoneNumber = process.argv[4]

const entry = new Entry({
  name: name,
  phoneNumber: phoneNumber
})

entry.save().then(() => {
  console.log('entry saved')
  mongoose.connection.close()
})

