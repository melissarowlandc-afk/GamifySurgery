// Review-only composition of all near-neighbor boards; no art edits.
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {tool,root,rel,hash} from './build-roster.mjs';
const directory=resolve(root,'review/manager');mkdirSync(directory,{recursive:true});
const numbers=JSON.parse(readFileSync(resolve(tool,'roster.json'),'utf8')).identities.map(c=>c.number),groups=[];
for(const [kind,suffix]of [['same-band','nearest-six'],['all-catalog','all-catalog-nearest-six']])for(let start=0;start<numbers.length;start+=4){
  const group=numbers.slice(start,start+4),c=createCanvas(1008,group.length*342),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;const inputs=[];
  for(const [j,number]of group.entries()){const file=resolve(root,'comparison',number+'-'+suffix+'.png');ctx.drawImage(await loadCanvas(file),0,j*342);inputs.push({path:rel(file),sha256:hash(file)});}
  const file=resolve(directory,kind+'-nearest-'+group[0]+'-'+group.at(-1)+'.png');writeFileSync(file,c.toBuffer('image/png'));groups.push({kind,inputs,proof:{path:rel(file),sha256:hash(file)}});
}
writeFileSync(resolve(directory,'qa-atlases-manifest.json'),JSON.stringify({schemaVersion:'patient-gapfill-v6c-qa-atlases/v1',scope:'Review-only native-size composites of all 38 comparison boards; character pixels unchanged.',groups,managerAcceptance:'pending'},null,2)+'\n');
console.log(JSON.stringify({status:'PASS',nearestComparisonBoardsShown:38,reviewAtlases:groups.length}));
