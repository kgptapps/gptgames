import { useState, useEffect } from "react";

/**
 * Custom hook for managing game difficulty
 * @param {string} gameKey - The game identifier for localStorage
 * @param {string} defaultDifficulty - Default difficulty level
 * @param {Array} allowedLevels - Array of allowed difficulty levels
 * @returns {Array} [difficulty, setDifficulty] - Current difficulty and setter function
 */
export function useGameDifficulty(
  gameKey,
  defaultDifficulty = "medium",
  allowedLevels = ["easy", "medium", "hard"]
) {
  // Initialize difficulty from localStorage if available
  const [difficulty, setDifficultyState] = useState(() => {
    const savedDifficulty = localStorage.getItem(`${gameKey}-difficulty`);
    return savedDifficulty && allowedLevels.includes(savedDifficulty)
      ? savedDifficulty
      : defaultDifficulty;
  });

  // Custom setter to validate and save to localStorage
  const setDifficulty = (level) => {
    if (!allowedLevels.includes(level)) {
      console.warn(
        `Invalid difficulty level: ${level}. Using default: ${defaultDifficulty}`
      );
      level = defaultDifficulty;
    }

    localStorage.setItem(`${gameKey}-difficulty`, level);
    setDifficultyState(level);
  };

  return [difficulty, setDifficulty];
}

export default useGameDifficulty;
