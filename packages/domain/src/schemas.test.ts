import { describe, expect, it } from "vitest";

import { FixedClock } from "./clock";
import { DeterministicIdGenerator } from "./ids";
import { migrateAppState } from "./schemas/app-state";
import { missionSchema } from "./schemas/mission";
import { plannedAllocationSchema } from "./schemas/planned-allocation";
import { audAmountSchema } from "./schemas/primitives";
import { purchaseDecisionSchema } from "./schemas/purchase-decision";
import { REFLECTION_XP, reflectionSchema } from "./schemas/reflection";
import { residentStateSchema } from "./schemas/town";
import { userProfileSchema } from "./schemas/user-profile";
import { createSeedState } from "./seed";

const NOW = "2026-07-11T09:00:00.000Z";

function buildSeed() {
  return createSeedState(new FixedClock(NOW), new DeterministicIdGenerator());
}

describe("audAmountSchema", () => {
  it("accepts whole-cent amounts", () => {
    expect(audAmountSchema.parse(129.99)).toBe(129.99);
    expect(audAmountSchema.parse(0)).toBe(0);
  });

  it("rejects negative and sub-cent amounts", () => {
    expect(audAmountSchema.safeParse(-1).success).toBe(false);
    expect(audAmountSchema.safeParse(10.999).success).toBe(false);
    expect(audAmountSchema.safeParse(Number.NaN).success).toBe(false);
  });
});

describe("userProfileSchema", () => {
  it("rejects a non-AUD currency", () => {
    const result = userProfileSchema.safeParse({
      id: "user_0001",
      displayName: "Alex",
      currency: "USD",
      monthlyDiscretionaryPlan: 600,
      coachingTone: "gentle",
    });
    expect(result.success).toBe(false);
  });
});

describe("purchaseDecisionSchema", () => {
  const baseDecision = {
    id: "dec_0001",
    name: "Retro court sneakers",
    price: 129.99,
    currency: "AUD",
    category: "footwear",
    job: "daily walking",
    motive: "trend",
    origin: "manual",
    createdAt: NOW,
    overlapItemIds: [],
  } as const;

  it("parses a cooling decision with reviewAt", () => {
    const result = purchaseDecisionSchema.safeParse({
      ...baseDecision,
      status: "cooling",
      reviewAt: "2026-07-12T09:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects cooling, ready, and extended without reviewAt", () => {
    for (const status of ["cooling", "ready", "extended"]) {
      const result = purchaseDecisionSchema.safeParse({
        ...baseDecision,
        status,
      });
      expect(result.success).toBe(false);
    }
  });

  it("rejects an unknown status", () => {
    const result = purchaseDecisionSchema.safeParse({
      ...baseDecision,
      status: "wishlisted",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-ISO timestamp", () => {
    const result = purchaseDecisionSchema.safeParse({
      ...baseDecision,
      status: "draft",
      createdAt: "yesterday",
    });
    expect(result.success).toBe(false);
  });
});

describe("missionSchema", () => {
  it("rejects completed missions without completedAt", () => {
    const result = missionSchema.safeParse({
      id: "mis_0001",
      decisionId: "dec_0001",
      type: "REPAIR",
      status: "completed",
      acceptedAt: NOW,
    });
    expect(result.success).toBe(false);
  });
});

describe("plannedAllocationSchema", () => {
  const baseAllocation = {
    id: "alloc_0001",
    decisionId: "dec_0001",
    goalId: "goal_0001",
    amount: 50,
    createdAt: NOW,
  };

  it("requires the explicit planned kind", () => {
    expect(
      plannedAllocationSchema.safeParse({ ...baseAllocation, kind: "actual" })
        .success,
    ).toBe(false);
    expect(
      plannedAllocationSchema.safeParse({ ...baseAllocation, kind: "planned" })
        .success,
    ).toBe(true);
  });

  it("rejects a zero amount", () => {
    const result = plannedAllocationSchema.safeParse({
      ...baseAllocation,
      kind: "planned",
      amount: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe("reflectionSchema", () => {
  it("only accepts the fixed price-independent XP", () => {
    const base = {
      id: "ref_0001",
      decisionId: "dec_0001",
      outcome: "repaired",
      createdAt: NOW,
    };
    expect(
      reflectionSchema.safeParse({ ...base, xpAwarded: REFLECTION_XP }).success,
    ).toBe(true);
    expect(reflectionSchema.safeParse({ ...base, xpAwarded: 50 }).success).toBe(
      false,
    );
  });
});

describe("residentStateSchema", () => {
  it("rejects an assignable scout", () => {
    const result = residentStateSchema.safeParse({
      id: "res_0001",
      role: "scout",
      assignable: true,
      locationId: "home_nook",
      projectId: null,
      activityId: null,
    });
    expect(result.success).toBe(false);
  });
});

describe("appStateSchema cross-entity truth rules", () => {
  it("rejects allocations against non-skipped decisions", () => {
    const seed = buildSeed();
    const readyDecision = seed.decisions[0]!;
    expect(() =>
      migrateAppState({
        ...seed,
        plannedAllocations: [
          {
            id: "alloc_0001",
            decisionId: readyDecision.id,
            goalId: seed.goals[0]!.id,
            amount: 20,
            kind: "planned",
            createdAt: NOW,
          },
        ],
      }),
    ).toThrow(/skipped decision/);
  });

  it("rejects allocation totals above the skipped price", () => {
    const seed = buildSeed();
    const skipped = {
      ...seed.decisions[0]!,
      status: "skipped" as const,
      outcomeReason: "Existing shoes still work",
    };
    const overAllocated = {
      ...seed,
      decisions: [skipped],
      plannedAllocations: [
        {
          id: "alloc_0001",
          decisionId: skipped.id,
          goalId: seed.goals[0]!.id,
          amount: 100,
          kind: "planned" as const,
          createdAt: NOW,
        },
        {
          id: "alloc_0002",
          decisionId: skipped.id,
          goalId: seed.goals[0]!.id,
          amount: 40,
          kind: "planned" as const,
          createdAt: NOW,
        },
      ],
    };
    expect(() => migrateAppState(overAllocated)).toThrow();
  });

  it("rejects unsupported schema versions", () => {
    const seed = buildSeed();
    expect(() => migrateAppState({ ...seed, schemaVersion: 99 })).toThrow(
      /Unsupported schema version/,
    );
  });

  it("rejects unknown top-level keys", () => {
    const seed = buildSeed();
    expect(() => migrateAppState({ ...seed, legacyField: true })).toThrow();
  });
});
