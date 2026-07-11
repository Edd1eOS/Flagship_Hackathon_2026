"use client";

import { Radar, Settings, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

import type { MotionOverride } from "../../lib/use-motion-preference";

export type TopBarProps = {
  profileName: string;
  goalName: string | null;
  goalDetail: string | null;
  patrolLabel: string;
  motionOverride: MotionOverride;
  onMotionOverrideChange: (value: MotionOverride) => void;
};

export function TopBar({
  profileName,
  goalName,
  goalDetail,
  patrolLabel,
  motionOverride,
  onMotionOverrideChange,
}: TopBarProps) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="relative flex h-14 items-center justify-between gap-4 border-b border-[var(--color-line)] bg-[var(--color-paper)] px-4 lg:h-16 lg:px-6">
      <div className="flex min-w-0 items-baseline gap-2">
        <span className="font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)] lg:text-2xl">
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
        <span
          title={`Patrol: ${patrolLabel}`}
          aria-label={`Patrol: ${patrolLabel}`}
          className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] px-2 py-1 text-xs font-semibold text-[var(--color-ink)]/70 sm:px-3"
        >
          <Radar size={14} aria-hidden="true" />
          <span className="hidden sm:inline">{patrolLabel}</span>
        </span>

        <button
          type="button"
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
          onClick={() => setSoundEnabled((value) => !value)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink)] hover:bg-[var(--color-cream)]"
        >
          {soundEnabled ? (
            <Volume2 size={18} aria-hidden="true" />
          ) : (
            <VolumeX size={18} aria-hidden="true" />
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={settingsOpen}
            aria-label="Settings"
            onClick={() => setSettingsOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink)] hover:bg-[var(--color-cream)]"
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
