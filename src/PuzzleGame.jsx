import React, { useState } from "react";

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

export default function PuzzleGame() {
  const size = 3;
  const total = size * size;
  const solved = Array.from({ length: total }, (_, i) => i);
  const [imageIdx, setImageIdx] = useState(() =>
    Math.floor(Math.random() * imageList.length)
  );
  const [tiles, setTiles] = useState(() => shuffle(solved));
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  function canMove(idx) {
    const empty = tiles.indexOf(total - 1);
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
    const empty = tiles.indexOf(total - 1);
    const newTiles = tiles.slice();
    [newTiles[idx], newTiles[empty]] = [newTiles[empty], newTiles[idx]];
    setTiles(newTiles);
    setMoves((m) => m + 1);
    if (newTiles.every((v, i) => v === i)) setWon(true);
  }

  function handleRestart() {
    setTiles(shuffle(solved));
    setMoves(0);
    setWon(false);
  }

  function handleNewImage() {
    let nextIdx = imageIdx;
    while (nextIdx === imageIdx && imageList.length > 1) {
      nextIdx = Math.floor(Math.random() * imageList.length);
    }
    setImageIdx(nextIdx);
    setTiles(shuffle(solved));
    setMoves(0);
    setWon(false);
  }

  return (
    <div className="puzzle-game-container">
      <h2>Image Puzzle</h2>
      <p>Rearrange the tiles to recreate the image!</p>
      <div className="puzzle-board">
        {tiles.map((tile, idx) => (
          <button
            key={idx}
            className={`puzzle-tile${tile === total - 1 ? " empty" : ""}`}
            onClick={() => handleTileClick(idx)}
            style={
              tile !== total - 1
                ? {
                    backgroundImage: `url(${imageList[imageIdx]})`,
                    backgroundSize: `${size * 100}% ${size * 100}%`,
                    backgroundPosition: `${
                      ((tile % size) * 100) / (size - 1)
                    }% ${(Math.floor(tile / size) * 100) / (size - 1)}%`,
                  }
                : {}
            }
            aria-label={tile === total - 1 ? "empty" : `tile ${tile + 1}`}
          >
            {tile !== total - 1 ? "" : ""}
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
        <button className="restart" onClick={handleNewImage}>
          New Image
        </button>
      </div>
    </div>
  );
}
