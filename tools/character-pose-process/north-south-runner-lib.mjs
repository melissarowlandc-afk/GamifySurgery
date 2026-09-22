import { createHash } from 'node:crypto';
import {
  closeSync, existsSync, fsyncSync, lstatSync, mkdirSync, openSync, readFileSync,
  realpathSync, writeFileSync,
} from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

export const ENDPOINT = 'https://cortan.taile197db.ts.net';
export const RUN_ID = 'north-south-run-001';
export const CLIENT_ID = 'gamifysurgery-north-south-run-001';
export const GRAPH_SHA256 = 'a1c65208d2f6264786d6ad0fa53ad963ad19a91309efe0936b1eaa0d5e602e4a';
export const MANIFEST_SHA256 = '77ba0f98702a2498d08bdccd10e56884b8709da0b0e0332a87c10e81312a415b';
export const SCHEMA_SHA256 = '3617e7c67f799dc4f223a3b5e1a5a926f87f2cb2d48da1a12a7f69192c3e217a';
export const RECEIPTS_SHA256 = '96d9f0f3cc980b44ca57dbced358f82cf0fce7501a66e41e9b199950070b312f';
export const ADAPTER_PINS = Object.freeze({
  'north-south-projection-core.mjs': '7b0564122bbea1dff097c64b6752b545a0241d673bb81815eda946abb87c88ee',
  'north-south-projection-build.mjs': '309c21c8ddcf2da26389be5a97019c27bda8b21e6185dd1b37648c6015ceaa35',
  'north-south-projection-validate.mjs': 'ffcb2d5a32bc93cfa8c1d5e8659142e74c953b6443395a2d4116de962f6cc731',
  'north-south-projection.test.mjs': 'b8f8121a6663a9d79677f2af87c7858cef6fa9cbcf5bd5db0bbdbce4c8664f2e',
  'north-south-projection-README.md': '73eb4e8528eb0523785f8373db1f1d6ad63f98518bfa51c3f2ee0debeb79874c',
});
export const ALLOWED_CLASSES = Object.freeze([
  'AddLayer', 'EmptyImage', 'ImageCompositor', 'ImageScale', 'LayersFromBoundingBoxes',
  'MaskToImage', 'SaveImage', 'SolidMask',
]);

const REPO = resolve(import.meta.dirname, '../..');
const PROOF = join(REPO, 'Photos for Codex 2', 'Codex Patients or Staff or Other Characters 2', 'mixed-batch-2026-09-10', 'pose-process-proof-v1');
export const N1_DIR = join(PROOF, 'north-south-v1');
export const RUN_DIR = join(PROOF, RUN_ID);
export const GRAPH_PATH = join(N1_DIR, 'prepared-graph.json');
export const MANIFEST_PATH = join(N1_DIR, 'manifest.json');
export const RECEIPTS_PATH = join(N1_DIR, 'transform-receipts.json');
export const SCHEMA_PATH = join(PROOF, 'parent-evidence', 'node-schemas.json');
const PNG_MAGIC = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
const MAX_PNG_BYTES = 64 * 1024 * 1024;

