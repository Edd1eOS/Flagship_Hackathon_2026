import { z } from "zod";

import { domainEventSchema } from "../events/domain-event";
import { captureTemplateSchema } from "./capture-template";
import { goalSchema } from "./goal";
import { missionSchema } from "./mission";
import { ownedItemSchema } from "./owned-item";
import { plannedAllocationSchema } from "./planned-allocation";
import { CURRENT_SCHEMA_VERSION, entityIdSchema } from "./primitives";
import { purchaseDecisionSchema } from "./purchase-decision";
import { reflectionSchema } from "./reflection";
import { reuseCommitmentSchema } from "./reuse-commitment";
import { townStateSchema } from "./town";
import { userProfileSchema } from "./user-profile";

export const appStateSchema = z
  .strictObject({
    schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
    profile: userProfileSchema,
    goals: z.array(goalSchema),
    ownedItems: z.array(ownedItemSchema),
    decisions: z.array(purchaseDecisionSchema),
    missions: z.array(missionSchema),
    reuseCommitments: z.array(reuseCommitmentSchema),
    plannedAllocations: z.array(plannedAllocationSchema),
    reflections: z.array(reflectionSchema),
    captureTemplates: z.array(captureTemplateSchema),
    town: townStateSchema,
    events: z.array(domainEventSchema),
    processedEventIds: z.array(entityIdSchema),
  })
  .superRefine((state, ctx) => {
    const goalIds = new Set(state.goals.map((goal) => goal.id));
    const ownedItemIds = new Set(state.ownedItems.map((item) => item.id));
    const decisionsById = new Map(
      state.decisions.map((decision) => [decision.id, decision]),
    );

    for (const [index, decision] of state.decisions.entries()) {
      for (const itemId of decision.overlapItemIds) {
        if (!ownedItemIds.has(itemId)) {
          ctx.addIssue({
            code: "custom",
            path: ["decisions", index, "overlapItemIds"],
            message: `Overlap item "${itemId}" is not an owned item`,
          });
        }
      }
    }

    for (const [index, mission] of state.missions.entries()) {
      if (!decisionsById.has(mission.decisionId)) {
        ctx.addIssue({
          code: "custom",
          path: ["missions", index, "decisionId"],
          message: `Mission decision "${mission.decisionId}" does not exist`,
        });
      }
      if (mission.ownedItemId && !ownedItemIds.has(mission.ownedItemId)) {
        ctx.addIssue({
          code: "custom",
          path: ["missions", index, "ownedItemId"],
          message: `Mission item "${mission.ownedItemId}" is not an owned item`,
        });
      }
    }

    for (const [index, commitment] of state.reuseCommitments.entries()) {
      if (!decisionsById.has(commitment.decisionId)) {
        ctx.addIssue({
          code: "custom",
          path: ["reuseCommitments", index, "decisionId"],
          message: `Commitment decision "${commitment.decisionId}" does not exist`,
        });
      }
      if (!ownedItemIds.has(commitment.ownedItemId)) {
        ctx.addIssue({
          code: "custom",
          path: ["reuseCommitments", index, "ownedItemId"],
          message: `Commitment item "${commitment.ownedItemId}" is not an owned item`,
        });
      }
    }

    // Financial truth: planned money only exists against explicitly skipped
    // decisions and can never exceed the skipped price.
    const allocatedByDecision = new Map<string, number>();
    for (const [index, allocation] of state.plannedAllocations.entries()) {
      const decision = decisionsById.get(allocation.decisionId);
      if (!decision) {
        ctx.addIssue({
          code: "custom",
          path: ["plannedAllocations", index, "decisionId"],
          message: `Allocation decision "${allocation.decisionId}" does not exist`,
        });
        continue;
      }
      if (decision.status !== "skipped") {
        ctx.addIssue({
          code: "custom",
          path: ["plannedAllocations", index, "decisionId"],
          message: "Planned allocations require a skipped decision",
        });
      }
      if (!goalIds.has(allocation.goalId)) {
        ctx.addIssue({
          code: "custom",
          path: ["plannedAllocations", index, "goalId"],
          message: `Allocation goal "${allocation.goalId}" does not exist`,
        });
      }
      const total =
        (allocatedByDecision.get(allocation.decisionId) ?? 0) +
        allocation.amount;
      allocatedByDecision.set(allocation.decisionId, total);
      if (total > decision.price + 1e-6) {
        ctx.addIssue({
          code: "custom",
          path: ["plannedAllocations", index, "amount"],
          message: "Total planned allocation cannot exceed the skipped price",
        });
      }
    }

    for (const [index, reflection] of state.reflections.entries()) {
      if (!decisionsById.has(reflection.decisionId)) {
        ctx.addIssue({
          code: "custom",
          path: ["reflections", index, "decisionId"],
          message: `Reflection decision "${reflection.decisionId}" does not exist`,
        });
      }
    }

    const eventIds = state.events.map((event) => event.id);
    if (new Set(eventIds).size !== eventIds.length) {
      ctx.addIssue({
        code: "custom",
        path: ["events"],
        message: "Event IDs must be unique",
      });
    }
  });
export type AppState = z.infer<typeof appStateSchema>;

export function migrateAppState(raw: unknown): AppState {
  const versioned = z
    .object({ schemaVersion: z.number().int().positive() })
    .parse(raw);
  if (versioned.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    // Migration placeholder: no earlier persisted versions exist yet.
    throw new Error(
      `Unsupported schema version ${versioned.schemaVersion}; expected ${CURRENT_SCHEMA_VERSION}`,
    );
  }
  return appStateSchema.parse(raw);
}
