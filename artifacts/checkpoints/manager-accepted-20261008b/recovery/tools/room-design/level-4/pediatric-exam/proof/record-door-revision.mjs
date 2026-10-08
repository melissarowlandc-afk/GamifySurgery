// One-time intake of the manager-reviewed 16-door candidate before its revision.
// Preserve evidence without changing reviewed art, seats or shared sources.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha } from '../assets/image-utils.mjs';
import { DESIGN_ASSETS, DESIGN_ROOMS } from './design-rooms.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const lane = path.resolve(here, '..');
const archive = path.join(here, 'revisions/door-model-16-reviewed');
if (fs.existsSync(archive)) throw Error('Revision intake already exists; preserve it.');
const read = file => JSON.parse(fs.readFileSync(path.join(here, file), 'utf8'));
const browser = read('evidence/browser-validation-report.json');
const captures = read('evidence/capture-report.json');
if (browser.status !== 'PASS' || browser.errors.length || captures.status !== 'PASS' || captures.errors.length)
  throw Error('Expected manager-reviewed PASS evidence with zero page errors.');
const presentation = read('presentation-contract.json');
if (presentation.doorModel.count !== 16) throw Error('Expected the reviewed 16-door candidate.');

const immutableFiles = [];
for (const directory of ['originals', 'prompts', 'processed'])
  for (const name of fs.readdirSync(path.join(lane, 'assets', directory)))
    immutableFiles.push('assets/' + directory + '/' + name);
immutableFiles.push('assets/generation-manifest.json', 'assets/generation-receipts.json',
  'assets/reference-baseline.json', 'proof/asset-contract.json', 'proof/layout-baseline.json', 'proof/actor-baseline.json');
const unchangedHashes = Object.fromEntries(immutableFiles.map(file => [file, sha(path.join(lane, file))]));
const files = ['presentation-contract.json', 'proof-manifest.json', 'data.json', 'README.md', 'WORKER_HANDOFF.md',
  'evidence/browser-validation-report.json', 'evidence/capture-report.json',
  'evidence/validation.log', 'evidence/validation-report.json', 'evidence/control-validation-report.json',
  'evidence/native-painted.png', 'evidence/native-painted.json', 'evidence/native-empty.png', 'evidence/native-empty.json'];
for (const name of fs.readdirSync(path.join(here, 'evidence')))
  if (/^exam-.*\.(?:png|json)$/.test(name)) files.push('evidence/' + name);
fs.mkdirSync(archive, { recursive: true });
const archivedHashes = {};
for (const file of files) {
  const source = path.join(here, file), target = path.join(archive, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  archivedHashes[file] = sha(target);
}
fs.copyFileSync(path.join(lane, 'README.md'), path.join(archive, 'room-README.md'));
archivedHashes['room-README.md'] = sha(path.join(archive, 'room-README.md'));
fs.writeFileSync(path.join(archive, 'intake.json'), JSON.stringify({
  date: '2026-10-08',
  basis: 'Manager reviewed the painted 16-door candidate: browser validation PASS, page errors 0. Manager then directed the real game model: 12 one-tile sections on the same 3x3 room.',
  priorBrowserStatus: browser.status, priorPageErrors: browser.errors.length,
  priorDoorModel: presentation.doorModel, archivedHashes, unchangedHashes,
  unchangedPresentation: Object.fromEntries(['sourceScale', 'sourceScaleBasis', 'actors', 'approaches'].map(key => [key, presentation[key]])),
  reviewedDesign: { assets: DESIGN_ASSETS, room: DESIGN_ROOMS[0] }
}, null, 2) + '\n', 'utf8');
console.log('REVISION INTAKE PASS ' + files.length + ' reviewed proof/evidence files plus room README preserved; manager browser PASS, page errors 0; ' + immutableFiles.length + ' art/source contracts frozen');
