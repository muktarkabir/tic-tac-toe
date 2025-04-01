const gameBoard = (function () {
  const board = [null, "X", "O", "O", "X", null, "X", null, "O"];
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

  const playAtBestPositionAsMaximizer = () => {
    //check current state and see all actions that can be taken, i.e free cells and store them
    aiMethods.actions(gameBoard.getBoard());
  };

  const getMark = () => mark;
  const getName = () => name;
  const getTurn = () => isMyturn;
  const toggleTurn = () => (isMyturn = !isMyturn);

  return {
    playAtRandomPosition,
    getMark,
    getName,
    getTurn,
    toggleTurn,
    playAtBestPositionAsMaximizer,
  };
}

const aiMethods = (function () {
  //PLAYER(s) => returns which player to move in state s
  const playerTomakeMove = (board) => {
    let mark;
    //When board is empty. It's X's turn because X is first player
    if (board.filter((child) => child === null).length === board.length) {
      mark = "X";
    }
    //When both X and O have played exactly once, it is X's turn
    if (
      board.filter((child) => child == "O").length ==
      board.filter((child) => child == "X").length
    ) {
      mark = "X";
    }
    //if X made more moves than O then it is O's turn
    if (
      board.filter((child) => child == "X").length >
      board.filter((child) => child == "O").length
    ) {
      mark = "O";
    } else if (
      board.filter((child) => child == "O").length >
      board.filter((child) => child == "X").length
    ) {
      mark = "X";
    }

    return mark;
  };
  //ACTIONS(s) => returns legal moves a player can make in state s
  const actions = (board) => {
    let setOfActions = gameBoard.arrayOfFreeCells();
    let playerMark = playerTomakeMove(board);

    console.log(
      `Player ${playerMark} can make a move in ${setOfActions.length} possible positions.`
    );

    for (const action of setOfActions) {
      console.log(
        `At position ${action}: ${gameBoard.getPositionsNames()[action]}`
      );
      // result(action);
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
  const hasPlayerWon = (playersMark) => {
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
    } else if (hasPlayerWon("X")) {
      console.log("X wins");
      return true;
    } else if (hasPlayerWon("O")) {
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

  //max-value implementation. This function checks the current state of the game board and

  const maxValue = () => {
    if (terminalState()) {
      return gameUtility();
    }

    let value = -Infinity;

    for (const action of actions()) {
      value = Math.max(v, minValue(result(action)));
      return value;
    }
  };

  //min-value implementation

  const minValue = () => {
    if (terminalState()) {
      return gameUtility();
    }

    let value = Infinity;

    for (const action of actions()) {
      value = Math.min(v, maxValue(result(action)));
      return value;
    }
  };

  return {
    playerTomakeMove,
    actions,
    result,
    terminalState,
    gameUtility,
    minValue,
    maxValue,
  };
})();

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
      // gameBoard.resetBoard();
    } else if (gameBoard.isBoardFilledUp()) {
      console.log("Game ended in a tie");
      // gameBoard.resetBoard();
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
