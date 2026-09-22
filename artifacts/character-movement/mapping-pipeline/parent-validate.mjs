import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { canonicalJson, compileRecipe, compilerCodeFingerprint, runBatchFile } from '../../../tools/character-mapping/compiler.mjs';

const root = resolve(import.meta.dirname, '../../..');
const folder = resolve(root, 'artifacts/character-movement/mapping-pipeline');
const recipeRelative = 'docs/features/character-movement/recipes/patient-01.json';
const manifestRelative = 'docs/features/character-movement/batches/first-existing-four.json';
const readJson = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const hash = path => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
const ownedFiles = [
  'tools/character-mapping/math.mjs', 'tools/character-mapping/compiler.mjs',
  'tools/character-mapping/cli.mjs', 'tools/character-mapping/compiler.test.mjs',
  'tools/character-mapping/README.md', recipeRelative, manifestRelative,
];
const sourceBefore = Object.fromEntries(ownedFiles.map(path => [path, hash(path)]));
let assertions = 0;
const check = (condition, description) => { assertions++; assert.ok(condition, description); };
const equal = (actual, expected, description) => { assertions++; assert.deepEqual(actual, expected, description); };
const near = (actual, expected, allowance, description) => check(Number.isFinite(actual) && Number.isFinite(expected) && Math.abs(actual - expected) <= allowance, `${description}: ${actual} vs ${expected}`);
const dist = (a, b, axes) => Math.hypot(...axes.map(axis => b[axis] - a[axis]));
const recipe = readJson(recipeRelative);
const compiled = compileRecipe(recipe, { repositoryRoot: root });
const lateral = readJson('docs/features/character-movement/patient-01-fit.json');
const vertical = readJson('docs/features/character-movement/patient-01-north-south-fit.json');
let comparedPoints = 0, maxCoordinateDeviation = 0, comparedScalars = 0, maxScalarDeviation = 0, maxRegistrationError = 0;

function compareSharedNumeric(actual, expected, label) {
  if (typeof actual === 'number' && typeof expected === 'number') {
    const difference = Math.abs(actual - expected);
    maxScalarDeviation = Math.max(maxScalarDeviation, difference); comparedScalars++;
    near(actual, expected, 0.0001, label); return;
  }
  if (!actual || !expected || typeof actual !== 'object' || typeof expected !== 'object') return;
  const axes = 'x' in actual && 'y' in actual ? ['x', 'y'] : 'lateral' in actual && 'forward' in actual && 'height' in actual ? ['lateral', 'forward', 'height'] : null;
  if (axes) {
    for (const axis of axes) {
      maxCoordinateDeviation = Math.max(maxCoordinateDeviation, Math.abs(actual[axis] - expected[axis]));
      near(actual[axis], expected[axis], 0.0001, `${label}.${axis}`);
    }
    comparedPoints++; return;
  }
  for (const [key, value] of Object.entries(actual)) if (key in expected) compareSharedNumeric(value, expected[key], `${label}.${key}`);
}

function verifyRegistration(frame, native, registration, label) {
  if (!frame || typeof frame !== 'object') return;
  if (typeof frame.x === 'number' && typeof frame.y === 'number') {
    for (const axis of ['x', 'y']) {
      const sourceAnchor = axis === 'x' ? registration.sourceAxisX : registration.sourceFloorY;
      const frameAnchor = axis === 'x' ? registration.frameAxisX : registration.frameFloorY;
      const projected = (native[axis] - sourceAnchor) * registration.scale + frameAnchor;
      maxRegistrationError = Math.max(maxRegistrationError, Math.abs(projected - frame[axis]));
      near(projected, frame[axis], 0.0001, `${label}.${axis}`);
    }
    return;
  }
  for (const [key, value] of Object.entries(frame)) if (!['nativeMaster', 'registration'].includes(key) && native?.[key] !== undefined) verifyRegistration(value, native[key], registration, `${label}.${key}`);
}

