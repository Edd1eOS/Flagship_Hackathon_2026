import { z } from "zod";

import { entityIdSchema, isoTimestampSchema } from "./primitives";

export const missionTypeSchema = z.enum([
  "TRY_EXISTING",
  "CLEAN_OR_RESTYLE",
  "REPAIR",
  "BORROW_OR_SHARE",
  "WAIT_AND_REFLECT",
]);
export type MissionType = z.infer<typeof missionTypeSchema>;

export const missionStatusSchema = z.enum([
  "offered",
  "accepted",
  "active",
  "ready_for_checkin",
  "completed",
  "cancelled",
]);
export type MissionStatus = z.infer<typeof missionStatusSchema>;

const STATUSES_REQUIRING_ACCEPTED_AT: ReadonlySet<MissionStatus> = new Set([
  "accepted",
  "active",
  "ready_for_checkin",
  "completed",
]);

export const missionSchema = z
  .strictObject({
    id: entityIdSchema,
    decisionId: entityIdSchema,
    ownedItemId: entityIdSchema.optional(),
    type: missionTypeSchema,
    status: missionStatusSchema,
    acceptedAt: isoTimestampSchema.optional(),
    checkInAt: isoTimestampSchema.optional(),
    completedAt: isoTimestampSchema.optional(),
  })
  .superRefine((mission, ctx) => {
    if (
      STATUSES_REQUIRING_ACCEPTED_AT.has(mission.status) &&
      !mission.acceptedAt
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["acceptedAt"],
        message: `Status "${mission.status}" requires acceptedAt`,
      });
    }
    if (mission.status === "completed" && !mission.completedAt) {
      ctx.addIssue({
        code: "custom",
        path: ["completedAt"],
        message: 'Status "completed" requires completedAt',
      });
    }
  });
export type Mission = z.infer<typeof missionSchema>;
