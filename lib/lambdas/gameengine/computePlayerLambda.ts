import { BoardState, slotState } from "./utils"

export const handler = () => {

}

const evalFuncs = {
    
}

const minimax = (boardState: BoardState, evalFunc: Function) : BoardState => {
    if (boardState.turn == slotState.player2) {
        throw new Error('Not the computers turn.');
    }

}

const alphabeta = (boardState: BoardState, evalFunc: Function) : BoardState => {
    if (boardState.turn == slotState.player2) {
        throw new Error('Not the computers turn.');
    }

}