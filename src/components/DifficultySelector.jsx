import React from "react";
import "../styles/components/difficulty-selector.css";

/**
 * DifficultySelector component
 * Provides a consistent UI for selecting game difficulty
 */
function DifficultySelector({
  currentDifficulty,
  onSetDifficulty,
  levels = ["easy", "medium", "hard"],
}) {
  return (
    <div className="difficulty-selector">
      <span>Difficulty:</span>
      {levels.map((level) => (
        <button
          key={level}
          className={currentDifficulty === level ? "active" : ""}
          onClick={() => onSetDifficulty(level)}
        >
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default DifficultySelector;
