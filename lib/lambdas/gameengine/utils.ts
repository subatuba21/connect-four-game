import { boolean } from "zod";

export enum slotState {
  empty = 0,
  player1 = 1,
  player2 = 2,
}

export type Column = [
  slotState,
  slotState,
  slotState,
  slotState,
  slotState,
  slotState
];
export type Board = [Column, Column, Column, Column, Column, Column, Column];
export type BoardState = {
  board: Board;
  turn: slotState;
};

export const getEmptyState = (): BoardState => {
  const board: Board = [
    [
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
    ],
    [
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
    ],
    [
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
    ],
    [
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
    ],
    [
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
    ],
    [
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
    ],
    [
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
      slotState.empty,
    ],
  ];

  return {
    board,
    turn: slotState.player1,
  };
};

export const getNextBoardState = (
  boardState: BoardState,
  col: number,
): BoardState => {
  const board = structuredClone(boardState.board);
  const player = boardState.turn;
  if (player == slotState.empty) {
    throw new Error("Player not selected.");
  }

  if (col >= board.length || col < 0) {
    throw new Error("Column not in bounds.");
  }

  const selectedcol = board[col];
  let min: number = selectedcol.length;
  for (let index = selectedcol.length - 1; index >= 0; index--) {
    const element = selectedcol[index];
    if (element != slotState.empty) {
      break;
    } else {
      min = index;
    }
  }

  if (min == selectedcol.length) {
    throw new Error("Column is full.");
  }

  const newPlayer =
    player == slotState.player1 ? slotState.player2 : slotState.player1;

  selectedcol[min] = player;
  board[col] = selectedcol;
  return {
    board,
    turn: newPlayer,
  };
};

export const isGameFinished = (board: Board): slotState | false => {
  // check for columns
  let currentState = slotState.empty;
  let inarow = 0;
  for (const col of board) {
    for (let i = col.length - 1; i >= 0; i--) {
      const boardState = col[i];
      if (boardState == currentState) {
        inarow++;
      } else {
        currentState = boardState;
        inarow = 1;
      }

      if (inarow === 4) {
        return boardState;
      }

      if (boardState == slotState.empty) {
        break;
      }
    }
  }

  // check the rows
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < board.length; row++) {
      let currentState = slotState.empty;
      let inarow = 0;
      for (let index = 0; index < 4; index++) {
        const boardState = board[col + index][row];
        if (boardState == currentState) {
          inarow++;
        } else {
          currentState = boardState;
          inarow = 1;
        }

        if (inarow === 4) {
          return boardState;
        }

        if (boardState == slotState.empty) {
          break;
        }
      }
    }
  }

  // Check the top diagonals
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 3; row++) {
      const boardState = board[col][row];
      if (
        boardState !== slotState.empty &&
        boardState === board[col + 1][row + 1] &&
        boardState === board[col + 2][row + 2] &&
        boardState === board[col + 3][row + 3]
      ) {
        return boardState;
      }
    }
  }

  // Check the bottom diagonals
  for (let col = 0; col < 4; col++) {
    for (let row = 3; row < 6; row++) {
      const boardState = board[col][row];
      if (
        boardState !== slotState.empty &&
        boardState === board[col + 1][row - 1] &&
        boardState === board[col + 2][row - 2] &&
        boardState === board[col + 3][row - 3]
      ) {
        return boardState;
      }
    }
  }

  return false;
};
