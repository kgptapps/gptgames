import React, { useState, useCallback, useEffect, useRef } from "react";
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
import CopilotBanner from "./components/CopilotBanner";
import useGameStats from "./hooks/useGameStats";
import { trackGameEvent, trackGameChange } from "./utils/analytics";

export default function App() {
  const [tab, setTab] = useState("tictactoe");
  const [showBuildInfo, setShowBuildInfo] = useState(false);
  const [gameStats, updateStats] = useGameStats();
  const previousTabRef = useRef("tictactoe");

  const formattedDate = new Date(buildInfo.timestamp).toLocaleString();

  // Track initial page load
  useEffect(() => {
    trackGameEvent("app", "page_load", {
      initial_game: tab,
      build_version: buildInfo.version,
      build_number: buildInfo.buildNumber,
    });
  }, []);

  // Handle game tab changes with tracking
  const changeTab = useCallback((newTab) => {
    const prevTab = previousTabRef.current;
    if (newTab !== prevTab) {
      trackGameChange(prevTab, newTab);
      previousTabRef.current = newTab;
      setTab(newTab);
    }
  }, []);

  const toggleBuildInfo = () => {
    setShowBuildInfo(!showBuildInfo);
  };

  return (
    <div className="app-container">
      <CopilotBanner />
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
            onClick={() => changeTab("tictactoe")}
          >
            Tic Tac Toe
          </button>
          <button
            className={tab === "guess" ? "tab active" : "tab"}
            onClick={() => changeTab("guess")}
          >
            Number Guess
          </button>
          <button
            className={tab === "puzzle" ? "tab active" : "tab"}
            onClick={() => changeTab("puzzle")}
          >
            Puzzle
          </button>
          <button
            className={tab === "color" ? "tab active" : "tab"}
            onClick={() => changeTab("color")}
          >
            Color Match
          </button>
          <button
            className={tab === "word" ? "tab active" : "tab"}
            onClick={() => changeTab("word")}
          >
            Word Scramble
          </button>
          <button
            className={tab === "memory" ? "tab active" : "tab"}
            onClick={() => changeTab("memory")}
          >
            Memory Match
          </button>
          <button
            className={tab === "typing" ? "tab active" : "tab"}
            onClick={() => changeTab("typing")}
          >
            Speed Typing
          </button>
          <button
            className={tab === "simon" ? "tab active" : "tab"}
            onClick={() => changeTab("simon")}
          >
            Simon Says
          </button>
          <button
            className={tab === "snake" ? "tab active" : "tab"}
            onClick={() => changeTab("snake")}
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
