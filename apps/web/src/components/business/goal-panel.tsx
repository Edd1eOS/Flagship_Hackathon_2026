import type {
  Goal,
  PlannedAllocation,
  PurchaseDecision,
} from "@lemonade/domain";

import { formatAud } from "../../lib/format";

export type GoalPanelProps = {
  goal: Goal | null;
  plannedAllocations: PlannedAllocation[];
  decisions: PurchaseDecision[];
};

export function GoalPanel({
  goal,
  plannedAllocations,
  decisions,
}: GoalPanelProps) {
  if (!goal) {
    return (
      <aside
        aria-label="Goal"
        className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4 lg:w-[400px] lg:shrink-0 lg:border-l lg:border-[var(--color-line)] lg:p-6"
      >
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Goal
        </h2>
        <p className="text-sm text-[var(--color-ink)]/60">No goal set yet.</p>
      </aside>
    );
  }

  const trackedTotal = goal.startingAmount + goal.plannedAllocationTotal;
  const progressPercent = Math.min(
    100,
    Math.round((trackedTotal / goal.targetAmount) * 100),
  );
  const allocations = plannedAllocations
    .filter((allocation) => allocation.goalId === goal.id)
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <aside
      aria-label="Goal"
      className="flex h-full w-full flex-col gap-5 overflow-y-auto p-4 lg:w-[400px] lg:shrink-0 lg:border-l lg:border-[var(--color-line)] lg:p-6"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-leaf)]">
          {goal.type}
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl">
          {goal.name}
        </h2>
      </div>

      <section>
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${progressPercent}% of ${formatAud(goal.targetAmount)} tracked`}
          className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-cream)]"
        >
          <div
            className="h-full rounded-full bg-[var(--color-leaf)] transition-[width]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-semibold">
          {formatAud(trackedTotal)} of {formatAud(goal.targetAmount)} tracked (
          {progressPercent}%)
        </p>
        <p className="mt-1 text-xs text-[var(--color-ink)]/60">
          Starting balance {formatAud(goal.startingAmount)} + planned{" "}
          {formatAud(goal.plannedAllocationTotal)}. Planned money only - this is
          not saved or transferred funds.
        </p>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink)]/60">
          Planned allocations ({allocations.length})
        </h3>
        {allocations.length ? (
          <ul className="mt-2 flex flex-col gap-2">
            {allocations.map((allocation) => {
              const decision = decisions.find(
                (candidate) => candidate.id === allocation.decisionId,
              );
              return (
                <li
                  key={allocation.id}
                  className="flex items-center justify-between border-b border-[var(--color-line)] py-2 text-sm"
                >
                  <span>{decision?.name ?? "Skipped purchase"}</span>
                  <span className="font-bold">
                    {formatAud(allocation.amount)}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[var(--color-ink)]/60">
            No planned allocations yet. When you skip a decision, you can plan
            part of the price toward this goal from Ready review.
          </p>
        )}
      </section>
    </aside>
  );
}
