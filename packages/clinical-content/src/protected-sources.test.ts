import { lstatSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";
import {
  protectedSourceManifestPath, readProtectedSources, sourceSha256, verifyProtectedSourceChanges,
} from "../../../tests/fixtures/protected-source-manifest";

const repositoryRoot = fileURLToPath(new URL("../../../", import.meta.url));
// Seal the reviewed path set separately so a missing or substituted row fails.
const protectedPathSetSha256 = "dd421a20754ab2fc1b470ca9082eabff17fd09f45df9dd50bfdf34eacc1abdc4";

test("preserves the exact current bytes and required absences of protected sources", () => {
  const entries = readProtectedSources();
  const actualPathSetSha256 = sourceSha256([...entries.keys()].join("\n") + "\n");
  if (actualPathSetSha256 !== protectedPathSetSha256) {
    throw new Error(`${protectedSourceManifestPath} changed the reviewed path set (${entries.size} entries). `
      + `Expected ${protectedPathSetSha256}, got ${actualPathSetSha256}.`);
  }

  const violations: string[] = [];
  for (const [path, pin] of entries) {
    const location = join(repositoryRoot, path);
    const expected = pin.sha256 ?? "absent";
    let actual: string;
    try {
      if (pin.requiredAbsent) {
        actual = lstatSync(location, { throwIfNoEntry: false }) ? "present" : "absent";
      } else {
        actual = sourceSha256(readFileSync(location));
      }
    } catch (error) {
      actual = `read failed (${error instanceof Error ? error.message : String(error)})`;
    }
    if (actual !== expected) {
      violations.push(`${path} (${pin.owningMilestone}) expected ${expected}, got ${actual}`);
    }
  }
  if (violations.length > 0) {
    throw new Error(`${violations.length} of ${entries.size} protected sources differ.\n${violations.join("\n")}`);
  }
});

test("requires an exact accepted-parent authorization for every protected-source change", () => {
  const path = "packages/clinical-content/src/example.ts";
  const before = { sha256: sourceSha256("accepted bytes"), owningMilestone: "example", requiredAbsent: false };
  const after = { ...before, sha256: sourceSha256("replacement bytes") };
  const parent = new Map([[path, before]]);
  // The replacement digest is correct for the new bytes, but still needs approval.
  const candidate = new Map([[path, after]]);
  const approval = { path, before, after, reference: "example approval" };

  expect(verifyProtectedSourceChanges(parent, parent, [])).toBe(0);
  expect(() => verifyProtectedSourceChanges(parent, candidate, [])).toThrow(/Unapproved/);
  expect(() => verifyProtectedSourceChanges(parent, candidate, [{ ...approval, before: after }])).toThrow(/Unapproved/);
  expect(verifyProtectedSourceChanges(parent, candidate, [approval])).toBe(1);
  expect(() => verifyProtectedSourceChanges(parent, new Map(), [])).toThrow(/Unapproved/);
  expect(() => verifyProtectedSourceChanges(new Map(), candidate, [])).toThrow(/Unapproved/);
  expect(() => verifyProtectedSourceChanges(parent, parent, [approval])).toThrow(/Unused/);
});
