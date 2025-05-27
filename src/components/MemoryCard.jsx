import React, { useEffect, useState, memo } from "react";

/**
 * MemoryCard component
 * Represents a single card in the Memory Match Game
 * Supports animation for matched cards
 * Includes accessibility features
 */
function MemoryCard({ id, content, isFlipped, isMatched, onClick }) {
  const [animate, setAnimate] = useState(false);

  // Apply animation when a match is found
  useEffect(() => {
    if (isMatched) {
      setAnimate(true);
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isMatched]);

  const cardStyle = animate ? { animation: "pulse 0.6s ease" } : {};

  // Generate description for screen readers
  const getAriaLabel = () => {
    if (isMatched) return `Card ${content}, matched`;
    if (isFlipped) return `Card ${content}, flipped`;
    return "Card, face down";
  };

  return (
    <div
      className={`memory-card ${isFlipped || isMatched ? "flipped" : ""} ${
        isMatched ? "matched" : ""
      }`}
      onClick={() => onClick(id)}
      data-testid={`card-${id}`}
      role="button"
      aria-label={getAriaLabel()}
      aria-pressed={isFlipped || isMatched}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(id);
          e.preventDefault();
        }
      }}
    >
      <div className="memory-card-inner" style={cardStyle}>
        <div className="memory-card-front"></div>
        <div className="memory-card-back">
          <span className="memory-card-content">{content}</span>
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(MemoryCard, (prevProps, nextProps) => {
  return (
    prevProps.isFlipped === nextProps.isFlipped &&
    prevProps.isMatched === nextProps.isMatched
  );
});
