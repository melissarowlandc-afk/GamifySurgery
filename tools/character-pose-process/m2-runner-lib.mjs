import { createHash } from 'node:crypto';
import {
  existsSync, openSync, closeSync, fsyncSync, readFileSync, writeFileSync,
} from 'node:fs';
import { resolve, join } from 'node:path';
import {
  ALLOWED_CLASSES, appendLedgerFile, canonicalJson, emitProceduralGraph,
  hashFile, loadJson, validateGraph, validateLedger, validateRecipe,
} from './index.mjs';

export const ENDPOINT = 'https://cortan.taile197db.ts.net';
export const PROPOSAL_SHA256 = 'e2585246c2cdd59e615afff998002e5ddb0c2e5d452b85f1614f98350a96f1ba';
export const SCHEMA_SHA256 = '3617e7c67f799dc4f223a3b5e1a5a926f87f2cb2d48da1a12a7f69192c3e217a';
export const CLIENT_ID = 'gamifysurgery-pose-process-m2-run-001';
export const SAVE_OUTPUTS = Object.freeze({
  '83': { label: 'composite', stem: 'compositor-probe', localName: 'composite.png' },
  '84': { label: 'transparency-mask', stem: 'transparency-probe', localName: 'transparency-mask.png' },
});

const repo = resolve(import.meta.dirname, '../..');
export const PROOF_DIR = join(repo, 'Photos for Codex 2', 'Codex Patients or Staff or Other Characters 2', 'mixed-batch-2026-09-10', 'pose-process-proof-v1');
export const RUN_DIR = join(PROOF_DIR, 'm2-run-001');
export const PROPOSAL_PATH = join(PROOF_DIR, 'synthetic-compositor-proposal.json');
export const RECIPE_PATH = join(PROOF_DIR, 'fixture-recipe.json');
export const SCHEMA_PATH = join(PROOF_DIR, 'parent-evidence', 'node-schemas.json');
export const LEDGER_PATH = join(RUN_DIR, 'ledger.json');
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_PNG_BYTES = 32 * 1024 * 1024;

