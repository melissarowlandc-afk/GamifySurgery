// One-time snapshot for the owner's backless-stool revision; shared art is read only.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha } from '../assets/image-utils.mjs';
import { DESIGN_ASSETS, DESIGN_ROOMS } from './design-rooms.js';
const here = path.dirname(fileURLToPath(import.meta.url));
const archive = path.join(here, 'revisions/stool-with-back-reviewed');
if (fs.existsSync(archive)) throw Error('Stool revision intake already exists; preserve it.');
const read = file => JSON.parse(fs.readFileSync(path.join(here, file), 'utf8'));
const presentation = read('presentation-contract.json');
if (presentation.doorModel.count !== 12) throw Error('Expected the completed twelve-door revision.');
fs.mkdirSync(archive, { recursive: true });
const files = ['presentation-contract.json','data.json','proof-manifest.json','README.md','WORKER_HANDOFF.md',
  'evidence/native-painted.png','evidence/native-empty.png','evidence/native-all-doors.png',
  'evidence/native-backed.png','evidence/native-contacts.png','evidence/native-inspection-report.json',
  'evidence/seat-layer-report.json','evidence/validation.log','evidence/validation-report.json',
  'evidence/control-validation-report.json'];
const archivedHashes = {};
for (const file of files) {
  const target = path.join(archive, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(here, file), target);
  archivedHashes[file] = sha(target);
}
fs.writeFileSync(path.join(archive, 'intake.json'), JSON.stringify({
  date:'2026-10-08',
  ownerQuote:"Remove the 'backs' on rolling stools and just have the clinician layer on top of the stool. Then we don't have to worry about the back funniness. Otherwise this is approved.",
  authorizedChanges:['Derived backless stool from approved art; source file unchanged.','Clinician paints entirely above the whole stool.'],
  archivedHashes, reviewedDesign:{assets:DESIGN_ASSETS,room:DESIGN_ROOMS[0]},
  reviewedPresentation:presentation
}, null, 2) + '\n', 'utf8');
console.log('STOOL REVISION INTAKE PASS twelve-door proof and ' + files.length + ' reviewed files preserved; owner revision recorded');
