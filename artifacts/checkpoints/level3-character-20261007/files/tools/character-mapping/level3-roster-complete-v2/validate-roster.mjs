import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractEight, loadCanvas, measure, SLOTS } from '../gs026-employee-expansion-v1/pipeline.mjs';

const strict = process.argv.includes('--require-complete');
const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
const repo = resolve(tool, '../../..');
const root = resolve(repo, 'artifacts/character-statics/level3-roster-complete-v2');
const roster = JSON.parse(readFileSync(resolve(tool, 'roster.json'), 'utf8'));
const acceptance = JSON.parse(readFileSync(resolve(tool, 'review-acceptance.json'), 'utf8'));
const staging = JSON.parse(readFileSync(resolve(root, 'staging-registry.json'), 'utf8'));
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const hashText = value => createHash('sha256').update(value).digest('hex');
const localPath = value => isAbsolute(value) ? value : resolve(repo, value);
const directions = ['south', 'east', 'west', 'north'];

function assertRosterContract() {
  assert.equal(roster.identities.length, 32, 'roster must contain exactly 32 identities');
  assert.deepEqual(roster.identities.map(item => item.number), Array.from({ length: 32 }, (_, index) => String(index + 1).padStart(3, '0')), 'roster numbers must be exactly 001-032 in order');
  assert.equal(new Set(roster.identities.map(item => item.stableId)).size, 32, 'stable IDs must be unique');
  const count = selector => roster.identities.filter(selector).length;
  assert.equal(count(item => item.targetKey === 'adult'), 20, 'roster must contain 20 adult-target identities');
  assert.equal(count(item => item.targetKey !== 'adult'), 12, 'roster must contain 12 pediatric-target identities');
  assert.deepEqual(Object.fromEntries(['radiologist', 'surgeon', 'or-nurse', 'laboratory-technician', 'pharmacist', 'repair-person', 'patient', 'future-pediatric-presentation'].map(category => [category, count(item => item.category === category)])), { radiologist: 4, surgeon: 2, 'or-nurse': 2, 'laboratory-technician': 2, pharmacist: 2, 'repair-person': 2, patient: 6, 'future-pediatric-presentation': 12 }, 'roster category counts differ from the accepted contract');
  assert.deepEqual(Object.fromEntries(['adult', 'younger-child', 'older-child', 'teen'].map(target => [target, count(item => item.targetKey === target)])), { adult: 20, 'younger-child': 4, 'older-child': 4, teen: 4 }, 'roster target counts differ from the accepted contract');
}

function contactContractPayload() {
  return roster.identities.map(identity => ({ number: identity.number, sourceSha256: acceptance.accepted?.[identity.number], contacts: Object.fromEntries(directions.map(direction => [direction, roster.seatContacts?.[identity.number]?.[direction]])) }));
}

function verifyContactAcceptance() {
  const ledger = acceptance.seatContactAcceptance;
  assert.equal(ledger?.reviewer, 'root', 'seat-contact acceptance must be recorded by root');
  assert.equal(ledger?.contractSha256, hashText(JSON.stringify(contactContractPayload())), 'seat-contact acceptance does not bind current source hashes and coordinates');
  for (const identity of roster.identities) {
    const contacts = roster.seatContacts?.[identity.number], target = roster.targets[identity.targetKey];
    assert(contacts && target, `missing seat-contact or target record for ${identity.number}`);
    assert.deepEqual([...contacts.approvedDirections].sort(), [...directions].sort(), `all four seat contacts must be root reviewed for ${identity.number}`);
    for (const direction of directions) assert(Number.isInteger(contacts[direction]) && contacts[direction] >= 0 && contacts[direction] < target.height, `invalid ${direction} seat contact for ${identity.number}`);
  }
}

