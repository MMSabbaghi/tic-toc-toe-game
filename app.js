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
let win = false;
let tie = false;
let score = {
  [X_PLAYER]: 0,
  [O_PLAYER]: 0,
  tie: 0,
};

//* functions
function getInitialBoard() {
  return [[], [], []].map((row) => [0, 0, 0]);
}

function togglePlayer() {
  player = player === X_PLAYER ? O_PLAYER : X_PLAYER;
}

function isEmptyCell(target) {
  return !!!target.classList.contains("active");
}

function fillCell(target) {
  target.classList.add("active", player);
  target.style.animation = "var(--cell-show-animation)";
  const { row, col } = target.dataset;
  gameBoard[row][col] = player;
}

function isSamePlayer(arr) {
  return (
    arr.every((val) => val === X_PLAYER) || arr.every((val) => val === O_PLAYER)
  );
}

function checkWin() {
  // get board columns
  const getColumns = () => {
    const columns = [[], [], []];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        columns[i][j] = gameBoard[j][i];
      }
    }
    return columns;
  };

  // get board diameters
  const getDiameters = () => {
    const d1 = [gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]];
    const d2 = [gameBoard[0][2], gameBoard[1][1], gameBoard[2][0]];
    return [d1, d2];
  };

  // board directions
  const columns = getColumns();
  const diameters = getDiameters();
  const rows = gameBoard;

  // check all columns, diameters and rows for winner
  [columns, diameters, rows].forEach((dir) => {
    dir.forEach((arr) => {
      if (isSamePlayer(arr)) win = true;
    });
    if (win) return;
  });
}

function checkTie() {
  tie = !win && gameBoard.flat().every((val) => val !== 0);
}

function restartGame() {
  allCells.forEach((cell) => {
    cell.classList.remove("active");
    cell.style.animation = "var(--cell-hide-animation)";
    setTimeout(() => cell.classList.remove(X_PLAYER, O_PLAYER), 90);
  });
  gameBoard = getInitialBoard();
  win = false;
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
  if (win) notify(`${player} win !`);
  else if (tie) notify("tie game !");
  if (win || tie) setTimeout(restartGame, 3500);
}

function playSoundByStatus() {
  let soundSrc = "";
  if (win) soundSrc = "./sounds/game-over.mp3";
  else if (tie) soundSrc = "./sounds/game-over-tie.mp3";
  else if (player === X_PLAYER) soundSrc = "./sounds/note-high.mp3";
  else soundSrc = "./sounds/note-low.mp3";
  setTimeout(() => new Audio(soundSrc).play(), 70);
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
