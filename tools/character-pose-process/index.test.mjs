import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import {
  appendLedger, appendLedgerFile, deriveTransform, emitProceduralGraph, emptyLedger,
  numericDefinitionHash, roundPlacement, validateGraph, validateLedger, validateRecipe,
  writeExclusiveJson,
} from './index.mjs';

const repo = resolve(import.meta.dirname, '../..');
const proof = join(repo, 'Photos for Codex 2', 'Codex Patients or Staff or Other Characters 2', 'mixed-batch-2026-09-10', 'pose-process-proof-v1');
const recipePath = join(proof, 'fixture-recipe.json');
const schemaPath = join(proof, 'parent-evidence', 'node-schemas.json');
const cliPath = join(import.meta.dirname, 'cli.mjs');
const recipe = () => JSON.parse(readFileSync(recipePath, 'utf8'));
const schema = () => JSON.parse(readFileSync(schemaPath, 'utf8'));
const clone = value => structuredClone(value);

function withTaskTemp(run) {
  const root = resolve(tmpdir());
  const directory = mkdtempSync(join(root, 'character-pose-process-test-'));
  assert.ok(resolve(directory).startsWith(`${root}${sep}`), 'generated temp directory escaped the task-specific temp root');
  try { return run(directory); } finally { rmSync(directory, { recursive: true, force: true }); }
}

function event(id = 'proposal-001') {
  return {
    id, type: 'proposal', status: 'unexecuted', jobId: null,
    occurredAt: '2026-09-10T12:00:00.000Z',
    actualDurationsMs: { queue: null, execution: null, download: null },
    operatorIntervals: [], correction: null,
    outputs: [{ label: 'composite', nodeId: null, sha256: null, reviewState: 'not-produced' }],
    pieceUse: [], notes: 'Synthetic fixture proposal; no job or output exists.',
  };
}

test('fixture validates and canonical numeric hashes are definition hashes', () => {
  const value = recipe();
  assert.equal(validateRecipe(value), true);
  for (const piece of value.pieces) assert.equal(piece.sourceHash, numericDefinitionHash(piece.source));
});

test('graph is deterministic, procedural, nonblank, schema-valid, and has both declared saves', () => {
  const first = emitProceduralGraph(recipe(), schema());
  const second = emitProceduralGraph(recipe(), schema());
  assert.deepEqual(first, second);
  assert.equal(validateGraph(first.graph, schema()), true);
  assert.ok(Object.values(first.graph).filter(node => node.class_type === 'AddLayer').length > first.transforms.length);
  assert.deepEqual(first.outputs.map(output => output.role), ['composite-image', 'transparency-mask-as-image']);
  assert.equal(first.compositorOutputs.maskConvention, '1=transparent');
  assert.ok(Object.values(first.graph).every(node => !['LoadImage', 'CheckpointLoaderSimple'].includes(node.class_type)));
});

test('all seven probe transforms reach graph AddLayer values and alpha polarities are distinct', () => {
  const document = emitProceduralGraph(recipe(), schema());
  assert.deepEqual(new Set(document.transforms.map(item => item.probeCase)), new Set(['control', 'positive-rotation', 'negative-rotation', 'signed-clipping', 'noncentral-pivot', 'alpha-opaque', 'alpha-transparent']));
  for (const transform of document.transforms) {
    const layer = Object.values(document.graph).find(node => node.class_type === 'AddLayer' && node.inputs.name === transform.targetId);
    assert.equal(layer.inputs.x, transform.quantizedPlacement.x);
    assert.equal(layer.inputs.y, transform.quantizedPlacement.y);
    assert.equal(layer.inputs.rotation, transform.floatTransform.rotationDegrees);
  }
  assert.ok(document.transforms.find(item => item.probeCase === 'signed-clipping').quantizedPlacement.x < 0);
  assert.ok(document.transforms.find(item => item.probeCase === 'positive-rotation').floatTransform.rotationDegrees > 0);
  assert.ok(document.transforms.find(item => item.probeCase === 'negative-rotation').floatTransform.rotationDegrees < 0);
  const transparentPiece = recipe().pieces.find(piece => piece.id === 'piece-alpha-transparent');
  assert.ok(transparentPiece.source.primitives.every(primitive => primitive.transparency === 1));
});

test('changed target changes placement and rotation without changing source scale', () => {
  const original = recipe(); const changed = clone(original);
  const target = changed.targets.find(item => item.probeCase === 'control');
  target.proximal = { x: 90, y: 130 }; target.distal = { x: 110, y: 164.64101615137756 };
  target.directTransform = deriveTransform(changed.pieces.find(piece => piece.id === target.pieceId), target);
  const a = emitProceduralGraph(original, schema()).transforms.find(item => item.probeCase === 'control');
  const b = emitProceduralGraph(changed, schema()).transforms.find(item => item.probeCase === 'control');
  assert.notDeepEqual(a.quantizedPlacement, b.quantizedPlacement); assert.notEqual(a.floatTransform.rotationDegrees, b.floatTransform.rotationDegrees);
  assert.deepEqual(original.pieces[0].crop, changed.pieces[0].crop);
});

