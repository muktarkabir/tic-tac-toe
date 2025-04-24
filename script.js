const gameBoard = (function () {
  const board = Array(9).fill(null);
  const positionNames = ["topLeft","topCenter","topRight","centerLeft","center","centerRight","bottomLeft","bottomCenter","bottomRight"];

  const placeMark = function (position, playerMark) {
    board[position] = playerMark;
    domManipulations.placeMark(position, playerMark);
    controller.setPlayerTurn();

    if (atLeastFiveCellsAreFilled()) {
      controller.checkWinner(playerMark);
    }
  };

  const resetBoard = () => {
    board.fill(null);
  };

  const getPositionsNames = () => positionNames;

  const getBoard = () => board;
  const isFilledUp = () => board.filter((child) => child == null).length == 0;

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

  const gameBoardIsEmpty = () =>
    board.filter((child) => child == null).length == board.length;

  const satisfiesWinningConditions = (state, playersMark) => {
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

  return {
    placeMark,
    getBoard,
    resetBoard,
    isFilledUp,
    arrayOfFreeCells,
    getPositionsNames,
    gameBoardIsEmpty,
    satisfiesWinningConditions,
  };
})();

function createHumanPlayer(name, mark = "O") {
  let isMyturn = true;
  let score = 0;
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
  const increaseScore = () => score++;
  const getScore = () => score;
  const resetScore = () => (score = 0);
  const isAi = () => false;

  return {
    playAtPosition,
    getMark,
    getName,
    getTurn,
    toggleTurn,
    increaseScore,
    getScore,
    resetScore,
    isAi,
  };
}
function createRobot() {
  const name = "Robot";
  const mark = "X";
  let isMyturn = true;
  let score = 0;
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

  const playAtBestPosition = (state) => {
    if (isMyturn) {
      if (gameBoard.gameBoardIsEmpty()) {
        //manually playing the first move for performance issues
        gameBoard.placeMark(0, mark);
      } else {
        let bestAction =
          aiMethods.actions(state)[
            getIndexOfBestValue(aiMethods.maxValue(state, true))
          ];
        gameBoard.placeMark(bestAction, mark);
      }
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
  const increaseScore = () => score++;
  const getScore = () => score;
  const resetScore = () => (score = 0);
  const isAi = () => true;

  return {
    playAtRandomPosition,
    getMark,
    getName,
    getTurn,
    toggleTurn,
    playAtBestPosition,
    getIndexOfBestValue,
    increaseScore,
    getScore,
    resetScore,
    isAi,
  };
}

const aiMethods = (function () {
  //PLAYER(s) => returns which player to move in state s
  const playerTomakeMove = (state) => {
    let mark;
    //When board is empty. It's X's turn because X is first player
    if (state.filter((child) => child == null).length == state.length) {
      mark = "X";
    }
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

    return freeCellspositions;
  };
  //RESULT(s,a) => returns the state after action a taken in state s
  const result = (state, action) => {
    let newState = Array.from(state);
    newState[action] = playerTomakeMove(state);

    return newState;
  };
  //TERMINAL(s) => checks if state s is a terminal state i.e a player wins or game ends in a tie
  const hasPlayerWon = (state, playersMark) =>
    gameBoard.satisfiesWinningConditions(state, playersMark);
  const isFilledUp = (state) =>
    state.filter((child) => child == null).length == 0;

  const terminalState = (state) => {
    if (
      state.filter((child) => child == null).length == 0 &&
      !hasPlayerWon(state, "X") &&
      !hasPlayerWon(state, "O")
    ) {
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

  const maxValue = (state, returnArray = false) => {
    if (terminalState(state)) {
      return gameUtility(state);
    }
    let value = -Infinity;
    let values = [];
    for (const action of actions(state)) {
      value = Math.max(value, minValue(result(state, action)));
      values.push(value);
    }

    return returnArray ? values : value;
  };

  //min-value implementation

  const minValue = (state) => {
    if (terminalState(state)) {
      return gameUtility(state);
    }

    let value = Infinity;
    // let values = [];
    for (const action of actions(state)) {
      value = Math.min(value, maxValue(result(state, action)));
      // values.push(value);
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

function gameController(player1, player2, numberOfGamesToPlay) {
  let numberOfDraws = 0;
  let numberOfGames = numberOfGamesToPlay;
  player2.toggleTurn();
  const board = gameBoard.getBoard();
  const checkWinner = (playersMark) => {
    if (gameBoard.satisfiesWinningConditions(board, playersMark)) {
      increaseScoreForWinner(playersMark);
      numberOfGames--;
      if (numberOfGames == 0) annouceWinner();
      domManipulations.toggleGame();
      domManipulations.toggleButtonStates();
    } else if (gameBoard.isFilledUp()) {
      console.log("Game ended in a tie");
      domManipulations.showRoundWinner(`This round ended in a draw.`);
      numberOfDraws++;
      numberOfGames--;
      domManipulations.updateDrawCount(numberOfDraws);
      domManipulations.toggleGame();
      domManipulations.toggleButtonStates();
      if (numberOfGames == 0) annouceWinner();
    }
  };

  const annouceWinner = () => {
    let announcement;
    let xScore = `${player1.getMark()} Player's Score: ${player1.getScore()}`;
    let oScore = `${player2.getMark()} Player's Score: ${player2.getScore()}`;
    let draws = `${numberOfDraws} draw(s).`;
    if (player1.getScore() > player2.getScore()) {
      announcement = `The winner is ${player1.getMark()} player: ${player1.getName()}`;
    } else if (player2.getScore() > player1.getScore()) {
      announcement = `The winner is ${player2.getMark()} player: ${player2.getName()}`;
    } else {
      announcement = "Game Ended in a Draw!!";
    }

    domManipulations.announceWinner({
      winner: announcement,
      xPlayerScore: xScore,
      oPlayerScore: oScore,
      drawScore: draws,
    });
  };
  const setPlayerTurn = () => {
    player1.toggleTurn();
    player2.toggleTurn();
  };
  const getNumberOfDraws = () => numberOfDraws;

  const increaseScoreForWinner = (playersMark) => {
    let winningPlayersName;
    if (player1.getMark() == playersMark) {
      winningPlayersName = player1.getName();
      player1.increaseScore();
      domManipulations.updateXplayerScore(player1.getScore());
    } else {
      winningPlayersName = player2.getName();
      player2.increaseScore();
      domManipulations.updateOplayerScore(player2.getScore());
    }
    domManipulations.showRoundWinner(
      `${playersMark} player: ${winningPlayersName} wins this round!!!.`
    );
  };

  return { checkWinner, setPlayerTurn, getNumberOfDraws };
}

const domManipulations = (function () {
  let gameOn = false;
  let nextRoundButtonOn = false;
  let xPlayer, oPlayer, numberOfGamesToPlay;
  const gameContainer = document.querySelector(".game");
  const scoreBoard = gameContainer.querySelector(".score-board");
  const xPlayerScore = scoreBoard.querySelector(".x-player-score h1");
  const drawCount = scoreBoard.querySelector(".draw-count h1");
  const oPlayerScore = scoreBoard.querySelector(".o-player-score h1");

  const liveInfoSection = gameContainer.querySelector(".live-info");
  const currentPlayerMark = liveInfoSection.querySelector("span");
  const roundWinner = liveInfoSection.querySelector(".round-winner");
  const aiThoughts = liveInfoSection.querySelector(".ai-thoughts");

  const boardUi = gameContainer.querySelector(".game-board");

  const controls = gameContainer.querySelector(".controls");
  const clearButton = controls.querySelector(".clear");
  const nextRoundButton = controls.querySelector(".next-round");


  const startButton = controls.querySelector(".start");

  const dialogs = document.querySelector(".versus-dialog");
  const humanGameForm = dialogs.querySelector(".vs-human form");
  const xPlayerName = humanGameForm.querySelector("#x-player-name");
  const oPlayerName = humanGameForm.querySelector("#o-player-name");
  const humanNumberOfGames = humanGameForm.querySelector("p");
  const humanStartGameButton = humanGameForm.querySelector("button.start-game");

  const aiGameForm = dialogs.querySelector(".vs-ai form");
  const playerName = aiGameForm.querySelector("#player-name");
  const aiNumberOfGames = aiGameForm.querySelector("p");
  const aiStartGameButton = aiGameForm.querySelector("button.start-game");
  const dialog = document.querySelector("dialog");
  const closeButton = dialog.querySelector("button");

  const announceWinner = ({
    winner,
    xPlayerScore,
    oPlayerScore,
    drawScore,
  }) => {
    dialog.querySelector(".final-scores h1").textContent = winner;
    const infoDiv = dialog.querySelector(".final-scores div").childNodes;
    infoDiv[0].textContent = xPlayerScore;
    infoDiv[1].textContent = oPlayerScore;
    infoDiv[2].textContent = drawScore;
    dialog.show();
  };
  const addCells = (() => {
    for (let i = 0; i < gameBoard.getBoard().length; i++) {
      let newCell = document.createElement("div");
      newCell.dataset.index = i;
      newCell.classList.add("cell");
      newCell.innerText = "";
      boardUi.appendChild(newCell);
    }
  })();

  const setAiThoughts = (thoughts) => {
    aiThoughts.textContent = thoughts;
    setTimeout(() => {
      aiThoughts.textContent = "";
    }, 1000);
  };

  function moveGame({ offScreen }) {
    const window = document.querySelector(".window");
    offScreen
      ? (window.style.transform = `translateX(${-100}%)`)
      : (window.style.transform = `translateX(${0}%)`);
  }

  const hideStartButtonAndShowLiveInfoSection = (show) => {
    if (show) {
      startButton.style.display = "block";
      liveInfoSection.style.display = "none";
    } else {
      startButton.style.display = "none";
      liveInfoSection.style.display = "block";
    }
  };

  const toggleButtonStates = () => {
    nextRoundButton.classList.toggle("inactive");
    clearButton.classList.toggle("inactive");
  };

  const placeMark = (position, mark) =>
    (boardUi.childNodes[position].innerText = mark);
  const updateXplayerScore = (newScore) => (xPlayerScore.innerText = newScore);
  const updateOplayerScore = (newScore) => (oPlayerScore.innerText = newScore);
  const updateDrawCount = (newScore) => (drawCount.innerText = newScore);
  const showRoundWinner = (message) => {
    roundWinner.textContent = "";
    roundWinner.textContent = message;
    setTimeout(() => {
      roundWinner.textContent = "";
    }, 3000);
  };
  const updateCurrentPlayerMark = () => {
    currentPlayerMark.innerText = xPlayer.getTurn()
      ? xPlayer.getMark()
      : oPlayer.getMark();
  };
  const resetBoard = () => {
    boardUi.childNodes.forEach((element) => {
      element.innerText = "";
    });
  };

  const toggleGame = () => {
    gameOn = !gameOn;
    nextRoundButtonOn = !nextRoundButtonOn;
  };

  startButton.addEventListener("click", () => moveGame({ offScreen: true }));

  clearButton.addEventListener("click", () => {
    if (gameOn && !clearButton.classList.contains("inactive")) {
      resetBoard();
      gameBoard.resetBoard();
      controller.setPlayerTurn();
      updateCurrentPlayerMark();
      if (xPlayer.isAi()) {
        xPlayer.playAtBestPosition(gameBoard.getBoard());
        updateCurrentPlayerMark();
      }
    }
  });

  nextRoundButton.addEventListener("click", () => {
    if (!gameOn && nextRoundButtonOn) {
      resetBoard();
      gameBoard.resetBoard();
      toggleGame();
      toggleButtonStates();
      if (xPlayer.isAi()) {
        controller.setPlayerTurn();
        xPlayer.playAtBestPosition(gameBoard.getBoard());
        updateCurrentPlayerMark();
      }
    }
  });

  humanStartGameButton.addEventListener("click", (e) => {
    if (xPlayerName.value && oPlayerName.value) {
      e.preventDefault();
      moveGame({ offScreen: false });
      hideStartButtonAndShowLiveInfoSection();
    clearButton.classList.toggle("inactive");
      xPlayer = createHumanPlayer(xPlayerName.value, "X");
      oPlayer = createHumanPlayer(oPlayerName.value, "O");
      numberOfGamesToPlay = parseInt(humanNumberOfGames.innerText);
      controller = gameController(xPlayer, oPlayer, numberOfGamesToPlay);
      gameOn = true;
    }
  });

  aiStartGameButton.addEventListener("click", (e) => {
    if (playerName.value) {
      e.preventDefault();
      moveGame({ offScreen: false });
      hideStartButtonAndShowLiveInfoSection();
    clearButton.classList.toggle("inactive");

      xPlayer = createRobot();
      oPlayer = createHumanPlayer(oPlayerName.value, "O");
      numberOfGamesToPlay = parseInt(aiNumberOfGames.innerText);
      controller = gameController(xPlayer, oPlayer, numberOfGamesToPlay);
      gameOn = true;
      xPlayer.playAtBestPosition(gameBoard.getBoard());
    }
  });

  boardUi.addEventListener("click", (e) => {
    if (gameOn) {
      if (e.target.matches(".cell") && e.target.innerText == "") {
        if (xPlayer.getTurn()) {
          xPlayer.playAtPosition(
            parseInt(e.target.dataset.index),
            xPlayer.getMark()
          );
        } else if (oPlayer.getTurn()) {
          oPlayer.playAtPosition(
            parseInt(e.target.dataset.index),
            oPlayer.getMark()
          );
          if (xPlayer.isAi()) {
            setAiThoughts("Thinking...");
            gameOn = false;
            setTimeout(() => {
              xPlayer.playAtBestPosition(gameBoard.getBoard());
            }, 60);
            updateCurrentPlayerMark();
            gameOn = true;
          }
        }
        updateCurrentPlayerMark();
      }
    }
  });

  closeButton.addEventListener("click", () => {
    hideStartButtonAndShowLiveInfoSection(true);
    dialog.close();
    gameBoard.resetBoard();
    resetBoard();
    nextRoundButton.classList.toggle("inactive");

    controller = null;
    gameOn = false;
    nextRoundButtonOn = false;
    xPlayerScore.textContent = "0";
    oPlayerScore.textContent = "0";
    drawCount.textContent = "0";
  });
  return {
    placeMark,
    updateDrawCount,
    updateXplayerScore,
    updateOplayerScore,
    showRoundWinner,
    resetBoard,
    toggleButtonStates,
    toggleGame,
    setAiThoughts,
    announceWinner,
  };
})();

let controller = null;
