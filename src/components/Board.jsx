import React from "react";

/**
 * Board component for TicTacToe game
 * Handles rendering squares and the board UI
 */
function Board({ board, winLine, handleSquareClick, isThinking, winner }) {
  return (
    <div className="board">
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map((col) => {
            const i = row * 3 + col;
            const isWinningSquare = winLine && winLine.includes(i);

            return (
              <button
                key={i}
                className={`square${board[i] ? " " + board[i] : ""}${
                  isWinningSquare ? " winning" : ""
                }`}
                onClick={() => handleSquareClick(i)}
                disabled={Boolean(board[i]) || Boolean(winner) || isThinking}
              >
                {board[i]}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Board;
