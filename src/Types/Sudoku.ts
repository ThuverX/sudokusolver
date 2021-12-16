export type SudokuCell = number | 'empty'
export type SudokuBoard = Array<Array<SudokuCell>>
export type SudokuResult = {
    board: SudokuBoard,
    start: number,
    end: number,
    solved: boolean,
    itteration_count: number
}