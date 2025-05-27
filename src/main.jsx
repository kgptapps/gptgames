import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { buildInfo } from "./buildInfo";

// Log the application version and build information in a styled format
console.log(
  `%c 🎮 Kannaiyan's Copilot Games %c v${buildInfo.version} %c Build #${buildInfo.buildNumber} `,
  "background: #646cff; color: white; font-weight: bold; border-radius: 3px 0 0 3px; padding: 2px 8px;",
  "background: #535bf2; color: white; font-weight: bold; padding: 2px 8px;",
  "background: #444; color: white; border-radius: 0 3px 3px 0; padding: 2px 8px;"
);
console.log(`Build Date: ${new Date(buildInfo.timestamp).toLocaleString()}`);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
