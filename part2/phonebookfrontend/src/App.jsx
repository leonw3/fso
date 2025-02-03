import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'

const Notification = ({message, error}) => {
  if (message === '') return null;
  
  if (error === true) {
    return (
      <div className="error"> 
        {message}
      </div>
    )
  }

  return (
    <div className="notification"> 
      {message}
    </div>
  )
}


const Person = ({person, deletePerson}) => {
  return (
    <div>
      {person.name} {person.number}
      <DeleteButton person={person} deletePerson={deletePerson}></DeleteButton>
    </div>
  )
}

const DeleteButton = ({person, deletePerson}) => {
  return (
    <button onClick={() => deletePerson(person)}>Delete</button>
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

const Persons = ({persons, filter, deletePerson}) => {
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
        .map(person => <Person key={person.id} person={person} deletePerson={deletePerson}/>)
      }
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPersons => {setPersons(initialPersons)});
  }, [])

  const addPerson = (event) => {
    event.preventDefault();
    const containsName = persons.some(person => person.name === newName);
    if (!containsName) {
      const newPersonObject = {
        name: newName,
        number: newNumber,
      };

      phonebookService
        .create(newPersonObject)
        .then(returnedPersonObject => {
          setPersons(persons => persons.concat(returnedPersonObject));
          setMessage(`Added ${newName}`);
        })
        .catch(error => {
          console.log(error.response.data.error)
          setError(true)
          setMessage(error.response.data.error)
        })
    }
    else if (containsName) {
      const personThatExists = persons.find(p => p.name === newName);
  
      const updatedPerson = {
        ...personThatExists,
        phoneNumber: newNumber, // Update the number directly
      };

      if (window.confirm(`${updatedPerson.name} already exists, replace the old number with a new one?`)) {
        phonebookService
        .replaceNumber(updatedPerson) // Assuming this updates the person on the backend
        .then(returnedUpdatedPerson => {
          // Updating the array 
          setPersons(persons => 
            persons.map(person => 
              person.id === returnedUpdatedPerson.id ? returnedUpdatedPerson : person
            )
          ); 
        })
        .catch(error => {
          setError(true)
          // setMessage(`Information of '${updatedPerson.name}' has already been removed from the server`);
          setMessage(error.response.data.error)
          // Person has already been removed from the database on the server so you need to update the array on the frontend as well 
          // by filtering that person out
          // setPersons(persons => 
          //   persons.filter(p => 
          //     p.id !== updatedPerson.id
          //   )
          // ); 
        })
      }
    }
    else {
      alert(`${newName} is already added to phonebook`); 
    }
    setNewName('');
    setNewNumber('');
    setTimeout(() => {
      setMessage('');
      setError(false);
    }, 5000);
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
    setMessage(`Changed ${newName}'s number`);
    setTimeout(() => {setMessage('')}, 5000);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} error={error}/>
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
      <Persons persons={persons} filter={filter} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
