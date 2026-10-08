import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import { loadCanvas, measure } from '../gs026-employee-expansion-v1/pipeline.mjs';
import { verifyRuntimeBaseline as preservationBaseline } from './runtime-baseline.mjs';
import { contactContractPayload, directions, hash, hashText, repo, root, tool, verifyRuntimeBaseline } from './build-roster.mjs';

const json = file => JSON.parse(readFileSync(file, 'utf8'));
verifyRuntimeBaseline();
const roster = json(resolve(tool, 'roster.json'));
const ledger = json(resolve(tool, 'review-acceptance.json'));
const authoredFile = resolve(tool, 'authored-contacts.json'), authored = json(authoredFile);
const staging = json(resolve(root, 'staging-registry.json'));
const inventory = json(resolve(root, 'comparison/existing-inventory.json'));
const comparison = json(resolve(root, 'comparison/manifest.json'));
const visual = json(resolve(root, 'worker-review/visual-review.json'));
const notes = json(resolve(tool, 'worker-review-notes.json'));
const placement = json(resolve(root, 'placement-qa/placement-manifest.json'));
const contacts = json(resolve(root, 'contact-review/contact-review-manifest.json'));
const alpha = json(resolve(root, 'alpha-normalization-report.json'));
const numbers = roster.identities.map(identity => identity.number);
assert.equal(numbers.length, 19); assert.equal(new Set(numbers).size, 19);
assert.deepEqual(staging.entries.map(entry => entry.number), numbers);
assert.deepEqual(Object.keys(notes.identities).sort(), numbers);
assert.deepEqual(Object.keys(authored.coordinates).sort(), numbers);
assert.deepEqual(authored.directionOrder, directions);
assert.equal(ledger.reviewer, 'sol-v6c-worker');
assert.deepEqual(ledger.accepted, {}, 'worker must not record manager/root source acceptance');
assert.equal(staging.runtimeReady, false); assert.equal(staging.derivedAlphaReport.rootWarningAccepted, false);
assert.equal(visual.reviewer, ledger.reviewer); assert.equal(visual.managerAcceptance, 'pending');
assert.equal(visual.browserValidation, 'not-run-left-to-manager'); assert.equal(visual.runtimeReady, false);
assert.equal(visual.schemaVersion, 'patient-gapfill-v6c-worker-visual-review/v1');
assert.deepEqual(Object.keys(ledger.workerContactEvidence).sort(), numbers);
assert.deepEqual(Object.keys(ledger.workerVisualAcceptance).sort(), numbers);
assert.deepEqual(visual.identities.map(entry => entry.number), numbers);
assert.equal(visual.preGenerationExamples.length, 8);
assert.deepEqual(visual.preGenerationExamples.map(entry => entry.id), notes.beforeGenerationExamples);
assert.equal(visual.styleAssessment, notes.styleAssessment); assert.deepEqual(visual.limitations, notes.limitations);
// The batch cap is checked against visually observed final art, not just prompts.
const glassesIds = numbers.filter(number => notes.identities[number].actualGlasses === true);
assert(numbers.every(number => typeof notes.identities[number].actualGlasses === 'boolean'));
assert(numbers.every(number => notes.identities[number].grayCurlyHairWithGlasses === false));
assert.deepEqual(glassesIds, ['002', '006', '010', '013']);
assert(glassesIds.length / numbers.length <= 0.3, 'final-art glasses exceed manager cap');
assert.equal(notes.glassesAssessment.observed, glassesIds.length);
assert.equal(notes.glassesAssessment.batchSize, numbers.length);
assert.equal(notes.glassesAssessment.maximum, Math.floor(numbers.length * 0.3));
assert.equal(notes.glassesAssessment.capFraction, 0.3);
assert.equal(notes.glassesAssessment.grayCurlyHairWithGlasses, 0);
assert.deepEqual(notes.glassesAssessment.identities, glassesIds);
assert.deepEqual(visual.glassesAssessment, notes.glassesAssessment);
for (const identity of roster.identities) {
  assert.equal(identity.glasses, notes.identities[identity.number].actualGlasses);
  const [min, max] = identity.ageBand === 'older_adult' ? [65, 88] : [30, 44];
  assert(Number.isInteger(identity.intendedAge) && identity.intendedAge >= min && identity.intendedAge <= max);
}

