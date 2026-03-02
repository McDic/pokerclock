import { useEffect } from "react";
import {
  TournamentProvider,
  useTournamentState,
  useTournamentDispatch,
} from "./context/TournamentContext";
import { ZoomProvider } from "./context/ZoomContext";
import { Header } from "./components/layout/Header";
import { TimerView } from "./components/timer/TimerView";
import { EditorView } from "./components/editor/EditorView";
import { useFullscreen } from "./hooks/useFullscreen";
import styles from "./App.module.css";

function AppContent() {
  const { view } = useTournamentState();
  const dispatch = useTournamentDispatch();
  const { isFullscreen } = useFullscreen();

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Don't capture when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (view === "timer") dispatch({ type: "TIMER_TOGGLE" });
          break;
        case "ArrowRight":
          if (view === "timer") dispatch({ type: "LEVEL_NEXT" });
          break;
        case "ArrowLeft":
          if (view === "timer") dispatch({ type: "LEVEL_PREV" });
          break;
        case "KeyR":
          if (view === "timer") dispatch({ type: "TIMER_RESET_LEVEL" });
          break;
        case "KeyE":
          dispatch({ type: "SET_VIEW", view: view === "editor" ? "timer" : "editor" });
          break;
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [view, dispatch]);

  return (
    <div className={styles.app}>
      {!isFullscreen && <Header />}
      <main className={styles.main}>
        {view === "timer" ? <TimerView /> : <EditorView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TournamentProvider>
      <ZoomProvider>
        <AppContent />
      </ZoomProvider>
    </TournamentProvider>
  );
}
