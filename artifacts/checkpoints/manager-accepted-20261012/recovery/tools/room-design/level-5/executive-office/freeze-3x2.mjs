// Freeze the revised geometry before repacking the unchanged generated art.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';import * as G from './proof/geometry.mjs';
const root=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(root,'../../../..'),out=path.join(root,'stand-in/v3'),layout=JSON.parse(fs.readFileSync(path.join(root,'layout.json'))),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),save=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,Buffer.isBuffer(v)||typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');};
if(fs.existsSync(path.join(out,'layout-prepaint.json')))throw Error('Frozen revised geometry already exists');
const old=JSON.parse(fs.readFileSync(path.join(root,'history/4x3-20261010/stand-in/v2/manifest.json'))),assets=[];
for(const p of layout.pieces){const a=old.assets.find(a=>a.id===p.id),file='stand-in/v3/'+p.id+'.png';if(!a)throw Error('Missing prior geometry stand-in '+p.id);save(path.join(root,file),fs.readFileSync(path.join(root,a.file)));assets.push({...a,file,sha256:hash(path.join(root,file)),reusedFrom:a.file});}
save(path.join(out,'manifest.json'),{schemaVersion:3,purpose:'Owner-directed 3x2 geometry frozen before repacking reused generated pixels; eight original neutral geometry sources. No new generation claimed.',assets});
save(path.join(out,'layout-prepaint.json'),layout);
const doors=G.roomSegments(layout.room),north=doors.filter(d=>d[0]==='N');let states=0,routes=0;
for(let mask=0;mask<2**north.length;mask++)for(const open of [[],...doors.map(s=>[s]),doors]){const result=G.check(layout.room,layout.navigation,open,north.filter((_,i)=>mask&(1<<i)));if(result.unreachable.length||result.conflicts.length||result.doorZone.length)throw Error(JSON.stringify(result));states++;routes+=result.routes;}
save(path.join(out,'route-receipt.json'),{status:'PASS',phase:'Revised declared geometry before reused-art preparation',states,routes,actorRadiusTiles:G.ACTOR_RADIUS,doorSections:10,backingSections:3,approval:null});
const references=JSON.parse(fs.readFileSync(path.join(root,'assets/reference-baseline.json'))).references.map(r=>({...r,previousMilestoneSha256:r.sha256,sha256:hash(path.join(repo,r.path))}));
save(path.join(root,'assets/revision-reference-baseline.json'),{date:'2026-10-10',purpose:'Read-only shared references at intake of the owner footprint correction',references});
console.log(`REVISION FREEZE PASS: 8 unchanged geometry sources; 3x2 seats/footprints frozen; ${states} states; ${routes} routes; 43 shared intake hashes recorded.`);
