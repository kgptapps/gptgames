import React, { useState, useEffect } from "react";

const emptyBoard = Array(9).fill(null);

// Win patterns
const lines = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal \
  [2, 4, 6], // diagonal /
];

function calculateWinner(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

function getAvailableMoves(board) {
  return board
    .map((val, idx) => (val === null ? idx : null))
    .filter((v) => v !== null);
}

function getBestMove(board, difficulty) {
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0) return -1;

  // Easy: Just make random moves
  if (difficulty === "easy") {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Medium: Mix of strategy and randomness
  if (difficulty === "medium") {
    // Check if computer can win in the next move
    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = "O";
      const winResult = calculateWinner(boardCopy);
      if (winResult && winResult.winner === "O") {
        return move;
      }
    }

    // Check if player can win in the next move and block
    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = "X";
      const winResult = calculateWinner(boardCopy);
      if (winResult && winResult.winner === "X") {
        return move;
      }
    }

    // Take center if available
    if (availableMoves.includes(4)) {
      return 4;
    }

    // Random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Hard: Prioritize winning moves and optimal strategy
  if (difficulty === "hard") {
    // Check if computer can win in the next move
    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = "O";
      const winResult = calculateWinner(boardCopy);
      if (winResult && winResult.winner === "O") {
        return move;
      }
    }

    // Check if player can win in the next move and block
    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = "X";
      const winResult = calculateWinner(boardCopy);
      if (winResult && winResult.winner === "X") {
        return move;
      }
    }

    // Take center if available
    if (availableMoves.includes(4)) {
      return 4;
    }

    // Take corners if available
    const corners = [0, 2, 6, 8].filter((corner) =>
      availableMoves.includes(corner)
    );
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // Take edges
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function computerMove(board, difficulty) {
  const move = getBestMove(board, difficulty);
  if (move === -1) return board;

  const newBoard = [...board];
  newBoard[move] = "O";
  return newBoard;
}

export default function TicTacToe() {
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [gameHistory, setGameHistory] = useState({ x: 0, o: 0, draw: 0 });
  const [difficulty, setDifficulty] = useState("medium");
  const [isThinking, setIsThinking] = useState(false);

  const winResult = calculateWinner(board);
  const winner = winResult ? winResult.winner : null;
  const winLine = winResult ? winResult.line : null;

  const handleClick = (i) => {
    if (board[i] || winner || isThinking) return;

    const newBoard = [...board];
    newBoard[i] = "X";
    setBoard(newBoard);
    setXIsNext(false);
  };

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
    } else if (getAvailableMoves(board).length === 0 && !winner) {
      setGameHistory((prev) => ({
        ...prev,
        draw: prev.draw + 1,
      }));
    }
  }, [winner, board]);

  const handleRestart = () => {
    setBoard(emptyBoard);
    setXIsNext(true);
  };

  const handleSetDifficulty = (level) => {
    setDifficulty(level);
    handleRestart();
  };

  const renderSquare = (i) => {
    const isWinningSquare = winLine && winLine.includes(i);

    return (
      <button
        className={`square${board[i] ? " " + board[i] : ""}${
          isWinningSquare ? " winning" : ""
        }`}
        onClick={() => handleClick(i)}
        disabled={Boolean(board[i]) || Boolean(winner) || isThinking}
      >
        {board[i]}
      </button>
    );
  };

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
      <h1>Tic Tac Toe</h1>

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
            onClick={() => handleSetDifficulty("easy")}
          >
            Easy
          </button>
          <button
            className={difficulty === "medium" ? "active" : ""}
            onClick={() => handleSetDifficulty("medium")}
          >
            Medium
          </button>
          <button
            className={difficulty === "hard" ? "active" : ""}
            onClick={() => handleSetDifficulty("hard")}
          >
            Hard
          </button>
        </div>
      </div>

      <div className="board">
        {[0, 1, 2].map((row) => (
          <div className="board-row" key={row}>
            {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
          </div>
        ))}
      </div>

      <button className="restart" onClick={handleRestart}>
        New Game
      </button>
    </div>
  );
}
