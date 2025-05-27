import React from "react";

/**
 * GameInfo component for TicTacToe
 * Displays game status, score, and difficulty controls
 */
function GameInfo({
  status,
  gameHistory,
  difficulty,
  onSetDifficulty,
  moveCount = 0,
}) {
  const statusClass = status.includes("win")
    ? "status win"
    : status.includes("draw")
    ? "status draw"
    : status.includes("Computer wins")
    ? "status lose"
    : "status";

  return (
    <div className="game-info">
      <div className="score-board">
        <div className="score-item player">
          <span className="score-label">You (X)</span>
          <span className="score-value">{gameHistory.x}</span>
        </div>
        <div className="score-item draw">
          <span className="score-label">Draw</span>
          <span className="score-value">{gameHistory.draw}</span>
        </div>
        <div className="score-item computer">
          <span className="score-label">Computer (O)</span>
          <span className="score-value">{gameHistory.o}</span>
        </div>
      </div>

      <div className={statusClass}>{status}</div>

      <div className="move-counter">
        Moves: {moveCount}
        <span className="stat-hint">(See status bar for more stats)</span>
      </div>

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
