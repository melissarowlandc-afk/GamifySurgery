/** Deterministically extracts transparent atlases from canonical 6x3 sheets. */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const root=resolve(import.meta.dirname,".."),sourceDir=resolve(root,"generated_images/patient-character-sources-v1"),out=resolve(root,"apps/player/public/art/characters/patients-v1"),proofDir=resolve(root,"artifacts/screenshots");mkdirSync(out,{recursive:true});mkdirSync(proofDir,{recursive:true});
const COLUMNS=5,ROWS=10,MAP_W=128,MAP_H=192,MAP_FLOOR_Y=181,MAP_CENTER_X=64,MAP_LOWER_Y=128,THUMB_W=96,THUMB_H=112,PORTRAIT_W=192,PORTRAIT_H=224;
const poses=["front-idle","left-idle","right-idle","back-idle","seated-front","exam-table","front-walk-a","front-walk-b","back-walk-a","back-walk-b","left-walk-a","left-walk-neutral","left-walk-b","right-walk-a","right-walk-neutral","right-walk-b","seated-left","seated-right","thumbnail","portrait"];
const sourceSlots={"front-idle":[0,0],"left-idle":[1,0],"right-idle":[2,0],"back-idle":[3,0],"seated-front":[4,0],"exam-table":[5,0],"front-walk-a":[0,1],"front-walk-b":[1,1],"back-walk-a":[2,1],"back-walk-b":[3,1],"left-walk-a":[0,2],"left-walk-b":[1,2],"right-walk-a":[4,1],"right-walk-b":[5,1],"seated-left":[2,2],"seated-right":[3,2],thumbnail:[4,2],portrait:[5,2]};
const mapPoses=poses.slice(0,18),ids=Array.from({length:50},(_,index)=>`patient.adult.${String(index+1).padStart(3,"0")}`),slotCenters=[1,3,5,7,9,11].map(value=>value/12);
const sha=bytes=>createHash("sha256").update(bytes).digest("hex"),save=(canvas,path)=>writeFileSync(path,canvas.toBuffer("image/png"));
function sourceRowActors(image,row){const width=image.width,height=image.height,top=Math.round(row*height/3),bottom=Math.round((row+1)*height/3),canvas=createCanvas(width,bottom-top),ctx=canvas.getContext("2d");ctx.drawImage(image,0,top,width,bottom-top,0,0,width,bottom-top);const data=ctx.getImageData(0,0,width,bottom-top).data,mask=new Uint8Array(width*(bottom-top));for(let y=0;y<bottom-top;y++)for(let x=0;x<width;x++){const offset=(y*width+x)*4,r=data[offset],g=data[offset+1],b=data[offset+2];if(Math.min(r,g,b)<225||Math.max(r,g,b)-Math.min(r,g,b)>28)for(let dy=-5;dy<=5;dy++)for(let dx=-5;dx<=5;dx++){const nx=x+dx,ny=y+dy;if(nx>=0&&nx<width&&ny>=0&&ny<bottom-top)mask[ny*width+nx]=1;}}const seen=new Uint8Array(mask.length),found=[];for(let start=0;start<mask.length;start++){if(!mask[start]||seen[start])continue;const queue=[start];seen[start]=1;let minX=start%width,maxX=minX,minY=Math.floor(start/width),maxY=minY,count=0;for(let cursor=0;cursor<queue.length;cursor++){const at=queue[cursor],x=at%width,y=Math.floor(at/width);count++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);for(const next of [x?at-1:-1,x<width-1?at+1:-1,y?at-width:-1,y<bottom-top-1?at+width:-1])if(next>=0&&!seen[next]&&mask[next]){seen[next]=1;queue.push(next);}}if(count>10000)found.push({minX,maxX,minY:minY+top,maxY:maxY+top,count,center:(minX+maxX)/2/width});}const actors=found.sort((a,b)=>a.center-b.center);if(actors.length!==6)throw new Error(`Source row ${row+1}: expected 6 actor components, found ${actors.length}.`);return actors;}
function sourceActors(image){return [0,1,2].map(row=>sourceRowActors(image,row));}
function cropActor(image,actor){const pad=13,x=Math.max(0,actor.minX-pad),y=Math.max(0,actor.minY-pad),right=Math.min(image.width,actor.maxX+pad+1),bottom=Math.min(image.height,actor.maxY+pad+1),canvas=createCanvas(right-x,bottom-y),ctx=canvas.getContext("2d");ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";ctx.drawImage(image,x,y,right-x,bottom-y,0,0,right-x,bottom-y);return canvas;}
/** Remove only the high-neutral checker pixels connected to this actor crop's exterior. */
function removeExteriorChecker(canvas){const ctx=canvas.getContext("2d"),image=ctx.getImageData(0,0,canvas.width,canvas.height),data=image.data,width=canvas.width,height=canvas.height,seen=new Uint8Array(width*height),queue=[];const checker=index=>{const offset=index*4,r=data[offset],g=data[offset+1],b=data[offset+2];return Math.min(r,g,b)>=200&&Math.max(r,g,b)-Math.min(r,g,b)<=26;};const enqueue=index=>{if(!seen[index]&&checker(index)){seen[index]=1;queue.push(index);}};for(let x=0;x<width;x++){enqueue(x);enqueue((height-1)*width+x);}for(let y=1;y<height-1;y++){enqueue(y*width);enqueue(y*width+width-1);}for(let cursor=0;cursor<queue.length;cursor++){const index=queue[cursor],x=index%width,y=Math.floor(index/width);for(const next of [x?index-1:-1,x<width-1?index+1:-1,y?index-width:-1,y<height-1?index+width:-1])if(next>=0)enqueue(next);}for(const index of queue)data[index*4+3]=0;ctx.putImageData(image,0,0);}
function removeRemoteNoise(canvas){const ctx=canvas.getContext("2d"),image=ctx.getImageData(0,0,canvas.width,canvas.height),data=image.data,width=canvas.width,height=canvas.height,seen=new Uint8Array(width*height),components=[];for(let start=0;start<seen.length;start++){if(seen[start]||data[start*4+3]<=12){seen[start]=1;continue;}const queue=[start],pixels=[];seen[start]=1;let minX=start%width,maxX=minX,minY=Math.floor(start/width),maxY=minY,meaningful=false;for(let cursor=0;cursor<queue.length;cursor++){const index=queue[cursor],x=index%width,y=Math.floor(index/width),offset=index*4,r=data[offset],g=data[offset+1],b=data[offset+2];pixels.push(index);meaningful||=Math.min(r,g,b)<205||Math.max(r,g,b)-Math.min(r,g,b)>26;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);for(const next of [x?index-1:-1,x<width-1?index+1:-1,y?index-width:-1,y<height-1?index+width:-1])if(next>=0&&!seen[next]&&data[next*4+3]>12){seen[next]=1;queue.push(next);}}components.push({pixels,minX,maxX,minY,maxY,meaningful});}const primary=components.reduce((best,current)=>!best||current.pixels.length>best.pixels.length?current:best,null);if(!primary)return;const gap=component=>Math.max(component.maxX<primary.minX?primary.minX-component.maxX-1:primary.maxX<component.minX?component.minX-primary.maxX-1:0,component.maxY<primary.minY?primary.minY-component.maxY-1:primary.maxY<component.minY?component.minY-primary.maxY-1:0);for(const component of components)if(component!==primary&&(!component.meaningful||gap(component)>4))for(const index of component.pixels)data[index*4+3]=0;ctx.putImageData(image,0,0);}
function alphaBounds(canvas,id,pose){const data=canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height).data;let minX=canvas.width,minY=canvas.height,maxX=-1,maxY=-1;for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(data[(y*canvas.width+x)*4+3]>12){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}if(maxX<0)throw new Error(`${id} ${pose}: no retained actor after exterior checker removal.`);return{x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1};}
function frame(image,actors,id,pose){const [slot,row]=sourceSlots[pose],actor=actors[row][slot],crop=cropActor(image,actor);removeExteriorChecker(crop);removeRemoteNoise(crop);return{crop,bounds:alphaBounds(crop,id,pose)};}
function mapFrame(image,actors,id,pose){const {crop,bounds}=frame(image,actors,id,pose),target=createCanvas(MAP_W,MAP_H),ctx=target.getContext("2d");ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";const scale=Math.min(112/bounds.width,171/bounds.height),width=Math.max(1,Math.round(bounds.width*scale)),height=Math.max(1,Math.round(bounds.height*scale));if(height<77||width<35)throw new Error(`${id} ${pose}: implausibly small extracted actor.`);ctx.drawImage(crop,bounds.x,bounds.y,bounds.width,bounds.height,Math.round((MAP_W-width)/2),MAP_FLOOR_Y-height,width,height);removeRemoteNoise(target);return target;}
/**
 * The canonical patient B panels cannot be trusted to retain their labelled
 * profile. Derive lateral B from the opposite A panel instead: this keeps the
 * same patient, preserves the floor anchor, and makes the travel direction an
 * exact pixel contract rather than a source-sheet naming convention.
 */
function mirrorMapFrame(canvas){const target=createCanvas(MAP_W,MAP_H),ctx=target.getContext("2d");ctx.imageSmoothingEnabled=true;ctx.translate(MAP_W,0);ctx.scale(-1,1);ctx.drawImage(canvas,0,0);return target;}
/**
 * The source sheets provide dependable right-facing lateral A/B strides, but
 * their nominal side-idle cells are reversed for a number of identities.
 * Build the legs-together beat from the same direction-locked walk-A frame.
 * The head and torso remain pixel-identical through y=95; only progressively
 * lower leg pixels are brought toward the centerline.  It is deliberately an
 * authored-gait transform rather than a relabelled idle or whole-frame mirror.
 */
function directionalWalkNeutral(canvas){
  const target=createCanvas(MAP_W,MAP_H),ctx=target.getContext("2d");ctx.imageSmoothingEnabled=true;ctx.drawImage(canvas,0,0);
  const source=canvas.getContext("2d").getImageData(0,0,MAP_W,MAP_H),out=ctx.getImageData(0,0,MAP_W,MAP_H),data=out.data;
  for(let y=MAP_LOWER_Y;y<MAP_H;y++)for(let x=0;x<MAP_W;x++){const at=(y*MAP_W+x)*4;data[at+3]=0;}
  for(let y=MAP_LOWER_Y;y<MAP_H;y++){
    const inset=Math.min(9,Math.max(0,Math.round((y-125)*.15)));
    for(let x=0;x<MAP_W;x++){
      const from=(y*MAP_W+x)*4;if(source.data[from+3]<=12)continue;
      const targetX=Math.max(0,Math.min(MAP_W-1,x+(x<MAP_CENTER_X?inset:x>MAP_CENTER_X?-inset:0))),to=(y*MAP_W+targetX)*4;
      data[to]=source.data[from];data[to+1]=source.data[from+1];data[to+2]=source.data[from+2];data[to+3]=source.data[from+3];
    }
  }
  ctx.putImageData(out,0,0);return target;
}
/** Keep the profile/torso from canonical A while borrowing only the opposite
 * stride's lower limb band.  The generated source A/B panels vary subtly in
 * their facial and shirt pixels; that must never read as a person turning
 * during a lateral route. */
function directionalOppositeStride(canonicalA,sourceB){
  const target=createCanvas(MAP_W,MAP_H),ctx=target.getContext("2d");ctx.imageSmoothingEnabled=true;ctx.drawImage(canonicalA,0,0);
  const lower=sourceB.getContext("2d").getImageData(0,MAP_LOWER_Y,MAP_W,MAP_H-MAP_LOWER_Y);
  ctx.clearRect(0,MAP_LOWER_Y,MAP_W,MAP_H-MAP_LOWER_Y);ctx.putImageData(lower,0,MAP_LOWER_Y);return target;
}
function uiFrame(image,actors,id,pose){const {crop,bounds}=frame(image,actors,id,pose),[width,height]=pose==="thumbnail"?[THUMB_W,THUMB_H]:[PORTRAIT_W,PORTRAIT_H],target=createCanvas(width,height),ctx=target.getContext("2d"),pad=pose==="thumbnail"?4:5;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";const scale=Math.min((width-pad*2)/bounds.width,(height-pad*2)/bounds.height),dw=Math.max(1,Math.round(bounds.width*scale)),dh=Math.max(1,Math.round(bounds.height*scale));ctx.drawImage(crop,bounds.x,bounds.y,bounds.width,bounds.height,Math.round((width-dw)/2),Math.round((height-dh)/2),dw,dh);removeRemoteNoise(target);return target;}
async function sources(){const files=readdirSync(sourceDir).filter(name=>/^patient-\d{3}\.png$/.test(name)).sort();if(files.length!==50)throw new Error(`Expected 50 current source sheets, found ${files.length}.`);const loaded=[];for(let index=0;index<50;index++){const expected=`patient-${String(index+1).padStart(3,"0")}.png`;if(files[index]!==expected)throw new Error(`Missing ordered source sheet ${expected}.`);const path=resolve(sourceDir,expected),bytes=readFileSync(path),image=await loadImage(path);loaded.push({id:ids[index],file:expected,bytes,image,actors:sourceActors(image)});}return loaded;}
function atlas(frames,width,height){const canvas=createCanvas(width*COLUMNS,height*ROWS),ctx=canvas.getContext("2d");ctx.imageSmoothingEnabled=true;frames.forEach((item,index)=>ctx.drawImage(item,index%COLUMNS*width,Math.floor(index/COLUMNS)*height));return canvas;}
function checker(ctx,width,height){for(let y=0;y<height;y+=12)for(let x=0;x<width;x+=12){ctx.fillStyle=((x/12+y/12)%2===0)?"#eff0ea":"#b9c1c0";ctx.fillRect(x,y,12,12);}}
function proof(name,required,assets,scale){const widths=required.map(pose=>pose==="portrait"?PORTRAIT_W:MAP_W),heights=required.map(pose=>pose==="portrait"?PORTRAIT_H:pose==="thumbnail"?THUMB_H:MAP_H),canvas=createCanvas(70+widths.reduce((sum,width)=>sum+width*COLUMNS*scale,0),52+Math.max(...heights)*ROWS*scale),ctx=canvas.getContext("2d");checker(ctx,canvas.width,canvas.height);ctx.fillStyle="#20282a";ctx.font="16px monospace";ctx.fillText(name,12,20);let x=50;required.forEach((pose,index)=>{ctx.fillText(pose,x,42);const asset=assets[pose];ctx.drawImage(asset,0,0,asset.width,asset.height,x,48,asset.width*scale,asset.height*scale);x+=asset.width*scale;});return canvas;}
function nativeMapProof(asset){const indexes=[0,2,17,24,32,41,49],canvas=createCanvas(4*150,2*220),ctx=canvas.getContext("2d");checker(ctx,canvas.width,canvas.height);ctx.fillStyle="#20282a";ctx.font="bold 12px sans-serif";indexes.forEach((index,position)=>{const x=position%4*150+11,y=Math.floor(position/4)*220+16,sourceX=index%5*MAP_W,sourceY=Math.floor(index/5)*MAP_H;ctx.drawImage(asset,sourceX,sourceY,MAP_W,MAP_H,x,y,MAP_W,MAP_H);ctx.fillText(`patient.${String(index+1).padStart(3,"0")}`,x,y+207);});return canvas;}
const loaded=await sources(),assets={};
// Row two columns 4 and 5 are the only reliable authored lateral source pair:
// both face east/right and differ only by their stride.  All westward frames
// are exact mirrors of those same right-facing canonical frames.  Do not use
// the generated `left-*` labels here; they are directionally ambiguous.
const rightWalkA=source=>mapFrame(source.image,source.actors,source.id,"right-walk-a");
const rightWalkB=source=>directionalOppositeStride(rightWalkA(source),mapFrame(source.image,source.actors,source.id,"right-walk-b"));
for(const pose of mapPoses){
  const frameFor=source=>{
    if(pose==="right-walk-a")return rightWalkA(source);
    if(pose==="right-walk-neutral")return directionalWalkNeutral(rightWalkA(source));
    if(pose==="right-walk-b")return rightWalkB(source);
    if(pose==="left-walk-a")return mirrorMapFrame(rightWalkA(source));
    if(pose==="left-walk-neutral")return mirrorMapFrame(directionalWalkNeutral(rightWalkA(source)));
    if(pose==="left-walk-b")return mirrorMapFrame(rightWalkB(source));
    return mapFrame(source.image,source.actors,source.id,pose);
  };
  assets[pose]=atlas(loaded.map(frameFor),MAP_W,MAP_H);
}
assets.thumbnail=atlas(loaded.map(source=>uiFrame(source.image,source.actors,source.id,"thumbnail")),THUMB_W,THUMB_H);assets.portrait=atlas(loaded.map(source=>uiFrame(source.image,source.actors,source.id,"portrait")),PORTRAIT_W,PORTRAIT_H);
const poseFiles={};for(const [pose,canvas] of Object.entries(assets)){const file=`patients-${pose}-v1.png`;save(canvas,resolve(out,file));poseFiles[pose]=file;}
const manifest={contentRevision:"patients-v1-r7-hires",sourceContract:{grid:[6,3],reference:"Photos for Codex/exec-e644a34b-c74e-4787-b593-d009b00768ac.png",strategy:"row actor detection + per-actor exterior-connected checker removal",poseSlots:sourceSlots,horizontalDirectionSlots:{right:{a:[4,1],b:[5,1]},left:{a:"mirror:right-walk-a",b:"mirror:right-walk-b"}}},horizontalWalkDerivation:{"right-walk-b":{lowerLimbRowsFrom:"right-walk-b-source",upperBodyRowsFrom:"right-walk-a",upperBodyRows:[0,127],lowerBodyRows:[128,191]},"left-walk-a":{mirrorOf:"right-walk-a"},"left-walk-neutral":{mirrorOf:"right-walk-neutral"},"left-walk-b":{mirrorOf:"right-walk-b"},"right-walk-neutral":{legInsetOf:"right-walk-a",upperBodyRows:[0,127],lowerBodyRows:[128,191]}},columns:COLUMNS,rows:ROWS,mapCell:{width:MAP_W,height:MAP_H,floorAnchor:{x:MAP_CENTER_X,y:MAP_FLOOR_Y},seatAnchor:{x:MAP_CENTER_X,y:136}},thumbnailCell:{width:THUMB_W,height:THUMB_H},portraitCell:{width:PORTRAIT_W,height:PORTRAIT_H},variants:loaded.map(source=>({id:source.id,source:source.file,sourceSha256:sha(source.bytes)})),poses:poseFiles,walkPhases:{a:"left-foot-forward",neutral:"feet-together",b:"right-foot-forward"},decodedBytesEstimate:(mapPoses.length*MAP_W*MAP_H*COLUMNS*ROWS+THUMB_W*THUMB_H*COLUMNS*ROWS+PORTRAIT_W*PORTRAIT_H*COLUMNS*ROWS)*4};writeFileSync(resolve(out,"manifest.json"),JSON.stringify(manifest,null,2));
save(proof("Patient V1 high-resolution: map / thumbnail / portrait",["front-idle","thumbnail","portrait"],assets,.30),resolve(proofDir,"character-resolution-alpha-patient-v1-identities.png"));save(proof("Patient V1 high-resolution: seating and exam table",["seated-front","seated-left","seated-right","exam-table"],assets,.32),resolve(proofDir,"character-resolution-alpha-patient-v1-seating.png"));save(proof("Patient V1 high-resolution: lateral A / neutral / B",["left-walk-a","left-walk-neutral","left-walk-b","right-walk-a","right-walk-neutral","right-walk-b"],assets,.25),resolve(proofDir,"character-resolution-alpha-patient-v1-gaits.png"));save(nativeMapProof(assets["front-idle"]),resolve(proofDir,"character-resolution-alpha-patient-v1-native-map-proof.png"));console.log(`Built ${loaded.length} clean patient identities x ${Object.keys(assets).length} families; ${(manifest.decodedBytesEstimate/1024/1024).toFixed(1)} MiB decoded RGBA.`);
