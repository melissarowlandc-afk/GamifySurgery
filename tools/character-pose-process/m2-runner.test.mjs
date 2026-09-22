import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { ALLOWED_CLASSES, appendLedger, emptyLedger, writeExclusiveJson } from './index.mjs';
import {
  assertFreshSubmission, buildCompletionEvent, CLIENT_ID, ENDPOINT, loadResumeReceipt,
  preflightLive, PROPOSAL_PATH, RECIPE_PATH, SAVE_OUTPUTS, SCHEMA_PATH,
  validateHistoryEnvelope, validateOffline, validatePinnedArtifacts,
  validatePinnedDocuments,
} from './m2-runner-lib.mjs';

function withTaskTemp(run) {
  const root = resolve(tmpdir()); const directory = mkdtempSync(join(root, 'character-pose-m2-test-'));
  assert.ok(resolve(directory).startsWith(`${root}${sep}`));
  try { return run(directory); } finally { rmSync(directory, { recursive: true, force: true }); }
}
const sha256 = value => createHash('sha256').update(value).digest('hex');

function successfulHistory(promptId, proposal) {
  return {
    [promptId]: {
      prompt: [1, promptId, structuredClone(proposal.graph), { client_id: CLIENT_ID }, ['83', '84']],
      outputs: {
        '81': { images: [{ filename: 'intermediate.png', subfolder: '', type: 'temp' }] },
        '83': { images: [{ filename: 'compositor-probe_00001_.png', subfolder: 'synthetic/pose-process-proof-v1', type: 'output' }] },
        '84': { images: [{ filename: 'transparency-probe_00001_.png', subfolder: 'synthetic/pose-process-proof-v1', type: 'output' }] },
      },
      status: { status_str: 'success', completed: true, messages: [['execution_start', { timestamp: 1000 }], ['execution_success', { timestamp: 1321 }]] },
    },
  };
}

test('validate-only pins endpoint, hashes, node count, classes, outputs and makes no fetch call', () => {
  let fetchCalls = 0; const previous = globalThis.fetch; globalThis.fetch = () => { fetchCalls++; throw new Error('network forbidden'); };
  try {
    const result = validateOffline(); assert.equal(result.endpoint, ENDPOINT); assert.equal(result.nodeCount, 84); assert.deepEqual(result.saveOutputNodeIds, ['83', '84']); assert.equal(fetchCalls, 0);
  } finally { globalThis.fetch = previous; }
});

test('pinned document validation rejects changed proposal and schema bytes', () => {
  const recipe = JSON.parse(readFileSync(RECIPE_PATH)); const proposalBytes = readFileSync(PROPOSAL_PATH); const schemaBytes = readFileSync(SCHEMA_PATH);
  assert.throws(() => validatePinnedDocuments({ proposalBytes: Buffer.concat([proposalBytes, Buffer.from(' ')]), schemaBytes, recipe }), /proposal byte SHA/);
  assert.throws(() => validatePinnedDocuments({ proposalBytes, schemaBytes: Buffer.concat([schemaBytes, Buffer.from(' ')]), recipe }), /schema byte SHA/);
});

test('live preflight requests only seven pinned node schemas and queue, with no mutation', async () => {
  const { schema } = validatePinnedArtifacts(); const seen = [];
  const mockFetch = async (url, options) => {
    seen.push({ path: url.pathname, method: options.method ?? 'GET' });
    if (url.pathname === '/queue') return new Response(JSON.stringify({ queue_running: [], queue_pending: [] }), { status: 200 });
    const classType = decodeURIComponent(url.pathname.slice('/object_info/'.length));
    return new Response(JSON.stringify({ [classType]: schema.schemas[classType] }), { status: 200 });
  };
  const result = await preflightLive(mockFetch); assert.deepEqual(result.queueCounts, { running: 0, pending: 0 });
  assert.equal(seen.length, ALLOWED_CLASSES.length + 1); assert.ok(seen.every(call => call.method === 'GET')); assert.ok(seen.every(call => call.path === '/queue' || call.path.startsWith('/object_info/')));
});

