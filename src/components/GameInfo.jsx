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
  boardSize = 3,
  onSetBoardSize,
}) {
  const statusClass = "status";

  return (
    <div className="game-info">
      <div className={statusClass}>{status}</div>

      <div className="game-controls">
        <div
          className="selectors-wrapper"
          style={{ display: "flex", gap: "20px", justifyContent: "center" }}
        >
          <div className="selector-container">
            <div className="selector-label">Board Size:</div>
            <div className="selector-options">
              <button
                className={boardSize === 3 ? "option active" : "option"}
                onClick={() => onSetBoardSize && onSetBoardSize(3)}
                disabled={!onSetBoardSize || boardSize === 3}
              >
                3x3
              </button>
              <button
                className={boardSize === 4 ? "option active" : "option"}
                onClick={() => onSetBoardSize && onSetBoardSize(4)}
                disabled={!onSetBoardSize || boardSize === 4}
              >
                4x4
              </button>
            </div>
          </div>

          <div className="selector-container">
            <div className="selector-label">Difficulty:</div>
            <div className="selector-options">
              <button
                className={difficulty === "easy" ? "option active" : "option"}
                onClick={() => onSetDifficulty("easy")}
              >
                Easy
              </button>
              <button
                className={difficulty === "medium" ? "option active" : "option"}
                onClick={() => onSetDifficulty("medium")}
              >
                Medium
              </button>
              <button
                className={difficulty === "hard" ? "option active" : "option"}
                onClick={() => onSetDifficulty("hard")}
              >
                Hard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameInfo;
