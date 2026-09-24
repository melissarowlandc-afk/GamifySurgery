const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../..');
const outputRoot = path.join(root, 'apps/player/public/art/rooms/gs015-v1');

const copies = {
  'examination/furniture.webp': 'tools/room-design/examination-layout/examination-furniture-atlas-01.webp',
  'examination/bed-south.webp': 'tools/room-design/examination-layout/examination-bed-east-03-display.webp',
  'examination/bed-west.webp': 'tools/room-design/examination-layout/examination-bed-north-03-display.webp',
  'examination/props.webp': 'tools/room-design/examination-layout/examination-props-01-display.webp',
  'examination/sink-west.webp': 'tools/room-design/examination-layout/examination-sink-west-01-display.webp',
  'waiting/south.webp': 'tools/room-design/waiting-layout/waiting-assets.webp',
  'waiting/west.webp': 'tools/room-design/waiting-layout/waiting-west-assets.webp',
  'bathroom/furniture.webp': 'tools/room-design/bathroom-layout/bathroom-assets.webp',
  'minor-procedure/furniture.webp': 'tools/room-design/minor-procedure-layout/minor-procedure-assets.webp',
  'ultrasound/furniture.webp': 'tools/room-design/ultrasound-layout/ultrasound-assets.webp',
  'phlebotomy/south.webp': 'tools/room-design/phlebotomy-layout/south.webp',
  'phlebotomy/east.webp': 'tools/room-design/phlebotomy-layout/east.webp',
  'phlebotomy/window.webp': 'tools/room-design/phlebotomy-layout/window.webp',
  'evs/furniture.webp': 'tools/room-design/evs-layout/evs.webp',
  'recovery/furniture.webp': 'tools/room-design/recovery-layout/recovery.webp',
  'training/furniture.webp': 'tools/room-design/training-layout/training.webp',
  'coffee/furniture.webp': 'tools/room-design/coffee-kiosk-layout/coffee.webp',
  'telehealth/furniture.webp': 'tools/room-design/telehealth-layout/telehealth.webp',
  'telehealth/props.webp': 'tools/room-design/telehealth-layout/props.webp',
  'telehealth/window.webp': 'tools/room-design/telehealth-layout/window.webp',
};

const embedded = [
  ['front-desk/furniture.webp', 'tools/room-design/furniture-revision-2026-09-22/front-desk-candidate.html', 'atlas'],
  ['front-desk/counter.webp', 'tools/room-design/furniture-revision-2026-09-22/front-desk-candidate.html', 'deskArt'],
  ['front-desk/props.webp', 'tools/room-design/furniture-revision-2026-09-22/front-desk-candidate.html', 'propsArt'],
  ['front-desk/upkeep.webp', 'tools/room-design/furniture-revision-2026-09-22/front-desk-candidate.html', 'upkeepArt'],
  ['xray/furniture.webp', 'tools/room-design/furniture-revision-2026-09-22/xray-candidate.html', 'atlas'],
  ['ct/furniture.webp', 'tools/room-design/furniture-revision-2026-09-22/ct-candidate.html', 'atlas'],
  ['ct/wall-art.webp', 'tools/room-design/furniture-revision-2026-09-22/ct-candidate.html', 'wallAtlas'],
  ['endoscopy/south.webp', 'tools/room-design/furniture-revision-2026-09-22/endoscopy-candidate.html', 'atlases.south'],
  ['endoscopy/east.webp', 'tools/room-design/furniture-revision-2026-09-22/endoscopy-candidate.html', 'atlases.east'],
];

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase();
}

function embeddedWebp(relativeHtml, variable) {
  const html = fs.readFileSync(path.join(root, relativeHtml), 'utf8');
  const escaped = variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`${escaped}\\.src='data:image/webp;base64,([^']+)'`).exec(html);
  if (!match) throw new Error(`Missing ${variable} WebP in ${relativeHtml}`);
  return Buffer.from(match[1], 'base64');
}

function write(relativeOutput, buffer) {
  const destination = path.join(outputRoot, relativeOutput);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, buffer);
  return destination;
}

const records = [];
for (const [relativeOutput, relativeSource] of Object.entries(copies)) {
  const source = path.join(root, relativeSource);
  const buffer = fs.readFileSync(source);
  write(relativeOutput, buffer);
  records.push({ output: relativeOutput, source: relativeSource, extraction: 'byte-for-byte-copy', bytes: buffer.length, sha256: sha256(buffer) });
}
for (const [relativeOutput, relativeSource, variable] of embedded) {
  const buffer = embeddedWebp(relativeSource, variable);
  write(relativeOutput, buffer);
  records.push({ output: relativeOutput, source: relativeSource, extraction: `embedded-data-url:${variable}`, bytes: buffer.length, sha256: sha256(buffer) });
}

records.sort((left, right) => left.output.localeCompare(right.output));
const provenance = {
  schemaVersion: 1,
  approvalStatus: 'owner-approved-for-runtime',
  approvalDate: '2026-09-24',
  furnitureApprovalDate: '2026-09-24',
  proofInventory: 'tools/room-design/consistency-audit/inventory.json',
  furnitureRevision: 'tools/room-design/furniture-revision-2026-09-22/candidate-metadata.json',
  encoding: 'Existing approved WebP bytes are copied or decoded from approved candidate data URLs without re-encoding.',
  records,
};
fs.mkdirSync(outputRoot, { recursive: true });
fs.writeFileSync(path.join(outputRoot, 'provenance.json'), `${JSON.stringify(provenance, null, 2)}\n`);
console.log(`Exported ${records.length} approved GS-015 atlases.`);
