import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.css";
import App from "./App.jsx";
import { buildInfo } from "./buildInfo";

// Log minimal information
console.log(
  `%c 🎮 Copilot Games `,
  "background: #646cff; color: white; font-weight: bold; border-radius: 3px; padding: 2px 8px;"
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
