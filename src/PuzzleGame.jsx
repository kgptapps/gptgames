import React, { useState, useEffect, useRef } from "react";
import withGameStats from "./hooks/withGameStats";

const imageList = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
];

function shuffle(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Ensure not already solved
  if (a.every((v, i) => v === i)) return shuffle(a);
  return a;
}

// Helper to check if board is solved
function isSolved(board) {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[board.length - 1] === null;
}

// Helper to get possible moves
function getPossibleMoves(board, size) {
  const empty = board.indexOf(null);
  const row = Math.floor(empty / size);
  const col = empty % size;
  const moves = [];
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  for (const [dr, dc] of directions) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
      moves.push(nr * size + nc);
    }
  }
  return moves;
}

// BFS solver to find shortest path to solution
function solvePuzzle(startBoard, size) {
  const queue = [];
  const visited = new Set();
  const parent = new Map();
  const key = (b) => b.join(",");
  queue.push(startBoard.slice());
  visited.add(key(startBoard));
  parent.set(key(startBoard), null);
  let solution = null;
  while (queue.length > 0) {
    const board = queue.shift();
    if (isSolved(board)) {
      solution = board;
      break;
    }
    const empty = board.indexOf(null);
    for (const move of getPossibleMoves(board, size)) {
      const newBoard = board.slice();
      newBoard[empty] = newBoard[move];
      newBoard[move] = null;
      const k = key(newBoard);
      if (!visited.has(k)) {
        visited.add(k);
        parent.set(k, { prev: key(board), move });
        queue.push(newBoard);
      }
    }
  }
  // Reconstruct path
  if (!solution) return [];
  let path = [];
  let k = key(solution);
  while (parent.get(k) && parent.get(k).prev) {
    path.unshift(parent.get(k).move);
    k = parent.get(k).prev;
  }
  return path;
}

function PuzzleGame({ updateStats }) {
  const size = 3;
  const total = size * size;
  // Use 1..8, null for solved state
  const solved = Array.from({ length: total - 1 }, (_, i) => i + 1).concat([
    null,
  ]);
  const [imageIdx, setImageIdx] = useState(() =>
    Math.floor(Math.random() * imageList.length)
  );
  // Shuffle using new solved array
  const [tiles, setTiles] = useState(() => shuffle(solved));
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [customImage, setCustomImage] = useState(null);
  const [randomImage, setRandomImage] = useState(null);
  const [solutionPath, setSolutionPath] = useState([]);
  const solutionRef = useRef([]);

  useEffect(() => {
    if (won && updateStats) {
      updateStats("puzzle", { solved: true });
    }
  }, [won, updateStats]);

  useEffect(() => {
    if (isSolved(tiles)) {
      solutionRef.current = [];
      setSolutionPath([]);
    }
  }, [tiles]);

  function canMove(idx) {
    const empty = tiles.indexOf(null);
    const row = Math.floor(idx / size);
    const col = idx % size;
    const emptyRow = Math.floor(empty / size);
    const emptyCol = empty % size;
    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
  }

  function handleTileClick(idx) {
    if (won || !canMove(idx)) return;
    const empty = tiles.indexOf(null);
    const newTiles = tiles.slice();
    [newTiles[idx], newTiles[empty]] = [newTiles[empty], newTiles[idx]];
    setTiles(newTiles);
    setMoves((m) => m + 1);
    if (isSolved(newTiles)) setWon(true);
  }

  function handleRestart() {
    setTiles(shuffle(solved));
    setMoves(0);
    setWon(false);
    solutionRef.current = [];
    setSolutionPath([]);
  }

  function handleNewImage() {
    let nextIdx = imageIdx;
    while (nextIdx === imageIdx && imageList.length > 1) {
      nextIdx = Math.floor(Math.random() * imageList.length);
    }
    setImageIdx(nextIdx);
    setCustomImage(null);
    setRandomImage(null);
    setTiles(shuffle(solved));
    setMoves(0);
    setWon(false);
    solutionRef.current = [];
    setSolutionPath([]);
  }

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCustomImage(ev.target.result);
      setRandomImage(null);
      setTiles(shuffle(solved));
      setMoves(0);
      setWon(false);
      solutionRef.current = [];
      setSolutionPath([]);
    };
    reader.readAsDataURL(file);
  }

  async function handleRandomImage() {
    // Use Lorem Picsum for a random image
    const url = `https://picsum.photos/400?random=${Date.now()}`;
    setRandomImage(url);
    setCustomImage(null);
    setTiles(shuffle(solved));
    setMoves(0);
    setWon(false);
    solutionRef.current = [];
    setSolutionPath([]);
  }

  function handleHint() {
    // No need to convert, tiles already use null for empty
    if (!solutionRef.current.length) {
      // Compute solution path
      const path = solvePuzzle(tiles, size);
      console.log("[PuzzleGame] Computed solution path:", path);
      solutionRef.current = path;
      setSolutionPath(path);
    }
    if (solutionRef.current.length) {
      const nextMove = solutionRef.current[0];
      const empty = tiles.indexOf(null);
      const newTiles = tiles.slice();
      [newTiles[empty], newTiles[nextMove]] = [
        newTiles[nextMove],
        newTiles[empty],
      ];
      setTiles(newTiles);
      setMoves((m) => m + 1);
      solutionRef.current = solutionRef.current.slice(1);
      setSolutionPath(solutionRef.current);
      console.log("[PuzzleGame] Tiles after move:", newTiles);
      console.log("[PuzzleGame] Remaining solution path:", solutionRef.current);
    } else {
      console.log("[PuzzleGame] No solution path found or already solved.");
    }
  }

  return (
    <div className="puzzle-game-container">
      <h2>Image Puzzle</h2>
      <p>Rearrange the tiles to recreate the image!</p>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <button className="restart" onClick={handleNewImage}>
          Next Built-in Image
        </button>
        <button className="restart" onClick={handleRandomImage}>
          Random Internet Image
        </button>
        <label className="restart" style={{ cursor: "pointer", margin: 0 }}>
          Upload Image
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
        </label>
      </div>
      <div className="puzzle-controls">
        <button onClick={handleHint}>Hint</button>
      </div>
      <div className="puzzle-board">
        {tiles.map((tile, idx) => (
          <button
            key={idx}
            className={`puzzle-tile${tile === null ? " empty" : ""}`}
            onClick={() => handleTileClick(idx)}
            style={
              tile !== null
                ? {
                    backgroundImage: `url(${
                      customImage || randomImage || imageList[imageIdx]
                    })`,
                    backgroundSize: `${size * 100}% ${size * 100}%`,
                    backgroundPosition: `${
                      (((tile - 1) % size) * 100) / (size - 1)
                    }% ${(Math.floor((tile - 1) / size) * 100) / (size - 1)}%`,
                  }
                : {}
            }
            aria-label={tile === null ? "empty" : `tile ${tile}`}
          >
            {tile !== null ? "" : ""}
          </button>
        ))}
      </div>
      <div className="puzzle-info">
        <span>Moves: {moves}</span>
        {won && <span className="puzzle-win">🎉 You solved it!</span>}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button className="restart" onClick={handleRestart}>
          Shuffle
        </button>
      </div>
    </div>
  );
}

export default withGameStats(PuzzleGame, {
  gameKey: "puzzle",
  supportedStats: ["solved", "played"],
  displayNames: {
    solved: "Solved",
    played: "Games Played",
  },
});