function verifyRuntimeBaseline() {
  const file = resolve(repo, staging.baseline);
  assert(existsSync(file), 'runtime baseline is missing');
  const baseline = JSON.parse(readFileSync(file, 'utf8'));
  assert.equal(baseline.identityCount, 153, 'runtime baseline identity count changed');
  assert.equal(baseline.assetCount, 1254, 'runtime baseline asset count changed');
  assert.equal(baseline.assets.length, 1254, 'runtime baseline asset inventory is incomplete');
  assert.equal(new Set(baseline.assets.map(item => item.path)).size, 1254, 'runtime baseline asset paths must be unique');
  const registryFile = resolve(repo, baseline.registry.path);
  assert(existsSync(registryFile), 'runtime registry is missing');
  const registry = JSON.parse(readFileSync(registryFile, 'utf8'));
  if (hash(registryFile) === baseline.registry.sha256) {
    assert.equal(registry.characters.length, baseline.identityCount, 'runtime registry identity count differs from baseline');
    assert.equal(registry.counts?.identities, baseline.identityCount, 'runtime registry declared identity count differs from baseline');
    assert.equal(registry.counts?.assets, baseline.assetCount, 'runtime registry declared asset count differs from baseline');
  } else {
    const integrationManifest = JSON.parse(readFileSync(resolve(root, 'runtime-integration-baseline/manifest.json'), 'utf8'));
    const snapshot = integrationManifest.files.find(item => item.path === baseline.registry.path);
    assert(snapshot && !snapshot.missing, 'append-only integration requires a pre-edit registry snapshot');
    const historicalFile = resolve(repo, snapshot.copiedTo);
    assert.equal(hash(historicalFile), baseline.registry.sha256, 'pre-edit registry snapshot differs from immutable baseline');
    const historical = JSON.parse(readFileSync(historicalFile, 'utf8'));
    assert.deepEqual(registry.characters.slice(0, baseline.identityCount), historical.characters, 'runtime integration changed a baseline registry entry');
    assert.equal(registry.characters.length, 185, 'authorized append-only integration must produce 185 identities');
    assert.equal(registry.counts?.identities, 185, 'authorized append-only integration declared identity count differs');
    assert.equal(registry.counts?.assets, 1510, 'authorized append-only integration declared asset count differs');
  }
  for (const item of baseline.assets) {
    const asset = resolve(repo, item.path);
    assert(existsSync(asset), `runtime baseline asset missing: ${item.path}`);
    assert.equal(hash(asset), item.sha256, `runtime baseline asset changed: ${item.path}`);
  }
}

function verifySource(identity, manifest) {
  const sourceFile = resolve(repo, manifest.source.png.path), promptFile = resolve(repo, manifest.source.exactPrompt.path), argsFile = resolve(repo, manifest.source.toolArguments.path), provenanceFile = resolve(repo, manifest.source.provenance.path);
  for (const file of [sourceFile, promptFile, argsFile, provenanceFile]) assert(existsSync(file), `source evidence missing for ${identity.number}: ${file}`);
  assert.equal(hash(sourceFile), manifest.source.png.sha256, `native source hash mismatch ${identity.number}`);
  assert.equal(hash(promptFile), manifest.source.exactPrompt.sha256, `exact prompt hash mismatch ${identity.number}`);
  assert.equal(hash(argsFile), manifest.source.toolArguments.sha256, `tool-args hash mismatch ${identity.number}`);
  assert.equal(hash(provenanceFile), manifest.source.provenance.sha256, `provenance hash mismatch ${identity.number}`);
  const prompt = readFileSync(promptFile, 'utf8'), args = JSON.parse(readFileSync(argsFile, 'utf8')), provenance = JSON.parse(readFileSync(provenanceFile, 'utf8'));
  assert.equal(args.prompt, prompt, `tool-args prompt differs from exact prompt ${identity.number}`);
  assert.equal(args.transparent_background, true, `transparent-background argument missing ${identity.number}`);
  assert.equal(provenance.nativeOutput?.sha256, hash(sourceFile), `native-output hash does not bind source ${identity.number}`);
  assert(typeof provenance.nativeOutput?.path === 'string' && existsSync(provenance.nativeOutput.path), `native output unavailable ${identity.number}`);
  assert.equal(hash(provenance.nativeOutput.path), hash(sourceFile), `workspace source differs from native output ${identity.number}`);
  assert.equal(provenance.workspaceCopy?.path, 'source.png', `workspace-copy path mismatch ${identity.number}`);
  assert.equal(provenance.workspaceCopy?.sha256, hash(sourceFile), `workspace-copy hash mismatch ${identity.number}`);
  assert.equal(provenance.prompt?.path, 'exact-prompt.txt', `provenance prompt path mismatch ${identity.number}`);
  assert.equal(provenance.prompt?.sha256, hash(promptFile), `provenance prompt hash mismatch ${identity.number}`);
  assert.deepEqual(args.referenced_image_paths, provenance.references?.map(item => item.path), `reference order/path mismatch ${identity.number}`);
  for (const item of provenance.references) {
    const evidence = localPath(item.preservedCopyPath ?? item.path);
    assert(existsSync(evidence), `reference evidence missing ${identity.number}: ${item.path}`);
    assert.equal(hash(evidence), item.sha256, `reference evidence hash mismatch ${identity.number}: ${item.path}`);
  }
  return sourceFile;
}

