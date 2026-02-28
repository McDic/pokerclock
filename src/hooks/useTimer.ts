import { useEffect, useRef } from "react";
import { useTournamentState, useTournamentDispatch } from "../context/TournamentContext";

const TICK_INTERVAL = 100; // ms — check frequently for drift correction

export function useTimer() {
  const { isRunning } = useTournamentState();
  const dispatch = useTournamentDispatch();
  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    if (!isRunning) return;

    lastTickRef.current = Date.now();

    const id = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTickRef.current;

      if (elapsed >= 1000) {
        const wholeTicks = Math.floor(elapsed / 1000);
        for (let i = 0; i < wholeTicks; i++) {
          dispatch({ type: "TIMER_TICK" });
        }
        lastTickRef.current += wholeTicks * 1000;
      }
    }, TICK_INTERVAL);

    return () => clearInterval(id);
  }, [isRunning, dispatch]);
}
