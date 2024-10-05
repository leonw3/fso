// Import necessary hooks and libraries from React and Axios
import { useState, useEffect } from 'react'; // useState and useEffect are React hooks
import axios from 'axios'; // Axios is a promise-based HTTP client for making requests
import Note from './components/Note'; // Importing the Note component

// Define the main App component
const App = () => {
  // State hooks to manage the application's state
  const [notes, setNotes] = useState([]); // State for storing an array of notes
  const [newNote, setNewNote] = useState('a new note...'); // State for managing the new note input
  const [showAll, setShowAll] = useState(true); // State for toggling between showing all notes or just important ones

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    console.log('effect'); // Log a message indicating the effect is running
    axios
      // HTTP GET request to retrieve notes from the specified server URL
      .get('http://localhost:3001/notes')
      // Handle the response when the promise is fulfilled
      .then(response => {
        console.log('promise fulfilled'); // Log a message indicating the promise was fulfilled
        setNotes(response.data); // Update the notes state with the fetched data
      });
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  console.log('render', notes.length, 'notes'); // Log the number of notes being rendered
  
  // Function to add a new note
  const addNote = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior (page reload)
    console.log('button clicked', event.target); // Log the event target (button)

    // Create a new note object with a random importance value
    const noteObject = {
      content: newNote, // Set the content to the current newNote state
      important: Math.random() < 0.5, // Randomly assign importance (true or false)
      id: String(notes.length + 1), // Assign a unique ID based on the current notes length
    };

    // Update the notes state with the new note, concatenating it to the existing notes
    setNotes(notes.concat(noteObject));
    setNewNote(''); // Clear the input field by resetting newNote state
  };

  // Function to handle changes in the note input field
  const handleNoteChange = (event) => {
    console.log(event.target.value); // Log the current value of the input
    setNewNote(event.target.value); // Update the newNote state with the input value
  };
  
  // Determine which notes to display based on the showAll state
  const notesToShow = showAll
    ? notes // If showAll is true, show all notes
    : notes.filter(note => note.important === true); // Otherwise, filter to show only important notes

  // SAME AS
  // let notesToShow;
  // if (showAll == true) {
  //   notesToShow = notes;
  // } else {
  //   notesToShow = notes.filter(note => note.important === true);
  // }

  // let buttonText;
  // if (showAll == true) {
  //   buttonText = 'important';
  // } else {
  //   buttonText = 'all';
  // }

  // Return statement with the JSX to render the component
  return (
    <div>
      <h1>Notes</h1>

      {/* Button to toggle between showing all notes or only important ones */}
      <div>
        <button onClick={() => setShowAll(!showAll)}> {/* Toggle showAll state */}
          show {showAll ? 'important' : 'all'} {/* Display button text based on showAll state */}
        </button>
      </div>

      <ul>
        {/* Map over notesToShow array to render each Note component */}
        {notesToShow.map(note => 
          <Note key={note.id} note={note} /> // Each Note component receives a unique key and the note data
        )}
      </ul>

      {/* Form to add a new note */}
      <form onSubmit={addNote}> {/* Call addNote function on form submission */}
        <input value={newNote} onChange={handleNoteChange}/> {/* Input field for new note */}
        <button type="submit">save</button>  {/* Button to submit the form */}
      </form>
      
    </div>
  );
}

// Export the App component as the default export
export default App;