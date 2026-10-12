import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage } from '@napi-rs/canvas';
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, p))).digest('hex');
const catalog = read('assets/prompts/v1/catalog.json'), registration = read('assets/registration-v1.json');
const probes = [], assets = [];
for (const e of catalog.entries) {
  const receipt = read(e.receipt), im = await loadImage(path.join(root, e.original)), c = createCanvas(im.width, im.height), g = c.getContext('2d');
  g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, im.width, im.height).data;
  let transparent = 0, edge = 0;
  for (let y = 0; y < im.height; y++) for (let x = 0; x < im.width; x++) { const a = d[(y * im.width + x) * 4 + 3]; if (!a) transparent++; if (!x || !y || x === im.width - 1 || y === im.height - 1) edge = Math.max(edge, a); }
  assert.equal(receipt.tool, 'image_gen.imagegen'); assert.equal(receipt.input.transparent_background, true);
  assert.equal(receipt.input.prompt, fs.readFileSync(path.join(root, e.file), 'utf8').trim());
  assert.ok(edge < 8, 'Only near-transparent generation residue may reach the raw edge; the Executive packing threshold is 8.'); assert.ok(transparent > im.width * im.height / 5, 'Genuine transparent source');
  const source = receipt.output.defaultPath;
  assert.equal(hash(e.original), crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'), 'Byte-identical workspace original');
  probes.push({ id: e.id, sourceSize: [im.width, im.height], transparentPixels: transparent, edgeAlpha: edge });
  assets.push({ id: e.id, slot: e.slot, levels: [1, 2, 3, 4, 5], appearanceLevel: 1, status: 'generated_needs_owner_review', original: e.original, prompt: e.file, receipt: e.receipt,
    tool: 'image_gen.imagegen', model: 'Built-in tool selected model; no API/CLI', transparentBackground: true, originalSha256: hash(e.original), promptSha256: hash(e.file), receiptSha256: hash(e.receipt), sourcePoints: registration.assets[e.id] ?? {} });
}
fs.writeFileSync(path.join(root, 'assets/original-probe.json'), JSON.stringify({ status: 'PASS', probes }, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'assets/generation-manifest.json'), JSON.stringify({ schemaVersion: 1, date: '2026-10-11', status: 'generated_needs_owner_review', approval: null, runtimeIntegrationAuthorized: false,
  builtInCalls: 5, appearanceChanges: false, appearanceLevels: [1], upgradeLevels: [1, 2, 3, 4, 5], assets, registrationSha256: hash('assets/registration-v1.json'),
  notes: ['Five new built-in imagegen calls, one transparent object per call; exact input in each real receipt.', 'Unchanged approved adult standing stills; no API credits, CLI generation, character generation, brand/text or clinical content.', 'All originals copied byte-identically from the real built-in output paths. Geometry frozen before generation.'] }, null, 2) + '\n');
console.log('GENERATION MANIFEST PASS: 5 selected assets / 5 built-in calls; transparent originals copied byte-identically; exact prompts, real receipts and registration hashes.');
