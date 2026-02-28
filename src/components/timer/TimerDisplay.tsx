import { useTournamentState } from "../../context/TournamentContext";
import { formatTime } from "../../utils/format";
import styles from "./TimerDisplay.module.css";

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

  const level = structure.levels[currentLevelIndex];
  const isBreak = level.type === "break";
  const totalSeconds = level.durationMinutes * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 100;

  const label = isBreak
    ? "Break"
    : `Level ${currentLevelIndex + 1}`;

  return (
    <div className={styles.container}>
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
  );
}
