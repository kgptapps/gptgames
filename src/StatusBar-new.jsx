import React, { useEffect } from "react";
import "./App.css";
import "./styles/components/status-bar.css";
import { useGameStatsContext } from "./context/GameStatsContext";
import { useActiveGame } from "./context/ActiveGameContext";
import Timer from "./components/Timer";

/**
 * StatusBar component to display game statistics
 * This component gets stats from the GameStatsContext and ActiveGameContext
 * and renders them in the right sidebar.
 * 
 * The component displays:
 * 1. The currently active game's metrics at the top
 * 2. A summary of all games' stats below
 * 
 * Data flows:
 * - GameStatsContext provides persistent stats across sessions
 * - ActiveGameContext provides real-time game metrics
 * - Individual games update their metrics via ActiveGameContext.updateGameData()
 */
const StatusBar = () => {
  // Get stats from context
  const { stats, gameConfigs } = useGameStatsContext();
  const { activeGame, activeGameData, updateActiveGame } = useActiveGame();
  
  // Only use DOM detection as a fallback - the game components should set active game
  useEffect(() => {
    // Only run if no active game is set after a delay
    const detectGameTimeout = setTimeout(() => {
      if (!activeGame) {
        // Try to detect from DOM as a fallback
        try {
          const appContainer = document.querySelector('.app-content');
          if (appContainer) {
            const gameElements = {
              tictactoe: ['.board', '.game-container'],
              memory: ['.memory-grid', '.memory-game-container'],
              simon: ['.simon-container'],
              snake: ['.snake-game'],
              typing: ['.typing-game'],
              puzzle: ['.puzzle-game'],
              color: ['.color-match'],
              word: ['.word-scramble'],
              guess: ['.number-guess']
            };
            
            // Find the first game with a matching element
            for (const [game, selectors] of Object.entries(gameElements)) {
              for (const selector of selectors) {
                if (appContainer.querySelector(selector)) {
                  updateActiveGame(game);
                  return;
                }
              }
            }
          }
        } catch (e) {
          console.log('Error detecting active game:', e);
        }
      }
    }, 500); // Wait 500ms to give game components a chance to set themselves
    
    return () => clearTimeout(detectGameTimeout);
  }, [activeGame, updateActiveGame]);
    
    // Detect again when tab changes
    const tabButtons = document.querySelectorAll('.tabs .tab');
    if (tabButtons.length) {
      const handleTabClick = (event) => {
        // Get game from button text
        const buttonText = event.target.textContent.trim().toLowerCase();
        
        if (buttonText.includes('tic tac toe')) updateActiveGame('tictactoe');
        else if (buttonText.includes('memory')) updateActiveGame('memory');
        else if (buttonText.includes('simon')) updateActiveGame('simon');
        else if (buttonText.includes('snake')) updateActiveGame('snake');
        else if (buttonText.includes('typing')) updateActiveGame('typing');
        else if (buttonText.includes('puzzle')) updateActiveGame('puzzle');
        else if (buttonText.includes('color')) updateActiveGame('color');
        else if (buttonText.includes('word')) updateActiveGame('word');
        else if (buttonText.includes('number')) updateActiveGame('guess');
      };
      
      tabButtons.forEach(button => button.addEventListener('click', handleTabClick));
      return () => tabButtons.forEach(button => button.removeEventListener('click', handleTabClick));
    }
  }, [updateActiveGame]);

  // Default empty stats for each game
  const defaultStats = {
    tictactoe: { wins: 0, losses: 0, draws: 0, played: 0, moves: 0 },
    guess: { wins: 0, losses: 0, played: 0, attempts: 0 },
    puzzle: { solved: 0, played: 0, moves: 0 },
    color: { correct: 0, best: 0, played: 0, streak: 0 },
    word: { solved: 0, played: 0, streak: 0 },
    memory: { solved: 0, played: 0, matches: 0, attempts: 0 },
    typing: { solved: 0, played: 0, wpm: 0, accuracy: 0 },
    simon: { best: 0, played: 0, current: 0 },
    snake: {
      score: 0,
      highScore: 0,
      currentLength: 3,
      maxLength: 3,
      played: 0,
    },
  };

  // Merge default stats with actual stats
  const mergedStats = Object.keys(defaultStats).reduce((acc, gameKey) => {
    acc[gameKey] = { ...defaultStats[gameKey], ...(stats[gameKey] || {}) };
    return acc;
  }, {});
  
  // Get display names from game configs
  const getDisplayName = (gameKey, statKey) => {
    if (gameConfigs[gameKey]?.displayNames?.[statKey]) {
      return gameConfigs[gameKey].displayNames[statKey];
    }
    
    // Default display names
    const displayNames = {
      wins: "Wins",
      losses: "Losses",
      draws: "Draws",
      played: "Played",
      moves: "Moves",
      solved: "Solved",
      attempts: "Attempts",
      matches: "Matches",
      score: "Score",
      highScore: "High Score",
      best: "Best",
      wpm: "WPM",
      accuracy: "Accuracy",
      streak: "Streak",
      maxLength: "Max Length"
    };
    
    return displayNames[statKey] || statKey;
  };
  
  // Get a display name for the game
  const getGameDisplayName = (gameKey) => {
    const displayNames = {
      tictactoe: "Tic Tac Toe",
      guess: "Number Guess",
      puzzle: "Puzzle",
      color: "Color Match",
      word: "Word Scramble",
      memory: "Memory Match",
      typing: "Speed Typing",
      simon: "Simon Says",
      snake: "Snake"
    };
    
    return displayNames[gameKey] || gameKey;
  };
  
  // Render the active game's current stats
  const renderActiveGameStats = () => {
    const currentStats = mergedStats[activeGame];
    if (!currentStats) return null;
    
    const currentLiveData = activeGameData || {};
    
    // Choose which stats to display based on the game
    let primaryStats = [];
    let secondaryStats = [];
    let showTimer = false;
    
    switch (activeGame) {
      case 'tictactoe':
        primaryStats = [
          { key: 'wins', icon: '🏆', value: currentLiveData.wins },
          { key: 'losses', icon: '❌', value: currentLiveData.losses }, 
          { key: 'draws', icon: '🤝', value: currentLiveData.draws }
        ];
        secondaryStats = [
          { key: 'moves', icon: '🔢', value: currentLiveData.moves }
        ];
        break;
        
      case 'memory':
        primaryStats = [
          { key: 'matches', icon: '✓', value: currentLiveData.matches },
          { key: 'attempts', icon: '🔄', value: currentLiveData.attempts }
        ];
        secondaryStats = [
          { key: 'score', icon: '🎯', value: currentLiveData.score }
        ];
        showTimer = currentLiveData.time !== undefined;
        break;
        
      case 'snake':
        primaryStats = [
          { key: 'score', icon: '🎮', value: currentLiveData.score },
          { key: 'highScore', icon: '🏆', value: currentStats.highScore }
        ];
        secondaryStats = [
          { key: 'currentLength', icon: '🐍', value: currentLiveData.length || currentStats.currentLength },
          { key: 'maxLength', icon: '📏', value: currentStats.maxLength }
        ];
        break;
        
      case 'simon':
        primaryStats = [
          { key: 'current', icon: '📊', value: currentLiveData.current },
          { key: 'best', icon: '🏆', value: currentStats.best }
        ];
        break;
        
      case 'typing':
        primaryStats = [
          { key: 'wpm', icon: '⌨️', value: currentLiveData.wpm },
          { key: 'accuracy', icon: '🎯', value: currentLiveData.accuracy }
        ];
        secondaryStats = [
          { key: 'solved', icon: '✓', value: currentStats.solved }
        ];
        showTimer = currentLiveData.time !== undefined;
        break;
        
      default:
        // Pick the most important stats for other games
        if ('wins' in currentStats) primaryStats.push({ key: 'wins', icon: '🏆' });
        if ('score' in currentStats) primaryStats.push({ key: 'score', icon: '🎯', value: currentLiveData.score });
        if ('solved' in currentStats) primaryStats.push({ key: 'solved', icon: '✓' });
        if ('best' in currentStats) primaryStats.push({ key: 'best', icon: '🏆' });
        break;
    }
    
    // Show timer for games that track time
    
    return (
      <>
        <h4 className="active-game-title">{getGameDisplayName(activeGame)}</h4>
        
        {/* Primary stats row */}
        <div className="active-stats-row primary">
          {primaryStats.map(({ key, icon, value }) => {
            // Use live value if available, otherwise use stored stat
            const displayValue = value !== undefined ? value : currentStats[key];
            return displayValue !== undefined && (
              <div key={key} className={`active-stat-item ${key}`}>
                <span className="stat-icon">{icon}</span>
                <span className="stat-value">{displayValue}</span>
                <span className="stat-label">{getDisplayName(activeGame, key)}</span>
              </div>
            );
          })}
        </div>
        
        {/* Secondary stats row */}
        {secondaryStats.length > 0 && (
          <div className="active-stats-row secondary">
            {secondaryStats.map(({ key, icon, value }) => {
              // Use live value if available, otherwise use stored stat
              const displayValue = value !== undefined ? value : currentStats[key];
              return displayValue !== undefined && (
                <div key={key} className={`active-stat-item secondary ${key}`}>
                  <span className="stat-icon">{icon}</span>
                  <span className="stat-value">{displayValue}</span>
                  <span className="stat-label">{getDisplayName(activeGame, key)}</span>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Timer */}
        {showTimer && (
          <div className="active-game-timer">
            <Timer time={currentLiveData.time} compact={true} />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="rightbar compact-scrollable wide">
      {/* Active game stats */}
      <div className="active-game-stats" data-game={activeGame}>
        {renderActiveGameStats()}
      </div>
      
      {/* Divider */}
      <div className="stats-divider"></div>
      
      {/* All games stats */}
      <h3 className="stats-title">Game Stats</h3>
      <ul className="stats-list-compact">
        <li className={`stat-row ${activeGame === "tictactoe" ? "active" : ""}`} data-game="tictactoe">
          <span className="stat-label">TicTacToe</span>
          <span className="stat-badge win">{mergedStats.tictactoe.wins}W</span>
          <span className="stat-badge loss">
            {mergedStats.tictactoe.losses}L
          </span>
          <span className="stat-badge draw">
            {mergedStats.tictactoe.draws}D
          </span>
        </li>
        <li className={`stat-row ${activeGame === "guess" ? "active" : ""}`} data-game="guess">
          <span className="stat-label">Guess</span>
          <span className="stat-badge win">{mergedStats.guess.wins}W</span>
          <span className="stat-badge loss">{mergedStats.guess.losses}L</span>
        </li>
        <li className={`stat-row ${activeGame === "puzzle" ? "active" : ""}`} data-game="puzzle">
          <span className="stat-label">Puzzle</span>
          <span className="stat-badge solved">
            {mergedStats.puzzle.solved}✔
          </span>
        </li>
        <li className={`stat-row ${activeGame === "color" ? "active" : ""}`} data-game="color">
          <span className="stat-label">Color</span>
          <span className="stat-badge correct">
            {mergedStats.color.correct}✔
          </span>
          <span className="stat-badge best">
            Best: {mergedStats.color.best || 0}
          </span>
        </li>
        <li className={`stat-row ${activeGame === "word" ? "active" : ""}`} data-game="word">
          <span className="stat-label">Word</span>
          <span className="stat-badge solved">{mergedStats.word.solved}✔</span>
        </li>
        <li className={`stat-row ${activeGame === "memory" ? "active" : ""}`} data-game="memory">
          <span className="stat-label">Memory</span>
          <span className="stat-badge solved">
            {mergedStats.memory.solved}✔
          </span>
          <span className="stat-badge attempts">
            {mergedStats.memory.attempts || 0}🔄
          </span>
        </li>
        <li className={`stat-row ${activeGame === "typing" ? "active" : ""}`} data-game="typing">
          <span className="stat-label">Typing</span>
          <span className="stat-badge solved">
            {mergedStats.typing.solved || 0}✔
          </span>
          <span className="stat-badge wpm">
            {mergedStats.typing.wpm || 0} WPM
          </span>
        </li>
        <li className={`stat-row ${activeGame === "simon" ? "active" : ""}`} data-game="simon">
          <span className="stat-label">Simon</span>
          <span className="stat-badge best">
            Best: {mergedStats.simon.best}
          </span>
        </li>
        <li className={`stat-row ${activeGame === "snake" ? "active" : ""}`} data-game="snake">
          <span className="stat-label">Snake</span>
          <span className="stat-badge score">
            Score: {mergedStats.snake.score || 0}
          </span>
          <span className="stat-badge best">
            High: {mergedStats.snake.highScore || 0}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default StatusBar;
