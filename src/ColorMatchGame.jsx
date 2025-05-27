import React, { useState, useEffect } from "react";
import withGameStats from "./hooks/withGameStats";
import { useActiveGame } from "./context/ActiveGameContext";

const COLORS = ["#36d1c4", "#4f8cff", "#9651ff", "#ff4e50", "#7ad236"];

function ColorMatchGame({ updateStats }) {
  const { updateActiveGame, activeGame } = useActiveGame();
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [colorWord, setColorWord] = useState("");
  const [displayColor, setDisplayColor] = useState("");
  const [colorOptions, setColorOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [roundOver, setRoundOver] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentScore, setCurrentScore] = useState(0); // Ensure currentScore is always defined

  const colorNames = ["Blue", "Red", "Green", "Cyan", "Purple"];
  const colorValues = {
    Blue: "#4f8cff",
    Red: "#ff4e50",
    Green: "#7ad236",
    Cyan: "#36d1c4",
    Purple: "#9651ff",
  };

  const initRound = () => {
    const nameIndex = Math.floor(Math.random() * colorNames.length);
    const wordColorName = colorNames[nameIndex];

    // Choose a random color for displaying the word (may be different from the word itself)
    let displayColorName;
    const shouldMismatch = Math.random() > 0.5;

    if (shouldMismatch) {
      // Choose a different color
      const otherColors = colorNames.filter((color) => color !== wordColorName);
      displayColorName =
        otherColors[Math.floor(Math.random() * otherColors.length)];
    } else {
      // Match the word and color
      displayColorName = wordColorName;
    }

    setColorWord(wordColorName);
    setDisplayColor(colorValues[displayColorName]);

    // Generate answer options (always include the display color)
    let options = [displayColorName];
    while (options.length < 3) {
      const option = colorNames[Math.floor(Math.random() * colorNames.length)];
      if (!options.includes(option)) {
        options.push(option);
      }
    }

    // Shuffle options
    options = options.sort(() => Math.random() - 0.5);
    setColorOptions(options);
    setRoundOver(false);
  };

  useEffect(() => {
    initRound();
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Only set active game if not already set to 'color' and only on mount
    if (activeGame !== "color") {
      updateActiveGame("color");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  useEffect(() => {
    if (roundOver && updateStats) {
      updateStats("color", { correct: isCorrect });
    }
  }, [roundOver, isCorrect, updateStats]);

  // Call updateStats when a round is completed
  useEffect(() => {
    if (
      typeof currentScore !== "undefined" &&
      isCorrect !== null &&
      updateStats
    ) {
      const score = isCorrect ? currentScore : 0;
      updateStats("color", {
        correct: isCorrect,
        played: true,
        best: score, // The hook will only update 'best' if this is higher than previous best
      });
    }
    // Only run when isCorrect changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCorrect, currentScore]);

  const handleAnswer = (answer) => {
    if (gameOver) return;

    // Check if the DISPLAY COLOR name matches the clicked answer
    const correctAnswer = Object.keys(colorValues).find(
      (key) => colorValues[key] === displayColor
    );

    if (answer === correctAnswer) {
      setScore((prev) => prev + 1);
      setFeedback("Correct! +1 point");
      setIsCorrect(true);
      setTimeout(() => setFeedback(""), 1000);
    } else {
      setFeedback("Wrong! The display color was " + correctAnswer);
      setIsCorrect(false);
      setTimeout(() => setFeedback(""), 1500);
    }

    setRoundOver(true);
    initRound();
  };

  const handleRestart = () => {
    setScore(0);
    setTime(30);
    setGameOver(false);
    initRound();
  };

  return (
    <div className="game-container color-match-container">
      <h1>Color Match Game</h1>
      <div className="color-match-info">
        <div className="score">Score: {score}</div>
        <div className="timer">Time: {time}s</div>
      </div>
      {!gameOver ? (
        <>
          <div className="color-match-challenge">
            <h2 style={{ color: displayColor }} className="color-word">
              {colorWord}
            </h2>
            <p>What color is the text displayed in?</p>
          </div>
          <div className="color-options">
            {colorOptions.map((color, index) => (
              <button
                key={index}
                className="color-option"
                style={{ backgroundColor: colorValues[color] }}
                onClick={() => handleAnswer(color)}
              >
                {color}
              </button>
            ))}
          </div>
          {feedback && <div className="feedback">{feedback}</div>}
        </>
      ) : (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your final score: {score}</p>
          <button className="restart" onClick={handleRestart}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// Export the component wrapped with stats capabilities
export default withGameStats(ColorMatchGame, {
  gameKey: "color",
  supportedStats: ["correct", "best", "played"],
  displayNames: {
    correct: "Correct Matches",
    best: "Best Score",
    played: "Games Played",
  },
});
