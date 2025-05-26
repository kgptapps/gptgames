import React, { useState } from "react";

const emptyBoard = Array(9).fill(null);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getAvailableMoves(board) {
  return board
    .map((val, idx) => (val === null ? idx : null))
    .filter((v) => v !== null);
}

function computerMove(board) {
  const moves = getAvailableMoves(board);
  if (moves.length === 0) return board;
  // Simple AI: random move
  const move = moves[Math.floor(Math.random() * moves.length)];
  const newBoard = [...board];
  newBoard[move] = "O";
  return newBoard;
}

export default function TicTacToe() {
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = "X";
    setBoard(newBoard);
    setXIsNext(false);
  };

  React.useEffect(() => {
    if (!xIsNext && !winner && getAvailableMoves(board).length > 0) {
      const timer = setTimeout(() => {
        setBoard((prevBoard) => computerMove(prevBoard));
        setXIsNext(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, board, winner]);

  const handleRestart = () => {
    setBoard(emptyBoard);
    setXIsNext(true);
  };

  const renderSquare = (i) => (
    <button
      className={`square${board[i] ? " " + board[i] : ""}`}
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </button>
  );

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (getAvailableMoves(board).length === 0) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? "X (You)" : "O (Computer)"}`;
  }

  return (
    <div className="game-container">
      <h1>Tic Tac Toe</h1>
      <div className="status">{status}</div>
      <div className="board">
        {[0, 1, 2].map((row) => (
          <div className="board-row" key={row}>
            {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
          </div>
        ))}
      </div>
      <button className="restart" onClick={handleRestart}>
        Restart
      </button>
    </div>
  );
}
