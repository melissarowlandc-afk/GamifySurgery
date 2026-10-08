import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractEight, inferSeatContact, loadCanvas, measure, normalizeCells, SLOTS } from '../gs026-employee-expansion-v1/pipeline.mjs';
import { assertRoster, contactContractPayload, rosterContract, directions, hash, hashText, repo, root, sourceFiles, target, tool, verifyRuntimeBaseline, verifySource } from './build-roster.mjs';
import { alphaSummary, contactAnchorStatus, packageStatus, reviewState } from './build-roster.mjs';

const complete = process.argv.includes('--require-complete') || process.argv.includes('--require-root-review');
const reviewed = process.argv.includes('--require-root-review');
const json = file => JSON.parse(readFileSync(file, 'utf8'));
const roster = json(resolve(tool, 'roster.json'));
const ledger = json(resolve(tool, 'review-acceptance.json'));
const ledgerSha256 = hash(resolve(tool, 'review-acceptance.json'));
assert.equal(ledger.schemaVersion, 'future-roster20-v5-review/v1');
const integration = reviewState();
const candidates = json(resolve(root, 'seat-contact-candidates.json'));
assert.equal(candidates.schemaVersion, 'future-roster20-v5-contact-candidates/v1');
const acceptance = { ...ledger, seatContacts: candidates.seatContacts };
const staging = json(resolve(root, 'staging-registry.json'));
assertRoster(roster);
const baseline = verifyRuntimeBaseline();

assert.equal(staging.schemaVersion, 'future-roster20-v5-staging/v1');
assert.equal(staging.runtimeReady, false); assert.equal(staging.ownerApproval, 'pending');
assert.deepEqual(staging.target, target);
assert.deepEqual(staging.runtimeIntegration, integration);
assert.deepEqual(staging.rosterContract, rosterContract(roster));
assert.deepEqual(staging.coverageAudit, roster.coverageAudit);
assert.deepEqual(staging.rosterEvidence, { path: 'tools/character-mapping/future-roster20-v5/roster.json', sha256: hash(resolve(tool, 'roster.json')) });
assert.deepEqual(staging.reviewLedger, { path: 'tools/character-mapping/future-roster20-v5/review-acceptance.json', sha256: ledgerSha256 });
assert.equal(staging.totals.expected, 20);
assert.equal(staging.totals.packaged, staging.entries.length);
assert.equal(staging.totals.poses, staging.entries.length * 8);
assert.equal(staging.totals.issues, staging.issues.length);
assert.equal(staging.entries.length + staging.issues.length, 20);
const rosterByNumber = new Map(roster.identities.map(item => [item.number, item]));
assert.equal(new Set(staging.entries.map(item => item.number)).size, staging.entries.length);
assert.equal(new Set([...staging.entries, ...staging.issues].map(item => item.number)).size, 20);
assert.equal(new Set(staging.entries.map(item => item.stableId)).size, staging.entries.length);
assert.equal(new Set(staging.entries.map(item => item.sourceSha256)).size, staging.entries.length);
for (const issue of staging.issues) {
  assert(rosterByNumber.has(issue.number));
  assert(['missing-source', 'source-or-package-failed'].includes(issue.status));
}
const contactHash = hashText(JSON.stringify(contactContractPayload(roster, acceptance)));
assert.equal(staging.seatContactContractSha256, contactHash);
if (reviewed) { assert.equal(acceptance.reviewer, 'root', 'source acceptance must name root as reviewer');
  assert.equal(acceptance.seatContactAcceptance?.reviewer, 'root');
  assert.equal(acceptance.seatContactAcceptance?.contractSha256, contactHash);
  assert(ledger.manualContactEvidence && !Array.isArray(ledger.manualContactEvidence), 'manual contact evidence must be keyed by identity');
  assert.deepEqual(Object.keys(ledger.manualContactEvidence).sort(), roster.identities.map(identity => identity.number).sort(), 'root review requires exactly20 manual contact evidence entries');
  const evidenceRoot = resolve(root, 'root-review/contact-overlays');
  for (const identity of roster.identities) {
    const evidence = ledger.manualContactEvidence[identity.number];
    assert(typeof evidence?.file === 'string' && /\.png$/i.test(evidence.file), 'manual evidence must be a PNG');
    const file = resolve(repo, evidence.file), within = relative(evidenceRoot, file);
    assert(within && !within.startsWith('..') && !isAbsolute(within), 'manual evidence must stay within this batch contact-overlays');
    assert(existsSync(file), 'manual evidence PNG is missing');
    const actualWithin = relative(realpathSync(evidenceRoot), realpathSync(file));
    assert(actualWithin && !actualWithin.startsWith('..') && !isAbsolute(actualWithin), 'manual evidence resolves outside contact-overlays');
    assert.equal(readFileSync(file).subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'manual evidence is not a PNG');
    assert.equal(hash(file), evidence.sha256, 'manual evidence differs from its exact root ledger hash');
    assert(typeof evidence.method === 'string' && evidence.method.trim().length > 0, 'manual review method is required');
  }
}

