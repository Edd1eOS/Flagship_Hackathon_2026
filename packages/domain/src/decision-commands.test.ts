import { describe, expect, it } from "vitest";

import { FixedClock } from "./clock";
import type { CaptureDecisionCommand } from "./commands/command";
import { DeterministicIdGenerator } from "./ids";
import { createCommandDependencies } from "./repository";
import type { AppState } from "./schemas/app-state";
import { createSeedState } from "./seed";
import { executeCommand, type CommandDependencies } from "./transaction";

const NOW = "2026-07-11T09:00:00.000Z";
const EXPECTED_REVIEW_AT = "2026-07-12T09:00:00.000Z";

function buildDeps(clock = new FixedClock(NOW)) {
  // Share one ID generator between seed and commands so IDs never collide,
  // mirroring how createCommandDependencies defaults work in production.
  const ids = new DeterministicIdGenerator();
  return createCommandDependencies(clock, ids, () =>
    createSeedState(new FixedClock(NOW), ids),
  );
}

const capture: CaptureDecisionCommand = {
  type: "CAPTURE_DECISION",
  commandId: "cmd_capture_1",
  draft: {
    name: "Cloudstep runner sneakers",
    price: 149.95,
    currency: "AUD",
    category: "footwear",
    job: "daily walking",
    motive: "trend",
    origin: "manual",
  },
};

function mustOk(
  state: AppState,
  command: Parameters<typeof executeCommand>[1],
  deps: CommandDependencies,
): AppState {
  const result = executeCommand(state, command, deps);
  if (!result.ok) throw new Error(`expected ok: ${result.error.message}`);
  return result.state;
}

describe("CAPTURE_DECISION and START_COOLING", () => {
  it("captures a draft and starts genuine 24-hour cooling", () => {
    const deps = buildDeps();
    let state = deps.createSeed();
    state = mustOk(state, capture, deps);

    const captured = state.decisions.at(-1)!;
    expect(captured.status).toBe("draft");
    expect(captured.origin).toBe("manual");
    expect(captured.overlapItemIds.length).toBeGreaterThan(0);
    expect(state.events.at(-1)!.type).toBe("DECISION_CAPTURED");

    state = mustOk(
      state,
      {
        type: "START_COOLING",
        commandId: "cmd_cool_1",
        decisionId: captured.id,
      },
      deps,
    );
    const cooling = state.decisions.at(-1)!;
    expect(cooling.status).toBe("cooling");
    expect(cooling.reviewAt).toBe(EXPECTED_REVIEW_AT);
    expect(state.events.at(-1)!.type).toBe("COOLING_STARTED");
  });

  it("keeps the new cooling decision distinct from the seeded ready one", () => {
    const deps = buildDeps();
    let state = deps.createSeed();
    state = mustOk(state, capture, deps);
    const captured = state.decisions.at(-1)!;
    state = mustOk(
      state,
      {
        type: "START_COOLING",
        commandId: "cmd_cool_2",
        decisionId: captured.id,
      },
      deps,
    );

    const origins = state.decisions.map((d) => [d.origin, d.status]);
    expect(origins).toContainEqual(["seeded_demo", "ready"]);
    expect(origins).toContainEqual(["manual", "cooling"]);
  });
});

describe("RESOLVE_DECISION truth rules", () => {
  it("skip from ready awards one fixed-XP reflection and changes no goal amount", () => {
    const deps = buildDeps();
    let state = deps.createSeed();
    const ready = state.decisions[0]!;
    const goalsBefore = state.goals;

    state = mustOk(
      state,
      {
        type: "RESOLVE_DECISION",
        commandId: "cmd_resolve_1",
        decisionId: ready.id,
        outcome: "reused_existing",
        reason: "Repaired boots cover daily walking",
      },
      deps,
    );

    expect(state.decisions[0]!.status).toBe("skipped");
    expect(state.reflections).toHaveLength(1);
    expect(state.reflections[0]!.xpAwarded).toBe(10);
    expect(state.goals).toEqual(goalsBefore);
    expect(state.plannedAllocations).toEqual([]);
  });

  it("rejects a second resolution and never duplicates the reflection", () => {
    const deps = buildDeps();
    let state = deps.createSeed();
    const ready = state.decisions[0]!;
    state = mustOk(
      state,
      {
        type: "RESOLVE_DECISION",
        commandId: "cmd_resolve_2",
        decisionId: ready.id,
        outcome: "skipped",
      },
      deps,
    );

    const second = executeCommand(
      state,
      {
        type: "RESOLVE_DECISION",
        commandId: "cmd_resolve_3",
        decisionId: ready.id,
        outcome: "skipped",
      },
      deps,
    );
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.error.code).toBe("RULE_VIOLATION");
    expect(state.reflections).toHaveLength(1);
  });

  it("buy is neutral and can optionally add the item to My Stuff", () => {
    const deps = buildDeps();
    let state = deps.createSeed();
    const ready = state.decisions[0]!;
    const goalsBefore = state.goals;
    const itemsBefore = state.ownedItems.length;

    state = mustOk(
      state,
      {
        type: "RESOLVE_DECISION",
        commandId: "cmd_resolve_4",
        decisionId: ready.id,
        outcome: "bought",
        addToMyStuff: true,
      },
      deps,
    );

    expect(state.decisions[0]!.status).toBe("bought");
    expect(state.goals).toEqual(goalsBefore);
    expect(state.ownedItems).toHaveLength(itemsBefore + 1);
    expect(state.ownedItems.at(-1)!.name).toBe(ready.name);
    // Reflection still awarded: the user completed the honest review.
    expect(state.reflections).toHaveLength(1);
  });

  it("rejects skip while still cooling", () => {
    const deps = buildDeps();
    let state = deps.createSeed();
    state = mustOk(state, capture, deps);
    const captured = state.decisions.at(-1)!;
    state = mustOk(
      state,
      {
        type: "START_COOLING",
        commandId: "cmd_cool_3",
        decisionId: captured.id,
      },
      deps,
    );

    const result = executeCommand(
      state,
      {
        type: "RESOLVE_DECISION",
        commandId: "cmd_resolve_5",
        decisionId: captured.id,
        outcome: "skipped",
      },
      deps,
    );
    expect(result.ok).toBe(false);
  });
});

describe("EXTEND_COOLING", () => {
  it("returns a ready decision to cooling with a fresh 24-hour window", () => {
    const deps = buildDeps();
    let state = deps.createSeed();
    const ready = state.decisions[0]!;

    state = mustOk(
      state,
      {
        type: "EXTEND_COOLING",
        commandId: "cmd_extend_1",
        decisionId: ready.id,
      },
      deps,
    );

    const extended = state.decisions[0]!;
    expect(extended.status).toBe("cooling");
    expect(extended.reviewAt).toBe(EXPECTED_REVIEW_AT);
    expect(state.events.at(-1)!.type).toBe("COOLING_STARTED");
  });

  it("rejects extending a decision that is still cooling", () => {
    const deps = buildDeps();
    let state = deps.createSeed();
    state = mustOk(state, capture, deps);
    const captured = state.decisions.at(-1)!;
    state = mustOk(
      state,
      {
        type: "START_COOLING",
        commandId: "cmd_cool_4",
        decisionId: captured.id,
      },
      deps,
    );

    const result = executeCommand(
      state,
      {
        type: "EXTEND_COOLING",
        commandId: "cmd_extend_2",
        decisionId: captured.id,
      },
      deps,
    );
    expect(result.ok).toBe(false);
  });
});
