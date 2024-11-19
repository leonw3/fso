import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  // HTTP GET method to retrieve data from server at specified address
  // When promise is fulfilled, state is modifed with the data that is fetched using GET http method
  // (Promise is a JavaScript object 
  // that represents the eventual completion (or failure) 
  // of an asynchronous operation and its resulting value)  
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// Adds a new note to the server / db.json
const create = newPersonObject => {
  const request = axios.post(baseUrl, newPersonObject)
  return request.then(response => response.data);
}

export default { create, getAll }