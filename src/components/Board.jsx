import React from "react";

/**
 * Board component for TicTacToe game
 * Handles rendering squares and the board UI with accessibility features
 */
function Board({
  board,
  winLine,
  handleSquareClick,
  isThinking,
  winner,
  boardSize = 3,
}) {
  // Add a class for 4x4 grid
  const boardClass = `board${boardSize === 4 ? " size-4" : ""}`;

  // Create a grid with appropriate rows
  const rows = Array.from({ length: boardSize });
  const cols = Array.from({ length: boardSize });

  return (
    <div
      className={boardClass}
      role="grid"
      style={{
        gridTemplateColumns: `repeat(${boardSize}, ${
          boardSize === 4 ? "72px" : "var(--ttt-square-size)"
        })`,
        gridTemplateRows: `repeat(${boardSize}, ${
          boardSize === 4 ? "72px" : "var(--ttt-square-size)"
        })`,
        display: "grid",
        gap: boardSize === 4 ? "30px" : "var(--ttt-gap)",
        width: "fit-content",
        margin: "0 auto",
        padding: boardSize === 4 ? "10px" : "0",
        backgroundColor:
          boardSize === 4 ? "rgba(79, 140, 255, 0.03)" : "transparent",
        borderRadius: boardSize === 4 ? "12px" : "0",
      }}
      aria-label="Tic Tac Toe game board"
    >
      {rows.map((_, rowIndex) =>
        cols.map((_, colIndex) => {
          const i = rowIndex * boardSize + colIndex;
          const isWinningSquare = winLine && winLine.includes(i);
          const value = board[i];
          const squareClasses = [
            "square",
            value && value,
            isWinningSquare && "winning",
            isThinking && !value && "thinking",
          ]
            .filter(Boolean)
            .join(" ");

          const buttonStyle =
            boardSize === 4
              ? {
                  width: "72px",
                  height: "72px",
                  fontSize: "32px",
                  borderRadius: "10px",
                }
              : {};

          return (
            <button
              key={i}
              className={squareClasses}
              style={buttonStyle}
              onClick={() => handleSquareClick(i)}
              disabled={Boolean(value) || Boolean(winner) || isThinking}
              aria-label={`Square ${rowIndex + 1},${colIndex + 1}: ${
                value || "Empty"
              }`}
              aria-disabled={Boolean(value) || Boolean(winner) || isThinking}
            >
              {value}
            </button>
          );
        })
      )}
    </div>
  );
}

export default React.memo(Board);