equal(compiled.targets.length, 32, '32 targets');
equal(compiled.outputClass, 'target_only', 'numeric output class');
equal(compiled.status, 'authoring_target_pending_raster_review', 'unaccepted raster status');
equal(compiled.sourceLineageVerification.status, 'declared_not_read_by_numeric_tool', 'image hash declarations distinguished from verification');
const assetViews = { east: 'right', west: 'left', south: 'front', north: 'back' };
const expectedKeys = Object.values(assetViews).flatMap(view => Array.from({ length: 8 }, (_, i) => `${recipe.identity.templateId}:${view}-walk-${i + 1}`)).sort();
equal(compiled.targets.map(target => target.outputKey).sort(), expectedKeys, 'inventory keys');
for (const target of compiled.targets) {
  const sideView = target.view === 'east' || target.view === 'west';
  const reference = (sideView ? lateral : vertical).phases[target.phaseIndex - 1][target.view];
  compareSharedNumeric(target.geometry, reference, target.outputKey);
  equal(target.normalizedCycle, (target.phaseIndex - 1) / 8, 'shared timing');
  equal(target.reviewFrameMilliseconds, 180, 'review cadence');
  equal(target.assetView, assetViews[target.view], 'view vocabulary');
  const geometry = target.geometry;
  const frame = sideView ? geometry : geometry.frame;
  verifyRegistration(frame, geometry.nativeMaster, geometry.registration, target.outputKey);
  const joints = sideView ? geometry.joints : geometry.latent.joints;
  const lengths = sideView ? recipe.lateral.segmentLengths : recipe.northSouth.segmentLengths3D;
  const axes = sideView ? ['x', 'y'] : ['lateral', 'forward', 'height'];
  for (const side of ['left', 'right']) {
    const j = joints[side];
    for (const [a, b, length] of [['hip', 'knee', 'thigh'], ['knee', 'ankle', 'shin'], ['shoulder', 'elbow', 'upperArm'], ['elbow', 'wrist', 'forearm'], ['wrist', 'hand', 'hand']]) near(dist(j[a], j[b], axes), lengths[length], 0.002, `${target.outputKey}.${side}.${length}`);
    const lift = sideView ? j.footLift : j.latentFootLift;
    if (sideView) near(j.shoeContact.y, recipe.lateral.frame.floorY - lift, 0.0001, 'lateral geometric contact');
    else {
      near(j.contact.height, lift, 0.0001, 'latent geometric contact');
      near(frame.joints[side].projectedGround.contact.y - frame.joints[side].contact.y, frame.joints[side].projectedFootLift, 0.0001, 'projection-ground lift');
      equal(j.latentFootLiftUnits, 'latent-frame-authoring-units-upward', 'latent units');
      equal(frame.joints[side].projectedFootLiftUnits, 'frame-pixels-upward', 'frame units');
      equal(geometry.nativeMaster.joints[side].projectedFootLiftUnits, 'source-pixels-upward', 'native units');
    }
  }
  if ([3, 7].includes(target.phaseIndex)) {
    const support = target.phaseIndex === 3 ? 'right' : 'left', passing = support === 'right' ? 'left' : 'right';
    check(joints[support].support, 'explicit support side');
    near(dist(joints[support].hip, joints[support].ankle, axes), lengths.thigh + lengths.shin, 0.003, 'straight supporting leg');
    check(dist(joints[passing].hip, joints[passing].ankle, axes) < lengths.thigh + lengths.shin - 0.1, 'passing knee remains bent');
  }
}
check(comparedPoints > 2000, 'all frame, native and latent reference point blocks covered');

// Reproduce the parent-discovered valid-zero and sole-bound edge cases, with
// values chosen so the former incorrect all-points padding would fail/pass
// in the opposite way. These are numeric boundary fixtures, not real bodies.
const zeroFoot = structuredClone(recipe);
for (const key of ['contactForwardOffset', 'liftedHeelRise', 'liftedToeRise']) zeroFoot.northSouth.foot[key] = 0;
equal(compileRecipe(zeroFoot, { repositoryRoot: root }).targets.length, 32, 'all permitted zero foot fields compile');
const wideHead = structuredClone(recipe); wideHead.northSouth.body.headRadiusLateral = 60;
equal(compileRecipe(wideHead, { repositoryRoot: root }).targets.length, 32, 'head has four frame pixels of clearance independent of shoe width');
const wideHeel = structuredClone(recipe);
wideHeel.northSouth.projection.lateralScale = 2;
wideHeel.northSouth.foot.heelHalfWidth = 23;
wideHeel.northSouth.foot.toeHalfWidth = 4;
assertions++;
assert.throws(() => compileRecipe(wideHeel, { repositoryRoot: root }), /heel sole outside/, 'projected heel edge must fit, even with a narrow toe');

