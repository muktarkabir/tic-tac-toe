const gameBoard = (function () {
  const board = [null, "X", "O", "O", "X", "X", "X", null, "O"];
  const positionNames = [
    "topLeft",
    "topCenter",
    "topRight",
    "centerLeft",
    "center",
    "centerRight",
    "bottomLeft",
    "bottomCenter",
    "bottomRight",
  ];

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
    getPositionsNames,
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
  //When board is empty. It's X's turn because X is first player
  if (board.filter((child) => child === null).length === board.length) {
    return "X";
  }
  //When both X and O have played exactly once, it is X's turn
  if (
    board.filter((child) => child == "O").length == 1 &&
    board.filter((child) => child == "X").length == 1
  ) {
    return "X";
  }
  //if X made more moves than O then it is O's turn
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
    console.log(
      `At position ${action}: ${gameBoard.getPositionsNames()[action]}`
    );
    result(action);
  }
};
//RESULT(s,a) => returns the state after action a taken in state s
const result = (action) => {
  let board = Array.from(gameBoard.getBoard());
  board[action] = playerTomakeMove();
  console.log(
    `${board[0]},${board[1]},${board[2]},\n${board[3]},${board[4]},${board[5]},\n${board[6]},${board[7]},${board[8]}`
  );
};
//TERMINAL(s) => checks if state s is a terminal state i.e a player wins or game ends in a tie
const checkWinner = (playersMark) => {
  board = gameBoard.getBoard();
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
    return true;
  } else {
    return false;
  }
};
const terminalState = () => {
  if (gameBoard.isBoardFilledUp()) {
    console.log("Game is over");
    return true;
  } else if (checkWinner("X")) {
    console.log("X wins");
    return true;
  } else if (checkWinner("O")) {
    console.log("O wins");
    return true;
  } else {
    return false;
  }
};
//UTILITY(s) => final numerical value for terminal state s

const gameUtility = () => {
  if (checkWinner("X")) {
    return 1;
  } else if (checkWinner("O")) {
    return -1;
  } else if (gameBoard.isBoardFilledUp()) {
    return 0;
  }
};
