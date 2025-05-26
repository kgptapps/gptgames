import React, { useState } from "react";
import TicTacToe from "./TicTacToe";
import NumberGuessGame from "./NumberGuessGame";
import PuzzleGame from "./PuzzleGame";
import ColorMatchGame from "./ColorMatchGame";
import WordScrambleGame from "./WordScrambleGame";
import MemoryMatchGame from "./MemoryMatchGame";
import FastTypingGame from "./FastTypingGame";
import SimonSaysGame from "./SimonSaysGame";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("tictactoe");
  return (
    <div>
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
