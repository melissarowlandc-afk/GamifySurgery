// Read-only intake. Writes only the assigned exam lane; no Git or browser.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(here,'../../../../..');
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').toUpperCase();
const output=path.join(here,'reference-baseline.json');
if(fs.existsSync(output))throw Error('Intake already recorded; preserve the initial receipt.');
const roots=['tools/room-design/level-4/pediatric-waiting','tools/room-design/level-4/mri','tools/room-design/level-4/radiology-reading','tools/room-design/level-3','apps/player/public/art/rooms/gs015-v1','tools/room-design/level-4/pediatric-exam/ART_BRIEF.md','tools/room-design/level-4/pediatric-exam/stand-in','tools/room-design/touchup-2026-10/lab/design-rooms.js','tools/room-design/touchup-2026-10/lab/lab.js','tools/room-design/touchup-2026-10/build/lab-data.json','tools/room-design/touchup-2026-10/build/room-touchups.mjs'];
const files={};
function collect(rel){const f=path.join(repo,rel);if(fs.statSync(f).isDirectory())for(const n of fs.readdirSync(f).sort())collect(rel+'/'+n);else files[rel]=sha(f);}
roots.forEach(collect);
fs.writeFileSync(output,JSON.stringify({schemaVersion:1,date:'2026-10-08',purpose:'Protected read-only source intake; shared concurrent changes are manager decisions.',files},null,2)+'\n');
const source=fs.readFileSync(path.join(repo,'tools/room-design/touchup-2026-10/lab/design-rooms.js'));
const d=await import('data:text/javascript;base64,'+source.toString('base64'));
const room=d.DESIGN_ROOMS.find(r=>r.proofId==='pediatric-exam');
if(!room)throw Error('Missing source pediatric-exam room');
const layout={sourceSha256:sha(path.join(repo,'tools/room-design/touchup-2026-10/lab/design-rooms.js')),room,navigation:d.DESIGN_NAVIGATION[room.definitionId],assets:Object.fromEntries(room.records.map(r=>[r.assetId,d.DESIGN_ASSETS[r.assetId]]))};
fs.mkdirSync(path.join(here,'../proof'),{recursive:true});
fs.writeFileSync(path.join(here,'../proof/layout-baseline.json'),JSON.stringify(layout,null,2)+'\n');
console.log('REFERENCES recorded '+Object.keys(files).length+' protected files');
console.log(JSON.stringify(layout,null,2));
