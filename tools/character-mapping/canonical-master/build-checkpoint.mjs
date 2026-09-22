import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import { MASTER, buildSeatedGeometry, buildStandingGeometry, buildWalkGeometry } from './canonical-geometry.mjs';
import { renderGuide, renderMaster } from './render-master.mjs';

const root=resolve(import.meta.dirname,'../../..'),out=resolve(root,'artifacts/character-movement/canonical-master/checkpoint');mkdirSync(out,{recursive:true});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex'),walk=buildWalkGeometry(),records={};
for(const view of ['south','east','north','west']){
  records[view]={};
  const neutral=buildStandingGeometry(view);
  for(const [id,geometry] of [['neutral',neutral],['01',walk[view]['01']],['03',walk[view]['03']]]){
    const clean=renderMaster(geometry).toBuffer('image/png'),guide=renderGuide(geometry).toBuffer('image/png');
    writeFileSync(resolve(out,`${view}-${id}.png`),clean);writeFileSync(resolve(out,`${view}-${id}-guide.png`),guide);records[view][id]={clean:`${view}-${id}.png`,guide:`${view}-${id}-guide.png`,sha256:{clean:sha(clean),guide:sha(guide)},geometry};
  }
}
const seated=buildSeatedGeometry(),sit=renderMaster(seated,{chair:true}).toBuffer('image/png'),sitGuide=renderGuide(seated).toBuffer('image/png');writeFileSync(resolve(out,'south-sit.png'),sit);writeFileSync(resolve(out,'south-sit-guide.png'),sitGuide);
const sheet=createCanvas(720,1336),ctx=sheet.getContext('2d');ctx.fillStyle='#eeeae2';ctx.fillRect(0,0,sheet.width,sheet.height);ctx.font='bold 14px sans-serif';ctx.textBaseline='middle';
for(const [row,view] of ['south','east','north','west'].entries())for(const [column,id] of ['neutral','01','03'].entries()){
  const image=renderMaster(records[view][id].geometry),x=column*240,y=row*334;ctx.fillStyle='#20262b';ctx.fillRect(x,y,240,24);ctx.fillStyle='#fff';ctx.fillText(`${view} · ${id}`,x+7,y+12);ctx.drawImage(image,x,y+24);
}
const sheetBytes=sheet.toBuffer('image/png');writeFileSync(resolve(out,'canonical-master-neutral-01-03.png'),sheetBytes);
const geometrySource=readFileSync(resolve(import.meta.dirname,'canonical-geometry.mjs')),rendererSource=readFileSync(resolve(import.meta.dirname,'render-master.mjs'));
const manifest={schemaVersion:1,status:'plain-canonical-master-checkpoint-awaiting-owner-review',master:MASTER,phaseIds:MASTER.phases,views:['south','east','north','west'],records,static:{sitSouth:{clean:'south-sit.png',guide:'south-sit-guide.png',sha256:{clean:sha(sit),guide:sha(sitGuide)},geometry:seated}},fullWalkGeometry:walk,semanticLandmarks:['shoulder','elbow','wrist','palm','thumbTip','thumbLatent','hip','knee','ankle','heel','toe','soleContact'],materialRegions:MASTER.surfaceRegions,attachmentLandmarks:{neckBase:'torso shoulder center',headCrown:'full ellipse top',leftShoulder:'joints.left.shoulder',rightShoulder:'joints.right.shoulder'},surfaceContract:{topologyVersion:'canonical-short-stylized-v1',poseIndependentRegionCoordinates:true,geometrySourceSha256:sha(geometrySource),rendererSourceSha256:sha(rendererSource)},rendering:{limbs:'rigid straight segment primitives joined only at semantic joints',frontalLayerPolicy:'walking arms and legs behind torso; seated arms return over lap',lateralLayerPolicy:'far arm, far leg, near leg, torso, head, near arm',thumbVisibility:{south:'visible medial',east:'visible medial-anterior',west:'visible medial-anterior',north:'guide-only occluded back of hand'}},reviewSheet:{file:'canonical-master-neutral-01-03.png',sha256:sha(sheetBytes)}};
writeFileSync(resolve(out,'checkpoint-manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({review:resolve(out,'canonical-master-neutral-01-03.png'),sit:resolve(out,'south-sit.png'),manifest:resolve(out,'checkpoint-manifest.json')},null,2));
