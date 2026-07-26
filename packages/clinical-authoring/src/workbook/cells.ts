import { isoTimestampSchema, stableIdSchema } from "../identifiers.js";

export type WorkbookCellContext = {
  sourceName: string;
  startLine: number;
  header: string;
};

export class WorkbookCellError extends Error {
  readonly sourceName: string;
  readonly startLine: number;
  readonly header: string;

  constructor(context: WorkbookCellContext, message: string) {
    super(
      `${context.sourceName}:${context.startLine}:${context.header}: ${message}`,
    );
    this.name = "WorkbookCellError";
    this.sourceName = context.sourceName;
    this.startLine = context.startLine;
    this.header = context.header;
  }
}

function rejectControlFormula(
  value: string,
  context: WorkbookCellContext,
): void {
  if (/^[=+\-@]/.test(value)) {
    throw new WorkbookCellError(
      context,
      "Formulas are not permitted in identity, reference, or control fields.",
    );
  }
}

export function requiredText(
  value: string,
  context: WorkbookCellContext,
): string {
  if (value.trim().length === 0) {
    throw new WorkbookCellError(context, "A value is required.");
  }
  return value;
}

export function nullableText(value: string): string | null {
  return value === "" ? null : value;
}

export function controlToken(
  value: string,
  context: WorkbookCellContext,
): string {
  const token = exactToken(value, context);
  rejectControlFormula(token, context);
  return token;
}

function exactToken(
  value: string,
  context: WorkbookCellContext,
): string {
  if (value.length === 0) {
    throw new WorkbookCellError(context, "A value is required.");
  }
  if (value !== value.trim()) {
    throw new WorkbookCellError(
      context,
      "Leading or trailing whitespace is not permitted.",
    );
  }
  return value;
}

export function nullableControlToken(
  value: string,
  context: WorkbookCellContext,
): string | null {
  return value === "" ? null : controlToken(value, context);
}

export function stableIdCell(
  value: string,
  context: WorkbookCellContext,
): string {
  const token = controlToken(value, context);
  const result = stableIdSchema.safeParse(token);
  if (!result.success) {
    throw new WorkbookCellError(context, result.error.issues[0]!.message);
  }
  return result.data;
}

export function nullableStableIdCell(
  value: string,
  context: WorkbookCellContext,
): string | null {
  return value === "" ? null : stableIdCell(value, context);
}

export function enumCell<const Value extends readonly [string, ...string[]]>(
  value: string,
  allowed: Value,
  context: WorkbookCellContext,
): Value[number] {
  const token = controlToken(value, context);
  if (!allowed.includes(token)) {
    throw new WorkbookCellError(
      context,
      `Expected one of: ${allowed.join(", ")}.`,
    );
  }
  return token;
}

export function booleanCell(
  value: string,
  context: WorkbookCellContext,
): boolean {
  const token = controlToken(value, context).toUpperCase();
  if (token === "TRUE") {
    return true;
  }
  if (token === "FALSE") {
    return false;
  }
  throw new WorkbookCellError(context, "Expected TRUE or FALSE.");
}

const finiteNumberPattern =
  /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

export function finiteNumberCell(
  value: string,
  context: WorkbookCellContext,
): number {
  const token = exactToken(value, context);
  if (!finiteNumberPattern.test(token)) {
    throw new WorkbookCellError(
      context,
      "Expected an invariant-locale finite number.",
    );
  }
  const parsed = Number(token);
  if (!Number.isFinite(parsed)) {
    throw new WorkbookCellError(context, "Expected a finite number.");
  }
  if (Object.is(parsed, -0)) {
    throw new WorkbookCellError(
      context,
      "Negative zero is not a supported canonical number.",
    );
  }
  const unsignedMantissa = token
    .replace(/^[+-]/, "")
    .split(/[eE]/, 1)[0]!;
  const significantDigits = unsignedMantissa
    .replace(".", "")
    .replace(/^0+/, "");
  const isPlainInteger = /^[+-]?\d+$/.test(token);
  if (
    (parsed === 0 && /[1-9]/.test(unsignedMantissa)) ||
    (!isPlainInteger && significantDigits.length > 15) ||
    (isPlainInteger && !Number.isSafeInteger(parsed))
  ) {
    throw new WorkbookCellError(
      context,
      "The number cannot be represented safely without silent precision loss.",
    );
  }
  return parsed;
}

export function nullableFiniteNumberCell(
  value: string,
  context: WorkbookCellContext,
): number | null {
  return value === "" ? null : finiteNumberCell(value, context);
}

export function integerCell(
  value: string,
  context: WorkbookCellContext,
): number {
  const token = exactToken(value, context);
  if (!/^-?(?:0|[1-9]\d*)$/.test(token)) {
    throw new WorkbookCellError(context, "Expected an integer.");
  }
  const parsed = Number(token);
  if (!Number.isSafeInteger(parsed)) {
    throw new WorkbookCellError(context, "Expected a safe integer.");
  }
  return parsed;
}

export function nullableIntegerCell(
  value: string,
  context: WorkbookCellContext,
): number | null {
  return value === "" ? null : integerCell(value, context);
}

export function ordinalCell(
  value: string,
  context: WorkbookCellContext,
): number {
  const ordinal = integerCell(value, context);
  if (ordinal < 0) {
    throw new WorkbookCellError(context, "Expected an ordinal of zero or more.");
  }
  return ordinal;
}

export function isoTimestampCell(
  value: string,
  context: WorkbookCellContext,
): string {
  const token = controlToken(value, context);
  const result = isoTimestampSchema.safeParse(token);
  if (!result.success) {
    throw new WorkbookCellError(
      context,
      "Expected an ISO 8601 timestamp with an explicit offset.",
    );
  }
  return result.data;
}

export function nullableIsoTimestampCell(
  value: string,
  context: WorkbookCellContext,
): string | null {
  return value === "" ? null : isoTimestampCell(value, context);
}
