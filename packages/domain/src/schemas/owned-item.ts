import { z } from "zod";

import { entityIdSchema } from "./primitives";

export const ownedItemConditionSchema = z.enum([
  "good",
  "worn",
  "repairable",
  "broken",
  "unknown",
]);
export type OwnedItemCondition = z.infer<typeof ownedItemConditionSchema>;

export const ownedItemSchema = z.strictObject({
  id: entityIdSchema,
  name: z.string().min(1),
  imageRef: z.string().min(1).optional(),
  category: z.string().min(1),
  colour: z.string().min(1).optional(),
  useTags: z.array(z.string().min(1)).min(1),
  condition: ownedItemConditionSchema,
  repairNote: z.string().min(1).optional(),
});
export type OwnedItem = z.infer<typeof ownedItemSchema>;
