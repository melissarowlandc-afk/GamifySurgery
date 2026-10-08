// Read-only source receipt. Never writes outside this room's assets directory.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../../../../..');
const out = path.join(here, 'reference-baseline.json');
if (fs.existsSync(out)) throw new Error('Reference baseline already exists; do not replace the intake receipt.');
const protectedRoots = ['tools/room-design/level-4/mri', 'tools/room-design/level-4/radiology-reading', 'tools/room-design/level-3', 'apps/player/public/art/rooms/gs015-v1'];
const files = [];
function collect(relative) {
  const full = path.resolve(repo, relative);
  if (fs.statSync(full).isDirectory()) for (const name of fs.readdirSync(full).sort()) collect(`${relative}/${name}`);
  else files.push(relative);
}
for (const root of protectedRoots) collect(root);
for (const relative of ['tools/room-design/level-4/pediatric-waiting/ART_BRIEF.md', 'tools/room-design/level-4/pediatric-waiting/stand-in', 'tools/room-design/touchup-2026-10/lab/design-rooms.js', 'tools/room-design/touchup-2026-10/lab/lab.js', 'tools/room-design/touchup-2026-10/build/lab-data.json', 'tools/room-design/touchup-2026-10/build/room-touchups.mjs']) collect(relative);
const entries = Object.fromEntries(files.sort().map(relative => [relative, crypto.createHash('sha256').update(fs.readFileSync(path.resolve(repo, relative))).digest('hex').toUpperCase()]));
fs.writeFileSync(out, JSON.stringify({ schemaVersion: 1, purpose: 'Read-only intake preservation receipt; concurrent shared edits must be returned to the manager.', files: entries }, null, 2) + '\n');
console.log(`REFERENCES recorded ${files.length} read-only files`);
