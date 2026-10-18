import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { ACCOUNT_TABLES, GLOBAL_TABLES, FORMAT, runBetaBackup, selectCampaign, validateExport, verifyBackup, pruneBackups } from './beta-backup.mjs';
import { ADMIN_ENV_FILE } from '../beta-invites/beta-invites.mjs';
import { verifyCampaignCodec } from './verify-codec.mjs';

// Synthetic credentials/rows only. Every fetch is injected; the real env is never read.
const OWNER = '11111111-1111-4111-8111-111111111111', OTHER = '22222222-2222-4222-8222-222222222222';
const CID = 'campaign.backup.synthetic', KEY = 'synthetic-owner-secret-never-print', URL = 'https://synthetic-backup.supabase.co';
const NOW = Date.parse('2026-10-17T12:00:00.000Z'), DAY = 86_400_000;
const hash = value => createHash('sha256').update(value).digest('hex');
const folder = n => 'backup-' + new Date(n).toISOString().replace(/[-:.]/g, '');
const empty = names => Object.fromEntries(names.map(n => [n, []]));
function catalog() { return { format: FORMAT, ownerId: null, exportedAt: new Date(NOW).toISOString(), accountIds: [OWNER], tables: empty(GLOBAL_TABLES) }; }
function account() {
  const tables = empty(ACCOUNT_TABLES), rev = '9007199254740993';
  const blob = { owner_id: OWNER, campaign_id: CID, content: '\\x010203', uncompressed_bytes: 3,
    compressed_sha256: hash(Buffer.from([1, 2, 3])), uncompressed_sha256: '1'.repeat(64) };
  tables['gamify_private.player_memberships'] = [{ user_id: OWNER, revoked_at: null, deletion_requested_at: null }];
  tables['public.beta2_campaigns'] = [{ owner_id: OWNER, campaign_id: CID, name: 'Synthetic clinic', current_revision: rev,
    prior_revision: '9007199254740992', writer_generation: '9007199254740994', evidence_high_water: 1,
    current_sha256: blob.uncompressed_sha256, header_sha256: blob.uncompressed_sha256 }];
  tables['public.beta2_campaign_snapshots'] = [{ ...blob, revision: rev, evidence_high_water: 1 }, { ...blob, revision: '9007199254740992', evidence_high_water: 0 }];
  tables['public.beta2_evidence_headers'] = [{ ...blob }];
  tables['public.beta2_evidence_pages'] = [{ ...blob, first_record: 0, record_count: 1, accepted_revision: rev }];
  return { format: FORMAT, ownerId: OWNER, exportedAt: new Date(NOW).toISOString(), tables };
}
async function fixture(t) {
  const parent = resolve('.local-dev/beta2-b25/script-tests'); await fs.mkdir(parent, { recursive: true });
  const root = await fs.mkdtemp(join(parent, 'case-'));
  t.after(async () => { const real = await fs.realpath(root); assert.ok(real.startsWith(parent + '\\') || real.startsWith(parent + '/')); await fs.rm(real, { recursive: true, force: true }); });
  const calls = [], output = [];
  const io = { ...fs, readFile: (path, ...args) => path === ADMIN_ENV_FILE ? Promise.resolve(`SUPABASE_URL=${URL}\nSUPABASE_SERVICE_ROLE_KEY=${KEY}\n`) : fs.readFile(path, ...args) };
  let at = NOW, deleted = false, refused = false, lost = false;
  const fetchImpl = async (url, init) => {
    assert.equal(init.method, 'POST'); assert.equal(init.redirect, 'error'); assert.equal(init.headers.apikey, KEY);
    assert.equal(init.headers.Authorization, `Bearer ${KEY}`); assert.ok(init.signal instanceof AbortSignal);
    const body = JSON.parse(init.body); calls.push({ url, body });
    if (refused) return new Response(KEY + ' private payload', { status: 403 });
    if (url.endsWith('/beta2_backup_export')) return Response.json(body.p_owner_id === null ? catalog() : account());
    assert.ok(url.endsWith('/beta2_backup_restore'));
    assert.equal(hash(body.p_bundle_text), body.p_sha256);
    const bundle = JSON.parse(body.p_bundle_text);
    assert.equal(bundle.ownerId, OWNER); assert.equal(bundle.campaign.campaign_id, CID);
    assert.equal(bundle.campaign.current_revision, '9007199254740993');
    if (deleted) return new Response('Live deletion ledger blocks restore', { status: 403 });
    if (lost) throw new Error(KEY + ' ambiguous request');
    return Response.json({ status: body.p_apply ? 'restored' : 'dry-run', ownerId: OWNER, campaignId: CID, bundleSha256: body.p_sha256 });
  };
  const run = args => runBetaBackup(args, { root, io, fetchImpl, now: () => at, write: line => output.push(line) });
  return { root, io, calls, output, run, now: value => { at = value; }, deleted: () => { deleted = true; }, refuse: () => { refused = true; }, lose: () => { lost = true; } };
}
const restore = (name = folder(NOW)) => ['restore', '--backup', name, '--account', OWNER, '--campaign', CID];

