import { ArrowLeft, Radar, Sparkles } from "lucide-react";
import type { Mission, PurchaseDecision } from "@lemonade/domain";

import type { TownResidentView } from "@lemonade/game-engine";
import { LOCATION_STATE_LABEL } from "../world/location-state-label";
import type { LocationId, LocationState } from "@lemonade/domain";

export type SelectedLocationContext = {
  id: LocationId;
  label: string;
  blurb: string;
  state: LocationState;
  reason: string | null;
};

export type CommandDeckProps = {
  readyDecisions: PurchaseDecision[];
  openMissions: Mission[];
  residents: TownResidentView[];
  patrolLabel: string;
  selectedLocation: SelectedLocationContext | null;
  onClearSelection: () => void;
  onStartCapture: () => void;
  onReviewDecision: (decisionId: string) => void;
};

const ROLE_LABEL: Record<string, string> = {
  mender: "Mender",
  host: "Host",
};

export function CommandDeck({
  readyDecisions,
  openMissions,
  residents,
  patrolLabel,
  selectedLocation,
  onClearSelection,
  onStartCapture,
  onReviewDecision,
}: CommandDeckProps) {
  if (selectedLocation) {
    return (
      <aside
        aria-label="Location details"
        className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4 lg:w-[336px] lg:shrink-0 lg:border-l lg:border-[var(--color-line)] lg:p-5"
      >
        <button
          type="button"
          onClick={onClearSelection}
          className="flex items-center gap-1.5 self-start text-sm font-semibold text-[var(--color-ink)]/70 hover:text-[var(--color-ink)]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Today
        </button>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
          {selectedLocation.label}
        </h2>
        <p className="text-sm text-[var(--color-ink)]/70">
          {selectedLocation.blurb}
        </p>
        <dl className="rounded-lg border border-[var(--color-line)] p-3 text-sm">
          <dt className="font-semibold text-[var(--color-ink)]/60">State</dt>
          <dd className={selectedLocation.reason ? "mb-2" : ""}>
            {LOCATION_STATE_LABEL[selectedLocation.state]}
          </dd>
          {selectedLocation.reason ? (
            <>
              <dt className="font-semibold text-[var(--color-ink)]/60">
                Why it&apos;s open
              </dt>
              <dd>{selectedLocation.reason}</dd>
            </>
          ) : null}
        </dl>
      </aside>
    );
  }

  const topReady = readyDecisions[0] ?? null;

  return (
    <aside
      aria-label="Today"
      className="flex h-full w-full flex-col gap-5 overflow-y-auto p-4 lg:w-[336px] lg:shrink-0 lg:border-l lg:border-[var(--color-line)] lg:p-5"
    >
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
        Today
      </h2>

      <section
        aria-labelledby="ready-now-heading"
        className="border-t border-[var(--color-line)] pt-4"
      >
        <h3
          id="ready-now-heading"
          className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink)]/60"
        >
          Ready now
        </h3>
        {topReady ? (
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-sm font-semibold text-[var(--color-ink)]">
              {topReady.name}
            </p>
            <button
              type="button"
              onClick={() => onReviewDecision(topReady.id)}
              className="shrink-0 rounded-full bg-[var(--color-coral)] px-3 py-1.5 text-xs font-bold text-white"
            >
              Review now
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-[var(--color-ink)]/60">
            Nothing waiting for review.
          </p>
        )}
      </section>

      <section
        aria-labelledby="active-mission-heading"
        className="border-t border-[var(--color-line)] pt-4"
      >
        <h3
          id="active-mission-heading"
          className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink)]/60"
        >
          Active mission
        </h3>
        {openMissions.length > 0 ? (
          <p className="mt-2 text-sm text-[var(--color-ink)]">
            {openMissions.length} mission{openMissions.length === 1 ? "" : "s"}{" "}
            in progress.
          </p>
        ) : (
          <p className="mt-2 text-sm text-[var(--color-ink)]/60">
            No active mission yet.
          </p>
        )}
      </section>

      <section
        aria-labelledby="town-plan-heading"
        className="border-t border-[var(--color-line)] pt-4"
      >
        <h3
          id="town-plan-heading"
          className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink)]/60"
        >
          Town plan
        </h3>
        <ul className="mt-2 flex flex-col gap-1.5">
          {residents
            .filter((resident) => resident.role !== "scout")
            .map((resident) => (
              <li
                key={resident.id}
                className="flex items-center justify-between text-sm text-[var(--color-ink)]"
              >
                <span className="font-semibold">
                  {ROLE_LABEL[resident.role] ?? resident.role}
                </span>
                <span className="text-[var(--color-ink)]/60">
                  {resident.projectId ? "Assigned" : "Unassigned"}
                </span>
              </li>
            ))}
        </ul>
      </section>

      <section
        aria-labelledby="patrol-heading"
        className="border-t border-[var(--color-line)] pt-4"
      >
        <h3
          id="patrol-heading"
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--color-ink)]/60"
        >
          <Radar size={14} aria-hidden="true" />
          Patrol
        </h3>
        <p className="mt-2 text-sm text-[var(--color-ink)]">{patrolLabel}</p>
      </section>

      <button
        type="button"
        onClick={onStartCapture}
        className="mt-auto flex items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-4 py-3 text-sm font-bold text-white"
      >
        <Sparkles size={16} aria-hidden="true" />
        I&apos;m tempted
      </button>
    </aside>
  );
}