// An invalid JSON payload behind a directory link distinguishes rejection
// before the batch's initial identity read from rejection only during compile.
const linkedFixture = mkdtempSync(resolve(folder, 'parent-linked-input-'));
const fixtureRepository = resolve(linkedFixture, 'fixture-repository');
const fixtureExternal = resolve(linkedFixture, 'outside-selected-repository');
mkdirSync(fixtureRepository); mkdirSync(fixtureExternal);
writeFileSync(resolve(fixtureExternal, 'recipe.json'), 'deliberately invalid JSON\n');
const fixtureLink = resolve(fixtureRepository, 'linked');
symlinkSync(fixtureExternal, fixtureLink, process.platform === 'win32' ? 'junction' : 'dir');
const fixtureManifest = resolve(fixtureRepository, 'batch.json');
writeFileSync(fixtureManifest, JSON.stringify({ batchKey: 'parent-early-read', members: [{ identityKey: 'synthetic-parent', outputKey: 'synthetic-parent', status: 'ready', recipe: 'linked/recipe.json' }] }));
try {
  assertions++;
  assert.throws(() => runBatchFile(fixtureManifest, { repositoryRoot: fixtureRepository, outputRoot: resolve(linkedFixture, 'out'), codeFingerprint: 'parent-early-read' }), /symbolic link or junction/, 'batch rejects a linked recipe before its initial read');
} finally { unlinkSync(fixtureLink); }

// Whole-body enlargement exercises actual dimensions, including registration,
// while retaining the same native source proportions and motion semantics.
const enlarged = structuredClone(recipe), factor = 1.1;
enlarged.identity = { ...recipe.identity, templateId: 'synthetic-parent-enlarged', outputKey: 'synthetic-parent-enlarged' };
const scaleGroup = object => { for (const key of Object.keys(object)) if (typeof object[key] === 'number') object[key] *= factor; };
for (const key of ['frame', 'centers', 'envelope', 'segmentLengths', 'foot', 'motion']) scaleGroup(enlarged.lateral[key]);
for (const key of ['frame', 'segmentLengths3D', 'body', 'foot', 'motion']) scaleGroup(enlarged.northSouth[key]);
enlarged.northSouth.lanes.hipHalfWidth *= factor;
for (const rig of [enlarged.lateral, enlarged.northSouth]) for (const registration of Object.values(rig.registration)) registration.scale *= factor;
const enlargedOutput = compileRecipe(enlarged, { repositoryRoot: root });
equal(enlargedOutput.targets.length, 32, 'complete enlarged recipe compiles');
for (const target of enlargedOutput.targets) {
  const sideView = ['east', 'west'].includes(target.view);
  const original = compiled.targets.find(item => item.view === target.view && item.phaseIndex === target.phaseIndex);
  const head = sideView ? target.geometry.headEnvelope : target.geometry.frame.body.headEnvelope;
  const oldHead = sideView ? original.geometry.headEnvelope : original.geometry.frame.body.headEnvelope;
  near(head.radiusX, oldHead.radiusX * factor, 0.0001, 'scaled head width');
  const lengths = target.anatomy.segmentLengths;
  near(lengths.thigh, original.anatomy.segmentLengths.thigh * factor, 0.0001, 'scaled anatomical lengths');
  check(canonicalJson(target.geometry) !== canonicalJson(original.geometry), 'new geometry, not renamed Patient 01');
}

const testRun = spawnSync(process.execPath, ['--test', 'tools/character-mapping/compiler.test.mjs'], { cwd: root, encoding: 'utf8', timeout: 60000 });
writeFileSync(resolve(folder, 'parent-tests.tap'), testRun.stdout + testRun.stderr);
equal(testRun.status, 0, 'focused worker regression suite independently executed');

