import { z } from "zod";

import { entityIdSchema, isoTimestampSchema } from "./primitives";

// Fixed reward. Reflection XP never depends on item price or review outcome.
export const REFLECTION_XP = 10;

export const reflectionOutcomeSchema = z.enum([
  "bought",
  "skipped",
  "reused_existing",
  "repaired",
  "reclassified_need",
]);
export type ReflectionOutcome = z.infer<typeof reflectionOutcomeSchema>;

// Deliberately takes no inputs: the reward can never scale with price,
// outcome, or any other decision attribute.
export function calculateReflectionXp(): typeof REFLECTION_XP {
  return REFLECTION_XP;
}

export const reflectionSchema = z.strictObject({
  id: entityIdSchema,
  decisionId: entityIdSchema,
  outcome: reflectionOutcomeSchema,
  reason: z.string().min(1).optional(),
  xpAwarded: z.literal(REFLECTION_XP),
  createdAt: isoTimestampSchema,
});
export type Reflection = z.infer<typeof reflectionSchema>;
