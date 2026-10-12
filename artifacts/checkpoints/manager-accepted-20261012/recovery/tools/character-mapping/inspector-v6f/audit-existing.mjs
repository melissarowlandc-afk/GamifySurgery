import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,hash,rel,directions,captureRuntimeBaseline,verifyRuntimeBaseline} from './build-roster.mjs';
import {roles,referenceStaffIds} from './role-contract.mjs';
const base=captureRuntimeBaseline(),artById=new Map(base.priorRegistry.map(c=>[c.id,c]));
const original=base.priorCatalog.map(c=>{const p=artById.get(c.stillId).poses.stand.south,f=resolve(repo,'apps/player/public',p.url.replace(/^\//,''));return {...c,standSouth:{path:rel(f),sha256:hash(f),anchors:p.anchors,visibleBounds:p.visibleBounds}};});
const directory=resolve(root,'comparison'),refs=resolve(root,'references');mkdirSync(directory,{recursive:true});mkdirSync(refs,{recursive:true});
const identities=original.filter(c=>referenceStaffIds.includes(c.stillId));assert.deepEqual(identities.map(c=>c.stillId),referenceStaffIds);
async function sheet(id){
  const c=createCanvas(1280,1280),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;const inputs=[];
  for(const [pi,p]of ['stand','sit'].entries())for(const [di,d]of directions.entries()){
    const a=artById.get(id).poses[p][d],f=resolve(repo,'apps/player/public',a.url.replace(/^\//,''));assert.equal(hash(f),a.sha256);
    ctx.drawImage(await loadCanvas(f),di*320,pi*640,320,640);inputs.push({pose:p,direction:d,path:rel(f),sha256:hash(f)});
  }
  const f=resolve(refs,id+'-eight-poses.png');writeFileSync(f,c.toBuffer('image/png'));return {path:rel(f),sha256:hash(f),policy:'Exact approved-art composite at 2x; no altered character pixels.',inputs};
}
const board=createCanvas(320,352),ctx=board.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,320,352);ctx.imageSmoothingEnabled=false;
for(const [i,c]of identities.entries()){
  c.referenceSheet=await sheet(c.stillId);ctx.drawImage(await loadCanvas(resolve(repo,c.standSouth.path)),i*160,0);ctx.fillStyle='#20252b';ctx.font='10px sans-serif';ctx.fillText(c.stillId,i*160+4,334,152);
}
const f=resolve(directory,'staff-existing.png');writeFileSync(f,board.toBuffer('image/png'));
writeFileSync(resolve(directory,'existing-inventory.json'),JSON.stringify({schemaVersion:'inspector-v6f-existing-inventory/v1',scope:'Two existing v6e staff style references. No existing inspector role or runtime eligibility is claimed.',identities,boards:[{role:roles[0],identities:referenceStaffIds,file:rel(f),sha256:hash(f)}]},null,2)+'\n');
writeFileSync(resolve(directory,'all-catalog-inventory.json'),JSON.stringify({schemaVersion:'inspector-v6f-all-catalog-inventory/v1',scope:'Every existing runtime look, including patients, founders, all staff and v6a-v6e. Appearance is visual only.',priorRuntimeIdentities:base.identityCount,identities:original},null,2)+'\n');
const v6d=[];for(const id of ['staff-gapfill-v6d.011','staff-gapfill-v6d.012'])v6d.push({id,reference:await sheet(id)});
writeFileSync(resolve(refs,'v6d-style-reference-manifest.json'),JSON.stringify(v6d,null,2)+'\n');
verifyRuntimeBaseline();console.log(JSON.stringify({status:'PASS',existingStaffStyleReferences:2,allCatalogIdentities:base.identityCount,exactV6eReferenceSheets:2,exactV6dReferenceSheets:2}));
