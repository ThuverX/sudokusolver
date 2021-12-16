import GlobalState from "../GlobalState";
import { SudokuBoard, SudokuCell, SudokuResult } from "../Types/Sudoku";
import { Util } from "../Util";

export class SolverService {

    public static MAX_SOLVER_ITTERATIONS = 999

    // Fully solves a sudoku board
    public static Complete(state: SudokuBoard):  SudokuResult {
        let currentState: SudokuBoard | boolean = Util.Clone(state)
        let previousState: SudokuBoard | boolean = currentState
        let itterationCount: number = 0
        let start = performance.now()
        let solved = false

        while(currentState && itterationCount < SolverService.MAX_SOLVER_ITTERATIONS) {
            itterationCount++
            previousState = Util.Clone(currentState)
            currentState = SolverService.Solve(currentState as SudokuBoard)
        }

        if(currentState === false) solved = true

        let end = performance.now()

        GlobalState.setState('board', previousState)

        return {
            board: state,
            start,
            end,
            solved,
            itteration_count: itterationCount
        }
    }

    // Solves one itteration of the board
    public static Solve(state: SudokuBoard): SudokuBoard | boolean {
        let checked = false

        for(let x = 0; x < 9; x++) {
            for(let y = 0; y < 9; y++) {
                if(SolverService.getCell(state, x,y) === 'empty') {
                    checked = true
                    let fullSet = Util.Range(1, 9)

                    let couldSolveRow = SolverService.testRow(state , y)
                    let couldSolveCollumn = SolverService.testCollumn(state , x)
                    let couldSolveQuadrant = SolverService.testQuadrant(state , x, y)
            
                    let couldSolveCell = fullSet.filter((num) => 
                    (
                        couldSolveRow.includes(num) &&
                        couldSolveCollumn.includes(num) &&
                        couldSolveQuadrant.includes(num)
                    )) 
            
                    if(couldSolveCell.length === 1) {
                        // console.log(((x + 1) + "x " + (y + 1) + "y"), couldSolveCell[0])
                            
                        // for(let i = 0; i < 9; i++) {
                        //     SolverService.setCell(state, x,i, 300)
                        // }

                        // for(let i = 0; i < 9; i++) {
                        //     SolverService.setCell(state, i,y, 200)
                        // }

                        // let quadX = Math.floor(Math.max(0, x - 1) / 3) * 3
                        // let quadY = Math.floor(Math.max(0, y - 1) / 3) * 3
                        // for(let x = 0; x < 3; x++) {
                        //     for(let y = 0; y < 3;y++) {
                        //         SolverService.setCell(state, quadX + x,quadY + y, 400)
                        //     }
                        // }

                        // console.log(couldSolveRow, couldSolveCollumn, couldSolveQuadrant)

                        SolverService.setCell(state, x,y, couldSolveCell[0])

                        return state
                    }
                }
            }
        }
 
        return checked ? state : false
    }

    public static ApplyTestingConfiguration(): void {
        // let state: SudokuBoard = [
        //     ['empty', 'empty', 'empty', 8, 'empty', 'empty', 'empty', 'empty', 9],
        //     ['empty', 1, 9, 'empty', 'empty', 5, 8, 3, 'empty'],
        //     ['empty', 4, 3, 'empty', 1, 'empty', 'empty','empty',7],
        //     [4,'empty','empty',1,5,'empty','empty','empty',3],
        //     ['empty','empty',2,7,'empty',4,'empty',1,'empty'],
        //     ['empty',8,'empty','empty',9,'empty',6,'empty','empty'],
        //     ['empty',7,'empty','empty','empty',6,3,'empty','empty'],
        //     ['empty',3,'empty','empty',7,'empty','empty',8,'empty'],
        //     [9,'empty',4,5,'empty','empty','empty','empty',1]
        // ]

        let state: SudokuBoard = [
            ['empty','empty',3,2,'empty',6,'empty',1,9],
            [2,6,'empty','empty',8,9,7,5,'empty'],
            [7,4,'empty',1,'empty','empty','empty','empty',8],
            ['empty',1,'empty',5,'empty','empty',3,'empty','empty'],
            ['empty','empty',4,'empty',2,8,'empty',9,1],
            [3,5,'empty',7,'empty','empty',8,'empty',6],
            [1,2,'empty','empty',4,3,'empty','empty','empty'],
            ['empty','empty','empty','empty','empty','empty',9,2,5],
            [8,'empty',7,6,'empty',2,'empty','empty',4]
        ]

        // console.log(this.testQuadrant(state, 1, 8))

        GlobalState.setState('board', state)
    }

    public static testRow(state: SudokuBoard, rowNum: number): Array<number> {
        let row = state[rowNum]
        let fullSet = Util.Range(1, 9)

        let output = fullSet.filter((num) => !row.includes(num))

        return output
    }

    public static testCollumn(state: SudokuBoard, colNum: number): Array<number> {
        let col = state.map(row => row[colNum]).flat()
        let fullSet = Util.Range(1, 9)

        let output = fullSet.filter((num) => !col.includes(num))

        return output
    }

    public static testQuadrant(state: SudokuBoard, x: number, y: number): Array<number> {
        let quadX = Math.floor(Math.max(0, x - 1) / 3) * 3
        let quadY = Math.floor(Math.max(0, y - 1) / 3) * 3

        let fullSet = Util.Range(1, 9)
        let quadItems = state
            .filter((_, i) => i > quadX && i <= quadX + 3)
            .map(row => row.filter((_, j) => j > quadY && j <= quadY + 3))
            .flat()

        // console.log(quadX, quadY, quadItems)

        let output = fullSet.filter((num) => !quadItems.includes(num))

        return output
    }

    public static getCell(state: SudokuBoard, x: number, y: number): SudokuCell {
        return state[y][x]
    }

    public static setCell(state: SudokuBoard, x: number, y: number, value: SudokuCell) {
        state[y][x] = value
    }
}