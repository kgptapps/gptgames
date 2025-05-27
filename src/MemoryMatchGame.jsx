import React, { useState, useEffect } from "react";

export default function MemoryMatchGame({ updateStats }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Card themes (emojis)
  const cardImages = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

  // Initialize game
  useEffect(() => {
    initGame();
  }, []);

  // Setup card grid
  const initGame = () => {
    // Create pairs of cards
    const duplicatedCards = [...cardImages, ...cardImages];

    // Shuffle cards
    const shuffledCards = duplicatedCards
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        id: index,
        content: card,
        flipped: false,
        matched: false,
      }));

    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameOver(false);
  };

  // Handle card clicks
  const handleCardClick = (id) => {
    // Ignore clicks if already flipped or matched
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id))
      return;

    // Add to flipped cards
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    // If we flipped 2 cards, check for match
    if (newFlipped.length === 2) {
      setMoves((moves) => moves + 1);
      const [firstId, secondId] = newFlipped;

      if (cards[firstId].content === cards[secondId].content) {
        // Match found
        setMatched((prev) => [...prev, firstId, secondId]);
        setFlipped([]);
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  // Check for game over
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameOver(true);
    }
  }, [matched, cards]);

  useEffect(() => {
    if (gameOver && updateStats) {
      updateStats("memory", { solved: true });
    }
  }, [gameOver, updateStats]);

  return (
    <div className="game-container memory-game-container">
      <h1>Memory Match</h1>
      <div className="memory-stats">
        <div className="moves">Moves: {moves}</div>
        <div className="matched">
          Matched: {matched.length / 2}/{cards.length / 2}
        </div>
      </div>

      <div className="memory-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`memory-card ${
              flipped.includes(card.id) || matched.includes(card.id)
                ? "flipped"
                : ""
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="memory-card-inner">
              <div className="memory-card-front"></div>
              <div className="memory-card-back">
                <span className="memory-card-content">{card.content}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="memory-game-over">
          <h2>You win!</h2>
          <p>You completed the game in {moves} moves</p>
          <button className="restart" onClick={initGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
