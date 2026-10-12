// Preserve the complete active revision before the room-first redesign.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const dest = path.join(root, 'history/v2');
if (fs.existsSync(dest)) throw Error('Version 2 archive already exists; do not overwrite it.');
fs.mkdirSync(dest, { recursive: true });
const entries = fs.readdirSync(root, { withFileTypes: true }).filter(e => e.name !== 'history' && e.name !== 'archive-v2.mjs');
for (const entry of entries) fs.cpSync(path.join(root, entry.name), path.join(dest, entry.name), { recursive: true, errorOnExist: true, force: false });
const walk = p => fs.readdirSync(p, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(p, e.name)) : [path.join(p, e.name)]);
const files = walk(dest).map(p => ({ path: path.relative(dest, p).replaceAll('\\', '/'), bytes: fs.statSync(p).size, sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') }));
fs.writeFileSync(path.join(dest, 'ARCHIVE_RECEIPT.json'), JSON.stringify({ revision: 2, status: 'PRESERVED', reason: 'Owner requested a cohesive room-first redesign on 2026-10-11.', excludes: ['history/ (pre-existing v1 archive retained separately)', 'archive-v2.mjs (archiver itself)'], files }, null, 2) + '\n');
console.log(`ARCHIVE PASS: ${files.length} version-2 files copied byte-for-byte under history/v2; existing history/v1 preserved.`);
