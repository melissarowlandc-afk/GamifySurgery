import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { catalogPath, hash, provenancePath, registryPath, rel, repo, root, tool, verifyAppendOnlyRegistry, writeJson } from './runtime-contract.mjs';

const registry = verifyAppendOnlyRegistry();
const assets = registry.characters.flatMap(entry => [...Object.values(entry.poses.stand), ...Object.values(entry.poses.sit), ...(entry.clipboard ? [entry.clipboard] : [])]);
const paths = [catalogPath, registryPath, provenancePath, rel(resolve(root, 'runtime-integration.json')), ...assets.map(asset => `apps/player/public/${asset.url}`)];
const before = paths.map(path => ({ path, sha256: hash(resolve(repo, path)) }));
execFileSync(process.execPath, [resolve(tool, 'promote-runtime.mjs')], { stdio: 'inherit' });
for (const item of before) assert.equal(hash(resolve(repo, item.path)), item.sha256, 'rerun changed ' + item.path);
const result = { status: 'PASS', runtimeAssetsUnchanged: assets.length, registryUnchanged: true, catalogUnchanged: true, provenanceUnchanged: true, integrationReceiptUnchanged: true };
writeJson(resolve(root, 'validation/promotion-rerun-results.json'), result);
console.log(JSON.stringify(result));
