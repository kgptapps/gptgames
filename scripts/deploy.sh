#!/bin/bash

# Script to deploy to GitHub Pages manually
echo "Starting deployment to GitHub Pages..."

# Build the project
echo "Building project..."
npm run build

# Deploy to GitHub Pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "Deployment complete!"
