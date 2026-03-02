import { useEffect, useRef } from "react";
import { useTournamentState } from "../context/TournamentContext";
import { useSound } from "../context/SoundContext";
import { playBeep } from "../utils/audio";

export function useLevelChangeAlert(): void {
  const { currentLevelIndex } = useTournamentState();
  const { isMuted } = useSound();
  const prevIndex = useRef(currentLevelIndex);

  useEffect(() => {
    if (prevIndex.current !== currentLevelIndex) {
      prevIndex.current = currentLevelIndex;
      if (!isMuted) {
        playBeep();
      }
    }
  }, [currentLevelIndex, isMuted]);
}
