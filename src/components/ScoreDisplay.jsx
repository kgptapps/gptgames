import React from "react";
import { useScore } from "../context/ScoreContext";
import "../styles/components/score-display.css";

/**
 * Score Display Component
 * Shows current score, multiplier, and streak information
 */
function ScoreDisplay() {
  const { score, multiplier, getCurrentStreak } = useScore();
  const currentStreak = getCurrentStreak();

  return (
    <div className="score-display">
      <div className="score-main">
        <span className="score-label">Score:</span>
        <span className="score-value">{score}</span>
      </div>

      {multiplier > 1 && (
        <div className="score-multiplier">
          <span className="multiplier-value">x{multiplier}</span>
        </div>
      )}

      {currentStreak > 1 && (
        <div className="score-streak">
          <span className="streak-value">{currentStreak} Streak!</span>
        </div>
      )}
    </div>
  );
}

export default ScoreDisplay;
