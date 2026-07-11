"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

// Reduced motion always follows the OS setting; the only manual override is
// forcing reduction on, since CSS cannot safely force full motion back on
// when the OS itself requests reduced motion.
export type MotionOverride = "system" | "reduced";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToSystemMotion(callback: () => void): () => void {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function readSystemMotion(): boolean {
  return window.matchMedia(QUERY).matches;
}

// The resolved value is written to `document.documentElement.dataset.motion`
// so `globals.css` can apply the same reduction rules the system query would.
export function useMotionPreference(): [
  MotionOverride,
  (value: MotionOverride) => void,
] {
  const [override, setOverride] = useState<MotionOverride>("system");
  const systemReduced = useSyncExternalStore(
    subscribeToSystemMotion,
    readSystemMotion,
    () => false,
  );

  useEffect(() => {
    const effective =
      override === "reduced" || systemReduced ? "reduced" : "full";
    document.documentElement.dataset.motion = effective;
  }, [override, systemReduced]);

  return [override, setOverride];
}
