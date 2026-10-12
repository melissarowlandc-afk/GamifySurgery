// One-time owner revision. Shared files are read-only; all writes stay in this room lane.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createCanvas,loadImage} from '@napi-rs/canvas';

const root=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(root,'../../../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const save=(p,v)=>{const target=path.join(root,p);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');};
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
const archive='history/before-continuous-south-20261011';
assert.ok(!fs.existsSync(path.join(root,archive)),'Revision already initialized; do not replay over reviewed work');
const intakeFiles=walk(root).filter(f=>!path.relative(root,f).startsWith('history'+path.sep));
const intake=intakeFiles.map(f=>({file:path.relative(root,f).replaceAll('\\','/'),sha256:hash(f),bytes:fs.statSync(f).size}));
for(const {file} of intake){const dest=path.join(root,archive,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,file),dest);}
save(archive+'/snapshot-manifest.json',{status:'PASS',files:intake,reason:'Owner-approved garden before the requested south-row-only correction, including manager browser PASS.'});
const planFile='docs/execplans/level5-room-design-20261008.md',plan=fs.readFileSync(path.join(repo,planFile));
save('assets/revision-v2-intake.json',{planFile,planBytes:plan.length,planSha256:crypto.createHash('sha256').update(plan).digest('hex'),archive,files:intake});

const original=read('layout.json'),layout=structuredClone(original),gen=read('assets/generation-manifest.json');
const preservedRecords=original.room.records.filter(r=>!['frontLeft','frontRight'].includes(r.id));
save('assets/preservation-v2.json',{schemaVersion:1,concept:{file:original.composition.concept,sha256:hash(path.join(root,original.composition.concept))},presentation:original.presentation,supports:original.room.supports,navigation:original.navigation,records:preservedRecords,pieces:original.pieces.filter(p=>!['frontLeft','frontRight'].includes(p.id)),prepared:Object.values(read('assets/processed/v1/metadata.json').assets).filter(m=>m.id!=='base-front').map(m=>({id:m.id,file:path.normalize(path.join('proof',m.file)).replaceAll('\\','/'),sha256:m.outputSha256})),originals:walk(path.join(root,'assets/originals/v1')).filter(p=>p.endsWith('.png')).map(p=>({file:path.relative(root,p).replaceAll('\\','/'),sha256:hash(p)}))});

const front=gen.assets.find(a=>a.id==='base-front'),image=await loadImage(path.join(root,front.original)),canvas=createCanvas(image.width,image.height),ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;let left=canvas.width,right=-1,bottom=-1;
for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(pixels[(y*canvas.width+x)*4+3]>=8){left=Math.min(left,x);right=Math.max(right,x);bottom=Math.max(bottom,y);}
const width=right-left+1,half=Math.floor(width/2),parts=[{slot:'southLeft',left,width:half},{slot:'southRight',left:left+half,width:width-half}];
const south=Array.from({length:4},(_,i)=>({id:'south'+(i+1),spriteSlot:parts[i%2].slot,label:'Continuous south planting · section S'+(i+1),classification:'optional',canvas:[512,480],size:[1.024,.96],ground:[i+.5,3.98],footprint:{left:i,top:3.70,width:1,height:.28},owners:['S'+(i+1)],backed:[],southPlanterSection:'S'+(i+1)}));
layout.pieces=original.pieces.flatMap(p=>p.id==='frontLeft'?south:['frontRight'].includes(p.id)?[]:[p]);
const records=south.map(p=>({id:p.id,classification:'optional',assetId:'design:ig:base-'+p.spriteSlot,sourceRect:[0,0,...p.canvas],renderSizeTiles:p.size,destinationTopLeftTiles:[p.ground[0]-p.size[0]/2,p.ground[1]-p.size[1]],worldLocalGround:p.ground,depthPolicy:'ground-contact',depthKey:p.ground[1],canvasTransform:[1,0,0,1,0,0],attachments:{},doorOwners:p.owners,backedOwners:[],touchupKeepWhenBacked:true,footprint:p.footprint,southPlanterSection:p.southPlanterSection}));
layout.room.records=original.room.records.flatMap(r=>r.id==='frontLeft'?records:r.id==='frontRight'?[]:[r]);
layout.designRevision=2;
layout.ownerReview={date:'2026-10-11',statement:'Have the plants continuous across the bottom front and the middle front is only empty of plants if the player puts a door there. Otherwise I approve the flower garden.',status:'approved_except_requested_south_row_correction',requestedChange:'Continuous S1-S4 planting; each south planter hides only for its own south door; preserve all other elements.',managerBrowserVerification:'pending'};
save('layout.json',layout);save('stand-in/v2/layout-owner-revision.json',layout);
save('stand-in/v2/README.md','# Owner south-row correction\n\nThis layout freezes the explicitly requested south-only correction before packing. The original full-room concept and v1 freeze remain unchanged. All non-south records, pieces, supports, contacts and actors are retained byte-for-byte in the v2 preservation receipt. No new art is generated. The existing front source is split into adjoining left/right halves and repeated across four one-tile south sections.\n');
gen.assets=gen.assets.filter(a=>a.id!=='base-front');
for(const part of parts){const slots=south.filter(p=>p.spriteSlot===part.slot).map(p=>p.id);gen.assets.push({...front,id:'base-'+part.slot,slot:slots[0],slots,sourceRegion:[part.left,0,part.width,image.height],sourcePoints:{floor:[part.width/2,bottom+1]},uniformScale:500/part.width,revisionBasis:'Owner-requested continuous south row. Adjacent halves of the unchanged generated front original share the same source floor line and one-tile display width; no new generation or nonuniform stretch.'});}
gen.designRevision=2;gen.newBuiltInCalls=0;save('assets/generation-manifest.json',gen);
const registration=read('assets/registration-v1.json');registration.designRevision=2;registration.registrations=registration.registrations.filter(r=>r.id!=='base-front');
for(const a of gen.assets.filter(a=>a.id.startsWith('base-south')))registration.registrations.push({id:a.id,source:a.original,sourceRegion:a.sourceRegion,sourcePoints:a.sourcePoints,uniformScale:a.uniformScale,basis:a.revisionBasis});
save('assets/registration-v2.json',registration);
save('layout-reconciliation-v2.json',{schemaVersion:2,status:'PENDING_PACKING',designRevision:2,frozenLayoutSha256:hash(path.join(root,'stand-in/v2/layout-owner-revision.json')),originalConceptLayoutSha256:hash(path.join(root,'stand-in/v1/layout-concept.json')),finalLayoutSha256:hash(path.join(root,'layout.json')),changes:[{from:['frontLeft','frontRight'],to:south.map(p=>p.id),authorization:layout.ownerReview}],necessaryFurnitureRetained:true,necessarySeatedSpotsRetained:true,nonSouthElementsUnchanged:true});