test('rounding is floor(value+0.5), including negative ties', () => {
  assert.equal(roundPlacement(1.49), 1); assert.equal(roundPlacement(1.5), 2); assert.equal(roundPlacement(-0.5), 0); assert.equal(roundPlacement(-0.51), -1);
});

test('recipe rejects private refs nested anywhere, unknown fields, units drift, unsafe outputs, and mismatched hashes', () => {
  const privateValue = recipe(); privateValue.pieces[0].source.residentRef = 'resident:asset'; assert.throws(() => validateRecipe(privateValue), /private\/resident/);
  const unknown = recipe(); unknown.targets[0].surprise = 1; assert.throws(() => validateRecipe(unknown), /unknown field/);
  const units = recipe(); units.coordinateSystem.coordinates = 'frame-pixels'; assert.throws(() => validateRecipe(units), /coordinate system/);
  const unsafe = recipe(); unsafe.output.compositePrefix = '../escape'; assert.throws(() => validateRecipe(unsafe), /unsafe/);
  const hash = recipe(); hash.pieces[0].sourceHash = '0'.repeat(64); assert.throws(() => validateRecipe(hash), /hash mismatch/);
});

test('recipe rejects nonfinite data, duplicate ids, empty inputs, unknown pieces, and rescaling', () => {
  const nonfinite = recipe(); nonfinite.targets[0].proximal.x = NaN; assert.throws(() => validateRecipe(nonfinite), /finite/);
  const duplicate = recipe(); duplicate.pieces[1].id = duplicate.pieces[0].id; assert.throws(() => validateRecipe(duplicate), /duplicate piece/);
  const empty = recipe(); empty.targets = []; assert.throws(() => validateRecipe(empty), /nonempty/);
  const unknown = recipe(); unknown.targets[0].pieceId = 'missing-piece'; assert.throws(() => validateRecipe(unknown), /unknown/);
  const scale = recipe(); scale.targets[0].distal.y += 1; assert.throws(() => validateRecipe(scale), /does not rescale|changes segment length/);
});

test('recipe rejects inconsistent direct transform', () => {
  const value = recipe(); value.targets[0].directTransform.rotationDegrees = 4;
  assert.throws(() => validateRecipe(value), /inconsistent/);
});

test('recipe rejects unsupported source offsets and inconsistent synthetic phase identity', () => {
  const offset = recipe(); offset.pieces[0].sourceOffset.x = 1; assert.throws(() => validateRecipe(offset), /sourceOffset must be exactly zero/);
  const phaseId = recipe(); phaseId.targets[0].phaseRecord.phaseId = '99'; assert.throws(() => validateRecipe(phaseId), /phaseId\/index mismatch/);
  const cycle = recipe(); cycle.targets[0].phaseRecord.normalizedCycle = 0.95; assert.throws(() => validateRecipe(cycle), /inconsistent/);
  const view = recipe(); view.targets[0].phaseRecord.view = 'east'; assert.throws(() => validateRecipe(view), /must be synthetic/);
  const key = recipe(); key.targets[0].phaseRecord.outputKey = 'production:asset'; assert.throws(() => validateRecipe(key), /outputKey\/probeCase mismatch/);
});

test('graph validator rejects arbitrary classes, bad sockets, ranges, and unsafe save path', () => {
  const base = emitProceduralGraph(recipe(), schema()).graph;
  const arbitrary = clone(base); arbitrary['1'].class_type = 'LoadImage'; assert.throws(() => validateGraph(arbitrary, schema()), /not whitelisted/);
  const badSocket = clone(base); const maskNode = Object.values(badSocket).find(node => node.class_type === 'MaskToImage'); maskNode.inputs.mask[1] = 9; assert.throws(() => validateGraph(badSocket, schema()), /invalid socket/);
  const range = clone(base); const layer = Object.values(range).find(node => node.class_type === 'AddLayer'); layer.inputs.rotation = 361; assert.throws(() => validateGraph(range, schema()), /outside schema range/);
  const unsafe = clone(base); const save = Object.values(unsafe).find(node => node.class_type === 'SaveImage'); save.inputs.filename_prefix = 'other/output'; assert.throws(() => validateGraph(unsafe, schema()), /unsafe SaveImage/);
});

