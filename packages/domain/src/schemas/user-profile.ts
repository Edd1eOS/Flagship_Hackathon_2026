import { z } from "zod";

import {
  audAmountSchema,
  audCurrencySchema,
  entityIdSchema,
} from "./primitives";

export const coachingToneSchema = z.enum(["gentle", "direct", "funny"]);
export type CoachingTone = z.infer<typeof coachingToneSchema>;

export const userProfileSchema = z.strictObject({
  id: entityIdSchema,
  displayName: z.string().min(1),
  currency: audCurrencySchema,
  monthlyDiscretionaryPlan: audAmountSchema,
  coachingTone: coachingToneSchema,
});
export type UserProfile = z.infer<typeof userProfileSchema>;
