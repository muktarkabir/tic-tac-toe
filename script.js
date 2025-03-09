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
      controller.checkWinner(playerMark);
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

function createPlayer(name, mark) {
  const playAtPosition = (position) => {
    gameBoard.insertToken(position, mark);
  };

  const getMark = () => {
    return mark;
  };
  const getName = () => {
    return name;
  };

  return { playAtPosition, getMark, getName };
}

function gameController(player1, player2) {
  const board = gameBoard.getBoard();

    let boardIsFilledUp = board.every((child) => child !== null);
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

      console.log(`${winningPlayersName} ${playersMark} wins!!!.`);
      gameBoard.resetBoard();
    } else if (boardIsFilledUp) {
      console.log("Game ended in a tie");
      gameBoard.resetBoard();
    }
  };

  return { checkWinner };
}

const player1 = createPlayer("John", "X");
const player2 = createPlayer("Jane", "O");

const controller = gameController(player1, player2);
