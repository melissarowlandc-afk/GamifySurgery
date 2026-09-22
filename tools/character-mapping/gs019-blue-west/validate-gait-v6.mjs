import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { loadRig, renderPose, standingPose } from '../layered-pilot/blue-glasses-v1/blue-glasses-rig-v1.mjs';
import { drawStandardSlot } from '../standard-atlas/standard-character-renderer.mjs';

const repo = path.resolve(import.meta.dirname, '../../..');
const root = path.join(repo, 'artifacts/character-movement/gs019-blue-west/whole-body-candidate-v6');
const manifestBytes = readFileSync(path.join(root, 'manifest.json'));
const manifest = JSON.parse(manifestBytes);
const phases = ['01','02','03','04','05','06','07','08'];
const expectedAudit = {
  '01':'NEAR contact foreground; FAR leg back', '02':'NEAR load foreground; FAR heel-off behind',
  '03':'NEAR straight foreground; FAR bent behind', '04':'FAR swing left behind; NEAR support',
  '05':'FAR contact; NEAR leg back foreground', '06':'NEAR heel-off foreground; FAR support',
  '07':'NEAR bend foreground over FAR straight', '08':'NEAR uncurl left foreground; FAR support behind'
};
const errors = [];
const check = (value, message) => { if (!value) errors.push(message); };
const sha256 = value => createHash('sha256').update(value).digest('hex');
const rgba = canvas => canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
const isBlue = (r,g,b,a) => a>=80 && b>=r+8 && g>=r+4 && b>=g-10 && r<150 && g<170;
const isSkin = (r,g,b,a) => a>=24 && r>=90 && r>g*1.08 && g>b*1.15;

function isolateIdentity(canvas) {
  const context = canvas.getContext('2d');
  const image = context.getImageData(0,0,160,320), data=image.data;
  let top=320,bottom=-1;
  for(let y=0;y<320;y++) for(let x=0;x<160;x++) if(data[(y*160+x)*4+3]>=24){top=Math.min(top,y);bottom=Math.max(bottom,y);}
  const collarStart=top+Math.floor((bottom-top+1)*.86), removed=[];
  for(let y=collarStart;y<320;y++){
    let first=160,right=-1;
    for(let x=0;x<160;x++){
      const i=(y*160+x)*4;
      if(data[i+3]>=24) right=x;
      if(isBlue(data[i],data[i+1],data[i+2],data[i+3])) first=Math.min(first,x);
    }
    if(first<160) for(let x=first;x<=right;x++){
      const i=(y*160+x)*4;
      if(data[i+3]) removed.push({x,y,rgba:[data[i],data[i+1],data[i+2],data[i+3]]});
      data[i+3]=0;
    }
  }
  context.putImageData(image,0,0);
  return { collarStart, removed };
}

function geometry(data, diagonal=true) {
  const width=160,height=320,threshold=24,seen=new Uint8Array(width*height),components=[];
  let left=width,right=-1,top=height,bottom=-1,floorAlpha=0,belowFloorAlpha=0;
  for(let y=0;y<height;y++) for(let x=0;x<width;x++){
    const alpha=data[(y*width+x)*4+3]; if(alpha<threshold) continue;
    left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
    if(y===287) floorAlpha++; if(y>287) belowFloorAlpha++;
  }
  for(let start=0;start<seen.length;start++){
    if(seen[start]||data[start*4+3]<threshold) continue;
    const queue=[start]; seen[start]=1; let size=0,cl=width,cr=-1,ct=height,cb=-1;
    while(queue.length){
      const at=queue.pop(),x=at%width,y=Math.floor(at/width);size++;cl=Math.min(cl,x);cr=Math.max(cr,x);ct=Math.min(ct,y);cb=Math.max(cb,y);
      for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){
        if((!dx&&!dy)||(!diagonal&&dx&&dy)) continue;
        const nx=x+dx,ny=y+dy; if(nx<0||nx>=width||ny<0||ny>=height) continue;
        const next=ny*width+nx;
        if(!seen[next]&&data[next*4+3]>=threshold){seen[next]=1;queue.push(next);}
      }
    }
    components.push({size,bounds:{left:cl,right:cr,top:ct,bottom:cb}});
  }
  components.sort((a,b)=>b.size-a.size);
  return {bounds:{left,right,top,bottom},floorAlpha,belowFloorAlpha,components};
}

check(manifest.schemaVersion==='gs019-blue-west-whole-body/candidate-v6','schema');
check(JSON.stringify(manifest.phaseContract.ids)===JSON.stringify(phases),'phase ids');
check(manifest.phaseContract.cadenceMs===180,'cadence 180ms');
check(manifest.canvas.width===160&&manifest.canvas.height===320&&manifest.canvas.floorY===287,'native canvas and floor');
check(manifest.gamePresentation.width===32&&manifest.gamePresentation.height===64,'game size');
check(manifest.approvedStandingHeadReference.headMatrix.e===-51&&manifest.approvedStandingHeadReference.headMatrix.f===-85,'baseline head matrix');
for(const pin of [manifest.pins.approvedStanding,...Object.values(manifest.pins.sources).flatMap(source=>[source,{file:source.prompt,sha256:source.promptSha256}])]) check(sha256(readFileSync(path.join(repo,pin.file)))===pin.sha256,`pin ${pin.file}`);

