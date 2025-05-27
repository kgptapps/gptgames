import { useState, useEffect } from "react";

/**
 * Custom hook for creating a game timer
 * @param {boolean} isRunning - Whether the timer should be running
 * @param {number} initialTime - Initial time in seconds (default: 0)
 * @returns {Object} - Time values and control functions
 */
export function useGameTimer(isRunning = false, initialTime = 0) {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(isRunning);
  const [isPaused, setIsPaused] = useState(false);

  // Start the timer
  const start = () => {
    setIsActive((prev) => {
      if (prev) return prev; // Prevent multiple intervals
      return true;
    });
    setIsPaused(false);
  };

  // Pause the timer
  const pause = () => {
    setIsPaused(true);
  };

  // Resume the timer
  const resume = () => {
    setIsPaused(false);
  };

  // Reset the timer
  const reset = (newInitialTime = initialTime) => {
    setTime(newInitialTime);
    setIsPaused(false);
  };

  // Stop the timer
  const stop = () => {
    setIsActive(false);
    setIsPaused(false);
  };

  // Format time to display MM:SS
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Timer logic
  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  return {
    time,
    isActive,
    isPaused,
    start,
    pause,
    resume,
    reset,
    stop,
    formatTime,
  };
}

export default useGameTimer;
