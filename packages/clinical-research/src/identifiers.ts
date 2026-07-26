import { z } from "zod";

export const stableIdSchema = z
  .string()
  .min(3)
  .max(180)
  .regex(
    /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/,
    "Use a stable lowercase identifier separated by dots, underscores, or hyphens.",
  );

export const isoTimestampSchema = z.string().datetime({ offset: true });

export const nonBlankTextSchema = (maximum: number) =>
  z
    .string()
    .min(1)
    .max(maximum)
    .refine((value) => value.trim().length > 0, "Text cannot be blank.");

export type StableId = z.infer<typeof stableIdSchema>;
