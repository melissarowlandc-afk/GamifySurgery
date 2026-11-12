import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {describe, expect, it} from "vitest";
import {beforeAuthorizedTestTimingSource} from "./question-authorized-test-timing-source-20261112";
import {beforeProgramBatch6AcceptanceSource} from "./question-program-batch6-acceptance-test-support";

const read = (path: string) => readFileSync(new URL("../../../" + path, import.meta.url), "utf8");
const sha = (text: string) => createHash("sha256").update(text).digest("hex");
const migration = JSON.parse(read(
  "tools/question-quality/fixtures/question-authorized-test-timing-source-migration-20261112.json",
)) as {
  files: Array<{path: string; beforeText: string; beforeSha256: string; afterSha256: string}>;
  captures: Array<{path: string; sha256: string; pins: Array<{field: string; path: string; sha256: string}>}>;
};

describe("manager-authorized test timing source pins", () => {
  it.each(migration.files)("retains the exact authorized $path delta in the shared guard chain", row => {
    const current = read(row.path);
    expect(sha(current)).toBe(row.afterSha256);
    expect(beforeAuthorizedTestTimingSource(row.path, current)).toBe(row.beforeText);
    expect(beforeProgramBatch6AcceptanceSource(row.path, current)).toBe(row.beforeText);
    expect(sha(row.beforeText)).toBe(row.beforeSha256);
  });

  it.each(migration.files)("rejects extra edits and a timing rollback in $path", row => {
    const changed = read(row.path) + "\n// Unapproved source edit\n";
    expect(() => beforeProgramBatch6AcceptanceSource(row.path, changed)).toThrow();
    expect(() => beforeProgramBatch6AcceptanceSource(row.path, row.beforeText)).toThrow();
  });

  it("preserves all52 original pins in all23 source captures", () => {
    expect(migration.files).toHaveLength(3);
    expect(migration.captures).toHaveLength(23);
    expect(migration.captures.flatMap(capture => capture.pins)).toHaveLength(52);
    for (const capture of migration.captures) {
      const text = read(capture.path);
      expect(sha(text), capture.path + " immutable capture").toBe(capture.sha256);
      const data = JSON.parse(text) as Record<string, Record<string, string>>;
      for (const pin of capture.pins) expect(data[pin.field]![pin.path], capture.path).toBe(pin.sha256);
    }
  });
});
