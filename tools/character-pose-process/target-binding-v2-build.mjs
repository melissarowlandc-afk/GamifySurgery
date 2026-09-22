import { createHash } from 'node:crypto';
import { closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalJson, compileRecipeFile, compilerCodeFingerprint } from '../character-mapping/compiler.mjs';
import { assertNoLinkedPath } from './target-binding.mjs';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const root = join(repo, 'Photos for Codex 2', 'Codex Patients or Staff or Other Characters 2', 'mixed-batch-2026-09-10', 'pose-process-proof-v1', 'binding-v2');
const baseRecipePath = join(repo, 'docs', 'features', 'character-movement', 'recipes', 'patient-01.json');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const clone = value => structuredClone(value);
const guardedRead = path => readFileSync(assertNoLinkedPath(path, repo));
function writeOrVerify(path, bytes) { const safe = assertNoLinkedPath(path, repo, { mustExist: false }), parent = assertNoLinkedPath(dirname(safe), repo, { mustExist: false }); if (existsSync(safe)) { if (!guardedRead(safe).equals(bytes)) throw new Error(`immutable fixture differs: ${safe}`); return; } mkdirSync(parent, { recursive: true }); assertNoLinkedPath(parent, repo); assertNoLinkedPath(safe, repo, { mustExist: false }); const fd = openSync(safe, 'wx'); try { writeFileSync(fd, bytes); fsyncSync(fd); } finally { closeSync(fd); } }

const definitions = {
  baseline: { schemaVersion: 1, kind: 'synthetic-numeric-character-definition', fixtureId: 'baseline', classification: 'unmeasured_synthetic_process_fixture', bodyProfile: { shoulderY: 59, hipY: 116, upperArm: 28, forearm: 28, thigh: 29, shin: 28 }, registrationProfile: { scale: 0.19148936170212766, eastAxisX: 228, westAxisX: 232, floorY: 941, width: 448, height: 1024 } },
  ratio: { schemaVersion: 1, kind: 'synthetic-numeric-character-definition', fixtureId: 'ratio', classification: 'unmeasured_synthetic_process_fixture', bodyProfile: { shoulderY: 59, hipY: 116, upperArm: 24, forearm: 32, thigh: 33, shin: 24 }, registrationProfile: { scale: 0.19148936170212766, eastAxisX: 228, westAxisX: 232, floorY: 941, width: 448, height: 1024 } },
  registration: { schemaVersion: 1, kind: 'synthetic-numeric-character-definition', fixtureId: 'registration', classification: 'unmeasured_synthetic_process_fixture', bodyProfile: { shoulderY: 59, hipY: 116, upperArm: 28, forearm: 28, thigh: 29, shin: 28 }, registrationProfile: { scale: 0.205, eastAxisX: 220, westAxisX: 244, floorY: 970, width: 448, height: 1024 } },
};
const base = JSON.parse(guardedRead(baseRecipePath)); const codeFingerprint = compilerCodeFingerprint(); const compiledRecords = [];
for (const [key, definition] of Object.entries(definitions)) {
  const definitionBytes = Buffer.from(canonicalJson(definition)); const definitionPath = join(root, 'definitions', `${key}-numeric-source.json`); writeOrVerify(definitionPath, definitionBytes); const definitionSha = sha(definitionBytes);
  const recipe = clone(base); recipe.identity = { templateId: `synthetic-binding-${key}`, outputKey: `synthetic-binding-${key}`, displayLabel: `Synthetic binding ${key}`, namePolicy: 'synthetic_test_only' };
  recipe.evidence = [{ field: 'all numeric fitting fields', classification: 'estimated', source: `binding-v2/${key} deterministic synthetic definition`, uncertainty: 'unmeasured process fixture; not patient anatomy or raster evidence' }];
  recipe.lineage = Object.fromEntries(['east', 'west', 'south', 'north'].map(view => [view, { kind: 'independent', sourcePath: relative(repo, definitionPath).replaceAll('\\', '/'), sourceSha256: definitionSha, acceptanceState: 'synthetic_numeric_fixture_unmeasured' }]));
  recipe.donorContract = null;
  if (key === 'ratio') Object.assign(recipe.lateral.segmentLengths, { upperArm: 24, forearm: 32, thigh: 33, shin: 24 });
  if (key === 'registration') for (const view of ['east', 'west']) Object.assign(recipe.lateral.registration[view], { scale: 0.205, sourceAxisX: view === 'east' ? 220 : 244, sourceFloorY: 970 });
  const recipePath = join(root, 'recipes', `${key}.json`); writeOrVerify(recipePath, Buffer.from(canonicalJson(recipe)));
  const outputRoot = assertNoLinkedPath(join(root, 'compiler-outputs'), repo, { mustExist: false }); const result = compileRecipeFile(assertNoLinkedPath(recipePath, repo), { repositoryRoot: repo, outputRoot, codeFingerprint }); const bytes = guardedRead(result.path); compiledRecords.push({ fixtureId: key, definitionPath: relative(repo, definitionPath).replaceAll('\\', '/'), definitionSha256: definitionSha, recipePath: relative(repo, recipePath).replaceAll('\\', '/'), recipeSha256: sha(guardedRead(recipePath)), artifactPath: relative(repo, result.path).replaceAll('\\', '/'), artifactSha256: sha(bytes), dependencyFingerprint: result.dependencyFingerprint, compilerCodeFingerprint: codeFingerprint, targetCount: result.targetCount });
}
const manifest = { schemaVersion: 1, state: 'immutable-synthetic-compiler-artifacts', compilerCodeFingerprint: codeFingerprint, fixtures: compiledRecords }; writeOrVerify(join(root, 'compiler-artifact-manifest.json'), Buffer.from(canonicalJson(manifest))); console.log(JSON.stringify(manifest));
