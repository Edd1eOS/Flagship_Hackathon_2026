import { z } from "zod";

import {
  audAmountSchema,
  audCurrencySchema,
  entityIdSchema,
  isoTimestampSchema,
} from "./primitives";

export const decisionStatusSchema = z.enum([
  "draft",
  "assessed",
  "cooling",
  "ready",
  "bought",
  "skipped",
  "extended",
  "reclassified_need",
]);
export type DecisionStatus = z.infer<typeof decisionStatusSchema>;

export const decisionMotiveSchema = z.enum([
  "need",
  "replacement",
  "occasion",
  "mood",
  "sale",
  "trend",
]);
export type DecisionMotive = z.infer<typeof decisionMotiveSchema>;

// Keeps genuinely new Cooling decisions visibly distinct from seeded demo data.
export const decisionOriginSchema = z.enum([
  "manual",
  "extension_import",
  "seeded_demo",
]);
export type DecisionOrigin = z.infer<typeof decisionOriginSchema>;

const STATUSES_REQUIRING_REVIEW_AT: ReadonlySet<DecisionStatus> = new Set([
  "cooling",
  "ready",
  "extended",
]);

export const purchaseDecisionSchema = z
  .strictObject({
    id: entityIdSchema,
    name: z.string().min(1),
    imageRef: z.string().min(1).optional(),
    sourceUrl: z.string().min(1).optional(),
    merchant: z.string().min(1).optional(),
    price: audAmountSchema,
    currency: audCurrencySchema,
    category: z.string().min(1),
    job: z.string().min(1),
    motive: decisionMotiveSchema,
    status: decisionStatusSchema,
    origin: decisionOriginSchema,
    createdAt: isoTimestampSchema,
    reviewAt: isoTimestampSchema.optional(),
    resolvedAt: isoTimestampSchema.optional(),
    overlapItemIds: z.array(entityIdSchema),
    outcomeReason: z.string().min(1).optional(),
  })
  .superRefine((decision, ctx) => {
    if (
      STATUSES_REQUIRING_REVIEW_AT.has(decision.status) &&
      !decision.reviewAt
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["reviewAt"],
        message: `Status "${decision.status}" requires reviewAt`,
      });
    }
  });
export type PurchaseDecision = z.infer<typeof purchaseDecisionSchema>;
