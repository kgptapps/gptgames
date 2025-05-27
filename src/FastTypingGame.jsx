import React, { useState, useEffect, useRef } from "react";

export default function FastTypingGame({ updateStats }) {
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [correctChars, setCorrectChars] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [lastTypedTime, setLastTypedTime] = useState(Date.now());
  const inputRef = useRef(null);

  // Sentence bank
  const sentenceBank = [
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!",
    "Programming is the art of telling another human what one wants the computer to do. Good code is like a good joke: it needs no explanation.",
    "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components.",
    "The best way to predict the future is to create it. Innovation distinguishes between a leader and a follower.",
    "Learning to write programs stretches your mind, and helps you think better, creates a way of thinking about things that is helpful in all domains.",
    "The computer was born to solve problems that did not exist before. Software is a great combination of artistry and engineering.",
    "Keyboards are like guitars. Some people can play beautifully, and others just use them as tools. Practice improves speed and accuracy.",
  ];

  // Generate new text paragraph
  const generateNewText = () => {
    // Select next paragraph from the bank in sequence
    const nextIndex = (currentSentenceIndex + 1) % sentenceBank.length;
    setCurrentSentenceIndex(nextIndex);
    setText(sentenceBank[nextIndex]);
    setUserInput("");
    setLastTypedTime(Date.now());

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Initialize game
  useEffect(() => {
    setText(sentenceBank[0]);
    setLastTypedTime(Date.now());

    // Start timer
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

  // Check for inactivity
  useEffect(() => {
    if (!gameActive) return;

    const inactivityCheck = setInterval(() => {
      const currentTime = Date.now();
      if (currentTime - lastTypedTime > 10000 && userInput.length > 0) {
        // Move to next sentence after 10 seconds of inactivity
        generateNewText();
      }
    }, 1000);

    return () => clearInterval(inactivityCheck);
  }, [gameActive, lastTypedTime, userInput]);

  // Calculate WPM and accuracy when game ends
  useEffect(() => {
    if (!gameActive) {
      // Standard WPM calculation (words / minutes)
      // Assuming 5 characters = 1 word
      const minutes = (60 - timeLeft) / 60;
      if (minutes > 0) {
        setWpm(Math.round(correctChars / 5 / minutes));
      }

      // Calculate accuracy
      if (totalTyped > 0) {
        setAccuracy(Math.round((correctChars / totalTyped) * 100));
      }
    }
  }, [gameActive, correctChars, timeLeft, totalTyped]);

  useEffect(() => {
    if (!gameActive && updateStats) {
      updateStats("typing", { completed: true });
    }
  }, [gameActive, updateStats]);

  // Handle user input
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setUserInput(inputValue);
    setTotalTyped((prev) => prev + 1);
    setLastTypedTime(Date.now());

    // Compare with current text
    const currentText = text.substring(0, inputValue.length);

    if (inputValue === currentText) {
      // Correct typing
      setCorrectChars((prevCorrectChars) => prevCorrectChars + 1);

      // If completed current sentence
      if (inputValue.length === text.length) {
        generateNewText();
      }
    } else {
      // Incorrect typing
      setErrors((prev) => prev + 1);
    }
  };

  // Restart game
  const handleRestart = () => {
    setCurrentSentenceIndex(0);
    setText(sentenceBank[0]);
    setUserInput("");
    setCorrectChars(0);
    setTimeLeft(60);
    setGameActive(true);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTotalTyped(0);
    setLastTypedTime(Date.now());
  };

  // Render text with highlighting
  const renderText = () => {
    // Split text into characters for individual styling
    const characters = text.split("");

    return (
      <div className="text-display">
        {characters.map((char, index) => {
          // Determine the status of each character
          let status = "upcoming";
          if (index < userInput.length) {
            status = userInput[index] === char ? "correct" : "incorrect";
          } else if (index === userInput.length) {
            status = "current";
          }

          // Add special class for spaces to make them visible
          const isSpace = char === " ";
          const charClass = `typing-char ${status}${
            isSpace ? " space-char" : ""
          }`;

          return (
            <span key={index} className={charClass}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="game-container typing-game-container">
      <h1>Speed Typing</h1>

      <div className="typing-stats">
        <div className="typing-score">
          WPM:{" "}
          {gameActive
            ? Math.round(correctChars / 5 / ((60 - timeLeft) / 60) || 0)
            : wpm}
        </div>
        <div className="typing-accuracy">
          Accuracy:{" "}
          {gameActive
            ? Math.round((correctChars / (totalTyped || 1)) * 100)
            : accuracy}
          %
        </div>
        <div className="typing-time">Time: {timeLeft}s</div>
      </div>

      {gameActive ? (
        <>
          <div className="typing-challenge">
            {renderText()}
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className={`typing-input ${
                userInput === text.substring(0, userInput.length)
                  ? "correct"
                  : "incorrect"
              }`}
              placeholder="Start typing..."
              autoFocus
            />
          </div>

          <div className="typing-instructions">
            <p>Type the text above. Green means correct, red means error.</p>
            <p>
              <small>
                Inactive for 10 seconds? We'll move to the next sentence.
              </small>
            </p>
          </div>

          <div className="typing-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(userInput.length / text.length) * 100}%` }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="game-over typing-complete">
          <h2>Time's up!</h2>
          <div className="typing-results">
            <p>Characters typed correctly: {correctChars}</p>
            <p>Your typing speed: {wpm} WPM</p>
            <p>Accuracy: {accuracy}%</p>
          </div>
          <button className="restart" onClick={handleRestart}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
