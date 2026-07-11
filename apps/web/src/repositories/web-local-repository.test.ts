import {
  DeterministicIdGenerator,
  FixedClock,
  createSeedState,
} from "@lemonade/domain";
import type { QuickAddOwnedItemCommand } from "@lemonade/domain";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  APP_STATE_STORAGE_KEY,
  WebLocalRepository,
  type KeyValueStorage,
} from "./web-local-repository";

const NOW = "2026-07-11T09:00:00.000Z";

function createFakeStorage(): KeyValueStorage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
  };
}

function canonicalSeed() {
  return createSeedState(new FixedClock(NOW), new DeterministicIdGenerator());
}

function createRepository(storage: KeyValueStorage) {
  return new WebLocalRepository(
    new FixedClock(NOW),
    new DeterministicIdGenerator(),
    storage,
    { seedFactory: canonicalSeed },
  );
}

const quickAdd: QuickAddOwnedItemCommand = {
  type: "QUICK_ADD_OWNED_ITEM",
  commandId: "cmd_quick_add_web",
  name: "Shoe glue",
  category: "supplies",
  useTag: "repair",
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("WebLocalRepository", () => {
  it("seeds and persists on first load", async () => {
    const storage = createFakeStorage();
    const repo = createRepository(storage);
    const state = await repo.load();
    expect(state).toEqual(canonicalSeed());
    expect(storage.data.has(APP_STATE_STORAGE_KEY)).toBe(true);
  });

  it("preserves transacted state across a simulated refresh", async () => {
    const storage = createFakeStorage();
    const first = createRepository(storage);
    const result = await first.transact(quickAdd);
    expect(result.ok).toBe(true);

    const second = createRepository(storage);
    const reloaded = await second.load();
    expect(reloaded.ownedItems.at(-1)!.name).toBe("Shoe glue");
    expect(reloaded.events.at(-1)!.commandId).toBe(quickAdd.commandId);
  });

  it("falls back to the seed with a warning on corrupted storage", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const storage = createFakeStorage();
    storage.data.set(APP_STATE_STORAGE_KEY, "{not valid json");

    const repo = createRepository(storage);
    const state = await repo.load();
    expect(state).toEqual(canonicalSeed());
    expect(warn).toHaveBeenCalledOnce();
  });

  it("falls back to the seed with a warning on an unsupported version", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const storage = createFakeStorage();
    const future = { ...canonicalSeed(), schemaVersion: 99 };
    storage.data.set(APP_STATE_STORAGE_KEY, JSON.stringify(future));

    const repo = createRepository(storage);
    const state = await repo.load();
    expect(state.schemaVersion).toBe(1);
    expect(warn).toHaveBeenCalledOnce();
  });

  it("resetDemo restores and persists the canonical seed", async () => {
    const storage = createFakeStorage();
    const repo = createRepository(storage);
    await repo.transact(quickAdd);

    const state = await repo.resetDemo();
    expect(state).toEqual(canonicalSeed());
    expect(JSON.parse(storage.data.get(APP_STATE_STORAGE_KEY)!)).toEqual(
      canonicalSeed(),
    );
  });
});
