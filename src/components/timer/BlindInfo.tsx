import { useTournamentState } from "../../context/TournamentContext";
import { formatChips } from "../../utils/format";
import styles from "./BlindInfo.module.css";

export function BlindInfo() {
  const { currentLevelIndex, structure } = useTournamentState();
  const level = structure.levels[currentLevelIndex];
  const nextLevel =
    currentLevelIndex + 1 < structure.levels.length
      ? structure.levels[currentLevelIndex + 1]
      : null;

  return (
    <div className={styles.container}>
      {level.type === "blind" ? (
        <>
          <div className={styles.label}>Blinds</div>
          <div className={styles.current}>
            {formatChips(level.smallBlind)} / {formatChips(level.bigBlind)}
            {level.ante > 0 && (
              <span style={{ color: "var(--color-text-muted)", fontSize: "0.7em" }}>
                {" "}
                Ante {formatChips(level.ante)}
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={styles.label}>Break</div>
          <div className={styles.current} style={{ color: "var(--color-break)" }}>
            Break Time
          </div>
        </>
      )}

      {nextLevel && (
        <div className={styles.next}>
          Next:{" "}
          {nextLevel.type === "blind"
            ? `${formatChips(nextLevel.smallBlind)} / ${formatChips(nextLevel.bigBlind)}${nextLevel.ante > 0 ? ` (Ante ${formatChips(nextLevel.ante)})` : ""}`
            : "Break"}
        </div>
      )}
      {!nextLevel && (
        <div className={styles.next}>Final Level</div>
      )}
    </div>
  );
}
