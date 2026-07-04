import { useEffect, useRef, useState } from "react";

/**
 * Shared animation heartbeat for the SVG diagrams.
 * Returns a monotonically increasing tick; stays frozen when the user
 * prefers reduced motion or the tab is hidden.
 */
export function useTick(intervalMs: number): number {
  const [tick, setTick] = useState(0);
  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current) return;
    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (id === null) id = setInterval(() => setTick((t) => t + 1), intervalMs);
    };
    const stop = () => {
      if (id !== null) {
        clearInterval(id);
        id = null;
      }
    };
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [intervalMs]);

  return tick;
}
