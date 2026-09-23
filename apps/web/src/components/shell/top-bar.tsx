"use client";

import { HelpCircle, Radar, Settings, Sparkles } from "lucide-react";
import { useState } from "react";

import type { MotionOverride } from "../../lib/use-motion-preference";

export type TopBarProps = {
  profileName: string;
  goalName: string | null;
  goalDetail: string | null;
  level: number;
  totalXp: number;
  xpPerLevel: number;
  patrolLabel: string;
  motionOverride: MotionOverride;
  onMotionOverrideChange: (value: MotionOverride) => void;
  onShowHelp: () => void;
  onResetDemo: () => void;
};

export function TopBar({
  profileName,
  goalName,
  goalDetail,
  level,
  totalXp,
  xpPerLevel,
  patrolLabel,
  motionOverride,
  onMotionOverrideChange,
  onShowHelp,
  onResetDemo,
}: TopBarProps) {
  const xpIntoLevel = totalXp % xpPerLevel;
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="relative flex h-14 items-center justify-between gap-4 border-b border-[var(--color-line)] bg-[var(--color-paper)] px-4 lg:h-16 lg:px-6">
      <div className="flex min-w-0 items-baseline gap-2">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--color-ink)] sm:text-xl lg:text-2xl">
          Lemonade
        </span>
        <span className="hidden text-xs font-medium text-[var(--color-ink)]/60 xl:inline">
          Mindful Spending
        </span>
      </div>

      <div className="hidden min-w-0 flex-1 justify-center text-center lg:flex">
        {goalName ? (
          <span
            className="truncate text-sm font-semibold text-[var(--color-ink)]"
            title={goalDetail ?? undefined}
          >
            {goalName}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <button
          type="button"
          aria-label="How this works"
          title="How this works"
          onClick={onShowHelp}
          className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-ink)] hover:bg-[var(--color-cream)]"
        >
          <HelpCircle size={18} aria-hidden="true" />
        </button>

        <span
          title={`Level ${level} · ${xpIntoLevel}/${xpPerLevel} XP toward the next level (${totalXp} XP total). Earned by honestly reviewing decisions, not by spending.`}
          aria-label={`Level ${level}, ${xpIntoLevel} of ${xpPerLevel} experience points toward the next level`}
          className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] px-2 py-1 text-xs font-semibold text-[var(--color-ink)]/70 sm:px-3"
        >
          <Sparkles size={14} aria-hidden="true" />
          Lv {level}
        </span>

        <span
          title={`Patrol: ${patrolLabel}`}
          aria-label={`Patrol: ${patrolLabel}`}
          className="hidden items-center gap-1.5 rounded-full border border-[var(--color-line)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)]/70 sm:flex"
        >
          <Radar size={14} aria-hidden="true" />
          <span className="hidden sm:inline">{patrolLabel}</span>
        </span>

        <div className="relative">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={settingsOpen}
            aria-label="Settings"
            onClick={() => setSettingsOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-ink)] hover:bg-[var(--color-cream)]"
          >
            <Settings size={18} aria-hidden="true" />
          </button>
          {settingsOpen ? (
            <div
              role="dialog"
              aria-label="Settings"
              className="absolute right-0 top-11 z-20 w-56 rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-3 shadow-lg"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]/60">
                Reduced motion
              </p>
              <div className="mt-2 flex flex-col gap-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="motion-override"
                    checked={motionOverride === "system"}
                    onChange={() => onMotionOverrideChange("system")}
                  />
                  Follow system
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="motion-override"
                    checked={motionOverride === "reduced"}
                    onChange={() => onMotionOverrideChange("reduced")}
                  />
                  Always reduce motion
                </label>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSettingsOpen(false);
                  onResetDemo();
                }}
                className="mt-3 min-h-11 w-full rounded-full border border-[var(--color-line)] text-sm font-bold text-[var(--color-coral)]"
              >
                Reset Demo
              </button>
            </div>
          ) : null}
        </div>

        <span className="hidden rounded-full bg-[var(--color-cream)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)]/80 sm:inline">
          {profileName} · Demo
        </span>
      </div>
    </header>
  );
}
