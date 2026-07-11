import { z } from "zod";

import {
  entityIdSchema,
  isoTimestampSchema,
  positiveAudAmountSchema,
} from "../schemas/primitives";
import { reflectionOutcomeSchema } from "../schemas/reflection";
import { locationIdSchema } from "../schemas/town";

const eventBase = {
  id: entityIdSchema,
  occurredAt: isoTimestampSchema,
  schemaVersion: z.number().int().positive(),
  commandId: entityIdSchema.optional(),
};

export const domainEventSchema = z.discriminatedUnion("type", [
  z.strictObject({
    ...eventBase,
    type: z.literal("DECISION_CAPTURED"),
    decisionId: entityIdSchema,
  }),
  z.strictObject({
    ...eventBase,
    type: z.literal("COOLING_STARTED"),
    decisionId: entityIdSchema,
    reviewAt: isoTimestampSchema,
  }),
  z.strictObject({
    ...eventBase,
    type: z.literal("DECISION_REVIEWED"),
    decisionId: entityIdSchema,
    outcome: reflectionOutcomeSchema,
  }),
  z.strictObject({
    ...eventBase,
    type: z.literal("OWNED_ITEM_ADDED"),
    ownedItemId: entityIdSchema,
  }),
  z.strictObject({
    ...eventBase,
    type: z.literal("REUSE_COMMITTED"),
    reuseCommitmentId: entityIdSchema,
    decisionId: entityIdSchema,
    ownedItemId: entityIdSchema,
  }),
  z.strictObject({
    ...eventBase,
    type: z.literal("MISSION_OFFERED"),
    missionId: entityIdSchema,
    decisionId: entityIdSchema,
  }),
  z.strictObject({
    ...eventBase,
    type: z.literal("MISSION_ACCEPTED"),
    missionId: entityIdSchema,
    decisionId: entityIdSchema,
  }),
  z.strictObject({
    ...eventBase,
    type: z.literal("MISSION_CANCELLED"),
    missionId: entityIdSchema,
    decisionId: entityIdSchema,
  }),
  z.strictObject({
    ...eventBase,
    type: z.literal("MISSION_COMPLETED"),
    missionId: entityIdSchema,
    decisionId: entityIdSchema,
  }),
  z.strictObject({
    ...eventBase,
    type: z.literal("ALLOCATION_PLANNED"),
    allocationId: entityIdSchema,
    decisionId: entityIdSchema,
    goalId: entityIdSchema,
    amount: positiveAudAmountSchema,
  }),
  z.strictObject({
    ...eventBase,
    type: z.literal("PRODUCT_IMPORTED_FROM_EXTENSION"),
    decisionId: entityIdSchema,
    importId: entityIdSchema,
  }),
  z.strictObject({
    ...eventBase,
    type: z.literal("TOWN_PLAN_CONFIRMED"),
    assignments: z.array(
      z.strictObject({
        residentId: entityIdSchema,
        locationId: locationIdSchema,
      }),
    ),
  }),
  z.strictObject({
    ...eventBase,
    type: z.literal("REWARD_SELECTED"),
    rewardId: entityIdSchema,
  }),
]);
export type DomainEvent = z.infer<typeof domainEventSchema>;
export type DomainEventType = DomainEvent["type"];
