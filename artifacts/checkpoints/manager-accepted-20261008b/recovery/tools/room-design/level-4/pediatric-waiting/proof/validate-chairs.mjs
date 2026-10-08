import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import { loadNativeEngine } from './native-engine.mjs';
export async function validateChairs({G,I,room,data,proof,design,here,repo}){
 const checks=[],overlaps=[];const check=(ok,name,details)=>{checks.push({pass:!!ok,name,details});if(!ok)throw Error(name+': '+JSON.stringify(details));};
 const ordinary=room.supports.filter(s=>s.seatType!=='kid-stool'&&!s.id.startsWith('kid')),stools=room.supports.filter(s=>s.seatType==='kid-stool');
 check(ordinary.length===5&&stools.length===4,'Five ordinary seats and four kid stools',{ordinary:ordinary.map(x=>x.id),stools:stools.map(x=>x.id)});
 const atlas=await I.decode(path.join(repo,proof.occluders.entries.west.source));
 for(const [direction,e]of Object.entries(proof.occluders.entries)){
  const im=await I.decode(path.resolve(here,'../assets/derived',e.file));let pixels=0,bad=0,opaque=0;
  for(let y=0;y<im.canvas.height;y++)for(let x=0;x<im.canvas.width;x++){const i=(y*im.canvas.width+x)*4,a=im.pixels.data[i+3];if(!a)continue;pixels++;if(a>=250)opaque++;const src=((y+e.sourceRect[1])*atlas.canvas.width+x+e.sourceRect[0])*4;if(a!==atlas.pixels.data[src+3])bad++;if(a===255){for(let k=0;k<3;k++)if(im.pixels.data[i+k]!==atlas.pixels.data[src+k])bad++;}else for(let k=0;k<3;k++)if(Math.abs(im.pixels.data[i+k]-atlas.pixels.data[src+k])>2)bad++;}
  check(I.sha(path.resolve(here,'../assets/derived',e.file))===e.sha256&&I.sha(path.join(repo,e.source))===e.sourceSha256,'Occluder/source hashes '+direction);
  check(pixels===e.keptPixels&&opaque>8000&&bad===0,'Front wood preserves approved pixels '+direction,{pixels,opaque,bad});
  const corners=[0,(im.canvas.width-1)*4,(im.canvas.height-1)*im.canvas.width*4,(im.canvas.height*im.canvas.width-1)*4];check(corners.every(i=>!im.pixels.data[i+3]),'Transparent full-frame occluder '+direction);
 }
 const {engine,warnings}=await loadNativeEngine(),P={room,doors:new Set(),backed:new Set(),ox:0,oy:0};
 const collected=await engine.collectDrawables(P,true),sorted=[...collected.sorted].sort((a,b)=>a.py-b.py);
 for(const [chairId,supportId,fit]of [['armchair','armchair',data.pediatricPresentation.parents[0]],['adultChairEastNorth','olderChildChair',data.pediatricPresentation.children.find(x=>x.supportId==='olderChildChair')]]){
  const chair=sorted.find(x=>x.id===chairId&&x.kind==='fixture'),actor=sorted.find(x=>x.id===supportId&&x.kind==='actor'),front=sorted.find(x=>x.id===chairId+':front');
  const indexes=[chair,actor,front].map(d=>sorted.indexOf(d));check(indexes[0]<indexes[1]&&indexes[1]<indexes[2],'Actual renderer chair/occupant/front order '+chairId,{indexes,depths:[chair.py,actor.py,front.py]});
  check(['x','y','w','h'].every(k=>chair[k]===front[k]),'Overlay aligns exactly with approved chair '+chairId);
  const pt=fit.chairSeatSource,seat=[chair.x+pt[0]*chair.w/chair.src[2],chair.y+pt[1]*chair.h/chair.src[3]];
  check(Math.hypot(seat[0]-actor.seat.x*120,seat[1]-actor.seat.y*120)<1e-6,'Measured hip on cushion '+chairId,{seat,hip:actor.seat});
  const src=((chair.src[1]+pt[1])*atlas.canvas.width+chair.src[0]+pt[0])*4,px=atlas.pixels.data;
  check(px[src+3]>=160&&px[src+1]>px[src]&&px[src+2]>px[src],'Seat contact is actual blue cushion '+chairId,{rgba:[...px.subarray(src,src+4)]});
  const alone=createCanvas(480,480),frontOnly=createCanvas(480,480),scene=createCanvas(480,480);
  await engine.drawImageRec(alone.getContext('2d'),actor);await engine.drawImageRec(frontOnly.getContext('2d'),front);
  const sg=scene.getContext('2d');await engine.drawImageRec(sg,chair);await engine.drawImageRec(sg,actor);const before=sg.getImageData(0,0,480,480).data;await engine.drawImageRec(sg,front);
  const a=alone.getContext('2d').getImageData(0,0,480,480).data,f=frontOnly.getContext('2d').getImageData(0,0,480,480).data,s=sg.getImageData(0,0,480,480).data;let overlap=0,correctComposites=0,visibleActor=0;
  for(let i=0;i<a.length;i+=4){if(a[i+3]>=250&&f[i+3]>=250){overlap++;const fa=f[i+3]/255,ba=before[i+3]/255,oa=fa+ba*(1-fa);let match=true;
    // Approved atlas wood is mainly alpha254, so compare source-over blending
    // rather than incorrectly demanding fully opaque replacement pixels.
    for(let k=0;k<3;k++){const expected=(f[i+k]*fa+before[i+k]*ba*(1-fa))/oa;if(Math.abs(s[i+k]-expected)>2)match=false;}if(match)correctComposites++;
   }if(a[i+3]>=250&&!f[i+3])visibleActor++;}
  check(overlap>20&&correctComposites===overlap&&visibleActor>1000,'Front armrest occludes actual occupant; head/body stay visible '+chairId,{overlap,correctComposites,visibleActor});overlaps.push({chairId,supportId,overlap,correctComposites,visibleActor});
 }
 for(const segment of G.roomSegments(room)){const Q={...P,doors:new Set([segment])},a=G.actorPlacements(Q,data);for(const chair of data.pediatricPresentation.extraChairs){const r=room.records.find(r=>r.id===chair.id),overlay=room.records.find(r=>r.id===chair.id+':front'),show=G.visible(r,Q.doors,Q.backed);check(G.visible(overlay,Q.doors,Q.backed)===show,'Chair/occluder doorway visibility '+chair.id+'/'+segment);if(chair.supportId==='olderChildChair')check(a.some(x=>x.id===chair.supportId)===show,'Older occupant follows own chair visibility '+segment);}}
 const adult=G.actorPlacements(P,data).find(x=>x.id==='armchair'),adultPixels=await I.decode(path.join(repo,'apps/player/public',adult.url)),fit=data.pediatricPresentation.parents[0];let bottom=-1;
 for(let y=fit.contactMeasurement.region[1];y<fit.contactMeasurement.region[1]+fit.contactMeasurement.region[3];y++)if(adultPixels.pixels.data[(y*160+105)*4+3]>=160)bottom=y;
 check(bottom+1===222,'West parent actual posterior contact measured at X105');
 const edge=I.bounds(adultPixels.pixels.data,160,320,160).bottom+1,footResidual=adult.y+edge*adult.sourceScale-adult.ground.y*120;
 check(Math.abs(footResidual)<=3,'Refitted west parent feet near approved chair floor',{footResidual});
 check(warnings.length===0,'Native renderer loaded chair overlays without warnings',warnings);
 return {status:'PASS',kind:'Actual native renderer armrest composition and approved-pixel provenance',checks,overlaps,parentFootResidualProofPixels:footResidual};
}
