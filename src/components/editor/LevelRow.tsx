import type { Level } from "../../types/tournament";
import styles from "./LevelRow.module.css";

interface LevelRowProps {
  level: Level;
  index: number;
  isActive: boolean;
  onChange: (index: number, level: Level) => void;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function LevelRow({
  level,
  index,
  isActive,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: LevelRowProps) {
  const isBreak = level.type === "break";

  function updateField(field: string, value: number) {
    if (level.type === "blind") {
      onChange(index, { ...level, [field]: value });
    } else {
      onChange(index, { ...level, [field]: value });
    }
  }

  return (
    <div
      className={`${styles.row} ${isActive ? styles.active : ""} ${isBreak ? styles.break : ""}`}
    >
      <span className={styles.index}>{index + 1}</span>

      <span className={`${styles.type} ${isBreak ? styles.break : styles.blind}`}>
        {isBreak ? "Break" : "Blind"}
      </span>

      {level.type === "blind" && (
        <>
          <div className={styles.fieldGroup}>
            <span className={styles.inputLabel}>SB</span>
            <input
              className={styles.input}
              type="number"
              min={1}
              value={level.smallBlind}
              onChange={(e) => updateField("smallBlind", Math.max(1, Number(e.target.value)))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <span className={styles.inputLabel}>BB</span>
            <input
              className={styles.input}
              type="number"
              min={1}
              value={level.bigBlind}
              onChange={(e) => updateField("bigBlind", Math.max(1, Number(e.target.value)))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <span className={styles.inputLabel}>Ante</span>
            <input
              className={styles.input}
              type="number"
              min={0}
              value={level.ante}
              onChange={(e) => updateField("ante", Math.max(0, Number(e.target.value)))}
            />
          </div>
        </>
      )}

      <div className={styles.fieldGroup}>
        <span className={styles.inputLabel}>Min</span>
        <input
          className={styles.input}
          type="number"
          min={1}
          value={level.durationMinutes}
          onChange={(e) => updateField("durationMinutes", Math.max(1, Number(e.target.value)))}
          style={{ width: 60 }}
        />
      </div>

      <div className={styles.actions}>
        <button
          className={styles.iconBtn}
          onClick={() => onMoveUp(index)}
          disabled={isFirst}
          title="Move Up"
        >
          &#x25B2;
        </button>
        <button
          className={styles.iconBtn}
          onClick={() => onMoveDown(index)}
          disabled={isLast}
          title="Move Down"
        >
          &#x25BC;
        </button>
        <button
          className={`${styles.iconBtn} ${styles.delete}`}
          onClick={() => onDelete(index)}
          title="Delete Level"
        >
          &#x2715;
        </button>
      </div>
    </div>
  );
}
