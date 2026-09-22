import { createCanvas } from '@napi-rs/canvas';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
import { drawStandardSlot } from '../../standard-atlas/standard-character-renderer.mjs';
import { loadRig,renderPose,walkingPose } from './beanie-rig-v1.mjs';
const repo=resolve(import.meta.dirname,'../../../..'),loaded=await loadRig(repo),out=resolve(repo,'artifacts/character-movement/brown-beanie-v1/correction-review');
const proof=createCanvas(4*300,2*240),context=proof.getContext('2d');context.imageSmoothingEnabled=false;
for(const[row,view]of ['east','west'].entries()){
 const frame=renderPose(loaded,walkingPose(view,2)),side=frame.metadata.near,knee=frame.metadata.mappedGeometry.joints[side].knee,m=frame.metadata.legs[side].matrices;
 const thigh=createCanvas(160,320),shin=createCanvas(160,320);
 drawStandardSlot(thigh.getContext('2d'),loaded.images.lower,`lower.${view}.thigh.${side}`,m.thigh);
 drawStandardSlot(shin.getContext('2d'),loaded.images.lower,`lower.${view}.shin.${side}`,m.shin);
 for(const[col,[name,img]]of [['full',frame.canvas],['thigh',thigh],['shin',shin],['source',loaded.images.lower]].entries()){
  const left=col*300,top=row*240;context.fillStyle='#20242a';context.fillRect(left,top,300,22);context.fillStyle='#fff';context.font='bold 12px sans-serif';context.fillText(`${view}03 ${name}`,left+4,top+15);context.fillStyle='#ded8ce';context.fillRect(left,top+22,300,218);
  if(name==='source')continue;
  context.drawImage(img,knee.x-30,knee.y-22,60,44,left,top+22,300,218);
 }
}
writeFileSync(resolve(out,'rigid-knee-east-west-03-5x.png'),proof.toBuffer('image/png'));
