import React from "react";
import "../styles/components/timer.css";

/**
 * Timer component
 * Displays a formatted time (MM:SS)
 * @param {number} time - Time in seconds
 * @param {string} label - Label for the timer
 * @param {boolean} compact - Whether to render in compact mode
 * @param {string} className - Additional CSS class
 */
function Timer({ time, label = "Time", compact = false, className = "" }) {
  // Format time to display MM:SS
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const combinedClassName = `game-timer ${
    compact ? "compact" : ""
  } ${className}`;

  return (
    <div className={combinedClassName}>
      <span className="timer-label">{label}</span>
      <span className="timer-value">{formatTime()}</span>
    </div>
  );
}

export default React.memo(Timer);
