import React, { createContext, useContext, useState, useCallback } from "react";

// Create the context
const ScoreContext = createContext();

/**
 * Custom hook to use the score context
 * @returns {Object} Context values and functions
 */
export function useScore() {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error("useScore must be used within a ScoreProvider");
  }
  return context;
}

/**
 * Provider component for score management
 * Implements the Observer pattern for score updates
 */
export function ScoreProvider({ children, initialScore = 0 }) {
  const [score, setScore] = useState(initialScore);
  const [moveHistory, setMoveHistory] = useState([]);
  const [multiplier, setMultiplier] = useState(1);

  // Add points to the score
  const addPoints = useCallback(
    (points) => {
      setScore((prev) => prev + points * multiplier);
    },
    [multiplier]
  );

  // Record a move in history
  const recordMove = useCallback((moveType, data) => {
    const move = {
      type: moveType,
      timestamp: Date.now(),
      data,
    };

    setMoveHistory((prev) => [...prev, move]);

    // Calculate bonuses based on move history
    calculateBonuses(move);

    return move;
  }, []);

  // Calculate bonus multipliers based on recent moves
  const calculateBonuses = useCallback(
    (currentMove) => {
      if (currentMove.type === "match") {
        // Check for consecutive matches (streak)
        const recentMoves = moveHistory.slice(-3);
        const consecutiveMatches = recentMoves.filter(
          (m) => m.type === "match"
        ).length;

        if (consecutiveMatches >= 2) {
          // 3 matches in a row gives x2 multiplier
          setMultiplier(2);
          setTimeout(() => setMultiplier(1), 5000); // Reset after 5 seconds
        }
      } else if (currentMove.type === "mismatch") {
        // Reset multiplier on mismatch
        setMultiplier(1);
      }
    },
    [moveHistory]
  );

  // Reset the score
  const resetScore = useCallback(() => {
    setScore(initialScore);
    setMoveHistory([]);
    setMultiplier(1);
  }, [initialScore]);

  // Get current streak
  const getCurrentStreak = useCallback(() => {
    let streak = 0;

    // Count from the end, stop at first non-match
    for (let i = moveHistory.length - 1; i >= 0; i--) {
      if (moveHistory[i].type === "match") {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [moveHistory]);

  // Expose context values
  const value = {
    score,
    moveHistory,
    multiplier,
    addPoints,
    recordMove,
    resetScore,
    getCurrentStreak,
  };

  return (
    <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>
  );
}

export default ScoreContext;
