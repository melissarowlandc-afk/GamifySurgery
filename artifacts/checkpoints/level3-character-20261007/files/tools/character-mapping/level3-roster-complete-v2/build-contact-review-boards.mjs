import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
const repo = resolve(tool, '../../..');
const root = resolve(repo, 'artifacts/character-statics/level3-roster-complete-v2');
const out = resolve(root, 'contact-review');
const roster = JSON.parse(readFileSync(resolve(tool, 'roster.json'), 'utf8'));
const staging = JSON.parse(readFileSync(resolve(root, 'staging-registry.json'), 'utf8'));
const directions = ['south', 'east', 'west', 'north'];
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const write = (file, canvas) => { const bytes = canvas.toBuffer('image/png'); writeFileSync(file, bytes); return { path: file.slice(repo.length + 1).replaceAll('\\', '/'), sha256: createHash('sha256').update(bytes).digest('hex') }; };

mkdirSync(out, { recursive: true });
const pages = [];
for (let start = 0; start < staging.entries.length; start += 4) {
  const entries = staging.entries.slice(start, start + 4);
  const canvas = createCanvas(640, entries.length * 356 + 32), context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false; context.fillStyle = '#20252b'; context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#ffffff'; context.font = '18px sans-serif'; context.fillText('Candidate seated contacts — cyan lines; values are review-pending', 12, 22);
  for (const [row, entry] of entries.entries()) {
    const contact = roster.seatContacts[entry.number];
    const y = 32 + row * 356;
    context.fillStyle = '#ffffff'; context.font = '15px sans-serif';
    context.fillText(`${entry.number}  ${entry.sourceSha256.slice(0, 12)}  S/E/W/N: ${directions.map(direction => contact?.[direction] ?? '—').join('/')}`, 8, y + 17);
    for (const [column, direction] of directions.entries()) {
      const file = resolve(root, 'packages', entry.number, `sit-${direction}.png`);
      if (!existsSync(file)) continue;
      const image = await loadImage(file), x = column * 160;
      context.drawImage(image, x, y + 28, 160, 320);
      if (Number.isInteger(contact?.[direction])) { context.strokeStyle = '#22d3ee'; context.lineWidth = 2; context.beginPath(); context.moveTo(x, y + 28 + contact[direction]); context.lineTo(x + 160, y + 28 + contact[direction]); context.stroke(); }
      context.fillStyle = '#9ee7f5'; context.font = '12px sans-serif'; context.fillText(direction[0].toUpperCase(), x + 6, y + 343);
    }
  }
  const file = resolve(out, `contact-review-${String(Math.floor(start / 4) + 1).padStart(2, '0')}.png`);
  pages.push({ identities: entries.map(entry => entry.number), proof: write(file, canvas) });
}
const manifest = { schemaVersion: 'level3-roster-complete-v2-contact-review/v1', status: 'candidate-values-pending-root-directional-review', pages };
writeFileSync(resolve(out, 'contact-review-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const links = pages.map((page, index) => `<li><a href="${page.proof.path.split('/').pop()}">${page.identities.join(', ')}</a></li>`).join('');
writeFileSync(resolve(out, 'index.html'), `<!doctype html><meta charset="utf-8"><title>Contact review boards</title><style>body{background:#20252b;color:#fff;font-family:system-ui;margin:24px}a{color:#67e8f9}</style><h1>Candidate contact review boards</h1><p>Cyan lines are candidate values only. Root must review each cardinal before any contact is accepted.</p><ul>${links}</ul>`);
console.log(JSON.stringify({ status: 'PASS', pages: pages.length, identities: staging.entries.length }));
