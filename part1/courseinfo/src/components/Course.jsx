const Part = ({name, exercises}) => {
    return (
      <p>{name}{exercises}</p>
    )
  }
  
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises}/> )}
      </div>
    )
  }
  
  const Sum = ({parts}) => {
    return (
      <div>
        <p>Number of exercises {parts.reduce((sum, part) => sum + part.exercises, 0)}</p>
      </div>
    )
  }
  
  
  const Header = ({course}) => {
    return (
      <div>
        <h1>{course.name}</h1>
      </div>
    )
  }
  
  const Course = ({course}) => {
    return (
      <div>
        <Header course={course}/>
        <Content parts={course.parts}/>
        <Sum parts={course.parts}/> 
      </div>
    )
  }

  export default Course