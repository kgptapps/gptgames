import { useState, useCallback, useEffect } from "react";

/**
 * Custom hook for tracking game statistics
 * Provides methods for updating stats and persists them to localStorage
 * @returns {[Object, Function]} - [stats object, updateStats function]
 */
export default function useGameStats() {
  // Initialize stats from localStorage if available
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem("gameStats");
    return savedStats
      ? JSON.parse(savedStats)
      : {
          tictactoe: { wins: 0, losses: 0, draws: 0, played: 0 },
          guess: { wins: 0, losses: 0, played: 0 },
          puzzle: { solved: 0, played: 0 },
          color: { correct: 0, best: 0, played: 0 },
          word: { solved: 0, played: 0 },
          memory: { solved: 0, played: 0 },
          typing: { solved: 0, played: 0 },
          simon: { best: 0, played: 0 },
        };
  });

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("gameStats", JSON.stringify(stats));
  }, [stats]);

  /**
   * Update stats for a specific game
   * @param {string} gameKey - The game identifier (e.g., "tictactoe")
   * @param {Object} payload - The stats to update
   */
  const updateStats = useCallback((gameKey, payload) => {
    setStats((prev) => {
      // Get previous stats for this game, or initialize with defaults
      const prevGame = prev[gameKey] || {};

      // Create a copy of the previous game stats
      const updated = { ...prevGame };

      // Always increment played count when stats are updated
      updated.played = (updated.played || 0) + 1;

      // Update specific stats based on payload type
      Object.entries(payload).forEach(([key, value]) => {
        // Handle numeric values by adding them
        if (typeof value === "number") {
          updated[key] = (updated[key] || 0) + value;
        }
        // Handle boolean values by incrementing if true
        else if (typeof value === "boolean") {
          if (value) {
            updated[key] = (updated[key] || 0) + 1;
          }
        }
        // For "best" scores, only update if the new value is higher
        else if (key === "best" && typeof value === "number") {
          updated.best = Math.max(updated.best || 0, value);
        }
        // For other values, just set them directly
        else {
          updated[key] = value;
        }
      });

      // Return the updated stats object
      return { ...prev, [gameKey]: updated };
    });
  }, []);

  // Return the stats and the update function
  return [stats, updateStats];
}
