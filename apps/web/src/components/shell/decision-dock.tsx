import { Snowflake, Sparkles, Wrench } from "lucide-react";
import type { Mission, PurchaseDecision } from "@lemonade/domain";

export type DecisionDockProps = {
  readyDecisions: PurchaseDecision[];
  coolingDecisions: PurchaseDecision[];
  openMissions: Mission[];
  onSelectReady: () => void;
  onSelectCooling: () => void;
  onSelectMissions: () => void;
};

function formatReviewTime(reviewAt: string | undefined): string {
  if (!reviewAt) return "";
  const date = new Date(reviewAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function DecisionDock({
  readyDecisions,
  coolingDecisions,
  openMissions,
  onSelectReady,
  onSelectCooling,
  onSelectMissions,
}: DecisionDockProps) {
  const nearestCooling = coolingDecisions[0] ?? null;
  const coolingOverflow = Math.max(coolingDecisions.length - 1, 0);

  return (
    <div
      aria-label="Decision status"
      className="grid h-28 shrink-0 grid-cols-3 gap-px overflow-hidden border-t border-[var(--color-line)] bg-[var(--color-line)]"
    >
      <button
        type="button"
        onClick={onSelectReady}
        className="flex flex-col justify-center gap-1 bg-[var(--color-paper)] px-3 text-left"
      >
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--color-coral)]">
          <Sparkles size={14} aria-hidden="true" />
          Ready ({readyDecisions.length})
        </span>
        <span className="truncate text-sm font-semibold text-[var(--color-ink)]">
          {readyDecisions[0]?.name ?? "Nothing ready"}
        </span>
      </button>

      <button
        type="button"
        onClick={onSelectCooling}
        className="flex flex-col justify-center gap-1 bg-[var(--color-paper)] px-3 text-left"
      >
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--color-sky)]">
          <Snowflake size={14} aria-hidden="true" />
          Cooling ({coolingDecisions.length})
        </span>
        {nearestCooling ? (
          <span className="truncate text-sm font-semibold text-[var(--color-ink)]">
            {nearestCooling.name}
            {nearestCooling.reviewAt
              ? ` · ${formatReviewTime(nearestCooling.reviewAt)}`
              : ""}
            {coolingOverflow > 0 ? ` +${coolingOverflow} more` : ""}
          </span>
        ) : (
          <span className="text-sm text-[var(--color-ink)]/60">
            Nothing cooling
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={onSelectMissions}
        className="flex flex-col justify-center gap-1 bg-[var(--color-paper)] px-3 text-left"
      >
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--color-leaf)]">
          <Wrench size={14} aria-hidden="true" />
          Missions ({openMissions.length}/2)
        </span>
        <span className="text-sm text-[var(--color-ink)]/60">
          {openMissions.length > 0
            ? `${openMissions.length} in progress`
            : "No active mission"}
        </span>
      </button>
    </div>
  );
}
