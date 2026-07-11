import { z } from "zod";

import {
  audAmountSchema,
  audCurrencySchema,
  entityIdSchema,
} from "./primitives";
import { decisionMotiveSchema } from "./purchase-decision";

// Prefill data for the controlled-storefront demo capture. Not a decision.
export const captureTemplateSchema = z.strictObject({
  id: entityIdSchema,
  name: z.string().min(1),
  price: audAmountSchema,
  currency: audCurrencySchema,
  category: z.string().min(1),
  job: z.string().min(1),
  motive: decisionMotiveSchema,
  merchant: z.string().min(1).optional(),
  sourceUrl: z.string().min(1).optional(),
  imageRef: z.string().min(1).optional(),
});
export type CaptureTemplate = z.infer<typeof captureTemplateSchema>;