test('fresh submission guard rejects any prior request, attempt, receipt or durable event', () => withTaskTemp(directory => {
  writeExclusiveJson(join(directory, 'ledger.json'), emptyLedger()); assert.doesNotThrow(() => assertFreshSubmission(directory));
  writeFileSync(join(directory, 'attempt.json'), '{}'); assert.throws(() => assertFreshSubmission(directory), /never auto-resubmit/);
}));

test('resume refuses an unresolved attempt without an own receipt', () => withTaskTemp(directory => {
  writeFileSync(join(directory, 'attempt.json'), '{}'); assert.throws(() => loadResumeReceipt(directory), /unresolved submission attempt/);
}));

function writeResumeEvidence(directory, { requestClientId = CLIENT_ID, rawPromptId = 'own-prompt-001' } = {}) {
  const { proposal } = validatePinnedArtifacts(); const requestText = JSON.stringify({ prompt: proposal.graph, client_id: requestClientId });
  writeFileSync(join(directory, 'request-body.json'), requestText);
  writeFileSync(join(directory, 'attempt.json'), JSON.stringify({ runId: 'm2-run-001', endpoint: ENDPOINT, clientId: CLIENT_ID, proposalSha256: 'e2585246c2cdd59e615afff998002e5ddb0c2e5d452b85f1614f98350a96f1ba', schemaSha256: '3617e7c67f799dc4f223a3b5e1a5a926f87f2cb2d48da1a12a7f69192c3e217a', requestSha256: sha256(requestText), createdAt: '2026-09-10T12:00:00Z', preflight: { usedNodeNames: ALLOWED_CLASSES, queueCounts: { running: 0, pending: 0 } } }));
  const rawResponseText = JSON.stringify({ prompt_id: rawPromptId, number: 1, node_errors: {} });
  writeFileSync(join(directory, 'receipt.json'), JSON.stringify({ runId: 'm2-run-001', endpoint: ENDPOINT, clientId: CLIENT_ID, promptId: 'own-prompt-001', receivedAt: '2026-09-10T12:00:01Z', httpStatus: 200, rawResponseSha256: sha256(rawResponseText), rawResponseText }));
}

test('resume binds preserved request and raw receipt to pinned graph, own client and own prompt', () => {
  withTaskTemp(directory => { writeResumeEvidence(directory); assert.equal(loadResumeReceipt(directory).receipt.promptId, 'own-prompt-001'); });
  withTaskTemp(directory => { writeResumeEvidence(directory, { requestClientId: 'rewritten-client' }); assert.throws(() => loadResumeReceipt(directory), /pinned graph and own client/); });
  withTaskTemp(directory => { writeResumeEvidence(directory, { rawPromptId: 'other-prompt' }); assert.throws(() => loadResumeReceipt(directory), /raw receipt does not match/); });
});

test('successful history accepts only own graph and exact declared saves, and derives execution time', () => {
  const { proposal } = validatePinnedArtifacts(); const promptId = 'own-prompt-001'; const result = validateHistoryEnvelope(successfulHistory(promptId, proposal), promptId, proposal);
  assert.equal(result.completed, true); assert.equal(result.executionDurationMs, 321); assert.deepEqual(Object.keys(result.declared), Object.keys(SAVE_OUTPUTS));
  const windows = successfulHistory(promptId, proposal); windows[promptId].outputs['83'].images[0].subfolder = 'synthetic\\pose-process-proof-v1'; windows[promptId].outputs['84'].images[0].subfolder = 'synthetic\\pose-process-proof-v1'; assert.equal(validateHistoryEnvelope(windows, promptId, proposal).completed, true);
});

