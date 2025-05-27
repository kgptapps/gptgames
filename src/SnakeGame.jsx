import React, { useState, useEffect, useCallback, useRef } from "react";
import withGameStats from "./hooks/withGameStats";
import { trackGameEvent } from "./utils/analytics";

// Game constants
const GRID_SIZE = 25; // Increased from 20
const CELL_SIZE = 24; // Increased from 20 pixels
const GAME_SPEED = 150; // ms
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

// Initial snake state
const initialSnake = [
  { x: 12, y: 12 }, // Head
  { x: 11, y: 12 },
  { x: 10, y: 12 },
];

function SnakeGame({ updateStats }) {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState({ x: 18, y: 12 });
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [maxLength, setMaxLength] = useState(initialSnake.length);
  const gameLoopRef = useRef(null);
  const directionRef = useRef(DIRECTIONS.RIGHT);

  // Generate random food position
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };

    // Make sure food doesn't spawn on the snake
    const isOnSnake = snake.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y
    );

    return isOnSnake ? generateFood() : newFood;
  }, [snake]);

  // Check for collision with walls or self
  const checkCollision = useCallback(
    (head) => {
      // Wall collision
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        return true;
      }

      // Self collision (check all segments except the last one, as it will move)
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          return true;
        }
      }

      return false;
    },
    [snake]
  );

  // Game loop
  const moveSnake = useCallback(() => {
    if (gameOver || paused) return;

    setSnake((prevSnake) => {
      // Create new head based on current direction
      const head = { ...prevSnake[0] };
      head.x += directionRef.current.x;
      head.y += directionRef.current.y;

      // Check for collision
      if (checkCollision(head)) {
        // Schedule state updates for next tick to avoid updating during render
        setTimeout(() => {
          setGameOver(true);

          // Track game over event with analytics
          trackGameEvent("snake", "game_over", {
            score,
            length: prevSnake.length,
            high_score: score > highScore ? score : highScore,
          });

          if (updateStats) {
            updateStats("snake", {
              score,
              highScore: score > highScore ? score : highScore,
              maxLength: prevSnake.length,
              played: 1, // Increment played count on game over
            });
          }
          if (score > highScore) {
            setHighScore(score);
          }
        }, 0);
        return prevSnake;
      }

      // Create new snake array
      const newSnake = [head, ...prevSnake];

      // Check if snake ate the food
      if (head.x === food.x && head.y === food.y) {
        setTimeout(() => {
          setScore((s) => s + 10);
          setFood(generateFood());

          // Track food eaten event with analytics
          trackGameEvent("snake", "food_eaten", {
            score: score + 10,
            new_length: newSnake.length,
            position_x: head.x,
            position_y: head.y,
          });

          // Update current length stat when snake grows, but don't increment played
          if (updateStats) {
            updateStats("snake", {
              currentLength: newSnake.length,
              played: 0, // Don't increment played count for eating
            });
          }
        }, 0);
      } else {
        // Remove tail if no food was eaten
        newSnake.pop();
      }

      return newSnake;
    });
  }, [
    checkCollision,
    food,
    gameOver,
    paused,
    generateFood,
    score,
    highScore,
    updateStats,
  ]);

  // Track maximum snake length
  useEffect(() => {
    if (snake.length > maxLength) {
      setMaxLength(snake.length);
      if (updateStats) {
        updateStats("snake", { maxLength: snake.length });
      }
    }
  }, [snake.length, maxLength, updateStats]);

  // Init game loop
  useEffect(() => {
    gameLoopRef.current = setInterval(() => {
      moveSnake();
    }, GAME_SPEED);

    // Update initial length stat when component mounts, but don't increment played
    if (updateStats) {
      updateStats("snake", {
        currentLength: initialSnake.length,
        played: 0, // Don't increment played when component mounts
      });
    }

    return () => clearInterval(gameLoopRef.current);
  }, [moveSnake, updateStats]);

  // Handle keyboard controls
  const handleKeyDown = useCallback((e) => {
    e.preventDefault();

    // Prevent snake from going in the opposite direction
    switch (e.key) {
      case "ArrowUp":
        if (directionRef.current !== DIRECTIONS.DOWN) {
          directionRef.current = DIRECTIONS.UP;
          setDirection(DIRECTIONS.UP);
        }
        break;
      case "ArrowDown":
        if (directionRef.current !== DIRECTIONS.UP) {
          directionRef.current = DIRECTIONS.DOWN;
          setDirection(DIRECTIONS.DOWN);
        }
        break;
      case "ArrowLeft":
        if (directionRef.current !== DIRECTIONS.RIGHT) {
          directionRef.current = DIRECTIONS.LEFT;
          setDirection(DIRECTIONS.LEFT);
        }
        break;
      case "ArrowRight":
        if (directionRef.current !== DIRECTIONS.LEFT) {
          directionRef.current = DIRECTIONS.RIGHT;
          setDirection(DIRECTIONS.RIGHT);
        }
        break;
      case " ": // Spacebar to pause/resume
        setPaused((p) => !p);
        break;
      case "r": // 'r' to reset
        if (gameOver) resetGame();
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    // Focus on the game container when mounted
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Reset the game
  const resetGame = () => {
    setSnake(initialSnake);
    setFood(generateFood());
    setDirection(DIRECTIONS.RIGHT);
    directionRef.current = DIRECTIONS.RIGHT;
    setGameOver(false);
    setScore(0);
    setPaused(false);

    // Track game reset event
    trackGameEvent("snake", "game_reset", {
      from_game_over: gameOver,
      previous_score: score,
      previous_length: snake.length,
    });

    // Reset game loop
    clearInterval(gameLoopRef.current);
    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);

    // Update stats with initial snake length and increment played count if coming from game over
    if (updateStats && gameOver) {
      updateStats("snake", {
        currentLength: initialSnake.length,
        played: 1, // Increment played count only when starting a new game
      });
    } else if (updateStats) {
      // Just update the current length without incrementing played
      updateStats("snake", {
        currentLength: initialSnake.length,
        played: 0, // Don't increment played count for restarts
      });
    }
  };

  // Direction button handlers for mobile/touch support
  const handleDirectionButton = (dir) => {
    if (
      (dir === DIRECTIONS.UP && directionRef.current !== DIRECTIONS.DOWN) ||
      (dir === DIRECTIONS.DOWN && directionRef.current !== DIRECTIONS.UP) ||
      (dir === DIRECTIONS.LEFT && directionRef.current !== DIRECTIONS.RIGHT) ||
      (dir === DIRECTIONS.RIGHT && directionRef.current !== DIRECTIONS.LEFT)
    ) {
      directionRef.current = dir;
      setDirection(dir);
    }
  };

  return (
    <div className="snake-game-container">
      <h2>Snake Game</h2>
      <p>Use arrow keys to control the snake. Eat food to grow longer!</p>

      <div className="game-status">
        {gameOver && <span className="game-over">Game Over!</span>}
        {paused && !gameOver && <span className="paused">Paused</span>}
        {!gameOver && !paused && <span className="score">Score: {score}</span>}
      </div>

      <div className="game-layout">
        <div
          className="snake-board"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            border: "3px solid #333",
            background: "#f0f0f0",
            position: "relative",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Draw food */}
          <div
            style={{
              position: "absolute",
              left: food.x * CELL_SIZE + 5,
              top: food.y * CELL_SIZE + 5,
              width: CELL_SIZE - 10,
              height: CELL_SIZE - 10,
              backgroundColor: "#ff3d00",
              borderRadius: "50%",
              boxShadow: "0 0 8px rgba(255, 61, 0, 0.6)",
            }}
          />

          {/* Draw snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: segment.x * CELL_SIZE + (index === 0 ? 3 : 4),
                top: segment.y * CELL_SIZE + (index === 0 ? 3 : 4),
                width: index === 0 ? CELL_SIZE - 6 : CELL_SIZE - 8,
                height: index === 0 ? CELL_SIZE - 6 : CELL_SIZE - 8,
                backgroundColor: index === 0 ? "#2e7d32" : "#4caf50", // Head is darker
                border: index === 0 ? "1px solid #1b5e20" : "none",
                borderRadius: index === 0 ? "4px" : "2px",
                boxShadow: index === 0 ? "0 0 5px rgba(0, 0, 0, 0.2)" : "none",
              }}
            />
          ))}
        </div>
        
        {/* Controls for mobile/touch - now on the right side */}
        <div className="side-controls">
          <div className="touch-controls">
            <div className="direction-buttons">
              <button onClick={() => handleDirectionButton(DIRECTIONS.UP)}>
                ↑
              </button>
              <div className="horizontal-buttons">
                <button onClick={() => handleDirectionButton(DIRECTIONS.LEFT)}>
                  ←
                </button>
                <button onClick={() => handleDirectionButton(DIRECTIONS.RIGHT)}>
                  →
                </button>
              </div>
              <button onClick={() => handleDirectionButton(DIRECTIONS.DOWN)}>
                ↓
              </button>
            </div>
          </div>

          <div className="game-controls">
            <button onClick={() => setPaused(!paused)}>
              {paused ? "Resume" : "Pause"}
            </button>
            <button onClick={resetGame} disabled={!gameOver && !paused}>
              {gameOver ? "Play Again" : "Restart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withGameStats(SnakeGame, {
  gameKey: "snake",
  supportedStats: [
    "score",
    "highScore",
    "played",
    "currentLength",
    "maxLength",
  ],
  displayNames: {
    score: "Last Score",
    highScore: "High Score",
    played: "Games Played",
    currentLength: "Snake Length",
    maxLength: "Max Length",
  },
});
