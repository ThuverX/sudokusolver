import Board from '../Board/Board'
import './Normalize.style.css'
import './App.style.css'
import { SolverService } from '../../Services/SolverService'
import GlobalState from '../../GlobalState'
import { SudokuBoard } from '../../Types/Sudoku'
import { useState } from 'react'
import { Util } from '../../Util'

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

  const Test = () => SolverService.ApplyTestingConfiguration()

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
        <button onClick={ Test }>Load testing Sudoku</button>
      </div>
      <Board></Board>
    </div>
  )
}
