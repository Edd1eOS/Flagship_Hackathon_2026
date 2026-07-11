import {
  DeterministicIdGenerator,
  FixedClock,
  InMemoryRepository,
} from "@lemonade/domain";
import { describe, expect, it } from "vitest";

import { createLemonadeStore } from "./lemonade-store";

const NOW = "2026-07-11T09:00:00.000Z";

function createRepository() {
  return new InMemoryRepository(
    new FixedClock(NOW),
    new DeterministicIdGenerator(),
  );
}

async function waitFor(predicate: () => boolean): Promise<void> {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error("Condition was not met in time");
}

describe("createLemonadeStore", () => {
  it("hydrates from the repository into ready state", async () => {
    const store = createLemonadeStore(createRepository());
    await waitFor(() => store.getState().status === "ready");
    expect(store.getState().appState!.ownedItems).toHaveLength(10);
    expect(store.getState().loadError).toBeNull();
  });

  it("updates through dispatched commands only", async () => {
    const store = createLemonadeStore(createRepository());
    await waitFor(() => store.getState().status === "ready");

    const result = await store.getState().dispatch({
      type: "QUICK_ADD_OWNED_ITEM",
      commandId: "cmd_store_add",
      name: "Repair kit",
      category: "supplies",
      useTag: "repair",
    });
    expect(result.ok).toBe(true);
    await waitFor(() => store.getState().appState!.ownedItems.length === 11);
  });

  it("resetDemo returns the store to seed state", async () => {
    const store = createLemonadeStore(createRepository());
    await waitFor(() => store.getState().status === "ready");

    await store.getState().dispatch({
      type: "QUICK_ADD_OWNED_ITEM",
      commandId: "cmd_store_add_2",
      name: "Repair kit",
      category: "supplies",
      useTag: "repair",
    });
    await store.getState().resetDemo();
    await waitFor(() => store.getState().appState!.ownedItems.length === 10);
  });
});
