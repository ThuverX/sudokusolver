import GlobalState from "../GlobalState";
import { SudokuBoard, SudokuCell, SudokuResult } from "../Types/Sudoku";
import { Util } from "../Util";

export class SolverService {

    public static MAX_SOLVER_ITTERATIONS = 999

    // Fully solves a sudoku board
    public static Complete(state: SudokuBoard):  SudokuResult {
        let currentState: SudokuBoard = Util.Clone(state)
        let start = performance.now()
        let [solved, itteration_count] = SolverService.Solve(currentState)
        let end = performance.now()

        return {
            board: state,
            start,
            end,
            solved,
            itteration_count
        }
    }

    public static Solve(state: SudokuBoard): [boolean, number] {
        let lock_state = Util.Clone(state)
            .map((row, y) => row.map((value, x) => ({x, y, i: y * 9 + x, value})))
            .flat()
            .filter(cell => cell.value === 'empty')
            .sort((a, b) => a.i - b.i)

        let index = -1
        let itteration_count = 0

        let nextIndex = () => {
            index = lock_state.find(x => x.i > index)!.i
        }

        let isNextIndex = (): boolean => {
            return !!lock_state.find(x => x.i > index)
        }

        let previousIndex = () => {
            let clone = Util.Clone(lock_state)
            index = clone.reverse().find(x => x.i < index)!.i
        }

        let currentCell = (): [number, number, SudokuCell] => {
            let item = lock_state.find(x => x.i === index)!

            return [ item.x, item.y, SolverService.getCell(state, item.x, item.y) ]
        }

        let increaseCurrentIndex = (num: SudokuCell | null): number => {
            let currentNum = num || currentCell()[2]

            if(currentNum == 'empty') return 1
            if(currentNum >= 9) return 0

            return currentNum + 1
        }

        nextIndex()

        let prev_num = null
        let next_num: number = 1

        while(isNextIndex() && itteration_count < SolverService.MAX_SOLVER_ITTERATIONS) {
            itteration_count++
            
            next_num = increaseCurrentIndex(prev_num)

            if(next_num) {
                let [x, y] = currentCell()

                if(SolverService.IsCellValid(state, x, y, next_num)) {
                    SolverService.setCell(state, x, y, next_num)
                    prev_num = null
                    nextIndex()

                    console.log('NEXT')
                } else {
                    prev_num = next_num

                    console.log('REPEAT')
                }
            } else {
                let [x, y] = currentCell()
                
                SolverService.setCell(state, x, y, 'empty')
                prev_num = null

                previousIndex()

                console.log('BACK')
            }
        }

        let [x, y] = currentCell()

        let final_num = 0

        while(!SolverService.IsCellValid(state, x, y, final_num)){
            final_num++
        }

        SolverService.setCell(state, x, y, final_num)

        let is_done = Util.Clone(state)
            .flat()
            .filter(cell => cell === 'empty')
            .length == 0

        GlobalState.setState('board', state)
        
        return [is_done,itteration_count]
    }

    public static IsCellValid(state: SudokuBoard, x: number, y: number, num: SudokuCell): boolean {
        if(num === 'empty') return true

        let couldSolveRow = SolverService.testRow(state , y)
        let couldSolveCollumn = SolverService.testCollumn(state , x)
        let couldSolveQuadrant = SolverService.testQuadrant(state , x, y)

        if(couldSolveRow.includes(num) && 
            couldSolveCollumn.includes(num) && 
            couldSolveQuadrant.includes(num)) {
                return true
        }

        return false
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
        let quadX = Math.floor(Math.max(0, x) / 3) * 3
        let quadY = Math.floor(Math.max(0, y) / 3) * 3

        let fullSet = Util.Range(1, 9)
        let quadItems: Array<SudokuCell> = []
        
        for(let x = 0; x < 3; x++) {
            for(let y = 0; y < 3;y++) {
                quadItems.push(SolverService.getCell(state, quadX + x,quadY + y))
            }
        }

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