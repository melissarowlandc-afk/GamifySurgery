// Shared 3x3 geometry and frozen prepaint evidence. No runtime edits.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createCanvas} from '@napi-rs/canvas';
import * as G from './proof/geometry.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const save=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,Buffer.isBuffer(v)||typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');};
if(fs.existsSync(path.join(root,'stand-in/v2/layout-prepaint.json')))throw Error('Frozen v2 stand-ins already exist. Do not overwrite.');
const pieces=[
 {id:'desk',canvas:[648,432],size:[1.35,.9],ground:[1.5,1.38],footprint:{left:.88,top:1.10,width:1.24,height:.28},owners:[]},
 {id:'founderChair',canvas:[456,768],size:[.95,1.6],ground:[1.5,1.0],seat:[1.5,.625],footprint:{left:1.17,top:.70,width:.66,height:.30},owners:[]},
 {id:'visitorChair',canvas:[456,576],size:[.95,1.2],ground:[1.5,2.22],seat:[1.5,1.845],footprint:{left:1.15,top:1.90,width:.70,height:.32},owners:[]},
 {id:'shelf',canvas:[384,672],size:[.8,1.4],ground:[.48,.30],footprint:{left:.16,top:.14,width:.64,height:.16},owners:['N1','WA']},
 {id:'rug',canvas:[912,672],size:[1.9,1.4],center:[1.5,1.65],owners:[],walkable:true},
 {id:'decor',canvas:[384,240],size:[.8,.5],top:[2.10,-.70],owners:['N2','N3'],backed:['N2','N3']},
 {id:'accent',canvas:[312,528],size:[.65,1.1],ground:[2.55,.35],footprint:{left:2.32,top:.14,width:.46,height:.21},owners:['N3','EA'],presentIn:[2,4,5]},
];
const record=p=>({id:p.id,assetId:'design:fo:l1-'+p.id,sourceRect:[0,0,...p.canvas],renderSizeTiles:p.size,destinationTopLeftTiles:p.ground?[p.ground[0]-p.size[0]/2,p.ground[1]-p.size[1]]:p.center?[p.center[0]-p.size[0]/2,p.center[1]-p.size[1]/2]:[p.top[0]-p.size[0]/2,p.top[1]],...(p.ground||p.center?{worldLocalGround:p.ground??p.center}:{}),depthPolicy:p.top?'wall':p.walkable?'authored-layer':'ground-contact',depthKey:p.walkable?-.5:p.ground?.[1]??p.top?.[1],canvasTransform:[1,0,0,1,0,0],attachments:{},doorOwners:p.owners,backedOwners:p.backed??[],touchupKeepWhenBacked:!!p.footprint&&p.owners.length>0,...(p.footprint?{footprint:p.footprint}:{}),...(p.walkable?{walkable:true}:{}),...(p.presentIn?{presentIn:p.presentIn}:{})});
const records=pieces.map(record);
for(const id of ['founderChair','visitorChair']){const r=records.find(r=>r.id===id);records.push({...r,id:id+':front',assetId:r.assetId+'-front',footprint:undefined,depthPolicy:'authored-layer',depthKey:r.depthKey+.0002,overlayFor:id});}
const actors=[
 {supportId:'founderChair',recordId:'founderChair',characterId:'founder.01',category:'verified-founder',group:'founders',direction:'south',seat:[1.5,.625],ground:[1.5,1.0],painterGround:1.0001,seatContactSource:[80,241.13389121338912],sourceScale:.6865478271728273,basis:'Existing real founder south still; same measured contact/uniform scale as approved Reading proof.'},
 {supportId:'visitorChair',recordId:'visitorChair',characterId:'patient.adult.007',category:'patient',group:'visitors',direction:'north',seat:[1.5,1.845],ground:[1.5,2.22],painterGround:2.2201,seatContactSource:[80,220],sourceScale:.6865478271728273,basis:'Existing real adult north seated still, visually inspected posterior contact at [80,220]; chair back and arms are the foreground.'},
];
const presentation={schemaVersion:2,status:'candidate_needs_owner_review',doorModel:{count:12,perWall:3,spanTiles:1,kind:'game-one-tile'},orientation:'Founder north of desk facing south; visitor south of desk facing north; desk shows its south visitor-side face.',actors,careApproach:[2.4,1.25],approaches:{founderChair:[1.0,.5],visitorChair:[.95,2.15]}};
const shell={tilePixels:120,rearWallHeightPixels:90,lowNorthHeightPixels:29,sideCapWidthPixels:14,southHeightPixels:29,floorAlgorithm:'design',floorBase:'#e4d7b8',floorPalette:['#e4d7b8'],background:'#f3ead3',rearWall:'#a5c3b8',baseTrim:'#58735a',edgeTrim:'#294632',doorJamb:'#744a29',doorInsetPixels:12};
const floor=[{shape:'rect',x:0,y:0,width:360,height:360,color:'#e4d7b8'}];
for(let y=0,row=0;y<360;y+=24,row++){floor.push({shape:'line',x:0,y,width:360,height:0,color:'#b8a781',alpha:.35});for(let x=row%2?60:120;x<360;x+=120)floor.push({shape:'line',x,y,width:0,height:24,color:'#b8a781',alpha:.22});}
const room={proofId:'founders-office',definitionId:'room.founder_office',name:"Founder's Office",label:"Founder's Office",design:true,footprint:[3,3],shell,records,floor,procedural:[],supports:actors.map(a=>({id:a.supportId,recordId:a.recordId,role:a.group==='founders'?'founder-office-seat':'visitor-seat',pose:'seated',facing:a.direction,seat:{x:a.seat[0],y:a.seat[1]},ground:{x:a.ground[0],y:a.ground[1]},character:a.characterId})),notes:['Owner-directed 3×3; 12 one-tile wall sections. All five appearance tiers share anchors and footprints.','Founder sits north of the desk facing south. Desk art shows the south visitor face. Visitor faces north, viewed from behind.','Wall-owned shelf/accent hides for its own door. Floor furniture stays full height against low north backing.','Walking routes stop at clear standing approaches; dotted links mark static seating contacts.','Appearance prototype only; morale behavior undecided; owner art approval pending.']};
const layout={schemaVersion:2,status:'owner_directed_3x3_five_tier_layout',approval:null,runtimeIntegrationAuthorized:false,pieces,room,presentation,navigation:{solidFixtures:[],doorThresholdExceptions:[],privateProofRouteModel:presentation},tiers:[{level:1,name:'Startup',summary:'Basic table, simple chair, folding guest chair, wire rack, plain mat, small print.'},{level:2,name:'Established',summary:'Plain wood desk, padded task and guest chairs, simple shelf, small rug, diploma and plant.'},{level:3,name:'Refined',summary:'Paneled wood desk and lamp, leather founder chair, upholstered guest chair, bookcase, patterned rug and art.'},{level:4,name:'Executive',summary:'Carved desk, high-back leather seating, glass awards cabinet, rich rug, statement art and plant.'},{level:5,name:'Grand',summary:'Gold-trim carved desk, throne, velvet guest armchair, ornate bookcase, luxury rug, gilded art and classical bust.'}]};
save(path.join(root,'layout.json'),layout);save(path.join(root,'stand-in/v2/layout-prepaint.json'),layout);
const standins=[];
for(const p of pieces){const [w,h]=p.canvas,c=createCanvas(w,h),g=c.getContext('2d');g.strokeStyle='#33382f';g.lineWidth=8;g.fillStyle='#bda281';let sourcePoints={};
 if(p.id==='founderChair'){g.fillStyle='#6e7b72';g.fillRect(105,120,246,462);g.fillStyle='#485449';g.fillRect(80,550,296,55);g.fillRect(100,600,28,162);g.fillRect(328,600,28,162);sourcePoints={seat:[228,582],frontRegions:[[70,548,75,62],[311,548,75,62],[0,583,w,h-583]]};}
 else if(p.id==='visitorChair'){g.fillStyle='#76746a';g.fillRect(86,235,284,195);g.fillRect(98,420,26,150);g.fillRect(332,420,26,150);sourcePoints={seat:[228,390],frontRegions:[[0,235,w,h-235]]};}
 else if(p.id==='desk'){g.fillRect(12,80,w-24,35);g.fillRect(28,115,28,h-121);g.fillRect(w-56,115,28,h-121);sourcePoints={worktop:[w/2,80]};}
 else if(p.id==='rug'){g.fillStyle='#aaa18b';g.fillRect(12,12,w-24,h-24);}
 else if(p.id==='decor'){g.fillStyle='#988056';g.fillRect(8,8,w-16,h-16);g.fillStyle='#9daea1';g.fillRect(28,28,w-56,h-56);}
 else {g.fillRect(20,15,w-40,h-21);g.fillStyle='#efe6d1';for(let y=70;y<h-40;y+=100)g.fillRect(34,y,w-68,68);}
 const file='stand-in/v2/'+p.id+'.png';save(path.join(root,file),c.toBuffer('image/png'));
 standins.push({id:p.id,file,sourcePoints});
}
save(path.join(root,'stand-in/v2/manifest.json'),{schemaVersion:2,purpose:'Geometry-only stand-ins, frozen before painting.',assets:standins.map(a=>({...a,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,a.file))).digest('hex')}))});
let states=0,routes=0;const doors=G.roomSegments(room);
for(let mask=0;mask<8;mask++)for(const open of [[],...doors.map(s=>[s]),doors]){const backed=['N1','N2','N3'].filter((_,i)=>mask&(1<<i)),result=G.check(room,layout.navigation,open,backed);if(result.unreachable.length||result.conflicts.length||result.doorZone.length)throw Error(JSON.stringify({open,backed,result}));states++;routes+=result.routes;}
save(path.join(root,'stand-in/v2/route-receipt.json'),{status:'PASS',phase:'Prepaint declared geometry',states,routes,actorRadiusTiles:G.ACTOR_RADIUS,doorSections:12,approval:null});
console.log(`STAND-IN GEOMETRY PASS: shared 3x3; ${states} door/backing states; ${routes} routes; 12 one-tile doors; 2 seated adults; no pass-through exceptions.`);
