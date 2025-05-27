import { useState, useEffect, useCallback } from "react";
import {
  emptyBoard,
  calculateWinner,
  getAvailableMoves,
  computerMove,
} from "../ticTacToeLogic";

/**
 * Custom hook for managing TicTacToe game state
 * @param {Function} updateStats - Function to update game statistics
 * @param {number} boardSize - Size of the board (e.g., 3 for 3x3, 4 for 4x4)
 * @returns {Object} Game state and handler functions
 */
export default function useTicTacToeGame(updateStats, boardSize = 3) {
  // Game state
  const [board, setBoard] = useState(Array(boardSize * boardSize).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameHistory, setGameHistory] = useState({ x: 0, o: 0, draw: 0 });
  const [difficulty, setDifficulty] = useState("medium");
  const [isThinking, setIsThinking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [moveCount, setMoveCount] = useState(0);

  // Reset board when board size changes
  useEffect(() => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setXIsNext(true);
    setMoveCount(0);
  }, [boardSize]);

  // Calculate current game state
  const winResult = calculateWinner(board, boardSize);
  const winner = winResult ? winResult.winner : null;
  const winLine = winResult ? winResult.line : null;
  const isDraw = getAvailableMoves(board).length === 0 && !winner;

  // Handle player's move
  const handleSquareClick = useCallback(
    (i) => {
      if (board[i] || winner || isThinking) return;

      const newBoard = [...board];
      newBoard[i] = "X";
      setBoard(newBoard);
      setXIsNext(false);
      setMoveCount((prev) => prev + 1);
    },
    [board, winner, isThinking]
  );

  // Computer's move effect
  useEffect(() => {
    if (!xIsNext && !winner && getAvailableMoves(board).length > 0) {
      // Show "thinking" state
      setIsThinking(true);

      const timer = setTimeout(() => {
        setBoard((prevBoard) => computerMove(prevBoard, difficulty, boardSize));
        setXIsNext(true);
        setIsThinking(false);
        setMoveCount((prev) => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, board, winner, difficulty, boardSize]);

  // Update score when game ends
  useEffect(() => {
    if (winner) {
      setGameHistory((prev) => ({
        ...prev,
        [winner.toLowerCase()]: prev[winner.toLowerCase()] + 1,
      }));
    } else if (isDraw) {
      setGameHistory((prev) => ({
        ...prev,
        draw: prev.draw + 1,
      }));
    }
  }, [winner, isDraw]);

  // Call updateStats when the game ends (win or draw)
  useEffect(() => {
    if ((winner || isDraw) && !gameOver) {
      setGameOver(true);
      if (updateStats) {
        updateStats("tictactoe", {
          win: winner === "X",
          loss: winner === "O",
          draw: isDraw,
          moves: moveCount,
          gameTime: new Date().getTime(), // Record timestamp for this game
          lastMoveCount: moveCount, // Record the number of moves in this specific game
        });
      }
    }
    if (!winner && !isDraw && gameOver) {
      setGameOver(false);
    }
  }, [winner, isDraw, updateStats, gameOver, moveCount]);

  // Game restart handler
  const handleRestart = useCallback(() => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setXIsNext(true);
    setMoveCount(0);
  }, [boardSize]);

  // Difficulty change handler
  const handleSetDifficulty = useCallback(
    (level) => {
      setDifficulty(level);
      handleRestart();
    },
    [handleRestart]
  );

  // Generate status message
  let status;
  if (winner) {
    status = winner === "X" ? "You win!" : "Computer wins!";
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = isThinking ? "Computer is thinking..." : "Your turn";
  }

  // Return everything needed by the component
  return {
    board,
    xIsNext,
    winner,
    winLine,
    isDraw,
    isThinking,
    gameHistory,
    difficulty,
    moveCount,
    status,
    handleSquareClick,
    handleRestart,
    handleSetDifficulty,
  };
}