function sha256(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
function exactKeys(object, allowed, label) {
  if (!object || typeof object !== 'object' || Array.isArray(object)) throw new Error(`${label} must be an object`);
  const extras = Object.keys(object).filter(key => !allowed.includes(key));
  if (extras.length) throw new Error(`${label} has unexpected fields: ${extras.join(', ')}`);
}
function writeExclusive(path, bytes) {
  const fd = openSync(path, 'wx');
  try { writeFileSync(fd, bytes); fsyncSync(fd); } finally { closeSync(fd); }
}
function writeExclusiveJson(path, value) { writeExclusive(path, `${JSON.stringify(value, null, 2)}\n`); }
function writeOrVerifyExact(path, bytes) {
  if (existsSync(path)) { if (sha256(readFileSync(path)) !== sha256(bytes)) throw new Error(`immutable evidence differs at ${path}`); return; }
  writeExclusive(path, bytes);
}

export function validatePinnedDocuments({ proposalBytes, schemaBytes, recipe }) {
  if (sha256(proposalBytes) !== PROPOSAL_SHA256) throw new Error('pinned M1 proposal byte SHA-256 mismatch');
  if (sha256(schemaBytes) !== SCHEMA_SHA256) throw new Error('pinned schema byte SHA-256 mismatch');
  const proposal = JSON.parse(proposalBytes), schema = JSON.parse(schemaBytes);
  validateRecipe(recipe, { schemaFileSha256: SCHEMA_SHA256 }); validateGraph(proposal.graph, schema);
  if (Object.keys(proposal.graph).length !== 84) throw new Error('pinned proposal must contain exactly 84 nodes');
  const classes = [...new Set(Object.values(proposal.graph).map(node => node.class_type))].sort();
  if (canonicalJson(classes) !== canonicalJson([...ALLOWED_CLASSES].sort())) throw new Error('pinned proposal class set mismatch');
  const reemitted = emitProceduralGraph(recipe, schema, { schemaFileSha256: SCHEMA_SHA256 });
  if (canonicalJson(reemitted) !== canonicalJson(proposal)) throw new Error('pinned proposal differs from deterministic re-emission');
  const outputNodes = Object.keys(proposal.graph).filter(nodeId => proposal.graph[nodeId].class_type === 'SaveImage');
  if (canonicalJson(outputNodes) !== canonicalJson(Object.keys(SAVE_OUTPUTS))) throw new Error('pinned SaveImage output IDs changed');
  return { proposal, schema, recipe, proposalBytes, schemaBytes, classes };
}

export function validatePinnedArtifacts() {
  return validatePinnedDocuments({ proposalBytes: readFileSync(PROPOSAL_PATH), schemaBytes: readFileSync(SCHEMA_PATH), recipe: loadJson(RECIPE_PATH) });
}

export function validateOffline(runDir = RUN_DIR) {
  if (resolve(runDir) !== resolve(RUN_DIR)) throw new Error('M2 production validation is pinned to m2-run-001');
  const pinned = validatePinnedArtifacts();
  const ledger = loadJson(LEDGER_PATH); validateLedger(ledger);
  return { ok: true, state: 'offline-validated-unexecuted-or-resumable', endpoint: ENDPOINT, clientId: CLIENT_ID, proposalSha256: PROPOSAL_SHA256, schemaSha256: SCHEMA_SHA256, nodeCount: 84, classes: pinned.classes, saveOutputNodeIds: Object.keys(SAVE_OUTPUTS), ledgerRevision: ledger.revision, ledgerStateSha256: ledger.stateSha256 };
}

export function assertFreshSubmission(runDir = RUN_DIR) {
  for (const name of ['preflight.json', 'request-body.json', 'attempt.json', 'receipt.json', 'receipt-response.txt', 'actual-history.json', 'audit.json']) if (existsSync(join(runDir, name))) throw new Error(`submission guard: ${name} already exists; never auto-resubmit`);
  const ledger = loadJson(join(runDir, 'ledger.json')); validateLedger(ledger);
  if (ledger.revision !== 0) throw new Error('submission guard: M2 ledger is not at revision zero');
}

export function loadResumeReceipt(runDir = RUN_DIR) {
  const attemptPath = join(runDir, 'attempt.json'), receiptPath = join(runDir, 'receipt.json');
  if (!existsSync(attemptPath)) throw new Error('resume requires the own immutable attempt marker');
  if (!existsSync(receiptPath)) throw new Error('unresolved submission attempt has no trusted receipt; refusing resubmission or guessed resume');
  const attempt = loadJson(attemptPath), receipt = loadJson(receiptPath);
  exactKeys(attempt, ['runId', 'endpoint', 'clientId', 'proposalSha256', 'schemaSha256', 'requestSha256', 'createdAt', 'preflight'], 'attempt');
  exactKeys(receipt, ['runId', 'endpoint', 'clientId', 'promptId', 'receivedAt', 'httpStatus', 'rawResponseSha256', 'rawResponseText'], 'receipt');
  if (attempt.runId !== 'm2-run-001' || attempt.endpoint !== ENDPOINT || attempt.clientId !== CLIENT_ID || attempt.proposalSha256 !== PROPOSAL_SHA256 || attempt.schemaSha256 !== SCHEMA_SHA256) throw new Error('attempt marker does not match pinned M2 run');
  const requestPath = join(runDir, 'request-body.json');
  if (!existsSync(requestPath) || hashFile(requestPath) !== attempt.requestSha256) throw new Error('attempt request bytes are missing or changed');
  const { proposal } = validatePinnedArtifacts();
  let savedRequest; try { savedRequest = JSON.parse(readFileSync(requestPath, 'utf8')); } catch { throw new Error('saved request is not valid JSON'); }
  exactKeys(savedRequest, ['prompt', 'client_id'], 'saved request');
  if (savedRequest.client_id !== CLIENT_ID || canonicalJson(savedRequest.prompt) !== canonicalJson(proposal.graph)) throw new Error('saved request does not equal the pinned graph and own client ID');
  if (receipt.runId !== attempt.runId || receipt.endpoint !== ENDPOINT || receipt.clientId !== CLIENT_ID || typeof receipt.promptId !== 'string' || !/^[a-zA-Z0-9-]+$/.test(receipt.promptId)) throw new Error('receipt does not identify the own pinned job');
  if (sha256(receipt.rawResponseText) !== receipt.rawResponseSha256) throw new Error('receipt raw response hash mismatch');
  let rawReceipt; try { rawReceipt = JSON.parse(receipt.rawResponseText); } catch { throw new Error('preserved raw receipt is not valid JSON'); }
  exactKeys(rawReceipt, ['prompt_id', 'number', 'node_errors'], 'preserved raw receipt');
  if (rawReceipt.prompt_id !== receipt.promptId || rawReceipt.node_errors && Object.keys(rawReceipt.node_errors).length) throw new Error('preserved raw receipt does not match the clean own prompt ID');
  return { attempt, receipt };
}

async function fetchStrict(fetchImpl, path, options = {}) {
  const url = new URL(path, ENDPOINT);
  const response = await fetchImpl(url, { ...options, redirect: 'error', signal: AbortSignal.timeout(30_000) });
  if (response.url && response.url !== url.href) throw new Error(`unexpected response destination ${response.url}`);
  return response;
}

async function jsonResponse(response, label) {
  const text = await response.text();
  if (!response.ok) throw new Error(`${label} failed HTTP ${response.status}: ${text.slice(0, 500)}`);
  try { return { value: JSON.parse(text), text }; } catch { throw new Error(`${label} returned invalid JSON`); }
}

export async function preflightLive(fetchImpl = fetch) {
  const { schema } = validatePinnedArtifacts(); const liveHashes = {};
  for (const classType of ALLOWED_CLASSES) {
    const response = await fetchStrict(fetchImpl, `/object_info/${encodeURIComponent(classType)}`);
    const { value } = await jsonResponse(response, `schema ${classType}`);
    exactKeys(value, [classType], `schema response ${classType}`);
    if (canonicalJson(value[classType]) !== canonicalJson(schema.schemas[classType])) throw new Error(`live schema mismatch for ${classType}`);
    liveHashes[classType] = sha256(canonicalJson(value[classType]));
  }
  const queueResponse = await fetchStrict(fetchImpl, '/queue'); const { value: queue } = await jsonResponse(queueResponse, 'queue preflight');
  const running = queue.queue_running, pending = queue.queue_pending;
  if (!Array.isArray(running) || !Array.isArray(pending)) throw new Error('queue preflight missing canonical queue arrays');
  const counts = { running: running.length, pending: pending.length };
  return { checkedAt: new Date().toISOString(), usedNodeNames: [...ALLOWED_CLASSES], liveSchemaHashes: liveHashes, queueCounts: counts };
}

function requestDocument(proposal) { return { prompt: proposal.graph, client_id: CLIENT_ID }; }

function ensureSubmissionLedger(runDir, promptId, occurredAt) {
  const path = join(runDir, 'ledger.json'); const ledger = loadJson(path); validateLedger(ledger);
  if (ledger.events.some(event => event.id === 'm2-submission-001')) return ledger;
  const event = { id: 'm2-submission-001', type: 'submission', status: 'submitted', jobId: promptId, occurredAt, actualDurationsMs: { queue: null, execution: null, download: null }, operatorIntervals: [], correction: null, outputs: Object.entries(SAVE_OUTPUTS).map(([nodeId, output]) => ({ label: output.label, nodeId, sha256: null, reviewState: 'not-produced' })), pieceUse: [], notes: 'Pure-synthetic compositor probe submitted. Queue/operator/download/execution metrics were not yet measured.' };
  return appendLedgerFile(path, event, { expectedRevision: ledger.revision, expectedSha256: ledger.stateSha256 });
}

export function validateHistoryEnvelope(envelope, promptId, proposal) {
  exactKeys(envelope, [promptId], 'history envelope'); const record = envelope[promptId];
  if (!record || typeof record !== 'object') throw new Error('history lacks own prompt record');
  if (record.status?.status_str === 'error') throw new Error(`own prompt failed: ${JSON.stringify(record.status)}`);
  if (record.status?.status_str !== 'success' || record.status?.completed !== true) return { completed: false, record };
  if (!Array.isArray(record.prompt) || record.prompt.length !== 5 || record.prompt[1] !== promptId || record.prompt[3]?.client_id !== CLIENT_ID) throw new Error('successful history prompt tuple does not bind the own prompt/client ID');
  const historyGraph = record.prompt[2];
  if (!historyGraph || canonicalJson(historyGraph) !== canonicalJson(proposal.graph)) throw new Error('successful history graph differs from pinned request graph');
  if (!record.outputs || typeof record.outputs !== 'object' || Array.isArray(record.outputs)) throw new Error('successful history lacks outputs object');
  const allowedIntermediate = new Set(Object.entries(proposal.graph).filter(([, node]) => node.class_type === 'ImageCompositor').map(([nodeId]) => nodeId));
  for (const nodeId of Object.keys(record.outputs)) if (!(nodeId in SAVE_OUTPUTS) && !allowedIntermediate.has(nodeId)) throw new Error(`unexpected history output node ${nodeId}`);
  const declared = {};
  for (const [nodeId, expected] of Object.entries(SAVE_OUTPUTS)) {
    const output = record.outputs[nodeId]; exactKeys(output, ['images'], `history.outputs.${nodeId}`);
    if (!Array.isArray(output.images) || output.images.length !== 1) throw new Error(`history output ${nodeId} must contain exactly one image`);
    const image = output.images[0]; exactKeys(image, ['filename', 'subfolder', 'type'], `history.outputs.${nodeId}.images[0]`);
    const normalizedSubfolder = typeof image.subfolder === 'string' ? image.subfolder.replaceAll('\\', '/') : '';
    if (image.type !== 'output' || normalizedSubfolder !== 'synthetic/pose-process-proof-v1' || typeof image.filename !== 'string' || !new RegExp(`^${expected.stem}_[0-9]{5,}_[.]png$`).test(image.filename)) throw new Error(`history output ${nodeId} has unexpected destination or filename`);
    declared[nodeId] = image;
  }
  const messages = record.status?.messages;
  if (!Array.isArray(messages)) throw new Error('successful history lacks status messages');
  const start = messages.find(message => message?.[0] === 'execution_start')?.[1]?.timestamp;
  const success = messages.find(message => message?.[0] === 'execution_success')?.[1]?.timestamp;
  if (!Number.isFinite(start) || !Number.isFinite(success) || success < start) throw new Error('history execution interval is missing or impossible');
  return { completed: true, record, declared, executionDurationMs: Math.round(success - start), executionStartedAtEpochMs: start, executionSucceededAtEpochMs: success };
}

async function pollOwnHistory(fetchImpl, promptId, proposal, { deadlineMs = 300_000, monotonicNow = () => performance.now(), sleep = milliseconds => new Promise(resolvePromise => setTimeout(resolvePromise, milliseconds)) } = {}) {
  const deadline = monotonicNow() + deadlineMs;
  while (monotonicNow() < deadline) {
    const response = await fetchStrict(fetchImpl, `/history/${encodeURIComponent(promptId)}`); const { value, text } = await jsonResponse(response, 'own history poll');
    if (Object.keys(value).length === 0) { await sleep(2_000); continue; }
    let result;
    try { result = validateHistoryEnvelope(value, promptId, proposal); }
    catch (error) { writeOrVerifyExact(join(RUN_DIR, 'actual-history-failure.json'), text); throw error; }
    if (result.completed) return { ...result, rawText: text, observedCompletionAt: new Date().toISOString() };
    await sleep(2_000);
  }
  writeExclusiveJson(join(RUN_DIR, 'poll-timeout.json'), { promptId, timedOutAt: new Date().toISOString(), note: 'No cancellation or resubmission was attempted.' });
  throw new Error(`timed out polling only own prompt ${promptId}; resume later without resubmission`);
}

async function downloadPng(fetchImpl, image) {
  const params = new URLSearchParams({ filename: image.filename, subfolder: image.subfolder, type: image.type });
  const response = await fetchStrict(fetchImpl, `/view?${params.toString()}`);
  if (!response.ok) throw new Error(`PNG download failed HTTP ${response.status}`);
  const contentType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  if (contentType !== 'image/png') throw new Error(`unexpected download content type ${contentType ?? 'missing'}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < PNG_MAGIC.length || bytes.length > MAX_PNG_BYTES || !bytes.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) throw new Error('download is not a strict bounded PNG');
  return bytes;
}

export function buildCompletionEvent({ promptId, history, downloads, downloadDurationMs, observedCompletionAt, proposal }) {
  return {
    id: 'm2-execution-001', type: 'execution', status: 'succeeded', jobId: promptId,
    occurredAt: observedCompletionAt,
    actualDurationsMs: { queue: null, execution: history.executionDurationMs, download: downloadDurationMs },
    operatorIntervals: [], correction: null,
    outputs: Object.entries(SAVE_OUTPUTS).map(([nodeId, output]) => ({ label: output.label, nodeId, sha256: downloads[nodeId].sha256, reviewState: 'unreviewed' })),
    pieceUse: proposal.transforms.map(transform => ({ pieceId: transform.pieceId, sourceHash: transform.sourceHash, sourceHashKind: transform.sourceHashKind, useCount: 1, reusedFromEventId: null })),
    notes: 'Pure-synthetic run. Event order uses local observed completion time. Execution interval preserves own-history execution_start/execution_success; download duration used a monotonic local clock. Queue and operator time remain null/unmeasured; no savings claim.',
  };
}

function appendCompletionLedger(runDir, promptId, history, downloads, downloadDurationMs) {
  const path = join(runDir, 'ledger.json'); const ledger = loadJson(path); validateLedger(ledger);
  if (ledger.events.some(event => event.id === 'm2-execution-001')) return ledger;
  const proposal = loadJson(PROPOSAL_PATH);
  const event = buildCompletionEvent({ promptId, history, downloads, downloadDurationMs, observedCompletionAt: history.observedCompletionAt, proposal });
  return appendLedgerFile(path, event, { expectedRevision: ledger.revision, expectedSha256: ledger.stateSha256 });
}

async function finishOwnRun(fetchImpl, promptId, proposal, timing = {}) {
  if (existsSync(join(RUN_DIR, 'audit.json'))) return loadJson(join(RUN_DIR, 'audit.json'));
  const history = await pollOwnHistory(fetchImpl, promptId, proposal, timing);
  writeOrVerifyExact(join(RUN_DIR, 'actual-history.json'), history.rawText);
  const startDownload = (timing.monotonicNow ?? (() => performance.now()))(); const downloads = {};
  for (const [nodeId, expected] of Object.entries(SAVE_OUTPUTS)) {
    const bytes = await downloadPng(fetchImpl, history.declared[nodeId]); writeOrVerifyExact(join(RUN_DIR, expected.localName), bytes);
    downloads[nodeId] = { ...history.declared[nodeId], localName: expected.localName, byteLength: bytes.length, sha256: sha256(bytes) };
  }
  const endDownload = (timing.monotonicNow ?? (() => performance.now()))(); const downloadDurationMs = Math.max(0, Math.round(endDownload - startDownload));
  const ledger = appendCompletionLedger(RUN_DIR, promptId, history, downloads, downloadDurationMs);
  const audit = { runId: 'm2-run-001', endpoint: ENDPOINT, clientId: CLIENT_ID, promptId, state: 'downloaded-unreviewed', proposalSha256: PROPOSAL_SHA256, schemaSha256: SCHEMA_SHA256, requestSha256: hashFile(join(RUN_DIR, 'request-body.json')), attemptSha256: hashFile(join(RUN_DIR, 'attempt.json')), receiptSha256: hashFile(join(RUN_DIR, 'receipt.json')), historySha256: hashFile(join(RUN_DIR, 'actual-history.json')), historyGraphEqualsPinnedProposal: true, observedCompletionAt: history.observedCompletionAt, execution: { durationMs: history.executionDurationMs, startedAtEpochMs: history.executionStartedAtEpochMs, succeededAtEpochMs: history.executionSucceededAtEpochMs, source: 'own-history-status-messages' }, queueDurationMs: null, operatorDurationMs: null, download: { durationMs: downloadDurationMs, source: 'local-monotonic-clock', outputs: downloads }, ledger: { revision: ledger.revision, stateSha256: ledger.stateSha256 }, claims: { compositorMechanicsReviewed: false, privateArtProcessed: false, savingsMeasured: false } };
  writeExclusiveJson(join(RUN_DIR, 'audit.json'), audit); return audit;
}

export async function executeSynthetic(fetchImpl = fetch) {
  const { proposal } = validatePinnedArtifacts(); assertFreshSubmission(RUN_DIR);
  const preflight = await preflightLive(fetchImpl);
  if (preflight.queueCounts.running || preflight.queueCounts.pending) { writeExclusiveJson(join(RUN_DIR, `preflight-blocked-${Date.now()}.json`), preflight); throw new Error(`queue is not empty (${preflight.queueCounts.running} running, ${preflight.queueCounts.pending} pending); no submission attempted`); }
  writeExclusiveJson(join(RUN_DIR, 'preflight.json'), preflight);
  const request = requestDocument(proposal); const requestText = JSON.stringify(request); const requestSha256 = sha256(requestText);
  writeExclusive(join(RUN_DIR, 'request-body.json'), requestText);
  writeExclusiveJson(join(RUN_DIR, 'attempt.json'), { runId: 'm2-run-001', endpoint: ENDPOINT, clientId: CLIENT_ID, proposalSha256: PROPOSAL_SHA256, schemaSha256: SCHEMA_SHA256, requestSha256, createdAt: new Date().toISOString(), preflight: { usedNodeNames: preflight.usedNodeNames, queueCounts: preflight.queueCounts } });
  let response;
  try { response = await fetchStrict(fetchImpl, '/prompt', { method: 'POST', headers: { 'content-type': 'application/json' }, body: requestText }); }
  catch (error) { throw new Error(`submission outcome uncertain; immutable attempt remains and must not be resubmitted: ${error.message}`); }
  const rawResponseText = await response.text();
  if (!response.ok) { writeExclusive(join(RUN_DIR, 'receipt-response.txt'), rawResponseText); throw new Error(`submission rejected HTTP ${response.status}; attempt remains guarded`); }
  let parsed; try { parsed = JSON.parse(rawResponseText); } catch { writeExclusive(join(RUN_DIR, 'receipt-response.txt'), rawResponseText); throw new Error('submission response invalid; attempt remains unresolved and must not be resubmitted'); }
  exactKeys(parsed, ['prompt_id', 'number', 'node_errors'], 'prompt response');
  if (typeof parsed.prompt_id !== 'string' || !/^[a-zA-Z0-9-]+$/.test(parsed.prompt_id) || parsed.node_errors && Object.keys(parsed.node_errors).length) { writeExclusive(join(RUN_DIR, 'receipt-response.txt'), rawResponseText); throw new Error('submission response lacks a clean prompt receipt; do not resubmit'); }
  const receivedAt = new Date().toISOString();
  const receipt = { runId: 'm2-run-001', endpoint: ENDPOINT, clientId: CLIENT_ID, promptId: parsed.prompt_id, receivedAt, httpStatus: response.status, rawResponseSha256: sha256(rawResponseText), rawResponseText };
  writeExclusiveJson(join(RUN_DIR, 'receipt.json'), receipt); ensureSubmissionLedger(RUN_DIR, parsed.prompt_id, receivedAt);
  return finishOwnRun(fetchImpl, parsed.prompt_id, proposal);
}

export async function resumeSynthetic(fetchImpl = fetch) {
  const { proposal } = validatePinnedArtifacts(); const { receipt } = loadResumeReceipt(RUN_DIR);
  ensureSubmissionLedger(RUN_DIR, receipt.promptId, receipt.receivedAt); return finishOwnRun(fetchImpl, receipt.promptId, proposal);
}
