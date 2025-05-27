import React from "react";
import cardThemes from "../utils/cardThemes";
import "../styles/components/theme-selector.css";

/**
 * ThemeSelector component
 * Allows users to select different card themes
 */
function ThemeSelector({ currentTheme, onSelectTheme }) {
  return (
    <div className="theme-selector">
      <label htmlFor="theme-select">Card Theme:</label>
      <select
        id="theme-select"
        value={currentTheme}
        onChange={(e) => onSelectTheme(e.target.value)}
      >
        {Object.entries(cardThemes).map(([key, theme]) => (
          <option key={key} value={key}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ThemeSelector;
