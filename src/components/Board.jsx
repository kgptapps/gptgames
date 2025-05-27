import React from "react";

/**
 * Board component for TicTacToe game
 * Handles rendering squares and the board UI with accessibility features
 */
function Board({ board, winLine, handleSquareClick, isThinking, winner }) {
  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe game board">
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row} role="row">
          {[0, 1, 2].map((col) => {
            const i = row * 3 + col;
            const isWinningSquare = winLine && winLine.includes(i);
            const value = board[i];

            // Determine appropriate CSS classes
            const squareClasses = [
              "square",
              value && value,
              isWinningSquare && "winning",
              isThinking && !value && "thinking",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={i}
                className={squareClasses}
                onClick={() => handleSquareClick(i)}
                disabled={Boolean(value) || Boolean(winner) || isThinking}
                aria-label={`Square ${row + 1},${col + 1}: ${value || "Empty"}`}
                aria-disabled={Boolean(value) || Boolean(winner) || isThinking}
              >
                {value}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default React.memo(Board);
