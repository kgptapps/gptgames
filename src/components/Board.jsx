import React from "react";

/**
 * Board component for TicTacToe game
 * Handles rendering squares and the board UI
 */
function Board({ board, winLine, handleSquareClick, isThinking, winner }) {
  /**
   * Renders a square on the board
   * @param {number} i - The index of the square
   * @returns {JSX.Element} - The rendered square
   */
  const renderSquare = (i) => {
    const isWinningSquare = winLine && winLine.includes(i);

    return (
      <button
        className={`square${board[i] ? " " + board[i] : ""}${
          isWinningSquare ? " winning" : ""
        }`}
        onClick={() => handleSquareClick(i)}
        disabled={Boolean(board[i]) || Boolean(winner) || isThinking}
      >
        {board[i]}
      </button>
    );
  };

  return (
    <div className="board">
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

export default Board;
