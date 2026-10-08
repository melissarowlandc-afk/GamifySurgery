import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { approvalSnapshot, batch, catalogPath, hash, provenancePath, readIntegrationBaseline, registryPath, rel, repo, root, tool, verifyAppendOnlyRegistry, writeJson } from './runtime-contract.mjs';

const registry = verifyAppendOnlyRegistry(), baseline = readIntegrationBaseline();
const assets = registry.characters.flatMap(entry => [...Object.values(entry.poses.stand), ...Object.values(entry.poses.sit), ...(entry.clipboard ? [entry.clipboard] : [])]);
const paths = new Set([catalogPath, registryPath, provenancePath, rel(approvalSnapshot), rel(resolve(root, 'runtime-integration.json')), 'apps/player/src/art/characterStillRegistry.ts', 'apps/player/src/art/characterStillRegistry.test.ts', 'packages/game-domain/src/characterStillCatalog.test.ts',
  ...assets.map(asset => `apps/player/public/${asset.url}`), ...baseline.approvedInputs.map(file => file.path), ...baseline.files.map(file => file.copiedTo), rel(resolve(root, 'runtime-integration-baseline/manifest.json'))]);
for (const entry of readdirSync(tool, { recursive: true, withFileTypes: true })) if (entry.isFile()) paths.add(rel(resolve(entry.parentPath, entry.name)));
const before = [...paths].map(path => ({ path, sha256: hash(resolve(repo, path)) }));
await import('./promote-runtime.mjs');
for (const file of before) assert.equal(hash(resolve(repo, file.path)), file.sha256, 'promotion rerun changed ' + file.path);
const result = { status: 'PASS', batch, hashedFilesUnchanged: paths.size, runtimeAssetsUnchanged: assets.length, registryUnchanged: true, catalogUnchanged: true, provenanceUnchanged: true, integrationReceiptUnchanged: true, approvalAndReviewEvidenceUnchanged: true };
writeJson(resolve(root, 'validation/promotion-rerun-results.json'), result); console.log(JSON.stringify(result));
