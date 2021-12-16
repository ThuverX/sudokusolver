import React from 'react'
import ReactDOM from 'react-dom'
import App from './Components/App/App'
import GlobalState from './GlobalState'
import { SudokuBoard } from './Types/Sudoku'

GlobalState.prepareState<SudokuBoard>('board', new Array(9).fill(new Array(9).fill('empty')) /* 9x9 filled with empty */)

// @ts-ignore
window.GlobalSate = GlobalState

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
)