const canvases = new Map();
async function canvas(file) {
  const absolute = resolve(repo, file);
  if (!canvases.has(absolute)) canvases.set(absolute, await loadCanvas(absolute));
  return canvases.get(absolute);
}
function checkReceipt(item) {
  assert(typeof item.path === 'string' && /^[a-f0-9]{64}$/.test(item.sha256));
  assert.equal(hash(resolve(repo, item.path)), item.sha256, 'reviewed evidence changed ' + item.path);
}
function checkOwnedOverlay(item) {
  checkReceipt(item);
  const file = realpathSync(resolve(repo, item.path)), base = realpathSync(resolve(root, 'worker-review/contact-overlays'));
  const within = relative(base, file);
  assert(within && !within.startsWith('..') && !isAbsolute(within), 'contact evidence escaped worker lane');
}
checkReceipt(visual.notes); checkReceipt(visual.styleReference);
checkReceipt(visual.comparisonManifest); checkReceipt(visual.contactLedger); checkReceipt(visual.alphaReport);
checkReceipt(visual.allCatalogComparisonManifest);
checkReceipt(visual.styleReviewManifest); checkReceipt(visual.comparisonAtlasesManifest);
checkReceipt(ledger.seatContactWorkerReview.authoredCoordinates);
assert.equal(ledger.seatContactWorkerReview.authoredCoordinates.sha256, hash(authoredFile));
assert.equal(ledger.seatContactWorkerReview.contractSha256, hashText(JSON.stringify(contactContractPayload(roster, ledger))));
assert.equal(visual.authoredContactContractSha256, ledger.seatContactWorkerReview.contractSha256);
assert.deepEqual(visual.alphaReport.summary, alpha.summary);
assert.equal(alpha.summary.poses, 152); assert.equal(alpha.summary.protectedAlphaClipping, false);
assert(alpha.summary.maxSourceAlphaWithFootprintOutside<=1); assert(alpha.summary.derivedBorderMaxAlpha<=1);
assert.equal(visual.alphaReport.status, 'worker-QA-pass-with-alpha1-noise;manager-acceptance-pending');
const fresh = [];
for (const [index, entry] of staging.entries.entries()) {
  const manifest = json(resolve(repo, entry.manifest)), reviewed = visual.identities[index];
  const contact = ledger.seatContacts[entry.number], overlay = ledger.workerContactEvidence[entry.number];
  assert.equal(reviewed.sourceSha256, entry.sourceSha256); assert.equal(contact.sourceSha256, entry.sourceSha256);
  assert.equal(overlay.sourceSha256, entry.sourceSha256);
  assert.equal(ledger.workerVisualAcceptance[entry.number].sourceSha256, entry.sourceSha256);
  assert.deepEqual(contact.workerReviewedDirections, directions); assert.deepEqual(contact.approvedDirections, []);
  const coordinates = Object.fromEntries(directions.map((direction, i) => [direction, authored.coordinates[entry.number][i]]));
  assert.deepEqual(coordinates, entry.contactCoordinates); assert.deepEqual(reviewed.contacts, coordinates);
  assert.deepEqual(overlay.coordinates, coordinates); assert.equal(overlay.method, authored.method);
  assert.deepEqual(reviewed.contactOverlay, { path: overlay.file, sha256: overlay.sha256 });
  checkOwnedOverlay(reviewed.contactOverlay);
  const overlayImage = await canvas(overlay.file); assert.equal(overlayImage.width, 1280); assert.equal(overlayImage.height, 680);
  for (const direction of directions) {
    assert(Number.isInteger(coordinates[direction]) && coordinates[direction] > 150 && coordinates[direction] < 280);
    assert.equal(contact[direction], coordinates[direction]);
    assert.equal(manifest.poses.sit[direction].anchors.seatContactY, coordinates[direction]);
  }
  assert.equal(reviewed.id, entry.stableId); assert.equal(reviewed.sex, manifest.identity.compatibleSexLabel);
  assert.equal(reviewed.age, manifest.identity.intendedAge); assert.equal(reviewed.ageBand, manifest.identity.ageBand);
  for (const key of ['features', 'distinction']) {
    assert.equal(reviewed[key], notes.identities[entry.number][key]); assert(reviewed[key].length > 40);
  }
  assert.equal(reviewed.realizationNote, notes.identities[entry.number].realizationNote ?? null);
  assert.equal(reviewed.actualGlasses, notes.identities[entry.number].actualGlasses);
  assert.equal(reviewed.grayCurlyHairWithGlasses, false);
  for (const proof of reviewed.poseProofs) checkReceipt(proof);
  assert.deepEqual(reviewed.poseProofs, ['fullLight', 'fullDark'].map(key => ({path: manifest.proofs[key].file, sha256: manifest.proofs[key].sha256})));
  const diagnostic = placement.diagnostics.find(item => item.number === entry.number);
  assert.equal(diagnostic.sourceSha256, entry.sourceSha256);
  assert.deepEqual(reviewed.chairProof, { path: diagnostic.directions.south.proof.path, sha256: diagnostic.directions.south.proof.sha256 });
  checkReceipt(reviewed.chairProof); checkReceipt(reviewed.comparisonBoard);
  const south = manifest.poses.stand.south;
  fresh.push({id: entry.stableId, number: entry.number, sex: reviewed.sex, ageBand: reviewed.ageBand, path: south.file, sha256: south.sha256, sourceSha256: entry.sourceSha256});
}
assert.deepEqual(visual.chairBoards, placement.pages.map(page => ({path: page.proof.path, sha256: page.proof.sha256})));
assert.deepEqual(visual.contactBoards, contacts.pages.map(page => ({path: page.proof.file, sha256: page.proof.sha256})));
for (const proof of [...visual.chairBoards, ...visual.contactBoards]) checkReceipt(proof);

