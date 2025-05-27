import React from "react";
import "./App.css";

/**
 * StatusBar component to display game statistics
 * This component receives stats from the useGameStats hook
 * and renders them in the right sidebar
 */
const StatusBar = ({ stats }) => {
  // Default empty stats for each game
  const defaultStats = {
    tictactoe: { wins: 0, losses: 0, draws: 0, played: 0 },
    guess: { wins: 0, losses: 0, played: 0 },
    puzzle: { solved: 0, played: 0 },
    color: { correct: 0, best: 0, played: 0 },
    word: { solved: 0, played: 0 },
    memory: { solved: 0, played: 0 },
    typing: { solved: 0, played: 0 },
    simon: { best: 0, played: 0 },
  };

  // Merge default stats with actual stats
  const mergedStats = Object.keys(defaultStats).reduce((acc, gameKey) => {
    acc[gameKey] = { ...defaultStats[gameKey], ...(stats[gameKey] || {}) };
    return acc;
  }, {});

  return (
    <div className="rightbar compact-scrollable wide">
      <h3 className="stats-title">Game Stats</h3>
      <ul className="stats-list-compact">
        <li className="stat-row">
          <span className="stat-label">TicTacToe</span>
          <span className="stat-badge win">{mergedStats.tictactoe.wins}W</span>
          <span className="stat-badge loss">
            {mergedStats.tictactoe.losses}L
          </span>
          <span className="stat-badge draw">
            {mergedStats.tictactoe.draws}D
          </span>
        </li>
        <li className="stat-row">
          <span className="stat-label">Guess</span>
          <span className="stat-badge win">{mergedStats.guess.wins}W</span>
          <span className="stat-badge loss">{mergedStats.guess.losses}L</span>
        </li>
        <li className="stat-row">
          <span className="stat-label">Puzzle</span>
          <span className="stat-badge solved">
            {mergedStats.puzzle.solved}✔
          </span>
        </li>
        <li className="stat-row">
          <span className="stat-label">Color</span>
          <span className="stat-badge correct">
            {mergedStats.color.correct}✔
          </span>
          <span className="stat-badge best">
            Best: {mergedStats.color.best || 0}
          </span>
          <span className="stat-badge played">
            {mergedStats.color.played || 0} played
          </span>
        </li>
        <li className="stat-row">
          <span className="stat-label">Word</span>
          <span className="stat-badge solved">{mergedStats.word.solved}✔</span>
        </li>
        <li className="stat-row">
          <span className="stat-label">Memory</span>
          <span className="stat-badge solved">
            {mergedStats.memory.solved}✔
          </span>
        </li>
        <li className="stat-row">
          <span className="stat-label">Typing</span>
          <span className="stat-badge solved">
            {mergedStats.typing.solved || 0}✔
          </span>
        </li>
        <li className="stat-row">
          <span className="stat-label">Simon</span>
          <span className="stat-badge best">
            Best: {mergedStats.simon.best}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default StatusBar;
