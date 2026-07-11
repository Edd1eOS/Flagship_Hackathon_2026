"use client";

import { ChevronUp } from "lucide-react";
import { useState, type ReactNode } from "react";

export type SheetSnapState = "collapsed" | "half" | "full";

const NEXT_STATE: Record<SheetSnapState, SheetSnapState> = {
  collapsed: "half",
  half: "full",
  full: "collapsed",
};

const CONTENT_CLASS: Record<SheetSnapState, string> = {
  collapsed: "hidden",
  half: "min-h-0 flex-1",
  full: "min-h-0 flex-1",
};

export type MobileBottomSheetProps = {
  header: ReactNode;
  children: ReactNode;
};

// Snap-state sheet: the header (Decision Dock summary) is always visible;
// the handle cycles collapsed -> half -> full so the Today panel never
// requires a drag gesture to reach.
export function MobileBottomSheet({
  header,
  children,
}: MobileBottomSheetProps) {
  const [snap, setSnap] = useState<SheetSnapState>("half");

  return (
    <div
      data-snap-state={snap}
      className="flex min-h-0 flex-1 flex-col border-t border-[var(--color-line)] bg-[var(--color-paper)] lg:hidden"
    >
      {header}
      <button
        type="button"
        onClick={() => setSnap((current) => NEXT_STATE[current])}
        aria-label={
          snap === "collapsed"
            ? "Expand today panel"
            : snap === "half"
              ? "Expand today panel fully"
              : "Collapse today panel"
        }
        className="flex min-h-11 items-center justify-center gap-2 border-t border-[var(--color-line)] text-[var(--color-ink)]/50"
      >
        <span className="h-1 w-10 rounded-full bg-[var(--color-line)]" />
        <ChevronUp
          size={14}
          aria-hidden="true"
          className={`transition-transform ${snap === "full" ? "rotate-180" : ""}`}
        />
      </button>
      <div className={`overflow-y-auto ${CONTENT_CLASS[snap]}`}>
        {snap !== "collapsed" ? children : null}
      </div>
    </div>
  );
}