test('graph validator rejects literal sockets, nested private compositor data, malformed canvas boxes, and cycles', () => {
  const base = emitProceduralGraph(recipe(), schema()).graph;
  const literalImage = clone(base); const layer = Object.values(literalImage).find(node => node.class_type === 'AddLayer'); layer.inputs.image = 'resident:asset'; assert.throws(() => validateGraph(literalImage, schema()), /private\/resident|socket reference/);
  const nested = clone(base); const compositor = Object.values(nested).find(node => node.class_type === 'ImageCompositor'); compositor.inputs.compositor = { privateRef: 'resident:asset' }; assert.throws(() => validateGraph(nested, schema()), /private\/resident/);
  const boxes = clone(base); const canvas = Object.values(boxes).find(node => node.class_type === 'LayersFromBoundingBoxes'); canvas.inputs.bboxes = '[{"bbox":[0,0,2,2],"metadata":{"name":"fixed-transparent-document","z_index":-1000}}]'; assert.throws(() => validateGraph(boxes, schema()), /base definition/);
  const alternate = clone(base); const document = Object.values(alternate).find(node => node.class_type === 'LayersFromBoundingBoxes' && node.inputs.canvas_width === 448); document.inputs.canvas_width = 449; assert.throws(() => validateGraph(alternate, schema()), /448x1024/);
  const cycle = clone(base); const add = Object.entries(cycle).find(([, node]) => node.class_type === 'AddLayer'); add[1].inputs.layers = [add[0], 0]; assert.throws(() => validateGraph(cycle, schema()), /cycle/);
});

test('empty ledger is self-validating and append computes only recorded metrics', () => {
  let ledger = emptyLedger(); assert.equal(validateLedger(ledger), true);
  const first = event();
  first.type = 'execution'; first.status = 'succeeded'; first.jobId = 'mock-job-001';
  first.actualDurationsMs.execution = 58225;
  first.outputs = [{ label: 'mock-output', nodeId: '83', sha256: 'b'.repeat(64), reviewState: 'unreviewed' }];
  first.operatorIntervals = [{ actor: 'mock-operator', type: 'preparation', source: 'mock-stopwatch', startedAt: '2026-09-10T12:00:00.000Z', endedAt: '2026-09-10T12:01:30.000Z' }];
  first.pieceUse = [{ pieceId: 'piece-control', sourceHash: recipe().pieces[0].sourceHash, sourceHashKind: 'canonical-numeric-definition-sha256', useCount: 1, reusedFromEventId: null }];
  ledger = appendLedger(ledger, first);
  const second = event('review-001'); second.type = 'review'; second.status = 'reviewed'; second.occurredAt = '2026-09-10T12:03:00.000Z'; second.outputs = [{ label: 'fixture-proof', nodeId: '10', sha256: 'a'.repeat(64), reviewState: 'candidate' }]; second.operatorIntervals = [{ actor: 'mock-reviewer', type: 'review', source: 'mock-stopwatch', startedAt: '2026-09-10T12:03:00.000Z', endedAt: '2026-09-10T12:04:00.000Z' }]; second.pieceUse = [{ pieceId: 'piece-control', sourceHash: recipe().pieces[0].sourceHash, sourceHashKind: 'canonical-numeric-definition-sha256', useCount: 2, reusedFromEventId: 'proposal-001' }];
  ledger = appendLedger(ledger, second); assert.equal(validateLedger(ledger), true);
  assert.deepEqual(ledger.summary.measuredDurationCounts, { queue: 0, execution: 1, download: 0 });
  assert.equal(ledger.summary.measuredDurationTotalsMs.execution, 58225); assert.equal(ledger.summary.operatorPreparationMs, 90000); assert.equal(ledger.summary.operatorReviewMs, 60000); assert.equal(ledger.summary.reusedPieceUses, 0);
});

test('reuse totals count only successful execution use and duplicate job timing categories are rejected', () => {
  const first = event(); first.type = 'execution'; first.status = 'succeeded'; first.jobId = 'job-001'; first.outputs = [{ label: 'output', nodeId: '83', sha256: 'a'.repeat(64), reviewState: 'candidate' }]; first.actualDurationsMs.execution = 100; first.pieceUse = [{ pieceId: 'piece-control', sourceHash: recipe().pieces[0].sourceHash, sourceHashKind: 'canonical-numeric-definition-sha256', useCount: 1, reusedFromEventId: null }];
  let ledger = appendLedger(emptyLedger(), first);
  const second = clone(first); second.id = 'execution-002'; second.occurredAt = '2026-09-10T12:01:00.000Z'; second.jobId = 'job-002'; second.actualDurationsMs.execution = 110; second.pieceUse[0].useCount = 2; second.pieceUse[0].reusedFromEventId = 'proposal-001';
  ledger = appendLedger(ledger, second); assert.equal(ledger.summary.reusedPieceUses, 2); assert.equal(ledger.summary.distinctPieces, 1);
  const duplicateTiming = event('download-001'); duplicateTiming.type = 'download'; duplicateTiming.status = 'succeeded'; duplicateTiming.jobId = 'job-002'; duplicateTiming.occurredAt = '2026-09-10T12:02:00.000Z'; duplicateTiming.actualDurationsMs.execution = 1; duplicateTiming.outputs = [{ label: 'output', nodeId: '83', sha256: 'b'.repeat(64), reviewState: 'candidate' }];
  assert.throws(() => appendLedger(ledger, duplicateTiming), /duplicate execution timing/);
});

