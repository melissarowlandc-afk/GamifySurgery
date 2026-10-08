import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,tool,hash,rel,verifyRuntimeBaseline} from './build-roster.mjs';
const spec=JSON.parse(readFileSync(resolve(tool,'corrections/008-navy-palette-v1.json'),'utf8')),output=resolve(root,'corrections/008-navy-palette-v1');mkdirSync(output,{recursive:true});
const canvas=createCanvas(960,4*352),ctx=canvas.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,960,canvas.height);ctx.imageSmoothingEnabled=false;const inputs=[];
for(const [i,p]of spec.originalPoses.entries()){
  const reference=resolve(repo,'apps/player/public/art/characters/level3-roster-v2/level3-roster-v2.006',p.pose+'-'+p.direction+'.png'),corrected=resolve(root,'packages/008',p.pose+'-'+p.direction+'.png'),paths=[resolve(repo,p.path),reference,corrected];
  const x=i%2*480,y=Math.floor(i/2)*352;for(const [j,file]of paths.entries()){ctx.drawImage(await loadCanvas(file),x+j*160,y+24);ctx.fillStyle='#20252b';ctx.font='12px sans-serif';ctx.fillText(['Original 008','Existing navy 006','Corrected 008'][j],x+j*160+4,y+18);inputs.push({pose:p.pose,direction:p.direction,kind:j,path:rel(file),sha256:hash(file)});}
  ctx.fillStyle='#20252b';ctx.font='12px sans-serif';ctx.fillText(p.pose+' '+p.direction,x+4,y+349);
}
const file=resolve(output,'before-reference-after.png');writeFileSync(file,canvas.toBuffer('image/png'));
writeFileSync(resolve(output,'proof-manifest.json'),JSON.stringify({schemaVersion:'staff-gapfill-v6d-navy-proof/v1',policy:'Exact native-size review composites, no character editing',inputs,proof:{path:rel(file),sha256:hash(file)},managerVerification:'pending'},null,2)+'\n');
verifyRuntimeBaseline();console.log(JSON.stringify({status:'PASS',comparisonTriplets:8,poses:24,proof:rel(file)}));
