/**
 * Analytics utilities for tracking game events in Google Analytics
 */

/**
 * Track a game event in Google Analytics
 * @param {string} gameKey - The game identifier (e.g., 'tictactoe', 'snake')
 * @param {string} eventName - The name of the event (e.g., 'start', 'win', 'lose')
 * @param {Object} [eventParams] - Optional parameters with additional data about the event
 */
export const trackGameEvent = (gameKey, eventName, eventParams = {}) => {
  // Make sure Google Analytics is available
  if (window.gtag) {
    // Create event parameters with the game as the category
    const params = {
      event_category: `game_${gameKey}`,
      ...eventParams,
    };

    // Log the event to the console in development
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Tracking: ${gameKey} - ${eventName}`, params);
    }

    // Send the event to Google Analytics
    window.gtag("event", eventName, params);
  }
};

/**
 * Track game stats in Google Analytics
 * @param {string} gameKey - The game identifier (e.g., 'tictactoe', 'snake')
 * @param {Object} stats - The stats object with game statistics
 */
export const trackGameStats = (gameKey, stats) => {
  // Make sure Google Analytics is available
  if (window.gtag && stats) {
    Object.entries(stats).forEach(([statKey, value]) => {
      // Only track numeric values or boolean values (converted to 1/0)
      if (typeof value === "number" || typeof value === "boolean") {
        trackGameEvent(gameKey, "stat_update", {
          stat_name: statKey,
          value: typeof value === "boolean" ? (value ? 1 : 0) : value,
        });
      }
    });
  }
};

/**
 * Track when a user changes games
 * @param {string} fromGame - The game they were playing
 * @param {string} toGame - The game they switched to
 */
export const trackGameChange = (fromGame, toGame) => {
  trackGameEvent("navigation", "change_game", {
    from_game: fromGame || "none",
    to_game: toGame,
  });
};