// Reconstruct the comparison set from the unchanged runtime catalog, then
// recompute every numerical score rather than trusting the builder's flags.
const pinned=preservationBaseline();
const acceptedRosters=['patient-gapfill-v6a','patient-gapfill-v6b'].flatMap(batch=>json(resolve(repo,'tools/character-mapping',batch,'roster.json')).identities);
const catalog = [...pinned.priorCatalog.filter(item => item.category === 'patient' && ['adult', 'older_adult'].includes(item.ageBand)),...acceptedRosters.filter(item=>['adult','older_adult'].includes(item.ageBand)).map(item=>({...item,stillId:item.stableId}))];
assert.equal(catalog.length, 75); assert.equal(inventory.identities.length, catalog.length);
assert.deepEqual(inventory.identities.map(item => item.stillId).sort(), catalog.map(item => item.stillId).sort());
const old = inventory.identities.map(item => {
  const current = catalog.find(candidate => candidate.stillId === item.stillId);
  assert.equal(item.compatibleSexLabel, current.compatibleSexLabel); assert.equal(item.ageBand, current.ageBand);
  checkReceipt(item.standSouth);
  return { id: item.stillId, sex: item.compatibleSexLabel, ageBand: item.ageBand, path: item.standSouth.path, sha256: item.standSouth.sha256 };
});
for (const example of visual.preGenerationExamples) {
  const prior = old.find(item => item.id === example.id); assert(prior);
  assert.deepEqual(example.pose, {path: prior.path, sha256: prior.sha256}); checkReceipt(example.pose);
}
assert.deepEqual(visual.existingBandBoards, inventory.boards.map(board => ({sex: board.sex, ageBand: board.ageBand, identities: board.identities, proof: {path: board.file, sha256: board.sha256}})));
for (const board of visual.existingBandBoards) {
  checkReceipt(board.proof);
  assert.deepEqual([...board.identities].sort(), old.filter(item => item.sex === board.sex && item.ageBand === board.ageBand).map(item => item.id).sort());
}
checkReceipt(comparison.existingInventory);
assert.equal(comparison.existingInventory.sha256, hash(resolve(root, 'comparison/existing-inventory.json')));
assert.equal(comparison.threshold, 8); assert.equal(comparison.managerAcceptance, 'pending');
assert.equal(comparison.entries.length, 19);
const vectors = new Map();
for (const item of [...fresh, ...old]) {
  assert.equal(hash(resolve(repo, item.path)), item.sha256);
  const image = await canvas(item.path), bounds = measure(image).visibleBounds;
  const thumbnail = createCanvas(64, 128), ctx = thumbnail.getContext('2d');
  ctx.fillStyle = '#eee9df'; ctx.fillRect(0, 0, 64, 128); ctx.imageSmoothingEnabled = false;
  const scale = 112 / bounds.height;
  ctx.drawImage(image, 32 - (bounds.x + bounds.width / 2) * scale, 120 - (bounds.y + bounds.height) * scale, image.width * scale, image.height * scale);
  vectors.set(item.id, ctx.getImageData(0, 0, 64, 128).data);
}
function distance(first, second) {
  const a = vectors.get(first), b = vectors.get(second); let squared = 0;
  for (let i = 0; i < 64 * 128; i++) {
    const offset = i * 4;
    squared += (a[offset] - b[offset]) ** 2 + (a[offset+1] - b[offset+1]) ** 2 + (a[offset+2] - b[offset+2]) ** 2;
  }
  return Math.sqrt(squared / (64 * 128 * 3));
}
const flags = []; let existingComparisons = 0;
for (const [index, current] of fresh.entries()) {
  const row = comparison.entries[index]; assert.equal(row.id, current.id); assert.equal(row.number, current.number);
  assert.equal(row.sex, current.sex); assert.equal(row.ageBand, current.ageBand); assert.equal(row.sourceSha256, current.sourceSha256);
  assert.deepEqual(row.newPose, {path: current.path, sha256: current.sha256});
  const same = old.filter(item => item.sex === current.sex && item.ageBand === current.ageBand);
  const expected = same.map(item => ({id: item.id, path: item.path, sha256: item.sha256, rmse: distance(current.id, item.id)})).sort((a,b) => a.rmse - b.rmse || a.id.localeCompare(b.id));
  assert.deepEqual(row.comparisons, expected); assert.deepEqual(row.nearestSix, expected.slice(0, 6));
  assert.equal(row.comparedExisting, same.length); existingComparisons += same.length;
  for (const item of expected) if (item.rmse < 8) flags.push({id: current.id, ...item});
  checkReceipt(row.board); checkReceipt(row.allSameBandPage);
  assert.deepEqual(visual.identities[index].comparisonBoard, row.board);
  const image = await canvas(row.board.path); assert.equal(image.width, 1008); assert.equal(image.height, 342);
}
const within = [];
for (let i = 0; i < fresh.length; i++) for (let j = i + 1; j < fresh.length; j++) {
  if (fresh[i].sex !== fresh[j].sex || fresh[i].ageBand !== fresh[j].ageBand) continue;
  const item = {first: fresh[i].id, second: fresh[j].id, rmse: distance(fresh[i].id, fresh[j].id)};
  within.push(item); if (item.rmse < 8) flags.push(item);
}
assert.deepEqual(comparison.withinBatch, within); assert.deepEqual(comparison.flags, flags);
assert.equal(existingComparisons, 287); assert.equal(within.length, 51); assert.equal(flags.length, 0, 'near-duplicate flags require resolution');
assert.equal(comparison.totalExistingComparisons, existingComparisons); assert.equal(comparison.totalWithinBatchComparisons, within.length);

