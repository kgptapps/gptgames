import React, { useState, useEffect } from "react";
import withGameStats from "./hooks/withGameStats";
import {
  emptyBoard,
  calculateWinner,
  getAvailableMoves,
  computerMove,
} from "./ticTacToeLogic";
import Board from "./components/Board";
import GameInfo from "./components/GameInfo";

/**
 * TicTacToe Game Component
 * The main component that manages game state and logic
 */
function TicTacToe({ updateStats }) {
  // Game state
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [gameHistory, setGameHistory] = useState({ x: 0, o: 0, draw: 0 });
  const [difficulty, setDifficulty] = useState("medium");
  const [isThinking, setIsThinking] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Calculate current game state
  const winResult = calculateWinner(board);
  const winner = winResult ? winResult.winner : null;
  const winLine = winResult ? winResult.line : null;
  const isDraw = getAvailableMoves(board).length === 0 && !winner;

  // Handle player's move
  const handleClick = (i) => {
    if (board[i] || winner || isThinking) return;

    const newBoard = [...board];
    newBoard[i] = "X";
    setBoard(newBoard);
    setXIsNext(false);
  };

  // Computer's move effect
  useEffect(() => {
    if (!xIsNext && !winner && getAvailableMoves(board).length > 0) {
      // Show "thinking" state
      setIsThinking(true);

      const timer = setTimeout(() => {
        setBoard((prevBoard) => computerMove(prevBoard, difficulty));
        setXIsNext(true);
        setIsThinking(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, board, winner, difficulty]);

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
        // For TicTacToe, we track wins (when player X wins), losses (when O wins),
        // and draws. We also implicitly track total games played.
        updateStats("tictactoe", {
          win: winner === "X",
          loss: winner === "O",
          draw: isDraw,
        });
      }
    }
    if (!winner && !isDraw && gameOver) {
      setGameOver(false);
    }
  }, [winner, isDraw, updateStats, gameOver]);

  // Game restart handler
  const handleRestart = () => {
    setBoard(emptyBoard);
    setXIsNext(true);
  };

  // Difficulty change handler
  const handleSetDifficulty = (level) => {
    setDifficulty(level);
    handleRestart();
  };

  // Generate status message
  let status;
  if (winner) {
    status = winner === "X" ? "You win!" : "Computer wins!";
  } else if (getAvailableMoves(board).length === 0) {
    status = "It's a draw!";
  } else {
    status = isThinking ? "Computer is thinking..." : "Your turn";
  }

  return (
    <div className="game-container">
      <GameInfo
        status={status}
        gameHistory={gameHistory}
        difficulty={difficulty}
        onSetDifficulty={handleSetDifficulty}
      />

      <Board
        board={board}
        winLine={winLine}
        handleSquareClick={handleClick}
        isThinking={isThinking}
        winner={winner}
      />

      <button className="restart" onClick={handleRestart}>
        New Game
      </button>
    </div>
  );
}

// Export the component wrapped with stats capabilities
export default withGameStats(TicTacToe, {
  gameKey: "tictactoe",
  supportedStats: ["wins", "losses", "draws", "played"],
  displayNames: {
    wins: "Wins",
    losses: "Losses",
    draws: "Draws",
    played: "Games Played",
  },
});
