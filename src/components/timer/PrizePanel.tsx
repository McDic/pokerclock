import { useTournamentState } from "../../context/TournamentContext";
import type { PrizeEntry } from "../../types/tournament";
import styles from "./PrizePanel.module.css";

function formatRank(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function rankLabel(entry: PrizeEntry): string {
  if (entry.rankFrom === entry.rankTo) return formatRank(entry.rankFrom);
  return `${formatRank(entry.rankFrom)} - ${formatRank(entry.rankTo)}`;
}

export function PrizePanel() {
  const { structure, playerCount, eliminatedCount } = useTournamentState();
  const { prizes } = structure;
  const remainingPlayers = playerCount - eliminatedCount;

  return (
    <div className={styles.container}>
      <div className={styles.title}>Prizes</div>
      {prizes.length === 0 ? (
        <div className={styles.empty}>No prizes configured</div>
      ) : (
        <div className={styles.list}>
          {prizes.map((entry, i) => {
            const isCurrent =
              remainingPlayers > 0 &&
              entry.rankFrom <= remainingPlayers &&
              remainingPlayers <= entry.rankTo;
            return (
              <div
                key={i}
                className={`${styles.entry} ${isCurrent ? styles.current : ""}`}
              >
                <span className={styles.rank}>{rankLabel(entry)}</span>
                <span className={styles.prize}>{entry.prize}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
