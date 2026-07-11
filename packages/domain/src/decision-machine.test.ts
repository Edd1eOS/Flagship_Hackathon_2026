import { describe, expect, it } from "vitest";

import { FixedClock } from "./clock";
import {
  COOLING_HOURS,
  computeReviewAt,
  getDecisionReadiness,
  markReady,
  transitionDecision,
  type DecisionTransitionEvent,
} from "./decision-machine";
import type {
  DecisionStatus,
  PurchaseDecision,
} from "./schemas/purchase-decision";

const NOW = "2026-07-11T09:00:00.000Z";
const REVIEW_AT = "2026-07-12T09:00:00.000Z";

function buildDecision(
  status: DecisionStatus,
  overrides: Partial<PurchaseDecision> = {},
): PurchaseDecision {
  return {
    id: "dec_0001",
    name: "Retro court sneakers",
    price: 129.99,
    currency: "AUD",
    category: "footwear",
    job: "daily walking",
    motive: "trend",
    status,
    origin: "manual",
    createdAt: NOW,
    reviewAt: ["cooling", "ready", "extended"].includes(status)
      ? REVIEW_AT
      : undefined,
    overlapItemIds: [],
    ...overrides,
  };
}

const clock = new FixedClock(NOW);

const ALL_STATUSES: DecisionStatus[] = [
  "draft",
  "assessed",
  "cooling",
  "ready",
  "bought",
  "skipped",
  "extended",
  "reclassified_need",
];

const EVENTS: Array<{
  event: DecisionTransitionEvent;
  legalFrom: DecisionStatus[];
}> = [
  { event: { type: "ASSESS", overlapItemIds: [] }, legalFrom: ["draft"] },
  {
    event: { type: "START_COOLING", reviewAt: REVIEW_AT },
    legalFrom: ["assessed"],
  },
  { event: { type: "BUY" }, legalFrom: ["assessed", "cooling", "ready"] },
  { event: { type: "SKIP" }, legalFrom: ["ready"] },
  {
    event: { type: "RECLASSIFY_NEED" },
    legalFrom: ["assessed", "cooling"],
  },
  { event: { type: "EXTEND", reviewAt: REVIEW_AT }, legalFrom: ["ready"] },
  { event: { type: "RESUME_COOLING" }, legalFrom: ["extended"] },
];

describe("transitionDecision transition table", () => {
  for (const { event, legalFrom } of EVENTS) {
    for (const status of ALL_STATUSES) {
      const expected = legalFrom.includes(status);
      it(`${event.type} from ${status} is ${expected ? "legal" : "illegal"}`, () => {
        const result = transitionDecision(buildDecision(status), event, clock);
        expect(result.ok).toBe(expected);
      });
    }
  }

  it("terminal statuses reject every event", () => {
    for (const status of ["bought", "skipped", "reclassified_need"] as const) {
      for (const { event } of EVENTS) {
        expect(transitionDecision(buildDecision(status), event, clock).ok).toBe(
          false,
        );
      }
    }
  });
});

describe("24-hour readiness boundary", () => {
  it("computeReviewAt adds exactly 24 hours", () => {
    expect(computeReviewAt(new Date(NOW))).toBe(REVIEW_AT);
  });

  it("is cooling one millisecond before reviewAt and ready exactly at it", () => {
    const justBefore = new Date(Date.parse(REVIEW_AT) - 1);
    const exactly = new Date(Date.parse(REVIEW_AT));
    expect(getDecisionReadiness(REVIEW_AT, justBefore)).toBe("cooling");
    expect(getDecisionReadiness(REVIEW_AT, exactly)).toBe("ready");
  });

  it("markReady is rejected before the boundary and accepted at it", () => {
    const cooling = buildDecision("cooling");
    const early = new FixedClock(new Date(Date.parse(REVIEW_AT) - 1));
    const onTime = new FixedClock(REVIEW_AT);

    expect(markReady(cooling, early).ok).toBe(false);
    const result = markReady(cooling, onTime);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.decision.status).toBe("ready");
  });
});

describe("resolution audit fields", () => {
  it("BUY records resolvedAt and preserves the original motive", () => {
    const result = transitionDecision(
      buildDecision("ready"),
      { type: "BUY", reason: "Needed for the trip after all" },
      clock,
    );
    if (!result.ok) throw new Error("expected ok");
    expect(result.decision.resolvedAt).toBe(NOW);
    expect(result.decision.motive).toBe("trend");
    expect(result.decision.outcomeReason).toBe("Needed for the trip after all");
  });
});
