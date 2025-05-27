import React from "react";

/**
 * GameOverModal component
 * Displays game over information and provides restart functionality
 */
function GameOverModal({
  message,
  subMessage,
  onRestart,
  buttonText = "Play Again",
}) {
  return (
    <div className="game-over-modal">
      <h2>{message}</h2>
      {subMessage && <p>{subMessage}</p>}
      <button className="restart" onClick={onRestart}>
        {buttonText}
      </button>
    </div>
  );
}

export default GameOverModal;
