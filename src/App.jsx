import React, { useState } from "react";
import TicTacToe from "./TicTacToe";
import NumberGuessGame from "./NumberGuessGame";
import PuzzleGame from "./PuzzleGame";
import ColorMatchGame from "./ColorMatchGame";
import WordScrambleGame from "./WordScrambleGame";
import MemoryMatchGame from "./MemoryMatchGame";
import FastTypingGame from "./FastTypingGame";
import SimonSaysGame from "./SimonSaysGame";
import { buildInfo } from "./buildInfo";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("tictactoe");
  const [showBuildInfo, setShowBuildInfo] = useState(false);
  // Track stats for each game
  const [gameStats, setGameStats] = useState({
    tictactoe: { played: 0, wins: 0, losses: 0, draws: 0 },
    guess: { played: 0, wins: 0, losses: 0 },
    puzzle: { played: 0, solved: 0 },
    color: { played: 0, correct: 0 },
    word: { played: 0, solved: 0 },
    memory: { played: 0, solved: 0 },
    typing: { played: 0, completed: 0 },
    simon: { played: 0, best: 0 },
  });

  // Handler to update stats from child games
  const updateStats = (game, result) => {
    setGameStats((prev) => {
      const stats = { ...prev };
      if (!stats[game]) stats[game] = {};
      // Example: result = { win: true }, or { solved: true }, etc.
      stats[game].played = (stats[game].played || 0) + 1;
      if (game === "tictactoe") {
        if (result.draw) stats[game].draws = (stats[game].draws || 0) + 1;
        else if (result.win) stats[game].wins = (stats[game].wins || 0) + 1;
        else stats[game].losses = (stats[game].losses || 0) + 1;
      } else if (game === "guess") {
        if (result.win) stats[game].wins = (stats[game].wins || 0) + 1;
        else stats[game].losses = (stats[game].losses || 0) + 1;
      } else if (["puzzle", "word", "memory", "typing"].includes(game)) {
        if (result.solved || result.completed)
          stats[game].solved = (stats[game].solved || 0) + 1;
      } else if (game === "color") {
        if (result.correct)
          stats[game].correct = (stats[game].correct || 0) + 1;
      } else if (game === "simon") {
        if (result.best && result.best > (stats[game].best || 0))
          stats[game].best = result.best;
      }
      return stats;
    });
  };

  // In each game component, ensure updateStats is called appropriately
  // Example for TicTacToe (already done):
  // useEffect(() => { if ((winner || winResult?.draw) && !gameOver) { updateStats('tictactoe', { win: winner === 'X', draw: winResult?.draw }); } }, [winner, winResult?.draw, updateStats, gameOver]);
  // The same pattern should be used in NumberGuessGame, PuzzleGame, ColorMatchGame, WordScrambleGame, MemoryMatchGame, FastTypingGame, SimonSaysGame

  // Format the build timestamp for display
  const formattedDate = new Date(buildInfo.timestamp).toLocaleString();

  const toggleBuildInfo = () => {
    setShowBuildInfo(!showBuildInfo);
  };

  return (
    <div className="app-container">
      {showBuildInfo && (
        <div className="build-info-modal">
          <div className="build-info-content">
            <h3>Build Information</h3>
            <p>
              <strong>Version:</strong> {buildInfo.version}
            </p>
            <p>
              <strong>Build Date:</strong> {formattedDate}
            </p>
            <p>
              <strong>Build Number:</strong> {buildInfo.buildNumber}
            </p>
            <button onClick={toggleBuildInfo}>Close</button>
          </div>
        </div>
      )}
      <div className="sidebar">
        <div className="tabs">
          <button
            className={tab === "tictactoe" ? "tab active" : "tab"}
            onClick={() => setTab("tictactoe")}
          >
            Tic Tac Toe
          </button>
          <button
            className={tab === "guess" ? "tab active" : "tab"}
            onClick={() => setTab("guess")}
          >
            Number Guess
          </button>
          <button
            className={tab === "puzzle" ? "tab active" : "tab"}
            onClick={() => setTab("puzzle")}
          >
            Puzzle
          </button>
          <button
            className={tab === "color" ? "tab active" : "tab"}
            onClick={() => setTab("color")}
          >
            Color Match
          </button>
          <button
            className={tab === "word" ? "tab active" : "tab"}
            onClick={() => setTab("word")}
          >
            Word Scramble
          </button>
          <button
            className={tab === "memory" ? "tab active" : "tab"}
            onClick={() => setTab("memory")}
          >
            Memory Match
          </button>
          <button
            className={tab === "typing" ? "tab active" : "tab"}
            onClick={() => setTab("typing")}
          >
            Speed Typing
          </button>
          <button
            className={tab === "simon" ? "tab active" : "tab"}
            onClick={() => setTab("simon")}
          >
            Simon Says
          </button>
        </div>
      </div>
      <div className="main-content">
        <div className="app-content">
          {tab === "tictactoe" ? (
            <TicTacToe updateStats={updateStats} />
          ) : tab === "guess" ? (
            <NumberGuessGame updateStats={updateStats} />
          ) : tab === "puzzle" ? (
            <PuzzleGame updateStats={updateStats} />
          ) : tab === "color" ? (
            <ColorMatchGame updateStats={updateStats} />
          ) : tab === "word" ? (
            <WordScrambleGame updateStats={updateStats} />
          ) : tab === "memory" ? (
            <MemoryMatchGame updateStats={updateStats} />
          ) : tab === "typing" ? (
            <FastTypingGame updateStats={updateStats} />
          ) : (
            <SimonSaysGame updateStats={updateStats} />
          )}
        </div>
      </div>
      <div className="rightbar compact-scrollable wide">
        <h3 className="stats-title">Game Stats</h3>
        <ul className="stats-list-compact">
          <li className="stat-row">
            <span className="stat-label">TicTacToe</span>{" "}
            <span className="stat-badge win">{gameStats.tictactoe.wins}W</span>{" "}
            <span className="stat-badge loss">
              {gameStats.tictactoe.losses}L
            </span>{" "}
            <span className="stat-badge draw">
              {gameStats.tictactoe.draws}D
            </span>
          </li>
          <li className="stat-row">
            <span className="stat-label">Guess</span>{" "}
            <span className="stat-badge win">{gameStats.guess.wins}W</span>{" "}
            <span className="stat-badge loss">{gameStats.guess.losses}L</span>
          </li>
          <li className="stat-row">
            <span className="stat-label">Puzzle</span>{" "}
            <span className="stat-badge solved">
              {gameStats.puzzle.solved}✔
            </span>
          </li>
          <li className="stat-row">
            <span className="stat-label">Color</span>{" "}
            <span className="stat-badge correct">
              {gameStats.color.correct}✔
            </span>{" "}
            <span className="stat-badge best">
              Best: {gameStats.color.best || 0}
            </span>{" "}
            <span className="stat-badge played">
              {gameStats.color.played || 0} played
            </span>
          </li>
          <li className="stat-row">
            <span className="stat-label">Word</span>{" "}
            <span className="stat-badge solved">{gameStats.word.solved}✔</span>
          </li>
          <li className="stat-row">
            <span className="stat-label">Memory</span>{" "}
            <span className="stat-badge solved">
              {gameStats.memory.solved}✔
            </span>
          </li>
          <li className="stat-row">
            <span className="stat-label">Typing</span>{" "}
            <span className="stat-badge solved">
              {gameStats.typing.solved || 0}✔
            </span>
          </li>
          <li className="stat-row">
            <span className="stat-label">Simon</span>{" "}
            <span className="stat-badge best">
              Best: {gameStats.simon.best}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