// Filesystem-only gallery audit. Actual browser layout, clipping and image
// delivery still belong to the manager's validate-gallery.mjs run.
const pages = [
  {file: 'review/index.html', images: 57, articles: 19},
  {file: 'review/source-review.html', images: 5},
  {file: 'contact-review/index.html', images: 0},
  {file: 'placement-qa/index.html', images: 0},
  {file: 'comparison/index.html', images: 19, articles: 19},
  {file: 'comparison/all-catalog.html', images: 19, articles: 19},
  ...comparison.entries.map(item => ({file: 'comparison/' + item.number + '-all-same-band.html', images: item.comparedExisting + 1})),
];
let staticLinks = 0;
for (const page of pages) {
  const file = resolve(root, page.file), html = readFileSync(file, 'utf8');
  assert.equal([...html.matchAll(/<img\b/gi)].length, page.images, 'static image count ' + page.file);
  if (page.articles) assert.equal([...html.matchAll(/<article\b/gi)].length, page.articles);
  const refs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match => match[1]);
  for (const match of html.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) refs.push(match[2]);
  for (const reference of refs) {
    assert(!/^[a-z]+:|^\/\//i.test(reference), 'gallery must stay local ' + reference);
    const target = resolve(dirname(file), reference), withinRepo = relative(repo, target);
    assert(!withinRepo.startsWith('..') && !isAbsolute(withinRepo));
    assert(existsSync(target), 'missing static gallery reference ' + reference);
    if (/\.(png|webp)$/i.test(target)) { const image = await canvas(target); assert(image.width > 0 && image.height > 0); }
    staticLinks++;
  }
}
const main = readFileSync(resolve(root, 'review/index.html'), 'utf8');
for (const identity of roster.identities) {
  assert(main.includes(identity.stableId), 'gallery missing stable ID ' + identity.stableId);
  assert(main.includes('../comparison/' + identity.number + '-all-same-band.html'));
  assert(main.includes('../placement-qa/' + identity.number + '-front-desk-chair-placement.png'), 'gallery missing chair proof link');
}
verifyRuntimeBaseline();
const result = {
  status: 'PASS', identities: 19, poses: 152, authoredSeatedContacts: 76, reviewedChairProofs: 19,
  existingSameBandIdentities: 75, existingComparisons, withinBatchPairs: within.length, nearDuplicateFlags: flags.length,
  staticGalleryPages: pages.length, mainGalleryImages: 57, managerVisualAcceptance: 'pending', browserValidation: 'not-run-left-to-manager',
  observedGlasses: glassesIds.length, maximumGlasses: Math.floor(numbers.length * 0.3), grayCurlyHairWithGlasses: 0,
};
mkdirSync(resolve(root, 'validation'), {recursive:true});
writeFileSync(resolve(root, 'validation/worker-review-results.json'), JSON.stringify({...result, staticLinks, comparisonAlgorithm: comparison.algorithm, alphaSummary: alpha.summary, visualReceipt: {path: 'artifacts/character-statics/patient-gapfill-v6c/worker-review/visual-review.json', sha256: hash(resolve(root, 'worker-review/visual-review.json'))}}, null, 2) + '\n');
console.log(JSON.stringify(result));
