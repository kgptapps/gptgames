import React, { useState, useEffect, useRef } from "react";

/**
 * A sticky, permanent banner component that displays information about the app being built with Copilot
 * Features auto-minimize functionality and hover effects for better user experience
 */
const CopilotBanner = () => {
  const [minimized, setMinimized] = useState(true);
  const bannerRef = useRef(null);

  // Banner starts minimized by default
  // Auto-minimize effect for when users expand it
  useEffect(() => {
    if (!minimized) {
      // Auto-minimize after 8 seconds when expanded
      const timer = setTimeout(() => {
        setMinimized(true);
      }, 8000);

      // Click outside to minimize
      const handleClickOutside = (event) => {
        if (bannerRef.current && !bannerRef.current.contains(event.target)) {
          setMinimized(true);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [minimized]);

  const handleToggleMinimize = () => {
    setMinimized(!minimized);
  };

  if (minimized) {
    return (
      <div className="copilot-banner copilot-minimized" ref={bannerRef}>
        <div className="copilot-banner-content minimized">
          <button className="expand-button" onClick={handleToggleMinimize}>
            <span>
              <strong>Built with GitHub Copilot</strong> • Claude 3.7 Sonnet +
              GPT 4.1
            </span>
            <span className="expand-icon">▼</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="copilot-banner" ref={bannerRef}>
      <div className="copilot-banner-content">
        <div className="banner-header">
          <h2>
            <span role="img" aria-label="robot">
              🤖
            </span>{" "}
            Built with GitHub Copilot
          </h2>
          <div className="header-buttons">
            <button
              className="minimize-button"
              onClick={handleToggleMinimize}
              title="Minimize"
            >
              —
            </button>
          </div>
        </div>

        <div className="banner-body">
          <div className="ai-models">
            <span className="ai-model">Claude 3.7 Sonnet</span>
            <span className="ai-divider">+</span>
            <span className="ai-model">GPT 4.1</span>
          </div>

          <div className="features-section">
            <h3>Game Platform Features:</h3>
            <ul>
              <li>
                <strong>Multi-Game Collection</strong>
                <p>
                  Classic and modern games including Tic-Tac-Toe, Snake, Puzzle,
                  Memory Match and more
                </p>
              </li>
              <li>
                <strong>Player Stats & Tracking</strong>
                <p>
                  Persistent game statistics and progress tracking across games
                </p>
              </li>
              <li>
                <strong>Modern User Experience</strong>
                <p>Clean UI with responsive design for all device sizes</p>
              </li>
              <li>
                <strong>Analytics Integration</strong>
                <p>
                  Game metrics are tracked to provide insights into gameplay
                  patterns
                </p>
              </li>
              <li>
                <strong>Cross-Game Navigation</strong>
                <p>
                  Seamlessly switch between different games while maintaining
                  state
                </p>
              </li>
              <li>
                <strong>Customization Options</strong>
                <p>Personalize your gaming experience with various settings</p>
              </li>
            </ul>
          </div>

          <p className="disclaimer">
            <strong>Get Started:</strong> Select any game from the sidebar menu
            to begin playing!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopilotBanner;
