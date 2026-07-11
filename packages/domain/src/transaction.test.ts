import { describe, expect, it } from "vitest";

import { FixedClock } from "./clock";
import type { QuickAddOwnedItemCommand } from "./commands/command";
import { DeterministicIdGenerator } from "./ids";
import { InMemoryRepository, createCommandDependencies } from "./repository";
import { createSeedState } from "./seed";
import { appendUniqueEvents, executeCommand } from "./transaction";

const NOW = "2026-07-11T09:00:00.000Z";

function buildDeps() {
  return createCommandDependencies(
    new FixedClock(NOW),
    new DeterministicIdGenerator(),
    () => createSeedState(new FixedClock(NOW), new DeterministicIdGenerator()),
  );
}

const quickAdd: QuickAddOwnedItemCommand = {
  type: "QUICK_ADD_OWNED_ITEM",
  commandId: "cmd_quick_add_1",
  name: "Spare laces",
  category: "footwear",
  useTag: "daily walking",
};

describe("appendUniqueEvents", () => {
  it("drops events whose IDs already exist", () => {
    const deps = buildDeps();
    const seed = deps.createSeed();
    const result = executeCommand(seed, quickAdd, deps);
    if (!result.ok) throw new Error("expected ok");

    const events = result.state.events;
    expect(appendUniqueEvents(events, events)).toHaveLength(events.length);
  });
});

describe("executeCommand", () => {
  it("quick-adds an owned item and appends one event", () => {
    const deps = buildDeps();
    const seed = deps.createSeed();
    const result = executeCommand(seed, quickAdd, deps);
    if (!result.ok) throw new Error("expected ok");

    expect(result.state.ownedItems).toHaveLength(seed.ownedItems.length + 1);
    const added = result.state.ownedItems.at(-1)!;
    expect(added.name).toBe("Spare laces");
    expect(added.condition).toBe("unknown");
    expect(result.events).toHaveLength(1);
    expect(result.events[0]!.type).toBe("OWNED_ITEM_ADDED");
    expect(result.events[0]!.commandId).toBe(quickAdd.commandId);
    expect(result.duplicateCommand).toBe(false);
  });

  it("treats a replayed commandId as a no-op duplicate", () => {
    const deps = buildDeps();
    const seed = deps.createSeed();
    const first = executeCommand(seed, quickAdd, deps);
    if (!first.ok) throw new Error("expected ok");

    const second = executeCommand(first.state, quickAdd, deps);
    if (!second.ok) throw new Error("expected ok");

    expect(second.duplicateCommand).toBe(true);
    expect(second.events).toHaveLength(0);
    expect(second.state).toBe(first.state);
  });

  it("returns an explicit error for not-yet-implemented commands", () => {
    const deps = buildDeps();
    const seed = deps.createSeed();
    const result = executeCommand(
      seed,
      {
        type: "PREVIEW_ASSIGNMENT",
        commandId: "cmd_x",
        residentId: "res_0001",
        locationId: "workshop",
      },
      deps,
    );
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected error");
    expect(result.error.code).toBe("NOT_IMPLEMENTED");
  });

  it("RESET_DEMO restores the canonical seed deterministically", () => {
    const deps = buildDeps();
    const seed = deps.createSeed();
    const mutated = executeCommand(seed, quickAdd, deps);
    if (!mutated.ok) throw new Error("expected ok");

    const reset = executeCommand(
      mutated.state,
      { type: "RESET_DEMO", commandId: "cmd_reset_1" },
      deps,
    );
    if (!reset.ok) throw new Error("expected ok");
    expect(reset.state).toEqual(deps.createSeed());
  });
});

describe("InMemoryRepository", () => {
  it("loads the seed, transacts, and notifies subscribers", async () => {
    const repo = new InMemoryRepository(
      new FixedClock(NOW),
      new DeterministicIdGenerator(),
    );
    const initial = await repo.load();
    expect(initial.ownedItems).toHaveLength(10);

    const seen: number[] = [];
    const unsubscribe = repo.subscribe((state) =>
      seen.push(state.ownedItems.length),
    );
    const result = await repo.transact(quickAdd);
    expect(result.ok).toBe(true);
    expect(seen).toEqual([11]);

    unsubscribe();
    await repo.resetDemo();
    expect(seen).toEqual([11]);
  });

  it("resetDemo restores the deterministic seed via the seed factory", async () => {
    const canonical = () =>
      createSeedState(new FixedClock(NOW), new DeterministicIdGenerator());
    const repo = new InMemoryRepository(
      new FixedClock(NOW),
      new DeterministicIdGenerator(),
      { seedFactory: canonical },
    );
    await repo.transact(quickAdd);
    const state = await repo.resetDemo();
    expect(state).toEqual(canonical());
  });
});
