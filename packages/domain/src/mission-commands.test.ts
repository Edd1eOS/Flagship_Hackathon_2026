import { describe, expect, it } from "vitest";

import { FixedClock } from "./clock";
import { DeterministicIdGenerator } from "./ids";
import {
  MISSION_CHECK_IN_HOURS,
  getMissionReadiness,
  transitionMission,
} from "./mission-machine";
import { createCommandDependencies } from "./repository";
import type { AppState } from "./schemas/app-state";
import { calculateReflectionXp } from "./schemas/reflection";
import { createSeedState } from "./seed";
import { executeCommand, type CommandDependencies } from "./transaction";

const NOW = "2026-07-11T09:00:00.000Z";

function buildDeps(clock = new FixedClock(NOW)) {
  const ids = new DeterministicIdGenerator();
  return createCommandDependencies(clock, ids, () =>
    createSeedState(new FixedClock(NOW), ids),
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

function offerRepairMission(
  state: AppState,
  deps: CommandDependencies,
  commandId = "cmd_offer_1",
): AppState {
  const ready = state.decisions[0]!;
  const boots = state.ownedItems.find((i) => i.condition === "repairable")!;
  return mustOk(
    state,
    {
      type: "OFFER_MISSION",
      commandId,
      decisionId: ready.id,
      ownedItemId: boots.id,
      missionType: "REPAIR",
    },
    deps,
  );
}

describe("mission machine", () => {
  it("rejects completing a mission that was never accepted", () => {
    const result = transitionMission(
      {
        id: "mis_x",
        decisionId: "dec_x",
        type: "REPAIR",
        status: "offered",
      },
      { type: "COMPLETE", completedAt: NOW },
    );
    expect(result.ok).toBe(false);
  });

  it("derives check-in readiness from the injected time", () => {
    const mission = {
      id: "mis_x",
      decisionId: "dec_x",
      type: "TRY_EXISTING" as const,
      status: "active" as const,
      acceptedAt: NOW,
      checkInAt: "2026-07-12T09:00:00.000Z",
    };
    expect(getMissionReadiness(mission, new Date(NOW))).toBe("waiting");
    expect(
      getMissionReadiness(mission, new Date("2026-07-12T09:00:00.000Z")),
    ).toBe("ready_for_checkin");
  });
});

describe("OFFER_MISSION constraints", () => {
  it("offers a repair mission linked to the repairable boots", () => {
    const deps = buildDeps();
    const state = offerRepairMission(deps.createSeed(), deps);
    expect(state.missions).toHaveLength(1);
    expect(state.missions[0]!.status).toBe("offered");
    expect(state.events.at(-1)!.type).toBe("MISSION_OFFERED");
  });

  it("enforces one open mission per decision", () => {
    const deps = buildDeps();
    const state = offerRepairMission(deps.createSeed(), deps);
    const again = executeCommand(
      state,
      {
        type: "OFFER_MISSION",
        commandId: "cmd_offer_2",
        decisionId: state.decisions[0]!.id,
        missionType: "TRY_EXISTING",
      },
      deps,
    );
    expect(again.ok).toBe(false);
  });

  it("prevents conflicting missions on the same owned item and enforces two slots", () => {
    const deps = buildDeps();
    let state = deps.createSeed();
    const boots = state.ownedItems.find((i) => i.condition === "repairable")!;

    // Second decision so the per-decision rule is not what rejects us.
    state = mustOk(
      state,
      {
        type: "CAPTURE_DECISION",
        commandId: "cmd_cap_m1",
        draft: {
          name: "Waterproof walking shoes",
          price: 99.95,
          currency: "AUD",
          category: "footwear",
          job: "daily walking",
          motive: "sale",
          origin: "manual",
        },
      },
      deps,
    );
    state = mustOk(
      state,
      {
        type: "START_COOLING",
        commandId: "cmd_cool_m1",
        decisionId: state.decisions.at(-1)!.id,
      },
      deps,
    );

    state = offerRepairMission(state, deps);

    const conflict = executeCommand(
      state,
      {
        type: "OFFER_MISSION",
        commandId: "cmd_offer_3",
        decisionId: state.decisions.at(-1)!.id,
        ownedItemId: boots.id,
        missionType: "TRY_EXISTING",
      },
      deps,
    );
    expect(conflict.ok).toBe(false);
    if (!conflict.ok) {
      expect(conflict.error.message).toContain("already used");
    }

    // A non-conflicting second mission fills the last slot.
    state = mustOk(
      state,
      {
        type: "OFFER_MISSION",
        commandId: "cmd_offer_4",
        decisionId: state.decisions.at(-1)!.id,
        ownedItemId: state.ownedItems[1]!.id,
        missionType: "TRY_EXISTING",
      },
      deps,
    );

    // Third open mission exceeds the two slots.
    state = mustOk(
      state,
      {
        type: "CAPTURE_DECISION",
        commandId: "cmd_cap_m2",
        draft: {
          name: "City loafers",
          price: 89.95,
          currency: "AUD",
          category: "footwear",
          job: "daily walking",
          motive: "mood",
          origin: "manual",
        },
      },
      deps,
    );
    state = mustOk(
      state,
      {
        type: "START_COOLING",
        commandId: "cmd_cool_m2",
        decisionId: state.decisions.at(-1)!.id,
      },
      deps,
    );
    const third = executeCommand(
      state,
      {
        type: "OFFER_MISSION",
        commandId: "cmd_offer_5",
        decisionId: state.decisions.at(-1)!.id,
        missionType: "WAIT_AND_REFLECT",
      },
      deps,
    );
    expect(third.ok).toBe(false);
    if (!third.ok) expect(third.error.message).toContain("slots");
  });
});

describe("ACCEPT_MISSION and COMPLETE_MISSION", () => {
  it("accepting starts the mission with a 24-hour check-in window", () => {
    const deps = buildDeps();
    let state = offerRepairMission(deps.createSeed(), deps);
    state = mustOk(
      state,
      {
        type: "ACCEPT_MISSION",
        commandId: "cmd_accept_1",
        missionId: state.missions[0]!.id,
      },
      deps,
    );

    const mission = state.missions[0]!;
    expect(mission.status).toBe("active");
    expect(mission.acceptedAt).toBe(NOW);
    expect(mission.checkInAt).toBe(
      new Date(
        Date.parse(NOW) + MISSION_CHECK_IN_HOURS * 3_600_000,
      ).toISOString(),
    );
  });

  it("rejects completion before the check-in time and allows it after", () => {
    const clock = new FixedClock(NOW);
    const deps = buildDeps(clock);
    let state = offerRepairMission(deps.createSeed(), deps);
    state = mustOk(
      state,
      {
        type: "ACCEPT_MISSION",
        commandId: "cmd_accept_2",
        missionId: state.missions[0]!.id,
      },
      deps,
    );

    const early = executeCommand(
      state,
      {
        type: "COMPLETE_MISSION",
        commandId: "cmd_complete_1",
        missionId: state.missions[0]!.id,
      },
      deps,
    );
    expect(early.ok).toBe(false);

    clock.advanceByMinutes(MISSION_CHECK_IN_HOURS * 60);
    state = mustOk(
      state,
      {
        type: "COMPLETE_MISSION",
        commandId: "cmd_complete_2",
        missionId: state.missions[0]!.id,
      },
      deps,
    );
    expect(state.missions[0]!.status).toBe("completed");
    expect(state.missions[0]!.completedAt).toBeDefined();
    expect(state.events.at(-1)!.type).toBe("MISSION_COMPLETED");
  });

  it("cancellation is neutral and frees the slot", () => {
    const deps = buildDeps();
    let state = offerRepairMission(deps.createSeed(), deps);
    const before = state;
    state = mustOk(
      state,
      {
        type: "CANCEL_MISSION",
        commandId: "cmd_cancel_1",
        missionId: state.missions[0]!.id,
      },
      deps,
    );

    expect(state.missions[0]!.status).toBe("cancelled");
    expect(state.reflections).toEqual(before.reflections);
    expect(state.goals).toEqual(before.goals);
    expect(state.plannedAllocations).toEqual(before.plannedAllocations);

    // Slot is free again for the same decision.
    state = mustOk(state, offerCommandFor(state, "cmd_offer_6"), deps);
    expect(state.missions.filter((m) => m.status === "offered")).toHaveLength(
      1,
    );
  });
});

function offerCommandFor(state: AppState, commandId: string) {
  return {
    type: "OFFER_MISSION",
    commandId,
    decisionId: state.decisions[0]!.id,
    missionType: "TRY_EXISTING",
  } as const;
}

describe("PLAN_ALLOCATION invariants", () => {
  function skippedState(deps: CommandDependencies): AppState {
    let state = deps.createSeed();
    state = mustOk(
      state,
      {
        type: "RESOLVE_DECISION",
        commandId: "cmd_resolve_alloc",
        decisionId: state.decisions[0]!.id,
        outcome: "skipped",
      },
      deps,
    );
    return state;
  }

  it("rejects allocations for decisions that are not skipped", () => {
    const deps = buildDeps();
    const state = deps.createSeed();
    const result = executeCommand(
      state,
      {
        type: "PLAN_ALLOCATION",
        commandId: "cmd_alloc_1",
        decisionId: state.decisions[0]!.id,
        goalId: state.goals[0]!.id,
        amount: 50,
      },
      deps,
    );
    expect(result.ok).toBe(false);
  });

  it("plans a positive whole-cent amount and updates the goal's planned total", () => {
    const deps = buildDeps();
    let state = skippedState(deps);
    state = mustOk(
      state,
      {
        type: "PLAN_ALLOCATION",
        commandId: "cmd_alloc_2",
        decisionId: state.decisions[0]!.id,
        goalId: state.goals[0]!.id,
        amount: 60,
      },
      deps,
    );

    expect(state.plannedAllocations).toHaveLength(1);
    expect(state.plannedAllocations[0]!.kind).toBe("planned");
    expect(state.goals[0]!.plannedAllocationTotal).toBe(60);
    expect(state.goals[0]!.startingAmount).toBe(350);
    expect(state.events.at(-1)!.type).toBe("ALLOCATION_PLANNED");
  });

  it("rejects zero, sub-cent, and price-exceeding totals", () => {
    const deps = buildDeps();
    const state = skippedState(deps);
    const decisionId = state.decisions[0]!.id;
    const goalId = state.goals[0]!.id;

    for (const amount of [0, -5, 10.999]) {
      const result = executeCommand(
        state,
        {
          type: "PLAN_ALLOCATION",
          commandId: `cmd_alloc_bad_${amount}`,
          decisionId,
          goalId,
          amount,
        },
        deps,
      );
      expect(result.ok).toBe(false);
    }

    // 129.99 price: 100 + 40 exceeds it.
    const first = mustOk(
      state,
      {
        type: "PLAN_ALLOCATION",
        commandId: "cmd_alloc_3",
        decisionId,
        goalId,
        amount: 100,
      },
      deps,
    );
    const over = executeCommand(
      first,
      {
        type: "PLAN_ALLOCATION",
        commandId: "cmd_alloc_4",
        decisionId,
        goalId,
        amount: 40,
      },
      deps,
    );
    expect(over.ok).toBe(false);
    if (!over.ok) expect(over.error.message).toContain("exceed");
  });
});

describe("calculateReflectionXp", () => {
  it("is fixed and independent of any input", () => {
    expect(calculateReflectionXp()).toBe(10);
  });
});
