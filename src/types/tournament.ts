export interface BlindLevel {
  type: "blind";
  smallBlind: number;
  bigBlind: number;
  ante: number;
  durationMinutes: number;
}

export interface BreakLevel {
  type: "break";
  durationMinutes: number;
}

export type Level = BlindLevel | BreakLevel;

export interface PrizeEntry {
  rankFrom: number;
  rankTo: number;
  prize: string;
}

export interface TournamentStructure {
  version: 1;
  name: string;
  startingChips: number;
  levels: Level[];
  prizes: PrizeEntry[];
}

export interface TournamentState {
  structure: TournamentStructure;
  currentLevelIndex: number;
  remainingSeconds: number;
  isRunning: boolean;
  playerCount: number;
  eliminatedCount: number;
  view: "timer" | "editor";
}
