import {
  slotState,
  BoardState,
  getNextBoardState,
  getEmptyState,
} from "./utils"; // Replace 'your-module' with the actual module name or file path

describe("getNextBoardState", () => {
  let initialState: BoardState;

  beforeEach(() => {
    initialState = getEmptyState();
  });

  it("should return the next state with player 1 in the selected column", () => {
    const col = 2;
    const nextState = getNextBoardState(initialState, col);
    expect(nextState.board[col][0]).toBe(slotState.player1);
    expect(nextState.turn).toBe(slotState.player2);
  });

  // Additional tests can be added to cover other scenarios and edge cases
});
