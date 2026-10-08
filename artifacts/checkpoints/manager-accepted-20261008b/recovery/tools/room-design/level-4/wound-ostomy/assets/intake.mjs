// Read-only reference intake. No Git, browser or external messages.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {sha,decode} from './image-utils.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(here,'../../../../..'),proof=path.join(here,'../proof');
const write=(f,x)=>fs.writeFileSync(f,JSON.stringify(x,null,2)+'\n');
if(fs.existsSync(path.join(here,'reference-baseline.json')))throw Error('Intake already exists; preserve initial receipt.');
const roots=['tools/room-design/level-4/pediatric-exam','tools/room-design/level-4/pediatric-waiting','tools/room-design/level-3','apps/player/public/art/rooms/gs015-v1','tools/room-design/level-4/wound-ostomy/ART_BRIEF.md','tools/room-design/level-4/wound-ostomy/stand-in','apps/player/public/art/rooms/touchup-v1/curtain-bunch.png','apps/player/public/art/rooms/touchup-v1/biohazard-bin.png','tools/room-design/touchup-2026-10/lab/design-rooms.js','tools/room-design/touchup-2026-10/lab/lab.js','tools/room-design/touchup-2026-10/build/lab-data.json','tools/room-design/touchup-2026-10/build/room-touchups.mjs'];
const files={};
function collect(rel){const f=path.join(repo,rel);if(fs.statSync(f).isDirectory())for(const n of fs.readdirSync(f).sort())collect(rel+'/'+n);else files[rel]=sha(f);}
roots.forEach(collect);
write(path.join(here,'reference-baseline.json'),{schemaVersion:1,date:'2026-10-08',purpose:'Read-only approved references, own frozen brief/stand-ins and shared layout. Concurrent changes require attribution, not reversion.',files});
const layoutFile=path.join(repo,'tools/room-design/touchup-2026-10/lab/design-rooms.js');
const d=await import('data:text/javascript;base64,'+fs.readFileSync(layoutFile).toString('base64')),room=d.DESIGN_ROOMS.find(r=>r.proofId==='wound-ostomy');
write(path.join(proof,'layout-baseline.json'),{sourceSha256:sha(layoutFile),room,navigation:d.DESIGN_NAVIGATION[room.definitionId],assets:Object.fromEntries(room.records.map(r=>[r.assetId,d.DESIGN_ASSETS[r.assetId]]))});
const old=JSON.parse(fs.readFileSync(path.join(repo,'tools/room-design/level-4/pediatric-exam/proof/actor-baseline.json'),'utf8'));
const ids=['patient.adult.007','gs026-employee-001'],characters=old.characters.filter(c=>ids.includes(c.id)),actorHashes={};
if(characters.length!==2)throw Error('Missing real existing adult/clinician.');
for(const c of characters)for(const [pose,dirs] of Object.entries(c.poses))for(const [dir,p]of Object.entries(dirs)){const rel='apps/player/public/'+p.url;actorHashes[c.id+'/'+pose+'/'+dir]={path:rel,sha256:sha(path.join(repo,rel))};}
write(path.join(proof,'actor-baseline.json'),{schemaVersion:1,date:'2026-10-08',registryPath:old.registryPath,registrySha256AtIntake:sha(path.join(repo,old.registryPath)),characterMetrics:old.characterMetrics,characters,actorHashes});
for(const [id,r]of [['stool',room.records.find(r=>r.id==='stool')],['sink',room.records.find(r=>r.id==='sink')]]){
 const spec=d.DESIGN_ASSETS[r.assetId],full=path.resolve(repo,'tools/room-design/touchup-2026-10/lab',spec.src),im=await decode(full);
 const {createCanvas}=await import('@napi-rs/canvas'),c=createCanvas(r.sourceRect[2],r.sourceRect[3]);c.getContext('2d').drawImage(im.canvas,...r.sourceRect,0,0,c.width,c.height);fs.writeFileSync(path.join(proof,'evidence/reference-'+id+'.png'),c.toBuffer('image/png'));
}
console.log('INTAKE PASS '+Object.keys(files).length+' protected files; frozen 3x3 Wound/Ostomy layout; '+Object.keys(actorHashes).length+' real character poses');
console.log(JSON.stringify(characters.map(c=>({id:c.id,category:c.category,sit:c.poses.sit})),null,2));
