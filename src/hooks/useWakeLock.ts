import { useEffect, useRef } from "react";

export function useWakeLock(enabled: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled || !("wakeLock" in navigator)) return;

    let released = false;

    async function acquire() {
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        wakeLockRef.current.addEventListener("release", () => {
          wakeLockRef.current = null;
        });
      } catch {
        // Wake lock not available or denied
      }
    }

    acquire();

    // Re-acquire on visibility change (tab becomes visible again)
    function onVisibilityChange() {
      if (!released && document.visibilityState === "visible") {
        acquire();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      released = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      wakeLockRef.current?.release();
      wakeLockRef.current = null;
    };
  }, [enabled]);
}
