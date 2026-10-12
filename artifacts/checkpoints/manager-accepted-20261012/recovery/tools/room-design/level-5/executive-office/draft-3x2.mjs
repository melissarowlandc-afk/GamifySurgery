// Owner-directed compact layout. Only the owned private room files are written.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import * as G from './proof/geometry.mjs';
const root=path.dirname(fileURLToPath(import.meta.url)),archive=path.join(root,'history/4x3-20261010');
if(!fs.existsSync(path.join(archive,'archive-manifest.json')))throw Error('Archive the 4x3 first');
const original=JSON.parse(fs.readFileSync(path.join(archive,'layout.json'))),layout=structuredClone(original),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const save=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');};
layout.schemaVersion=3;layout.status='owner_directed_3x2_layout_needs_review';layout.ownerDirection={date:'2026-10-10',quote:"The executive office should be 3x2 (can't be bigger than the founder [3x3]), but the rest of it looks good.",footprint:[3,2],artDecision:'Reuse the existing corporate assets and fixed base appearance.'};
layout.room.footprint=[3,2];
layout.pieces=layout.pieces.filter(p=>!['meetingTable','meetingChair','meetingSouth'].includes(p.id));
for(const p of layout.pieces){
 if(p.id==='desk'){p.ground=[1.5,1];p.footprint={left:.88,top:.72,width:1.24,height:.28};}
 if(p.id==='executiveChair'){p.ground=[1.5,.82];p.seat=[1.5,.445];p.footprint={left:1.17,top:.52,width:.66,height:.30};}
 if(p.id==='visitorChair'){p.ground=[1.5,1.74];p.seat=[1.5,1.365];p.footprint={left:1.15,top:1.42,width:.70,height:.32};}
 if(p.id==='shelf'){p.canvas=[600,320];p.size=[1.25,2/3];p.ground=[2.36,.30];p.footprint={left:1.78,top:.14,width:1.16,height:.16};}
 if(p.id==='rug'){p.canvas=[1152,624];p.size=[2.4,1.3];p.center=[1.5,1.15];}
 if(p.id==='decor'){p.top=[1.15,-.73];}
 if(p.id==='art'){p.size=[1,.55];p.canvas=[480,264];p.top=[2.47,-.76];}
 if(p.id==='accent'){p.ground=[.35,.25];p.footprint={left:.14,top:.04,width:.42,height:.21};}
 const previous=layout.room.records.find(r=>r.id===p.id),candidate={...previous,renderSizeTiles:p.size,footprint:p.footprint,destinationTopLeftTiles:p.ground?[p.ground[0]-p.size[0]/2,p.ground[1]-p.size[1]]:p.center?[p.center[0]-p.size[0]/2,p.center[1]-p.size[1]/2]:[p.top[0]-p.size[0]/2,p.top[1]]};
 p.owners=G.ownersFor(layout.room,candidate);p.backed=p.top?[...p.owners]:[];
}
layout.room.records=layout.pieces.map(p=>({id:p.id,assetId:'design:eo:base-'+p.id,sourceRect:[0,0,...p.canvas],renderSizeTiles:p.size,destinationTopLeftTiles:p.ground?[p.ground[0]-p.size[0]/2,p.ground[1]-p.size[1]]:p.center?[p.center[0]-p.size[0]/2,p.center[1]-p.size[1]/2]:[p.top[0]-p.size[0]/2,p.top[1]],...(p.ground||p.center?{worldLocalGround:p.ground??p.center}:{}),depthPolicy:p.top?'wall':p.walkable?'authored-layer':'ground-contact',depthKey:p.walkable?-.5:p.ground?.[1]??p.top?.[1],canvasTransform:[1,0,0,1,0,0],attachments:{},doorOwners:p.owners,backedOwners:p.backed??[],touchupKeepWhenBacked:!!p.footprint&&p.owners.length>0,...(p.footprint?{footprint:p.footprint}:{}),...(p.walkable?{walkable:true}:{})}));
for(const id of ['executiveChair','visitorChair']){const r=layout.room.records.find(r=>r.id===id);layout.room.records.push({...r,id:id+':front',assetId:r.assetId+'-front',footprint:undefined,depthPolicy:'authored-layer',depthKey:r.depthKey+.0002,overlayFor:id,walkable:true});}
for(const a of layout.presentation.actors){const p=layout.pieces.find(p=>p.id===a.recordId);a.seat=p.seat;a.ground=p.ground;a.painterGround=p.ground[1]+.0001;}
layout.presentation.schemaVersion=3;layout.presentation.doorModel={count:10,perWall:{N:3,S:3,W:2,E:2},spanTiles:1,kind:'game-one-tile'};
layout.presentation.careApproach=[2.55,1.15];layout.presentation.approaches={executiveChair:[.85,.45],visitorChair:[.85,1.65]};
layout.room.supports=layout.presentation.actors.map(a=>({id:a.supportId,recordId:a.recordId,role:a.group==='executives'?'executive-office-seat':'visitor-seat',pose:'seated',facing:a.direction,seat:{x:a.seat[0],y:a.seat[1]},ground:{x:a.ground[0],y:a.ground[1]},character:a.characterId}));
layout.room.floor=[{shape:'rect',x:0,y:0,width:360,height:240,color:'#d9dbd4'}];
for(let y=0;y<240;y+=40){layout.room.floor.push({shape:'line',x:0,y,width:360,height:0,color:'#b8bdb6',alpha:.32});for(let x=80;x<360;x+=80)layout.room.floor.push({shape:'line',x,y,width:0,height:40,color:'#b8bdb6',alpha:.22});}
layout.room.notes=['Owner-directed 3×2: smaller than the approved 3×3 Founder; 10 legal one-tile door sections.','One fixed corporate appearance at upgrades 1–5; no administrative mechanic simulated.','Executive north facing south; visitor south facing north; unchanged real character source scale and 45 px cushion rise.','Desk and both chairs retained. KPI, window, plant, compact credenza and flat walkable rug retained. Round meeting table and both meeting chairs dropped.','North N2 door hides the Executive chair and its sitter; south S2 door hides the visitor chair and its sitter, clearing the actual chair footprints. Closing restores them.','Credenza and plant hide for owned door sections. KPI/window hide for owned doors/backing. Floor furniture retains full height with low backing.','Routes stop at radius-clear standing approaches; dotted seat links are static contacts, not walking through furniture. No pass-through exception.','Reused corporate art; compact layout still needs manager browser QA and owner review; no runtime/balance/save writes.'];
for(const t of layout.tiers)t.summary='The same 3×2 corporate office at every upgrade: dual-monitor desk, Executive/visitor chairs, compact credenza, nonverbal KPI board, plant, window and flat rug. Meeting table and both meeting chairs omitted to preserve real clearances.';
layout.navigation={solidFixtures:[],doorThresholdExceptions:[],privateProofRouteModel:layout.presentation};
layout.furnitureDecision={kept:layout.pieces.map(p=>p.id),dropped:['meetingTable','meetingChair','meetingSouth'],basis:'Two seated desk adults and priority wall/plant pieces take precedence; no second seating bay fits with 0.18T actor radius and all one-tile doors.'};
let states=0,routes=0;const doors=G.roomSegments(layout.room),north=doors.filter(s=>s[0]==='N');
for(let mask=0;mask<2**north.length;mask++)for(const open of [[],...doors.map(s=>[s]),doors]){const backed=north.filter((_,i)=>mask&(1<<i)),r=G.check(layout.room,layout.navigation,open,backed);if(r.unreachable.length||r.conflicts.length||r.doorZone.length)throw Error(JSON.stringify({open,backed,result:r}));states++;routes+=r.routes;}
save(path.join(root,'layout.json'),layout);
const gen=JSON.parse(fs.readFileSync(path.join(archive,'assets/generation-manifest.json')));gen.schemaVersion=3;gen.assets=gen.assets.filter(a=>layout.pieces.some(p=>'base-'+p.id===a.id));gen.revisionDate='2026-10-10';gen.newCallsForRevision=0;gen.originalBuiltInCalls=10;gen.notes=['3×2 owner revision reuses eight of the ten original built-in generated objects; no new generation.','Round table and front meeting chair sources remain preserved in the 4×3 archive and original v2 source library.','Rear visitor chair now only supplies the desk visitor. Two exact-source foregrounds. Fixed appearance.'];
save(path.join(root,'assets/generation-manifest.json'),gen);
save(path.join(root,'layout-reconciliation-v3.json'),{schemaVersion:3,ownerDirection:layout.ownerDirection,sourceLayout:'history/4x3-20261010/layout.json',sourceLayoutSha256:hash(path.join(archive,'layout.json')),changes:[{kind:'footprint',from:[4,3],to:[3,2]},{kind:'remove-meeting-bay',pieces:layout.furnitureDecision.dropped},{kind:'compact-and-reposition',pieces:['desk','executiveChair','visitorChair','shelf','rug','decor','art','accent'],basis:'Owner-authorized footprint reduction; original art and adult scale retained.'},{kind:'door-ownership',basis:'Recomputed against the unchanged 0.55T depth / 0.12T inset doorway zones; chair foregrounds and sitters follow chair visibility.'}],layoutSha256:hash(path.join(root,'layout.json')),approval:null});
console.log(`DRAFT GEOMETRY PASS: 3x2; ${states} states; ${routes} routes; 10 one-tile doors; 8 reused objects; meeting bay dropped.`);
