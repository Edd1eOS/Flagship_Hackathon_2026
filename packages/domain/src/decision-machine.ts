import type { Clock } from "./clock";
import { toIsoTimestamp } from "./clock";
import type {
  DecisionStatus,
  PurchaseDecision,
} from "./schemas/purchase-decision";

export const COOLING_HOURS = 24;

export type DecisionTransitionEvent =
  | { type: "ASSESS"; overlapItemIds: string[] }
  | { type: "START_COOLING"; reviewAt: string }
  | { type: "MARK_READY" }
  | { type: "BUY"; reason?: string }
  | { type: "SKIP"; reason?: string }
  | { type: "RECLASSIFY_NEED"; reason?: string }
  | { type: "EXTEND"; reviewAt: string }
  | { type: "RESUME_COOLING" };

export type DecisionTransitionResult =
  { ok: true; decision: PurchaseDecision } | { ok: false; reason: string };

const LEGAL_TRANSITIONS: Record<
  DecisionTransitionEvent["type"],
  ReadonlyArray<DecisionStatus>
> = {
  ASSESS: ["draft"],
  START_COOLING: ["assessed"],
  MARK_READY: ["cooling"],
  BUY: ["assessed", "cooling", "ready"],
  SKIP: ["ready"],
  RECLASSIFY_NEED: ["assessed", "cooling"],
  EXTEND: ["ready"],
  RESUME_COOLING: ["extended"],
};

export function computeReviewAt(now: Date): string {
  return toIsoTimestamp(new Date(now.getTime() + COOLING_HOURS * 3_600_000));
}

export function getDecisionReadiness(
  reviewAt: string,
  now: Date,
): "cooling" | "ready" {
  return now.getTime() >= Date.parse(reviewAt) ? "ready" : "cooling";
}

function illegal(
  event: DecisionTransitionEvent,
  decision: PurchaseDecision,
): DecisionTransitionResult {
  return {
    ok: false,
    reason: `Transition "${event.type}" is not legal from status "${decision.status}"`,
  };
}

export function transitionDecision(
  decision: PurchaseDecision,
  event: DecisionTransitionEvent,
  clock: Clock,
): DecisionTransitionResult {
  if (!LEGAL_TRANSITIONS[event.type].includes(decision.status)) {
    return illegal(event, decision);
  }

  const now = clock.now();

  switch (event.type) {
    case "ASSESS":
      return {
        ok: true,
        decision: {
          ...decision,
          status: "assessed",
          overlapItemIds: event.overlapItemIds,
        },
      };
    case "START_COOLING":
      return {
        ok: true,
        decision: { ...decision, status: "cooling", reviewAt: event.reviewAt },
      };
    case "MARK_READY": {
      if (!decision.reviewAt) {
        return { ok: false, reason: "Cooling decision is missing reviewAt" };
      }
      if (getDecisionReadiness(decision.reviewAt, now) !== "ready") {
        return {
          ok: false,
          reason: "Cooling period has not finished; the decision must wait",
        };
      }
      return { ok: true, decision: { ...decision, status: "ready" } };
    }
    case "BUY":
      return {
        ok: true,
        decision: {
          ...decision,
          status: "bought",
          outcomeReason: event.reason ?? decision.outcomeReason,
          resolvedAt: toIsoTimestamp(now),
        },
      };
    case "SKIP":
      return {
        ok: true,
        decision: {
          ...decision,
          status: "skipped",
          outcomeReason: event.reason ?? decision.outcomeReason,
          resolvedAt: toIsoTimestamp(now),
        },
      };
    case "RECLASSIFY_NEED":
      return {
        ok: true,
        decision: {
          ...decision,
          status: "reclassified_need",
          outcomeReason: event.reason ?? decision.outcomeReason,
          resolvedAt: toIsoTimestamp(now),
        },
      };
    case "EXTEND":
      return {
        ok: true,
        decision: { ...decision, status: "extended", reviewAt: event.reviewAt },
      };
    case "RESUME_COOLING":
      return { ok: true, decision: { ...decision, status: "cooling" } };
  }
}

export function markReady(
  decision: PurchaseDecision,
  clock: Clock,
): DecisionTransitionResult {
  return transitionDecision(decision, { type: "MARK_READY" }, clock);
}
