// Proposed 4x3 geometry, frozen before image generation; no runtime edits.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';import {createCanvas} from '@napi-rs/canvas';import * as G from './proof/geometry.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const save=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,Buffer.isBuffer(v)||typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');};
if(fs.existsSync(path.join(root,'stand-in/v2/layout-prepaint.json')))throw Error('Frozen stand-ins exist. Do not overwrite.');
const pieces=[
 {id:'desk',canvas:[696,600],size:[1.45,1.25],ground:[1.25,1.18],footprint:{left:.63,top:.90,width:1.24,height:.28},owners:[]},
 {id:'executiveChair',canvas:[480,768],size:[1,1.6],ground:[1.25,1.0],seat:[1.25,.625],footprint:{left:.92,top:.70,width:.66,height:.30},owners:[]},
 {id:'visitorChair',canvas:[456,576],size:[.95,1.2],ground:[1.25,2.22],seat:[1.25,1.845],footprint:{left:.90,top:1.90,width:.70,height:.32},owners:[]},
 {id:'shelf',canvas:[720,384],size:[1.5,.8],ground:[2.75,.30],footprint:{left:2.07,top:.14,width:1.36,height:.16},owners:['N3','N4']},
 {id:'meetingTable',canvas:[480,432],size:[1,.9],ground:[2.95,1.68],footprint:{left:2.61,top:1.38,width:.68,height:.30},owners:[]},
 {id:'meetingChair',canvas:[456,576],size:[.95,1.2],ground:[2.95,1.0],footprint:{left:2.62,top:.75,width:.66,height:.25},owners:[]},
 {id:'meetingSouth',spriteSlot:'visitorChair',canvas:[456,576],size:[.95,1.2],ground:[2.95,2.22],footprint:{left:2.60,top:1.90,width:.70,height:.32},owners:[]},
 {id:'rug',canvas:[1584,1104],size:[3.3,2.3],center:[2,1.65],owners:[],walkable:true},
 {id:'decor',canvas:[432,240],size:[.9,.5],top:[1.25,-.73],owners:['N1','N2'],backed:['N1','N2']},
 {id:'art',canvas:[576,264],size:[1.2,.55],top:[3.0,-.76],owners:['N3','N4'],backed:['N3','N4']},
 {id:'accent',canvas:[288,480],size:[.6,1],ground:[.38,.35],footprint:{left:.17,top:.14,width:.42,height:.21},owners:['N1','WA']},
];
const record=p=>({id:p.id,assetId:'design:eo:base-'+(p.spriteSlot??p.id),sourceRect:[0,0,...p.canvas],renderSizeTiles:p.size,destinationTopLeftTiles:p.ground?[p.ground[0]-p.size[0]/2,p.ground[1]-p.size[1]]:p.center?[p.center[0]-p.size[0]/2,p.center[1]-p.size[1]/2]:[p.top[0]-p.size[0]/2,p.top[1]],...(p.ground||p.center?{worldLocalGround:p.ground??p.center}:{}),depthPolicy:p.top?'wall':p.walkable?'authored-layer':'ground-contact',depthKey:p.walkable?-.5:p.ground?.[1]??p.top?.[1],canvasTransform:[1,0,0,1,0,0],attachments:{},doorOwners:p.owners,backedOwners:p.backed??[],touchupKeepWhenBacked:!!p.footprint&&p.owners.length>0,...(p.footprint?{footprint:p.footprint}:{}),...(p.walkable?{walkable:true}:{})});
const records=pieces.map(record);
for(const id of ['executiveChair','visitorChair']){const r=records.find(r=>r.id===id);records.push({...r,id:id+':front',assetId:r.assetId+'-front',footprint:undefined,depthPolicy:'authored-layer',depthKey:r.depthKey+.0002,overlayFor:id});}
const actors=[
 {supportId:'executiveChair',recordId:'executiveChair',characterId:'founder.01',category:'approved-character-stand-in',group:'executives',direction:'south',seat:[1.25,.625],ground:[1.25,1.0],painterGround:1.0001,seatContactSource:[80,241.13389121338912],sourceScale:.6865478271728273,basis:'Unchanged approved founder.01 south still used only as Executive seating stand-in; not a role assignment or new character.'},
 {supportId:'visitorChair',recordId:'visitorChair',characterId:'patient.adult.007',category:'patient',group:'visitors',direction:'north',seat:[1.25,1.845],ground:[1.25,2.22],painterGround:2.2201,seatContactSource:[80,220],sourceScale:.6865478271728273,basis:'Unchanged approved north-facing adult visitor with posterior contact and camera-side rear chair foreground.'},
];
const presentation={schemaVersion:2,status:'candidate_needs_owner_review',doorModel:{count:14,perWall:{N:4,S:4,W:3,E:3},spanTiles:1,kind:'game-one-tile'},orientation:'Executive sits north facing south; visitor south facing north; desk shows south visitor-side face and monitor backs.',actors,careApproach:[2.2,1.9],approaches:{executiveChair:[.85,.475],visitorChair:[.65,2.15]}};
const shell={tilePixels:120,rearWallHeightPixels:90,lowNorthHeightPixels:29,sideCapWidthPixels:14,southHeightPixels:29,floorAlgorithm:'design',floorBase:'#d9dbd4',floorPalette:['#d9dbd4'],background:'#f3ead3',rearWall:'#a5c3b8',baseTrim:'#58735a',edgeTrim:'#294632',doorJamb:'#744a29',doorInsetPixels:12};
const floor=[{shape:'rect',x:0,y:0,width:480,height:360,color:'#d9dbd4'}];
for(let y=0;y<360;y+=40){floor.push({shape:'line',x:0,y,width:480,height:0,color:'#b8bdb6',alpha:.32});for(let x=80;x<480;x+=80)floor.push({shape:'line',x,y,width:0,height:40,color:'#b8bdb6',alpha:.22});}
const room={proofId:'executive-office',definitionId:'room.executive_office',name:'Executive Office',label:'Executive Office',design:true,footprint:[4,3],shell,records,floor,procedural:[],supports:actors.map(a=>({id:a.supportId,recordId:a.recordId,role:a.group==='executives'?'executive-office-seat':'visitor-seat',pose:'seated',facing:a.direction,seat:{x:a.seat[0],y:a.seat[1]},ground:{x:a.ground[0],y:a.ground[1]},character:a.characterId})),notes:['Proposed 4×3: desk bay and two-chair round meeting bay, 14 legal one-tile door sections.','Fixed base appearance at upgrade Levels 1–5: room.executive_office has appearanceChanges=false.','Executive is an approved south still stand-in north of the desk; north-facing visitor is south of it. Two meeting chairs remain empty.','Desk shows visitor-side panel and dual monitor backs. Chair then sitter then foreground arms/back.','Credenza and plant hide for their owned door sections; window/KPI hide for owned door/backing sections. Floor furniture stays full height on low backing.','Walkable rug; radius-clear routes stop at standing approaches. No pass-through exception.','Private art candidate; owner approval pending; no runtime, balance, administrative mechanic or campaign storage.']};
const tiers=Array.from({length:5},(_,i)=>({level:i+1,name:'Fixed base appearance',appearanceLevel:1,summary:'The same corporate office at every upgrade level: dual-monitor desk, executive chair, visitor chair, round meeting table/two chairs, credenza, abstract KPI board, plant, window and flat rug. Catalog appearanceChanges=false; no gameplay effect simulated.'}));
const layout={schemaVersion:2,status:'proposed_4x3_fixed_base_layout',approval:null,runtimeIntegrationAuthorized:false,appearanceChanges:false,appearanceLevels:[1],upgradeLevels:[1,2,3,4,5],catalogEvidence:'packages/balance-config/src/room-upgrades.ts:51–53,96; default appearanceChanges=false. Roadmap lists Executive Office second at facility Level 5 but supplies no footprint.',pieces,room,presentation,navigation:{solidFixtures:[],doorThresholdExceptions:[],privateProofRouteModel:presentation},tiers};
let states=0,routes=0;const doors=G.roomSegments(room);
for(let mask=0;mask<16;mask++)for(const open of [[],...doors.map(s=>[s]),doors]){const backed=['N1','N2','N3','N4'].filter((_,i)=>mask&(1<<i)),result=G.check(room,layout.navigation,open,backed);if(result.unreachable.length||result.conflicts.length||result.doorZone.length)throw Error(JSON.stringify({open,backed,result}));states++;routes+=result.routes;}
save(path.join(root,'layout.json'),layout);save(path.join(root,'stand-in/v2/layout-prepaint.json'),layout);
const standins=[];
for(const p of pieces.filter(p=>!p.spriteSlot)){
 const [w,h]=p.canvas,c=createCanvas(w,h),g=c.getContext('2d');g.fillStyle='#728071';let sourcePoints={};
 if(p.id==='executiveChair'){g.fillRect(110,120,260,462);g.fillStyle='#465a4d';g.fillRect(70,550,340,55);g.fillRect(100,600,28,162);g.fillRect(352,600,28,162);sourcePoints={seat:[240,582],frontRegions:[[60,548,80,62],[340,548,80,62],[0,610,w,h-610]]};}
 else if(p.id==='visitorChair'){g.fillRect(86,235,284,195);g.fillRect(98,420,26,150);g.fillRect(332,420,26,150);sourcePoints={seat:[228,390],frontRegions:[[0,0,w,h]]};}
 else if(p.id==='desk'){g.fillStyle='#c1b294';g.fillRect(12,220,w-24,35);g.fillRect(30,255,w-60,h-261);g.fillStyle='#424d46';g.fillRect(60,80,200,140);g.fillRect(w-260,80,200,140);sourcePoints={worktop:[w/2,220]};}
 else if(p.id==='meetingTable'){g.fillStyle='#bdb49e';g.beginPath();g.ellipse(w/2,h*.22,w*.46,h*.18,0,0,Math.PI*2);g.fill();g.fillRect(w*.43,h*.3,w*.14,h*.68);}
 else if(p.id==='rug'){g.fillStyle='#91a397';g.fillRect(12,12,w-24,h-24);}
 else if(p.top){g.fillStyle='#66766a';g.fillRect(8,8,w-16,h-16);g.fillStyle='#d3e3d5';g.fillRect(28,28,w-56,h-56);}
 else {g.fillRect(20,15,w-40,h-21);g.fillStyle='#dee4d8';for(let y=70;y<h-40;y+=100)g.fillRect(34,y,w-68,60);}
 const file='stand-in/v2/'+p.id+'.png';save(path.join(root,file),c.toBuffer('image/png'));standins.push({id:p.id,file,sourcePoints,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')});
}
save(path.join(root,'stand-in/v2/manifest.json'),{schemaVersion:2,purpose:'Frozen prepaint geometry-only sources. Shared visitor chair also supplies empty meetingSouth.',assets:standins});
save(path.join(root,'stand-in/v2/route-receipt.json'),{status:'PASS',phase:'Prepaint declared geometry',states,routes,actorRadiusTiles:G.ACTOR_RADIUS,doorSections:14,backingSections:4,approval:null});
console.log(`STAND-IN GEOMETRY PASS: shared 4x3; ${states} door/backing states; ${routes} routes; 14 one-tile doors; 2 seated adults; no pass-through exceptions.`);