test('exports every Beta 1/2 table including opaque bytes, verifies disk checksums, never prints a key or payload', async t => {
  const f = await fixture(t); assert.equal(await f.run(['backup']), 0);
  assert.equal(f.calls.length, 3); assert.ok(f.calls.every(c => c.url.startsWith(URL + '/rest/v1/rpc/')));
  const saved = await verifyBackup(f.root, folder(NOW), NOW, f.io);
  assert.deepEqual(Object.keys(saved.files[`account-${OWNER}.json`].tables).sort(), [...ACCOUNT_TABLES].sort());
  assert.equal(saved.files[`account-${OWNER}.json`].tables['public.beta2_campaign_snapshots'][0].content, '\\x010203');
  assert.equal(saved.manifest.projectOrigin, URL);
  assert.equal(f.output.join('').includes(KEY), false); assert.equal(f.output.join('').includes('\\x010203'), false);
  assert.equal(f.output.join('').includes(OWNER), false);
});
test('restore is a dry run by default; explicit apply stays scoped and does not replay Beta 1 rows or leases', async t => {
  const f = await fixture(t); await f.run(['backup']);
  assert.equal(await f.run(restore()), 0); assert.equal(f.calls.at(-1).body.p_apply, false);
  const bundle = JSON.parse(f.calls.at(-1).body.p_bundle_text);
  assert.deepEqual(Object.keys(bundle).sort(), ['format', 'ownerId', 'campaign', 'snapshots', 'header', 'pages'].sort());
  assert.equal(await f.run([...restore(), '--apply']), 1);
  assert.equal(await f.run([...restore(), '--apply', '--confirm-project', 'different-project']), 1);
  const before = f.calls.length;
  assert.equal(await f.run([...restore(), '--apply', '--confirm-project', 'synthetic-backup']), 0);
  assert.equal(f.calls.length, before + 1); assert.equal(f.calls.at(-1).body.p_apply, true);
  assert.equal(f.output.join('').includes(KEY), false);
});
test('current live deletion blocks a valid old backup; ambiguous response never becomes a success or automatic retry', async t => {
  const f = await fixture(t); await f.run(['backup']); f.deleted();
  assert.equal(await f.run(restore()), 1); assert.ok(f.output.at(-1).includes('refused'));
  const g = await fixture(t); await g.run(['backup']); g.lose(); const before = g.calls.length;
  assert.equal(await g.run([...restore(), '--apply', '--confirm-project', 'synthetic-backup']), 1);
  assert.equal(g.calls.length, before + 1); assert.ok(g.output.at(-1).includes('not confirmed'));
  assert.equal(g.output.join('').includes(KEY), false);
});
test('refuses cross-account, tampered, incomplete and wrong-project backups before sending restore', async t => {
  const f = await fixture(t); await f.run(['backup']); const before = f.calls.length;
  assert.equal(await f.run(restore().map(x => x === OWNER ? OTHER : x)), 1); assert.equal(f.calls.length, before);
  const path = join(f.root, folder(NOW), `account-${OWNER}.json`);
  await fs.appendFile(path, ' '); assert.equal(await f.run(restore()), 1); assert.equal(f.calls.length, before);
  const g = await fixture(t); await g.run(['backup']); const mp = join(g.root, folder(NOW), 'manifest.json');
  const m = JSON.parse(await fs.readFile(mp, 'utf8')); m.projectOrigin = 'https://other.supabase.co'; await fs.writeFile(mp, JSON.stringify(m));
  const count = g.calls.length; assert.equal(await g.run(restore()), 1); assert.equal(g.calls.length, count);
  await fs.rm(mp); assert.equal(await g.run(restore()), 1); assert.equal(g.calls.length, count);
});
test('deletion/revocation in a backup itself blocks restoration', async t => {
  const f = await fixture(t); await f.run(['backup']);
  const path = join(f.root, folder(NOW)), p = join(path, `account-${OWNER}.json`);
  const a = JSON.parse(await fs.readFile(p, 'utf8')); a.tables['gamify_private.player_memberships'][0].deletion_requested_at = new Date(NOW).toISOString();
  const data = Buffer.from(JSON.stringify(a) + '\n'); await fs.writeFile(p, data);
  const m = JSON.parse(await fs.readFile(join(path, 'manifest.json'), 'utf8')); m.files[`account-${OWNER}.json`] = { sha256: hash(data), bytes: data.length };
  await fs.writeFile(join(path, 'manifest.json'), JSON.stringify(m));
  const count = f.calls.length; assert.equal(await f.run(restore()), 1); assert.equal(f.calls.length, count);
});
test('retains two verified copies and expires at exactly 14 days, even when the provider fails', async t => {
  const f = await fixture(t);
  for (let day = 0; day < 3; day++) { f.now(NOW + day * 7 * DAY); assert.equal(await f.run(['backup']), 0); }
  assert.deepEqual((await fs.readdir(f.root)).sort(), [folder(NOW + 7 * DAY), folder(NOW + 14 * DAY)].sort());
  f.now(NOW + 28 * DAY); f.refuse(); assert.equal(await f.run(['backup']), 1);
  assert.equal((await fs.readdir(f.root)).includes(folder(NOW + 14 * DAY)), false);
  assert.equal(f.output.join('').includes(KEY), false);
});
test('corrupt/incomplete copies cannot displace a good copy; forget-account deletes whole matching generations', async t => {
  const f = await fixture(t); await f.run(['backup']); f.now(NOW + DAY); await f.run(['backup']);
  const corrupt = join(f.root, folder(NOW + DAY), `account-${OWNER}.json`); await fs.writeFile(corrupt, 'corrupt');
  f.now(NOW + 2 * DAY); await f.run(['backup']);
  assert.ok((await fs.readdir(f.root)).includes(folder(NOW)));
  assert.equal(await f.run(['forget-account', OWNER]), 0);
  assert.equal((await fs.readdir(f.root)).length, 0);
});
test('retention ignores arbitrary files/folders and refuses path traversal or linked backup directories', async t => {
  const f = await fixture(t); await fs.mkdir(join(f.root, 'unrelated')); await fs.writeFile(join(f.root, 'private-note.txt'), 'keep');
  assert.equal(await pruneBackups(f.root, NOW, f.io), 0);
  assert.equal(await f.run(['verify', '../outside']), 1);
  // Native symlink creation is privilege-dependent on Windows: exercise the
  // same checked lstat path using injected metadata, without a real symlink.
  await fs.mkdir(join(f.root, folder(NOW)));
  const io = { ...f.io, lstat: async path => path === join(f.root, folder(NOW)) ? { isDirectory: () => true, isSymbolicLink: () => true } : f.io.lstat(path) };
  await assert.rejects(() => pruneBackups(f.root, NOW, io), /real private directories/);
  assert.equal(await fs.readFile(join(f.root, 'private-note.txt'), 'utf8'), 'keep');
});
test('opaque verification detects changed blobs, missing history, unsafe numbers and account contamination', () => {
  const a = account(); assert.equal(selectCampaign(a, CID).campaign.current_revision, '9007199254740993');
  const blob = structuredClone(a); blob.tables['public.beta2_evidence_pages'][0].content = '\\x04';
  assert.throws(() => validateExport(blob, OWNER), /checksum/);
  const missing = structuredClone(a); missing.tables['public.beta2_evidence_pages'] = [];
  assert.throws(() => selectCampaign(missing, CID), /high-water/);
  const numeric = structuredClone(a); numeric.tables['public.beta2_campaigns'][0].current_revision = 9_007_199_254_740_993;
  assert.throws(() => selectCampaign(numeric, CID), /decimal strings/);
  const mixed = structuredClone(a); mixed.tables['public.beta2_campaign_snapshots'][0].owner_id = OTHER;
  assert.throws(() => selectCampaign(mixed, CID), /different account/);
});
test('an overlapping job cannot export or prune the in-progress generation', async t => {
  const f = await fixture(t), lock = join(f.root, '.beta-backup.lock');
  await fs.mkdir(join(f.root, folder(NOW))); await fs.writeFile(lock, 'synthetic running job\n');
  assert.equal(await f.run(['backup']), 1); assert.equal(await f.run(['prune']), 1);
  assert.equal(f.calls.length, 0); assert.ok((await fs.readdir(f.root)).includes(folder(NOW)));
  await fs.unlink(lock); assert.equal(await f.run(['prune']), 0);
  assert.equal((await fs.readdir(f.root)).includes(folder(NOW)), false);
});
test('live readback rejects opaque non-gzip bytes without sending a write or acquiring a lease', async t => {
  const f = await fixture(t);
  assert.equal(await f.run(['verify-live', '--account', OWNER, '--campaign', CID]), 1);
  assert.equal(f.calls.length, 1); assert.ok(f.calls[0].url.endsWith('/beta2_backup_export'));
  assert.ok(f.output.at(-1).includes('actual client codec verification'));
  assert.equal(await f.run(['verify-live', '--account', OWNER, '--campaign', CID, '--apply']), 1);
  assert.equal(f.calls.length, 1);
});
test('real client adapter/codec reads a genuine synthetic sealed-page export and checks the current summary', async () => {
  await import('../../tools/economy-audit/source-loader.mjs');
  const { createInitialGameState, serializeGameState } = await import('../../packages/game-domain/src/index.ts');
  const { prepareCloudEvidenceImport } = await import('../../apps/player/src/session/cloud/codecEvidence.ts');
  const { codecTestCampaign } = await import('../../apps/player/src/session/cloud/codecTestSupport.ts');
  const { compressCloudEvidencePages } = await import('../../apps/player/src/session/cloud/codecEvidencePages.ts');
  const { logicalJsonText } = await import('../../apps/player/src/session/cloud/codecJson.ts');
  const source = serializeGameState(createInitialGameState(undefined, { campaignId: CID, campaignSeed: 'b25.readback', createdAtRealMs: NOW }));
  const prepared = await prepareCloudEvidenceImport({ serializedState: source, campaign: codecTestCampaign(source), operationId: 'b25.codec' });
  const pages = await compressCloudEvidencePages(prepared.checkpoint.evidence.records.map(r => logicalJsonText(JSON.parse(JSON.stringify(r)))));
  const raw = blob => ({ owner_id: OWNER, campaign_id: CID, content: '\\x' + Buffer.from(blob.dataBase64, 'base64').toString('hex'),
    uncompressed_bytes: blob.uncompressedBytes, uncompressed_sha256: blob.uncompressedSha256, compressed_sha256: hash(Buffer.from(blob.dataBase64, 'base64')) });
  const a = account();
  a.tables['public.beta2_campaigns'] = [{ owner_id: OWNER, campaign_id: CID, name: prepared.envelope.campaign.name, status: 'resumable',
    current_revision: '1', prior_revision: null, writer_generation: '1', evidence_high_water: prepared.checkpoint.evidence.records.length,
    current_sha256: prepared.snapshot.uncompressedSha256, header_sha256: prepared.packedEvidence.header.uncompressedSha256 }];
  a.tables['public.beta2_campaign_snapshots'] = [{ ...raw(prepared.snapshot), revision: '1', accepted_at: new Date(NOW).toISOString(), evidence_high_water: prepared.checkpoint.evidence.records.length }];
  a.tables['public.beta2_evidence_headers'] = [raw(prepared.packedEvidence.header)];
  a.tables['public.beta2_evidence_pages'] = pages.map(p => ({ ...raw(p.content), first_record: p.firstRecord, record_count: p.recordCount, accepted_revision: '1' }));
  const bundle = selectCampaign(a, CID), copy = structuredClone(bundle);
  assert.deepEqual(await verifyCampaignCodec(bundle), [{ revision: '1', evidenceHighWater: prepared.checkpoint.evidence.records.length }]);
  assert.deepEqual(bundle, copy);
  bundle.campaign.name = 'Unexpected summary'; await assert.rejects(() => verifyCampaignCodec(bundle), /summary differs/);
});
test('help/local retention never reads credentials or uses fetch; invalid env/error bodies remain private', async t => {
  const f = await fixture(t); let reads = 0, requests = 0;
  const io = { ...f.io, readFile: async (path, ...args) => { if (path === ADMIN_ENV_FILE) { reads++; return 'SUPABASE_URL=https://evil.invalid\nSUPABASE_SERVICE_ROLE_KEY=' + KEY; } return f.io.readFile(path, ...args); } };
  const opts = { io, root: f.root, now: () => NOW, fetchImpl: async () => { requests++; throw new Error(KEY); }, write: x => f.output.push(x) };
  assert.equal(await runBetaBackup(['--help'], opts), 0); assert.equal(await runBetaBackup(['prune'], opts), 0);
  assert.equal(reads, 0); assert.equal(requests, 0);
  assert.equal(await runBetaBackup(['backup'], opts), 1); assert.equal(requests, 0);
  f.refuse(); assert.equal(await f.run(['backup']), 1); assert.equal(f.output.join('').includes(KEY), false);
});
