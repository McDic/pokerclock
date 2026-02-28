import { useTournamentState, useTournamentDispatch } from "../../context/TournamentContext";
import styles from "./Header.module.css";

export function Header() {
  const { view, structure } = useTournamentState();
  const dispatch = useTournamentDispatch();

  return (
    <header className={styles.header}>
      <span className={styles.title}>{structure.name}</span>
      <nav className={styles.nav}>
        <button
          className={`${styles.navBtn} ${view === "timer" ? styles.active : ""}`}
          onClick={() => dispatch({ type: "SET_VIEW", view: "timer" })}
        >
          Timer
        </button>
        <button
          className={`${styles.navBtn} ${view === "editor" ? styles.active : ""}`}
          onClick={() => dispatch({ type: "SET_VIEW", view: "editor" })}
        >
          Editor
        </button>
      </nav>
    </header>
  );
}
