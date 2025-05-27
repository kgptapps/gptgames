import React, { useEffect, useRef, useState } from "react";
import withGameStats from "./hooks/withGameStats";
import Board from "./components/Board";
import GameInfo from "./components/GameInfo";
import useTicTacToeGame from "./hooks/useTicTacToeGame";
import { useActiveGame } from "./context/ActiveGameContext";
import "./styles/games/tictactoe.css";

/**
 * TicTacToe Game Component
 * The main component that manages game state and logic
 */
function TicTacToe({ updateStats }) {
  const [boardSize, setBoardSize] = useState(3);
  const {
    board,
    winLine,
    winner,
    isThinking,
    gameHistory,
    difficulty,
    moveCount,
    status,
    handleSquareClick,
    handleRestart,
    handleSetDifficulty,
  } = useTicTacToeGame(updateStats, boardSize);

  // Handle board size change
  const handleSetBoardSize = (size) => {
    console.log(`Changing board size to: ${size}x${size}`);
    setBoardSize(size);
    // We don't need to call handleRestart here since useEffect in useTicTacToeGame
    // will handle this when boardSize changes
  };

  const { updateActiveGame, updateGameData } = useActiveGame();
  const hasSetActiveGame = useRef(false);

  // Only set active game on first mount
  useEffect(() => {
    if (!hasSetActiveGame.current) {
      updateActiveGame("tictactoe");
      hasSetActiveGame.current = true;
    }
  }, [updateActiveGame]);

  // Update game metrics for status bar with debouncing
  useEffect(() => {
    const updateTimer = setTimeout(() => {
      updateGameData({
        moves: moveCount,
        wins: gameHistory.x,
        losses: gameHistory.o,
        draws: gameHistory.draw,
      });
    }, 300); // Debounce updates

    return () => clearTimeout(updateTimer);
  }, [
    moveCount,
    gameHistory.x,
    gameHistory.o,
    gameHistory.draw,
    updateGameData,
  ]);

  return (
    <div className="game-container">
      <GameInfo
        status={status}
        gameHistory={gameHistory}
        difficulty={difficulty}
        onSetDifficulty={handleSetDifficulty}
        moveCount={moveCount}
        boardSize={boardSize}
        onSetBoardSize={handleSetBoardSize}
      />

      <Board
        key={`board-${boardSize}`}
        board={board}
        winLine={winLine}
        handleSquareClick={handleSquareClick}
        isThinking={isThinking}
        winner={winner}
        boardSize={boardSize}
      />

      <button className="restart" onClick={handleRestart}>
        New Game
      </button>
    </div>
  );
}

// Export the component wrapped with stats capabilities
export default withGameStats(TicTacToe, {
  gameKey: "tictactoe",
  supportedStats: ["wins", "losses", "draws", "played", "moves"],
  displayNames: {
    wins: "Wins",
    losses: "Losses",
    draws: "Draws",
    played: "Games Played",
    moves: "Total Moves",
  },
});
