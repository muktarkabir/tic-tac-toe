const gameBoard = (function () {
  const board = [null, null, null, null, null, null, null, null, null];

  const placeMark = function (position, playerMark) {
    if (position > board.length - 1) {
      console.log("Out of Bounds!!!");
      return;
    }
    if (board[position] != null) {
      console.log("ILLEGAL MOVE!!");
      return;
    } else {
      board[position] = playerMark;
      controller.setPlayerTurn();
      console.log(board);
    }
    if (atLeastFiveCellsAreFilled()) {
      controller.checkWinner(playerMark);
    }
  };

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = null;
    }
    getBoard();
  };

  const getBoard = () => board;
  const isBoardFilledUp = () => board.filter((child) => child == null).length;
  const atLeastFiveCellsAreFilled = () =>
    board.filter((child) => child != null).length >= 5;

  return { placeMark, getBoard, resetBoard, isBoardFilledUp };
})();

function createPlayer(name, mark) {
  let isMyturn = true;
  const playAtPosition = (position) => {
    if (isMyturn) {
      gameBoard.placeMark(position, mark);
    } else {
      console.log("Its not your turn to play");
      return;
    }
  };

  const getMark = () => mark;
  const getName = () => name;
  const toggleTurn = () => (isMyturn = !isMyturn);

  return { playAtPosition, getMark, getName, toggleTurn };
}

function gameController(player1, player2) {
  player2.toggleTurn();
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
      const winningPlayersName =
        player1.getMark() == playersMark
          ? player1.getName()
          : player2.getName();

      console.log(`${playersMark}:${winningPlayersName} wins!!!.`);
      gameBoard.resetBoard();
    } else if (gameBoard.isBoardFilledUp() == 0) {
      console.log("Game ended in a tie");
      gameBoard.resetBoard();
    }
  };
  const setPlayerTurn = () => {
    player1.toggleTurn();
    player2.toggleTurn();
  };

  return { checkWinner, setPlayerTurn };
}

const player1 = createPlayer("John", "X");
const player2 = createPlayer("Jane", "O");

const controller = gameController(player1, player2);
