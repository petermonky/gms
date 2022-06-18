import styles from "./App.module.scss";

import Game from "../Game";

function App() {
  return (
    <div className={styles.app}>
      <Game />
    </div>
  );
}

export default App;
