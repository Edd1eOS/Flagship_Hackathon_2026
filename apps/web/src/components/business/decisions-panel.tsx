"use client";

import {
  getMissionReadiness,
  type Mission,
  type PurchaseDecision,
} from "@lemonade/domain";

import type { LemonadeStoreState } from "../../store/lemonade-store";

export type DecisionsPanelProps = {
  decisions: PurchaseDecision[];
  missions: Mission[];
  dispatch: LemonadeStoreState["dispatch"];
  onReview: (decisionId: string) => void;
};

export function DecisionsPanel({
  decisions,
  missions,
  dispatch,
  onReview,
}: DecisionsPanelProps) {
  const ready = decisions.filter((decision) => decision.status === "ready");
  const cooling = decisions.filter((decision) => decision.status === "cooling");
  const history = decisions.filter((decision) =>
    ["bought", "skipped", "reclassified_need"].includes(decision.status),
  );

  return (
    <aside
      aria-label="Decisions"
      className="flex h-full w-full flex-col gap-5 overflow-y-auto p-4 lg:w-[400px] lg:shrink-0 lg:border-l lg:border-[var(--color-line)] lg:p-6"
    >
      <h2 className="font-[family-name:var(--font-display)] text-3xl">
        Decisions
      </h2>
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--color-coral)]">
          Ready ({ready.length})
        </h3>
        {ready.length ? (
          ready.map((decision) => (
            <button
              key={decision.id}
              type="button"
              onClick={() => onReview(decision.id)}
              className="mt-2 flex min-h-11 w-full items-center justify-between border-y border-[var(--color-line)] py-2 text-left text-sm font-bold"
            >
              <span>{decision.name}</span>
              <span>Review</span>
            </button>
          ))
        ) : (
          <p className="mt-2 text-sm text-[var(--color-ink)]/60">
            Nothing ready.
          </p>
        )}
      </section>
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--color-sky)]">
          Cooling ({cooling.length})
        </h3>
        {cooling.length ? (
          cooling.map((decision) => (
            <div
              key={decision.id}
              className="mt-2 border-y border-[var(--color-line)] py-2 text-sm"
            >
              <p className="font-bold">{decision.name}</p>
              <p className="text-[var(--color-ink)]/60">
                Review after{" "}
                {decision.reviewAt
                  ? new Date(decision.reviewAt).toLocaleString()
                  : "the cooling window"}
              </p>
              {process.env.NODE_ENV !== "production" ? (
                <button
                  type="button"
                  onClick={() =>
                    void dispatch({
                      type: "SKIP_COOLING_WAIT",
                      commandId: crypto.randomUUID(),
                      decisionId: decision.id,
                    })
                  }
                  className="mt-1 min-h-11 rounded-full border border-dashed border-[var(--color-ink)]/40 px-3 text-xs font-bold text-[var(--color-ink)]/70"
                >
                  Skip wait (local testing only)
                </button>
              ) : null}
            </div>
          ))
        ) : (
          <p className="mt-2 text-sm text-[var(--color-ink)]/60">
            Nothing cooling.
          </p>
        )}
      </section>
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink)]/60">
          History ({history.length})
        </h3>
        {history.length ? (
          history.map((decision) => (
            <div
              key={decision.id}
              className="mt-2 flex justify-between border-b border-[var(--color-line)] py-2 text-sm"
            >
              <span>{decision.name}</span>
              <span className="capitalize">
                {decision.status.replace("_", " ")}
              </span>
            </div>
          ))
        ) : (
          <p className="mt-2 text-sm text-[var(--color-ink)]/60">
            Reviewed decisions will appear here.
          </p>
        )}
      </section>
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--color-leaf)]">
          Missions (
          {
            missions.filter(
              (mission) => !["completed", "cancelled"].includes(mission.status),
            ).length
          }
          /2)
        </h3>
        {missions.length ? (
          missions.map((mission) => {
            const readiness = getMissionReadiness(mission, new Date());
            const open = !["completed", "cancelled"].includes(mission.status);
            return (
              <div
                key={mission.id}
                className="mt-2 border-b border-[var(--color-line)] py-2 text-sm"
              >
                <p className="font-bold">
                  {mission.type.replaceAll("_", " ").toLowerCase()}
                </p>
                <p className="text-[var(--color-ink)]/60">
                  {mission.status}
                  {mission.checkInAt
                    ? ` · check in ${new Date(mission.checkInAt).toLocaleString()}`
                    : ""}
                </p>
                {open ? (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      disabled={readiness !== "ready_for_checkin"}
                      onClick={() =>
                        void dispatch({
                          type: "COMPLETE_MISSION",
                          commandId: crypto.randomUUID(),
                          missionId: mission.id,
                        })
                      }
                      className="min-h-11 rounded-full border border-[var(--color-leaf)] px-3 text-xs font-bold disabled:opacity-40"
                    >
                      Complete check-in
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void dispatch({
                          type: "CANCEL_MISSION",
                          commandId: crypto.randomUUID(),
                          missionId: mission.id,
                        })
                      }
                      className="min-h-11 rounded-full border border-[var(--color-line)] px-3 text-xs font-bold"
                    >
                      Cancel neutrally
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <p className="mt-2 text-sm text-[var(--color-ink)]/60">
            No active missions.
          </p>
        )}
      </section>
    </aside>
  );
}
