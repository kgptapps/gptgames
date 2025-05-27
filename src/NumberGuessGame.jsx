import React, { useState, useEffect } from "react";

function getExtraTip(target, history, finished) {
  if (history.length === 0) return "";
  const last = history[history.length - 1];
  if (Math.abs(target - last) <= 3 && !finished) {
    return "🔥 You're very close!";
  }
  if (history.length > 2) {
    const diffs = history.map((g) => Math.abs(target - g));
    if (diffs[diffs.length - 1] < diffs[diffs.length - 2]) {
      return "👍 Getting warmer!";
    } else if (diffs[diffs.length - 1] > diffs[diffs.length - 2]) {
      return "❄️ Getting colder!";
    }
  }
  if (target % 2 === 0 && !finished) {
    return "Hint: The number is even.";
  }
  if (target % 2 !== 0 && !finished) {
    return "Hint: The number is odd.";
  }
  return "";
}

export default function NumberGuessGame({ updateStats }) {
  const [target, setTarget] = useState(
    () => Math.floor(Math.random() * 100) + 1
  );
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState([]);
  const [hint, setHint] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);

  useEffect(() => {
    if (gameOver && updateStats) {
      updateStats("guess", { win: isWin });
    }
    // Reset gameOver when a new game starts
    if (!finished) {
      setGameOver(false);
    }
  }, [gameOver, isWin, updateStats, finished]);

  const handleGuess = (e) => {
    e.preventDefault();
    const num = parseInt(guess, 10);
    if (isNaN(num) || num < 1 || num > 100) {
      setMessage("Enter a number between 1 and 100.");
      setHint("");
      return;
    }
    setAttempts((a) => a + 1);
    setHistory((h) => [...h, num]);
    if (num === target) {
      setMessage(
        `🎉 Correct! The number was ${target}. Attempts: ${attempts + 1}`
      );
      setHint("");
      setFinished(true);
      setGameOver(true);
      setIsWin(true);
    } else if (num < target) {
      setMessage("Too low!");
      setHint(target - num > 20 ? "Try much higher!" : "A bit higher!");
    } else {
      setMessage("Too high!");
      setHint(num - target > 20 ? "Try much lower!" : "A bit lower!");
    }
    setGuess("");
  };

  const handleRestart = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setMessage("");
    setAttempts(0);
    setFinished(false);
    setHistory([]);
    setHint("");
    setGameOver(false);
    setIsWin(false);
  };

  return (
    <div className="guess-game-container">
      <h2>Number Guess Game</h2>
      <p>Guess a number between 1 and 100.</p>
      <form onSubmit={handleGuess}>
        <input
          type="number"
          min="1"
          max="100"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={finished}
          className="guess-input"
        />
        <button type="submit" disabled={finished} className="guess-btn">
          Guess
        </button>
      </form>
      <div className="guess-message">{message}</div>
      {hint && !finished && <div className="guess-hint">💡 {hint}</div>}
      {/* Extra tips for more fun and help */}
      {!finished && getExtraTip(target, history, finished) && (
        <div className="guess-hint">
          ✨ {getExtraTip(target, history, finished)}
        </div>
      )}
      {history.length > 0 && (
        <div className="guess-history">
          <strong>Your guesses:</strong>
          <div className="guess-history-list">
            {history.map((g, i) => (
              <span key={i} className={g === target ? "correct-guess" : ""}>
                {g}
              </span>
            ))}
          </div>
        </div>
      )}
      {finished && (
        <button className="restart" onClick={handleRestart}>
          Play Again
        </button>
      )}
    </div>
  );
}
