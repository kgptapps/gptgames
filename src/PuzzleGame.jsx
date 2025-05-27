import React, { useState, useEffect, useRef } from "react";
import withGameStats from "./hooks/withGameStats";

const imageList = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
];

// Function to check if a puzzle is solvable
function isSolvable(board, size) {
  // For a puzzle to be solvable, the number of inversions must satisfy specific conditions

  // Convert null to 0 for counting inversions
  const boardWithZero = board.map((tile) => (tile === null ? 0 : tile));

  // Count inversions
  let inversions = 0;
  for (let i = 0; i < boardWithZero.length - 1; i++) {
    if (boardWithZero[i] === 0) continue;
    for (let j = i + 1; j < boardWithZero.length; j++) {
      if (boardWithZero[j] === 0) continue;
      if (boardWithZero[i] > boardWithZero[j]) {
        inversions++;
      }
    }
  }

  // Find row of blank (from bottom)
  const emptyIndex = board.indexOf(null);
  const emptyRow = Math.floor(emptyIndex / size);
  const rowFromBottom = size - 1 - emptyRow;

  console.log(
    `[PuzzleGame] Solvability check: inversions=${inversions}, rowFromBottom=${rowFromBottom}`
  );

  // For 3x3 puzzles (odd grid size):
  // The puzzle is solvable if the number of inversions is even
  if (size % 2 === 1) {
    const isSolv = inversions % 2 === 0;
    console.log(
      `[PuzzleGame] Odd grid (${size}x${size}): Solvable = ${isSolv}`
    );
    return isSolv;
  }

  // For even grid sizes (not used in this game but included for completeness):
  // If the blank is on an even row counting from the bottom,
  // then the puzzle is solvable if the number of inversions is odd.
  // If the blank is on an odd row counting from the bottom,
  // then the puzzle is solvable if the number of inversions is even.
  const isSolv =
    rowFromBottom % 2 === 0 ? inversions % 2 === 1 : inversions % 2 === 0;
  console.log(`[PuzzleGame] Even grid (${size}x${size}): Solvable = ${isSolv}`);
  return isSolv;
}

