import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import { extractEight, loadCanvas, measure, normalizeCells, SLOTS } from '../gs026-employee-expansion-v1/pipeline.mjs';

const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
const repo = resolve(tool, '../../..');
const root = resolve(repo, 'artifacts/character-statics/level3-roster-complete-v2');
const sourceRoot = resolve(root, 'sources');
const packageRoot = resolve(root, 'packages');
const reviewRoot = resolve(root, 'review');
const roster = JSON.parse(readFileSync(resolve(tool, 'roster.json'), 'utf8'));
const referenceContract = JSON.parse(readFileSync(resolve(tool, 'reference-contract.json'), 'utf8'));
const acceptance = JSON.parse(readFileSync(resolve(tool, 'review-acceptance.json'), 'utf8'));
const hash = value => createHash('sha256').update(readFileSync(value)).digest('hex');
const hashText = value => createHash('sha256').update(value).digest('hex');
const relativePath = value => relative(repo, value).replaceAll('\\', '/');
const localPath = value => isAbsolute(value) ? value : resolve(repo, value);
const directions = ['south', 'east', 'west', 'north'];
const candidateContacts = process.argv.includes('--candidate-contacts');
const furnitureProof = resolve(repo, 'artifacts/character-movement/whole-body-static-v1/review/static-sit-east-chair-736.png');

function assertRosterContract() {
  assert.equal(roster.identities.length, 32, 'roster must contain exactly 32 identities');
  assert.deepEqual(roster.identities.map(item => item.number), Array.from({ length: 32 }, (_, index) => String(index + 1).padStart(3, '0')), 'roster numbers must be exactly 001-032 in order');
  assert.equal(new Set(roster.identities.map(item => item.stableId)).size, 32, 'stable IDs must be unique');
  const count = selector => roster.identities.filter(selector).length;
  assert.equal(count(item => item.targetKey === 'adult'), 20, 'roster must contain 20 adult-target identities');
  assert.equal(count(item => item.targetKey !== 'adult'), 12, 'roster must contain 12 pediatric-target identities');
  assert.deepEqual(Object.fromEntries(['radiologist', 'surgeon', 'or-nurse', 'laboratory-technician', 'pharmacist', 'repair-person', 'patient', 'future-pediatric-presentation'].map(category => [category, count(item => item.category === category)])), { radiologist: 4, surgeon: 2, 'or-nurse': 2, 'laboratory-technician': 2, pharmacist: 2, 'repair-person': 2, patient: 6, 'future-pediatric-presentation': 12 }, 'roster category counts differ from the accepted 32-identity contract');
  assert.deepEqual(Object.fromEntries(['adult', 'younger-child', 'older-child', 'teen'].map(target => [target, count(item => item.targetKey === target)])), { adult: 20, 'younger-child': 4, 'older-child': 4, teen: 4 }, 'roster target counts differ from the accepted contract');
}

function contactContractPayload() {
  return roster.identities.map(identity => ({
    number: identity.number,
    sourceSha256: acceptance.accepted?.[identity.number],
    contacts: Object.fromEntries(directions.map(direction => [direction, roster.seatContacts?.[identity.number]?.[direction]])),
  }));
}

function verifyContactAcceptance() {
  const ledger = acceptance.seatContactAcceptance;
  assert.equal(ledger?.reviewer, 'root', 'seat-contact acceptance must be recorded by root');
  const currentContractSha256 = hashText(JSON.stringify(contactContractPayload()));
  if (!candidateContacts) assert.equal(ledger?.contractSha256, currentContractSha256, 'seat-contact acceptance does not bind the current source hashes and four coordinates');
  for (const identity of roster.identities) {
    const contacts = roster.seatContacts?.[identity.number];
    assert(contacts, `missing seat contacts for ${identity.number}`);
    assert.deepEqual([...contacts.approvedDirections].sort(), [...directions].sort(), `all four seat contacts must be root reviewed for ${identity.number}`);
    for (const direction of directions) assert(Number.isInteger(contacts[direction]) && contacts[direction] >= 0 && contacts[direction] < roster.targets[identity.targetKey].height, `invalid ${direction} seat contact for ${identity.number}`);
  }
}

