import React from "react";

/**
 * Higher-order component that wraps a game with standardized stats handling
 * @param {React.Component} WrappedComponent - The game component to wrap
 * @param {Object} statsConfig - Configuration for this game's stats
 * @returns {React.Component} - The wrapped component with stats capabilities
 */
export const withGameStats = (WrappedComponent, statsConfig) => {
  const WithGameStats = (props) => {
    // Register supported stats with the provider
    React.useEffect(() => {
      if (props.registerStats && statsConfig) {
        props.registerStats(statsConfig);
      }
    }, [props.registerStats]);

    // Pass the updateStats function to the wrapped component
    return <WrappedComponent {...props} />;
  };

  WithGameStats.displayName = `WithGameStats(${getDisplayName(
    WrappedComponent
  )})`;

  return WithGameStats;
};

// Helper to get component display name
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

/**
 * Example usage:
 *
 * const TicTacToeWithStats = withGameStats(TicTacToe, {
 *   gameKey: 'tictactoe',
 *   supportedStats: ['wins', 'losses', 'draws'],
 *   displayNames: {
 *     wins: 'Wins',
 *     losses: 'Losses',
 *     draws: 'Draws'
 *   }
 * });
 */

export default withGameStats;
