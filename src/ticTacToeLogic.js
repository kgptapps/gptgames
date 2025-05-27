/**
 * TicTacToe Game Logic
 * This file contains the core game logic for the TicTacToe game
 */

/**
 * Generate all win lines for a given board size (n-in-a-row)
 * @param {number} size - Board size (e.g., 3 or 4)
 * @returns {Array} - Array of win line arrays
 */
function generateWinLines(size) {
  const lines = [];
  // Rows
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      row.push(r * size + c);
    }
    lines.push(row);
  }
  // Columns
  for (let c = 0; c < size; c++) {
    const col = [];
    for (let r = 0; r < size; r++) {
      col.push(r * size + c);
    }
    lines.push(col);
  }
  // Diagonal \
  const diag1 = [];
  for (let i = 0; i < size; i++) {
    diag1.push(i * size + i);
  }
  lines.push(diag1);
  // Diagonal /
  const diag2 = [];
  for (let i = 0; i < size; i++) {
    diag2.push(i * size + (size - 1 - i));
  }
  lines.push(diag2);
  return lines;
}

/**
 * Calculate if there's a winner on the board (supports 3x3 and 4x4)
 * @param {Array} squares - The current board state
 * @param {number} boardSize - Board size (default 3)
 * @returns {Object|null} - The winner and winning line, or null
 */
export function calculateWinner(squares, boardSize = 3) {
  const winLines = generateWinLines(boardSize);
  for (let i = 0; i < winLines.length; i++) {
    const line = winLines[i];
    const first = squares[line[0]];
    if (!first) continue;
    if (line.every((idx) => squares[idx] === first)) {
      return { winner: first, line };
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
function evaluateBoard(board, depth, boardSize = 3) {
  const winResult = calculateWinner(board, boardSize);

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
 * @param {number} boardSize - Board size (default 3)
 * @returns {number} - Best score for the current position
 */
function minimax(
  board,
  depth,
  isMaximizing,
  alpha = -Infinity,
  beta = Infinity,
  boardSize = 3
) {
  // Base cases: terminal states
  const winResult = calculateWinner(board, boardSize);
  if (winResult || depth === 0 || getAvailableMoves(board).length === 0) {
    return evaluateBoard(board, depth, boardSize);
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of getAvailableMoves(board)) {
      const boardCopy = [...board];
      boardCopy[move] = "O";
      const score = minimax(
        boardCopy,
        depth - 1,
        false,
        alpha,
        beta,
        boardSize
      );
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
      const score = minimax(boardCopy, depth - 1, true, alpha, beta, boardSize);
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
 * Get the best move for the computer based on difficulty and board size
 * @param {Array} board - The current board state
 * @param {string} difficulty - The difficulty level ('easy', 'medium', or 'hard')
 * @param {number} boardSize - Board size (default 3)
 * @returns {number} - The index of the best move
 */
export function getBestMove(board, difficulty, boardSize = 3) {
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
      const winResult = calculateWinner(boardCopy, boardSize);
      if (winResult && winResult.winner === "O") {
        return move;
      }
    }

    // Check if player can win in the next move and block
    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = "X";
      const winResult = calculateWinner(boardCopy, boardSize);
      if (winResult && winResult.winner === "X") {
        return move;
      }
    }

    // Take center if available (for 3x3 or 4x4)
    const center = Math.floor((boardSize * boardSize) / 2);
    if (availableMoves.includes(center)) {
      return center;
    }

    // Corners and edges for 3x3 only
    if (boardSize === 3) {
      const corners = [0, 2, 6, 8].filter((corner) =>
        availableMoves.includes(corner)
      );
      const edges = [1, 3, 5, 7].filter((edge) =>
        availableMoves.includes(edge)
      );

      if (corners.length > 0 && Math.random() < 0.7) {
        return corners[Math.floor(Math.random() * corners.length)];
      } else if (edges.length > 0) {
        return edges[Math.floor(Math.random() * edges.length)];
      }
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
      const score = minimax(
        boardCopy,
        maxDepth,
        false,
        -Infinity,
        Infinity,
        boardSize
      );

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
 * Make a computer move on the board (supports board size)
 * @param {Array} board - The current board state
 * @param {string} difficulty - The difficulty level
 * @param {number} boardSize - Board size (default 3)
 * @returns {Array} - The new board state after computer's move
 */
export function computerMove(board, difficulty, boardSize = 3) {
  const move = getBestMove(board, difficulty, boardSize);
  if (move === -1) return board;

  const newBoard = [...board];
  newBoard[move] = "O";
  return newBoard;
}

// Initial empty board (3x3 by default)
export const emptyBoard = Array(9).fill(null);
