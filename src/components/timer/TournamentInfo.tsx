import { useTournamentState } from "../../context/TournamentContext";
import { useZoom } from "../../context/ZoomContext";
import { ZoomControls } from "./ZoomControls";
import { formatChips } from "../../utils/format";
import styles from "./TournamentInfo.module.css";

export function TournamentInfo() {
  const { playerCount, eliminatedCount, currentLevelIndex, structure } =
    useTournamentState();
  const { zoom } = useZoom("info");

  const level = structure.levels[currentLevelIndex];
  const isBreak = level.type === "break";
  const blindLevelNumber = structure.levels
    .slice(0, currentLevelIndex + 1)
    .filter((l) => l.type !== "break").length;
  const breakNumber = structure.levels
    .slice(0, currentLevelIndex + 1)
    .filter((l) => l.type === "break").length;
  const totalBlindLevels = structure.levels.filter((l) => l.type !== "break").length;
  const remaining = playerCount - eliminatedCount;
  const avgStack =
    remaining > 0
      ? Math.round((structure.startingChips * playerCount) / remaining)
      : 0;

  return (
    <div className={styles.container}>
      <ZoomControls panel="info" />
      <div className={styles.stats} style={{ transform: `scale(${zoom})` }}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{remaining} / {playerCount}</span>
          <span className={styles.statLabel}>Players</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{formatChips(avgStack)}</span>
          <span className={styles.statLabel}>Avg Stack</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {isBreak ? `B${breakNumber}` : blindLevelNumber} / {totalBlindLevels}
          </span>
          <span className={styles.statLabel}>Level</span>
        </div>
      </div>
    </div>
  );
}