test('ledger rejects NaN/fractional metrics, impossible intervals, invalid parents, duplicates, and dishonest completed outputs', () => {
  const nan = event(); nan.actualDurationsMs.queue = NaN; assert.throws(() => appendLedger(emptyLedger(), nan), /integer/);
  const fractional = event(); fractional.pieceUse = [{ pieceId: 'piece-control', sourceHash: 'a'.repeat(64), sourceHashKind: 'fixture', useCount: 1.5, reusedFromEventId: null }]; assert.throws(() => appendLedger(emptyLedger(), fractional), /integer/);
  const backwards = event(); backwards.operatorIntervals = [{ actor: 'x', type: 'review', source: 'clock', startedAt: '2026-09-10T12:01:00Z', endedAt: '2026-09-10T12:00:00Z' }]; assert.throws(() => appendLedger(emptyLedger(), backwards), /before/);
  const correction = event(); correction.type = 'correction'; correction.correction = { parentEventId: 'absent', reason: 'test' }; assert.throws(() => appendLedger(emptyLedger(), correction), /does not exist/);
  const one = appendLedger(emptyLedger(), event()); assert.throws(() => appendLedger(one, event()), /duplicate/);
  const dishonest = event(); dishonest.status = 'succeeded'; dishonest.outputs[0].reviewState = 'candidate'; assert.throws(() => appendLedger(emptyLedger(), dishonest), /jobId/);
});

test('durable ledger append reads current state and refuses stale, duplicate, and locked writes', () => {
  withTaskTemp(dir => { const path = join(dir, 'ledger.json'); const initial = emptyLedger(); writeExclusiveJson(path, initial);
    const next = appendLedgerFile(path, event(), { expectedRevision: 0, expectedSha256: initial.stateSha256 }); assert.equal(next.revision, 1);
    assert.throws(() => appendLedgerFile(path, event('proposal-002'), { expectedRevision: 0, expectedSha256: initial.stateSha256 }), /stale/);
    assert.throws(() => appendLedgerFile(path, event(), { expectedRevision: 1, expectedSha256: next.stateSha256 }), /duplicate/);
    writeFileSync(`${path}.lock`, 'occupied'); assert.throws(() => appendLedgerFile(path, event('proposal-003'), { expectedRevision: 1, expectedSha256: next.stateSha256 }), /EEXIST/);
  });
});

test('CLI emits exclusively and rejects embedded stale ledger input', () => {
  withTaskTemp(dir => { const graph = join(dir, 'graph.json');
    execFileSync(process.execPath, [cliPath, 'emit', '--recipe', recipePath, '--schema', schemaPath, '--output', graph]);
    assert.throws(() => execFileSync(process.execPath, [cliPath, 'emit', '--recipe', recipePath, '--schema', schemaPath, '--output', graph], { stdio: 'pipe' }));
    const ledgerPath = join(dir, 'ledger.json'); execFileSync(process.execPath, [cliPath, 'ledger-init', '--output', ledgerPath]);
    const envelope = join(dir, 'bad-event.json'); writeFileSync(envelope, JSON.stringify({ ledger: emptyLedger(), event: event() }));
    assert.throws(() => execFileSync(process.execPath, [cliPath, 'ledger-append', '--ledger', ledgerPath, '--event', envelope, '--expected-revision', '0', '--expected-sha', emptyLedger().stateSha256], { stdio: 'pipe' }));
    assert.equal(JSON.parse(readFileSync(ledgerPath)).revision, 0);
  });
});

test('CLI rejects unknown flags, duplicate flags, and extra positionals', () => {
  assert.throws(() => execFileSync(process.execPath, [cliPath, 'validate-recipe', '--recipe', recipePath, '--schema', schemaPath, '--typo', 'x'], { stdio: 'pipe' }));
  assert.throws(() => execFileSync(process.execPath, [cliPath, 'validate-recipe', '--recipe', recipePath, '--recipe', recipePath, '--schema', schemaPath], { stdio: 'pipe' }));
  assert.throws(() => execFileSync(process.execPath, [cliPath, 'validate-recipe', 'extra', '--recipe', recipePath, '--schema', schemaPath], { stdio: 'pipe' }));
});
