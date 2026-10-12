// Review-only composites of exact accepted and candidate PNGs.
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,hash,rel,verifyRuntimeBaseline} from './build-roster.mjs';
const base=verifyRuntimeBaseline(),byId=new Map(base.priorRegistry.map(c=>[c.id,c]));
const directory=resolve(root,'review/manager');mkdirSync(directory,{recursive:true});
const staging=JSON.parse(readFileSync(resolve(root,'staging-registry.json'),'utf8'));assert.equal(staging.entries.length,10);
const receipt=f=>({path:rel(f),sha256:hash(f)});
const oldFile=(id,p,d)=>resolve(repo,'apps/player/public',byId.get(id).poses[p][d].url.replace(/^\//,''));
const paired=async(ctx,id,number,x,y,label)=>{
  const f=number?resolve(root,'packages',number,'stand-south.png'):oldFile(id,'stand','south');
  const sit=number?resolve(root,'packages',number,'sit-east.png'):oldFile(id,'sit','east');
  ctx.fillStyle='#fff';ctx.fillRect(x+3,y+3,314,338);ctx.imageSmoothingEnabled=false;
  ctx.drawImage(await loadCanvas(f),x,y+8);ctx.drawImage(await loadCanvas(sit),x+160,y+8);
  ctx.fillStyle='#20252b';ctx.font='12px sans-serif';ctx.fillText(label,x+6,y+336,307);
  return {id,standing:receipt(f),seated:receipt(sit)};
};
const manager=createCanvas(1280,1416),m=manager.getContext('2d');m.fillStyle='#eee9df';m.fillRect(0,0,manager.width,manager.height);m.fillStyle='#20252b';m.font='20px sans-serif';m.fillText('Existing staff on top / ten new inspector candidates below',12,26);
const managerInputs=[];
for(const [i,id]of ['app-gapfill-v6e.002','app-gapfill-v6e.007'].entries())managerInputs.push(await paired(m,id,null,320+i*320,36,'APPROVED '+id));
for(const [i,e]of staging.entries.entries()){
  const identity=JSON.parse(readFileSync(resolve(repo,e.manifest),'utf8')).identity;
  managerInputs.push(await paired(m,e.stableId,e.number,(i%4)*320,380+Math.floor(i/4)*344,'NEW '+e.number+' / '+identity.compatibleSexLabel+' / age '+identity.intendedAge));
}
const managerFile=resolve(directory,'existing-staff-top-ten-inspectors-below.png');writeFileSync(managerFile,manager.toBuffer('image/png'));
const styleBoards=[receipt(managerFile)],comparisons=[],style=createCanvas(1600,688),s=style.getContext('2d');s.fillStyle='#eee9df';s.fillRect(0,0,1600,688);s.imageSmoothingEnabled=false;
for(const [i,e]of staging.entries.entries()){
  const id=i<4?'app-gapfill-v6e.002':'app-gapfill-v6e.007',f=oldFile(id,'stand','south'),candidate=resolve(root,'packages',e.number,'stand-south.png');
  s.drawImage(await loadCanvas(f),i*160,0);s.drawImage(await loadCanvas(candidate),i*160,344);
  s.fillStyle='#20252b';s.font='12px sans-serif';s.fillText(id,i*160+4,334,152);s.fillText('inspector-v6f.'+e.number,i*160+4,678);
  comparisons.push({acceptedReference:receipt(f),candidate:receipt(candidate)});
}
const f=resolve(directory,'v6e-top-v6f-bottom.png');writeFileSync(f,style.toBuffer('image/png'));styleBoards.push(receipt(f));
const darkBoards=[];
for(let start=0;start<staging.entries.length;start+=4){
  const rows=staging.entries.slice(start,start+4),c=createCanvas(1280,1280),ctx=c.getContext('2d');ctx.fillStyle='#20252b';ctx.fillRect(0,0,c.width,c.height);ctx.imageSmoothingEnabled=false;
  for(const [i,e]of rows.entries())ctx.drawImage(await loadCanvas(resolve(root,'packages',e.number,'full-poses-dark.png')),(i%2)*640,Math.floor(i/2)*640);
  const f=resolve(directory,'normalized-dark-'+rows[0].number+'-'+rows.at(-1).number+'.png');writeFileSync(f,c.toBuffer('image/png'));darkBoards.push({identities:rows.map(e=>e.number),proof:receipt(f)});
}
const manifest={schemaVersion:'inspector-v6f-style-review/v1',scope:'Two existing staff on top with all ten new inspectors below, each standing south and seated east. Same-scale accepted v6e style board and three dark boards show all 80 normalized poses. Exact PNG composites only.',styleBoards,comparisons,darkBoards,managerInspectorComparison:{proof:receipt(managerFile),inputs:managerInputs},managerAcceptance:'pending'};
writeFileSync(resolve(directory,'style-review-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const local=p=>p.split('/').pop();
writeFileSync(resolve(directory,'index.html'),'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Inspector v6f style and pose review</title><style>body{margin:16px;background:#eee9df;color:#20252b;font:15px system-ui}img{display:block;width:100%;height:auto;image-rendering:pixelated}a{color:#0645ad}</style></head><body><a href="../index.html">Main gallery</a><h1>Existing staff, v6e style and all 80 new poses</h1><p>Both existing staff on top; all ten new inspector candidates below. Professional blazers/cardigans/button-downs, lanyards and blank badges. A right-hand clipboard in every pose, resting on the lap when seated. Appearance is visual only. Worker QA; manager acceptance pending.</p>'+styleBoards.map(c=>'<img src="'+local(c.path)+'" alt="Approved reference art above new inspector candidates">').join('')+darkBoards.map(c=>'<p>'+c.identities.join(', ')+'</p><img src="'+local(c.proof.path)+'" alt="All eight normalized poses for '+c.identities.join(', ')+'">').join('')+'</body></html>');
verifyRuntimeBaseline();console.log(JSON.stringify({status:'PASS',existingStaffReferences:2,newInspectorIdentities:10,sameScaleV6eComparisons:10,styleBoards:2,normalizedDarkPoseBoards:3,posesShown:80,managerSheet:rel(managerFile)}));
