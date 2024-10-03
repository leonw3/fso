import { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('a new note...') 
  const [showAll, setShowAll] = useState(true)

  const addNote = (event) => {
    event.preventDefault() //event.preventDefault() prevents the browser from performing default action when form is submitted, usually a reload
    console.log('button clicked', event.target)
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1),
    }

    setNotes(notes.concat(noteObject));
    setNewNote('');
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value) // no need to call the event.preventDefault() method like we did in the onSubmit event handler. This is because no default action occurs on an input change, unlike a form submission.
    setNewNote(event.target.value)
  }
  
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

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

  return (
    <div>
      <h1>Notes</h1>

      {/* Same as */}
      {/* <div>
        <button onClick={() => {
          if (showAll == true) {
            setShowAll(false);
          } else {
            setShowAll(true);
          }
        }}>
          show {buttonText}
        </button>
      </div> */}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>

      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>  
      </form>
      
    </div>
  )
}

export default App 