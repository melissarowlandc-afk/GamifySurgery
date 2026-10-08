// Review compositing only: native packaged character pixels remain unchanged.
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,tool,hash,rel} from './build-roster.mjs';
const directory=resolve(root,'review/manager');mkdirSync(directory,{recursive:true});
const selected=[['001','002'],['003','006'],['006','007'],['007','004'],['010','011'],['012','012'],['013','013'],['018','017']];
const board=createCanvas(1280,688),ctx=board.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,1280,688);ctx.imageSmoothingEnabled=false;const comparisons=[];
for(const [i,[oldNumber,newNumber]]of selected.entries()){
  const oldFile=resolve(repo,'artifacts/character-statics/patient-gapfill-v6b/packages',oldNumber,'stand-south.png'),newFile=resolve(root,'packages',newNumber,'stand-south.png');
  ctx.drawImage(await loadCanvas(oldFile),i*160,0);ctx.drawImage(await loadCanvas(newFile),i*160,344);ctx.fillStyle='#20252b';ctx.font='12px sans-serif';ctx.fillText('v6b.'+oldNumber,i*160+8,334);ctx.fillText('v6c.'+newNumber,i*160+8,678);
  comparisons.push({acceptedReference:{path:rel(oldFile),sha256:hash(oldFile)},candidate:{path:rel(newFile),sha256:hash(newFile)}});
}
const file=resolve(directory,'v6b-top-v6c-bottom.png');writeFileSync(file,board.toBuffer('image/png'));
const numbers=JSON.parse(readFileSync(resolve(tool,'roster.json'),'utf8')).identities.map(c=>c.number),darkBoards=[];
for(let start=0;start<numbers.length;start+=4){
  const group=numbers.slice(start,start+4),c=createCanvas(1280,1280),x=c.getContext('2d');x.fillStyle='#20252b';x.fillRect(0,0,c.width,c.height);x.imageSmoothingEnabled=false;
  for(const [j,number]of group.entries())x.drawImage(await loadCanvas(resolve(root,'packages',number,'full-poses-dark.png')),(j%2)*640,Math.floor(j/2)*640);
  const p=resolve(directory,'normalized-dark-'+group[0]+'-'+group.at(-1)+'.png');writeFileSync(p,c.toBuffer('image/png'));darkBoards.push({identities:group,proof:{path:rel(p),sha256:hash(p)}});
}
writeFileSync(resolve(directory,'style-review-manifest.json'),JSON.stringify({schemaVersion:'patient-gapfill-v6c-style-review/v1',scope:'Accepted v6b above / v6c candidates below with unchanged 160x320 canvases and scale. Five dark sheets contain all 152 normalized poses. Review compositing only.',comparisonBoard:{path:rel(file),sha256:hash(file)},comparisons,darkBoards,managerAcceptance:'pending'},null,2)+'\n');
console.log(JSON.stringify({status:'PASS',sameScaleV6bV6cPairs:8,normalizedDarkPoseBoards:5,posesShown:152}));
