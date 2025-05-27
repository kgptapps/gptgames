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
          <a
            href="https://github.com/kgptapps/gptgames"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link minimized"
            title="View source code on GitHub"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
          </a>
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
            <a
              href="https://github.com/kgptapps/gptgames"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link expanded"
              title="View source code on GitHub"
            >
              <svg
                viewBox="0 0 16 16"
                width="20"
                height="20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                />
              </svg>
              <span>View Source</span>
            </a>
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
