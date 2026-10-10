import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,hash,rel,directions,verifyRuntimeBaseline} from './build-roster.mjs';
const base=verifyRuntimeBaseline(),artById=new Map(base.priorRegistry.map(c=>[c.id,c]));
const original=base.priorCatalog.map(c=>{const p=artById.get(c.stillId).poses.stand.south,f=resolve(repo,'apps/player/public',p.url.replace(/^\//,''));return {...c,standSouth:{path:rel(f),sha256:hash(f),anchors:p.anchors,visibleBounds:p.visibleBounds}};});
const directory=resolve(root,'comparison'),refs=resolve(root,'references');mkdirSync(directory,{recursive:true});mkdirSync(refs,{recursive:true});
const identities=original.filter(c=>c.eligibleStaffRoleDefinitionIds?.includes('staff.app'));
assert.deepEqual(identities.map(c=>c.stillId),['future-roster20-v5.001','future-roster20-v5.002']);
const inputsFor=async(id)=>{
  const sheet=createCanvas(1280,1280),s=sheet.getContext('2d');s.imageSmoothingEnabled=false;const inputs=[];
  for(const [pi,p]of ['stand','sit'].entries())for(const [di,d]of directions.entries()){
    const pose=artById.get(id).poses[p][d],f=resolve(repo,'apps/player/public',pose.url.replace(/^\//,''));assert.equal(hash(f),pose.sha256);
    s.drawImage(await loadCanvas(f),di*320,pi*640,320,640);inputs.push({pose:p,direction:d,path:rel(f),sha256:hash(f)});
  }
  const f=resolve(refs,id+'-eight-poses.png');writeFileSync(f,sheet.toBuffer('image/png'));return {path:rel(f),sha256:hash(f),policy:'Exact approved-art composite at 2x; no altered character pixels.',inputs};
};
const board=createCanvas(320,352),ctx=board.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,320,352);ctx.imageSmoothingEnabled=false;
for(const [i,c]of identities.entries()){
  c.referenceSheet=await inputsFor(c.stillId);ctx.drawImage(await loadCanvas(resolve(repo,c.standSouth.path)),i*160,0);ctx.fillStyle='#20252b';ctx.font='10px sans-serif';ctx.fillText(c.stillId,i*160+4,334,152);
}
const f=resolve(directory,'app-existing.png');writeFileSync(f,board.toBuffer('image/png'));
const boards=[{role:'staff.app',identities:identities.map(c=>c.stillId),file:rel(f),sha256:hash(f)}];
writeFileSync(resolve(directory,'existing-inventory.json'),JSON.stringify({schemaVersion:'app-gapfill-v6e-existing-inventory/v1',scope:'Both approved APPs; their cobalt/plum outfits are reference colors to avoid for the new identities.',identities,boards},null,2)+'\n');
writeFileSync(resolve(directory,'all-catalog-inventory.json'),JSON.stringify({schemaVersion:'app-gapfill-v6e-all-catalog-inventory/v1',scope:'All 318 existing runtime looks, including patients, founders, all staff and accepted v6a-v6d. Appearance is visual only.',priorRuntimeIdentities:318,identities:original},null,2)+'\n');
const v6dReferences=[];
for(const id of ['staff-gapfill-v6d.011','staff-gapfill-v6d.012'])v6dReferences.push({id,reference:await inputsFor(id)});
writeFileSync(resolve(refs,'v6d-style-reference-manifest.json'),JSON.stringify(v6dReferences,null,2)+'\n');
verifyRuntimeBaseline();console.log(JSON.stringify({status:'PASS',existingRoleLooks:2,allCatalogIdentities:318,exactExistingAPPReferenceSheets:2,exactV6dStyleReferenceSheets:2}));
