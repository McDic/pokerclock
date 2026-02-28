import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from "react";
import type { TournamentState, TournamentStructure } from "../types/tournament";
import { createDefaultState } from "../utils/defaults";

const STORAGE_KEY = "pokerclock-state";

// Actions
export type Action =
  | { type: "TIMER_TICK" }
  | { type: "TIMER_START" }
  | { type: "TIMER_PAUSE" }
  | { type: "TIMER_TOGGLE" }
  | { type: "TIMER_RESET_LEVEL" }
  | { type: "TIMER_ADD_MINUTE" }
  | { type: "TIMER_SUB_MINUTE" }
  | { type: "LEVEL_NEXT" }
  | { type: "LEVEL_PREV" }
  | { type: "PLAYER_ADD" }
  | { type: "PLAYER_ELIMINATE" }
  | { type: "PLAYER_SET"; playerCount: number }
  | { type: "PLAYER_SET_ELIMINATED"; eliminatedCount: number }
  | { type: "STRUCTURE_UPDATE"; structure: TournamentStructure }
  | { type: "STRUCTURE_IMPORT"; structure: TournamentStructure }
  | { type: "SET_VIEW"; view: "timer" | "editor" }
  | { type: "RESET_ALL" };

function reducer(state: TournamentState, action: Action): TournamentState {
  switch (action.type) {
    case "TIMER_TICK": {
      if (!state.isRunning || state.remainingSeconds <= 0) return state;
      const next = state.remainingSeconds - 1;
      if (next <= 0) {
        // Auto-advance to next level
        const nextIndex = state.currentLevelIndex + 1;
        if (nextIndex < state.structure.levels.length) {
          return {
            ...state,
            remainingSeconds: 0,
            isRunning: false,
            currentLevelIndex: nextIndex,
          };
        }
        return { ...state, remainingSeconds: 0, isRunning: false };
      }
      return { ...state, remainingSeconds: next };
    }

    case "TIMER_START":
      if (state.remainingSeconds <= 0) return state;
      return { ...state, isRunning: true };

    case "TIMER_PAUSE":
      return { ...state, isRunning: false };

    case "TIMER_TOGGLE":
      if (!state.isRunning && state.remainingSeconds <= 0) return state;
      return { ...state, isRunning: !state.isRunning };

    case "TIMER_RESET_LEVEL": {
      const level = state.structure.levels[state.currentLevelIndex];
      return {
        ...state,
        remainingSeconds: level.durationMinutes * 60,
        isRunning: false,
      };
    }

    case "TIMER_ADD_MINUTE":
      return { ...state, remainingSeconds: state.remainingSeconds + 60 };

    case "TIMER_SUB_MINUTE":
      return { ...state, remainingSeconds: Math.max(0, state.remainingSeconds - 60) };

    case "LEVEL_NEXT": {
      const nextIdx = state.currentLevelIndex + 1;
      if (nextIdx >= state.structure.levels.length) return state;
      return {
        ...state,
        currentLevelIndex: nextIdx,
        remainingSeconds: state.structure.levels[nextIdx].durationMinutes * 60,
        isRunning: false,
      };
    }

    case "LEVEL_PREV": {
      const prevIdx = state.currentLevelIndex - 1;
      if (prevIdx < 0) return state;
      return {
        ...state,
        currentLevelIndex: prevIdx,
        remainingSeconds: state.structure.levels[prevIdx].durationMinutes * 60,
        isRunning: false,
      };
    }

    case "PLAYER_ADD":
      return { ...state, playerCount: state.playerCount + 1 };

    case "PLAYER_ELIMINATE":
      if (state.eliminatedCount >= state.playerCount) return state;
      return { ...state, eliminatedCount: state.eliminatedCount + 1 };

    case "PLAYER_SET":
      return {
        ...state,
        playerCount: Math.max(0, action.playerCount),
        eliminatedCount: Math.min(state.eliminatedCount, Math.max(0, action.playerCount)),
      };

    case "PLAYER_SET_ELIMINATED":
      return {
        ...state,
        eliminatedCount: Math.max(0, Math.min(action.eliminatedCount, state.playerCount - 1)),
      };

    case "STRUCTURE_UPDATE":
      return {
        ...state,
        structure: action.structure,
        currentLevelIndex: Math.min(
          state.currentLevelIndex,
          action.structure.levels.length - 1
        ),
        remainingSeconds:
          action.structure.levels[
            Math.min(state.currentLevelIndex, action.structure.levels.length - 1)
          ].durationMinutes * 60,
        isRunning: false,
      };

    case "STRUCTURE_IMPORT":
      return {
        ...state,
        structure: action.structure,
        currentLevelIndex: 0,
        remainingSeconds: action.structure.levels[0].durationMinutes * 60,
        isRunning: false,
      };

    case "SET_VIEW":
      return {
        ...state,
        view: action.view,
        isRunning: action.view === "editor" ? false : state.isRunning,
      };

    case "RESET_ALL":
      return createDefaultState();

    default:
      return state;
  }
}

function loadState(): TournamentState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as TournamentState;
      // Always restore paused
      return { ...parsed, isRunning: false };
    }
  } catch {
    // Corrupted storage — use defaults
  }
  return createDefaultState();
}

function saveState(state: TournamentState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full — silently fail
  }
}

// Context
const TournamentStateContext = createContext<TournamentState | null>(null);
const TournamentDispatchContext = createContext<Dispatch<Action> | null>(null);

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <TournamentStateContext.Provider value={state}>
      <TournamentDispatchContext.Provider value={dispatch}>
        {children}
      </TournamentDispatchContext.Provider>
    </TournamentStateContext.Provider>
  );
}

export function useTournamentState(): TournamentState {
  const ctx = useContext(TournamentStateContext);
  if (!ctx) throw new Error("useTournamentState must be used within TournamentProvider");
  return ctx;
}

export function useTournamentDispatch(): Dispatch<Action> {
  const ctx = useContext(TournamentDispatchContext);
  if (!ctx) throw new Error("useTournamentDispatch must be used within TournamentProvider");
  return ctx;
}
