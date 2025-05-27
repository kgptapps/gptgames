# Copilot Games

![GitHub Pages Deployment](https://github.com/kgptapps/gptgames/actions/workflows/deploy.yml/badge.svg)

A collection of browser-based games built with React and Vite, including Tic Tac Toe, Fast Typing, Simon Says, and more! These games were created with GitHub Copilot assistance and can be played [online here](https://kgptapps.github.io/gptgames/?v=0.1.0).

## Games Included

1. **Tic Tac Toe** - Classic game with a computer opponent
2. **Fast Typing Game** - Test your typing speed with character highlighting
3. **Number Guess Game** - Guess the number within a range
4. **Image Puzzle Game** - Solve a sliding puzzle
5. **Color Match Game** - Match colors in a memory challenge
6. **Word Scramble Game** - Unscramble words against the clock
7. **Memory Match Game** - Find matching pairs
8. **Simon Says Game** - Remember and repeat color patterns

## Features
- Clean, modern UI across all games
- Responsive design that works on desktop and mobile
- Built with React functional components and hooks
- Automated deployment via GitHub Actions

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. Open your browser to the local address shown in the terminal (usually http://localhost:5173).

## How to Play

### Tic Tac Toe
- Choose a difficulty level: Easy, Medium, or Hard
- Click on a square to make your move (X)
- The computer (O) will respond automatically with varying intelligence based on difficulty
- The game tracks your score across multiple rounds
- Winning squares are highlighted with animation
- Click "New Game" to play again

## Deployment

This project is automatically deployed to GitHub Pages via GitHub Actions whenever changes are pushed to the master branch.

### Automatic Deployment
The project uses a GitHub Actions workflow defined in `.github/workflows/deploy.yml` that:
1. Builds the project
2. Updates build information (version, timestamp)
3. Deploys to GitHub Pages using the gh-pages branch

To deploy manually:
```bash
npm run manual-deploy
```

### Version Display
The application shows its current version in the top-right corner. Click on it to see detailed build information including:
- Version number
- Build timestamp
- Build number

---

This project was bootstrapped with [Vite](https://vitejs.dev/) and uses React.
