// Review-only compositing. This does not edit character PNGs or native sources.
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {root,rel,hash} from './build-roster.mjs';
const directory=resolve(root,'review/manager');mkdirSync(directory,{recursive:true});
const groups=[];
for(const [kind,suffix] of [['same-band','nearest-six'],['all-catalog','all-catalog-nearest-six']]){
  for(let start=1;start<=20;start+=4){
    const c=createCanvas(1008,1368),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
    const inputs=[];
    for(let j=0;j<4;j++){
      const number=String(start+j).padStart(3,'0'),file=resolve(root,'comparison',number+'-'+suffix+'.png');
      ctx.drawImage(await loadCanvas(file),0,j*342);inputs.push({path:rel(file),sha256:hash(file)});
    }
    const file=resolve(directory,kind+'-nearest-'+String(start).padStart(3,'0')+'-'+String(start+3).padStart(3,'0')+'.png');
    writeFileSync(file,c.toBuffer('image/png'));groups.push({kind,inputs,proof:{path:rel(file),sha256:hash(file)}});
  }
}
const result={schemaVersion:'patient-gapfill-v6b-qa-atlases/v1',scope:'Review-only native-size composites of all 40 comparison boards; character pixels unchanged.',groups,managerAcceptance:'pending'};
writeFileSync(resolve(directory,'qa-atlases-manifest.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:'PASS',nearestComparisonBoardsShown:40,reviewAtlases:groups.length}));
