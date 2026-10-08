import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,hash,rel} from './build-roster.mjs';
const directory=resolve(root,'review/manager');mkdirSync(directory,{recursive:true});
const selected=[['001','001'],['004','003'],['006','006'],['007','007'],['008','010'],['011','012'],['013','013'],['015','018']];
const board=createCanvas(1280,688),ctx=board.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,1280,688);ctx.imageSmoothingEnabled=false;
const comparisons=[];
for(const [i,[oldNumber,newNumber]]of selected.entries()){
  const oldFile=resolve(repo,'artifacts/character-statics/patient-gapfill-v6a/packages',oldNumber,'stand-south.png');
  const newFile=resolve(root,'packages',newNumber,'stand-south.png');
  ctx.drawImage(await loadCanvas(oldFile),i*160,0);ctx.drawImage(await loadCanvas(newFile),i*160,344);
  ctx.fillStyle='#20252b';ctx.font='12px sans-serif';ctx.fillText('v6a.'+oldNumber,i*160+8,334);ctx.fillText('v6b.'+newNumber,i*160+8,678);
  comparisons.push({acceptedReference:{path:rel(oldFile),sha256:hash(oldFile)},candidate:{path:rel(newFile),sha256:hash(newFile)}});
}
const file=resolve(directory,'v6a-top-v6b-bottom.png');writeFileSync(file,board.toBuffer('image/png'));
const darkBoards=[];
for(let start=1;start<=20;start+=4){
  const c=createCanvas(1280,1280),x=c.getContext('2d');x.imageSmoothingEnabled=false;
  for(let j=0;j<4;j++){const number=String(start+j).padStart(3,'0');const p=resolve(root,'packages',number,'full-poses-dark.png');x.drawImage(await loadCanvas(p),(j%2)*640,Math.floor(j/2)*640);}
  const p=resolve(directory,'normalized-dark-'+String(start).padStart(3,'0')+'-'+String(start+3).padStart(3,'0')+'.png');writeFileSync(p,c.toBuffer('image/png'));darkBoards.push({identities:Array.from({length:4},(_,j)=>String(start+j).padStart(3,'0')),proof:{path:rel(p),sha256:hash(p)}});
}
const result={schemaVersion:'patient-gapfill-v6b-style-review/v1',scope:'Accepted v6a above / v6b candidates below, with identical 160x320 source canvases and scale. Additional contact sheets show every normalized pose on a dark background. Compositing review evidence only; character pixels unchanged.',comparisonBoard:{path:rel(file),sha256:hash(file)},comparisons,darkBoards,managerAcceptance:'pending'};
writeFileSync(resolve(directory,'style-review-manifest.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:'PASS',sameScaleV6aV6bPairs:8,normalizedDarkPoseBoards:5,posesShown:160}));
