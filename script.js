const gameBoard = (function () {
  const board = [null, null, null, "O", null, null, null, null, "X"];
  const positionNames = ["topLeft","topCenter","topRight","centerLeft","center","centerRight","bottomLeft","bottomCenter","bottomRight"];

  const placeMark = function (position, playerMark) {
    if (position > board.length - 1 || position < 0) {
      console.log("Out of Bounds!!!");
      return;
    }
    if (board[position] != null) {
      console.log("ILLEGAL MOVE!!");
      return;
    } else {
      board[position] = playerMark;
      controller.setPlayerTurn();
      console.log(
        `${board[0]}, ${board[1]}, ${board[2]},\n${board[3]}, ${board[4]}, ${board[5]},\n ${board[6]}, ${board[7]}, ${board[8]}`
      );
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

  const getPositionsNames = () => positionNames;

  const getBoard = () => board;
  const isBoardFilledUp = () =>
    board.filter((child) => child == null).length == 0;
  const atLeastFiveCellsAreFilled = () =>
    board.filter((child) => child != null).length >= 5;

  const arrayOfFreeCells = () => {
    const freeCellspositions = new Array();
    let pos = -1;
    while ((pos = board.indexOf(null, pos + 1)) != -1) {
      freeCellspositions.push(pos);
    }
    return freeCellspositions;
  };

  return {
    placeMark,
    getBoard,
    resetBoard,
    isBoardFilledUp,
    arrayOfFreeCells,
    getPositionsNames
  };
})();

function createPlayer(name = "Human", mark = "X") {
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
  const getTurn = () => isMyturn;
  const toggleTurn = () => (isMyturn = !isMyturn);

  return { playAtPosition, getMark, getName, getTurn, toggleTurn };
}
function createRobot() {
  const name = "Robot";
  const mark = "O";
  let isMyturn = true;
  const playAtRandomPosition = () => {
    if (isMyturn) {
      gameBoard.placeMark(
        gameBoard.arrayOfFreeCells()[
          parseInt(Math.random() * gameBoard.arrayOfFreeCells().length - 1)
        ],
        mark
      );
    } else {
      console.log("Not your turn android!");
      return;
    }
  };

  const setOfActions = () => {
    return gameBoard.arrayOfFreeCells();
  };

  // const result = (board = gameBoard.getBoard(),position) => {
  //   let newState =
  // };
  const getMark = () => mark;
  const getName = () => name;
  const getTurn = () => isMyturn;
  const toggleTurn = () => (isMyturn = !isMyturn);

  return { playAtRandomPosition, getMark, getName, getTurn, toggleTurn };
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
    } else if (gameBoard.isBoardFilledUp()) {
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

const human = createPlayer();
const computer = createRobot();

const controller = gameController(computer, human);

//Initial state. Empty game board
//PLAYER(s) => returns which player to move in state s
const playerTomakeMove = (board = gameBoard.getBoard()) => {
  if (board.filter((child) => child === null).length === board.length) {
    return "X";
  }
  if (
    board.filter((child) => child == "O").length == 1 &&
    board.filter((child) => child == "X").length == 1
  ) {
    return "X";
  }
  if (
    board.filter((child) => child == "X").length >
    board.filter((child) => child == "O").length
  ) {
    return "O";
  } else if (
    board.filter((child) => child == "O").length >
    board.filter((child) => child == "X").length
  ) {
    return "X";
  }
};
//ACTIONS(s) => returns legal moves a player can make in state s
const actions = () => {
  let setOfActions = gameBoard.arrayOfFreeCells();
  let playerMark = playerTomakeMove();

  console.log(
    `Player ${playerMark} can make a move in ${setOfActions.length} possible positions.`
  );

  for (const action of setOfActions) {
    console.log(`At position ${action}: ${gameBoard.getPositionsNames()[action]}`);
  }
};
//RESULT(s,a) => returns the state after action a taken in state s
//TERMINAL(s) => checks if state s is a terminal state i.e a player wins or game ends in a tie
//UTILITY(s) => final numerical value for terminal state s
// playerTomakeMove();
