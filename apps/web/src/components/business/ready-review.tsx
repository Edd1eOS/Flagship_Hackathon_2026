"use client";

import type {
  Goal,
  Mission,
  OwnedItem,
  PurchaseDecision,
  ReflectionOutcome,
  ReuseAction,
} from "@lemonade/domain";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";

import type { LemonadeStoreState as WebStoreState } from "../../store/lemonade-store";

type Dispatch = WebStoreState["dispatch"];

export type ReadyReviewProps = {
  decision: PurchaseDecision;
  ownedItems: OwnedItem[];
  missions: Mission[];
  goals: Goal[];
  dispatch: Dispatch;
  onClose: () => void;
};

export function ReadyReview({
  decision,
  ownedItems,
  missions,
  goals,
  dispatch,
  onClose,
}: ReadyReviewProps) {
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [completeMessage, setCompleteMessage] = useState<string | null>(null);
  const [showAllocation, setShowAllocation] = useState(false);
  const [allocationAmount, setAllocationAmount] = useState("25.00");

  const match = useMemo(
    () =>
      decision.overlapItemIds
        .map((id) => ownedItems.find((item) => item.id === id))
        .find((item): item is OwnedItem => Boolean(item)) ?? null,
    [decision.overlapItemIds, ownedItems],
  );
  const linkedMission = missions.find(
    (mission) => mission.decisionId === decision.id,
  );

  async function run(command: Parameters<Dispatch>[0]) {
    const result = await dispatch(command);
    if (!result.ok) throw new Error(result.error.message);
    return result;
  }

  async function resolve(
    outcome: ReflectionOutcome,
    message: string,
    addToMyStuff = false,
  ) {
    setWorking(true);
    setError(null);
    try {
      await run({
        type: "RESOLVE_DECISION",
        commandId: crypto.randomUUID(),
        decisionId: decision.id,
        outcome,
        reason: message,
        addToMyStuff,
      });
      setCompleteMessage(message);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setWorking(false);
    }
  }

  async function resolveWithReuse(
    action: ReuseAction,
    outcome: "reused_existing" | "repaired",
  ) {
    if (!match) {
      setError("Add or select an owned item before recording reuse.");
      return;
    }
    setWorking(true);
    setError(null);
    try {
      if (action === "repair" && !linkedMission) {
        const offered = await run({
          type: "OFFER_MISSION",
          commandId: crypto.randomUUID(),
          decisionId: decision.id,
          ownedItemId: match.id,
          missionType: "REPAIR",
        });
        const mission = offered.state.missions.at(-1);
        if (!mission) throw new Error("The repair mission could not be found.");
        await run({
          type: "ACCEPT_MISSION",
          commandId: crypto.randomUUID(),
          missionId: mission.id,
        });
      }
      await run({
        type: "COMMIT_REUSE",
        commandId: crypto.randomUUID(),
        decisionId: decision.id,
        ownedItemId: match.id,
        action,
        note:
          action === "repair"
            ? "User confirmed the existing item was repaired."
            : "User confirmed the existing item solved the job.",
      });
      await run({
        type: "RESOLVE_DECISION",
        commandId: crypto.randomUUID(),
        decisionId: decision.id,
        outcome,
        reason:
          outcome === "repaired"
            ? "I repaired what I already own."
            : "What I already own solved the job.",
      });
      setCompleteMessage(
        outcome === "repaired"
          ? "Repair confirmed. Workshop activity is now available."
          : "Existing item confirmed. No purchase was needed.",
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setWorking(false);
    }
  }

  async function extend() {
    setWorking(true);
    setError(null);
    try {
      await run({
        type: "EXTEND_COOLING",
        commandId: crypto.randomUUID(),
        decisionId: decision.id,
      });
      setCompleteMessage("Cooling extended for another 24 hours.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setWorking(false);
    }
  }

  async function planAllocation() {
    const goal = goals[0];
    if (!goal)
      return setError("No goal is available for a planned allocation.");
    setWorking(true);
    setError(null);
    try {
      await run({
        type: "PLAN_ALLOCATION",
        commandId: crypto.randomUUID(),
        decisionId: decision.id,
        goalId: goal.id,
        amount: Number(allocationAmount),
      });
      setCompleteMessage(
        `${allocationAmount} AUD is planned for ${goal.name}; no money was transferred.`,
      );
      setShowAllocation(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setWorking(false);
    }
  }

  return (
    <aside
      aria-label="Ready review"
      className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4 lg:w-[400px] lg:shrink-0 lg:border-l lg:border-[var(--color-line)] lg:p-6"
    >
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-1.5 self-start text-sm font-semibold"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Today
      </button>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-coral)]">
          Ready review
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl">
          {decision.name}
        </h2>
      </div>
      <dl className="border-y border-[var(--color-line)] py-3 text-sm">
        <dt className="font-semibold text-[var(--color-ink)]/60">
          Original job
        </dt>
        <dd>{decision.job}</dd>
        <dt className="mt-2 font-semibold text-[var(--color-ink)]/60">
          Original motive
        </dt>
        <dd className="capitalize">{decision.motive.replace("_", " ")}</dd>
      </dl>
      <section>
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-leaf)]">
          Best same-job match
        </p>
        {match ? (
          <>
            <p className="mt-2 font-bold">{match.name}</p>
            <p className="text-sm text-[var(--color-ink)]/70">
              {match.repairNote ?? `Already covers: ${decision.job}`}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm">No saved item matches this job yet.</p>
        )}
      </section>
      {linkedMission ? (
        <p className="text-sm">
          <strong>Mission:</strong>{" "}
          {linkedMission.type.replaceAll("_", " ").toLowerCase()} ·{" "}
          {linkedMission.status}
        </p>
      ) : null}

      {completeMessage ? (
        <div
          role="status"
          className="rounded-lg border border-[var(--color-leaf)] p-3 text-sm"
        >
          <p className="font-semibold">{completeMessage}</p>
          {decision.status === "skipped" ? (
            <button
              type="button"
              onClick={() => setShowAllocation(true)}
              className="mt-3 text-sm font-bold underline"
            >
              Plan part of the skipped price
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-2">
          <button
            disabled={working || !match}
            type="button"
            onClick={() =>
              void resolveWithReuse("use_existing", "reused_existing")
            }
            className="min-h-11 rounded-full bg-[var(--color-leaf)] px-4 text-sm font-bold text-white disabled:opacity-40"
          >
            What I own solved it
          </button>
          <button
            disabled={working || !match}
            type="button"
            onClick={() => void resolveWithReuse("repair", "repaired")}
            className="min-h-11 rounded-full border-2 border-[var(--color-leaf)] px-4 text-sm font-bold disabled:opacity-40"
          >
            I repaired it
          </button>
          <button
            disabled={working}
            type="button"
            onClick={() =>
              void resolve("bought", "I chose to buy after reflecting.", true)
            }
            className="min-h-11 rounded-full border border-[var(--color-line)] px-4 text-sm font-bold"
          >
            Buy — neutral
          </button>
          <button
            disabled={working}
            type="button"
            onClick={() =>
              void resolve(
                "reclassified_need",
                "I confirmed this is a real need.",
              )
            }
            className="min-h-11 rounded-full border border-[var(--color-line)] px-4 text-sm font-bold"
          >
            It is a real need
          </button>
          <button
            disabled={working}
            type="button"
            onClick={() => void extend()}
            className="min-h-11 rounded-full border border-[var(--color-line)] px-4 text-sm font-bold"
          >
            Wait another 24 hours
          </button>
        </div>
      )}

      {showAllocation ? (
        <div className="border-t border-[var(--color-line)] pt-4">
          <label className="text-sm font-semibold">
            Planned amount (AUD)
            <input
              value={allocationAmount}
              onChange={(event) => setAllocationAmount(event.target.value)}
              inputMode="decimal"
              className="mt-1 min-h-11 w-full rounded-lg border border-[var(--color-line)] px-3 font-normal"
            />
          </label>
          <p className="mt-2 text-xs text-[var(--color-ink)]/60">
            Planning only. Lemonade does not move or save money.
          </p>
          <button
            type="button"
            disabled={working}
            onClick={() => void planAllocation()}
            className="mt-3 min-h-11 w-full rounded-full bg-[var(--color-ink)] text-sm font-bold text-white"
          >
            Confirm planned allocation
          </button>
        </div>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="text-sm font-semibold text-[var(--color-coral)]"
        >
          {error}
        </p>
      ) : null}
    </aside>
  );
}
