import { useRef } from "react";
import {
  useTournamentState,
  useTournamentDispatch,
} from "../../context/TournamentContext";
import type { TournamentStructure, Level } from "../../types/tournament";
import { LevelRow } from "./LevelRow";
import { exportStructure, importStructure } from "../../utils/export";
import { validateStructure } from "../../utils/validation";
import styles from "./EditorView.module.css";

export function EditorView() {
  const { structure, currentLevelIndex, playerCount, eliminatedCount } = useTournamentState();
  const dispatch = useTournamentDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update(partial: Partial<TournamentStructure>) {
    dispatch({
      type: "STRUCTURE_UPDATE",
      structure: { ...structure, ...partial },
    });
  }

  function updateLevel(index: number, level: Level) {
    const levels = [...structure.levels];
    levels[index] = level;
    update({ levels });
  }

  function deleteLevel(index: number) {
    if (structure.levels.length <= 1) return;
    const levels = structure.levels.filter((_, i) => i !== index);
    update({ levels });
  }

  function moveLevel(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= structure.levels.length) return;
    const levels = [...structure.levels];
    [levels[index], levels[target]] = [levels[target], levels[index]];
    update({ levels });
  }

  function addBlindLevel() {
    const lastBlind = [...structure.levels]
      .reverse()
      .find((l) => l.type === "blind");
    const newLevel: Level = lastBlind
      ? {
          type: "blind",
          smallBlind: lastBlind.type === "blind" ? lastBlind.smallBlind * 2 : 100,
          bigBlind: lastBlind.type === "blind" ? lastBlind.bigBlind * 2 : 200,
          ante: lastBlind.type === "blind" ? lastBlind.ante : 0,
          durationMinutes: lastBlind.durationMinutes,
        }
      : { type: "blind", smallBlind: 100, bigBlind: 200, ante: 0, durationMinutes: 20 };
    update({ levels: [...structure.levels, newLevel] });
  }

  function addBreak() {
    update({
      levels: [...structure.levels, { type: "break", durationMinutes: 10 }],
    });
  }

  async function handleImport() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importStructure(file);
      const validated = validateStructure(data);
      if (!validated) {
        alert("Invalid tournament structure file.");
        return;
      }
      dispatch({ type: "STRUCTURE_IMPORT", structure: validated });
    } catch {
      alert("Failed to read file.");
    }
    // Reset input so the same file can be re-imported
    e.target.value = "";
  }

  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Tournament Settings</h2>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Name</label>
              <input
                className={`${styles.input} ${styles.inputWide}`}
                value={structure.name}
                onChange={(e) => update({ name: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Starting Chips</label>
              <input
                className={styles.input}
                type="number"
                min={1}
                value={structure.startingChips}
                onChange={(e) =>
                  update({ startingChips: Math.max(1, Number(e.target.value)) })
                }
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Total Entries</label>
              <input
                className={styles.input}
                type="number"
                min={0}
                value={playerCount}
                onChange={(e) =>
                  dispatch({
                    type: "PLAYER_SET",
                    playerCount: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Eliminated</label>
              <input
                className={styles.input}
                type="number"
                min={0}
                max={Math.max(0, playerCount - 1)}
                value={eliminatedCount}
                onChange={(e) =>
                  dispatch({
                    type: "PLAYER_SET_ELIMINATED",
                    eliminatedCount: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Blind Schedule</h2>
          {structure.levels.map((level, i) => (
            <LevelRow
              key={i}
              level={level}
              index={i}
              isActive={i === currentLevelIndex}
              onChange={updateLevel}
              onDelete={deleteLevel}
              onMoveUp={(idx) => moveLevel(idx, -1)}
              onMoveDown={(idx) => moveLevel(idx, 1)}
              isFirst={i === 0}
              isLast={i === structure.levels.length - 1}
            />
          ))}
        </div>
      </div>

      <div className={styles.toolbar}>
        <button className={styles.toolbarBtn} onClick={addBlindLevel}>
          + Blind Level
        </button>
        <button className={styles.toolbarBtn} onClick={addBreak}>
          + Break
        </button>
        <div className={styles.toolbarSpacer} />
        <button className={styles.toolbarBtn} onClick={() => exportStructure(structure)}>
          Export JSON
        </button>
        <button className={styles.toolbarBtn} onClick={handleImport}>
          Import JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          className={`${styles.toolbarBtn} ${styles.danger}`}
          onClick={() => {
            if (confirm("Reset all settings to defaults?")) {
              dispatch({ type: "RESET_ALL" });
            }
          }}
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
