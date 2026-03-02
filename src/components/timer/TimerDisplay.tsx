import { useCallback, useRef } from "react";
import { useTournamentState, useTournamentDispatch } from "../../context/TournamentContext";
import { useZoom } from "../../context/ZoomContext";
import { ZoomControls } from "./ZoomControls";
import { formatTime } from "../../utils/format";
import styles from "./TimerDisplay.module.css";

const WHEEL_THRESHOLD = 50; // accumulated delta pixels per 1-second step

function getTimerClass(
  isRunning: boolean,
  remainingSeconds: number,
  isBreak: boolean
): string {
  if (isBreak) return styles.break;
  if (!isRunning) return styles.paused;
  if (remainingSeconds <= 10) return styles.danger;
  if (remainingSeconds <= 60) return styles.warning;
  return styles.running;
}

function getTimerColor(
  isRunning: boolean,
  remainingSeconds: number,
  isBreak: boolean
): string {
  if (isBreak) return "var(--color-break)";
  if (!isRunning) return "var(--color-text-muted)";
  if (remainingSeconds <= 10) return "var(--color-danger)";
  if (remainingSeconds <= 60) return "var(--color-warning)";
  return "var(--color-running)";
}

export function TimerDisplay() {
  const { remainingSeconds, isRunning, currentLevelIndex, structure } =
    useTournamentState();
  const dispatch = useTournamentDispatch();
  const { zoom } = useZoom("timer");
  const accumulatedDelta = useRef(0);

  const level = structure.levels[currentLevelIndex];
  const isBreak = level.type === "break";
  const totalSeconds = level.durationMinutes * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 100;

  const label = isBreak
    ? "Break"
    : `Level ${currentLevelIndex + 1}`;

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      accumulatedDelta.current += e.deltaY;

      const steps = Math.trunc(accumulatedDelta.current / WHEEL_THRESHOLD);
      if (steps === 0) return;

      accumulatedDelta.current -= steps * WHEEL_THRESHOLD;
      const abSteps = Math.abs(steps);

      if (steps > 0) {
        dispatch({ type: "TIMER_ADVANCE", seconds: abSteps });
      } else {
        dispatch({ type: "TIMER_REWIND", seconds: abSteps });
      }
    },
    [dispatch]
  );

  return (
    <div className={styles.container} onWheel={handleWheel}>
      <ZoomControls panel="timer" />
      <div style={{ transform: `scale(${zoom})`, textAlign: "center" }}>
        <div className={styles.levelLabel}>{label}</div>
        <div className={`${styles.time} ${getTimerClass(isRunning, remainingSeconds, isBreak)}`}>
          {formatTime(remainingSeconds)}
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${Math.min(100, progress)}%`,
              backgroundColor: getTimerColor(isRunning, remainingSeconds, isBreak),
            }}
          />
        </div>
      </div>
    </div>
  );
}
