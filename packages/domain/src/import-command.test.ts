import { describe, expect, it } from "vitest";

import { FixedClock } from "./clock";
import { DeterministicIdGenerator } from "./ids";
import { createCommandDependencies } from "./repository";
import { createSeedState } from "./seed";
import { executeCommand } from "./transaction";

describe("IMPORT_DETECTED_PRODUCT", () => {
  it("imports one extension product into genuine Cooling exactly once", () => {
    const clock = new FixedClock("2026-07-11T09:00:00.000Z");
    const ids = new DeterministicIdGenerator();
    const deps = createCommandDependencies(clock, ids);
    const state = createSeedState(clock, ids);
    const command = {
      type: "IMPORT_DETECTED_PRODUCT" as const,
      commandId: "cmd_import_1",
      importId: "import_1",
      product: {
        name: "Cloudstep Runner Sneakers",
        sourceUrl: "http://127.0.0.1:3000/demo-store",
        price: 149.95,
        currency: "AUD" as const,
        category: "footwear",
        job: "daily walking",
      },
    };
    const first = executeCommand(state, command, deps);
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.state.decisions.at(-1)).toMatchObject({
      status: "cooling",
      origin: "extension_import",
      overlapItemIds: expect.arrayContaining(
        state.ownedItems.slice(0, 3).map((item) => item.id),
      ),
    });
    const replay = executeCommand(
      first.state,
      { ...command, commandId: "cmd_import_retry" },
      deps,
    );
    expect(replay.ok && replay.duplicateCommand).toBe(true);
    expect(replay.ok && replay.state.decisions).toHaveLength(
      state.decisions.length + 1,
    );
  });
});
