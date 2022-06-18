import React, { useContext } from "react";
import styles from "./Header.module.scss";
import { GAME_MODES } from "../../utils/constants";

import { BiCaretDown as CaretDownIcon } from "react-icons/bi";
import { MdOutlineTimer as TimerIcon } from "react-icons/md";
import { GrFlagFill as FlagIcon } from "react-icons/gr";
import { GameDataContext } from "../Game";

const Header = ({ handleGameMode }) => {
  const { EASY, MEDIUM, HARD } = GAME_MODES;
  const { time, flagCount, gameMode } = useContext(GameDataContext);

  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <button className={styles.dropDown}>
          {gameMode.NAME} <CaretDownIcon />
        </button>
        <div className={styles.dropDownMenu}>
          {[EASY, MEDIUM, HARD].map((gamemode) => (
            <div
              key={gamemode.NAME}
              className={styles.menuItem}
              /* TODO: proper click handling */
              onMouseDown={() => handleGameMode(gamemode)}
            >
              {gamemode.NAME}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.middleSection}>
        <div className={styles.container}>
          <div className={styles.display}>
            <FlagIcon className={styles.flagIcon} />
            <span className={styles.flagCount}>{flagCount}</span>
          </div>
          <div className={styles.display}>
            <TimerIcon className={styles.timerIcon} />
            <span className={styles.timer}>
              {time.toString().padStart(3, "0")}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.rightSection}></div>
    </div>
  );
};

export default Header;
