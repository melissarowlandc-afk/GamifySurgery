import { createHash } from 'node:crypto';
import * as fs from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAdminEnv, ADMIN_ENV_FILE } from '../beta-invites/beta-invites.mjs';
import { verifyCampaignCodec } from './verify-codec.mjs';

export const BACKUP_ROOT = fileURLToPath(new URL('../../.local-dev/beta-backups/', import.meta.url));
export const FORMAT = 'beta2.private-backup.v1';
export const GLOBAL_TABLES = ['gamify_private.beta2_cloud_quota', 'gamify_private.beta2_cloud_deletions', 'gamify_private.setup_codes'];
export const ACCOUNT_TABLES = ['gamify_private.player_memberships', 'gamify_private.usage_owners', 'public.player_usage_days',
  'gamify_private.usage_receipts', 'gamify_private.usage_ingest_limits', 'public.question_flags', 'public.tester_feedback',
  'gamify_private.beta2_cloud_accounts', 'gamify_private.beta2_cloud_notices', 'public.beta2_campaigns',
  'public.beta2_campaign_snapshots', 'public.beta2_evidence_headers', 'public.beta2_evidence_pages',
  'gamify_private.beta2_campaign_writers', 'gamify_private.beta2_campaign_operations', 'gamify_private.beta2_cloud_rates'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const NAME = /^backup-(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(\d{3})Z$/;
const DAY = 86_400_000;
const digest = data => createHash('sha256').update(data).digest('hex');
class BackupError extends Error {}
const fail = message => { throw new BackupError(message); };
const validDate = value => typeof value === 'string' && Number.isFinite(Date.parse(value));
function tables(value, expected) {
  if (!value || typeof value !== 'object' || Object.keys(value).sort().join('|') !== [...expected].sort().join('|') ||
      expected.some(key => !Array.isArray(value[key]) || value[key].some(row => !row || typeof row !== 'object' || Array.isArray(row)))) fail('Unexpected backup table response. Nothing was restored.');
}
export function validateExport(value, ownerId = null) {
  if (!value || value.format !== FORMAT || value.ownerId !== ownerId || !validDate(value.exportedAt)) fail('Unexpected backup export version or account.');
  tables(value.tables, ownerId === null ? GLOBAL_TABLES : ACCOUNT_TABLES);
  if (ownerId === null && (!Array.isArray(value.accountIds) || value.accountIds.some(id => !UUID.test(id)) || new Set(value.accountIds).size !== value.accountIds.length)) fail('Unexpected backup account list.');
  if (ownerId !== null) {
    for (const [name, rows] of Object.entries(value.tables)) for (const row of rows) {
      const key = name.startsWith('public.beta2_') || name.includes('beta2_campaign_') || name.endsWith('beta2_cloud_rates') ? 'owner_id' : 'user_id';
      if (row[key] !== ownerId) fail('Backup contains a different account. Nothing was restored.');
    }
    for (const name of ['public.beta2_campaign_snapshots', 'public.beta2_evidence_headers', 'public.beta2_evidence_pages']) {
      for (const row of value.tables[name]) checkBlob(row);
    }
  }
  return value;
}
function checkBlob(row) {
  if (typeof row.content !== 'string' || !/^\\x(?:[0-9a-f]{2})+$/.test(row.content) || row.content.length > 6_000_002 ||
    !/^[0-9a-f]{64}$/.test(row.compressed_sha256 ?? '') || !/^[0-9a-f]{64}$/.test(row.uncompressed_sha256 ?? '') ||
    !Number.isSafeInteger(row.uncompressed_bytes) || row.uncompressed_bytes < 1 || row.uncompressed_bytes > 6_000_000 ||
    digest(Buffer.from(row.content.slice(2), 'hex')) !== row.compressed_sha256) fail('A backed-up opaque blob failed its compressed-byte checksum. Nothing was restored.');
}
function revision(value, nullable = false) {
  if (nullable && value === null) return;
  if (typeof value !== 'string' || !/^[1-9][0-9]{0,18}$/.test(value) || BigInt(value) > 9_223_372_036_854_775_806n) fail('Backup revisions must be lossless decimal strings with recovery headroom.');
}
export function selectCampaign(account, campaignId) {
  validateExport(account, account.ownerId);
  const selected = account.tables['public.beta2_campaigns'].filter(row => row.campaign_id === campaignId);
  if (selected.length !== 1) fail('Choose exactly one campaign present in this private backup.');
  const campaign = selected[0];
  revision(campaign.current_revision); revision(campaign.prior_revision, true); revision(campaign.writer_generation);
  const rows = name => account.tables[name].filter(row => row.campaign_id === campaignId);
  const snapshots = rows('public.beta2_campaign_snapshots'), headers = rows('public.beta2_evidence_headers'), pages = rows('public.beta2_evidence_pages').sort((a, b) => a.first_record - b.first_record);
  const revisions = [campaign.current_revision, ...(campaign.prior_revision === null ? [] : [campaign.prior_revision])];
  if (headers.length !== 1 || snapshots.length !== revisions.length || revisions.some(rev => snapshots.filter(row => row.revision === rev).length !== 1) ||
      (campaign.prior_revision !== null && BigInt(campaign.prior_revision) >= BigInt(campaign.current_revision))) fail('Backup current/prior snapshot set is incomplete.');
  if (headers[0].uncompressed_sha256 !== campaign.header_sha256 || snapshots.find(s => s.revision === campaign.current_revision).uncompressed_sha256 !== campaign.current_sha256) fail('Backup head hashes disagree.');
  let cursor = 0;
  for (const page of pages) {
    if (page.first_record !== cursor || !Number.isSafeInteger(page.record_count) || page.record_count < 1) fail('Backup sealed evidence pages are incomplete or reordered.');
    revision(page.accepted_revision); cursor += page.record_count;
    if (BigInt(page.accepted_revision) > BigInt(campaign.current_revision)) fail('Backup evidence is ahead of its campaign.');
  }
  if (cursor !== campaign.evidence_high_water || pages.length > 512) fail('Backup evidence high-water is incomplete.');
  for (const snapshot of snapshots) {
    revision(snapshot.revision);
    const prefix = pages.filter(p => p.first_record + p.record_count <= snapshot.evidence_high_water && BigInt(p.accepted_revision) <= BigInt(snapshot.revision));
    if (prefix.reduce((n, p) => n + p.record_count, 0) !== snapshot.evidence_high_water ||
      snapshot.uncompressed_bytes + headers[0].uncompressed_bytes + prefix.reduce((n, p) => n + p.uncompressed_bytes, 0) > 6_000_000) fail('Backup snapshot evidence prefix exceeds the supported load contract.');
  }
  return { format: FORMAT, ownerId: account.ownerId, campaign, snapshots, header: headers[0], pages };
}

function timestamp(name) {
  const m = NAME.exec(name); if (!m) return null;
  const iso = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}.${m[7]}Z`, n = Date.parse(iso);
  return Number.isFinite(n) && new Date(n).toISOString() === iso ? n : null;
}
async function directory(root, name, io) {
  if (!NAME.test(name)) fail('Use the generated backup folder name, without a path.');
  const realRoot = await io.realpath(root), candidate = join(realRoot, name);
  if (realRoot !== resolve(root) || (await io.lstat(root)).isSymbolicLink()) fail('The private backup root must not be a link or junction.');
  const stat = await io.lstat(candidate);
  if (!stat.isDirectory() || stat.isSymbolicLink()) fail('Backup folders must be real private directories.');
  const actual = await io.realpath(candidate);
  if (actual !== candidate || !actual.startsWith(realRoot + sep)) fail('Backup folder escaped its private root.');
  return actual;
}
/** Deletes ONLY generated, real directories inside the resolved private root. */
export async function pruneBackups(root, now, io = fs, forgetAccount = null) {
  await io.mkdir(root, { recursive: true, mode: 0o700 });
  const entries = [];
  for (const e of await io.readdir(root, { withFileTypes: true })) {
    const at = timestamp(e.name); if (at === null) continue;
    const path = await directory(root, e.name, io);
    let complete = false;
    try { await verifyBackup(root, e.name, now, io); complete = true; } catch { /* incomplete/corrupt folders age out, never displace verified copies */ }
    let forget = false;
    if (forgetAccount) {
      try { await io.lstat(join(path, `account-${forgetAccount}.json`)); forget = true; } catch { /* account absent */ }
      for (const file of ['globals.json', 'globals-final.json']) {
        try {
          const data = JSON.parse(await io.readFile(join(path, file), 'utf8'));
          if (data.tables?.['gamify_private.setup_codes']?.some(row => row.user_id === forgetAccount) ||
            data.tables?.['gamify_private.beta2_cloud_deletions']?.some(row => row.subject_sha256 === digest(forgetAccount))) forget = true;
        } catch { /* Unverified generations are removed below regardless. */ }
      }
    }
    entries.push({ at, path, complete, forget });
  }
  const good = entries.filter(e => e.complete && e.at > now - 14 * DAY && !e.forget).sort((a, b) => b.at - a.at).slice(0, 2);
  const keep = new Set(good.map(e => e.path)); let removed = 0;
  for (const e of entries) if (e.at <= now - 14 * DAY || e.forget || !e.complete || !keep.has(e.path)) {
    // Verify the real target again immediately before recursive removal.
    await directory(root, e.path.split(sep).at(-1), io);
    await io.rm(e.path, { recursive: true, force: false }); removed++;
  }
  return removed;
}
export async function verifyBackup(root, name, now, io = fs) {
  const path = await directory(root, name, io), at = timestamp(name);
  if (at === null || at <= now - 14 * DAY || at > now + 60_000) fail('Backup is expired or has a future date. Use a current retained copy.');
  const manifest = JSON.parse(await io.readFile(join(path, 'manifest.json'), 'utf8'));
  if (manifest.format !== FORMAT || !validDate(manifest.completedAt) || Date.parse(manifest.completedAt) < at || Date.parse(manifest.completedAt) > now + 60_000 ||
    !manifest.files || typeof manifest.files !== 'object' || !Object.hasOwn(manifest.files, 'globals.json') || !Object.hasOwn(manifest.files, 'globals-final.json')) fail('Backup is incomplete. No restore is allowed.');
  const files = {};
  for (const [file, receipt] of Object.entries(manifest.files)) {
    if (!/^(globals(?:-final)?|account-[0-9a-f-]{36})\.json$/.test(file)) fail('Unexpected backup file path.');
    const stat = await io.lstat(join(path, file)); if (!stat.isFile() || stat.isSymbolicLink()) fail('Backup files must be ordinary private files.');
    const data = await io.readFile(join(path, file));
    if (data.length !== receipt.bytes || digest(data) !== receipt.sha256) fail('Backup file checksum failed. Nothing was restored.');
    const owner = file.startsWith('account-') ? file.slice(8, -5) : null;
    files[file] = validateExport(JSON.parse(data.toString('utf8')), owner);
  }
  const expected = files['globals.json'].accountIds.map(id => `account-${id}.json`).sort();
  if (Object.keys(files).filter(f => f.startsWith('account-')).sort().join('|') !== expected.join('|')) fail('Backup account export set is incomplete.');
  return { path, manifest, files };
}

function parse(args) {
  const [command = 'help', ...rest] = args;
  if (command === 'help' || command === '--help') return { command: 'help' };
  if (['backup', 'prune'].includes(command) && !rest.length) return { command };
  if (command === 'forget-account' && rest.length === 1 && UUID.test(rest[0])) return { command, account: rest[0] };
  if (command === 'verify' && rest.length === 1 && NAME.test(rest[0])) return { command, backup: rest[0] };
  if (!['restore', 'verify-live'].includes(command)) fail('Use backup, verify <folder-name>, prune, forget-account <UUID>, verify-live --account <UUID> --campaign <ID>, or restore --backup <folder-name> --account <UUID> --campaign <ID> [--apply --confirm-project <project-ref>].');
  const result = { command, apply: false };
  while (rest.length) {
    const flag = rest.shift();
    if (flag === '--apply' && !result.apply) { result.apply = true; continue; }
    const key = { '--backup': 'backup', '--account': 'account', '--campaign': 'campaign', '--confirm-project': 'confirmProject' }[flag];
    if (!key || result[key] !== undefined || !rest.length) fail('Unexpected or duplicate restore option.');
    result[key] = rest.shift();
  }
  if (command === 'verify-live' && (result.backup || result.apply || result.confirmProject)) fail('verify-live accepts only --account and --campaign; it cannot write.');
  if (command === 'restore' && !NAME.test(result.backup ?? '') || !UUID.test(result.account ?? '') || typeof result.campaign !== 'string' || !result.campaign.trim() || Buffer.byteLength(result.campaign) > 256 || /[\x00-\x1f\x7f]/.test(result.campaign) || result.apply && !result.confirmProject) fail('Use the original account UUID and exact campaign ID. Restore also needs the generated folder; --apply needs --confirm-project.');
  return result;
}
const HELP = `Beta 2 private owner-PC backup (no Auth passwords, no automatic mail)
  node scripts/beta-backup/beta-backup.mjs backup
  node scripts/beta-backup/beta-backup.mjs verify <backup-folder-name>
  node scripts/beta-backup/beta-backup.mjs prune
  node scripts/beta-backup/beta-backup.mjs forget-account <account-UUID>
  node scripts/beta-backup/beta-backup.mjs verify-live --account <UUID> --campaign <ID>
  node scripts/beta-backup/beta-backup.mjs restore --backup <folder-name> --account <UUID> --campaign <ID>
  Restore defaults to a server-checked dry run. --apply --confirm-project <project-ref> is explicit.
  Setup/SQL prerequisites: docs/setup/BETA2_BACKUP_RESTORE.md. Credentials stay in .local-dev/beta-admin.env.`;

export async function runBetaBackup(args, { io = fs, fetchImpl = globalThis.fetch, root = BACKUP_ROOT, now = () => Date.now(), write = console.log } = {}) {
  let lock = null, incomplete = null;
  try {
    const options = parse([...args]), started = now();
    if (options.command === 'help') { write(HELP); return 0; }
    await io.mkdir(root, { recursive: true, mode: 0o700 });
    if (await io.realpath(root) !== resolve(root) || (await io.lstat(root)).isSymbolicLink()) fail('The private backup root must not be a link or junction.');
    try { lock = await io.open(join(root, '.beta-backup.lock'), 'wx', 0o600); }
    catch { fail('Another private backup job may be active. Check Task Scheduler; remove a stale .beta-backup.lock only after the manager confirms no job is running.'); }
    await lock.writeFile(String(process.pid) + '\n');
    // Local retention runs even if the provider is unavailable. An expired copy must not linger after a failed weekly run.
    const removed = await pruneBackups(root, started, io, options.command === 'forget-account' ? options.account : null);
    if (options.command === 'prune' || options.command === 'forget-account') { write(`Private retention complete: ${removed} backup folders removed.`); return 0; }
    if (options.command === 'verify') {
      const result = await verifyBackup(root, options.backup, started, io);
      write(`Private backup verified: ${Object.keys(result.files).length} checksummed export files. Opaque blobs were not decoded.`); return 0;
    }
    let contents;
    try { contents = await io.readFile(ADMIN_ENV_FILE, 'utf8'); } catch { fail('Set up the existing ignored .local-dev/beta-admin.env privately.'); }
    let config;
    try { config = parseAdminEnv(contents); } catch { fail('The private admin env file is invalid; use the existing empty example.'); }
    const rpc = async (name, body) => {
      let response;
      try { response = await fetchImpl(`${config.url}/rest/v1/rpc/${name}`, { method: 'POST', redirect: 'error',
        headers: { apikey: config.key, Authorization: `Bearer ${config.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body), signal: AbortSignal.timeout(60_000) }); } catch { fail('Backup service request was not confirmed. No provider details or secrets are printed. Rerun a dry run before any restore retry.'); }
      if (!response.ok) fail('Backup service refused the request. Check the reviewed helper SQL, maintenance gates, live deletion/admission and capacity in the runbook. No provider details are printed.');
      try { return await response.json(); } catch { fail('Backup service response was unreadable. No restore confirmation is claimed.'); }
    };
    if (options.command === 'verify-live') {
      const account = validateExport(await rpc('beta2_backup_export', { p_owner_id: options.account }), options.account);
      const bundle = selectCampaign(account, options.campaign);
      try { await verifyCampaignCodec(bundle); } catch { fail('The live campaign failed the actual client codec verification. Keep cloud writes paused and return the private evidence to the manager.'); }
      write('Live current/prior campaign bytes passed the actual client adapter and codec. No data changed and no writer was acquired. Verify the paused client UI before continuing play.');
      return 0;
    }
    if (options.command === 'backup') {
      const name = 'backup-' + new Date(started).toISOString().replace(/[-:.]/g, ''), path = join(root, name);
      await io.mkdir(path, { mode: 0o700 }); // no overwrite, including an unfinished same-millisecond run
      incomplete = name;
      const manifest = { format: FORMAT, projectOrigin: config.url, createdAt: new Date(started).toISOString(), completedAt: null, files: {} };
      const save = async (file, value) => {
        const data = Buffer.from(JSON.stringify(value) + '\n');
        await io.writeFile(join(path, file), data, { flag: 'wx', mode: 0o600 });
        if (digest(await io.readFile(join(path, file))) !== digest(data)) fail('Private disk readback failed. Backup remains incomplete.');
        manifest.files[file] = { bytes: data.length, sha256: digest(data) };
      };
      const catalog = validateExport(await rpc('beta2_backup_export', { p_owner_id: null }));
      await save('globals.json', catalog);
      for (const ownerId of catalog.accountIds) await save(`account-${ownerId}.json`, validateExport(await rpc('beta2_backup_export', { p_owner_id: ownerId }), ownerId));
      await save('globals-final.json', validateExport(await rpc('beta2_backup_export', { p_owner_id: null })));
      manifest.completedAt = new Date(now()).toISOString();
      await io.writeFile(join(path, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
      await verifyBackup(root, name, now(), io);
      await pruneBackups(root, now(), io);
      incomplete = null;
      write(`Private backup complete and verified: .local-dev/beta-backups/${name}. ${catalog.accountIds.length} account exports; at most two copies, no older than 14 days.`);
      return 0;
    }
    const backup = await verifyBackup(root, options.backup, started, io);
    if (backup.manifest.projectOrigin !== config.url || options.apply && options.confirmProject !== new URL(config.url).hostname.split('.')[0]) fail('Restore target differs from the backup or explicit project confirmation. Nothing was restored.');
    const account = backup.files[`account-${options.account}.json`]; if (!account) fail('This account is absent from the chosen backup.');
    const subject = digest(options.account);
    if (['globals.json', 'globals-final.json'].some(f => backup.files[f].tables['gamify_private.beta2_cloud_deletions'].some(r => r.subject_sha256 === subject)) ||
      account.tables['gamify_private.player_memberships'].some(r => r.deletion_requested_at !== null || r.revoked_at !== null)) fail('Backup records a deletion or revocation. Restore is blocked.');
    const bundle = selectCampaign(account, options.campaign), text = JSON.stringify(bundle);
    const result = await rpc('beta2_backup_restore', { p_bundle_text: text, p_sha256: digest(text), p_apply: options.apply });
    if (result?.status !== (options.apply ? 'restored' : 'dry-run') || result.ownerId !== options.account || result.campaignId !== options.campaign || result.bundleSha256 !== digest(text)) fail('Restore outcome was not confirmed. Check the live campaign with the manager before retrying.');
    write(options.apply ? 'Single campaign restored with a new revision and no active writer. Verify the codec in a paused client before enabling cloud writes. Beta 1 rows were not replayed.' : 'Dry run passed: this single campaign can be restored while maintenance gates stay closed. No data changed. Rerun with --apply --confirm-project <project-ref> only after manager review.');
    return 0;
  } catch (error) {
    if (incomplete) {
      try { const target = await directory(root, incomplete, io); await io.rm(target, { recursive: true, force: false }); } catch { /* Next serialized prune checks/removes the incomplete generation. */ }
    }
    // Never print native fetch/SQL/JSON/disk errors: they may contain secrets or private content.
    write(error instanceof BackupError ? error.message : 'Private backup operation failed; no completion or restore is claimed. Check private disk access and the runbook.');
    return 1;
  } finally {
    if (lock) {
      try { await lock.close(); await io.unlink(join(root, '.beta-backup.lock')); }
      catch { write('Private job lock could not be removed. Ask the manager to check for a running job before clearing the lock.'); }
    }
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = await runBetaBackup(process.argv.slice(2));
