import type { TournamentStructure, TournamentState } from "../types/tournament";

export const DEFAULT_STRUCTURE: TournamentStructure = {
  version: 1,
  name: "Standard Tournament",
  startingChips: 10000,
  levels: [
    { type: "blind", smallBlind: 25, bigBlind: 50, ante: 0, durationMinutes: 20 },
    { type: "blind", smallBlind: 50, bigBlind: 100, ante: 0, durationMinutes: 20 },
    { type: "blind", smallBlind: 75, bigBlind: 150, ante: 0, durationMinutes: 20 },
    { type: "break", durationMinutes: 10 },
    { type: "blind", smallBlind: 100, bigBlind: 200, ante: 25, durationMinutes: 20 },
    { type: "blind", smallBlind: 150, bigBlind: 300, ante: 25, durationMinutes: 20 },
    { type: "blind", smallBlind: 200, bigBlind: 400, ante: 50, durationMinutes: 20 },
    { type: "break", durationMinutes: 10 },
    { type: "blind", smallBlind: 300, bigBlind: 600, ante: 75, durationMinutes: 15 },
    { type: "blind", smallBlind: 400, bigBlind: 800, ante: 100, durationMinutes: 15 },
    { type: "blind", smallBlind: 500, bigBlind: 1000, ante: 100, durationMinutes: 15 },
    { type: "blind", smallBlind: 750, bigBlind: 1500, ante: 200, durationMinutes: 15 },
  ],
};

export function createDefaultState(): TournamentState {
  return {
    structure: DEFAULT_STRUCTURE,
    currentLevelIndex: 0,
    remainingSeconds: DEFAULT_STRUCTURE.levels[0].durationMinutes * 60,
    isRunning: false,
    playerCount: 10,
    eliminatedCount: 0,
    view: "timer",
  };
}
