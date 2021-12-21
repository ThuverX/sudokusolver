import Board from '../Board/Board'
import './Normalize.style.css'
import './App.style.css'
import { SolverService } from '../../Services/SolverService'
import GlobalState from '../../GlobalState'
import { SudokuBoard } from '../../Types/Sudoku'
import { useState } from 'react'

export default function App() {

  let [ status, setStatus ] = useState<any>(null)

  const Solve = () => {
    let currentState = GlobalState.getState<SudokuBoard>('board')

    let data = SolverService.Complete(currentState)

    setStatus({
      time: Math.round(data.end - data.start) + 'ms',
      itteration_count: data.itteration_count,
      solved: data.solved
    })
  }

  const TestOne = () => SolverService.ApplyTestingConfigurationOne()
  const TestTwo = () => SolverService.ApplyTestingConfigurationTwo()

  return (
    <div>
      <div>
        <h1>Sudoku Solver</h1>
        { status &&
          <div className="status">
            Time: { status.time } <br/>
            Itterations: { status.itteration_count } <br/>
            {status.solved ? 'Solved!' : 'Not solved...'} <br/>
          </div>
        }
        <button onClick={ Solve }>Solve</button>
        <button onClick={ TestOne }>Load testing Sudoku 1</button>
        <button onClick={ TestTwo }>Load testing Sudoku 2</button>
      </div>
      <Board></Board>
    </div>
  )
}
