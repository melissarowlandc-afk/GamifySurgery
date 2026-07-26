import { describe, expect, it } from "vitest";

import {
  booleanCell,
  controlToken,
  finiteNumberCell,
  isoTimestampCell,
  nullableStableIdCell,
  ordinalCell,
  requiredText,
  stableIdCell,
  WorkbookCellError,
} from "../src/workbook/cells.js";

const context = {
  sourceName: "TOPICS.csv",
  startLine: 4,
  header: "topic_id",
};

describe("workbook cell parsing", () => {
  it("preserves authored prose exactly", () => {
    expect(requiredText("  Preserve deliberate prose spacing.  ", context)).toBe(
      "  Preserve deliberate prose spacing.  ",
    );
  });

  it("validates IDs and maps only a truly blank nullable cell to null", () => {
    expect(stableIdCell("topic.example", context)).toBe("topic.example");
    expect(nullableStableIdCell("", context)).toBeNull();
    expect(() => nullableStableIdCell(" ", context)).toThrow(
      /Leading or trailing whitespace/,
    );
  });

  it("rejects formulas in control and reference fields", () => {
    expect(() => controlToken("=CONCAT(A1,B1)", context)).toThrow(
      WorkbookCellError,
    );
    expect(() => controlToken("@topic.example", context)).toThrow(
      /Formulas are not permitted/,
    );
  });

  it("parses booleans strictly without treating blank as false", () => {
    expect(booleanCell("TRUE", context)).toBe(true);
    expect(booleanCell("false", context)).toBe(false);
    expect(() => booleanCell("", context)).toThrow(/required/);
    expect(() => booleanCell("yes", context)).toThrow(/TRUE or FALSE/);
  });

  it("parses invariant finite numbers and nonnegative ordinals", () => {
    expect(finiteNumberCell("-1.25e2", context)).toBe(-125);
    expect(() => finiteNumberCell("1,000", context)).toThrow(
      /invariant-locale/,
    );
    expect(ordinalCell("0", context)).toBe(0);
    expect(() => ordinalCell("-1", context)).toThrow(/zero or more/);
  });

  it("rejects numbers that JavaScript would silently round or underflow", () => {
    for (const unsafe of [
      "9007199254740993",
      "1.234567890123456",
      "1e-4000",
      "-0",
    ]) {
      expect(
        () => finiteNumberCell(unsafe, context),
        unsafe,
      ).toThrow(/precision loss|Negative zero/);
    }
  });

  it("requires timestamp offsets", () => {
    expect(isoTimestampCell("2026-07-25T10:00:00-04:00", context)).toBe(
      "2026-07-25T10:00:00-04:00",
    );
    expect(() => isoTimestampCell("2026-07-25T10:00:00", context)).toThrow(
      /explicit offset/,
    );
  });
});
