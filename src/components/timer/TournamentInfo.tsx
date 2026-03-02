import { useTournamentState } from "../../context/TournamentContext";
import { useZoom } from "../../context/ZoomContext";
import { ZoomControls } from "./ZoomControls";
import { formatChips } from "../../utils/format";
import styles from "./TournamentInfo.module.css";

export function TournamentInfo() {
  const { playerCount, eliminatedCount, currentLevelIndex, structure } =
    useTournamentState();
  const { zoom } = useZoom("info");

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
            {currentLevelIndex + 1} / {structure.levels.length}
          </span>
          <span className={styles.statLabel}>Level</span>
        </div>
      </div>
    </div>
  );
}