function alphaClipAnalysis(cell, frame, transform, target) {
  const data = cell.canvas.getContext('2d').getImageData(0, 0, cell.canvas.width, cell.canvas.height).data;
  let sourceNonzeroPixelsWithFootprintOutside = 0, maxSourceAlphaWithFootprintOutside = 0;
  for (let y = 0; y < cell.canvas.height; y++) for (let x = 0; x < cell.canvas.width; x++) {
    const alpha = data[(y * cell.canvas.width + x) * 4 + 3];
    if (!alpha) continue;
    const left = transform.translateX + x * transform.scale, right = transform.translateX + (x + 1) * transform.scale;
    const top = transform.translateY + y * transform.scale, bottom = transform.translateY + (y + 1) * transform.scale;
    if (left < 0 || right > target.width || top < 0 || bottom > target.height) {
      sourceNonzeroPixelsWithFootprintOutside++;
      maxSourceAlphaWithFootprintOutside = Math.max(maxSourceAlphaWithFootprintOutside, alpha);
    }
  }
  const output = frame.canvas.getContext('2d').getImageData(0, 0, frame.canvas.width, frame.canvas.height).data;
  let derivedBorderNonzeroPixels = 0, derivedBorderMaxAlpha = 0;
  for (let y = 0; y < frame.canvas.height; y++) for (let x = 0; x < frame.canvas.width; x++) {
    if (x !== 0 && y !== 0 && x !== frame.canvas.width - 1 && y !== frame.canvas.height - 1) continue;
    const alpha = output[(y * frame.canvas.width + x) * 4 + 3];
    if (alpha) { derivedBorderNonzeroPixels++; derivedBorderMaxAlpha = Math.max(derivedBorderMaxAlpha, alpha); }
  }
  assert(maxSourceAlphaWithFootprintOutside < 13, `normalization would clip alpha >=13 (max ${maxSourceAlphaWithFootprintOutside})`);
  return { analysisThreshold: 13, sourceNonzeroPixelsWithFootprintOutside, maxSourceAlphaWithFootprintOutside, derivedBorderNonzeroPixels, derivedBorderMaxAlpha };
}

function sourceFiles(identity) {
  const dir = resolve(sourceRoot, identity.number);
  return { dir, png: resolve(dir, 'source.png'), prompt: resolve(dir, 'exact-prompt.txt'), args: resolve(dir, 'tool-args.json'), provenance: resolve(dir, 'provenance.json') };
}

function verifySource(identity) {
  const files = sourceFiles(identity);
  for (const file of Object.values(files).slice(1)) assert(existsSync(file), `missing ${relativePath(file)}`);
  const prompt = readFileSync(files.prompt, 'utf8');
  const args = JSON.parse(readFileSync(files.args, 'utf8'));
  const provenance = JSON.parse(readFileSync(files.provenance, 'utf8'));
  assert.equal(args.prompt, prompt, 'tool-args.prompt must exactly equal exact-prompt.txt');
  assert.equal(args.transparent_background, true, 'tool-args.transparent_background must be true');
  assert.equal(provenance.nativeOutput?.sha256, hash(files.png), 'native output hash must bind selected source.png');
  assert(typeof provenance.nativeOutput?.path === 'string' && existsSync(provenance.nativeOutput.path), 'native output path must be readable');
  assert.equal(hash(provenance.nativeOutput.path), hash(files.png), 'source.png must be byte-identical to native output');
  assert.equal(provenance.workspaceCopy?.sha256, hash(files.png), 'workspace copy hash must bind selected source.png');
  assert.equal(provenance.workspaceCopy?.path, 'source.png', 'workspace copy path must identify selected source.png');
  assert.equal(provenance.prompt?.sha256, hash(files.prompt), 'provenance prompt hash must bind exact-prompt.txt');
  assert.equal(provenance.prompt?.path, 'exact-prompt.txt', 'provenance prompt path must identify exact-prompt.txt');
  assert(Array.isArray(provenance.references) && provenance.references.length > 0, 'provenance references missing');
  assert.deepEqual(args.referenced_image_paths, provenance.references.map(item => item.path), 'tool arguments and provenance references differ');
  for (const item of provenance.references) {
    assert(typeof item.path === 'string' && typeof item.sha256 === 'string', 'reference needs path and sha256');
    const evidence = localPath(item.preservedCopyPath ?? item.path);
    assert(existsSync(evidence), `reference evidence unavailable: ${evidence}`);
    assert.equal(hash(evidence), item.sha256, `reference hash mismatch: ${item.path}`);
  }
  return { files, prompt, args, provenance };
}

