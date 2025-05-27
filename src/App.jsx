import React, { useState, useCallback } from "react";
import TicTacToe from "./TicTacToe";
import NumberGuessGame from "./NumberGuessGame";
import PuzzleGame from "./PuzzleGame";
import ColorMatchGame from "./ColorMatchGame";
import WordScrambleGame from "./WordScrambleGame";
import MemoryMatchGame from "./MemoryMatchGame";
import FastTypingGame from "./FastTypingGame";
import SimonSaysGame from "./SimonSaysGame";
import SnakeGame from "./SnakeGame";
import { buildInfo } from "./buildInfo";
import StatusBar from "./StatusBar";
import useGameStats from "./hooks/useGameStats";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("tictactoe");
  const [showBuildInfo, setShowBuildInfo] = useState(false);
  const [gameStats, updateStats] = useGameStats();

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
          <button
            className={tab === "snake" ? "tab active" : "tab"}
            onClick={() => setTab("snake")}
          >
            Snake
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
          ) : tab === "simon" ? (
            <SimonSaysGame updateStats={updateStats} />
          ) : tab === "snake" ? (
            <SnakeGame updateStats={updateStats} />
          ) : (
            <SimonSaysGame updateStats={updateStats} />
          )}
        </div>
      </div>
      {/* Render the StatusBar with access to game stats */}
      <StatusBar stats={gameStats} />
    </div>
  );
}
