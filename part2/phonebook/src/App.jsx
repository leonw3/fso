import { useState, useEffect } from 'react'
import { phonebookServices } from './services/phonebook'
import axios from 'axios'

const Person = ({person}) => {
  return (
    <div>{person.name} {person.number}</div>
  )
}

const Filter = ({filter, handleFilterChange}) => {
  return (
    <div>filter shown with: 
        <input value={filter} onChange={handleFilterChange}/>
    </div>
  )
}

const Form = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
    <form onSubmit={addPerson}>
      <div>name: 
        <input value={newName} onChange={handleNameChange}/>
      </div>
      <div>number: 
        <input value={newNumber} onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({persons, filter}) => {
  return (
    <div>
      {persons
        // Filtering names 
        .filter(person => {
          // No filtering; return all persons
          if (filter === '') return true; 
          // Check if the person's name includes the filter string
          else return person.name.toLowerCase().includes(filter.toLowerCase());
        })
        // Displaying filtered names 
        .map(person => <Person key={person.id} person={person}/>)
      }
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios
      // HTTP GET method to retrieve data from server at specified address
      .get('http://localhost:3001/persons')
      // When promise is fulfilled, state is modifed with the data that is fetched using GET http method
      // (Promise is a JavaScript object 
      // that represents the eventual completion (or failure) 
      // of an asynchronous operation and its resulting value)  
      .then(response => {
        setPersons(response.data);
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault();
    const containsName = persons.some(person => person.name === newName);
    if (!containsName) {
      const newNameObject = {
        name: newName,
        number: newNumber,
        id: String(persons.length + 1),
      };
      setPersons(persons.concat(newNameObject));
    }
    else {
      alert(`${newName} is already added to phonebook`); 
    }
    setNewName('');
    setNewNumber('');
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h2>Add new </h2>
      <Form 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter}/>
    </div>
  )
}

export default App
