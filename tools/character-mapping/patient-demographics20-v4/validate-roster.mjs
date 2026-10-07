import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractEight, inferSeatContact, loadCanvas, measure, normalizeCells, SLOTS } from '../gs026-employee-expansion-v1/pipeline.mjs';
import { assertRoster, contactContractPayload, rosterContract, directions, hash, hashText, repo, root, sourceFiles, target, tool, verifyRuntimeBaseline, verifySource } from './build-roster.mjs';
import { runtimeIntegrationState } from './runtime-contract.mjs';

const complete = process.argv.includes('--require-complete') || process.argv.includes('--require-root-review');
const reviewed = process.argv.includes('--require-root-review');
const json = file => JSON.parse(readFileSync(file, 'utf8'));
const roster = json(resolve(tool, 'roster.json'));
const ledger = json(resolve(tool, 'review-acceptance.json'));
const integration = runtimeIntegrationState();
const candidates = json(resolve(root, 'seat-contact-candidates.json'));
assert.equal(candidates.schemaVersion, 'patient-demographics20-v4-contact-candidates/v1');
const acceptance = { ...ledger, seatContacts: candidates.seatContacts };
const staging = json(resolve(root, 'staging-registry.json'));
assertRoster(roster);
verifyRuntimeBaseline();

assert.equal(staging.schemaVersion, 'patient-demographics20-v4-staging/v1');
assert.deepEqual(staging.target, target);
assert.deepEqual(staging.runtimeIntegration, integration);
assert.deepEqual(staging.rosterContract, rosterContract(roster));
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
for (const entry of staging.entries) {
  const identity = rosterByNumber.get(entry.number);
  assert(identity); assert.equal(entry.stableId, identity.stableId);
  const manifest = json(resolve(repo, entry.manifest));
  assert.equal(manifest.schemaVersion, 'patient-demographics20-v4-package/v1');
  assert.equal(manifest.status, integration.ready ? 'owner-approved-locally-integrated' : integration.authorized ? 'owner-approved-packaged' : 'candidate-packaged-not-runtime-ready');
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
      assert.equal(detail.anchors.seatContactStatus, integration.authorized ? 'owner-approved-authored-contact' : 'candidate-no-runtime-promotion');
    }
  }
  assert.equal(new Set(poseHashes).size, 8, 'duplicated derived views');
  assert.equal(Object.keys(manifest.poses.stand).length + Object.keys(manifest.poses.sit).length, 8);
  for (const proof of Object.values(manifest.proofs)) assert.equal(hash(resolve(repo, proof.file)), proof.sha256);
  reportEntries.push({ number: entry.number, sourceSha256: entry.sourceSha256, poses: alphaPoses });
}
assert.equal(new Set(allPoseHashes).size, staging.entries.length * 8, 'duplicate derived pose across identities');
const alphaFile = resolve(repo, staging.derivedAlphaReport.path);
assert.equal(hash(alphaFile), staging.derivedAlphaReport.sha256);
assert.deepEqual(json(alphaFile).entries, reportEntries);
const warningAccepted = acceptance.derivedAlphaWarningAcceptance?.reviewer === 'root' && acceptance.derivedAlphaWarningAcceptance?.reportSha256 === hash(alphaFile);
assert.equal(staging.derivedAlphaReport.rootWarningAccepted, warningAccepted);
if (reviewed) assert(warningAccepted, 'exact derived-alpha report lacks root warning acceptance');

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
  assert.equal(staging.entries.length, 20, 'incomplete patient roster');
  assert.deepEqual(staging.entries.map(entry => entry.number), roster.identities.map(identity => identity.number));
  assert.equal(staging.totals.poses, 160); assert.equal(staging.issues.length, 0);
}
const result = {
  status: 'PASS', requireComplete: complete, requireRootReview: reviewed,
  identities: staging.entries.length, poses: staging.entries.length * 8, reportedIssues: staging.issues.length,
  runtimeBaseline: 'prior205 identities/1670 assets and96 selectable patients preserved', runtimeReady: integration.ready, ownerApproval: integration.ownerApproval,
};
mkdirSync(resolve(root, 'validation'), { recursive: true });
writeFileSync(resolve(root, 'validation', reviewed ? 'root-review-results.json' : complete ? 'complete-results.json' : 'candidate-results.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
