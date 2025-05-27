/**
 * TicTacToe Game Logic
 * This file contains the core game logic for the TicTacToe game
 */

// Win patterns
export const lines = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal \
  [2, 4, 6], // diagonal /
];

/**
 * Calculate if there's a winner on the board
 * @param {Array} squares - The current board state
 * @returns {Object|null} - The winner and winning line, or null
 */
export function calculateWinner(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

/**
 * Get all available moves on the board
 * @param {Array} board - The current board state
 * @returns {Array} - Array of available move indices
 */
export function getAvailableMoves(board) {
  return board
    .map((val, idx) => (val === null ? idx : null))
    .filter((v) => v !== null);
}

/**
 * Get the best move for the computer based on difficulty
 * @param {Array} board - The current board state
 * @param {string} difficulty - The difficulty level ('easy', 'medium', or 'hard')
 * @returns {number} - The index of the best move
 */
export function getBestMove(board, difficulty) {
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0) return -1;

  // Easy: Just make random moves
  if (difficulty === "easy") {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Medium: Mix of strategy and randomness
  if (difficulty === "medium") {
    // Check if computer can win in the next move
    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = "O";
      const winResult = calculateWinner(boardCopy);
      if (winResult && winResult.winner === "O") {
        return move;
      }
    }

    // Check if player can win in the next move and block
    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = "X";
      const winResult = calculateWinner(boardCopy);
      if (winResult && winResult.winner === "X") {
        return move;
      }
    }

    // Take center if available
    if (availableMoves.includes(4)) {
      return 4;
    }

    // Random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Hard: Prioritize winning moves and optimal strategy
  if (difficulty === "hard") {
    // Check if computer can win in the next move
    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = "O";
      const winResult = calculateWinner(boardCopy);
      if (winResult && winResult.winner === "O") {
        return move;
      }
    }

    // Check if player can win in the next move and block
    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = "X";
      const winResult = calculateWinner(boardCopy);
      if (winResult && winResult.winner === "X") {
        return move;
      }
    }

    // Take center if available
    if (availableMoves.includes(4)) {
      return 4;
    }

    // Take corners if available
    const corners = [0, 2, 6, 8].filter((corner) =>
      availableMoves.includes(corner)
    );
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // Take edges
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

/**
 * Make a computer move on the board
 * @param {Array} board - The current board state
 * @param {string} difficulty - The difficulty level
 * @returns {Array} - The new board state after computer's move
 */
export function computerMove(board, difficulty) {
  const move = getBestMove(board, difficulty);
  if (move === -1) return board;

  const newBoard = [...board];
  newBoard[move] = "O";
  return newBoard;
}

// Initial empty board
export const emptyBoard = Array(9).fill(null);