function alphaAnalysis(cell, canvas, transform) {
  const source = cell.canvas.getContext('2d').getImageData(0, 0, cell.canvas.width, cell.canvas.height).data;
  let sourceNonzeroPixelsWithFootprintOutside = 0, maxSourceAlphaWithFootprintOutside = 0;
  for (let y = 0; y < cell.canvas.height; y++) for (let x = 0; x < cell.canvas.width; x++) {
    const alpha = source[(y * cell.canvas.width + x) * 4 + 3];
    if (!alpha) continue;
    if (transform.translateX + x * transform.scale < 0 || transform.translateX + (x + 1) * transform.scale > canvas.width ||
        transform.translateY + y * transform.scale < 0 || transform.translateY + (y + 1) * transform.scale > canvas.height) {
      sourceNonzeroPixelsWithFootprintOutside++;
      maxSourceAlphaWithFootprintOutside = Math.max(maxSourceAlphaWithFootprintOutside, alpha);
    }
  }
  const output = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  let derivedBorderNonzeroPixels = 0, derivedBorderMaxAlpha = 0;
  for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
    if (x && y && x !== canvas.width - 1 && y !== canvas.height - 1) continue;
    const alpha = output[(y * canvas.width + x) * 4 + 3];
    if (alpha) { derivedBorderNonzeroPixels++; derivedBorderMaxAlpha = Math.max(derivedBorderMaxAlpha, alpha); }
  }
  return { analysisThreshold: 13, sourceNonzeroPixelsWithFootprintOutside, maxSourceAlphaWithFootprintOutside, derivedBorderNonzeroPixels, derivedBorderMaxAlpha };
}

