import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readProtectedSources, sourceSha256, type ProtectedSourcePin } from "./protected-source-manifest";

type Seal = { path: string; sha256: string };
type CapturedFile = { path: string; beforeSha256: string; afterSha256: string };
type Scope = {
  ledger: Seal;
  capture: Seal;
  positions: number[];
  historicalRowsSha256: string;
  helper?: Seal;
  repairedArchive?: Seal;
  priorRelease?: Record<string, string>;
};
type VerifiedScope = Scope & { pins: ReadonlyMap<string, ProtectedSourcePin> };
type History = { scopes: Record<string, Scope> };

const historyPath = "tools/question-quality/fixtures/protected-source-history.json";
const historySha256 = "0e3a3539507fe92e97e418395e26f828f6a7f6a7434a55ac48eb254a005aadfa";
const scopes = new Map<string, VerifiedScope>();
const verifiedArchives = new Set<string>();
let history: History | undefined;
let sources: ReturnType<typeof readProtectedSources> | undefined;

function read(path: string): Buffer {
  return readFileSync(new URL(`../../${path}`, import.meta.url));
}

function verifySeal(seal: Seal): Buffer {
  const bytes = read(seal.path);
  assert.equal(sourceSha256(bytes), seal.sha256, `${seal.path} immutable source capture`);
  return bytes;
}

/** Resolve the original ledger's ordered scope against its independently sealed capture. */
export function historicalSourceScope(name: string): VerifiedScope {
  const cached = scopes.get(name);
  if (cached) return cached;
  const document: History = history ??= JSON.parse(verifySeal({ path: historyPath, sha256: historySha256 }).toString("utf8"));
  const scope = document.scopes[name];
  assert(scope, `Missing historical source scope ${name}`);
  const { files } = JSON.parse(verifySeal(scope.capture).toString("utf8")) as {
    files: Record<string, string> | CapturedFile[];
  };
  const capturedRows = Array.isArray(files)
    ? files.map(({ path, beforeSha256, afterSha256 }) => [path, beforeSha256, afterSha256] as const)
    : Object.entries(files);
  const orderedRows = scope.positions.map((position) => {
    const row = capturedRows[position];
    assert(row, `${name} missing historical capture row ${position}`);
    return row;
  });
  assert.equal(sourceSha256(JSON.stringify(orderedRows)), scope.historicalRowsSha256, `${name} historical source pin relationships and order`);
  const manifest = sources ??= readProtectedSources();
  assert(manifest.get(scope.ledger.path)?.requiredAbsent, `${scope.ledger.path} must remain retired`);
  const pins = new Map(orderedRows.map(([path]) => {
    const pin = manifest.get(path);
    assert(pin, `${name} missing current manifest pin for ${path}`);
    return [path, pin] as const;
  }));
  assert.equal(pins.size, orderedRows.length, `${name} historical source pin cardinality`);
  if (scope.helper) {
    const helperPin = manifest.get(scope.helper.path);
    assert(helperPin && !helperPin.requiredAbsent,
      `${name} missing live reverse-source helper pin for ${scope.helper.path}`);
  }
  if (scope.repairedArchive && !verifiedArchives.has(scope.repairedArchive.path)) {
    verifySeal(scope.repairedArchive);
    verifiedArchives.add(scope.repairedArchive.path);
  }
  const verified = { ...scope, pins };
  scopes.set(name, verified);
  return verified;
}
