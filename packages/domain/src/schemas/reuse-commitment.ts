import { z } from "zod";

import { entityIdSchema, isoTimestampSchema } from "./primitives";

export const reuseActionSchema = z.enum([
  "use_existing",
  "clean_or_restyle",
  "repair",
  "borrow_or_share",
]);
export type ReuseAction = z.infer<typeof reuseActionSchema>;

export const reuseCommitmentSchema = z.strictObject({
  id: entityIdSchema,
  decisionId: entityIdSchema,
  ownedItemId: entityIdSchema,
  action: reuseActionSchema,
  note: z.string().min(1).optional(),
  createdAt: isoTimestampSchema,
});
export type ReuseCommitment = z.infer<typeof reuseCommitmentSchema>;
