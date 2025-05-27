import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const ActiveGameContext = createContext();

/**
 * Custom hook to use the active game context
 * @returns {Object} Context values and functions
 */
export function useActiveGame() {
  const context = useContext(ActiveGameContext);
  if (!context) {
    throw new Error("useActiveGame must be used within an ActiveGameProvider");
  }
  return context;
}

/**
 * Provider component for tracking active game
 */
export function ActiveGameProvider({ children }) {
  const [activeGame, setActiveGame] = useState("tictactoe");
  const [activeGameData, setActiveGameData] = useState({});

  // Updates the active game
  const updateActiveGame = (game, data = {}) => {
    setActiveGame(game);
    setActiveGameData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Update specific data for the current active game
  const updateGameData = (data) => {
    setActiveGameData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Clear data when game changes
  useEffect(() => {
    setActiveGameData({});
  }, [activeGame]);

  return (
    <ActiveGameContext.Provider
      value={{
        activeGame,
        activeGameData,
        updateActiveGame,
        updateGameData,
      }}
    >
      {children}
    </ActiveGameContext.Provider>
  );
}

export default ActiveGameContext;
