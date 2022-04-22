//* elements
const allCells = document.querySelectorAll(".board-cell");
const board = document.querySelector(".board");
const snackbar = document.getElementById("snackbar");

//* constants
const X_PLAYER = "X";
const O_PLAYER = "O";
const INITIAL_BOARD = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

//* states
let player = X_PLAYER;
let gameBoard = INITIAL_BOARD;
let completed = false;
let win = false;

//* functions
function togglePlayer() {
  player = player === X_PLAYER ? O_PLAYER : X_PLAYER;
}

function isEmptyCell(target) {
  return !!!target.classList.contains("active");
}

function fillCell(target) {
  target.classList.add("active", player);
  const { row, col } = target.dataset;
  gameBoard[row][col] = player;
}

function isSamePlayer(arr) {
  return (
    arr.every((val) => val === X_PLAYER) || arr.every((val) => val === O_PLAYER)
  );
}

const getColumns = () => {
  const columns = [[], [], []];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      columns[i][j] = gameBoard[j][i];
    }
  }
  return columns;
};

const getDiameters = () => {
  const d1 = [gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]];
  const d2 = [gameBoard[0][2], gameBoard[1][1], gameBoard[2][0]];
  return [d1, d2];
};

function checkWin() {
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

function checkCompleted() {
  completed = gameBoard.flat().every((val) => val !== 0);
}

function resetGame() {
  allCells.forEach((cell) => (cell.className = "board-cell"));
  gameBoard = gameBoard.map((row) => [0, 0, 0]);
}

function notify(msg) {
  snackbar.innerHTML = msg;
  snackbar.classList.add("show");
  // After 3 seconds, remove the show class from DIV
  setTimeout(() => snackbar.classList.remove("show"), 3000);
}

function renderGameStatus() {
  const equal = !win && completed;
  // check status
  if (win) notify(`${player} win !`);
  else if (equal) notify("equal game !");
  if (win || equal) setTimeout(resetGame, 3000);
}

function handleCellClick({ target }) {
  if (isEmptyCell(target) && !win && !completed) {
    fillCell(target);
    checkCompleted();
    checkWin();
    renderGameStatus();
    togglePlayer();
  }
}

allCells.forEach((cell) => cell.addEventListener("click", handleCellClick));
