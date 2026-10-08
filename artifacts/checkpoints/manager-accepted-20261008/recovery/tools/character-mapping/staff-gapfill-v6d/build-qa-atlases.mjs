// Exact review-only composites; no character drawing, edits or repainting.
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,rel,hash,verifyRuntimeBaseline} from './build-roster.mjs';
verifyRuntimeBaseline();
const directory=resolve(root,'review/manager');mkdirSync(directory,{recursive:true});
const groups=[];
for(const [kind,subdirectory,suffix,width,height] of [
  ['same-role','comparison','nearest-six',1008,342],
  ['all-catalog','comparison','all-catalog-nearest-six',1008,342],
  ['contact-overlays','worker-review/contact-overlays',null,1280,680],
]){
  const perPage=kind==='contact-overlays'?2:4;
  for(let start=1;start<=14;start+=perPage){
    const count=Math.min(perPage,15-start),c=createCanvas(width,height*count),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
    const inputs=[];
    for(let j=0;j<count;j++){
      const number=String(start+j).padStart(3,'0'),file=resolve(root,subdirectory,number+(suffix?'-'+suffix:'')+'.png');
      ctx.drawImage(await loadCanvas(file),0,j*height);inputs.push({path:rel(file),sha256:hash(file)});
    }
    const file=resolve(directory,kind+'-'+String(start).padStart(3,'0')+'-'+String(start+count-1).padStart(3,'0')+'.png');
    writeFileSync(file,c.toBuffer('image/png'));groups.push({kind,inputs,proof:{path:rel(file),sha256:hash(file)}});
  }
}
const result={schemaVersion:'staff-gapfill-v6d-qa-atlases/v1',scope:'Exact native-size composites of 28 comparison boards and 14 authored contact overlays. Character pixels unchanged.',groups,managerAcceptance:'pending'};
writeFileSync(resolve(directory,'qa-atlases-manifest.json'),JSON.stringify(result,null,2)+'\n');
verifyRuntimeBaseline();console.log(JSON.stringify({status:'PASS',nearestComparisonBoardsShown:28,contactOverlaysShown:14,reviewAtlases:groups.length}));