function alphaClipAnalysis(cell, frame, transform, target) {
  const data = cell.canvas.getContext('2d').getImageData(0, 0, cell.canvas.width, cell.canvas.height).data;
  let sourceNonzeroPixelsWithFootprintOutside = 0, maxSourceAlphaWithFootprintOutside = 0;
  for (let y = 0; y < cell.canvas.height; y++) for (let x = 0; x < cell.canvas.width; x++) {
    const alpha = data[(y * cell.canvas.width + x) * 4 + 3];
    if (!alpha) continue;
    const left = transform.translateX + x * transform.scale, right = transform.translateX + (x + 1) * transform.scale, top = transform.translateY + y * transform.scale, bottom = transform.translateY + (y + 1) * transform.scale;
    if (left < 0 || right > target.width || top < 0 || bottom > target.height) { sourceNonzeroPixelsWithFootprintOutside++; maxSourceAlphaWithFootprintOutside = Math.max(maxSourceAlphaWithFootprintOutside, alpha); }
  }
  const output = frame.getContext('2d').getImageData(0, 0, frame.width, frame.height).data;
  let derivedBorderNonzeroPixels = 0, derivedBorderMaxAlpha = 0;
  for (let y = 0; y < frame.height; y++) for (let x = 0; x < frame.width; x++) {
    if (x !== 0 && y !== 0 && x !== frame.width - 1 && y !== frame.height - 1) continue;
    const alpha = output[(y * frame.width + x) * 4 + 3];
    if (alpha) { derivedBorderNonzeroPixels++; derivedBorderMaxAlpha = Math.max(derivedBorderMaxAlpha, alpha); }
  }
  return { analysisThreshold: 13, sourceNonzeroPixelsWithFootprintOutside, maxSourceAlphaWithFootprintOutside, derivedBorderNonzeroPixels, derivedBorderMaxAlpha };
}

assertRosterContract();
verifyContactAcceptance();
verifyRuntimeBaseline();
assert.equal(staging.runtimeIntegration.authorized, false, 'this staging package must not authorize runtime integration');
assert.equal(staging.runtimeIntegration.ready, false, 'this staging package must not claim runtime readiness');
assert.deepEqual(staging.rosterContract, { identities: 32, posesPerIdentity: 8, totalPoses: 256, adultTargets: 20, pediatricTargets: 12 }, 'staging roster contract mismatch');