function verifySharedReferences() {
  for (const item of referenceContract.references) {
    const file = resolve(repo, item.path);
    assert(existsSync(file), `pinned reference missing: ${item.path}`);
    assert.equal(hash(file), item.sha256, `pinned reference hash mismatch: ${item.path}`);
  }
}

function writePng(file, canvas) {
  const bytes = canvas.toBuffer('image/png');
  writeFileSync(file, bytes);
  return { file: relativePath(file), sha256: createHash('sha256').update(bytes).digest('hex') };
}

function fullProof(frames, target, theme, output) {
  const canvas = createCanvas(target.width * 4, target.height * 2);
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  if (theme) { context.fillStyle = theme === 'dark' ? '#20252b' : '#eee9df'; context.fillRect(0, 0, canvas.width, canvas.height); }
  frames.forEach((frame, index) => context.drawImage(frame.canvas, index % 4 * target.width, Math.floor(index / 4) * target.height, target.width, target.height));
  return writePng(output, canvas);
}

function contactProof(frames, target, contacts, output) {
  const scale = 2, canvas = createCanvas(target.width * 4 * scale, target.height * scale), context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  context.fillStyle = '#20252b'; context.fillRect(0, 0, canvas.width, canvas.height);
  for (let index = 0; index < 4; index++) {
    const x = index * target.width * scale;
    context.drawImage(frames[index + 4].canvas, x, 0, target.width * scale, target.height * scale);
    context.strokeStyle = '#ff2d55'; context.lineWidth = 1;
    for (let line = 0; line <= target.width; line += 10) { context.beginPath(); context.moveTo(x + line * scale, 0); context.lineTo(x + line * scale, canvas.height); context.stroke(); }
    for (let line = 0; line <= target.height; line += 10) { context.beginPath(); context.moveTo(x, line * scale); context.lineTo(x + target.width * scale, line * scale); context.stroke(); }
    const contact = contacts?.[directions[index]];
    if (Number.isInteger(contact)) { context.strokeStyle = '#22d3ee'; context.lineWidth = 3; context.beginPath(); context.moveTo(x, contact * scale); context.lineTo(x + target.width * scale, contact * scale); context.stroke(); }
  }
  return writePng(output, canvas);
}

