import { ChangeEvent, useEffect, useRef, useState } from 'react'
import GlobalState from '../../GlobalState'
import { SolverService } from '../../Services/SolverService'
import { SudokuBoard, SudokuCell } from '../../Types/Sudoku'
import { Util } from '../../Util'
import './BoardCell.style.css'

export default function BoardCell({ value, x, y } : { x: number, y:number, value: SudokuCell }) {

    const SetValue = (event: ChangeEvent<HTMLInputElement>) => {
        let val = event.target.value as unknown as number
        val = Util.Clamp(val, 1, 9)

        let board = Util.Clone(GlobalState.getState<SudokuBoard>('board'))
        
        SolverService.setCell(board,x, y, val)

        GlobalState.setState('board', board)
    }

    return (
        <div className={'board_cell ' + (value == 'empty' ? '' : 'full')}>
            <input type="number" min="1" max="9" value={ value == 'empty' ? '' : value } onChange={ SetValue } />
        </div>
    )
}
