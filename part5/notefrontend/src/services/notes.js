import axios from 'axios'
const baseUrl = '/api/notes'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    // Setting token in the header
    headers: {
      Authorization: token
    }
  }
  // Header given to axios as third parameter
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

// Add in future- delete button
// const remove = async (id) => {
//   const response = axios.delete(`${baseUrl}/${id}`)
//   return response.data
// }

export default { 
  getAll, create, update, setToken
}