function shuffle(arr) {
  const targetDifficulty = 15; // Aim for puzzles with around 15 moves to solve
  let bestPuzzle = null;
  let bestPathLength = Infinity;
  let solvablePuzzles = 0;

  // Try up to 100 times to generate a good solvable puzzle
  for (let attempt = 0; attempt < 100; attempt++) {
    let a = arr.slice();
    // Perform many random swaps to thoroughly shuffle
    const swaps = Math.max(30, a.length * 5);

    for (let i = 0; i < swaps; i++) {
      const j = Math.floor(Math.random() * a.length);
      const k = Math.floor(Math.random() * a.length);
      if (j !== k) {
        [a[j], a[k]] = [a[k], a[j]];
      }
    }

    // Ensure not already solved
    if (a.every((v, i) => v === arr[i])) continue;

    // Check if the puzzle is solvable
    if (isSolvable(a, 3)) {
      solvablePuzzles++;

      // For some puzzles, compute the solution path length to find one with good difficulty
      if (solvablePuzzles % 5 === 0) {
        // Only check every 5th puzzle to avoid excessive computation
        const path = solvePuzzle(a, 3);
        const pathLength = path.length;

        console.log(
          `[PuzzleGame] Generated solvable puzzle #${solvablePuzzles} with difficulty: ${pathLength} moves`
        );

        // Keep track of the puzzle closest to our target difficulty
        if (
          Math.abs(pathLength - targetDifficulty) <
          Math.abs(bestPathLength - targetDifficulty)
        ) {
          bestPuzzle = a;
          bestPathLength = pathLength;
        }

        // If we found one with exactly our target difficulty, use it immediately
        if (pathLength === targetDifficulty) {
          console.log("[PuzzleGame] Found puzzle with perfect difficulty");
          return a;
        }
      } else {
        // For puzzles we don't compute difficulty, just save the first one as a backup
        if (!bestPuzzle) {
          bestPuzzle = a;
        }
      }

      // If we have a good enough puzzle already and have found several solvable ones, stop early
      if (bestPathLength <= targetDifficulty * 1.5 && solvablePuzzles >= 10) {
        console.log(
          `[PuzzleGame] Found good puzzle with difficulty: ${bestPathLength} moves`
        );
        return bestPuzzle;
      }
    }
  }

  // If we found any solvable puzzle, use the best one
  if (bestPuzzle) {
    console.log(
      `[PuzzleGame] Using best found puzzle with difficulty: ${bestPathLength} moves`
    );
    return bestPuzzle;
  }

  // If we couldn't generate a solvable puzzle after 100 attempts,
  // return a simple solvable state (just one move away from solution)
  console.log("[PuzzleGame] Using fallback solvable puzzle");
  let fallback = arr.slice();
  // Swap the last two non-empty tiles
  [fallback[7], fallback[8]] = [fallback[8], fallback[7]];
  return fallback;
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

// A* solver to find shortest path to solution - more efficient than BFS
function solvePuzzle(startBoard, size) {
  console.log("[PuzzleGame] Starting solver with board:", startBoard);
  console.log("[PuzzleGame] Is board initially solved?", isSolved(startBoard));

  // Check if the puzzle is already solved
  if (isSolved(startBoard)) {
    console.log("[PuzzleGame] Board is already solved!");
    return [];
  }

  // Check if the puzzle is actually solvable before attempting to solve
  if (!isSolvable(startBoard, size)) {
    console.log("[PuzzleGame] The board configuration is not solvable!");
    return [];
  }

  // Manhattan distance heuristic
  const manhattanDistance = (board) => {
    let distance = 0;
    for (let i = 0; i < board.length; i++) {
      if (board[i] !== null) {
        const currentPos = i;
        const targetPos = board[i] - 1; // Where this tile should be in solved state
        const currentRow = Math.floor(currentPos / size);
        const currentCol = currentPos % size;
        const targetRow = Math.floor(targetPos / size);
        const targetCol = targetPos % size;
        distance +=
          Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
      }
    }
    return distance;
  };

  // Priority queue implemented with array + sort
  const openSet = [
    {
      board: startBoard.slice(),
      cost: 0,
      heuristic: manhattanDistance(startBoard),
    },
  ];
  const visited = new Set();
  const parent = new Map();
  const gScore = new Map(); // Cost from start to current node

  const key = (b) => b.join(",");
  const startKey = key(startBoard);

  visited.add(startKey);
  parent.set(startKey, null);
  gScore.set(startKey, 0);

  let solution = null;
  let explored = 0;
  const MAX_EXPLORED = 50000; // Higher limit for A* which is more efficient

  while (openSet.length > 0 && explored < MAX_EXPLORED) {
    explored++;
    if (explored % 1000 === 0) {
      console.log(
        `[PuzzleGame] Explored ${explored} states, open set size: ${openSet.length}`
      );
    }

    // Sort by f = g + h and take the first (best) node
    openSet.sort((a, b) => a.cost + a.heuristic - (b.cost + b.heuristic));
    const { board } = openSet.shift();
    const boardKey = key(board);

    if (isSolved(board)) {
      solution = board;
      console.log(
        "[PuzzleGame] Found solution after exploring",
        explored,
        "states"
      );
      break;
    }

    const empty = board.indexOf(null);
    const moves = getPossibleMoves(board, size);
    const currentCost = gScore.get(boardKey);

    for (const move of moves) {
      const newBoard = board.slice();
      newBoard[empty] = newBoard[move];
      newBoard[move] = null;
      const newBoardKey = key(newBoard);

      // Cost is just the number of moves
      const tentativeGScore = currentCost + 1;

      // If we found a better path or haven't visited this state
      if (
        !gScore.has(newBoardKey) ||
        tentativeGScore < gScore.get(newBoardKey)
      ) {
        parent.set(newBoardKey, { prev: boardKey, move });
        gScore.set(newBoardKey, tentativeGScore);

        // Only add to open set if not already visited
        if (!visited.has(newBoardKey)) {
          visited.add(newBoardKey);
          openSet.push({
            board: newBoard,
            cost: tentativeGScore,
            heuristic: manhattanDistance(newBoard),
          });
        }
      }
    }
  }

  if (explored >= MAX_EXPLORED) {
    console.log("[PuzzleGame] Solver exceeded maximum states to explore");
    return [];
  }

  // Reconstruct path
  if (!solution) {
    console.log("[PuzzleGame] No solution found");
    return [];
  }

  let path = [];
  let k = key(solution);
  while (parent.get(k) && parent.get(k).prev) {
    path.unshift(parent.get(k).move);
    k = parent.get(k).prev;
  }

  console.log("[PuzzleGame] Solution path length:", path.length);
  console.log("[PuzzleGame] Solution path:", path);
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
  const previousTilesRef = useRef(tiles);

  useEffect(() => {
    if (won && updateStats) {
      updateStats("puzzle", { solved: true });
    }
  }, [won, updateStats]);

  // Reset solution path when tiles change (not from hint) or when puzzle is solved
  useEffect(() => {
    // Check if tiles array actually changed (not just reference)
    const tilesChanged = !tiles.every(
      (tile, idx) => tile === previousTilesRef.current[idx]
    );

    if (tilesChanged) {
      // Store the new tiles for future comparison
      previousTilesRef.current = tiles;

      // Only reset solution if not triggered by hint system
      // We can check this by comparing the tiles to what would result from following solution path
      const isFromHint =
        solutionRef.current.length > 0 && solutionPath.length > 0;

      if (!isFromHint || isSolved(tiles)) {
        console.log(
          "[PuzzleGame] Tiles changed independently, resetting solution path"
        );
        solutionRef.current = [];
        setSolutionPath([]);
      }
    }
  }, [tiles, solutionPath]);

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
    console.log("[PuzzleGame] Current tiles state:", tiles);

    // Check if the current state is already solved
    if (isSolved(tiles)) {
      console.log("[PuzzleGame] Puzzle is already solved!");
      solutionRef.current = [];
      setSolutionPath([]);
      return;
    }

    // Check solvability
    if (!isSolvable(tiles, size)) {
      console.log(
        "[PuzzleGame] Current puzzle state is not solvable! Regenerating a solvable state."
      );
      // Create a solvable state close to solution
      const newState = solved.slice();
      // Make a simple swap to create a solvable state that's one move from solution
      [newState[7], newState[8]] = [newState[8], newState[7]];
      setTiles(newState);
      setMoves(0);
      solutionRef.current = [];
      setSolutionPath([]);
      alert(
        "This puzzle was in an unsolvable state. A new, solvable puzzle has been generated."
      );
      return;
    }

    // Compute solution path if needed or if the path is empty
    if (!solutionRef.current.length) {
      console.log("[PuzzleGame] Computing solution path...");
      // Compute solution path
      const path = solvePuzzle(tiles, size);
      console.log("[PuzzleGame] Computed solution path:", path);

      if (!path.length) {
        console.log(
          "[PuzzleGame] No solution path found for a supposedly solvable puzzle. This shouldn't happen!"
        );
        // Try to recover by regenerating the puzzle
        handleRestart();
        return;
      }

      solutionRef.current = path;
      setSolutionPath(path);
    }

    if (solutionRef.current.length) {
      const nextMove = solutionRef.current[0];
      const empty = tiles.indexOf(null);
      console.log(
        "[PuzzleGame] Making move: Empty at",
        empty,
        "swapping with",
        nextMove
      );

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

      // Check if the puzzle is solved after the move
      if (isSolved(newTiles)) {
        console.log("[PuzzleGame] Puzzle is now solved!");
        setWon(true);
      }
    } else {
      // This should only happen if we've used all hints in the solution
      console.log("[PuzzleGame] No more moves in solution path.");

      // Try to recompute a path (in case we're still not at solution)
      if (!isSolved(tiles)) {
        console.log("[PuzzleGame] Recomputing solution path...");
        const path = solvePuzzle(tiles, size);
        if (path.length > 0) {
          console.log("[PuzzleGame] Found new solution path:", path);
          solutionRef.current = path;
          setSolutionPath(path);
          // Call handleHint again to execute the first move from the new path
          setTimeout(handleHint, 0);
        } else {
          console.log(
            "[PuzzleGame] No solution path found. Puzzle may be in an invalid state."
          );
        }
      }
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
