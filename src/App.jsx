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
      <div className="rightbar">
        <h3>Game Stats</h3>
        <div className="stats-list">
          <div className="stat-item">
            <b>Tic Tac Toe:</b> Played: {gameStats.tictactoe.played}, Wins:{" "}
            {gameStats.tictactoe.wins}, Losses: {gameStats.tictactoe.losses},
            Draws: {gameStats.tictactoe.draws}
          </div>
          <div className="stat-item">
            <b>Number Guess:</b> Played: {gameStats.guess.played}, Wins:{" "}
            {gameStats.guess.wins}, Losses: {gameStats.guess.losses}
          </div>
          <div className="stat-item">
            <b>Puzzle:</b> Played: {gameStats.puzzle.played}, Solved:{" "}
            {gameStats.puzzle.solved}
          </div>
          <div className="stat-item">
            <b>Color Match:</b> Played: {gameStats.color.played}, Correct:{" "}
            {gameStats.color.correct}
          </div>
          <div className="stat-item">
            <b>Word Scramble:</b> Played: {gameStats.word.played}, Solved:{" "}
            {gameStats.word.solved}
          </div>
          <div className="stat-item">
            <b>Memory Match:</b> Played: {gameStats.memory.played}, Solved:{" "}
            {gameStats.memory.solved}
          </div>
          <div className="stat-item">
            <b>Speed Typing:</b> Played: {gameStats.typing.played}, Completed:{" "}
            {gameStats.typing.solved}
          </div>
          <div className="stat-item">
            <b>Simon Says:</b> Played: {gameStats.simon.played}, Best:{" "}
            {gameStats.simon.best}
          </div>
        </div>
      </div>
    </div>
  );
}
