import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadImage } from '@napi-rs/canvas';
import { buildSeatedGeometry as buildMasterSit, buildStandingGeometry, buildWalkGeometry } from '../canonical-master/canonical-geometry.mjs';
import { renderMaster } from '../canonical-master/render-master.mjs';
import { buildClipboardGeometry, buildJumpGeometry, buildSeatedGeometry } from '../canonical-actions/action-geometry.mjs';
import { renderAction } from '../canonical-actions/render-actions.mjs';
import { assertCostume, COSTUMES } from './costumes.mjs';
import { renderSurfaceAction, renderSurfaceMaster } from './surface-renderer.mjs';

const root=resolve(import.meta.dirname,'../../..');
const out=resolve(root,'artifacts/character-movement/surface-fitting/validation');
mkdirSync(out,{recursive:true});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const pixels=canvas=>Buffer.from(canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data);
const clone=value=>JSON.parse(JSON.stringify(value));

const pins={
  'artifacts/character-movement/canonical-master/preview/manifest.json':'c9ccf24da87a4f89e1f464a65819d205bf0b2930950f9c60105a64c6d618c309',
  'artifacts/character-movement/canonical-actions/preview/manifest.json':'915cc7a0501fb8df50f2a0e7b19304acbbadfa99b9243f2db796fe413fad7de9',
};
for(const[path,pin]of Object.entries(pins))assert.equal(sha(readFileSync(resolve(root,path))),pin,`${path} pin`);
const masterManifest=JSON.parse(readFileSync(resolve(root,Object.keys(pins)[0]))),actionManifest=JSON.parse(readFileSync(resolve(root,Object.keys(pins)[1]))),masterCharacter=masterManifest.characters[0],actionCharacter=actionManifest.characters[0];
for(const costume of Object.values(COSTUMES)){assertCostume(costume);assert.equal(sha(readFileSync(resolve(root,costume.source.path))),costume.source.sha256,`${costume.id} source pin`);}
assert.throws(()=>assertCostume({...clone(COSTUMES['patient.adult.046']),joints:{}}),/forbidden joints/);
const badNested=clone(COSTUMES['patient.adult.046']);badNested.attachments[0].views.south.motion={};assert.throws(()=>assertCostume(badNested),/forbidden motion/);
const badUnknown=clone(COSTUMES['patient.adult.046']);badUnknown.surfaces.head[0].rotation=1;assert.throws(()=>assertCostume(badUnknown),/unknown key rotation/);

const walk=buildWalkGeometry(),jump=buildJumpGeometry();
const masterRecords=[];for(const view of['south','east','north','west'])for(const phaseId of['01','02','03','04','05','06','07','08'])masterRecords.push({family:'master',label:`walk/${view}/${phaseId}`,geometry:walk[view][phaseId],approvedGeometry:masterCharacter.directions[view][phaseId].geometry,render:renderSurfaceMaster,neutral:renderMaster});
masterRecords.push({family:'master',label:'static/standSouth',geometry:buildStandingGeometry('south'),approvedGeometry:masterCharacter.static.standSouth.geometry,render:renderSurfaceMaster,neutral:renderMaster});
masterRecords.push({family:'master',label:'static/sitSouth',geometry:buildMasterSit(),approvedGeometry:masterCharacter.static.sitSouth.geometry,render:renderSurfaceMaster,neutral:g=>renderMaster(g,{chair:true})});
const actionRecords=[];for(const view of['south','east','north','west'])for(const phaseId of['01','02','03','04','05','06','07','08'])actionRecords.push({family:'action',label:`jump/${view}/${phaseId}`,geometry:jump[view][phaseId],approvedGeometry:actionCharacter.directions[view][phaseId].geometry,render:renderSurfaceAction,neutral:renderAction});
for(const view of['south','east','north','west']){const suffix=view[0].toUpperCase()+view.slice(1);actionRecords.push({family:'action',label:`static/sit/${view}`,geometry:buildSeatedGeometry(view),approvedGeometry:actionCharacter.static[`sit${suffix}`].geometry,render:renderSurfaceAction,neutral:renderAction});actionRecords.push({family:'action',label:`static/clipboard/${view}`,geometry:buildClipboardGeometry(view),approvedGeometry:actionCharacter.static[`clipboard${suffix}`].geometry,render:renderSurfaceAction,neutral:renderAction});}
const records=[...masterRecords,...actionRecords];assert.equal(masterRecords.length,34);assert.equal(actionRecords.length,40);

