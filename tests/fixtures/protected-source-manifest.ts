import { isDeepStrictEqual } from "node:util";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

export const protectedSourceManifestPath = "tools/question-quality/fixtures/protected-sources.json";

export interface ProtectedSourcePin {
  sha256: string | null;
  owningMilestone: string;
  requiredAbsent: boolean;
}

export function sourceSha256(bytes: string | Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseProtectedSources(bytes: Buffer, label = protectedSourceManifestPath): Map<string, ProtectedSourcePin> {
  const document: unknown = JSON.parse(bytes.toString("utf8"));
  if (!isRecord(document)) {
    throw new Error(`${label} must be an object keyed by repository path.`);
  }

  const entries = new Map<string, ProtectedSourcePin>();
  for (const path of Object.keys(document).sort()) {
    if (path.split("/").some((part) => !/^[A-Za-z0-9_.-]*[A-Za-z0-9_-]$/.test(part))) {
      throw new Error(`${label} has an invalid repository path ${JSON.stringify(path)}.`);
    }
    const entry = document[path];
    if (!isRecord(entry)) {
      throw new Error(`${label} has an invalid pin for ${path}.`);
    }
    const { sha256, owningMilestone, requiredAbsent } = entry;
    if (typeof owningMilestone !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(owningMilestone)
      || typeof requiredAbsent !== "boolean" || requiredAbsent !== (sha256 === null)
      || (sha256 !== null && (typeof sha256 !== "string" || !/^[a-f0-9]{64}$/.test(sha256)))) {
      throw new Error(`${label} has an invalid pin for ${path}.`);
    }
    entries.set(path, { sha256, owningMilestone, requiredAbsent });
  }

  const lines = [...entries].map(([path, pin]) => `  ${JSON.stringify(path)}: ${JSON.stringify(pin)}`);
  const canonical = Buffer.from(`{\n${lines.join(",\n")}\n}\n`, "utf8");
  // Comparing original bytes also rejects duplicate keys discarded by JSON.parse.
  if (!bytes.equals(canonical)) {
    throw new Error(`${label} must use sorted, unique paths and canonical UTF-8 JSON.`);
  }
  return entries;
}

export function readProtectedSources(): Map<string, ProtectedSourcePin> {
  const url = new URL(`../../${protectedSourceManifestPath}`, import.meta.url);
  return parseProtectedSources(readFileSync(url));
}

/** Match the entire manifest diff to independently supplied approval records. */
export function verifyProtectedSourceChanges(
  parent: ReadonlyMap<string, ProtectedSourcePin>,
  candidate: ReadonlyMap<string, ProtectedSourcePin>,
  approvals: unknown,
): number {
  if (!Array.isArray(approvals)) throw new Error("Expected an array of approved source changes.");
  const authorized = new Map<string, { before: unknown; after: unknown }>();
  for (const row of approvals as unknown[]) {
    if (!isRecord(row) || typeof row.path !== "string" || typeof row.reference !== "string"
      || row.reference.trim() === "" || !Object.hasOwn(row, "before") || !Object.hasOwn(row, "after")
      || authorized.has(row.path)) {
      throw new Error("Invalid or duplicate protected-source authorization.");
    }
    authorized.set(row.path, { before: row.before, after: row.after });
  }

  let changed = 0;
  for (const path of new Set([...parent.keys(), ...candidate.keys()])) {
    const before = parent.get(path) ?? null;
    const after = candidate.get(path) ?? null;
    if (isDeepStrictEqual(before, after)) continue;
    const approval = authorized.get(path);
    if (!approval || !isDeepStrictEqual(approval.before, before) || !isDeepStrictEqual(approval.after, after)) {
      throw new Error(`Unapproved protected-source change for ${path}.`);
    }
    authorized.delete(path);
    changed++;
  }
  if (authorized.size) throw new Error(`Unused protected-source authorizations for ${[...authorized.keys()].join(", ")}.`);
  return changed;
}