async function packageAdult(identity) {
  const source = verifySource(identity);
  const target = roster.targets[identity.targetKey];
  const sourceSha256 = hash(source.files.png);
  assert(!acceptance.rejected?.[identity.number]?.includes(sourceSha256), `known rejected source hash for ${identity.number}`);
  assert.equal(acceptance.accepted?.[identity.number], sourceSha256, `source lacks exact root visual acceptance for ${identity.number}`);
  const sheet = await loadCanvas(source.files.png);
  const data = sheet.getContext('2d').getImageData(0, 0, sheet.width, sheet.height).data;
  assert(data.some((value, index) => index % 4 === 3 && value === 0), 'source has no alpha-zero transparency');
  const extraction = extractEight(sheet);
  const frames = normalizeCells(extraction.cells, target);
  for (const [index, frame] of frames.entries()) assert.equal(measure(frame.canvas).borderPixels, 0, `derived pose ${index} has strong-alpha clipping`);
  const out = resolve(packageRoot, identity.number); mkdirSync(out, { recursive: true });
  const contacts = roster.seatContacts[identity.number];
  const poses = { stand: {}, sit: {} };
  for (let index = 0; index < 8; index++) {
    const slot = SLOTS[index], file = resolve(out, `${slot.pose}-${slot.direction}.png`), written = writePng(file, frames[index].canvas);
    const alphaNormalization = alphaClipAnalysis(extraction.cells[index], frames[index], frames[index].transform, target);
    poses[slot.pose][slot.direction] = { ...written, visibleBounds: measure(frames[index].canvas).visibleBounds, transform: frames[index].transform, alphaNormalization, anchors: { bodyAxisX: target.bodyAxisX, floorY: target.floorY, ...(slot.pose === 'sit' ? { seatContactY: contacts[slot.direction], seatContactStatus: 'root-reviewed-contact-candidate;no-runtime-promotion' } : {}) } };
  }
  const proofs = { fullTransparent: fullProof(frames, target, null, resolve(out, 'full-poses-transparent.png')), fullLight: fullProof(frames, target, 'light', resolve(out, 'full-poses-light.png')), fullDark: fullProof(frames, target, 'dark', resolve(out, 'full-poses-dark.png')), seatedContactGrid: contactProof(frames, target, contacts, resolve(out, 'seated-contact-grid-2x.png')) };
  const manifest = { schemaVersion: 'level3-roster-complete-v2-package/v2', status: 'candidate-packaged-not-runtime-ready', identity, source: { png: { path: relativePath(source.files.png), sha256: sourceSha256 }, exactPrompt: { path: relativePath(source.files.prompt), sha256: hash(source.files.prompt) }, toolArguments: { path: relativePath(source.files.args), sha256: hash(source.files.args) }, provenance: { path: relativePath(source.files.provenance), sha256: hash(source.files.provenance) } }, rootVisualAcceptance: { ledger: relativePath(resolve(tool, 'review-acceptance.json')), sourceSha256, scope: acceptance.scope }, seatContactAcceptance: { ledger: relativePath(resolve(tool, 'review-acceptance.json')), contractSha256: candidateContacts ? undefined : acceptance.seatContactAcceptance.contractSha256, coordinates: Object.fromEntries(directions.map(direction => [direction, contacts[direction]])), scope: candidateContacts ? 'retained candidate coordinates pending source-hash-bound root review' : acceptance.seatContactAcceptance.scope, bindingStatus: candidateContacts ? 'candidate-not-source-hash-bound' : 'root-reviewed-source-hash-bound' }, extraction: { method: 'immutable GS026 extractEight; alpha threshold 13 identifies the protected figure geometry; native PNG is preserved byte-for-byte', sourceRects: extraction.cells.map(cell => cell.sourceRect) }, normalization: { target, policy: 'one identity-wide whole-body scale resamples each complete extracted cell into a derived 160x320 pose; native PNG remains unchanged; alpha >=13 outside the derived canvas is forbidden; lower-alpha source pixels outside the canvas and output-edge alpha are measured per pose and require explicit root warning acceptance' }, adultReferenceComparison: identity.targetKey === 'adult' ? { geometryOnly: true, targetStandingSouthVisibleHeight: target.standingSouthVisibleHeight, referenceContract: relativePath(resolve(tool, 'reference-contract.json')), visualReviewStatus: 'candidate-pending-root-review' } : undefined, poses, proofs };
  writeFileSync(resolve(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  return { number: identity.number, stableId: identity.stableId, status: manifest.status, manifest: relativePath(resolve(out, 'manifest.json')), sourceSha256: manifest.source.png.sha256, rootVisualAccepted: true, contactStatus: contacts.status, contactDirectionsReviewed: contacts.approvedDirections, contactCoordinates: Object.fromEntries(directions.map(direction => [direction, contacts[direction]])), proofs };
}

async function gallery(entries) {
  mkdirSync(reviewRoot, { recursive: true });
  const cardW = 160, cardH = 320, cols = 5, rows = Math.max(1, Math.ceil(entries.length / cols));
  for (const theme of ['light', 'dark']) {
    const canvas = createCanvas(cols * cardW, rows * (cardH + 24)), context = canvas.getContext('2d');
    context.fillStyle = theme === 'dark' ? '#20252b' : '#eee9df'; context.fillRect(0, 0, canvas.width, canvas.height); context.imageSmoothingEnabled = false;
    for (const [index, entry] of entries.entries()) { const x = index % cols * cardW, y = Math.floor(index / cols) * (cardH + 24); const pose = await loadCanvas(resolve(repo, `artifacts/character-statics/level3-roster-complete-v2/packages/${entry.number}/stand-south.png`)); context.drawImage(pose, x, y, cardW, cardH); context.fillStyle = theme === 'dark' ? '#ffffff' : '#20252b'; context.font = '12px sans-serif'; context.fillText(entry.number, x + 4, y + cardH + 16); }
    writePng(resolve(reviewRoot, `gallery-${theme}.png`), canvas);
  }
  const overview = createCanvas(4 * 320, Math.max(1, Math.ceil(entries.length / 4)) * 310);
  const overviewContext = overview.getContext('2d'); overviewContext.imageSmoothingEnabled = false; overviewContext.fillStyle = '#eee9df'; overviewContext.fillRect(0, 0, overview.width, overview.height);
  for (const [index, entry] of entries.entries()) {
    const identity = roster.identities.find(item => item.number === entry.number);
    const x = index % 4 * 320, y = Math.floor(index / 4) * 310;
    overviewContext.fillStyle = '#ffffff'; overviewContext.fillRect(x + 4, y + 4, 312, 302);
    overviewContext.strokeStyle = '#b7b0a6'; overviewContext.strokeRect(x + 4, y + 4, 312, 302);
    const south = await loadCanvas(resolve(packageRoot, entry.number, 'stand-south.png'));
    const east = await loadCanvas(resolve(packageRoot, entry.number, 'sit-east.png'));
    overviewContext.drawImage(south, x + 8, y + 8, 144, 288); overviewContext.drawImage(east, x + 168, y + 8, 144, 288);
    overviewContext.fillStyle = '#20252b'; overviewContext.font = '12px sans-serif';
    const label = identity.visualAge ? `${entry.number} · visual age ${identity.visualAge}` : `${entry.number} · ${identity.category}${identity.age ? ` · ${identity.age}` : ''}`;
    overviewContext.fillText(label, x + 10, y + 302);
  }
  writePng(resolve(reviewRoot, 'owner-overview-stand-south-sit-east.png'), overview);
  const cards = entries.map(entry => { const placement = resolve(root, 'placement-qa', `${entry.number}-front-desk-chair-placement.png`); const source = `../sources/${entry.number}`; return `<article><h2>${entry.number} · ${entry.stableId}</h2><img src="../packages/${entry.number}/full-poses-light.png" alt="${entry.number} eight poses on light background"><img src="../packages/${entry.number}/full-poses-dark.png" alt="${entry.number} eight poses on dark background"><p><a href="../packages/${entry.number}/manifest.json">package manifest</a> · <a href="${source}/source.png">native source</a> · <a href="${source}/exact-prompt.txt">exact prompt</a> · <a href="${source}/tool-args.json">tool args</a> · <a href="${source}/provenance.json">provenance</a>${existsSync(placement) ? ` · <a href="../placement-qa/${entry.number}-front-desk-chair-placement.png">placement QA</a>` : ''}</p></article>`; }).join('');
  const completion = entries.length === 32 && roster.identities.length === 32 ? '32 identities · 256 views. Root art QA complete; owner review and runtime registration remain pending.' : `${entries.length} staged identities · ${entries.length * 8} views. This is incomplete candidate review only.`;
  writeFileSync(resolve(reviewRoot, 'index.html'), `<!doctype html><meta charset="utf-8"><title>Level 3 roster v2 review</title><style>body{margin:24px;background:#eee9df;color:#20252b;font-family:system-ui}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:18px}article{padding:12px;background:white;border:1px solid #b7b0a6;border-radius:8px}h2{font-size:14px;margin:0 0 8px}img{display:block;width:100%;height:auto;margin:8px 0}a{color:#0645ad}</style><h1>Level 3 roster-complete v2</h1><p>${completion} Native sources remain unchanged. Standing and seated poses reviewed; owner review and runtime registration pending. <a href="owner-overview-stand-south-sit-east.png">Open paired owner overview</a> · <a href="../contact-review/index.html">Open compact contact review boards</a>.</p><main>${cards}</main>`);
}

assertRosterContract();
verifySharedReferences();
verifyContactAcceptance();
const entries = [], issues = [];
for (const identity of roster.identities) {
  const files = sourceFiles(identity);
  if (!existsSync(files.png)) { issues.push({ number: identity.number, status: 'missing-source' }); continue; }
  if (!['adult', 'younger-child', 'older-child', 'teen'].includes(identity.targetKey)) { issues.push({ number: identity.number, status: 'blocked-editorial-scale-pilot-approval', target: roster.targets[identity.targetKey] }); continue; }
  try { entries.push(await packageAdult(identity)); } catch (error) { issues.push({ number: identity.number, status: 'source-or-package-failed', message: error.message }); }
}
await gallery(entries);
const alphaReport = { schemaVersion: 'level3-roster-complete-v2-alpha-normalization/v1', policy: 'Native sources are immutable. Derived normalization may resample and clip source pixels below alpha 13 only when measured here; alpha 13 or greater outside the derived canvas is a hard failure.', entries: entries.map(entry => { const manifest = JSON.parse(readFileSync(resolve(repo, entry.manifest), 'utf8')); return { number: entry.number, sourceSha256: entry.sourceSha256, poses: manifest.poses }; }).map(entry => ({ ...entry, poses: Object.fromEntries(['stand', 'sit'].map(pose => [pose, Object.fromEntries(directions.map(direction => [direction, entry.poses[pose][direction].alphaNormalization]))])) })) };
const alphaReportFile = resolve(root, 'alpha-normalization-report.json');
writeFileSync(alphaReportFile, JSON.stringify(alphaReport, null, 2) + '\n');
const staged = { schemaVersion: 'level3-roster-complete-v2-staging/v3', runtimeIntegration: { authorized: false, ready: false }, baseline: 'artifacts/character-statics/level3-roster-complete-v2/runtime-baseline.json', rosterContract: { identities: 32, posesPerIdentity: 8, totalPoses: 256, adultTargets: 20, pediatricTargets: 12 }, derivedAlphaReport: { path: relativePath(alphaReportFile), sha256: hash(alphaReportFile), rootWarningAccepted: acceptance.derivedAlphaWarningAcceptance?.reportSha256 === hash(alphaReportFile) }, adultReferenceContract: relativePath(resolve(tool, 'reference-contract.json')), furniturePlacementReference: existsSync(furnitureProof) ? { path: relativePath(furnitureProof), sha256: hash(furnitureProof), status: 'accepted-reference-only; no runtime placement mutation' } : { status: 'unavailable' }, entries, issues, totals: { expected: 32, packaged: entries.length, poses: entries.length * 8, issues: issues.length } };
writeFileSync(resolve(root, 'staging-registry.json'), JSON.stringify(staged, null, 2) + '\n');
console.log(JSON.stringify({ status: 'PASS_WITH_REPORTED_GAPS', packaged: entries.length, issues: issues.length, runtimeReady: false }));
