import { useState } from 'react'

// const StatisticLine = ({text, value}) => {
//   return (
//     <div>
//       {text + ' '}
//       {value}
//     </div>
//   )
// }

const Button = (props) => {
  return (
    <button onClick = {props.handleClick}>
      {props.text}
    </button>
  )
}

const Statistics = ({good, neutral, bad, allClicks, average, positivePercent}) => {
  return (
    <div>
      {/* <StatisticLine text="good" value ={good}/>
      <StatisticLine text="neutral" value ={neutral}/>
      <StatisticLine text="bad" value ={bad}/>
      <StatisticLine text="all" value ={allClicks}/>
      <StatisticLine text="average" value ={average}/>
      <StatisticLine text="positive" value ={positivePercent + ' %'}/> */}
      <table>
        <tbody>
          <tr>
            <td>good</td>
            <td>{good}</td>
          </tr>
          <tr>
            <td>neutral</td>
            <td>{neutral}</td>
          </tr>
          <tr>
            <td>bad</td>
            <td>{bad}</td>
          </tr>
          <tr>
            <td>all</td>
            <td>{allClicks}</td>
          </tr>
          <tr>
            <td>average</td>
            <td>{average}</td>
          </tr>
          <tr>
            <td>positive</td>
            <td>{positivePercent + ' %'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [allClicks, setAllClicks] = useState(0);
  const [average, setAverage] = useState(0);
  const [positivePercent, setPositivePercent] = useState(0);

  const handleGoodClick = () => {
    const updatedGood = good + 1;
    setGood(updatedGood);

    const updatedAllClicks = allClicks + 1;
    setAllClicks(updatedAllClicks);

    const updatedAverage = ((updatedGood * 1) + (bad * -1)) / updatedAllClicks;
    setAverage(updatedAverage);

    const updatedPositivePercent = 100 * (updatedGood / updatedAllClicks);
    setPositivePercent(updatedPositivePercent);
  };

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1;
    setNeutral(updatedNeutral);

    const updatedAllClicks = allClicks + 1;
    setAllClicks(updatedAllClicks);

    const updatedAverage = ((good * 1) + (bad * -1)) / updatedAllClicks;
    setAverage(updatedAverage);

    const updatedPositivePercent = 100 * (good / updatedAllClicks);
    setPositivePercent(updatedPositivePercent);
  };
  
  const handleBadClick = () => {
    const updatedBad = bad + 1;
    setBad(updatedBad);

    const updatedAllClicks = allClicks + 1;
    setAllClicks(updatedAllClicks);

    const updatedAverage = ((good * 1) + (updatedBad * -1)) / updatedAllClicks;
    setAverage(updatedAverage);

    const updatedPositivePercent = 100 * (good / updatedAllClicks);
    setPositivePercent(updatedPositivePercent);
  };

  if (allClicks == 0) {
    return (
      <div>
        <h1>give feedback</h1>
        <Button handleClick={handleGoodClick} text='good'/>
        <Button handleClick={handleNeutralClick} text='neutral'/>
        <Button handleClick={handleBadClick} text='bad'/>
        <h1>statistics</h1>      
        <div>No feedback given</div>
      </div>
    ) 
  }
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text='good'/>
      <Button handleClick={handleNeutralClick} text='neutral'/>
      <Button handleClick={handleBadClick} text='bad'/>
      <h1>statistics</h1>      
      <Statistics 
        good = {good} neutral = {neutral} bad = {bad} 
        allClicks = {allClicks} average = {average} positivePercent = {positivePercent}
      />
    </div>
  )
}

export default App