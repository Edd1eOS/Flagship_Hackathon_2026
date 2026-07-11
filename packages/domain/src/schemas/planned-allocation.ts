import { z } from "zod";

import {
  entityIdSchema,
  isoTimestampSchema,
  positiveAudAmountSchema,
} from "./primitives";

// Planned money only. Creating an allocation never moves or saves real funds.
export const plannedAllocationSchema = z.strictObject({
  id: entityIdSchema,
  decisionId: entityIdSchema,
  goalId: entityIdSchema,
  amount: positiveAudAmountSchema,
  kind: z.literal("planned"),
  createdAt: isoTimestampSchema,
});
export type PlannedAllocation = z.infer<typeof plannedAllocationSchema>;