const rosterByNumber = new Map(roster.identities.map(identity => [identity.number, identity]));
assert.equal(new Set(staging.entries.map(entry => entry.number)).size, staging.entries.length, 'staging identity numbers must be unique');
assert.equal(new Set(staging.entries.map(entry => entry.stableId)).size, staging.entries.length, 'staging stable IDs must be unique');
const reportEntries = [];
for (const entry of staging.entries) {
  const identity = rosterByNumber.get(entry.number);
  assert(identity, `staging includes unknown identity ${entry.number}`);
  assert.equal(entry.stableId, identity.stableId, `staging stable ID mismatch ${entry.number}`);
  const manifestFile = resolve(repo, entry.manifest);
  assert(existsSync(manifestFile), `missing package manifest ${entry.number}`);
  const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
  assert.deepEqual(manifest.identity, identity, `manifest identity mismatch ${entry.number}`);
  const sourceFile = verifySource(identity, manifest);
  assert.equal(manifest.source.png.sha256, entry.sourceSha256, `source hash mismatch ${entry.number}`);
  assert.equal(acceptance.accepted?.[entry.number], entry.sourceSha256, `missing exact root visual acceptance ${entry.number}`);
  assert(!acceptance.rejected?.[entry.number]?.includes(entry.sourceSha256), `known rejected source hash ${entry.number}`);
  assert.equal(manifest.seatContactAcceptance?.contractSha256, acceptance.seatContactAcceptance.contractSha256, `contact ledger mismatch ${entry.number}`);
  assert.deepEqual(manifest.seatContactAcceptance?.coordinates, Object.fromEntries(directions.map(direction => [direction, roster.seatContacts[entry.number][direction]])), `manifest contact coordinates mismatch ${entry.number}`);
  assert.deepEqual(entry.contactCoordinates, manifest.seatContactAcceptance.coordinates, `staging contact coordinates mismatch ${entry.number}`);
  assert.deepEqual([...entry.contactDirectionsReviewed].sort(), [...directions].sort(), `all four contact directions must be reviewed ${entry.number}`);
  const source = await loadCanvas(sourceFile), extraction = extractEight(source), target = roster.targets[identity.targetKey], scales = new Set(), alphaPoses = { stand: {}, sit: {} };
  for (const [index, slot] of SLOTS.entries()) {
    const detail = manifest.poses?.[slot.pose]?.[slot.direction], file = resolve(repo, detail?.file ?? 'missing');
    assert(detail && existsSync(file), `missing ${entry.number}/${slot.pose}-${slot.direction}`);
    assert.equal(hash(file), detail.sha256, `derived hash mismatch ${entry.number}/${slot.pose}-${slot.direction}`);
    const canvas = await loadCanvas(file);
    assert.equal(canvas.width, target.width, `derived width mismatch ${entry.number}/${slot.pose}-${slot.direction}`);
    assert.equal(canvas.height, target.height, `derived height mismatch ${entry.number}/${slot.pose}-${slot.direction}`);
    assert.equal(measure(canvas).borderPixels, 0, `alpha>=13 clipping ${entry.number}/${slot.pose}-${slot.direction}`);
    const alpha = alphaClipAnalysis(extraction.cells[index], canvas, detail.transform, target);
    assert(alpha.maxSourceAlphaWithFootprintOutside < 13, `normalization clips alpha>=13 ${entry.number}/${slot.pose}-${slot.direction}`);
    assert.deepEqual(detail.alphaNormalization, alpha, `alpha normalization measurement mismatch ${entry.number}/${slot.pose}-${slot.direction}`);
    if (slot.pose === 'sit') {
      assert.equal(detail.anchors.seatContactY, roster.seatContacts[entry.number][slot.direction], `seat-contact anchor mismatch ${entry.number}/${slot.direction}`);
      assert.equal(detail.anchors.seatContactStatus, 'root-reviewed-contact-candidate;no-runtime-promotion', `seat-contact status mismatch ${entry.number}/${slot.direction}`);
    }
    scales.add(detail.transform.scale);
    alphaPoses[slot.pose][slot.direction] = alpha;
  }
  assert.equal(scales.size, 1, `identity-wide scale mismatch ${entry.number}`);
  assert.equal(Object.keys(manifest.poses.stand).length + Object.keys(manifest.poses.sit).length, 8, `manifest must contain exactly eight poses ${entry.number}`);
  for (const proof of Object.values(manifest.proofs)) { const file = resolve(repo, proof.file); assert(existsSync(file), `missing proof ${entry.number}`); assert.equal(hash(file), proof.sha256, `proof hash mismatch ${entry.number}`); }
  reportEntries.push({ number: entry.number, sourceSha256: entry.sourceSha256, poses: alphaPoses });
}

const alphaReportFile = resolve(repo, staging.derivedAlphaReport.path);
assert(existsSync(alphaReportFile), 'derived-alpha report missing');
assert.equal(hash(alphaReportFile), staging.derivedAlphaReport.sha256, 'derived-alpha report hash mismatch');
const alphaReport = JSON.parse(readFileSync(alphaReportFile, 'utf8'));
assert.deepEqual(alphaReport.entries, reportEntries, 'derived-alpha report does not match independently measured packages');

if (strict) {
  assert.equal(staging.entries.length, 32, `strict package incomplete: ${staging.entries.length}/32`);
  assert.deepEqual(staging.entries.map(entry => entry.number), roster.identities.map(identity => identity.number), 'strict package identity set/order differs from roster');
  assert.equal(staging.totals.expected, 32, 'strict expected identity total mismatch');
  assert.equal(staging.totals.packaged, 32, 'strict packaged identity total mismatch');
  assert.equal(staging.totals.poses, 256, 'strict pose total mismatch');
  assert.equal(staging.issues.length, 0, `strict package has ${staging.issues.length} issue(s)`);
  assert.equal(acceptance.derivedAlphaWarningAcceptance?.reviewer, 'root', 'derived-alpha warning acceptance must be recorded by root');
  assert.equal(acceptance.derivedAlphaWarningAcceptance?.reportSha256, staging.derivedAlphaReport.sha256, 'exact derived-alpha report lacks root warning acceptance');
  assert.equal(staging.derivedAlphaReport.rootWarningAccepted, true, 'staging does not record exact derived-alpha warning acceptance');
}

console.log(JSON.stringify({ status: 'PASS', strict, identities: staging.entries.length, poses: staging.entries.length * 8, reportedIssues: staging.issues.length, runtimeBaseline: '153 identities/1254 assets unchanged', runtimeReady: false }));
