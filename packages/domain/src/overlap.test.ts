import { describe, expect, it } from "vitest";

import { FixedClock } from "./clock";
import { DeterministicIdGenerator } from "./ids";
import {
  explainMatch,
  findSameJobMatches,
  getMatchConfidence,
  scoreOwnedItemMatch,
  type MatchCandidate,
} from "./overlap";
import { createCommandDependencies } from "./repository";
import { createSeedState } from "./seed";
import { executeCommand } from "./transaction";

const NOW = "2026-07-11T09:00:00.000Z";

function buildDeps() {
  const ids = new DeterministicIdGenerator();
  return createCommandDependencies(new FixedClock(NOW), ids, () =>
    createSeedState(new FixedClock(NOW), ids),
  );
}

const sneakers: MatchCandidate = {
  name: "Retro court sneakers",
  category: "footwear",
  job: "daily walking",
};

describe("findSameJobMatches with the seeded persona", () => {
  it("ranks the three same-job shoes and explains each match", () => {
    const seed = buildDeps().createSeed();
    const matches = findSameJobMatches(sneakers, seed.ownedItems);

    expect(matches).toHaveLength(3);
    for (const match of matches) {
      expect(match.item.category).toBe("footwear");
      expect(match.reasons[0]).toContain("daily walking");
      expect(["high", "medium"]).toContain(match.confidence);
    }

    const scores = matches.map((m) => m.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
    expect(matches[0]!.item.name).toBe("Trail running shoes");
  });

  it("surfaces the repairable boots with their repair note", () => {
    const seed = buildDeps().createSeed();
    const matches = findSameJobMatches(sneakers, seed.ownedItems);
    const boots = matches.find((m) => m.item.name === "Leather ankle boots")!;
    expect(boots.reasons.join(" ")).toContain("re-glue");
  });
});

describe("false and low-confidence matches", () => {
  it("returns no matches for an unrelated job", () => {
    const seed = buildDeps().createSeed();
    const matches = findSameJobMatches(
      {
        name: "Mirrorless camera",
        category: "electronics",
        job: "photography",
      },
      seed.ownedItems,
    );
    expect(matches).toEqual([]);
  });

  it("never matches on category alone without the job", () => {
    const { score, reasons } = scoreOwnedItemMatch(sneakers, {
      id: "item_x",
      name: "Hiking gaiters",
      category: "footwear",
      useTags: ["hiking"],
      condition: "good",
    });
    expect(score).toBe(0);
    expect(reasons).toEqual([]);
  });

  it("gives only low confidence to a broken same-job item", () => {
    const { score } = scoreOwnedItemMatch(sneakers, {
      id: "item_y",
      name: "Old slippers",
      category: "homeware",
      useTags: ["daily walking"],
      condition: "broken",
    });
    expect(getMatchConfidence(score)).toBe("low");
  });

  it("keeps confidence labels monotonic in score", () => {
    expect(getMatchConfidence(0)).toBe("none");
    expect(getMatchConfidence(0.35)).toBe("low");
    expect(getMatchConfidence(0.6)).toBe("medium");
    expect(getMatchConfidence(0.8)).toBe("high");
  });
});

describe("explainMatch", () => {
  it("returns the primary reason", () => {
    const seed = buildDeps().createSeed();
    const [top] = findSameJobMatches(sneakers, seed.ownedItems);
    expect(explainMatch(top!)).toBe(top!.reasons[0]);
  });
});

describe("COMMIT_REUSE", () => {
  it("creates one validated commitment from a ready decision", () => {
    const deps = buildDeps();
    const seed = deps.createSeed();
    const ready = seed.decisions[0]!;
    const boots = seed.ownedItems.find(
      (item) => item.condition === "repairable",
    )!;

    const result = executeCommand(
      seed,
      {
        type: "COMMIT_REUSE",
        commandId: "cmd_reuse_1",
        decisionId: ready.id,
        ownedItemId: boots.id,
        action: "repair",
        note: "Re-glue the toe and keep walking in these",
      },
      deps,
    );
    if (!result.ok) throw new Error(result.error.message);

    expect(result.state.reuseCommitments).toHaveLength(1);
    expect(result.state.reuseCommitments[0]!.action).toBe("repair");
    expect(result.events[0]!.type).toBe("REUSE_COMMITTED");
  });

  it("rejects a duplicate commitment for the same decision", () => {
    const deps = buildDeps();
    const seed = deps.createSeed();
    const ready = seed.decisions[0]!;
    const boots = seed.ownedItems[2]!;

    const first = executeCommand(
      seed,
      {
        type: "COMMIT_REUSE",
        commandId: "cmd_reuse_2",
        decisionId: ready.id,
        ownedItemId: boots.id,
        action: "repair",
      },
      deps,
    );
    if (!first.ok) throw new Error(first.error.message);

    const second = executeCommand(
      first.state,
      {
        type: "COMMIT_REUSE",
        commandId: "cmd_reuse_3",
        decisionId: ready.id,
        ownedItemId: boots.id,
        action: "use_existing",
      },
      deps,
    );
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.error.code).toBe("RULE_VIOLATION");
  });

  it("rejects commitments for cooling decisions and unknown items", () => {
    const deps = buildDeps();
    let seed = deps.createSeed();

    const captured = executeCommand(
      seed,
      {
        type: "CAPTURE_DECISION",
        commandId: "cmd_cap_1",
        draft: {
          name: "Cloudstep runner sneakers",
          price: 149.95,
          currency: "AUD",
          category: "footwear",
          job: "daily walking",
          motive: "trend",
          origin: "manual",
        },
      },
      deps,
    );
    if (!captured.ok) throw new Error(captured.error.message);
    seed = captured.state;
    const draft = seed.decisions.at(-1)!;

    const onDraft = executeCommand(
      seed,
      {
        type: "COMMIT_REUSE",
        commandId: "cmd_reuse_4",
        decisionId: draft.id,
        ownedItemId: seed.ownedItems[0]!.id,
        action: "use_existing",
      },
      deps,
    );
    expect(onDraft.ok).toBe(false);

    const missingItem = executeCommand(
      seed,
      {
        type: "COMMIT_REUSE",
        commandId: "cmd_reuse_5",
        decisionId: seed.decisions[0]!.id,
        ownedItemId: "item_missing",
        action: "use_existing",
      },
      deps,
    );
    expect(missingItem.ok).toBe(false);
    if (!missingItem.ok) expect(missingItem.error.code).toBe("NOT_FOUND");
  });
});