const reportEntries = [], allPoseHashes = [];
let reviewSnapshots = 0;
for (const entry of staging.entries) {
  const identity = rosterByNumber.get(entry.number);
  assert(identity); assert.equal(entry.stableId, identity.stableId);
  const manifest = json(resolve(repo, entry.manifest));
  assert.equal(manifest.schemaVersion, 'future-roster20-v5-package/v1');
  assert.equal(manifest.runtimeReady, false); assert.equal(manifest.ownerApproval, 'pending');
  assert.equal(manifest.status, packageStatus(ledger.accepted?.[entry.number] === entry.sourceSha256, candidates.seatContacts[entry.number]));
  assert.deepEqual(manifest.runtimeIntegration, integration);
  assert.deepEqual(manifest.identity, identity);
  assert.deepEqual(manifest.normalization.target, target);
  const sources = verifySource(identity); assert.deepEqual(manifest.provenanceValidation, { stage1: sources.stage1.validationKind, stage2: sources.stage2.validationKind, stage2Chain: sources.stage2.provenanceChain });
  for (const [stage, evidence] of Object.entries(sources)) for (const [kind, file] of Object.entries(evidence.files)) {
    assert.equal(resolve(repo, manifest.source[stage][kind].path), file);
    assert.equal(manifest.source[stage][kind].sha256, hash(file));
  }
  assert.equal(sources.stage2.sha256, entry.sourceSha256);
  assert(!acceptance.rejected?.[entry.number]?.includes(entry.sourceSha256), 'known rejected source');
  const accepted = acceptance.accepted?.[entry.number] === entry.sourceSha256;
  assert.equal(entry.rootVisualAccepted, accepted);
  assert.equal(manifest.rootVisualAcceptance.accepted, accepted);
  assert.equal(manifest.rootVisualAcceptance.sourceSha256, entry.sourceSha256);
  if (reviewed) assert(accepted, 'source lacks exact root visual acceptance ' + entry.number);
  const contacts = acceptance.seatContacts[entry.number];
  assert.equal(contacts.sourceSha256, entry.sourceSha256);
  const coordinates = Object.fromEntries(directions.map(direction => [direction, contacts[direction]]));
  assert.deepEqual(entry.contactCoordinates, coordinates);
  assert.deepEqual(manifest.seatContactAcceptance.coordinates, coordinates);
  assert.deepEqual(manifest.seatContactAcceptance.reviewedDirections, contacts.approvedDirections);
  assert.deepEqual(entry.contactDirectionsReviewed, contacts.approvedDirections);
  if (reviewed) assert.deepEqual([...contacts.approvedDirections].sort(), [...directions].sort(), 'unreviewed contact cardinal ' + entry.number);
  for (const stage of ['stage1', 'stage2']) {
    const image = await loadCanvas(sources[stage].files.png);
    const pixels = image.getContext('2d').getImageData(0, 0, image.width, image.height).data;
    assert(pixels.some((value, index) => index % 4 === 3 && value === 0), 'source lacks alpha-zero transparency ' + entry.number + '/' + stage);
  }
  const extraction = extractEight(await loadCanvas(sources.stage2.files.png));
  const expectedFrames = normalizeCells(extraction.cells, target);
  const ledgerContacts = ledger.seatContacts?.[entry.number];
  const expectedContacts = ledgerContacts?.sourceSha256 === entry.sourceSha256 ? ledgerContacts : {
    sourceSha256: entry.sourceSha256,
    ...Object.fromEntries(directions.map((direction, index) => [direction, Math.round(inferSeatContact(expectedFrames[index + 4]))])),
    approvedDirections: [], status: 'derived-candidate-pending-root-directional-review',
  };
  assert.deepEqual(contacts, expectedContacts, 'contact candidates differ from explicit ledger or independent inference');
  if (reviewed) assert.equal(ledgerContacts?.sourceSha256, entry.sourceSha256, 'root review requires explicit hash-bound contact ledger');
  assert.deepEqual(manifest.extraction.sourceRects, extraction.cells.map(cell => cell.sourceRect));
  assert.equal(manifest.extraction.componentCount, extraction.componentCount);
  assert.deepEqual(manifest.extraction.ignoredComponents, extraction.ignoredComponents);
  const alphaPoses = { stand: {}, sit: {} }, poseHashes = [];
  for (const [index, slot] of SLOTS.entries()) {
    const detail = manifest.poses[slot.pose][slot.direction], file = resolve(repo, detail.file);
    assert(existsSync(file)); assert.equal(hash(file), detail.sha256);
    const bytes = readFileSync(file);
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'pose is not PNG');
    assert.equal(bytes.readUInt32BE(16), 160); assert.equal(bytes.readUInt32BE(20), 320);
    assert.equal(bytes[24], 8, 'pose must use 8-bit channels'); assert.equal(bytes[25], 6, 'pose must be RGBA');
    assert.equal(detail.sha256, createHash('sha256').update(expectedFrames[index].canvas.toBuffer('image/png')).digest('hex'), 'derived pose differs from immutable GS026 output');
    poseHashes.push(detail.sha256); allPoseHashes.push(detail.sha256);
    const canvas = await loadCanvas(file), metrics = measure(canvas);
    assert.equal(canvas.width, 160); assert.equal(canvas.height, 320); assert.equal(metrics.borderPixels, 0);
    assert.deepEqual(detail.visibleBounds, metrics.visibleBounds);
    assert.deepEqual(detail.transform, expectedFrames[index].transform);
    assert.equal(detail.anchors.bodyAxisX, 80); assert.equal(detail.anchors.floorY, 287);
    const alpha = alphaAnalysis(extraction.cells[index], canvas, detail.transform);
    assert(alpha.maxSourceAlphaWithFootprintOutside < 13, 'clipped protected alpha');
    assert.deepEqual(detail.alphaNormalization, alpha);
    alphaPoses[slot.pose][slot.direction] = alpha;
    if (slot.pose === 'sit') {
      assert.equal(detail.anchors.seatContactY, contacts[slot.direction]);
      assert.equal(detail.anchors.seatContactStatus, contactAnchorStatus(contacts, slot.direction));
    }
  }
  assert.equal(new Set(poseHashes).size, 8, 'duplicated derived views');
  assert.equal(Object.keys(manifest.poses.stand).length + Object.keys(manifest.poses.sit).length, 8);
  for (const proof of Object.values(manifest.proofs)) assert.equal(hash(resolve(repo, proof.file)), proof.sha256);
  const history = resolve(root, 'packages', entry.number, 'review-history');
  if (existsSync(history)) for (const directory of readdirSync(history)) {
    const receipt = json(resolve(history, directory, 'snapshot-receipt.json'));
    assert.equal(receipt.schemaVersion, 'future-roster20-v5-review-snapshot/v1');
    assert.equal(receipt.number, entry.number); assert.equal(receipt.originalManifest.sha256, directory);
    assert.equal(receipt.files.length, 13); assert.equal(new Set(receipt.files.map(item => item.file)).size, 13);
    for (const item of receipt.files) {
      assert(!item.file.includes('/') && !item.file.includes('\\'), 'snapshot paths must be local filenames');
      assert.equal(hash(resolve(history, directory, item.file)), item.sha256, 'historical review evidence hash changed');
    }
    const previous = json(resolve(history, directory, receipt.originalManifest.file));
    assert.equal(hash(resolve(history, directory, receipt.originalManifest.file)), receipt.originalManifest.sha256);
    assert.equal(previous.source.stage2.png.sha256, receipt.sourceSha256);
    assert.deepEqual(previous.seatContactAcceptance.coordinates, receipt.contactCoordinates);
    assert.deepEqual(previous.seatContactAcceptance.reviewedDirections, receipt.reviewedDirections);
    reviewSnapshots++;
  }
  reportEntries.push({ number: entry.number, sourceSha256: entry.sourceSha256, poses: alphaPoses });
}
assert.equal(new Set(allPoseHashes).size, staging.entries.length * 8, 'duplicate derived pose across identities');
const existingHashes = new Set(baseline.assets.map(asset => asset.sha256));
assert(allPoseHashes.every(sha256 => !existingHashes.has(sha256)), 'new pose duplicates an existing runtime asset');
const alphaFile = resolve(repo, staging.derivedAlphaReport.path);
assert.equal(hash(alphaFile), staging.derivedAlphaReport.sha256);
assert.deepEqual(json(alphaFile).entries, reportEntries);
assert.deepEqual(json(alphaFile).summary, alphaSummary(reportEntries));
assert.equal(json(alphaFile).summary.protectedAlphaClipping, false);
const warningAccepted = acceptance.derivedAlphaWarningAcceptance?.reviewer === 'root' && acceptance.derivedAlphaWarningAcceptance?.reportSha256 === hash(alphaFile);
assert.equal(staging.derivedAlphaReport.rootWarningAccepted, warningAccepted);
if (reviewed) assert(warningAccepted, 'exact derived-alpha report lacks root warning acceptance');
const reviewReady = staging.entries.length === 20 && staging.issues.length === 0 && staging.entries.every(entry => entry.rootVisualAccepted && entry.contactDirectionsReviewed?.length === 4) && warningAccepted;
assert.equal(staging.status, reviewReady ? 'review-ready-pending-owner-approval' : 'candidate-review-root-checks-pending');
if (reviewed) assert(reviewReady, 'batch must remain explicitly pending owner approval after root review');

