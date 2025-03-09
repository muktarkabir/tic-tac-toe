const gameBoard = (function () {
  const board = [null, null, null, null, null, null, null, null, null];

  const insertToken = function (position, playerMark) {
    if (position > board.length - 1) {
      console.log("Out of Bounds!!!");
      return;
    }
    if (board[position] != null) {
      console.log("ILLEGAL MOVE!!");
      return;
    } else {
      board[position] = playerMark;
      gameController.checkWinner(playerMark);
      console.log(board);
    }
  };

  const getBoard = () => {
    return board;
  };

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = null;
    }
    getBoard();
  };

  return { insertToken, getBoard, resetBoard };
})();

function createPlayer(mark) {
  const playAtPosition = (position) => {
    gameBoard.insertToken(position, mark);
  };

  const getMark = () => {
    return mark;
  };

  return { playAtPosition, getMark };
}

const gameController = (function () {
  const board = gameBoard.getBoard();
  const checkWinner = (playersMark) => {
    if (
      (board[0] == playersMark &&
        board[1] == playersMark &&
        board[2] == playersMark) ||
      (board[3] == playersMark &&
        board[4] == playersMark &&
        board[5] == playersMark) ||
      (board[6] == playersMark &&
        board[7] == playersMark &&
        board[8] == playersMark) ||
      (board[0] == playersMark &&
        board[3] == playersMark &&
        board[6] == playersMark) ||
      (board[1] == playersMark &&
        board[4] == playersMark &&
        board[7] == playersMark) ||
      (board[2] == playersMark &&
        board[5] == playersMark &&
        board[8] == playersMark) ||
      (board[0] == playersMark &&
        board[4] == playersMark &&
        board[8] == playersMark) ||
      (board[2] == playersMark &&
        board[4] == playersMark &&
        board[6] == playersMark)
    ) {
      console.log(`Player with ${playersMark} wins!!!.`);
      gameBoard.resetBoard();
    }
  };

  return { checkWinner };
})();

const player1 = createPlayer("X");
const player2 = createPlayer("O");
