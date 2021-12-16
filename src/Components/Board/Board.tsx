import GlobalState from '../../GlobalState'
import { SudokuBoard } from '../../Types/Sudoku'
import BoardCell from '../BoardCell/BoardCell'
import './Board.style.css'

export default function Board() {

    let [ boardState, setBoardState ] = GlobalState.useState<SudokuBoard>('board')

    return (
        <div className='sudoku_board'>
            {
                boardState.map( (boardRow, y) => 
                    boardRow.map( (cellValue, x) => 
                        <BoardCell x={ x } y={ y } key={ Math.random() } value={ cellValue }></BoardCell>))
            }
        </div>
    )
}
