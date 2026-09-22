import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo=resolve(import.meta.dirname,'../../..'),registryPath=resolve(import.meta.dirname,'registry-v1.json'),artifactPath=resolve(repo,'artifacts/character-movement/whole-body-static-v1/manifest.json'),sha=bytes=>createHash('sha256').update(bytes).digest('hex'),registryBytes=readFileSync(registryPath),registry=JSON.parse(registryBytes),artifactBytes=readFileSync(artifactPath);
assert.equal(sha(artifactBytes),sha(registryBytes),'runtime manifest differs from registry');assert.equal(registry.schemaVersion,'whole-body-static/v1');assert.deepEqual(registry.canvas,{width:160,height:320,axisX:80,floorY:287});assert.deepEqual(registry.capabilities,{clipboard:false,founderCount:0});
const metrics={characters:0,poses:0,standExactRgbPixels:0,whiteIdentityPixels:0,walkingManifests:0,walkingFiles:0,headScaleRatios:{},seatContactY:{},visibleMargins:{}};
const pixels=async path=>{const image=await loadImage(path),canvas=createCanvas(image.width,image.height),context=canvas.getContext('2d');context.drawImage(image,0,0);return{image,data:context.getImageData(0,0,image.width,image.height).data};};
for(const [character,record] of Object.entries(registry.characters)){
  metrics.characters++;assert.equal(record.founder,false,`${character}: founder was invented`);assert(!('clipboard' in record.poses),`${character}: clipboard entry forbidden`);
  assert.equal(sha(readFileSync(resolve(repo,record.originalSource.path))),record.originalSource.sha256,`${character}: original source changed`);assert.equal(sha(readFileSync(resolve(repo,record.seatedSource.path))),record.seatedSource.sha256,`${character}: seated source changed`);assert.equal(sha(readFileSync(resolve(repo,record.seatedSource.promptPath))),record.seatedSource.promptSha256,`${character}: seated prompt changed`);
  const original=await pixels(resolve(repo,record.originalSource.path));metrics.headScaleRatios[character]={};metrics.seatContactY[character]={};
  for(const pose of ['stand','sit'])for(const view of ['south','east','west','north']){
    const entry=record.poses[pose][view];metrics.poses++;const bytes=readFileSync(resolve(repo,entry.file));assert.equal(sha(bytes),entry.sha256,`${character}/${pose}/${view}: output hash`);const rendered=await pixels(resolve(repo,entry.file));assert.equal(rendered.image.width,160);assert.equal(rendered.image.height,320);
    const m=entry.matrix;assert(Number.isFinite(m.a)&&m.a>0&&m.a===m.d&&m.b===0&&m.c===0,`${character}/${pose}/${view}: nonuniform matrix`);assert.equal(entry.anchors.bodyAxis.x,80);assert.equal(entry.anchors.sole.y,287);assert.equal(entry.anchors.floor.y,287);assert(entry.visibleBounds.x>=1&&entry.visibleBounds.right<=158&&entry.visibleBounds.y>=0&&entry.visibleBounds.bottom>=286&&entry.visibleBounds.bottom<=287,`${character}/${pose}/${view}: clipped or off-floor ${JSON.stringify(entry.visibleBounds)}`);
    for(const [x,y] of [[0,0],[159,0],[0,319],[159,319]])assert.equal(rendered.data[(y*160+x)*4+3],0,`${character}/${pose}/${view}: corner is not transparent`);
    metrics.visibleMargins[`${character}.${pose}.${view}`]={left:entry.visibleBounds.x,right:159-entry.visibleBounds.right,top:entry.visibleBounds.y,bottom:319-entry.visibleBounds.bottom};
    if(pose==='stand'){
      assert.equal(m.a,1,`${character}/${view}: original stand not 1x`);assert(Number.isInteger(m.e)&&Number.isInteger(m.f),`${character}/${view}: original stand not integer translated`);
      const crop=entry.sourceCrop;for(let y=0;y<320;y++)for(let x=0;x<160;x++){const i=(y*160+x)*4;if(rendered.data[i+3]!==255)continue;const sx=Math.round(x-m.e)+crop.x,sy=Math.round(y-m.f)+crop.y,si=(sy*original.image.width+sx)*4;assert.deepEqual([...rendered.data.slice(i,i+3)],[...original.data.slice(si,si+3)],`${character}/${view}: original RGB altered at ${x},${y}`);metrics.standExactRgbPixels++;if((character==='green'||character==='gray-braid')&&y<155&&Math.min(rendered.data[i],rendered.data[i+1],rendered.data[i+2])>=190)metrics.whiteIdentityPixels++;}
    }else{
      const standHead=record.poses.stand[view].anchors.headBounds.height,ratio=entry.anchors.headBounds.height/standHead;metrics.headScaleRatios[character][view]=ratio;assert(ratio>=.78&&ratio<=1.15,`${character}/${view}: seated head scale ratio ${ratio}`);metrics.seatContactY[character][view]=entry.anchors.seatContact.y;assert(entry.anchors.seatContact.y>=195&&entry.anchors.seatContact.y<=235,`${character}/${view}: implausible natural seat marker ${entry.anchors.seatContact.y}`);
    }
  }
  for(const pin of record.walking.manifests){assert.equal(sha(readFileSync(resolve(repo,pin.path))),pin.sha256,`${character}: walking manifest changed ${pin.path}`);metrics.walkingManifests++;}
  for(const view of ['south','east','west','north']){assert.deepEqual(Object.keys(record.walking.frames[view]).sort(),['01','02','03','04','05','06','07','08']);for(const [phase,frame] of Object.entries(record.walking.frames[view])){assert.equal(sha(readFileSync(resolve(repo,frame.file))),frame.sha256,`${character}/${view}/${phase}: approved walk changed`);metrics.walkingFiles++;}}
}
assert.equal(metrics.characters,4);assert.equal(metrics.poses,32);assert.equal(metrics.walkingFiles,128);assert(metrics.standExactRgbPixels>100000,`too few exact original pixels ${metrics.standExactRgbPixels}`);assert(metrics.whiteIdentityPixels>1000,`white hair/shirt identity pixels were erased ${metrics.whiteIdentityPixels}`);
console.log(JSON.stringify({status:'PASS',registrySha256:sha(registryBytes),...metrics}));
