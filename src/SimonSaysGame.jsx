import React, { useState, useEffect, useRef } from "react";

export default function SimonSaysGame() {
  const [gameSequence, setGameSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);

  // Refs
  const intervalId = useRef(null);
  const buttonRefs = {
    green: useRef(),
    red: useRef(),
    yellow: useRef(),
    blue: useRef(),
  };

  // Sounds and colors
  const colors = ["green", "red", "yellow", "blue"];

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem("simonSaysHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score to localStorage when it changes
  useEffect(() => {
    if (highScore > 0) {
      localStorage.setItem("simonSaysHighScore", highScore.toString());
    }
  }, [highScore]); // Start a new game
  const startGame = () => {
    setGameSequence([]);
    setPlayerSequence([]);
    setIsPlaying(true);
    setIsPlayerTurn(false);
    setScore(0);
    setGameOver(false);
    setPlayingIndex(null);
    setCurrentRound(0);

    // Clear any existing intervals
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }

    // Use setTimeout to ensure all state updates are processed
    setTimeout(() => {
      addToSequence();
    }, 500);
  };

  // Add a random color to the sequence
  const addToSequence = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setGameSequence((prevSequence) => {
      const newSequence = [...prevSequence, randomColor];
      console.log("New sequence:", newSequence); // Debug

      // Set current round
      setCurrentRound(newSequence.length);

      // Use setTimeout to ensure state is updated before playing
      setTimeout(() => {
        playSequence(newSequence);
      }, 500); // Longer delay to ensure UI updates first

      return newSequence;
    });
  };

  // Play the sequence for the player to observe
  const playSequence = (sequence) => {
    setIsPlayerTurn(false);
    console.log("Playing sequence:", sequence); // Debugging

    // React-friendly way to play through the sequence
    let step = 0;

    // Clear any existing intervals just to be safe
    const currentIntervalId = intervalId.current;
    if (currentIntervalId) {
      clearInterval(currentIntervalId);
    }

    const newIntervalId = setInterval(() => {
      if (step < sequence.length * 2) {
        // Even steps highlight a button, odd steps turn it off
        if (step % 2 === 0) {
          // Turn on highlight - get color index
          const colorIndex = colors.indexOf(sequence[Math.floor(step / 2)]);
          console.log(`Highlighting: ${sequence[Math.floor(step / 2)]}`); // Debug
          setPlayingIndex(colorIndex);
        } else {
          // Turn off highlight
          setPlayingIndex(null);
        }
        step++;
      } else {
        // We're done with the sequence
        clearInterval(newIntervalId);
        intervalId.current = null;
        setPlayingIndex(null);
        setIsPlayerTurn(true);
        setPlayerSequence([]);
        console.log("Sequence complete, player's turn");
      }
    }, 500); // Slightly slower timing for better visibility

    intervalId.current = newIntervalId;

    // Clean up the interval if component unmounts during playback
    return () => {
      clearInterval(newIntervalId);
      intervalId.current = null;
    };
  };

  // Highlight a color button - now using React state instead of DOM manipulation
  const highlightColor = (color, duration) => {
    return new Promise((resolve) => {
      // A temporary highlight that doesn't rely on DOM
      setPlayingIndex(colors.indexOf(color));

      setTimeout(() => {
        setPlayingIndex(null);
        resolve();
      }, duration);
    });
  };

  // Add sound effects for better feedback
  const playSound = (color) => {
    // This could be enhanced later by adding actual sounds
    // For now it's just a placeholder for future sound implementation
    console.log(`Playing ${color} sound`);
  };

  // Handle player clicking a color
  const handleColorClick = (color) => {
    if (!isPlayerTurn || gameOver) return;

    // Create a temporary highlight effect
    setPlayingIndex(colors.indexOf(color));

    // Add to player's sequence and check after highlight ends
    setTimeout(() => {
      setPlayingIndex(null);

      // Check if the color clicked matches the expected color in the sequence
      const currentIndex = playerSequence.length;
      const expectedColor = gameSequence[currentIndex];

      if (color !== expectedColor) {
        // Wrong color - game over
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
        }
        return;
      }

      // Color is correct - add it to player sequence
      const newPlayerSequence = [...playerSequence, color];
      setPlayerSequence(newPlayerSequence);

      // If player finished the sequence correctly
      if (newPlayerSequence.length === gameSequence.length) {
        setScore((prev) => prev + 1);
        setIsPlayerTurn(false);

        // Wait a bit before starting next round
        setTimeout(() => {
          addToSequence();
        }, 1000);
      }
    }, 200);
  };

  return (
    <div className="game-container simon-game-container">
      <h1>Simon Says</h1>

      <div className="simon-stats">
        <div className="simon-score">Score: {score}</div>
        <div className="simon-high-score">High Score: {highScore}</div>
        <div className="simon-round">Round: {currentRound}</div>
      </div>

      {!isPlaying ? (
        <div className="simon-start">
          <p>Watch the pattern, then repeat it!</p>
          <button className="simon-start-btn" onClick={startGame}>
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div
            className={`simon-status ${
              isPlayerTurn ? "player-turn" : "computer-turn"
            }`}
          >
            {isPlayerTurn
              ? "Your turn! Repeat the pattern."
              : "Watch carefully..."}
          </div>

          <div className="simon-grid">
            {colors.map((color, index) => (
              <button
                key={color}
                ref={buttonRefs[color]}
                className={`simon-button simon-${color} ${
                  playingIndex === index ? "highlight" : ""
                }`}
                onClick={() => handleColorClick(color)}
                disabled={!isPlayerTurn}
              />
            ))}
          </div>

          {gameOver && (
            <div className="simon-game-over">
              <h2>Game Over!</h2>
              <p>Your score: {score}</p>
              <button className="restart" onClick={startGame}>
                Play Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
