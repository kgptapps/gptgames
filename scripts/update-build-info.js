#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

// Generate a build number based on timestamp
const timestamp = new Date().toISOString();
const buildNumber = `${Date.now()}`;

// Create build info content
const buildInfo = `// This file is generated during the build process
export const buildInfo = {
  version: "${packageJson.version}",
  timestamp: "${timestamp}",
  buildNumber: "${buildNumber}"
};`;

// Write to the buildInfo.js file
const filePath = path.join(__dirname, "../src/buildInfo.js");
fs.writeFileSync(filePath, buildInfo, "utf8");

console.log(`Build info updated: v${packageJson.version} (${buildNumber})`);