const cliResults = [];
function cli(args, expectedStatus = 0) {
  const result = spawnSync(process.execPath, ['tools/character-mapping/cli.mjs', ...args], { cwd: root, encoding: 'utf8', timeout: 60000 });
  equal(result.status, expectedStatus, `CLI ${args.join(' ')}`);
  const parsed = JSON.parse(expectedStatus === 0 ? result.stdout : result.stderr);
  cliResults.push({ args, status: result.status, response: parsed });
  return parsed;
}
const outputRoot = 'parent-runs';
const first = cli(['compile', '--recipe', recipeRelative, '--output-root', outputRoot]);
const repeated = cli(['compile', '--recipe', recipeRelative, '--output-root', outputRoot]);
equal(repeated.result.disposition, 'reused', 'CLI reuse');
equal(first.result.dependencyFingerprint, repeated.result.dependencyFingerprint, 'stable target fingerprint');
cli(['check', '--recipe', recipeRelative, '--output-root', outputRoot]);
const batch1 = cli(['batch', '--manifest', manifestRelative, '--output-root', outputRoot]);
const bytes1 = readFileSync(batch1.result.path, 'utf8');
const batch2 = cli(['batch', '--manifest', manifestRelative, '--output-root', outputRoot]);
equal(batch1.result.fingerprint, batch2.result.fingerprint, 'stable batch fingerprint');
equal(readFileSync(batch2.result.path, 'utf8'), bytes1, 'byte-identical batch rerun');
equal(batch1.result.counts, { selected: 4, compiled: 1, pending: 3, targets: 32 }, 'existing four states');
const selected = cli(['batch', '--manifest', manifestRelative, '--member', recipe.identity.templateId, '--output-root', outputRoot]);
equal(selected.result.counts, { selected: 1, compiled: 1, pending: 0, targets: 32 }, 'selected member only');
cli(['batch', '--manifest', manifestRelative, '--memberr', recipe.identity.templateId, '--output-root', outputRoot], 1);
cli(['compile', '--recipe', recipeRelative, '--output-root', '../escape'], 1);

const preservation = readJson('artifacts/character-movement/mapping-pipeline/parent-baseline.json').files.map(item => ({ ...item, actualSha256: hash(item.path) }));
for (const item of preservation) equal(item.actualSha256, item.sha256, `preserved ${item.path}`);
for (const [path, before] of Object.entries(sourceBefore)) equal(hash(path), before, `frozen source ${path}`);
const report = {
  scope: 'GS-012 MOV-006 M7A independent numeric/tool review only',
  status: 'passed', at: new Date().toISOString(), assertions,
  referenceRegression: { targets: 32, comparedPoints, comparedScalars, maxCoordinateDeviation, maxScalarDeviation, numericalAllowance: 0.0001, note: 'Numerical publication-rounding allowance, not raster tolerance.' },
  registration: { maxFrameRoundTripError: maxRegistrationError, framePixelAllowance: 0.0001 },
  changedAnatomy: { wholeBodyScale: factor, targets: enlargedOutput.targets.length, synthetic: true },
  regressionSuite: { status: testRun.status, stdoutPath: 'artifacts/character-movement/mapping-pipeline/parent-tests.tap' },
  compilerCodeFingerprint: compilerCodeFingerprint(), sourceHashes: sourceBefore,
  validatedTarget: { path: relative(root, first.result.path).split(sep).join('/'), dependencyFingerprint: first.result.dependencyFingerprint, sha256: hash(first.result.path) },
  validatedBatch: { path: relative(root, batch1.result.path).split(sep).join('/'), fingerprint: batch1.result.fingerprint, sha256: hash(batch1.result.path), counts: batch1.result.counts },
  cliResults, preservation,
  limitations: ['Numeric-only; no private raster files were read or processed.', 'Synthetic processing capacity does not measure manual or raster production effort.', 'Actual donor/compositor art proof and owner appearance acceptance remain pending GS-010.', 'No game build/server/browser/save/runtime operation performed.'],
};
writeFileSync(resolve(folder, 'parent-review.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, assertions, referenceRegression: report.referenceRegression, registration: report.registration, validatedTarget: report.validatedTarget, batchCounts: batch1.result.counts, preservation: preservation.length }, null, 2));
