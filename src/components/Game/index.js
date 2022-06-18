import React, { createContext, useState } from "react";
import clsx from "clsx";
import {
  generateCells,
  // findMines,
  popMines,
  animateMines,
  useTimer,
} from "../../utils";
import { GAME_MODES, GAME_STATES } from "../../utils/constants";
import styles from "./Game.module.scss";

import { openCell, flagCell } from "../../utils";
import Board from "../Board";
import Header from "../Header";
import { states } from "../Cell";
import Modal from "../Modal";

export const GameDataContext = createContext();

const Game = () => {
  const [gameMode, setGameMode] = useState(GAME_MODES.MEDIUM);
  const [cells, setCells] = useState(generateCells());
  const [flagCount, setFlagCount] = useState(gameMode.NUM_OF_MINES);
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  // TODO: smarter handling for game over state
  const [gameOver, setGameOver] = useState(false);
  const [time, startTime, pauseTime, resetTime] = useTimer();

  const handleClick = (event) => (i, j) => {
    event.preventDefault();
    if (event.nativeEvent.button === 0) {
      handleLeftClick(i, j);
    } else if (event.nativeEvent.button === 2) {
      handleRightClick(i, j);
    }
  };

  const handleLeftClick = (i, j) => {
    let currentCells = cells;

    // idle --> live
    if (gameState === GAME_STATES.IDLE) {
      setGameState(GAME_STATES.LIVE);
      startTime();
      currentCells = generateCells(gameMode, cells, i, j);
    }

    if (
      currentCells[i][j].state === states.FLAGGED ||
      currentCells[i][j].state === states.OPEN
    ) {
      return;
    }

    // live --> lose
    if (currentCells[i][j].isMine) {
      pauseTime();
      // animateMines(findMines(currentCells, i, j), currentCells, setCells);
      setCells(popMines(currentCells));
      setGameOver(true);
      return setTimeout(() => setGameState(GAME_STATES.LOSE), 1000);
    }

    currentCells = openCell(currentCells, i, j);

    const numOfNotOpen = currentCells
      .map((row) => row.filter((cell) => cell.state !== states.OPEN))
      .reduce((prev, curr) => prev + curr.length, 0);

    if (numOfNotOpen === gameMode.NUM_OF_MINES) {
      pauseTime();
      setGameState(GAME_STATES.WIN);
    }

    setCells(openCell(currentCells, i, j));
  };

  const handleRightClick = (i, j) => {
    if (cells[i][j].state === states.OPEN) {
      return;
    }
    setFlagCount((flagCount) =>
      cells[i][j].state === states.CLOSED ? flagCount - 1 : flagCount + 1
    );
    setCells(flagCell(cells, i, j));
  };

  const resetGame = (newGameMode) => {
    setGameMode(newGameMode);
    setCells(generateCells(newGameMode));
    setFlagCount(newGameMode.NUM_OF_MINES);
    setGameState(GAME_STATES.IDLE);
    setGameOver(false);
    resetTime();
  };

  const gameData = {
    gameMode,
    gameState,
    resetGame,
    time,
    flagCount,
  };

  return (
    <GameDataContext.Provider value={gameData}>
      <div className={clsx(styles.container, gameOver && styles.gameOver)}>
        <Header handleGameMode={resetGame} />
        <Board cells={cells} handleClick={handleClick} />
      </div>
      <Modal />
    </GameDataContext.Provider>
  );
};

export default Game;