let neutralParity=0,deterministicCostumeRenders=0,mutationChecks=0,connectedChecks=0,marginChecks=0,attachmentTraces=0;
const rasterHashes={},geometryHashes={};
const masterManifestShape=(geometry,approved)=>({...('registration'in approved?{registration:approved.registration}:{}),joints:geometry.joints,hipCenter:geometry.hipCenter,layerPolicy:geometry.layerPolicy});
const actionManifestShape=(geometry,approved)=>({...geometry,...('registration'in approved?{registration:approved.registration}:{})});
function alphaComponents(canvas){const data=pixels(canvas),seen=new Uint8Array(canvas.width*canvas.height);let count=0;for(let start=0;start<seen.length;start++){if(seen[start]||!data[start*4+3])continue;count++;seen[start]=1;const stack=[start];while(stack.length){const at=stack.pop(),x=at%canvas.width,y=Math.floor(at/canvas.width);for(const next of[x?at-1:-1,x+1<canvas.width?at+1:-1,y?at-canvas.width:-1,y+1<canvas.height?at+canvas.width:-1])if(next>=0&&!seen[next]&&data[next*4+3]){seen[next]=1;stack.push(next);}}}return count;}
function alphaBounds(canvas){const data=pixels(canvas);let left=canvas.width,top=canvas.height,right=-1,bottom=-1;for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(data[(y*canvas.width+x)*4+3]){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}return{left,top,right,bottom};}
for(const record of records){
  const supplied=record.family==='master'?masterManifestShape(record.geometry,record.approvedGeometry):actionManifestShape(record.geometry,record.approvedGeometry);assert.deepEqual(supplied,record.approvedGeometry,`${record.label} approved manifest geometry`);geometryHashes[record.label]=sha(Buffer.from(JSON.stringify(record.approvedGeometry)));
  const original=record.neutral(record.geometry),independent=record.render(record.geometry);assert.deepEqual(pixels(independent),pixels(original),`${record.label} neutral pixel parity`);neutralParity++;
  for(const costume of Object.values(COSTUMES)){
    const before=JSON.stringify(record.geometry),trace=[],first=record.render(record.geometry,costume,{trace}),second=record.render(record.geometry,costume);assert.equal(JSON.stringify(record.geometry),before,`${record.label}/${costume.id} geometry mutation`);mutationChecks++;
    const firstPixels=pixels(first);assert.deepEqual(firstPixels,pixels(second),`${record.label}/${costume.id} deterministic`);deterministicCostumeRenders++;
    assert.notDeepEqual(firstPixels,pixels(independent),`${record.label}/${costume.id} must apply artwork`);rasterHashes[`${costume.id}/${record.label}`]=sha(firstPixels);assert.equal(sha(Buffer.from(JSON.stringify(record.approvedGeometry))),geometryHashes[record.label],`${record.label}/${costume.id} shared geometry hash`);
    assert.equal(alphaComponents(first),1,`${record.label}/${costume.id} disconnected silhouette`);connectedChecks++;
    const bounds=alphaBounds(first);assert(bounds.left>0&&bounds.top>0&&bounds.right<first.width-1&&bounds.bottom<first.height-1,`${record.label}/${costume.id} clipped margin`);marginChecks++;
    const expected=costume.attachments.filter(item=>item.views[record.geometry.view]?.visible!==false);assert.equal(trace.length,expected.length,`${record.label}/${costume.id} attachment dispatch`);for(const item of trace){const d=item.declaredBounds,a=item.actualBounds;assert(d.left>0&&d.top>0&&d.right<first.width-1&&d.bottom<first.height-1,`${record.label}/${costume.id}/${item.id} declared frame bounds`);assert(a.right>=a.left&&a.bottom>=a.top,`${record.label}/${costume.id}/${item.id} attachment pixels`);assert(a.left>=Math.floor(d.left)&&a.top>=Math.floor(d.top)&&a.right<=Math.ceil(d.right)&&a.bottom<=Math.ceil(d.bottom),`${record.label}/${costume.id}/${item.id} actual pixels outside declaration`);attachmentTraces++;}
  }
}
assert.equal(new Set(Object.values(rasterHashes)).size,Object.keys(rasterHashes).length,'each costume pose must have an exact distinct pixel hash');

// Axial registration proof: the cuff line remains close to 80% along each projected forearm.
let rotatedRegistrationChecks=0;
for(const view of['east','west'])for(const phaseId of['01','04','07'])for(const costume of Object.values(COSTUMES)){
  const g=walk[view][phaseId],canvas=renderSurfaceMaster(g,costume),data=pixels(canvas),withoutCuff=clone(costume),cuff=costume.surfaces.forearm[0];withoutCuff.surfaces.forearm=[];assertCostume(withoutCuff);const base=pixels(renderSurfaceMaster(g,withoutCuff)),targetHex=costume.palette[cuff.stroke].slice(1),target=[0,2,4].map(index=>Number.parseInt(targetHex.slice(index,index+2),16));
  const side=view==='east'?'right':'left',j=g.joints[side],x=Math.round(j.elbow.x+(j.wrist.x-j.elbow.x)*cuff.x1),y=Math.round(j.elbow.y+(j.wrist.y-j.elbow.y)*cuff.x1);let found=false,isolatedDiff=0;for(let dy=-7;dy<=7;dy++)for(let dx=-7;dx<=7;dx++){const i=((y+dy)*canvas.width+x+dx)*4;if(Math.abs(data[i]-target[0])<14&&Math.abs(data[i+1]-target[1])<14&&Math.abs(data[i+2]-target[2])<14)found=true;if(data[i]!==base[i]||data[i+1]!==base[i+1]||data[i+2]!==base[i+2]||data[i+3]!==base[i+3])isolatedDiff++;}assert(found&&isolatedDiff>0,`${costume.id}/${view}/${phaseId}/${side} isolated rotated cuff registration`);rotatedRegistrationChecks++;
}

const report={approvedPins:pins,sourcePins:Object.fromEntries(Object.values(COSTUMES).map(c=>[c.id,c.source.sha256])),neutralParity,masterNeutralRecords:masterRecords.length,actionNeutralRecords:actionRecords.length,costumeRasterHashes:Object.keys(rasterHashes).length,approvedGeometryHashes:Object.keys(geometryHashes).length,deterministicCostumeRenders,mutationChecks,rotatedRegistrationChecks,attachmentTraces,connectedChecks,marginChecks,geometryHashes,rasterHashes};
writeFileSync(resolve(out,'technical-validation.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,geometryHashes:undefined,rasterHashes:undefined},null,2));
