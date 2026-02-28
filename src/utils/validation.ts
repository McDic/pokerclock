import type { TournamentStructure, Level } from "../types/tournament";

function isBlindLevel(obj: unknown): obj is Level {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;

  if (o.type === "blind") {
    return (
      typeof o.smallBlind === "number" && o.smallBlind >= 0 &&
      typeof o.bigBlind === "number" && o.bigBlind > 0 &&
      typeof o.ante === "number" && o.ante >= 0 &&
      typeof o.durationMinutes === "number" && o.durationMinutes > 0
    );
  }
  if (o.type === "break") {
    return typeof o.durationMinutes === "number" && o.durationMinutes > 0;
  }
  return false;
}

export function validateStructure(data: unknown): TournamentStructure | null {
  if (typeof data !== "object" || data === null) return null;
  const obj = data as Record<string, unknown>;

  if (obj.version !== 1) return null;
  if (typeof obj.name !== "string" || obj.name.trim() === "") return null;
  if (typeof obj.startingChips !== "number" || obj.startingChips <= 0) return null;
  if (!Array.isArray(obj.levels) || obj.levels.length === 0) return null;
  if (!obj.levels.every(isBlindLevel)) return null;

  return {
    version: 1,
    name: obj.name,
    startingChips: obj.startingChips,
    levels: obj.levels as Level[],
  };
}