test('history rejects changed graph, unexpected output node, duplicate declared image, wrong destination and impossible interval', () => {
  const { proposal } = validatePinnedArtifacts(); const promptId = 'own-prompt-001';
  const changed = successfulHistory(promptId, proposal); changed[promptId].prompt[2]['1'].inputs.color = 4; assert.throws(() => validateHistoryEnvelope(changed, promptId, proposal), /graph differs/);
  const extra = successfulHistory(promptId, proposal); extra[promptId].outputs['7'] = { images: [] }; assert.throws(() => validateHistoryEnvelope(extra, promptId, proposal), /unexpected history output/);
  const duplicate = successfulHistory(promptId, proposal); duplicate[promptId].outputs['83'].images.push(duplicate[promptId].outputs['83'].images[0]); assert.throws(() => validateHistoryEnvelope(duplicate, promptId, proposal), /exactly one image/);
  const destination = successfulHistory(promptId, proposal); destination[promptId].outputs['84'].images[0].subfolder = 'other'; assert.throws(() => validateHistoryEnvelope(destination, promptId, proposal), /unexpected destination/);
  const interval = successfulHistory(promptId, proposal); interval[promptId].status.messages[1][1].timestamp = 999; assert.throws(() => validateHistoryEnvelope(interval, promptId, proposal), /interval/);
  const tupleId = successfulHistory(promptId, proposal); tupleId[promptId].prompt[1] = 'other'; assert.throws(() => validateHistoryEnvelope(tupleId, promptId, proposal), /prompt tuple/);
  const tupleClient = successfulHistory(promptId, proposal); tupleClient[promptId].prompt[3].client_id = 'other'; assert.throws(() => validateHistoryEnvelope(tupleClient, promptId, proposal), /prompt tuple/);
});

test('completion event uses locally observed order while preserving skewed server execution values separately', () => {
  const { proposal } = validatePinnedArtifacts();
  const history = { executionDurationMs: 4, executionStartedAtEpochMs: 1, executionSucceededAtEpochMs: 5 };
  const downloads = { '83': { sha256: 'a'.repeat(64) }, '84': { sha256: 'b'.repeat(64) } };
  const completion = buildCompletionEvent({ promptId: 'own-prompt-001', history, downloads, downloadDurationMs: 2, observedCompletionAt: '2026-09-10T12:00:02.000Z', proposal });
  assert.equal(completion.occurredAt, '2026-09-10T12:00:02.000Z'); assert.equal(completion.actualDurationsMs.execution, 4);
  const submission = { id: 'm2-submission-001', type: 'submission', status: 'submitted', jobId: 'own-prompt-001', occurredAt: '2026-09-10T12:00:01.000Z', actualDurationsMs: { queue: null, execution: null, download: null }, operatorIntervals: [], correction: null, outputs: Object.entries(SAVE_OUTPUTS).map(([nodeId, value]) => ({ label: value.label, nodeId, sha256: null, reviewState: 'not-produced' })), pieceUse: [], notes: 'mock submission' };
  assert.doesNotThrow(() => appendLedger(appendLedger(emptyLedger(), submission), completion));
});

test('history rejects any envelope other than the own prompt ID', () => {
  const { proposal } = validatePinnedArtifacts(); assert.throws(() => validateHistoryEnvelope({ other: {} }, 'own-prompt-001', proposal), /unexpected fields/);
});

test('runner CLI accepts exactly one fixed mode and validate-only remains offline', () => {
  const runner = join(import.meta.dirname, 'm2-runner.mjs');
  const result = JSON.parse(execFileSync(process.execPath, [runner, '--validate-only'], { encoding: 'utf8' })); assert.equal(result.endpoint, ENDPOINT);
  assert.throws(() => execFileSync(process.execPath, [runner, '--validate-only', '--resume'], { stdio: 'pipe' }));
  assert.throws(() => execFileSync(process.execPath, [runner, '--url', ENDPOINT], { stdio: 'pipe' }));
});
