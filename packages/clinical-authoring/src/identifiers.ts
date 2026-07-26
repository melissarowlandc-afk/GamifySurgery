import { z } from "zod";

/**
 * Human-readable stable identifiers are intentionally independent from
 * display names. Once referenced by authored content, an ID must not be
 * renamed merely because its label changes.
 */
export const stableIdSchema = z
  .string()
  .min(3)
  .max(160)
  .regex(
    /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/,
    "Use a stable lowercase identifier separated by dots, underscores, or hyphens.",
  );

export const isoTimestampSchema = z.string().datetime({ offset: true });

export type StableId = z.infer<typeof stableIdSchema>;
