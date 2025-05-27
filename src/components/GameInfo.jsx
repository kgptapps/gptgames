import React from "react";

/**
 * GameInfo component for TicTacToe
 * Displays game status, score, and difficulty controls
 */
function GameInfo({ status, gameHistory, difficulty, onSetDifficulty }) {
  return (
    <div className="game-info">
      <div className="score-board">
        <div>You (X): {gameHistory.x}</div>
        <div>Draw: {gameHistory.draw}</div>
        <div>Computer (O): {gameHistory.o}</div>
      </div>

      <div className="status">{status}</div>

      <div className="difficulty-selector">
        <span>Difficulty:</span>
        <button
          className={difficulty === "easy" ? "active" : ""}
          onClick={() => onSetDifficulty("easy")}
        >
          Easy
        </button>
        <button
          className={difficulty === "medium" ? "active" : ""}
          onClick={() => onSetDifficulty("medium")}
        >
          Medium
        </button>
        <button
          className={difficulty === "hard" ? "active" : ""}
          onClick={() => onSetDifficulty("hard")}
        >
          Hard
        </button>
      </div>
    </div>
  );
}

export default GameInfo;
