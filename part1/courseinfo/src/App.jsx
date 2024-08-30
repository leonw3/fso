// const Header = () => {
//   const course = 'Half Stack application development'
    
//   return (
//     <div>
//       <h1>{course}</h1>
//     </div>
//   )
// }

// const Part1 = () => {
//   const part1 = {
//     name: 'Fundamentals of React',
//     exercises: 10
//   }
//   return (
//     <div>
//       <p>
//         {part1.name} {part1.exercises}
//       </p>
//     </div>
//   )
// }

// const Part2 = () => {
//   const part2 = {
//     name: 'Using props to pass data',
//     exercises: 7
//   }

//   return (
//     <div>
//       <p>
//         {part2.name} {part2.exercises}
//       </p>
//     </div>
//   )
// }

// const Part3 = () => {
//   const part3 = {
//     name: 'State of a component',
//     exercises: 14
//   }

//   return (
//     <div>
//       <p>
//         {part3.name} {part3.exercises}
//       </p>
//     </div>
//   )
// }

// const Content = () => {
//   return (
//     <div>
//       <Part1/>
//       <Part2/>
//       <Part3/>
//     </div>
//   )
// }

// const Total = () => {
//   const exercises1 = 10
//   const exercises2 = 7
//   const exercises3 = 14
  
//   return (
//     <div>
//       <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
//     </div>
//   )
// }

// const App = () => {
//   return (
//     <div>
//       <Header/>
//       <Content/> 
//       <Total/>
//     </div>
//   )
// }

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <h1>{course.name}</h1>
      <p>{course.parts[0].name} {course.parts[0].exercises}</p>
      <p>{course.parts[1].name} {course.parts[1].exercises}</p>
      <p>{course.parts[2].name} {course.parts[2].exercises}</p>
      <p>Number of exercises {course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises}</p>
    </div>
  )
}

export default App