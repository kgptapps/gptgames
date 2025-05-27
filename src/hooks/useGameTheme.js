import { useState, useEffect } from "react";

/**
 * Custom hook for managing game theme preferences
 * @param {string} gameKey - The game identifier for localStorage
 * @param {string} defaultTheme - Default theme
 * @returns {Array} [theme, setTheme] - Current theme and setter function
 */
export function useGameTheme(gameKey, defaultTheme = "animals") {
  // Initialize theme from localStorage if available
  const [theme, setThemeState] = useState(() => {
    const savedTheme = localStorage.getItem(`${gameKey}-theme`);
    return savedTheme || defaultTheme;
  });

  // Custom setter to save to localStorage
  const setTheme = (newTheme) => {
    if (!newTheme) {
      return;
    }

    localStorage.setItem(`${gameKey}-theme`, newTheme);
    setThemeState(newTheme);
  };

  // Effect to save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(`${gameKey}-theme`, theme);
  }, [theme, gameKey]);

  return [theme, setTheme];
}

export default useGameTheme;
