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
 * Evaluate the board state for minimax algorithm
 * @param {Array} board - The current board state
 * @param {string} player - The player to evaluate for ('X' or 'O')
 * @returns {number} - Score for the given board state
 */
function evaluateBoard(board, depth) {
  const winResult = calculateWinner(board);

  if (winResult) {
    if (winResult.winner === "O") {
      return 10 - depth; // Computer wins (higher score for quicker wins)
    } else if (winResult.winner === "X") {
      return depth - 10; // Human wins (lower score)
    }
  }

  return 0; // Draw or ongoing game
}

/**
 * Minimax algorithm for perfect play
 * @param {Array} board - The current board state
 * @param {number} depth - Current depth in the game tree
 * @param {boolean} isMaximizing - Whether to maximize or minimize score
 * @param {number} alpha - Alpha value for alpha-beta pruning
 * @param {number} beta - Beta value for alpha-beta pruning
 * @returns {number} - Best score for the current position
 */
function minimax(
  board,
  depth,
  isMaximizing,
  alpha = -Infinity,
  beta = Infinity
) {
  // Base cases: terminal states
  const winResult = calculateWinner(board);
  if (winResult || depth === 0 || getAvailableMoves(board).length === 0) {
    return evaluateBoard(board, depth);
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of getAvailableMoves(board)) {
      const boardCopy = [...board];
      boardCopy[move] = "O";
      const score = minimax(boardCopy, depth - 1, false, alpha, beta);
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of getAvailableMoves(board)) {
      const boardCopy = [...board];
      boardCopy[move] = "X";
      const score = minimax(boardCopy, depth - 1, true, alpha, beta);
      bestScore = Math.min(bestScore, score);
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }
    return bestScore;
  }
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
    // 30% chance of making a random move
    if (Math.random() < 0.3) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

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

    // Random move from corners or edges with different probabilities
    const corners = [0, 2, 6, 8].filter((corner) =>
      availableMoves.includes(corner)
    );
    const edges = [1, 3, 5, 7].filter((edge) => availableMoves.includes(edge));

    if (corners.length > 0 && Math.random() < 0.7) {
      return corners[Math.floor(Math.random() * corners.length)];
    } else if (edges.length > 0) {
      return edges[Math.floor(Math.random() * edges.length)];
    }

    // If we get here, just pick a random available move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Hard: Use minimax algorithm for optimal play
  if (difficulty === "hard") {
    let bestScore = -Infinity;
    let bestMove = -1;

    // Calculate the maximum depth based on available moves
    // This ensures the algorithm is not too slow with many moves available
    const maxDepth = availableMoves.length > 6 ? 4 : 9;

    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = "O";
      const score = minimax(boardCopy, maxDepth, false);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
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
