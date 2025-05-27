import React, { useEffect, useRef, useState } from "react";
import withGameStats from "./hooks/withGameStats";
import useMemoryCards from "./hooks/useMemoryCards";
import useGameDifficulty from "./hooks/useGameDifficulty";
import useGameTimer from "./hooks/useGameTimer";
import useGameTheme from "./hooks/useGameTheme";
import MemoryCard from "./components/MemoryCard";
import GameOverModal from "./components/GameOverModal";
import DifficultySelector from "./components/DifficultySelector";
import ThemeSelector from "./components/ThemeSelector";
import Timer from "./components/Timer";
import ScoreDisplay from "./components/ScoreDisplay";
import PerformanceMetrics from "./components/PerformanceMetrics";
import Confetti from "./components/Confetti";
import { getThemeCards } from "./utils/cardThemes";
import { ScoreProvider, useScore } from "./context/ScoreContext";
import { useActiveGame } from "./context/ActiveGameContext";
import "./styles/games/memory.css";
import "./styles/games/memory-layout.css";

// Game Component with Score Context
function MemoryGame({ updateStats }) {
  return (
    <ScoreProvider>
      <MemoryGameContent updateStats={updateStats} />
    </ScoreProvider>
  );
}

// Main game component that uses the score context
function MemoryGameContent({ updateStats }) {
  // Use custom hooks
  const [difficulty, setDifficulty] = useGameDifficulty("memory");
  const [theme, setTheme] = useGameTheme("memory", "animals");
  const { addPoints, recordMove, resetScore, score } = useScore();
  const [totalMatches, setTotalMatches] = useState(0);
  const { updateActiveGame, updateGameData } = useActiveGame();
  const hasSetActiveGame = useRef(false);
  const lastSentData = useRef({
    matches: null,
    attempts: null,
    time: null,
    score: null,
  });
  const hasReportedGameOver = useRef(false);

  // Only set active game on first mount
  useEffect(() => {
    if (!hasSetActiveGame.current) {
      updateActiveGame("memory");
      hasSetActiveGame.current = true;
    }
  }, [updateActiveGame]);

  // Get cards for current theme and difficulty
  const currentCards = getThemeCards(theme, difficulty);

  const {
    cards,
    flipped,
    matched,
    moves,
    gameOver,
    initGame,
    handleCardClick,
    metrics,
  } = useMemoryCards(currentCards);

  // Game timer
  const {
    time,
    isActive,
    start,
    stop,
    reset: resetTimer,
    formatTime,
  } = useGameTimer(false, 0);

  // Award points and record moves when a new match is made
  useEffect(() => {
    // Only run if a new match was made (matched.length is even and > 0)
    if (matched.length > 0 && matched.length % 2 === 0) {
      // Award points for each match
      const difficultyMultiplier =
        { easy: 1, medium: 2, hard: 3 }[difficulty] || 1;
      const pointsBase = 10 * difficultyMultiplier;
      addPoints(pointsBase);
      recordMove("match", { matchedCount: matched.length });
      setTotalMatches((prev) => prev + 1);
    }
  }, [matched.length]);

  // Initialize game and reset score on mount, difficulty or theme changes
  useEffect(() => {
    initGame();
    resetTimer();
    resetScore();
    hasReportedGameOver.current = false; // Reset on new game
    // Start timer when game begins
    start();
  }, [difficulty, theme]);

  // Start timer on first move and stop when game is over
  useEffect(() => {
    if (moves === 1 && !isActive) {
      start();
    } else if (gameOver) {
      stop();
    }
  }, [moves, gameOver, isActive, start, stop]);

  // Update the active game data when important metrics change, but only if changed
  useEffect(() => {
    const newData = {
      matches: matched.length / 2,
      attempts: moves,
      time: time,
      score: score,
    };
    const last = lastSentData.current;
    if (
      newData.matches !== last.matches ||
      newData.attempts !== last.attempts ||
      newData.time !== last.time ||
      newData.score !== last.score
    ) {
      updateGameData(newData);
      lastSentData.current = newData;
    }
  }, [matched.length, moves, time, score, updateGameData]);

  // State for triggering confetti animation
  const [showConfetti, setShowConfetti] = useState(false);

  // Update stats when game completes
  useEffect(() => {
    if (gameOver && updateStats && !hasReportedGameOver.current) {
      hasReportedGameOver.current = true;
      // Award bonus points for fast completion
      const timeBonus = Math.max(0, 300 - time) * 2;
      addPoints(timeBonus);

      // Final time-based bonus
      if (time < 60) addPoints(100); // Under 1 min bonus
      else if (time < 120) addPoints(50); // Under 2 min bonus

      // Update game stats with enhanced metrics
      updateStats("memory", {
        solved: true,
        completionTime: time,
        score: score,
        moves: moves,
        matches: matched.length / 2,
        attempts: moves,
        matchRate: metrics.efficiency,
        bestTime: (prev = {}) => {
          // Only update best time if it's better than previous or it's the first completion
          const currentBestTime = prev.bestTime;
          if (!currentBestTime || time < currentBestTime) {
            return time;
          }
          return currentBestTime;
        },
        totalMatches: totalMatches + matched.length / 2,
      });

      // Trigger confetti
      setShowConfetti(true);
    }
    if (!gameOver) {
      hasReportedGameOver.current = false;
    }
  }, [
    gameOver,
    updateStats,
    time,
    score,
    matched.length,
    moves,
    metrics,
    addPoints,
    totalMatches,
  ]);

  // Handle difficulty change
  const handleSetDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  // Handle theme change
  const handleSelectTheme = (newTheme) => {
    setTheme(newTheme);
  };

  // Display minimal stats in game window since they're now in status bar
  return (
    <div className="game-container memory-game-container">
      <h1>Memory Match</h1>
      <Confetti active={showConfetti} />
      <div className="memory-layout">
        {/* Game grid on top, vertical layout */}
        <div className={`memory-grid-wrapper ${difficulty}`}>
          <div className={`memory-grid ${difficulty}`}>
            {
              // Split cards into rows for vertical layout
              (() => {
                let cols;
                if (difficulty === "easy") cols = 4;
                else if (difficulty === "medium") cols = 6;
                else if (difficulty === "hard") cols = 5; // 5 columns for hard, more rows
                const rows = [];
                for (let i = 0; i < cards.length; i += cols) {
                  rows.push(
                    <div className="memory-grid-row" key={i}>
                      {cards.slice(i, i + cols).map((card) => (
                        <MemoryCard
                          key={card.id}
                          id={card.id}
                          content={card.content}
                          isFlipped={flipped.includes(card.id)}
                          isMatched={matched.includes(card.id)}
                          onClick={handleCardClick}
                        />
                      ))}
                    </div>
                  );
                }
                return rows;
              })()
            }
          </div>
        </div>
        {/* Controls at the bottom */}
        <div className="memory-controls-panel">
          <DifficultySelector
            currentDifficulty={difficulty}
            onSetDifficulty={handleSetDifficulty}
          />
          <ThemeSelector
            currentTheme={theme}
            onSelectTheme={handleSelectTheme}
          />
          <Timer time={time} label="Time" />
        </div>
      </div>
      {gameOver && (
        <GameOverModal
          message="You win!"
          subMessage={`You completed the game in ${moves} moves and ${formatTime()} with a score of ${score} points!`}
          onRestart={initGame}
        />
      )}
    </div>
  );
}

export default withGameStats(MemoryGame, {
  gameKey: "memory",
  supportedStats: [
    "solved",
    "played",
    "score",
    "matches",
    "attempts",
    "bestTime",
    "totalMatches",
  ],
  displayNames: {
    solved: "Solved",
    played: "Games Played",
    score: "High Score",
    matches: "Matches",
    attempts: "Attempts",
    bestTime: "Best Time",
    totalMatches: "Total Matches",
  },
});
