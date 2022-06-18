import React, { useContext } from "react";
import clsx from "clsx";
import styles from "./Modal.module.scss";
import { GameDataContext } from "../Game";

import {
  MdRefresh as RestartIcon,
  MdOutlineTimer as TimerIcon,
} from "react-icons/md";
import { GAME_STATES } from "../../utils/constants";

const Modal = () => {
  const { time, gameMode, gameState, resetGame } = useContext(GameDataContext);
  const gameOver =
    gameState === GAME_STATES.WIN || gameState === GAME_STATES.LOSE;

  return (
    <div className={clsx(styles.modalContainer, gameOver && styles.open)}>
      <div className={styles.modal}>
        <div
          className={clsx(
            styles.image,
            gameState === GAME_STATES.WIN && styles.win
          )}
        >
          <div className={styles.display}>
            <TimerIcon className={styles.timerIcon} />
            <span className={styles.time}>
              {gameState === GAME_STATES.WIN
                ? time.toString().padStart(3, "0")
                : "–––"}
            </span>
          </div>
        </div>
        <button className={styles.button} onClick={() => resetGame(gameMode)}>
          <RestartIcon className={styles.restartIcon} />
          <span>
            {gameState === GAME_STATES.WIN ? "Play again" : "Try again"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Modal;