const loaded=await loadRig(repo), metadata=renderPose(loaded,standingPose('west')).metadata;
let exactMirrorChannels=0, identityPixels=0, exactIdentityChannels=0, lowerBodyChannels=0, exactLowerBodyChannels=0;
let removedClothingPixels=0, removedSkinPixels=0, minFloorAlpha=Infinity, maxBelowFloorAlpha=0, maxEightComponents=0;
const frameMetrics={};
for(const phase of phases){
  const westRecord=manifest.frames[phase],eastRecord=manifest.eastFrames[phase],authoredRecord=manifest.authored[phase],measurement=manifest.measurements[phase];
  check(measurement.gaitAudit===expectedAudit[phase],`audit label ${phase}`);
  check(measurement.sourceSheet===(Number(phase)<=4?'first':'second'),`source half ${phase}`);
  check(measurement.sourceCell===((Number(phase)-1)%4)+1,`source cell ${phase}`);
  check(measurement.uniformScale===manifest.scaleEvidence[measurement.sourceSheet],`uniform scale ${phase}`);
  check(Math.abs(measurement.alignment.collarAxisResidual)<=2,`collar axis residual ${phase}`);
  check(measurement.headMatrix.e===-51+Math.round(measurement.bodyDelta.x)&&measurement.headMatrix.f===-85+measurement.bodyDelta.y,`body-relative head ${phase}`);
  check(measurement.bodyPlacement.y+measurement.bodyPlacement.height-1===287,`body floor ${phase}`);
  const westBytes=readFileSync(path.join(root,westRecord.file)),eastBytes=readFileSync(path.join(root,eastRecord.file)),authoredBytes=readFileSync(path.join(root,authoredRecord.file));
  check(sha256(westBytes)===westRecord.sha256,`West hash ${phase}`); check(sha256(eastBytes)===eastRecord.sha256,`East hash ${phase}`); check(sha256(authoredBytes)===authoredRecord.sha256,`authored hash ${phase}`);
  const [westImage,eastImage,authoredImage]=await Promise.all([loadImage(westBytes),loadImage(eastBytes),loadImage(authoredBytes)]);
  check(westImage.width===160&&westImage.height===320&&eastImage.width===160&&eastImage.height===320,`dimensions ${phase}`);
  const west=createCanvas(160,320),east=createCanvas(160,320),body=createCanvas(160,320),head=createCanvas(160,320),rawHead=createCanvas(160,320);
  west.getContext('2d').drawImage(westImage,0,0); east.getContext('2d').drawImage(eastImage,0,0); body.getContext('2d').drawImage(authoredImage,measurement.bodyPlacement.x,measurement.bodyPlacement.y);
  drawStandardSlot(rawHead.getContext('2d'),loaded.images.identity,metadata.head.id,measurement.headMatrix);
  head.getContext('2d').drawImage(rawHead,0,0); const maskEvidence=isolateIdentity(head);
  for(const item of maskEvidence.removed){removedClothingPixels++;if(isSkin(...item.rgba))removedSkinPixels++;}
  const westData=rgba(west),eastData=rgba(east),bodyData=rgba(body),headData=rgba(head);
  const eight=geometry(westData,true),four=geometry(westData,false); frameMetrics[phase]={connectivity8:eight.components,connectivity4:four.components,bounds:eight.bounds,floorAlpha:eight.floorAlpha,belowFloorAlpha:eight.belowFloorAlpha};
  check(eight.components.length===1,`one connected silhouette ${phase}`); check(eight.floorAlpha>0&&eight.belowFloorAlpha===0&&eight.bounds.bottom===287,`ground ${phase}`); check(eight.bounds.left>0&&eight.bounds.right<159&&eight.bounds.top>0,`no clipping ${phase}`);
  minFloorAlpha=Math.min(minFloorAlpha,eight.floorAlpha);maxBelowFloorAlpha=Math.max(maxBelowFloorAlpha,eight.belowFloorAlpha);maxEightComponents=Math.max(maxEightComponents,eight.components.length);
  for(let y=0;y<320;y++) for(let x=0;x<160;x++){
    const i=(y*160+x)*4,mirror=(y*160+(159-x))*4;
    for(let channel=0;channel<4;channel++){check(eastData[i+channel]===westData[mirror+channel],`mirror ${phase}@${x},${y},${channel}`);exactMirrorChannels++;}
    if(headData[i+3]){identityPixels++;for(let channel=0;channel<4;channel++)if(westData[i+channel]===headData[i+channel])exactIdentityChannels++;}
    if(y>=145) for(let channel=0;channel<4;channel++){lowerBodyChannels++;if(westData[i+channel]===bodyData[i+channel])exactLowerBodyChannels++;}
  }
}
check(exactIdentityChannels===identityPixels*4,'all retained native identity RGBA exact');
check(removedSkinPixels===0,'clothing mask removes no skin-colored pixels');
check(exactLowerBodyChannels===lowerBodyChannels,'lower body unchanged after preassembly head cleanup');
for(const proof of Object.values(manifest.proofs)) check(sha256(readFileSync(path.join(root,proof.file)))===proof.sha256,`proof ${proof.file}`);
const result={status:errors.length?'FAIL':'PASS',errors:errors.slice(0,30),anatomicalAudit:{pixelCertified:false,status:'visual-source-and-render-review-required',phases:expectedAudit,limits:'Pixel tests certify provenance, registration, silhouette connectivity, mirroring, floor contact, clipping, and unchanged lower-body pixels. They do not certify perceived near/far anatomy or gait quality.'},componentFinding:{phase01:'The 4-neighbor result isolates one anti-aliased outline pixel at x52 y105. It is diagonally adjacent; 8-neighbor raster connectivity is one component and the head is not detached.',connectivity:'8-neighbor'},metrics:{manifestSha256:sha256(manifestBytes),exactMirrorChannels,identityPixels,exactIdentityChannels,removedClothingPixels,removedSkinPixels,lowerBodyChannels,exactLowerBodyChannels,minFloorAlpha,maxBelowFloorAlpha,maxEightComponents,frameMetrics}};
writeFileSync(path.join(root,'validation.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));if(errors.length)process.exitCode=1;