function validateHtml(file) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    assert(!/^(https?:|javascript:|data:)/.test(match[1]), 'review must use local artifact links');
    assert(existsSync(resolve(file, '..', match[1])), 'broken gallery link ' + match[1]);
  }
}
validateHtml(resolve(root, 'review/index.html'));
validateHtml(resolve(root, 'contact-review/index.html'));
const contactReview = json(resolve(root, 'contact-review/contact-review-manifest.json'));
assert.deepEqual(contactReview.pages.flatMap(page => page.identities), staging.entries.map(entry => entry.number));
for (const page of contactReview.pages) assert.equal(hash(resolve(repo, page.proof.file)), page.proof.sha256);
validateHtml(resolve(root, 'review/source-review.html'));
const sourceReview = json(resolve(root, 'review/source-review-manifest.json'));
const availableSources = roster.identities.filter(identity => existsSync(sourceFiles(identity).png)).map(identity => identity.number);
assert.deepEqual(sourceReview.pages.flatMap(page => page.sources.map(source => source.number)), availableSources);
for (const page of sourceReview.pages) {
  const file = resolve(repo, page.proof.file);
  assert.equal(hash(file), page.proof.sha256);
  const image = await loadCanvas(file); assert.equal(image.width, 1536); assert.equal(image.height, 1080);
  for (const source of page.sources) {
    const identity = rosterByNumber.get(source.number); assert(identity);
    assert.equal(resolve(repo, source.path), sourceFiles(identity).png);
    assert.equal(source.sha256, hash(sourceFiles(identity).png));
  }
}
if (complete) assert.equal(sourceReview.pages.length, 5, 'incomplete native source review boards');
if (complete) {
  assert.equal(staging.entries.length, 20, 'incomplete character roster');
  assert.deepEqual(staging.entries.map(entry => entry.number), roster.identities.map(identity => identity.number));
  assert.equal(staging.totals.poses, 160); assert.equal(staging.issues.length, 0);
}
verifyRuntimeBaseline();
assert.equal(hash(resolve(tool, 'review-acceptance.json')), ledgerSha256, 'root ledger changed during validation; rebuild the review snapshot');
const result = {
  status: 'PASS', requireComplete: complete, requireRootReview: reviewed,
  identities: staging.entries.length, poses: staging.entries.length * 8, reportedIssues: staging.issues.length,
  immutableReviewSnapshots: reviewSnapshots,
  rosterContract: rosterContract(roster), reviewStatus: staging.status,
  runtimeBaseline: '225 identities/1830 assets and116 selectable patients preserved', runtimeReady: integration.ready, ownerApproval: integration.ownerApproval,
};
mkdirSync(resolve(root, 'validation'), { recursive: true });
writeFileSync(resolve(root, 'validation', reviewed ? 'root-review-results.json' : complete ? 'complete-results.json' : 'candidate-results.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
