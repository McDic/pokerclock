import {
  useTournamentState,
  useTournamentDispatch,
} from "../../context/TournamentContext";
import { useFullscreen } from "../../hooks/useFullscreen";
import styles from "./TimerControls.module.css";

export function TimerControls() {
  const state = useTournamentState();
  const dispatch = useTournamentDispatch();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const { isRunning, currentLevelIndex, structure, playerCount, eliminatedCount } = state;
  const isFirst = currentLevelIndex === 0;
  const isLast = currentLevelIndex >= structure.levels.length - 1;
  const remaining = playerCount - eliminatedCount;

  return (
    <div className={styles.controls}>
      <button
        className={styles.btn}
        onClick={() => dispatch({ type: "LEVEL_PREV" })}
        disabled={isFirst}
        title="Previous Level"
      >
        {"\u23EE"}
      </button>

      <button
        className={styles.btn}
        onClick={() => dispatch({ type: "TIMER_ADD_MINUTE" })}
        title="Add 1 Minute (go back)"
      >
        {"< 1m"}
      </button>

      <button
        className={`${styles.btn} ${styles.playPause} ${isRunning ? styles.running : ""}`}
        onClick={() => dispatch({ type: "TIMER_TOGGLE" })}
        title={isRunning ? "Pause" : "Play"}
      >
        {isRunning ? "\u23F8" : "\u25B6"}
      </button>

      <button
        className={styles.btn}
        onClick={() => dispatch({ type: "TIMER_SUB_MINUTE" })}
        title="Subtract 1 Minute (advance)"
      >
        {"1m >"}
      </button>

      <button
        className={styles.btn}
        onClick={() => dispatch({ type: "LEVEL_NEXT" })}
        disabled={isLast}
        title="Next Level"
      >
        {"\u23ED"}
      </button>

      <div className={styles.spacer} />

      <div className={styles.playerControls}>
        <span className={styles.playerLabel}>Players: {remaining}/{playerCount}</span>
        <button
          className={styles.smallBtn}
          onClick={() => dispatch({ type: "PLAYER_ELIMINATE" })}
          disabled={remaining <= 0}
          title="Eliminate Player"
        >
          {"\u2212"}
        </button>
        <button
          className={styles.smallBtn}
          onClick={() => dispatch({ type: "PLAYER_ADD" })}
          title="Add Player"
        >
          +
        </button>
      </div>

      <div className={styles.spacer} />

      <button
        className={styles.btn}
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? "\u2716" : "\u26F6"}
      </button>
    </div>
  );
}
