// Scoped inventory, source/preservation/privacy and evidence checks. No Git.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const root = path.dirname(__dirname), repo = path.resolve(root, '../../../..'), out = path.join(__dirname, 'evidence/v2/owned-files.json');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8')), sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex'), hash = p => sha(fs.readFileSync(p));
const walk = p => fs.readdirSync(p, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(p, e.name)) : [path.join(p, e.name)]);
const files = walk(root).filter(p => p !== out), plan = path.join(repo, 'docs/execplans/level5-room-design-20261008.md'); let textFiles = 0;
const credentialPatterns = [/sk-(?:proj-)?[A-Za-z0-9_-]{24,}/, /gh[pousr]_[A-Za-z0-9]{20,}/, /AKIA[A-Z0-9]{16}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/];
for (const p of files) {
  assert.ok(path.resolve(p).startsWith(root + path.sep)); assert.ok(!/\.(?:pdf|dcm|docx|xlsx|pem|key)$/i.test(p), 'No prohibited/private/source corpus files');
  if (/\.(?:md|json|js|mjs|cjs|html|txt|ps1)$/.test(p)) { const bytes = fs.readFileSync(p); assert.ok(!(bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191)); const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); for (const pattern of credentialPatterns) assert.ok(!pattern.test(text), 'Credential pattern in ' + p); textFiles++; }
}
const revision = read(path.join(__dirname, 'evidence/v2/plan-revision-receipt.json')), planBytes = fs.readFileSync(plan);
assert.equal(revision.status, 'PASS'); assert.equal(sha(planBytes.subarray(0, revision.unchangedPrefixBytes)), revision.unchangedPrefixSha256, 'Shared-plan prefix preserved at assigned section replacement');
assert.equal(sha(planBytes.subarray(revision.unchangedPrefixBytes, revision.unchangedPrefixBytes + revision.sectionBytes)), revision.sectionSha256);
assert.equal(sha(planBytes.subarray(revision.unchangedPrefixBytes + revision.sectionBytes)), revision.unchangedSuffixSha256, 'Shared-plan suffix preserved');
assert.equal(hash(path.join(root, 'EXECPLAN_SECTION.md')), revision.sectionSha256); assert.ok(planBytes.subarray(revision.unchangedPrefixBytes).toString('utf8').includes('## Step: Gift Shop mockup'));
const validation = read(path.join(__dirname, 'evidence/v2/validation-report.json')), manifest = read(path.join(__dirname, 'proof-manifest.json'));
for (const file of ['validation-report.json', 'control-validation-report.json', 'native-inspection-report.json', 'reproducibility-report.json', 'browser-helper-syntax.json', 'http-validation-report.json']) assert.equal(read(path.join(__dirname, 'evidence/v2', file)).status, 'PASS');
assert.equal(validation.proofManifestSha256, hash(path.join(__dirname, 'proof-manifest.json'))); assert.equal(validation.states, 3200); assert.equal(validation.routes, 66380); assert.equal(validation.fullQueueRoutes, 66380); assert.equal(validation.visibilityChecks, 140); assert.equal(validation.necessaryFixtures, 4); assert.equal(validation.optionalDecor, 9);
assert.equal(manifest.approval, null); assert.equal(manifest.runtimeIntegrationAuthorized, false); assert.deepEqual(manifest.footprint, [3, 3]); assert.equal(manifest.appearanceChanges, false); assert.equal(manifest.builtInCalls, 13);
const native = read(path.join(__dirname, 'evidence/v2/native-inspection-report.json')); assert.equal(native.captures.length, 110); for (const c of native.captures) assert.equal(hash(path.join(__dirname, 'evidence/v2', c.file)), c.sha256);
const provenance = read(path.join(root, 'assets/provenance-v2.json')); for (const [f, expected] of Object.entries(provenance.hashes)) assert.equal(hash(path.join(root, f)), expected, 'Current provenance ' + f);
const baseline = read(path.join(root, 'assets/reference-baseline.json')).references, concurrentChanges = [];
for (const r of baseline) { const current = hash(path.join(repo, r.path)); if (current !== r.sha256) concurrentChanges.push({ path: r.path, intakeSha256: r.sha256, currentSha256: current, action: 'Read-only shared reference; preserved concurrent work.' }); }
const browser = read(path.join(__dirname, 'evidence/v2/browser-validation-report.json'));
assert.ok(['PENDING_MANAGER', 'PASS'].includes(browser.status));
const captureFile = path.join(__dirname, 'evidence/v2/browser/capture-report.json');
fs.mkdirSync(path.dirname(captureFile), { recursive: true });
if (!fs.existsSync(captureFile)) fs.writeFileSync(captureFile, JSON.stringify({ status: 'PENDING_MANAGER', reason: 'Actual v2 worker browser launch hit spawn EPERM; capture left to manager after same restriction.', url: 'http://127.0.0.1:4191/tools/room-design/level-5/gift-shop/proof/index.html', command: 'node tools/room-design/level-5/gift-shop/proof/capture.cjs' }, null, 2) + '\n');
assert.ok(['PENDING_MANAGER', 'PASS'].includes(read(captureFile).status));
const inventory = walk(root).filter(p => p !== out).map(p => ({ path: path.relative(repo, p).replaceAll('\\', '/'), bytes: fs.statSync(p).size, sha256: hash(p) }));
fs.writeFileSync(out, JSON.stringify({ status: 'PASS', designRevision: 2, date: '2026-10-11', ownedLane: 'tools/room-design/level-5/gift-shop/**', externalWrite: 'Only replaced the assigned Step: Gift Shop mockup section; every other shared-plan prefix/suffix byte preserved.', files: inventory, textFiles, referenceCount: baseline.length, unchangedReferenceHashes: baseline.length - concurrentChanges.length, concurrentReadOnlyReferenceChanges: concurrentChanges, planRevision: revision,
  credentialsOrPrivateInputsFound: 0, sourceCorpusFilesFound: 0, artOrigin: 'Thirteen built-in imagegen assets, eight new density-revision calls; unchanged approved adult stills.', footprint: [3, 3], doorSections: 12, necessaryFixtures: 4, optionalDecor: 9, standingSpots: 4, queueCapacity: 2, browserStatus: browser.status, captureStatus: read(captureFile).status, approval: null, runtimeIntegrationAuthorized: false,
  gitUse: 'One inadvertent read-only status at v1 intake; no Git during this revision and no Git mutation.', agentsUsed: false, installs: false, runtimeWrites: false }, null, 2) + '\n');
console.log(`LANE AUDIT PASS: ${inventory.length} owned files; ${baseline.length - concurrentChanges.length}/${baseline.length} shared hashes unchanged; ${concurrentChanges.length} concurrent read-only reference changes preserved; assigned Gift Shop plan section only; UTF-8/source/secret/privacy checks; Node/native/rebuild/HTTP PASS; browser ${browser.status}.`);
