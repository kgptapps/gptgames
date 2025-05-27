import React, { useEffect, useState } from "react";
import "../styles/components/confetti.css";

/**
 * Confetti component for celebration animations
 * Creates a burst of colorful particles when triggered
 */
const Confetti = ({ active = false, duration = 3000 }) => {
  const [particles, setParticles] = useState([]);
  const [isActive, setIsActive] = useState(false);

  // Generate confetti particles
  useEffect(() => {
    if (active && !isActive) {
      const colors = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"];
      const particleCount = 150;
      const newParticles = [];

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * -10 - 20,
          size: Math.random() * 8 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          speedX: Math.random() * 6 - 3,
          speedY: Math.random() * 10 + 5,
          speedRotation: Math.random() * 10 - 5,
        });
      }

      setParticles(newParticles);
      setIsActive(true);

      // Clean up after duration
      const timer = setTimeout(() => {
        setIsActive(false);
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, isActive, duration]);

  if (!isActive) return null;

  return (
    <div className="confetti-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size * 0.6}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `fall ${duration}ms linear forwards`,
            "--speed-x": `${particle.speedX}px`,
            "--speed-y": `${particle.speedY}px`,
            "--rotation-speed": `${particle.speedRotation}deg`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
