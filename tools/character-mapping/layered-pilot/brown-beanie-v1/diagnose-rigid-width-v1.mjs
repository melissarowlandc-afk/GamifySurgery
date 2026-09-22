import { createCanvas } from '@napi-rs/canvas';
import { resolve } from 'node:path';
import { slotRect } from '../../standard-atlas/schema-v1.mjs';
import { rigidBoneTransform } from '../../standard-atlas/rigid-geometry.mjs';
import { drawStandardSlot } from '../../standard-atlas/standard-character-renderer.mjs';
import { loadRig,renderPose,standingPose } from './beanie-rig-v1.mjs';
const loaded=await loadRig(resolve(import.meta.dirname,'../../../..'));
const lowerImage=loaded.images.lower,pc=createCanvas(lowerImage.width,lowerImage.height),px=pc.getContext('2d');px.drawImage(lowerImage,0,0);const packed=px.getImageData(0,0,pc.width,pc.height).data;
const segmentWidth=(data,width,height,start,end,offset,scale=1)=>{
 const mid={x:(start.x+end.x)/2,y:(start.y+end.y)/2},len=Math.hypot(end.x-start.x,end.y-start.y),normal={x:-(end.y-start.y)/len,y:(end.x-start.x)/len},hits=[];
 for(let t=-80;t<=80;t+=.5){const x=Math.round(offset.x+(mid.x+normal.x*t)*scale),y=Math.round(offset.y+(mid.y+normal.y*t)*scale);if(x>=0&&x<width&&y>=0&&y<height&&data[(y*width+x)*4+3]>=200)hits.push(t);}
 return hits.length?{width:hits.at(-1)-hits[0]+.5,first:hits[0],last:hits.at(-1)}:{width:0};
};
for(const view of ['east','west'])for(const side of ['left','right']){
 const stand=renderPose(loaded,standingPose(view));
 for(const kind of ['thigh','shin']){
  const id=`lower.${view}.${kind}.${side}`,part=loaded.parts[id],j=stand.metadata.mappedGeometry.joints[side],sourceStart=part.landmarks.joint[kind==='thigh'?'hip':'knee'],sourceEnd=part.landmarks.joint[kind==='thigh'?'knee':'ankle'],targetStart=j[kind==='thigh'?'hip':'knee'],targetEnd=j[kind==='thigh'?'knee':'ankle'],sourceBoneLength=Math.hypot(sourceEnd.x-sourceStart.x,sourceEnd.y-sourceStart.y),targetBoneLength=Math.hypot(targetEnd.x-targetStart.x,targetEnd.y-targetStart.y),ratio=targetBoneLength/sourceBoneLength,slot=slotRect(id),packedWidth=segmentWidth(packed,pc.width,pc.height,sourceStart,sourceEnd,{x:slot.x,y:slot.y});
  const c=createCanvas(160,320),cx=c.getContext('2d'),matrix=rigidBoneTransform({sourceStart,sourceEnd,targetStart,targetEnd});drawStandardSlot(cx,loaded.images.lower,id,matrix);const rendered=cx.getImageData(0,0,160,320).data,runtimeWidth=segmentWidth(rendered,160,320,targetStart,targetEnd,{x:0,y:0});
  console.log(JSON.stringify({view,side,kind,sourceCrop:part.source.crop,sourceBoneLength,targetBoneLength,rigidScale:ratio,packedWidth,runtimeWidth,predictedRuntimeWidth:packedWidth.width*ratio,normalizationScale:part.normalization.scale,sourceNominalWidth:part.source.nominalRenderRect.width}));
 }
}
