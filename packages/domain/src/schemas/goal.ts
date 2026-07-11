import { z } from "zod";

import { audAmountSchema, entityIdSchema } from "./primitives";

export const goalTypeSchema = z.enum(["experience", "savings", "debt"]);
export type GoalType = z.infer<typeof goalTypeSchema>;

export const goalSchema = z.strictObject({
  id: entityIdSchema,
  type: goalTypeSchema,
  name: z.string().min(1),
  targetAmount: audAmountSchema,
  startingAmount: audAmountSchema,
  // Planned money only. Never treated as saved or transferred funds.
  plannedAllocationTotal: audAmountSchema,
});
export type Goal = z.infer<typeof goalSchema>;
