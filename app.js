//* elements
const allCells = document.querySelectorAll(".board-cell");
const board = document.querySelector(".board");
const snackbar = document.getElementById("snackbar");
const xScore = document.getElementById("x-score");
const oScore = document.getElementById("o-score");
const tieScore = document.getElementById("tie-score");

//* constants
const X_PLAYER = "X";
const O_PLAYER = "O";

//* states
let player = X_PLAYER;
let gameBoard = getInitialBoard();
let win = null;
let tie = false;
let score = {
  [X_PLAYER]: 0,
  [O_PLAYER]: 0,
  tie: 0,
};

//* functions
function getInitialBoard() {
  return [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
}

function togglePlayer() {
  player = player === X_PLAYER ? O_PLAYER : X_PLAYER;
}

function isEmptyCell(target) {
  const { row, col } = target.dataset;
  return gameBoard[row][col] === 0;
}

function fillCell(target) {
  target.classList.add(player);
  target.style.animation = "var(--cell-show-animation)";
  const { row, col } = target.dataset;
  gameBoard[row][col] = player;
}

function isSamePlayer(arr) {
  return arr.every((val) => val === player);
}

function checkWin() {
  // check every row and column
  for (let i = 0; i < 3; i++) {
    const col = [];
    const row = [];
    for (let j = 0; j < 3; j++) {
      col[j] = gameBoard[j][i];
      row[j] = gameBoard[i][j];
    }
    if (isSamePlayer(row)) win = `win-row row-${i}`;
    else if (isSamePlayer(col)) win = `win-col col-${i}`;
    if (win) return;
  }

  // check diameter 1
  const d0 = [gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]];
  if (isSamePlayer(d0)) {
    win = "win-d0";
    return;
  }

  // check diameter 2
  const d1 = [gameBoard[0][2], gameBoard[1][1], gameBoard[2][0]];
  if (isSamePlayer(d1)) {
    win = "win-d1";
    return;
  }
}

function checkTie() {
  tie = !win && gameBoard.flat().every((val) => val !== 0);
}

function restartGame() {
  allCells.forEach((cell) => {
    cell.style.animation = "var(--cell-hide-animation)";
    setTimeout(() => cell.classList.remove(X_PLAYER, O_PLAYER), 90);
  });
  board.className = "board";
  gameBoard = getInitialBoard();
  win = null;
  tie = false;
}

function notify(msg) {
  setTimeout(() => {
    snackbar.innerHTML = msg;
    snackbar.classList.add("show");
    setTimeout(() => snackbar.classList.remove("show"), 2900);
  }, 200);
}

function updateScore() {
  const renderScore = () => {
    xScore.innerText = score[X_PLAYER];
    oScore.innerText = score[O_PLAYER];
    tieScore.innerText = score.tie;
  };

  if (win) {
    score[player] += 1;
    renderScore();
  } else if (tie) {
    score.tie += 1;
    renderScore();
  }
}

function renderGameStatus() {
  if (win) {
    board.className = `board ${win}`;
    notify(`${player} win !`);
  } else if (tie) notify("tie game !");
  if (win || tie) setTimeout(restartGame, 3500);
}

function playSoundByStatus() {
  let soundSrc = "";
  if (win) soundSrc = "./sounds/game-over.mp3";
  else if (tie) soundSrc = "./sounds/game-over-tie.mp3";
  else if (player === X_PLAYER) soundSrc = "./sounds/note-high.mp3";
  else soundSrc = "./sounds/note-low.mp3";
  new Audio(soundSrc).play();
}

function handleCellClick({ target }) {
  if (isEmptyCell(target) && !win && !tie) {
    fillCell(target);
    checkWin();
    checkTie();
    playSoundByStatus();
    renderGameStatus();
    updateScore();
    togglePlayer();
  }
}

allCells.forEach((cell) => cell.addEventListener("click", handleCellClick));
