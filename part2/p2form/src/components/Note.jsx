const Note = ({ note, toggleImportance }) => {
  let label;
  if (note.important) {
    label = 'make not important';
  } 
  else {
    label = 'make important';
  }
  
  return (
    <li className='note'>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}



export default Note