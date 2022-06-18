import { useEffect, useState, useRef } from "react";
import { states } from "../components/Cell";
import { GAME_MODES } from "./constants";

const initialiseCells = (gameMode) => {
  const { NUM_OF_ROWS: numOfRows, NUM_OF_COLS: numOfCols } = gameMode;
  const cells = [];

  for (let i = 0; i < numOfRows; i++) {
    cells.push([]);
    for (let j = 0; j < numOfCols; j++) {
      cells[i][j] = {
        isMine: false,
        state: states.CLOSED,
        value: 0,
      };
    }
  }

  return cells;
};

export const copyCells = (cells) => {
  const numOfRows = cells.length;
  const numOfCols = cells[0].length;

  const result = [];

  for (let i = 0; i < numOfRows; i++) {
    result.push([]);
    for (let j = 0; j < numOfCols; j++) {
      result[i][j] = { ...cells[i][j] };
    }
  }

  return result;
};

export const generateCells = (
  gameMode = GAME_MODES.MEDIUM,
  cells = initialiseCells(gameMode),
  i = 0,
  j = 0
) => {
  const {
    NUM_OF_ROWS: numOfRows,
    NUM_OF_COLS: numOfCols,
    NUM_OF_MINES: numOfMines,
  } = gameMode;

  const result = initialiseCells(gameMode);

  let mineCount = 0;
  while (mineCount < numOfMines) {
    const randomRow = Math.floor(Math.random() * numOfRows);
    const randomCol = Math.floor(Math.random() * numOfCols);

    if (Math.abs(i - randomRow) <= 1 && Math.abs(j - randomCol) <= 1) {
      continue;
    }

    const cell = result[randomRow][randomCol];
    if (!cell.isMine) {
      cell.isMine = true;
      mineCount++;
    }
  }

  for (let i = 0; i < numOfRows; i++) {
    for (let j = 0; j < numOfCols; j++) {
      const cell = result[i][j];

      if (cells[i][j].state === states.FLAGGED) {
        cell.state = states.FLAGGED;
      }

      if (cell.isMine) {
        continue;
      }

      let numOfAdjacentMines = 0;

      for (let k = -1; k < 2; k++) {
        for (let l = -1; l < 2; l++) {
          const newRow = i + k;
          const newCol = j + l;

          if (
            newRow >= 0 &&
            newRow < numOfRows &&
            newCol >= 0 &&
            newCol < numOfCols &&
            result[newRow][newCol].isMine
          ) {
            numOfAdjacentMines++;
          }
        }
      }

      cell.value = numOfAdjacentMines;
    }
  }

  return result;
};

export const openCell = (cells, row, col) => {
  const result = copyCells(cells);

  const clickCellInner = (c, i, j) => {
    const cell = c[i]?.[j];

    if (
      !cell ||
      cell.isMine ||
      cell.state === states.OPEN ||
      cell.state === states.FLAGGED
    ) {
      return;
    }

    cell.state = states.OPEN;

    if (cell.value > 0) {
      return;
    }

    for (let k = -1; k < 2; k++) {
      for (let l = -1; l < 2; l++) {
        if (!(k === 0 && l === 0)) {
          clickCellInner(c, i + k, j + l);
        }
      }
    }
  };

  clickCellInner(result, row, col);
  return result;
};

export const flagCell = (cells, row, col) => {
  const result = copyCells(cells);

  const cell = result[row][col];

  if (!cell || cell.state === states.OPEN) {
    return result;
  }

  cell.state = cell.state === states.FLAGGED ? states.CLOSED : states.FLAGGED;

  return result;
};

// export const findMines = (cells, row, col) => {
//   const visited = [];
//   for (let i = 0; i < cells.length; i++) {
//     visited[i] = [];
//     for (let j = 0; j < cells[0].length; j++) {
//       visited[i][j] = false;
//     }
//   }

//   const distances = [];

//   const queue = [];
//   queue.push({ cell: cells[row][col], row, col, dist: 0 });
//   visited[row][col] = true;

//   while (queue.length) {
//     const { cell, row, col, dist } = queue.shift();

//     if (cell.isMine && cell.state !== states.FLAGGED) {
//       distances.push({ row, col, dist });
//     }

//     for (let i = -1; i < 2; i++) {
//       for (let j = -1; j < 2; j++) {
//         const newRow = row + i;
//         const newCol = col + j;

//         if (visited?.[newRow]?.[newCol] === false) {
//           visited[newRow][newCol] = true;
//           queue.push({
//             cell: cells[newRow][newCol],
//             row: newRow,
//             col: newCol,
//             dist: dist + 1,
//           });
//         }
//       }
//     }
//   }

//   return distances;
// };

export const popMines = (cells) => {
  const result = copyCells(cells);

  result.forEach((row) =>
    row.forEach((cell) => {
      if (cell.isMine && cell.state !== states.FLAGGED) {
        cell.state = states.POPPED;
      }
    })
  );

  return result;
};

export const animateMines = (distances, currentCells, setCells) => {
  const result = copyCells(currentCells);

  distances.forEach(({ row, col, dist }) => {
    setTimeout(() => {
      result[row][col].state = states.POPPED;
      setCells(result);
    }, dist * 1000);
  });
};

export const useTimer = (initialTime = 0) => {
  const [time, setTime] = useState(initialTime);
  const timer = useRef(null);

  const startTime = () => {
    timer.current = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
  };

  const pauseTime = () => {
    clearInterval(timer.current);
  };

  const resetTime = () => {
    clearInterval(timer.current);
    setTime(0);
  };

  useEffect(() => {
    return () => clearInterval(timer.current);
  }, []);

  return [time, startTime, pauseTime, resetTime];
};
