// Read-only requests to the existing manager room-lab, no server or launcher changes.
import fs from 'node:fs'; import path from 'node:path'; import assert from 'node:assert/strict'; import crypto from 'node:crypto'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url)), origin = 'http://127.0.0.1:4191', prefix = '/tools/room-design/level-5/indoor-garden/proof/';
const metadata = JSON.parse(fs.readFileSync(path.join(here, '../assets/processed/v2/metadata.json'))), data = JSON.parse(fs.readFileSync(path.join(here, 'data.json')));
const resources = [...['index.html', 'lab.js', 'room-touchups.mjs', 'geometry.mjs', 'design-rooms.js', 'data.json', 'proof-manifest.json', 'asset-contract.json', 'layout-baseline.json'].map(p => prefix + p),
  ...Object.values(metadata.assets).map(m => new URL(m.file, origin + prefix).pathname),
  ...data.indoorGardenPresentation.actors.map(a => '/apps/player/public/' + data.characters.find(c => c.id === a.characterId).poses.sit[a.direction].url)];
resources.push('/tools/room-design/level-5/indoor-garden/concept/indoor-garden-concept.png');
const checks = [];
for (const p of resources) { const r = await fetch(origin + p), bytes = Buffer.from(await r.arrayBuffer()); assert.equal(r.status, 200, p); const local = path.resolve(here, '../../../../..' + p); assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), crypto.createHash('sha256').update(fs.readFileSync(local)).digest('hex'), 'Served bytes match ' + p); checks.push({ path: p, status: r.status, bytes: bytes.length }); }
fs.writeFileSync(path.join(here, 'evidence/v2/http-validation-report.json'), JSON.stringify({ status: 'PASS', origin, resources: checks, serverChanged: false }, null, 2) + '\n');
console.log(`HTTP VALIDATION PASS: ${checks.length} current proof resources return 200 with matching bytes at ${origin}; existing server unchanged.`);
