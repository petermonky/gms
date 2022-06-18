export const GAME_STATES = {
  IDLE: "Idle",
  LIVE: "Live",
  WIN: "Win",
  LOSE: "Lose",
};

export const GAME_MODES = {
  EASY: {
    NAME: "Easy",
    NUM_OF_ROWS: 8,
    NUM_OF_COLS: 10,
    NUM_OF_MINES: 10,
  },
  MEDIUM: {
    NAME: "Medium",
    NUM_OF_ROWS: 14,
    NUM_OF_COLS: 18,
    NUM_OF_MINES: 40,
  },
  HARD: {
    NAME: "Hard",
    NUM_OF_ROWS: 20,
    NUM_OF_COLS: 24,
    NUM_OF_MINES: 99,
  },
};
