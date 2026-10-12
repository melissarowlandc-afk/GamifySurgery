// Native art canvas fit only; preserve frozen prepaint layout/seat/floor anchors.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),p=path.join(root,'layout.json'),layout=JSON.parse(fs.readFileSync(p)),rug=layout.pieces.find(p=>p.id==='rug');
if(JSON.stringify(rug.canvas)!=='[1584,1104]')throw Error('Reconciliation already applied or unexpected canvas.');
rug.canvas=[1320,920];layout.room.records.find(r=>r.id==='rug').sourceRect=[0,0,...rug.canvas];
fs.writeFileSync(p,JSON.stringify(layout,null,2)+'\n');
fs.writeFileSync(path.join(root,'layout-reconciliation-v2.json'),JSON.stringify({schemaVersion:2,changes:[{slot:'rug',field:'canvas/sourceRect',before:[1584,1104],after:[1320,920],reason:'Generated rug opaque crop is 1326×698. Use 400 native pixels/tile so packing uniformly downsamples instead of upscaling. Display size 3.3×2.3, centre, walkability, routes and all chair/floor anchors are unchanged.'}],unchanged:['All furniture ground anchors','Both occupant/cushion anchors','All declared footprints','All door/backing ownership','All actor identities/directions/source scales','All display sizes']},null,2)+'\n');
console.log('RECONCILIATION PASS: rug canvas at 400 native pixels/tile; no source upscale; all layout/seat anchors unchanged.');
