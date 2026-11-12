import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {expect} from "vitest";

interface AuthorizedTimingSource {
  path: string;
  beforeSha256: string;
  afterSha256: string;
  beforeText: string;
  changes: Array<{before: string; after: string}>;
}

const migration = JSON.parse(readFileSync(new URL(
  "../../../tools/question-quality/fixtures/question-authorized-test-timing-source-migration-20261112.json",
  import.meta.url,
), "utf8")) as {files: AuthorizedTimingSource[]};
const sha = (text: string) => createHash("sha256").update(text).digest("hex");

/** Restore the exact source before the manager's three test timing edits.
 * Historical source guards still verify their original captured hashes. */
export function beforeAuthorizedTestTimingSource(path: string, current: string): string {
  const row = migration.files.find(file => file.path === path);
  if (!row) return current;
  expect(sha(current), path + " authorized timing postimage").toBe(row.afterSha256);
  expect(sha(row.beforeText), path + " retained timing preimage").toBe(row.beforeSha256);
  let expected = row.beforeText;
  for (const change of row.changes) {
    expect(expected.split(change.before), path + " unique authorized timing edit").toHaveLength(2);
    expected = expected.replace(change.before, change.after);
  }
  expect(current, path + " exact authorized timing delta").toBe(expected);
  return row.beforeText;
}
