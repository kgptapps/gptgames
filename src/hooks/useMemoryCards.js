import { useState, useEffect, useMemo, useRef, useCallback } from "react";

/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Custom hook for memory card game logic
 * Handles card state, flipping, matching and game completion
 * @param {Array} initialImages - Array of images/emojis for cards
 * @returns {Object} Card game state and handlers
 */
export function useMemoryCards(initialImages) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // array of card ids
  const [matched, setMatched] = useState([]); // array of card ids
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const cardsRef = useRef([]);

  // Game initialization logic (only for useEffect and manual reset)
  const doInit = useCallback((images) => {
    const duplicated = [...images, ...images];
    const shuffled = shuffleArray(duplicated).map((content, idx) => ({
      id: `${content}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      content,
    }));
    cardsRef.current = shuffled;
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameOver(false);
    setLastMove(null);
  }, []);

  // Only run initialization when initialImages changes (NOT on every render)
  useEffect(() => {
    // Defensive: Only re-init if images are different
    if (initialImages && initialImages.length > 0) {
      doInit(initialImages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialImages)]); // Use stringified value to avoid shallow array issues

  // Manual reset for UI
  const initGame = useCallback(() => {
    doInit(initialImages);
  }, [doInit, initialImages]);

  // Card click handler
  const handleCardClick = useCallback(
    (id) => {
      setFlipped((prev) => {
        if (prev.length === 2 || prev.includes(id) || matched.includes(id))
          return prev;
        setLastMove(Date.now());
        return [...prev, id];
      });
    },
    [matched]
  );

  // Match logic
  useEffect(() => {
    if (flipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = flipped;
      const firstCard = cardsRef.current.find((c) => c.id === firstId);
      const secondCard = cardsRef.current.find((c) => c.id === secondId);
      if (firstCard && secondCard && firstCard.content === secondCard.content) {
        setMatched((prev) => [...prev, firstId, secondId]);
        setTimeout(() => setFlipped([]), 400); // short delay for UX
      } else {
        const timeout = setTimeout(() => setFlipped([]), 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [flipped, matched]);

  useEffect(() => {
    if (
      matched.length === cardsRef.current.length &&
      cardsRef.current.length > 0
    ) {
      setGameOver(true);
    }
  }, [matched]);

  const metrics = useMemo(() => {
    const matchRate = moves > 0 ? matched.length / 2 / moves : 0;
    return {
      matchRate: matchRate,
      efficiency: Math.round(matchRate * 100),
      remainingPairs: (cardsRef.current.length - matched.length) / 2,
    };
  }, [matched.length, moves]);

  return {
    cards: cardsRef.current,
    flipped,
    matched,
    moves,
    gameOver,
    initGame,
    handleCardClick,
    metrics,
    lastMove,
  };
}

export default useMemoryCards;
