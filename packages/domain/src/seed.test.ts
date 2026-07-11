import { describe, expect, it } from "vitest";

import { FixedClock } from "./clock";
import { DeterministicIdGenerator } from "./ids";
import { createSeedState, parseSeedData } from "./seed";

const NOW = "2026-07-11T09:00:00.000Z";

function buildSeed() {
  return createSeedState(new FixedClock(NOW), new DeterministicIdGenerator());
}

describe("createSeedState", () => {
  it("is deterministic with a fixed clock and deterministic IDs", () => {
    expect(buildSeed()).toEqual(buildSeed());
  });

  it("survives a JSON round trip without loss", () => {
    const seed = buildSeed();
    const revived = parseSeedData(JSON.parse(JSON.stringify(seed)));
    expect(revived).toEqual(seed);
  });

  it("contains 8-12 owned items with three same-job shoe candidates", () => {
    const seed = buildSeed();
    expect(seed.ownedItems.length).toBeGreaterThanOrEqual(8);
    expect(seed.ownedItems.length).toBeLessThanOrEqual(12);

    const readyDecision = seed.decisions[0]!;
    const sameJobItems = seed.ownedItems.filter((item) =>
      item.useTags.includes(readyDecision.job),
    );
    expect(sameJobItems).toHaveLength(3);
    expect(readyDecision.overlapItemIds).toEqual(
      sameJobItems.map((item) => item.id),
    );
  });

  it("seeds exactly one clearly marked Ready demo decision", () => {
    const seed = buildSeed();
    expect(seed.decisions).toHaveLength(1);
    const decision = seed.decisions[0]!;
    expect(decision.status).toBe("ready");
    expect(decision.origin).toBe("seeded_demo");
    expect(Date.parse(decision.reviewAt!)).toBeLessThan(Date.parse(NOW));
    expect(Date.parse(decision.createdAt)).toBeLessThan(
      Date.parse(decision.reviewAt!),
    );
  });

  it("keeps planned progress and reflections empty at seed time", () => {
    const seed = buildSeed();
    expect(seed.plannedAllocations).toEqual([]);
    expect(seed.reflections).toEqual([]);
    expect(seed.goals[0]!.plannedAllocationTotal).toBe(0);
  });

  it("keeps the Scout unassignable and the Workshop locked", () => {
    const seed = buildSeed();
    const scout = seed.town.residents.find((r) => r.role === "scout")!;
    expect(scout.assignable).toBe(false);

    const workshop = seed.town.locations.find((l) => l.id === "workshop")!;
    expect(workshop.state).toBe("locked");

    const assignables = seed.town.residents.filter((r) => r.assignable);
    expect(assignables.map((r) => r.role).sort()).toEqual(["host", "mender"]);
  });

  it("provides one AUD capture template for the controlled storefront", () => {
    const seed = buildSeed();
    expect(seed.captureTemplates).toHaveLength(1);
    expect(seed.captureTemplates[0]!.currency).toBe("AUD");
    expect(seed.captureTemplates[0]!.job).toBe("daily walking");
  });
});
