import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import assert from 'node:assert/strict'; import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage } from '@napi-rs/canvas';
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url))), read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, p))).digest('hex');
const layout = read('layout.json'), registration = read('assets/registration-v2.json');
const entries = [...read('assets/prompts/v1/catalog.json').entries, ...read('assets/prompts/v2/catalog.json').entries];
assert.equal(read('stand-in/v2/route-receipt.json').status, 'PASS');
const probes = [], assets = [];
for (const e of entries) {
  const receipt = read(e.receipt), im = await loadImage(path.join(root, e.original)), c = createCanvas(im.width, im.height), g = c.getContext('2d'); g.drawImage(im, 0, 0);
  const d = g.getImageData(0, 0, im.width, im.height).data; let transparent = 0, edge = 0;
  for (let y = 0; y < im.height; y++) for (let x = 0; x < im.width; x++) { const a = d[(y * im.width + x) * 4 + 3]; if (!a) transparent++; if (!x || !y || x === im.width - 1 || y === im.height - 1) edge = Math.max(edge, a); }
  assert.equal(receipt.tool, 'image_gen.imagegen'); assert.equal(receipt.input.transparent_background, true); assert.equal(receipt.input.prompt, fs.readFileSync(path.join(root, e.file), 'utf8').trim());
  assert.ok(edge < 8); assert.ok(transparent > im.width * im.height / 5); assert.equal(hash(e.original), crypto.createHash('sha256').update(fs.readFileSync(receipt.output.defaultPath)).digest('hex'));
  probes.push({ id: e.id, sourceSize: [im.width, im.height], transparentPixels: transparent, edgeAlpha: edge });
  assets.push({ id: e.id, slot: e.slot, classification: layout.pieces.find(p => p.id === e.slot).classification, levels: [1, 2, 3, 4, 5], appearanceLevel: 1, status: 'generated_needs_owner_review', original: e.original, prompt: e.file, receipt: e.receipt,
    tool: 'image_gen.imagegen', model: 'Built-in tool selected model; no API/CLI', transparentBackground: true, originalSha256: hash(e.original), promptSha256: hash(e.file), receiptSha256: hash(e.receipt), sourcePoints: registration.assets[e.id] ?? {} });
}
fs.writeFileSync(path.join(root, 'assets/original-probe-v2.json'), JSON.stringify({ status: 'PASS', probes }, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'assets/generation-manifest.json'), JSON.stringify({ schemaVersion: 1, designRevision: 2, date: '2026-10-11', status: 'generated_needs_owner_review', approval: null, runtimeIntegrationAuthorized: false,
  builtInCalls: 13, revisionBuiltInCalls: 8, appearanceChanges: false, appearanceLevels: [1], upgradeLevels: [1, 2, 3, 4, 5], assets, registrationSha256: hash('assets/registration-v2.json'),
  notes: ['Thirteen built-in imagegen calls, one selected transparent object per call: five original assets plus eight new density-revision assets.', "Necessary furniture isn't removed by doors. Optional decor hides only for its owned sections; standing/queue spots stay.", 'New optional layout frozen before its eight generation calls. Unchanged approved adult stills; no API/CLI, purchases, installs, external art or clinical content.'] }, null, 2) + '\n');
console.log('GENERATION V2 MANIFEST PASS: 13 selected assets / 13 built-in calls; 8 new revision calls; transparent originals copied byte-identically; exact prompts, real receipts and registration hashes.');
