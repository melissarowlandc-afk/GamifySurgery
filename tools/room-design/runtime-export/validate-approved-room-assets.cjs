const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../..');
const outputRoot = path.join(root, 'apps/player/public/art/rooms/gs015-v1');
const provenance = JSON.parse(fs.readFileSync(path.join(outputRoot, 'provenance.json'), 'utf8'));
const hash = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase();

if (provenance.records.length !== 29) throw new Error(`Expected 29 exported atlases, got ${provenance.records.length}`);
for (const record of provenance.records) {
  const output = fs.readFileSync(path.join(outputRoot, record.output));
  if (output.length !== record.bytes || hash(output) !== record.sha256) throw new Error(`Output mismatch: ${record.output}`);
  if (record.extraction === 'byte-for-byte-copy') {
    const source = fs.readFileSync(path.join(root, record.source));
    if (!output.equals(source)) throw new Error(`Copy changed source bytes: ${record.output}`);
  } else {
    const html = fs.readFileSync(path.join(root, record.source), 'utf8');
    const variable = record.extraction.slice('embedded-data-url:'.length);
    const escaped = variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = new RegExp(`${escaped}\\.src='data:image/webp;base64,([^']+)'`).exec(html);
    if (!match || !output.equals(Buffer.from(match[1], 'base64'))) throw new Error(`Embedded extraction changed bytes: ${record.output}`);
  }
}
console.log(`PASS ${provenance.records.length} approved GS-015 atlas hashes and source bytes`);

