import React, { useState, useEffect } from "react";

// Words organized by difficulty
const WORD_LEVELS = {
  easy: [
    "REACT",
    "CODE",
    "GAME",
    "WORD",
    "PLAY",
    "FUN",
    "HTML",
    "FONT",
    "CSS",
    "LINK",
  ],
  medium: [
    "PUZZLE",
    "CODING",
    "METHOD",
    "ARRAY",
    "STRING",
    "OBJECT",
    "SCRIPT",
    "RENDER",
    "BUTTON",
    "DESIGN",
  ],
  hard: [
    "JAVASCRIPT",
    "DEVELOPER",
    "INTERFACE",
    "COMPONENT",
    "FUNCTION",
    "VARIABLE",
    "ALGORITHM",
    "FRONTEND",
    "FRAMEWORK",
    "DATABASE",
  ],
};

export default function WordScrambleGame({ updateStats }) {
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [currentLevel, setCurrentLevel] = useState("easy");
  const [skipCount, setSkipCount] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attemptedWords, setAttemptedWords] = useState(0);

  const [solved, setSolved] = useState(false);

  // Adaptive difficulty: update level based on player performance
  useEffect(() => {
    if (correctAnswers >= 3 && currentLevel === "easy") {
      setCurrentLevel("medium");
      setMessage("Level up! Medium words now.");
    } else if (correctAnswers >= 7 && currentLevel === "medium") {
      setCurrentLevel("hard");
      setMessage("Level up! Hard words now.");
    }
  }, [correctAnswers, currentLevel]);

  // Call updateStats when a word is solved
  useEffect(() => {
    if (solved && updateStats) {
      updateStats("word", { solved: true });
    }
  }, [solved, updateStats]);

  // Pick a random word and scramble it
  const generateNewWord = () => {
    const wordPool = WORD_LEVELS[currentLevel];
    const word = wordPool[Math.floor(Math.random() * wordPool.length)];
    setCurrentWord(word);
    setScrambledWord(scrambleWord(word));
    setUserGuess("");
    setSolved(false);
  };

  // Fisher-Yates shuffle algorithm to scramble the word
  const scrambleWord = (word) => {
    const arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Make sure the scrambled word is different from the original
    if (arr.join("") === word) {
      return scrambleWord(word);
    }
    return arr.join("");
  };

  // Handle user input
  const handleInputChange = (e) => {
    setUserGuess(e.target.value.toUpperCase());
  };

  // Check if guess is correct
  const handleSubmit = (e) => {
    e.preventDefault();
    setAttemptedWords(attemptedWords + 1);

    if (userGuess.toUpperCase() === currentWord) {
      const pointValue =
        currentLevel === "easy" ? 1 : currentLevel === "medium" ? 2 : 3;
      setScore(score + pointValue);
      setCorrectAnswers(correctAnswers + 1);
      setMessage(`Correct! +${pointValue} points`);
      setSolved(true);
      setTimeout(() => {
        generateNewWord();
        setMessage("");
      }, 1500);
    } else {
      setMessage("Try again!");
    }
  };

  // Get a new word (skip current one)
  const handleSkipWord = () => {
    if (skipCount >= 3) {
      setMessage("No more skips left!");
      return;
    }

    setSkipCount(skipCount + 1);
    setMessage(`Word skipped! (${3 - skipCount - 1} skips left)`);
    generateNewWord();
  };

  // Get a hint (show one correct letter)
  const getHint = () => {
    const minPoints =
      currentLevel === "easy" ? 2 : currentLevel === "medium" ? 3 : 4;

    if (score < minPoints) {
      setMessage(`You need at least ${minPoints} points for a hint`);
      return;
    }

    const correctLetters = currentWord.split("");
    let hintIndex;

    // Find a position where the user hasn't guessed correctly yet
    if (userGuess.length === 0) {
      hintIndex = Math.floor(Math.random() * currentWord.length);
    } else {
      const incorrectPositions = [];
      for (let i = 0; i < currentWord.length; i++) {
        if (i >= userGuess.length || userGuess[i] !== currentWord[i]) {
          incorrectPositions.push(i);
        }
      }

      if (incorrectPositions.length === 0) {
        setMessage("You're already on the right track!");
        return;
      }

      hintIndex =
        incorrectPositions[
          Math.floor(Math.random() * incorrectPositions.length)
        ];
    }

    // Update the user's guess with the hint
    const updatedGuess = userGuess.split("");
    updatedGuess[hintIndex] = currentWord[hintIndex];
    setUserGuess(updatedGuess.join(""));

    // Deduct points for using a hint
    const deduction =
      currentLevel === "easy" ? 2 : currentLevel === "medium" ? 3 : 4;
    setScore(score - deduction);
    setMessage(`Hint used! -${deduction} points`);
  };

  // Calculate performance stats
  const calculatePerformance = () => {
    const accuracy =
      attemptedWords > 0
        ? Math.round((correctAnswers / attemptedWords) * 100)
        : 0;
    const wordsPerMinute = Math.round(correctAnswers / (60 / 60));

    let skillLevel = "Beginner";
    if (score > 20) skillLevel = "Expert";
    else if (score > 15) skillLevel = "Advanced";
    else if (score > 10) skillLevel = "Intermediate";
    else if (score > 5) skillLevel = "Novice";

    return { accuracy, wordsPerMinute, skillLevel };
  };

  // Reset game
  const resetGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setCurrentLevel("easy");
    setSkipCount(0);
    setCorrectAnswers(0);
    setAttemptedWords(0);
    generateNewWord();
  };

  // Initialize game and timer
  useEffect(() => {
    generateNewWord();

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const performance = calculatePerformance();

  return (
    <div className="game-container word-scramble-container">
      <h1>Word Scramble</h1>
      <div className="word-scramble-info">
        <div className="score">Score: {score}</div>
        <div className="level">Level: {currentLevel}</div>
        <div className="timer">Time: {timeLeft}s</div>
      </div>

      {gameActive ? (
        <>
          <div className="scrambled-word">{scrambledWord}</div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userGuess}
              onChange={handleInputChange}
              className="word-input"
              placeholder="Type your guess"
              maxLength={currentWord.length}
              autoFocus
            />
            <button type="submit" className="word-submit-btn">
              Submit
            </button>
          </form>
          <div className="word-actions">
            <button
              onClick={getHint}
              className="hint-button"
              disabled={score < 2}
            >
              Get Hint (-
              {currentLevel === "easy"
                ? 2
                : currentLevel === "medium"
                ? 3
                : 4}{" "}
              points)
            </button>
            <button
              onClick={handleSkipWord}
              className="skip-button"
              disabled={skipCount >= 3}
            >
              New Word ({3 - skipCount} skips left)
            </button>
          </div>
          {message && <div className="word-message">{message}</div>}
        </>
      ) : (
        <div className="game-over word-scramble-results">
          <h2>Time's Up!</h2>
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-label">Final score:</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Words solved:</span>
              <span className="stat-value">{correctAnswers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Accuracy:</span>
              <span className="stat-value">{performance.accuracy}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Words per minute:</span>
              <span className="stat-value">{performance.wordsPerMinute}</span>
            </div>
            <div className="skill-level">
              <span className="stat-label">Skill level:</span>
              <span className="stat-value">{performance.skillLevel}</span>
            </div>
          </div>
          <button className="restart" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