export function sha256(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
export function verifyPinnedBytes(bytes,expected,label='document'){if(sha256(bytes)!==expected)throw new Error(`${label} pinned SHA-256 mismatch`);return true;}
export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonicalJson(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}
function exactKeys(value, allowed, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be an object`);
  const extra = Object.keys(value).filter(k => !allowed.includes(k));
  if (extra.length) throw new Error(`${label} unexpected fields: ${extra.join(', ')}`);
}

function assertUnderRepo(path) {
  const full = resolve(path), rel = relative(REPO, full);
  if (!rel || isAbsolute(rel) || rel === '..' || rel.startsWith(`..${sep}`) || resolve(REPO, rel) !== full) throw new Error(`path outside repository: ${path}`);
  return full;
}
export function guardPath(path, { mayNotExist = false } = {}) {
  const full = assertUnderRepo(path); let cursor = REPO;
  for (const part of relative(REPO, full).split(sep)) {
    cursor = join(cursor, part);
    if (!existsSync(cursor)) { if (mayNotExist) continue; throw new Error(`missing guarded path: ${cursor}`); }
    const stat = lstatSync(cursor);
    if (stat.isSymbolicLink()) throw new Error(`linked path refused: ${cursor}`);
    if (realpathSync(cursor) !== resolve(cursor)) throw new Error(`redirected path refused: ${cursor}`);
  }
  return full;
}
function readPinned(path, expected) {
  guardPath(path); const bytes = readFileSync(path); verifyPinnedBytes(bytes,expected,path);
  return bytes;
}
function ensureOwnedDir(path) {
  const full=assertUnderRepo(path), parts=relative(REPO,full).split(sep); let cursor=REPO;
  for(const part of parts){cursor=join(cursor,part); if(!existsSync(cursor)){guardPath(dirname(cursor));mkdirSync(cursor);} guardPath(cursor);}
  guardPath(path);
}
export function writeExclusive(path, bytes) {
  guardPath(path, { mayNotExist: true }); ensureOwnedDir(dirname(path));
  const fd = openSync(path, 'wx');
  try { writeFileSync(fd, bytes); fsyncSync(fd); } finally { closeSync(fd); }
}
function writeExclusiveJson(path, value) { writeExclusive(path, Buffer.from(`${JSON.stringify(value, null, 2)}\n`)); }
function writeOrVerify(path, bytes) {
  guardPath(path, { mayNotExist: true });
  if (existsSync(path)) { if (sha256(readFileSync(path)) !== sha256(bytes)) throw new Error(`immutable evidence differs: ${path}`); return; }
  writeExclusive(path, bytes);
}

function parseJson(bytes, label) { try { return JSON.parse(bytes); } catch { throw new Error(`${label} is invalid JSON`); } }
function deriveOutputs(prepared) {
  if (!Array.isArray(prepared.outputs) || prepared.outputs.length !== 36) throw new Error('prepared graph must declare 36 outputs');
  const result = {};
  for (const output of prepared.outputs) {
    exactKeys(output, ['canvas','nodeId','prefix','role'], 'declared output');
    if (result[output.nodeId]) throw new Error(`duplicate output node ${output.nodeId}`);
    if (!/^[0-9]+$/.test(output.nodeId) || !/^synthetic\/pose-process-proof-v1\/north-south-v1\/[a-z0-9-]+$/.test(output.prefix)) throw new Error('unsafe output declaration');
    if (!['composite','transparency-mask-as-image'].includes(output.role)) throw new Error('unknown output role');
    result[output.nodeId] = Object.freeze({ ...output, localName: join('outputs', output.canvas, `${output.role}.png`) });
  }
  return Object.freeze(result);
}

export function validatePinnedArtifacts() {
  const preparedBytes = readPinned(GRAPH_PATH, GRAPH_SHA256);
  const manifestBytes = readPinned(MANIFEST_PATH, MANIFEST_SHA256);
  const schemaBytes = readPinned(SCHEMA_PATH, SCHEMA_SHA256);
  const receiptsBytes = readPinned(RECEIPTS_PATH, RECEIPTS_SHA256);
  for (const [name, hash] of Object.entries(ADAPTER_PINS)) readPinned(join(import.meta.dirname, name), hash);
  const prepared = parseJson(preparedBytes, 'prepared graph');
  const manifest = parseJson(manifestBytes, 'N1 manifest');
  const schema = parseJson(schemaBytes, 'captured schema');
  const receipts = parseJson(receiptsBytes, 'transform receipts');
  if (!prepared.graph || Object.keys(prepared.graph).length !== 674 || prepared.canvasCount !== 18 || prepared.outputCount !== 36) throw new Error('frozen graph inventory mismatch');
  const classes = [...new Set(Object.values(prepared.graph).map(n => n.class_type))].sort();
  if (canonicalJson(classes) !== canonicalJson([...ALLOWED_CLASSES].sort())) throw new Error('graph class whitelist mismatch');
  for (const [id,node] of Object.entries(prepared.graph)) {
    if (!node || !ALLOWED_CLASSES.includes(node.class_type) || !node.inputs || typeof node.inputs !== 'object') throw new Error(`invalid graph node ${id}`);
    if (canonicalJson(node).includes('LoadImage') || canonicalJson(node).match(/resident:|private/i)) throw new Error('private/model/image-loader content refused');
  }
  const outputs = deriveOutputs(prepared);
  for (const [id,o] of Object.entries(outputs)) {
    const node = prepared.graph[id];
    if (node?.class_type !== 'SaveImage' || node.inputs.filename_prefix !== o.prefix) throw new Error(`SaveImage ${id} differs from declaration`);
  }
  const imageScaleCount = Object.values(prepared.graph).filter(n => n.class_type === 'ImageScale').length;
  if (imageScaleCount !== 143) throw new Error('expected 143 procedural source uses');
  const hashes = new Set();
  for (const receipt of receipts.receipts ?? []) for (const t of receipt.transforms ?? []) if (typeof t.sourceDefinitionHash === 'string') hashes.add(t.sourceDefinitionHash);
  if (hashes.size !== 16) throw new Error(`expected 16 source definitions, found ${hashes.size}`);
  if (manifest.inventory?.totalCanvases !== 18 || manifest.inventory?.declaredOutputs !== 36 || manifest.noImageInputs !== true || manifest.noExecution !== true) throw new Error('manifest contract mismatch');
  return { prepared, schema, manifest, outputs, classes, sourceDefinitionHashes: [...hashes].sort(), sourceUseCount: imageScaleCount };
}

export function buildRunManifest() {
  const pinned = validatePinnedArtifacts();
  return {
    schemaVersion: 1, runId: RUN_ID, clientId: CLIENT_ID, endpoint: ENDPOINT,
    state: 'prepared-unexecuted-synthetic-only',
    pins: { graphSha256: GRAPH_SHA256, manifestSha256: MANIFEST_SHA256, schemaSha256: SCHEMA_SHA256, receiptsSha256: RECEIPTS_SHA256, adapterSources: ADAPTER_PINS },
    inventory: { nodes: 674, canvases: 18, outputs: 36, allowedClasses: pinned.classes, sourceDefinitions: 16, sourceUses: 143 },
    outputMapping: Object.values(pinned.outputs),
    syntheticEvidence: { sourceDefinitionHashes: pinned.sourceDefinitionHashes, sourceHashKind: 'canonical-numeric-definition-sha256', privateArtReuseClaimed: false, effortSavingsClaimed: false },
    metrics: { queueDurationMs: null, operatorDurationMs: null, executionDurationMs: null, downloadDurationMs: null },
  };
}

export function prepareLocal(runDir = RUN_DIR) {
  if (resolve(runDir) !== resolve(RUN_DIR)) throw new Error('production preparation is pinned to north-south-run-001');
  guardPath(dirname(runDir)); if (!existsSync(runDir)) mkdirSync(runDir); guardPath(runDir);
  const manifest = buildRunManifest();
  const ledger = { schemaVersion: 1, runId: RUN_ID, state: 'prepared-unexecuted', events: [{ id:'prepared-001', type:'preparation', status:'unexecuted', occurredAt:null, jobId:null, actualDurationsMs:{queue:null,execution:null,download:null,operator:null}, sourceDefinitionCount:16, sourceUseCount:143, notes:'Synthetic numeric definitions only; no private art, execution, operator effort, or savings claim.' }] };
  writeOrVerify(join(runDir, 'run-manifest.json'), Buffer.from(`${JSON.stringify(manifest,null,2)}\n`));
  writeOrVerify(join(runDir, 'ledger.json'), Buffer.from(`${JSON.stringify(ledger,null,2)}\n`));
  return manifest;
}

export function validateOffline(runDir = RUN_DIR) {
  if (resolve(runDir) !== resolve(RUN_DIR)) throw new Error('production validation is pinned to north-south-run-001');
  const pinned = validatePinnedArtifacts();
  const expected = Buffer.from(`${JSON.stringify(buildRunManifest(),null,2)}\n`);
  guardPath(join(runDir,'run-manifest.json')); if (sha256(readFileSync(join(runDir,'run-manifest.json'))) !== sha256(expected)) throw new Error('run manifest differs from pinned build');
  guardPath(join(runDir,'ledger.json')); const ledger = parseJson(readFileSync(join(runDir,'ledger.json')), 'ledger');
  if (ledger.runId !== RUN_ID || !Array.isArray(ledger.events) || ledger.events.length < 1) throw new Error('invalid run ledger');
  return { ok:true, state:'offline-validated-unexecuted-or-resumable', endpoint:ENDPOINT, graphSha256:GRAPH_SHA256, schemaSha256:SCHEMA_SHA256, nodeCount:674, canvasCount:18, outputCount:36, classes:pinned.classes, sourceDefinitionCount:16, sourceUseCount:143 };
}

function statePath(runDir,name) { const p=join(runDir,name); guardPath(p,{mayNotExist:true}); return p; }
export function assertFreshSubmission(runDir = RUN_DIR) {
  for (const name of ['preflight.json','request-body.json','attempt.json','receipt-response.txt','receipt.json','actual-history.json','audit.json']) if (existsSync(statePath(runDir,name))) throw new Error(`submission guard: ${name} exists; never resubmit`);
}
function requestDocument(prepared) { return { prompt: prepared.graph, client_id: CLIENT_ID }; }

async function fetchStrict(fetchImpl, path, options={}) {
  const url = new URL(path, ENDPOINT);
  const response = await fetchImpl(url,{...options,redirect:'error',signal:AbortSignal.timeout(30_000)});
  if (response.url && response.url !== url.href) throw new Error(`redirect/destination refused: ${response.url}`);
  return response;
}
async function readJsonResponse(response,label) {
  const text=await response.text(); if(!response.ok) throw new Error(`${label} HTTP ${response.status}: ${text.slice(0,300)}`);
  try{return {value:JSON.parse(text),text};}catch{throw new Error(`${label} returned invalid JSON`);}
}
export async function preflightLive(fetchImpl=fetch) {
  const {schema}=validatePinnedArtifacts(); const liveSchemaHashes={};
  for(const classType of ALLOWED_CLASSES){
    const {value}=await readJsonResponse(await fetchStrict(fetchImpl,`/object_info/${encodeURIComponent(classType)}`),`schema ${classType}`);
    exactKeys(value,[classType],`schema ${classType}`);
    if(canonicalJson(value[classType])!==canonicalJson(schema.schemas[classType])) throw new Error(`live schema mismatch ${classType}`);
    liveSchemaHashes[classType]=sha256(canonicalJson(value[classType]));
  }
  const {value:q}=await readJsonResponse(await fetchStrict(fetchImpl,'/queue'),'queue');
  if(!Array.isArray(q.queue_running)||!Array.isArray(q.queue_pending)) throw new Error('queue arrays missing');
  return {checkedAt:new Date().toISOString(),usedNodeNames:[...ALLOWED_CLASSES],liveSchemaHashes,queueCounts:{running:q.queue_running.length,pending:q.queue_pending.length}};
}

function validateReceipt(runDir=RUN_DIR){
  for(const n of ['attempt.json','request-body.json','receipt-response.txt','receipt.json']) guardPath(join(runDir,n));
  const attempt=parseJson(readFileSync(join(runDir,'attempt.json')),'attempt'); const requestBytes=readFileSync(join(runDir,'request-body.json')); const request=parseJson(requestBytes,'request');
  const raw=readFileSync(join(runDir,'receipt-response.txt'),'utf8'); const receipt=parseJson(readFileSync(join(runDir,'receipt.json')),'receipt'); const parsed=parseJson(raw,'receipt response');
  exactKeys(attempt,['runId','endpoint','clientId','graphSha256','manifestSha256','schemaSha256','requestSha256','createdAt','queueCounts'],'attempt');
  exactKeys(receipt,['runId','endpoint','clientId','promptId','receivedAt','httpStatus','rawResponseSha256'],'receipt');
  exactKeys(parsed,['prompt_id','number','node_errors'],'receipt response');
  const {prepared}=validatePinnedArtifacts();
  if(attempt.runId!==RUN_ID||attempt.clientId!==CLIENT_ID||attempt.endpoint!==ENDPOINT||attempt.graphSha256!==GRAPH_SHA256||attempt.requestSha256!==sha256(requestBytes)) throw new Error('attempt binding mismatch');
  exactKeys(request,['prompt','client_id'],'saved request');
  if(request.client_id!==CLIENT_ID||canonicalJson(request.prompt)!==canonicalJson(prepared.graph)) throw new Error('saved request differs from frozen graph/client');
  if(receipt.runId!==RUN_ID||receipt.clientId!==CLIENT_ID||receipt.endpoint!==ENDPOINT||receipt.rawResponseSha256!==sha256(raw)||receipt.promptId!==parsed.prompt_id||typeof receipt.promptId!=='string'||!/^[A-Za-z0-9-]+$/.test(receipt.promptId)) throw new Error('receipt binding mismatch');
  if(parsed.node_errors&&Object.keys(parsed.node_errors).length) throw new Error('receipt contains node errors');
  return receipt;
}

function normalizeSubfolder(value){return value.replaceAll('\\','/');}
function escapeRe(v){return v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
export function validateHistoryEnvelope(envelope,promptId,prepared,outputs){
  exactKeys(envelope,[promptId],'history envelope'); const record=envelope[promptId];
  if(record?.status?.status_str==='error') throw new Error('own job failed');
  if(record?.status?.status_str!=='success'||record?.status?.completed!==true) return {completed:false,record};
  if(!Array.isArray(record.prompt)||record.prompt.length!==5||record.prompt[1]!==promptId||record.prompt[3]?.client_id!==CLIENT_ID||canonicalJson(record.prompt[2])!==canonicalJson(prepared.graph)) throw new Error('history tuple/client/graph mismatch');
  const declaredIds=new Set(Object.keys(outputs)); const intermediate=new Set(Object.entries(prepared.graph).filter(([,n])=>n.class_type==='ImageCompositor').map(([id])=>id));
  if(!record.outputs||typeof record.outputs!=='object'||Array.isArray(record.outputs)) throw new Error('history outputs missing');
  for(const id of Object.keys(record.outputs)) if(!declaredIds.has(id)&&!intermediate.has(id)) throw new Error(`unexpected history output ${id}`);
  const declared={};
  for(const [id,o] of Object.entries(outputs)){
    const slot=record.outputs[id]; exactKeys(slot,['images'],`output ${id}`);
    if(!Array.isArray(slot.images)||slot.images.length!==1) throw new Error(`output ${id} needs exactly one image`);
    const image=slot.images[0]; exactKeys(image,['filename','subfolder','type'],`image ${id}`);
    const slash=o.prefix.lastIndexOf('/'),folder=o.prefix.slice(0,slash),stem=o.prefix.slice(slash+1);
    if(image.type!=='output'||typeof image.filename!=='string'||typeof image.subfolder!=='string'||normalizeSubfolder(image.subfolder)!==folder||!new RegExp(`^${escapeRe(stem)}_[0-9]{5,}_[.]png$`).test(image.filename)||image.filename.includes('/')||image.filename.includes('\\')) throw new Error(`output ${id} remote path mismatch`);
    declared[id]=image;
  }
  const expectedOutputNodes=[...new Set([...Object.keys(outputs),...intermediate])].sort((a,b)=>Number(a)-Number(b));
  if(!Array.isArray(record.prompt[4])||new Set(record.prompt[4].map(String)).size!==record.prompt[4].length||canonicalJson(record.prompt[4].map(String).sort((a,b)=>Number(a)-Number(b)))!==canonicalJson(expectedOutputNodes)) throw new Error('history output-node membership mismatch');
  const messages=record.status?.messages; if(!Array.isArray(messages)) throw new Error('history messages missing');
  const start=messages.find(m=>m?.[0]==='execution_start')?.[1]?.timestamp,success=messages.find(m=>m?.[0]==='execution_success')?.[1]?.timestamp;
  if(!Number.isFinite(start)||!Number.isFinite(success)||success<start) throw new Error('invalid execution interval');
  return {completed:true,record,declared,executionDurationMs:Math.round(success-start),executionStartedAtEpochMs:start,executionSucceededAtEpochMs:success};
}

export function validatePng(bytes){
  if(!Buffer.isBuffer(bytes)) bytes=Buffer.from(bytes);
  if(bytes.length<33||bytes.length>MAX_PNG_BYTES||!bytes.subarray(0,8).equals(PNG_MAGIC)) throw new Error('not a bounded PNG');
  if(bytes.readUInt32BE(8)!==13||bytes.toString('ascii',12,16)!=='IHDR'||bytes.readUInt32BE(16)!==448||bytes.readUInt32BE(20)!==1024) throw new Error('PNG IHDR must be 448x1024');
  return true;
}
async function downloadPng(fetchImpl,image){
  const params=new URLSearchParams({filename:image.filename,subfolder:image.subfolder,type:image.type});
  const response=await fetchStrict(fetchImpl,`/view?${params}`); if(!response.ok) throw new Error(`download HTTP ${response.status}`);
  if(response.headers.get('content-type')?.split(';')[0].trim().toLowerCase()!=='image/png') throw new Error('download content-type is not image/png');
  const bytes=Buffer.from(await response.arrayBuffer()); validatePng(bytes); return bytes;
}
async function pollHistory(fetchImpl,promptId,prepared,outputs,runDir,{deadlineMs=45_000,now=()=>performance.now(),sleep=ms=>new Promise(r=>setTimeout(r,ms))}={}){
  if(deadlineMs>45_000) throw new Error('poll deadline exceeds 45 seconds'); const deadline=now()+deadlineMs;
  while(now()<deadline){
    const {value,text}=await readJsonResponse(await fetchStrict(fetchImpl,`/history/${encodeURIComponent(promptId)}`),'own history');
    if(Object.keys(value).length===0){await sleep(500);continue;}
    const result=validateHistoryEnvelope(value,promptId,prepared,outputs);
    if(result.completed)return {...result,rawText:text,observedCompletionAt:new Date().toISOString()};
    await sleep(500);
  }
  const timeout=join(runDir,`poll-timeout-${Date.now()}.json`); writeExclusiveJson(timeout,{promptId,timedOutAt:new Date().toISOString(),action:'resume same receipt only; no cancellation or resubmission'});
  throw new Error(`own job ${promptId} pending after bounded poll; resume only`);
}

async function finish(fetchImpl,promptId,pinned,runDir,timing={}){
  const auditPath=join(runDir,'audit.json'); if(existsSync(auditPath))return validateCompletedAudit(runDir,promptId,pinned);
  const history=await pollHistory(fetchImpl,promptId,pinned.prepared,pinned.outputs,runDir,timing); writeOrVerify(join(runDir,'actual-history.json'),Buffer.from(history.rawText));
  const now=timing.now??(()=>performance.now()),start=now(),downloads={};
  for(const [id,o] of Object.entries(pinned.outputs)){
    const bytes=await downloadPng(fetchImpl,history.declared[id]); const localPath=join(runDir,o.localName); writeOrVerify(localPath,bytes);
    downloads[id]={canvas:o.canvas,role:o.role,prefix:o.prefix,remote:history.declared[id],localName:o.localName,byteLength:bytes.length,sha256:sha256(bytes)};
  }
  const downloadDurationMs=Math.max(0,Math.round(now()-start));
  guardPath(join(runDir,'ledger.json')); const ledger=parseJson(readFileSync(join(runDir,'ledger.json')),'ledger'); const ledgerFinalPath=join(runDir,'ledger-final.json'); let completedLedger;
  if(existsSync(ledgerFinalPath)){
    guardPath(ledgerFinalPath); completedLedger=parseJson(readFileSync(ledgerFinalPath),'final ledger');
    const event=completedLedger.events?.find(e=>e.id==='execution-001'); if(!event||event.jobId!==promptId||event.status!=='succeeded')throw new Error('existing final ledger does not bind own completed job');
    for(const [id,d] of Object.entries(downloads)){const recorded=event.outputs?.find(o=>o.nodeId===id);if(recorded?.sha256!==d.sha256)throw new Error(`final ledger output hash mismatch ${id}`);}
  }else{
    ledger.state='downloaded-unreviewed'; ledger.events.push({id:'execution-001',type:'execution',status:'succeeded',occurredAt:history.observedCompletionAt,jobId:promptId,actualDurationsMs:{queue:null,execution:history.executionDurationMs,download:downloadDurationMs,operator:null},sourceDefinitionCount:16,sourceUseCount:143,outputs:Object.entries(downloads).map(([nodeId,d])=>({nodeId,role:d.role,sha256:d.sha256,reviewState:'unreviewed'})),notes:'Synthetic procedural source use only. Server execution and monotonic download are measured; queue/operator/savings remain null.'});
    writeExclusiveJson(ledgerFinalPath,ledger); completedLedger=ledger;
  }
  const finalEvent=completedLedger.events.find(e=>e.id==='execution-001');
  for(const n of ['request-body.json','attempt.json','receipt.json','actual-history.json'])guardPath(join(runDir,n));
  const audit={schemaVersion:1,runId:RUN_ID,endpoint:ENDPOINT,clientId:CLIENT_ID,promptId,state:'downloaded-unreviewed',pins:{graphSha256:GRAPH_SHA256,manifestSha256:MANIFEST_SHA256,schemaSha256:SCHEMA_SHA256},requestSha256:sha256(readFileSync(join(runDir,'request-body.json'))),attemptSha256:sha256(readFileSync(join(runDir,'attempt.json'))),receiptSha256:sha256(readFileSync(join(runDir,'receipt.json'))),historySha256:sha256(readFileSync(join(runDir,'actual-history.json'))),historyGraphEqualsPinned:true,observedCompletionAt:finalEvent.occurredAt,execution:{durationMs:history.executionDurationMs,startedAtEpochMs:history.executionStartedAtEpochMs,succeededAtEpochMs:history.executionSucceededAtEpochMs,source:'own-history-status-messages'},download:{durationMs:finalEvent.actualDurationsMs.download,source:'local-monotonic-clock',outputs:downloads},metrics:{queueDurationMs:null,operatorDurationMs:null,savings:null},syntheticEvidence:{sourceDefinitionCount:16,sourceUseCount:143,privateArtProcessed:false,artReuseClaimed:false}};
  writeExclusiveJson(auditPath,audit); return audit;
}

function validateCompletedAudit(runDir,promptId,pinned){
  const receipt=validateReceipt(runDir); if(receipt.promptId!==promptId)throw new Error('audit prompt differs from receipt');
  for(const n of ['audit.json','actual-history.json','ledger-final.json','request-body.json','attempt.json','receipt.json'])guardPath(join(runDir,n));
  const audit=parseJson(readFileSync(join(runDir,'audit.json')),'audit');
  if(audit.runId!==RUN_ID||audit.clientId!==CLIENT_ID||audit.endpoint!==ENDPOINT||audit.promptId!==promptId||audit.pins?.graphSha256!==GRAPH_SHA256||audit.pins?.manifestSha256!==MANIFEST_SHA256||audit.pins?.schemaSha256!==SCHEMA_SHA256)throw new Error('completed audit identity/pin mismatch');
  for(const [field,name] of [['requestSha256','request-body.json'],['attemptSha256','attempt.json'],['receiptSha256','receipt.json'],['historySha256','actual-history.json']])if(audit[field]!==sha256(readFileSync(join(runDir,name))))throw new Error(`completed audit ${field} mismatch`);
  const historyEnvelope=parseJson(readFileSync(join(runDir,'actual-history.json')),'history'); const history=validateHistoryEnvelope(historyEnvelope,promptId,pinned.prepared,pinned.outputs);if(!history.completed)throw new Error('completed audit history is incomplete');
  for(const [id,o] of Object.entries(pinned.outputs)){const local=join(runDir,o.localName);guardPath(local);const bytes=readFileSync(local);validatePng(bytes);if(audit.download?.outputs?.[id]?.sha256!==sha256(bytes))throw new Error(`completed output ${id} hash mismatch`);}
  const ledger=parseJson(readFileSync(join(runDir,'ledger-final.json')),'final ledger');if(!ledger.events?.some(e=>e.id==='execution-001'&&e.jobId===promptId&&e.status==='succeeded'))throw new Error('completed final ledger mismatch');
  return audit;
}

export async function executeSynthetic(fetchImpl=fetch,{runDir=RUN_DIR,timing={}}={}){
  if(resolve(runDir)!==resolve(RUN_DIR)&&fetchImpl===fetch) throw new Error('live execution is pinned to owned run directory');
  const pinned=validatePinnedArtifacts(); validateOffline(RUN_DIR); assertFreshSubmission(runDir);
  const preflight=await preflightLive(fetchImpl); if(preflight.queueCounts.running||preflight.queueCounts.pending){writeExclusiveJson(join(runDir,`preflight-blocked-${Date.now()}.json`),preflight);throw new Error('queue not empty; no POST attempted');}
  writeExclusiveJson(join(runDir,'preflight.json'),preflight);
  const request=requestDocument(pinned.prepared),requestBytes=Buffer.from(JSON.stringify(request)); writeExclusive(join(runDir,'request-body.json'),requestBytes);
  writeExclusiveJson(join(runDir,'attempt.json'),{runId:RUN_ID,endpoint:ENDPOINT,clientId:CLIENT_ID,graphSha256:GRAPH_SHA256,manifestSha256:MANIFEST_SHA256,schemaSha256:SCHEMA_SHA256,requestSha256:sha256(requestBytes),createdAt:new Date().toISOString(),queueCounts:preflight.queueCounts});
  let response; try{response=await fetchStrict(fetchImpl,'/prompt',{method:'POST',headers:{'content-type':'application/json'},body:requestBytes});}catch(e){throw new Error(`submission outcome uncertain; never POST again: ${e.message}`);}
  const raw=await response.text(); writeExclusive(join(runDir,'receipt-response.txt'),Buffer.from(raw));
  if(!response.ok)throw new Error(`submission HTTP ${response.status}; guarded attempt remains`);
  const parsed=parseJson(raw,'prompt response'); exactKeys(parsed,['prompt_id','number','node_errors'],'prompt response');
  if(typeof parsed.prompt_id!=='string'||!/^[A-Za-z0-9-]+$/.test(parsed.prompt_id)||(parsed.node_errors&&Object.keys(parsed.node_errors).length))throw new Error('unclean submission response; never resubmit');
  writeExclusiveJson(join(runDir,'receipt.json'),{runId:RUN_ID,endpoint:ENDPOINT,clientId:CLIENT_ID,promptId:parsed.prompt_id,receivedAt:new Date().toISOString(),httpStatus:response.status,rawResponseSha256:sha256(raw)});
  return finish(fetchImpl,parsed.prompt_id,pinned,runDir,timing);
}
export async function resumeSynthetic(fetchImpl=fetch,{runDir=RUN_DIR,timing={}}={}){
  if(resolve(runDir)!==resolve(RUN_DIR)&&fetchImpl===fetch) throw new Error('live resume is pinned to owned run directory');
  const pinned=validatePinnedArtifacts(); const receipt=validateReceipt(runDir); return finish(fetchImpl,receipt.promptId,pinned,runDir,timing);
}
