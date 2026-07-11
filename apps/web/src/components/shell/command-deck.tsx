import { ArrowLeft, Radar, Sparkles } from "lucide-react";
import type { Mission, PurchaseDecision } from "@lemonade/domain";

import { LOCATION_STATE_LABEL } from "../world/location-state-label";
import type { LocationId, LocationState } from "@lemonade/domain";

export type SelectedLocationContext = {
  id: LocationId;
  label: string;
  blurb: string;
  state: LocationState;
  reason: string | null;
  lockedHint: string | null;
};

export type ResidentRow = {
  id: string;
  role: string;
  locationLabel: string | null;
  isPreview: boolean;
  isActive: boolean;
};

export type CommandDeckProps = {
  readyDecisions: PurchaseDecision[];
  openMissions: Mission[];
  residentRows: ResidentRow[];
  selectedResidentId: string | null;
  canConfirmPlan: boolean;
  assignmentWorking: boolean;
  assignmentError: string | null;
  patrolLabel: string;
  selectedLocation: SelectedLocationContext | null;
  onClearSelection: () => void;
  onStartCapture: () => void;
  onReviewDecision: (decisionId: string) => void;
  onSelectResident: (residentId: string) => void;
  onCancelAssignment: (residentId: string) => void;
  onConfirmPlan: () => void;
};

const ROLE_LABEL: Record<string, string> = {
  mender: "Mender",
  host: "Host",
};

export function CommandDeck({
  readyDecisions,
  openMissions,
  residentRows,
  selectedResidentId,
  canConfirmPlan,
  assignmentWorking,
  assignmentError,
  patrolLabel,
  selectedLocation,
  onClearSelection,
  onStartCapture,
  onReviewDecision,
  onSelectResident,
  onCancelAssignment,
  onConfirmPlan,
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
          className="flex min-h-11 items-center gap-1.5 self-start text-sm font-semibold text-[var(--color-ink)]/70 hover:text-[var(--color-ink)]"
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
          <dd
            className={
              selectedLocation.reason || selectedLocation.lockedHint
                ? "mb-2"
                : ""
            }
          >
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
          {selectedLocation.lockedHint ? (
            <>
              <dt className="font-semibold text-[var(--color-ink)]/60">
                How to unlock
              </dt>
              <dd>{selectedLocation.lockedHint}</dd>
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
              className="flex min-h-11 shrink-0 items-center rounded-full bg-[var(--color-coral)] px-3 text-xs font-bold text-white"
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
          {residentRows.map((resident) => (
            <li key={resident.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectResident(resident.id)}
                aria-pressed={selectedResidentId === resident.id}
                className={`flex min-h-11 flex-1 items-center justify-between rounded-lg border px-2 text-sm ${
                  selectedResidentId === resident.id
                    ? "border-[var(--color-lemon)] bg-[var(--color-lemon)]/20"
                    : "border-transparent"
                }`}
              >
                <span className="font-semibold text-[var(--color-ink)]">
                  {ROLE_LABEL[resident.role] ?? resident.role}
                </span>
                <span className="text-[var(--color-ink)]/60">
                  {resident.isActive
                    ? `Active — ${resident.locationLabel}`
                    : resident.isPreview
                      ? `Previewed — ${resident.locationLabel}`
                      : "Unassigned"}
                </span>
              </button>
              {resident.isPreview ? (
                <button
                  type="button"
                  onClick={() => onCancelAssignment(resident.id)}
                  className="min-h-11 shrink-0 rounded-full border border-[var(--color-line)] px-3 text-xs font-bold"
                >
                  Cancel
                </button>
              ) : null}
            </li>
          ))}
        </ul>
        {selectedResidentId ? (
          <p className="mt-2 text-xs text-[var(--color-ink)]/70">
            Tap an available project in town to preview this assignment.
          </p>
        ) : null}
        {assignmentError ? (
          <p role="alert" className="mt-2 text-xs text-[var(--color-coral)]">
            {assignmentError}
          </p>
        ) : null}
        {canConfirmPlan ? (
          <button
            type="button"
            disabled={assignmentWorking}
            onClick={onConfirmPlan}
            className="mt-2 min-h-11 w-full rounded-full bg-[var(--color-leaf)] text-sm font-bold text-white disabled:opacity-40"
          >
            Confirm plan
          </button>
        ) : null}
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
