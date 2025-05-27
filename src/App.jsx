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

  // Get version from build info
  const version = buildInfo.version;

  // Format the build timestamp for display
  const formattedDate = new Date(buildInfo.timestamp).toLocaleString();

  const toggleBuildInfo = () => {
    setShowBuildInfo(!showBuildInfo);
  };

  return (
    <div>
      <header className="app-header">
        <div className="header-content">
          <h1>Kannaiyan's Copilot Games</h1>
          <span className="version-badge" onClick={toggleBuildInfo}>
            v{version}
          </span>
        </div>
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
      </header>
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
      <div className="app-content">
        {tab === "tictactoe" ? (
          <TicTacToe />
        ) : tab === "guess" ? (
          <NumberGuessGame />
        ) : tab === "puzzle" ? (
          <PuzzleGame />
        ) : tab === "color" ? (
          <ColorMatchGame />
        ) : tab === "word" ? (
          <WordScrambleGame />
        ) : tab === "memory" ? (
          <MemoryMatchGame />
        ) : tab === "typing" ? (
          <FastTypingGame />
        ) : (
          <SimonSaysGame />
        )}
      </div>
    </div>
  );
}
