import React from "react";
import styles from "./Board.module.scss";

import Cell from "../Cell";

const Board = ({ cells, handleClick }) => {
  return (
    <table className={styles.board}>
      <tbody>
        {cells.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={`${i}-${j}`}>
                <Cell
                  isMine={cell.isMine}
                  state={cell.state}
                  value={cell.value}
                  row={i}
                  col={j}
                  onClick={handleClick}
                  onContextMenu={handleClick}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Board;
