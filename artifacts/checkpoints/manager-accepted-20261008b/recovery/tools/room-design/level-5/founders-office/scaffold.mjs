// Initial guarded additive scaffold. All writes stay in this worker's room lane.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createCanvas,loadImage} from '@napi-rs/canvas';
const root=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(root,'../../../..');
const src=path.join(repo,'tools/room-design/level-4/wound-ostomy/proof');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,v)=>{const out=path.resolve(root,p);if(!out.startsWith(root+path.sep))throw Error('Outside lane');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,typeof v==='string'||Buffer.isBuffer(v)?v:JSON.stringify(v,null,2)+'\n');};
if(fs.existsSync(path.join(root,'layout.json')))throw Error('Initial scaffold already exists; preserve it.');
const references=[];
function copy(from,to){const source=path.resolve(repo,from);references.push({path:from,sha256:hash(source),copiedTo:to});write(to,fs.readFileSync(source));}
for(const file of ['lab.js','geometry.mjs','native-engine.mjs','room-touchups.mjs','shell-painter.js','browser-errors.cjs'])copy('tools/room-design/level-4/wound-ostomy/proof/'+file,'proof/'+file);
write('proof/package.json','{"private":true,"type":"module"}\n');
write('assets/package.json','{"private":true,"type":"module"}\n');
let lab=fs.readFileSync(path.join(src,'lab.js'),'utf8');
lab=lab.slice(0,lab.indexOf('function paintCandidateDiagnostics('));
lab=lab.replaceAll('roomId: "wound-ostomy"','roomId: "founders-office"').replaceAll('patients: true, clinicians: true','visitors: true, founders: true');
lab=lab.replace('const order = [','const order = ["founders-office", ').replace('const label = {','const label = { "founders-office": "Founder\'s Office (Level 5 design)",');
write('proof/lab.js',lab);
let geometry=fs.readFileSync(path.join(src,'geometry.mjs'),'utf8').replace('The 3x3 layout and shared navigation stay frozen.','Private 4x4 proposed office layout; no shared navigation changes.').replace('data.woundPresentation.actors','data.founderPresentation.actors').replace('state={patients:true,clinicians:true}','state={visitors:true,founders:true}');
write('proof/geometry.mjs',geometry);
// Exact approved reused furniture, copied locally to make ownership/provenance explicit.
copy('tools/room-design/level-4/radiology-reading/proof/processed-assets/chair-northwest.webp','assets/reused/founder-chair.webp');
copy('tools/room-design/level-4/pediatric-waiting/assets/derived/armchair-west-front.png','assets/reused/visitor-chair-front.png');
const atlas='apps/player/public/art/rooms/gs015-v1/waiting/south.webp';
references.push({path:atlas,sha256:hash(path.join(repo,atlas)),sourceRect:[8,748,315,369]});
const ai=await loadImage(path.join(repo,atlas)),cc=createCanvas(315,369);cc.getContext('2d').drawImage(ai,8,748,315,369,0,0,315,369);write('assets/reused/visitor-chair.png',cc.toBuffer('image/png'));
const ci=await loadImage(path.join(root,'assets/reused/founder-chair.webp')),fc=createCanvas(412,465),fg=fc.getContext('2d');fg.drawImage(ci,0,0);fg.clearRect(0,0,412,296);write('assets/reused/founder-chair-front.png',fc.toBuffer('image/png'));
const registry=JSON.parse(fs.readFileSync(path.join(repo,'apps/player/src/art/characterStillRegistry.generated.json')));
const characters=['founder.01','patient.adult.007'].map(id=>structuredClone(registry.characters.find(c=>c.id===id)));
for(const c of characters){if(!c)throw Error('Missing registry identity');for(const poses of Object.values(c.poses))for(const pose of Object.values(poses)){const p='apps/player/public/'+pose.url;references.push({path:p,sha256:hash(path.join(repo,p))});}}
const shell={tilePixels:120,rearWallHeightPixels:90,lowNorthHeightPixels:29,sideCapWidthPixels:14,southHeightPixels:29,floorAlgorithm:'design',floorBase:'#e4d7b8',floorPalette:['#e4d7b8'],background:'#f3ead3',rearWall:'#a5c3b8',baseTrim:'#58735a',edgeTrim:'#294632',doorJamb:'#744a29',doorInsetPixels:12};
const pieces=[
 {id:'desk',asset:'founder-desk',canvas:[720,432],size:[1.5,.9],ground:[1.45,2.02],footprint:{left:.75,top:1.6,width:1.4,height:.42},owners:[],color:'#bb9462'},
 {id:'bookcase',asset:'office-bookcase',canvas:[384,600],size:[.8,1.25],ground:[.52,.35],footprint:{left:.2,top:.16,width:.64,height:.19},owners:['N1','WA'],color:'#ae8b5c'},
 {id:'plant',asset:'office-plant',canvas:[312,456],size:[.65,.95],ground:[3.45,.35],footprint:{left:3.25,top:.17,width:.4,height:.18},owners:['N4','EA'],color:'#748967'},
 {id:'print',asset:'office-print',canvas:[312,202],size:[.65,202/480],top:[1.5,-.68],owners:['N2'],backed:['N2'],color:'#81a397'}
];
const rec=(id,assetId,size,ground,srcRect,extra={})=>({id,assetId,sourceRect:srcRect,renderSizeTiles:size,destinationTopLeftTiles:[ground[0]-size[0]/2,ground[1]-size[1]],worldLocalGround:ground,depthPolicy:'ground-contact',depthKey:ground[1],canvasTransform:[1,0,0,1,0,0],attachments:{},doorOwners:[],backedOwners:[],touchupKeepWhenBacked:false,...extra});
const chairScale=45/167,chairSize=[412*chairScale/120,465*chairScale/120],chairGround=[1.45,1.45];
const chair=rec('founderChair','design:reuse:founder-chair',chairSize,chairGround,[0,0,412,465],{footprint:{left:1.13,top:1.1,width:.64,height:.35}});
// Asymmetric approved anchor [200,463] is preserved, rather than recentering the bitmap.
chair.destinationTopLeftTiles=[chairGround[0]-200*chairScale/120,chairGround[1]-463*chairScale/120];
const visitor=rec('visitorChair','design:reuse:visitor-chair',[.8,.8*369/315],[2.85,2.65],[0,0,315,369],{footprint:{left:2.48,top:2.23,width:.74,height:.42}});
const records=[chair,{...structuredClone(chair),id:'founderChair:front',assetId:'design:reuse:founder-chair-front',footprint:undefined,depthPolicy:'authored-layer',depthKey:1.4502,overlayFor:'founderChair'},visitor,{...structuredClone(visitor),id:'visitorChair:front',assetId:'design:reuse:visitor-chair-front',footprint:undefined,depthPolicy:'authored-layer',depthKey:2.6502,overlayFor:'visitorChair'},...pieces.map(p=>rec(p.id,'design:fo:'+p.asset,p.size,p.ground??[p.top[0],p.top[1]+p.size[1]],[0,0,...p.canvas],{footprint:p.footprint,doorOwners:p.owners,backedOwners:p.backed??[],depthPolicy:p.top?'wall':'ground-contact',worldLocalGround:p.ground??undefined,touchupKeepWhenBacked:!p.top}))];
const sourceScale=.6865478271728273;
const actors=[{supportId:'founderChair',recordId:'founderChair',characterId:'founder.01',category:'verified-founder',group:'founders',direction:'south',seat:[1.45,1.075],ground:chairGround,painterGround:1.4501,seatContactSource:[80,characters[0].poses.sit.south.anchors.seatContactY],sourceScale,fixtureSeatSource:[200,296],basis:'Approved Reading chair 45px seat rise; real founder registry seated contact.'},{supportId:'visitorChair',recordId:'visitorChair',characterId:'patient.adult.007',category:'patient',group:'visitors',direction:'west',seat:[2.9833333333333334,2.279206349206349],ground:[2.85,2.65],painterGround:2.6501,seatContactSource:[105,222],sourceScale,fixtureSeatSource:[210,223],basis:'Approved Pediatric Exam/Waiting west armchair cushion contact and front mask.'}];
const supports=actors.map(a=>({id:a.supportId,recordId:a.recordId,role:a.group==='founders'?'founder-office-seat':'visitor-seat',pose:'seated',facing:a.direction,seat:{x:a.seat[0],y:a.seat[1]},ground:{x:a.ground[0],y:a.ground[1]},character:a.characterId}));
const presentation={schemaVersion:1,status:'candidate_needs_owner_review',doorModel:{count:16,perWall:4,spanTiles:1,kind:'game-one-tile'},actors,careApproach:[2.55,1.5],approaches:{founderChair:[.9,1.0],visitorChair:[2.25,2.65]}};
const room={proofId:'founders-office',definitionId:'room.founder_office',design:true,footprint:[4,4],shell,records,supports,notes:['Proposed 4x4 base appearance; roadmap category is defined but footprint and individual upgrade appearances await owner review.','Real founder.01 and adult visitor .007; adults are behind approved chair fronts. No footrest or clinical content.','Permanent central furniture clears every one-tile doorway. Bookcase N1/WA, plant N4/EA, and print N2 hide only for their owned doorway.','North bookcase and plant retain full height under backing; wall art hides on backed N2.','Solid lines are radius-clear walking; dotted links are static seat contacts. No furniture pass-through exceptions.']};
room.floor=[{shape:'rect',x:0,y:0,width:480,height:480,color:'#e4d7b8'}];
for(let row=0;row<20;row++){const y=row*24;room.floor.push({shape:'rect',x:0,y,width:480,height:24,color:['#e4d7b8','#ddcfad','#e8dcbf'][row%3]},{shape:'line',x:0,y,width:480,height:0,color:'#9e8258',alpha:.24});for(let x=(row%3)*58;x<480;x+=174)room.floor.push({shape:'line',x,y,width:0,height:24,color:'#9e8258',alpha:.24});}
const navigation={solidFixtures:[],doorThresholdExceptions:[],privateProofRouteModel:presentation};
write('layout.json',{schemaVersion:1,status:'proposed_base_layout',approval:null,runtimeIntegrationAuthorized:false,pieces,room,navigation,presentation});
write('proof/layout-baseline.json',{room,navigation,presentation});write('assets/reference-baseline.json',{date:'2026-10-08',references});
write('proof/data.json',{rooms:[],navigation:{},atlases:{},characters,characterMetrics:{widthInTiles:1.0642421602787457,visibleHeightCap:246},founderPresentation:presentation,previewBaseClearances:[]});
for(const p of pieces){const c=createCanvas(...p.canvas),g=c.getContext('2d');g.fillStyle=p.color;g.fillRect(8,8,c.width-16,c.height-16);g.strokeStyle='#294632';g.lineWidth=6;g.strokeRect(8,8,c.width-16,c.height-16);write('stand-in/'+p.asset+'.png',c.toBuffer('image/png'));}
write('stand-in/manifest.json',{status:'prepaint_geometry_only',pixelsPerTile:480,pieces,roomFootprint:[4,4],doors:presentation.doorModel});
const reused={founderChair:{file:'founder-chair.webp',canvas:[412,465],source:'tools/room-design/level-4/radiology-reading/proof/processed-assets/chair-northwest.webp',anchor:[200,463],seat:[200,296],scale:chairScale,approval:'tools/room-design/level-4/radiology-reading/approval-2026-10-07.md'},founderFront:{file:'founder-chair-front.png',cutoffY:296,contract:'tools/room-design/level-4/radiology-reading/proof/asset-contract.json#chairFrontMasks.northwest',method:'Copy approved prepared pixels at y>=296; no repaint.'},visitorChair:{file:'visitor-chair.png',source:atlas,sourceRect:[8,748,315,369],approval:'Approved Waiting Room revision 2, reused by approved Pediatric Exam.'},visitorFront:{file:'visitor-chair-front.png',source:'tools/room-design/level-4/pediatric-waiting/assets/derived/armchair-west-front.png',approval:'tools/room-design/level-4/pediatric-waiting/approval-2026-10-08.md'}};
for(const entry of Object.values(reused))entry.sha256=hash(path.join(root,'assets/reused',entry.file));write('assets/reused/contract.json',reused);
console.log('SCAFFOLD PASS: additive proposed 4x4 layout, 16 doors, four preserved stand-ins, approved chair layers, two real still identities; writes confined to Level 5 room.');
