// Retained occupied seats, real entry/exit portals, and depth-sorted stand-ins.
// Uses the shipped renderer and approved stills; browser QA remains separate.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import * as G from './geometry.mjs';
import { DESIGN_TIERS } from './design-rooms.js';
import { loadNativeEngine } from './native-engine.mjs';

const here=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(here,'../../../../..'),out=path.join(here,'evidence/v4');
fs.mkdirSync(out,{recursive:true});
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function progressAt(path,point){let sum=0,total=0,found;for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]),part=Math.hypot(point[0]-a[0],point[1]-a[1]);if(Math.abs(part+Math.hypot(b[0]-point[0],b[1]-point[1])-length)<1e-8)found??=sum+part;sum+=length;total+=length;}assert.notEqual(found,undefined,'Point is on walking route');return found/total;}

try{
 const {engine,warnings}=await loadNativeEngine();let checks=0,depthSamples=0;const layers=[],routes=[];
 const c=engine.data.characters.find(c=>c.id==='patient.adult.007');
 for(const direction of ['south','east','west','north']){const pose=c.poses.stand[direction];assert.equal(hash(path.join(repo,'apps/player/public',pose.url)),pose.sha256);checks++;}
 for(const tier of DESIGN_TIERS){engine.setTier(tier.level);const P={room:tier.room,doors:new Set(['N2','S2']),backed:new Set(['N1','N2','N3']),ox:80,oy:160};
  Object.assign(engine.state,{actors:true,visitors:true,executives:true,walkers:true,walkProgress:0,walkReverse:false});
  const blockers=G.fineBlockers(P,tier.navigation,tier.bases),walks=G.computeRoutes(P,tier.navigation,tier.bases),seatedBefore=engine.actorPlacements(P);
  assert.deepEqual(Array.from(seatedBefore,a=>a.id),['executiveChair','visitorChair']);
  for(const id of ['executiveChair','visitorChair']){assert.ok(blockers.some(b=>b.id===id));const f=P.room.records.find(r=>r.id===id).footprint;assert.equal(G.clearWalkPoint(P,blockers,f.left+f.width/2,f.top+f.height/2),false);checks++;}
  assert.equal(G.clearWalkPoint({...P,doors:new Set(['S2'])},blockers,1.5,-.1),false);checks++;
  const forward=walks.find(r=>r.door==='N2'&&r.target.exitDoor==='S2'),reverse=walks.find(r=>r.door==='S2'&&r.target.exitDoor==='N2');
  assert.ok(forward.path&&reverse.path);assert.deepEqual(forward.walkingPath[0],[1.5,-.2]);assert.deepEqual(forward.walkingPath.at(-1),[1.5,2.2]);checks++;
  routes.push({level:tier.level,forward:forward.walkingPath,reverse:reverse.walkingPath,standingApproaches:walks.filter(r=>r.seatingTransition).map(r=>({door:r.door,support:r.target.id,approach:r.standingApproach}))});
  for(const reverse of [false,true])for(let step=0;step<=50;step++){
   Object.assign(engine.state,{walkProgress:step/50,walkReverse:reverse});const draw=await engine.collectDrawables(P,true),sorted=Array.from(draw.sorted).sort((a,b)=>a.py-b.py||(a.kind==='actor')-(b.kind==='actor')),walker=sorted.find(d=>d.id==='route-walker');assert.ok(walker);assert.equal(walker.py,walker.ground.y);assert.equal(G.clearWalkPoint(P,blockers,walker.ground.x,walker.ground.y),true);
   const wi=sorted.indexOf(walker);for(const id of ['executiveChair','visitorChair'])for(const d of sorted.filter(d=>d.id===id||d.id===id+':front')){if(walker.py<d.py)assert.ok(wi<sorted.indexOf(d));else if(walker.py>d.py)assert.ok(wi>sorted.indexOf(d));}
   assert.deepEqual(engine.actorPlacements(P),seatedBefore);for(const id of ['executiveChair','visitorChair','executiveChair:front','visitorChair:front'])assert.ok(sorted.some(d=>d.kind==='fixture'&&d.id===id));depthSamples++;
  }
  for(const reverse of [false,true])for(const test of [{id:'executiveChair',point:[1.5,.2],side:'behind'},{id:'visitorChair',point:[1.5,1.8],side:'in-front'}]){
   const forwardProgress=progressAt(forward.walkingPath,test.point);Object.assign(engine.state,{walkProgress:reverse?1-forwardProgress:forwardProgress,walkReverse:reverse});
   const draw=await engine.collectDrawables(P,true),sorted=Array.from(draw.sorted).sort((a,b)=>a.py-b.py),walker=sorted.find(d=>d.id==='route-walker'),fixture=sorted.find(d=>d.kind==='fixture'&&d.id===(test.side==='behind'?test.id:test.id+':front'));
   assert.equal(test.side==='behind',sorted.indexOf(walker)<sorted.indexOf(fixture));
   const canvas=createCanvas(640,640),g=canvas.getContext('2d');await engine.drawImageRec(g,walker);const wp=g.getImageData(0,0,640,640).data;g.clearRect(0,0,640,640);await engine.drawImageRec(g,fixture);const fp=g.getImageData(0,0,640,640).data;
   let overlap=0,matching=0;g.clearRect(0,0,640,640);for(const d of [walker,fixture].sort((a,b)=>a.py-b.py))await engine.drawImageRec(g,d);const composite=g.getImageData(0,0,640,640).data,front=test.side==='behind'?fp:wp,back=test.side==='behind'?wp:fp;
   // AI originals contain near-opaque alpha, so compare source-over blending
   // instead of assuming every solid-looking source pixel has alpha exactly 255.
   for(let i=0;i<wp.length;i+=4)if(wp[i+3]>=250&&fp[i+3]>=250){overlap++;const a=front[i+3]/255,b=back[i+3]/255,outA=a+b*(1-a);for(let k=0;k<3;k++){const expected=(front[i+k]*a+back[i+k]*b*(1-a))/outA;assert.ok(Math.abs(composite[i+k]-expected)<=2,'Correct front pixel after alpha blending');}assert.ok(Math.abs(composite[i+3]-outA*255)<=1);matching++;}
   assert.ok(overlap>=20,'Opaque walker/chair overlap '+test.id+' '+test.side);layers.push({level:tier.level,reverse,chair:test.id,walkerSide:test.side,opaqueOverlap:overlap,matchingCompositePixels:matching,ground:walker.ground});checks++;
  }
 }
 assert.deepEqual(warnings,[]);
 fs.writeFileSync(path.join(out,'walking-validation-report.json'),JSON.stringify({status:'PASS',checks,depthSamples,layers,routes,actorRadiusTiles:G.ACTOR_RADIUS,fullPortals:true,retainedSeats:['executiveChair','visitorChair'],standingIdentity:'patient.adult.007',standingDirections:['south','east','west','north'],method:'Actual shipped renderer in native Canvas; sort order and source-over pixels at alpha >=250 verified in both directions (RGB tolerance 2, alpha 1 for native rounding).',browserQA:'pending manager',approval:null},null,2)+'\n');
 console.log(`WALKING VALIDATION PASS: ${checks} checks; ${depthSamples} depth samples; ${layers.length} opaque chair/walker composites; N2/S2 occupied seats never move or disappear; full entry/exit routes at 0.18T; 4 approved standing directions; browser pending.`);
}catch(e){fs.writeFileSync(path.join(out,'walking-validation-report.json'),JSON.stringify({status:'FAIL',error:e.stack},null,2)+'\n');console.error(e.stack);process.exitCode=1;}
