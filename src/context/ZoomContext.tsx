import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type PanelId = "timer" | "blinds" | "info" | "prizes";

type ZoomState = Record<PanelId, number>;

type ZoomAction =
  | { type: "ZOOM_IN"; panel: PanelId }
  | { type: "ZOOM_OUT"; panel: PanelId };

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4.0;
const ZOOM_STEP = 0.1;
const STORAGE_KEY = "pokerclock-zoom";

function clampZoom(value: number): number {
  return Math.round(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value)) * 10) / 10;
}

function reducer(state: ZoomState, action: ZoomAction): ZoomState {
  switch (action.type) {
    case "ZOOM_IN":
      return { ...state, [action.panel]: clampZoom(state[action.panel] + ZOOM_STEP) };
    case "ZOOM_OUT":
      return { ...state, [action.panel]: clampZoom(state[action.panel] - ZOOM_STEP) };
    default:
      return state;
  }
}

const defaultZoom: ZoomState = { timer: 2.0, blinds: 2.0, info: 2.0, prizes: 2.0 };

function loadZoom(): ZoomState {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultZoom, ...JSON.parse(stored) };
  } catch {
    // ignore
  }
  return defaultZoom;
}

const ZoomStateContext = createContext<ZoomState | null>(null);
const ZoomDispatchContext = createContext<((action: ZoomAction) => void) | null>(null);

export function ZoomProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, loadZoom);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  return (
    <ZoomStateContext.Provider value={state}>
      <ZoomDispatchContext.Provider value={dispatch}>
        {children}
      </ZoomDispatchContext.Provider>
    </ZoomStateContext.Provider>
  );
}

export function useZoom(panel: PanelId) {
  const state = useContext(ZoomStateContext);
  const dispatch = useContext(ZoomDispatchContext);
  if (!state || !dispatch) throw new Error("useZoom must be used within ZoomProvider");

  const zoomIn = useCallback(() => dispatch({ type: "ZOOM_IN", panel }), [dispatch, panel]);
  const zoomOut = useCallback(() => dispatch({ type: "ZOOM_OUT", panel }), [dispatch, panel]);

  return { zoom: state[panel], zoomIn, zoomOut };
}
