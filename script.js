const board = Array(9).fill(null);
let currentPlayer = "X";
let gameActive = true;

const gameBoard = document.getElementById("game-board");
const statusDiv = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");

function renderBoard() {
    gameBoard.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        if (board[i]) {
            cell.textContent = board[i];
            cell.classList.add(board[i].toLowerCase());
            cell.classList.add("disabled"); // Cells are disabled after being played
        }
        cell.addEventListener("click", handleCellClick);
        gameBoard.appendChild(cell);
    }
}

function handleCellClick(e) {
    const idx = e.target.dataset.index;
    if (!gameActive || board[idx]) return; // Do nothing if game is over or cell is taken

    board[idx] = currentPlayer;
    renderBoard(); // Re-render the board to update the clicked cell

    const winnerInfo = checkWinner();
    if (winnerInfo) {
        statusDiv.textContent = `Player ${currentPlayer} wins! 🎉`;
        gameActive = false;
        disableAllCells(); // Disable all cells after win
        drawWinningLine(winnerInfo.line, winnerInfo.type); // Draw and animate winning line
    } else if (board.every(cell => cell !== null)) { // Check for draw if no winner
        statusDiv.textContent = "It's a draw! 🤝";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDiv.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkWinner() {
    const wins = [
        [0,1,2, 'row-0'], [3,4,5, 'row-1'], [6,7,8, 'row-2'], // Rows
        [0,3,6, 'col-0'], [1,4,7, 'col-1'], [2,5,8, 'col-2'], // Columns
        [0,4,8, 'diag-0'], [2,4,6, 'diag-1']                  // Diagonals
    ];

    for (const combo of wins) {
        const [a, b, c, type] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { line: [a, b, c], type: type };
        }
    }
    return null;
}

function disableAllCells() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.classList.add("disabled");
    });
}

function drawWinningLine(winningCells, type) {
    const lineElement = document.createElement('div');
    lineElement.classList.add('winning-line', type);

    // Set custom CSS property for diagonal line rotation if needed
    if (type === 'diag-0') {
        lineElement.style.setProperty('--line-angle', '45deg');
    } else if (type === 'diag-1') {
        lineElement.style.setProperty('--line-angle', '-45deg');
    }

    gameBoard.appendChild(lineElement);
}

function restartGame() {
    for (let i = 0; i < 9; i++) board[i] = null; // Clear the board
    currentPlayer = "X";
    gameActive = true;
    statusDiv.textContent = `Player ${currentPlayer}'s turn`;
    renderBoard(); // Re-render to clear all cells
    // Remove any existing winning lines
    const existingLine = gameBoard.querySelector('.winning-line');
    if (existingLine) {
        existingLine.remove();
    }
}

restartBtn.addEventListener("click", restartGame);

// Initial render when the page loads
restartGame();
