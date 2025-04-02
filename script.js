const gameBoard = (function () {
  const board = [null, "X", "O", "O", null, null, "X", null, null];
  // const board = [null,null,null,null,null,null,null,null,null];
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

function createPlayer(name = "Human", mark = "O") {
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
  const mark = "X";
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

  const playAtBestPositionAsMaximizer = (state) => {
    if (isMyturn) {
      //check current state and see all actions that can be taken, i.e free cells and store them
      console.log("Calculating best play...");
      console.log(
        `The best position to play is ${
          aiMethods.actions(state)[
            getIndexOfBestValue(aiMethods.maxValue(state))
          ]
        }: ${
          gameBoard.getPositionsNames()[
            getIndexOfBestValue(aiMethods.maxValue(state))
          ]
        } `
      );
      let bestAction =
        aiMethods.actions(state)[
          getIndexOfBestValue(aiMethods.maxValue(state))
        ];
      gameBoard.placeMark(bestAction, mark);
    } else {
      console.log("Not your turn android!");
      return;
    }
  };

  const getIndexOfBestValue = (array) => {
    let indexOfBestOption = 0;
    for (let element = 1; element < array.length; element++) {
      if (array[element] > array[indexOfBestOption]) {
        indexOfBestOption = element;
      }
    }
    return indexOfBestOption;
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
    getIndexOfBestValue,
  };
}

const aiMethods = (function () {
  //PLAYER(s) => returns which player to move in state s
  const playerTomakeMove = (state) => {
    // console.log("Current State", state);

    let mark;
    //When board is empty. It's X's turn because X is first player
    if (state.filter((child) => child == null).length == state.length) {
      mark = "X";
    }
    //When both X and O have equal number of plays, following the logic of X being the first player it is X's turn to play
    if (
      state.filter((child) => child == "O").length ==
      state.filter((child) => child == "X").length
    ) {
      mark = "X";
    }
    //if X made more moves than O then it is O's turn
    if (
      state.filter((child) => child == "X").length >
      state.filter((child) => child == "O").length
    ) {
      mark = "O";
    } else if (
      state.filter((child) => child == "O").length >
      state.filter((child) => child == "X").length
    ) {
      mark = "X";
    }

    return mark;
  };
  //ACTIONS(s) => returns legal moves a player can make in state s
  const actions = (state) => {
    let playerMark = playerTomakeMove(state);
    const freeCellspositions = new Array();
    let pos = -1;
    while ((pos = state.indexOf(null, pos + 1)) != -1) {
      freeCellspositions.push(pos);
    }

    console.log(
      `Player ${playerMark} can make a move in ${freeCellspositions.length} possible positions.`
    );

    for (const position of freeCellspositions) {
      console.log(
        `At position ${position}: ${gameBoard.getPositionsNames()[position]}`
      );
      // result(state,position);
    }
    return freeCellspositions;
  };
  //RESULT(s,a) => returns the state after action a taken in state s
  const result = (state, action) => {
    let newState = Array.from(state);
    newState[action] = playerTomakeMove(state);
    console.log(
      `${newState[0]},${newState[1]},${newState[2]},\n${newState[3]},${newState[4]},${newState[5]},\n${newState[6]},${newState[7]},${newState[8]}`
    );
    return newState;
  };
  //TERMINAL(s) => checks if state s is a terminal state i.e a player wins or game ends in a tie
  const hasPlayerWon = (state, playersMark) => {
    if (
      (state[0] == playersMark &&
        state[1] == playersMark &&
        state[2] == playersMark) ||
      (state[3] == playersMark &&
        state[4] == playersMark &&
        state[5] == playersMark) ||
      (state[6] == playersMark &&
        state[7] == playersMark &&
        state[8] == playersMark) ||
      (state[0] == playersMark &&
        state[3] == playersMark &&
        state[6] == playersMark) ||
      (state[1] == playersMark &&
        state[4] == playersMark &&
        state[7] == playersMark) ||
      (state[2] == playersMark &&
        state[5] == playersMark &&
        state[8] == playersMark) ||
      (state[0] == playersMark &&
        state[4] == playersMark &&
        state[8] == playersMark) ||
      (state[2] == playersMark &&
        state[4] == playersMark &&
        state[6] == playersMark)
    ) {
      return true;
    } else {
      return false;
    }
  };
  const isFilledUp = (state) =>
    state.filter((child) => child == null).length == 0;

  const terminalState = (state) => {
    // console.log("Current State", state);

    if ((state.filter((child) => child == null).length == 0)&& !hasPlayerWon(state,"X") && !hasPlayerWon(state,"O")) {
      console.log("Game is over");
      return true;
    } else if (hasPlayerWon(state, "X")) {
      console.log("X wins");
      return true;
    } else if (hasPlayerWon(state, "O")) {
      console.log("O wins");
      return true;
    } else {
      return false;
    }
  };
  //UTILITY(s) => final numerical value for terminal state s

  const gameUtility = (state) => {
    if (hasPlayerWon(state, "X")) {
      return 1;
    } else if (hasPlayerWon(state, "O")) {
      return -1;
    } else if (isFilledUp(state)) {
      return 0;
    }
  };

  //This function checks the current state of the board and returns the best move the player can make in the situation.

  const maxValue = (state) => {
    if (terminalState(state)) {
      return gameUtility(state);
    }
    let value = -Infinity;
    let values = [];
    for (const action of actions(state)) {
      value = Math.max(value, minValue(result(state, action)));
      console.log(value);
      
      values.push(value);
      console.log(
        `The value of this board when played at ${action} is ${value}`
      );
    }
    // console.log(actions(state));
    console.log(values);

    return values;
  };

  //min-value implementation

  const minValue = (state) => {
    if (terminalState(state)) {
      return gameUtility(state);
    }

    let value = Infinity;
    let values = [];
    for (const action of actions(state)) {
      value = Math.min(value, maxValue(result(state, action)));
      values.push(value);
    }
    return value;
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
