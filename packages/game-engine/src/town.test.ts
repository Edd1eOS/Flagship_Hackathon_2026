import {
  DeterministicIdGenerator,
  FixedClock,
  createCommandDependencies,
  createSeedState,
  executeCommand,
  type AppState,
  type CommandDependencies,
} from "@lemonade/domain";
import { describe, expect, it } from "vitest";

import {
  cancelAssignment,
  confirmTownPlan,
  previewAssignment,
} from "./assignments";
import { getEligibleProjects } from "./eligibility";
import { assertWorldInvariants } from "./invariants";
import { getProgression } from "./progression";
import { projectBusinessEvent } from "./projector";
import { selectTownViewModel } from "./selectors";
import { simulateCycle } from "./simulate-cycle";
import { createTownEngine } from "./town-engine";

const NOW = "2026-07-11T09:00:00.000Z";

function buildDeps() {
  const ids = new DeterministicIdGenerator();
  return createCommandDependencies(
    new FixedClock(NOW),
    ids,
    () => createSeedState(new FixedClock(NOW), ids),
    createTownEngine(),
  );
}

function mustOk(
  state: AppState,
  command: Parameters<typeof executeCommand>[1],
  deps: CommandDependencies,
): AppState {
  const result = executeCommand(state, command, deps);
  if (!result.ok) throw new Error(`expected ok: ${result.error.message}`);
  return result.state;
}

function reuseCommittedEvent(id: string) {
  return {
    id,
    type: "REUSE_COMMITTED" as const,
    occurredAt: NOW,
    schemaVersion: 1,
    reuseCommitmentId: "reuse_x",
    decisionId: "dec_x",
    ownedItemId: "item_x",
  };
}

describe("projectBusinessEvent", () => {
  it("unlocks the Workshop from a reuse commitment exactly once", () => {
    const deps = buildDeps();
    const seed = deps.createSeed();

    const first = projectBusinessEvent(seed, reuseCommittedEvent("evt_p1"));
    const workshop = first.state.town.locations.find(
      (l) => l.id === "workshop",
    )!;
    expect(workshop.state).toBe("available");
    expect(first.effects).toEqual([
      { type: "PROJECT_AVAILABLE", locationId: "workshop" },
    ]);
    expect(first.state.processedEventIds).toContain("evt_p1");

    // Same event ID again: no change, no duplicate effect.
    const replay = projectBusinessEvent(
      first.state,
      reuseCommittedEvent("evt_p1"),
    );
    expect(replay.state).toBe(first.state);
    expect(replay.effects).toEqual([]);
  });

  it("maps reviews to Picnic and allocations to Station", () => {
    const deps = buildDeps();
    const seed = deps.createSeed();

    const afterReview = projectBusinessEvent(seed, {
      id: "evt_p2",
      type: "DECISION_REVIEWED",
      occurredAt: NOW,
      schemaVersion: 1,
      decisionId: "dec_x",
      outcome: "skipped",
    });
    expect(
      afterReview.state.town.locations.find((l) => l.id === "picnic_green")!
        .state,
    ).toBe("available");

    const afterAllocation = projectBusinessEvent(afterReview.state, {
      id: "evt_p3",
      type: "ALLOCATION_PLANNED",
      occurredAt: NOW,
      schemaVersion: 1,
      allocationId: "alloc_x",
      decisionId: "dec_x",
      goalId: "goal_x",
      amount: 20,
    });
    expect(
      afterAllocation.state.town.locations.find(
        (l) => l.id === "little_station",
      )!.state,
    ).toBe("available");
  });
});