// Keep v1 prepared assets and all prior manager/native reports. Current helpers write v2.
for(const f of ['build.mjs','validate.cjs','validate-controls.mjs','validate-browser.cjs','inspect-native.mjs','inspect-composition.mjs','reproduce.mjs','check-helpers.cjs','check-http.mjs','capture.cjs']){
  const file='proof/'+f;let code=fs.readFileSync(path.join(root,file),'utf8').replaceAll('evidence/v1','evidence/v2').replaceAll('assets/processed/v1','assets/processed/v2');
  if(f==='build.mjs')code=code.replaceAll("'assets/registration-v1.json'","'assets/registration-v2.json'").replaceAll("'layout-reconciliation-v1.json'","'layout-reconciliation-v2.json'").replace('designRevision:1,mode','designRevision:layout.designRevision,mode').replace('layoutSha256:hash(',"ownerRevisionLayoutSha256:hash(path.join(root,'stand-in/v2/layout-owner-revision.json')),ownerReview:layout.ownerReview,layoutSha256:hash(").replace('15 concept-derived sprites + 2 chair foregrounds / 24 records','16 reused concept-derived sprites + 2 chair foregrounds / 26 records; continuous S1-S4 planting');
  save(file,code);
}
save('REVISION_EXECPLAN.md','# Indoor Garden — continuous south planting\n\nOwner direction, 2026-10-11: fill S1-S4 with plants by default; a segment clears only for its own south door. Preserve all other art, geometry, supports, contacts and concept. Lane: this directory and append-only revision notes within the existing Indoor Garden plan section. No Git, agents, installs, runtime edits or server/path changes.\n\nMilestones: (1) preserve before-revision files and manager browser PASS; (2) split/repack existing front source into adjoining one-tile south pieces, validate sole doorway ownership and immutable approved elements; (3) rerun native, controls, route, alpha, provenance, rebuild, HTTP and scope checks; (4) exact-output handoff/plan append. Manager reruns browser validation/capture.\n\nProgress: intake and preservation receipts saved; south geometry frozen before packing; original concept and all generated originals unchanged. Next: update source/reconciliation acceptance checks, build, inspect every single doorway and all closed-south occupied routes.\n');
fs.mkdirSync(path.join(root,'proof/evidence/v2'),{recursive:true});
console.log(`SOUTH REVISION CONFIGURATION PASS: archived ${intake.length} prior files; continuous 4-tile south row; four optional segments own S1-S4 individually; 0 new image-generation calls; approved non-south layout/art frozen.`);
