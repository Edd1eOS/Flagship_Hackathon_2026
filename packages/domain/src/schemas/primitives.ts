import { z } from "zod";

export const CURRENT_SCHEMA_VERSION = 1;

export const entityIdSchema = z.string().min(1);
export type EntityId = z.infer<typeof entityIdSchema>;

export const isoTimestampSchema = z.iso.datetime();
export type IsoTimestamp = z.infer<typeof isoTimestampSchema>;

export const audCurrencySchema = z.literal("AUD");
export type AudCurrency = z.infer<typeof audCurrencySchema>;

function hasAtMostTwoDecimalPlaces(value: number): boolean {
  return Math.abs(value * 100 - Math.round(value * 100)) < 1e-6;
}

const WHOLE_CENTS_MESSAGE = "AUD amounts must resolve to whole cents";

export const audAmountSchema = z
  .number()
  .finite()
  .nonnegative()
  .refine(hasAtMostTwoDecimalPlaces, WHOLE_CENTS_MESSAGE);
export type AudAmount = z.infer<typeof audAmountSchema>;

export const positiveAudAmountSchema = z
  .number()
  .finite()
  .positive()
  .refine(hasAtMostTwoDecimalPlaces, WHOLE_CENTS_MESSAGE);