describe("assignments", () => {
  function withAvailableWorkshopAndPicnic(deps: CommandDependencies): AppState {
    const seed = deps.createSeed();
    const a = projectBusinessEvent(seed, reuseCommittedEvent("evt_a1"));
    const b = projectBusinessEvent(a.state, {
      id: "evt_a2",
      type: "DECISION_REVIEWED",
      occurredAt: NOW,
      schemaVersion: 1,
      decisionId: "dec_x",
      outcome: "skipped",
    });
    return b.state;
  }

  it("rejects previewing the Scout and locked locations", () => {
    const deps = buildDeps();
    const state = withAvailableWorkshopAndPicnic(deps);
    const scout = state.town.residents.find((r) => r.role === "scout")!;
    const mender = state.town.residents.find((r) => r.role === "mender")!;

    const scoutPreview = previewAssignment(state, scout.id, "workshop");
    expect(scoutPreview.ok).toBe(false);

    const lockedPreview = previewAssignment(state, mender.id, "quiet_garden");
    expect(lockedPreview.ok).toBe(false);
  });

  it("rejects double assignment and supports cancel before confirmation", () => {
    const deps = buildDeps();
    const state = withAvailableWorkshopAndPicnic(deps);
    const mender = state.town.residents.find((r) => r.role === "mender")!;
    const host = state.town.residents.find((r) => r.role === "host")!;

    const menderPreview = previewAssignment(state, mender.id, "workshop");
    if (!menderPreview.ok) throw new Error(menderPreview.reason);
    assertWorldInvariants(menderPreview.state);

    const hostSameSpot = previewAssignment(
      menderPreview.state,
      host.id,
      "workshop",
    );
    expect(hostSameSpot.ok).toBe(false);

    const cancelled = cancelAssignment(menderPreview.state, mender.id);
    if (!cancelled.ok) throw new Error(cancelled.reason);
    expect(
      cancelled.state.town.locations.find((l) => l.id === "workshop")!.state,
    ).toBe("available");
    expect(
      cancelled.state.town.residents.find((r) => r.id === mender.id)!.projectId,
    ).toBeNull();
  });

  it("confirms atomically: an invalid plan changes nothing", () => {
    const deps = buildDeps();
    const state = withAvailableWorkshopAndPicnic(deps);
    const mender = state.town.residents.find((r) => r.role === "mender")!;

    const bad = confirmTownPlan(state, [
      { residentId: mender.id, locationId: "workshop" },
      { residentId: mender.id, locationId: "picnic_green" },
    ]);
    expect(bad.ok).toBe(false);

    const locked = confirmTownPlan(state, [
      { residentId: mender.id, locationId: "quiet_garden" },
    ]);
    expect(locked.ok).toBe(false);
  });

  it("activates exactly the confirmed project set with ordered effects", () => {
    const deps = buildDeps();
    const state = withAvailableWorkshopAndPicnic(deps);
    const mender = state.town.residents.find((r) => r.role === "mender")!;
    const host = state.town.residents.find((r) => r.role === "host")!;

    const confirmed = confirmTownPlan(state, [
      { residentId: mender.id, locationId: "workshop" },
      { residentId: host.id, locationId: "picnic_green" },
    ]);
    if (!confirmed.ok) throw new Error(confirmed.reason);
    assertWorldInvariants(confirmed.state);

    const active = confirmed.state.town.locations
      .filter((l) => l.state === "active")
      .map((l) => l.id)
      .sort();
    expect(active).toEqual(["picnic_green", "workshop"]);

    expect(confirmed.effects).toEqual([
      {
        type: "RESIDENT_TRAVELLED",
        residentId: mender.id,
        locationId: "workshop",
      },
      { type: "LOCATION_ACTIVATED", locationId: "workshop" },
      {
        type: "RESIDENT_TRAVELLED",
        residentId: host.id,
        locationId: "picnic_green",
      },
      { type: "LOCATION_ACTIVATED", locationId: "picnic_green" },
    ]);

    const scout = confirmed.state.town.residents.find(
      (r) => r.role === "scout",
    )!;
    expect(scout.projectId).toBeNull();
    expect(scout.assignable).toBe(false);

    const cycled = simulateCycle(confirmed.state);
    const workshopAfter = cycled.state.town.locations.find(
      (l) => l.id === "workshop",
    )!;
    expect(workshopAfter.state).toBe("lived_in");
    expect(cycled.effects.map((e) => e.type)).toEqual([
      "LOCATION_LIVED_IN",
      "LOCATION_LIVED_IN",
    ]);

    // Deterministic: same input, same output.
    expect(simulateCycle(confirmed.state)).toEqual(cycled);
  });
});

describe("full demo path through the command pipeline", () => {
  it("review + reuse commitment unlock projects, plan confirms, Workshop lives in", () => {
    const deps = buildDeps();
    let state = deps.createSeed();
    const ready = state.decisions[0]!;
    const boots = state.ownedItems.find((i) => i.condition === "repairable")!;

    state = mustOk(
      state,
      {
        type: "RESOLVE_DECISION",
        commandId: "cmd_demo_resolve",
        decisionId: ready.id,
        outcome: "repaired",
        reason: "Re-glued boots cover daily walking",
      },
      deps,
    );
    state = mustOk(
      state,
      {
        type: "COMMIT_REUSE",
        commandId: "cmd_demo_reuse",
        decisionId: ready.id,
        ownedItemId: boots.id,
        action: "repair",
      },
      deps,
    );

    const eligible = getEligibleProjects(state).map((p) => p.locationId);
    expect(eligible).toContain("workshop");
    expect(eligible).toContain("picnic_green");

    const mender = state.town.residents.find((r) => r.role === "mender")!;
    const host = state.town.residents.find((r) => r.role === "host")!;

    state = mustOk(
      state,
      {
        type: "PREVIEW_ASSIGNMENT",
        commandId: "cmd_demo_preview",
        residentId: mender.id,
        locationId: "workshop",
      },
      deps,
    );
    state = mustOk(
      state,
      {
        type: "CONFIRM_TOWN_PLAN",
        commandId: "cmd_demo_confirm",
        assignments: [
          { residentId: mender.id, locationId: "workshop" },
          { residentId: host.id, locationId: "picnic_green" },
        ],
      },
      deps,
    );

    assertWorldInvariants(state);
    expect(state.town.locations.find((l) => l.id === "workshop")!.state).toBe(
      "active",
    );
    expect(state.events.at(-1)!.type).toBe("TOWN_PLAN_CONFIRMED");

    const view = selectTownViewModel(state);
    expect(view.progression).toEqual(getProgression(state));
    expect(view.progression.totalXp).toBe(10);
    expect(view.scoutMode).toBe("patrol");

    // Replaying the confirm command is a no-op duplicate.
    const replay = executeCommand(
      state,
      {
        type: "CONFIRM_TOWN_PLAN",
        commandId: "cmd_demo_confirm",
        assignments: [
          { residentId: mender.id, locationId: "workshop" },
          { residentId: host.id, locationId: "picnic_green" },
        ],
      },
      deps,
    );
    if (!replay.ok) throw new Error(replay.error.message);
    expect(replay.duplicateCommand).toBe(true);
    expect(replay.state).toBe(state);
  });
});
