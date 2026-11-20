import { readFileSync } from "node:fs";
import {
  parseProtectedSources, protectedSourceManifestPath, sourceSha256, verifyProtectedSourceChanges,
} from "../../tests/fixtures/protected-source-manifest.ts";

function readTrusted(path, expected, label) {
  const bytes = readFileSync(path);
  const actual = sourceSha256(bytes);
  if (actual !== expected) throw new Error(`${label} expected SHA-256 ${expected}, got ${actual}.`);
  return bytes;
}

try {
  const args = process.argv.slice(2);
  if (args.length < 4 || args.length > 5) {
    throw new Error("Usage: verify-protected-source-authorization.mjs <accepted-parent> <parent-sha256> <approvals> <approvals-sha256> [candidate]");
  }
  const [parentPath, parentSha, approvalPath, approvalSha, candidatePath = protectedSourceManifestPath] = args;
  const parent = parseProtectedSources(readTrusted(parentPath, parentSha, "Accepted parent"), parentPath);
  const approvals = JSON.parse(readTrusted(approvalPath, approvalSha, "Approved transitions").toString("utf8"));
  if (approvals.parentSha256 !== parentSha) throw new Error("Approvals must name the exact accepted parent SHA-256.");
  const candidate = parseProtectedSources(readFileSync(candidatePath), candidatePath);
  const count = verifyProtectedSourceChanges(parent, candidate, approvals.changes);
  console.log(`Verified ${count} authorized protected-source changes against accepted parent ${parentSha}.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
