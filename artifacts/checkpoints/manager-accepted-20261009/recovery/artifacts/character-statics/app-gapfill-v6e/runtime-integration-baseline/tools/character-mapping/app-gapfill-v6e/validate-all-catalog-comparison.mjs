// Reconstruct both inventories from frozen runtime metadata and accepted v6b,
// then independently recompute every score. Rankings alone are not visual approval.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas,measure} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,hash,verifyRuntimeBaseline} from './build-roster.mjs';
import {roles} from './role-contract.mjs';
const json=f=>JSON.parse(readFileSync(f,'utf8')),base=verifyRuntimeBaseline(),directory=resolve(root,'comparison');
const all=json(resolve(directory,'all-catalog-manifest.json')),inventory=json(resolve(directory,'all-catalog-inventory.json'));
const same=json(resolve(directory,'manifest.json')),roleInventory=json(resolve(directory,'existing-inventory.json'));
const receipt=r=>assert.equal(hash(resolve(repo,r.path)),r.sha256,'changed evidence '+r.path);
for(const m of [all,same]){assert.equal(m.threshold,8);assert.equal(m.managerAcceptance,'pending');}
assert.equal(all.schemaVersion,'app-gapfill-v6e-all-catalog-comparison/v1');
assert.equal(same.schemaVersion,'app-gapfill-v6e-comparison/v1');receipt(all.inventory);receipt(same.existingInventory);
const artById=new Map(base.priorRegistry.map(c=>[c.id,c]));
const old=base.priorCatalog.map(c=>{
  const p=artById.get(c.stillId).poses.stand.south;
  return {id:c.stillId,category:c.category,roles:c.eligibleStaffRoleDefinitionIds??[],sex:c.compatibleSexLabel,ageBand:c.ageBand,path:'apps/player/public/'+p.url.replace(/^\//,''),sha256:p.sha256};
});
assert.equal(old.length,318);assert.equal(new Set(old.map(c=>c.id)).size,318);
assert.equal(inventory.priorRuntimeIdentities,318);
assert.deepEqual(inventory.identities.map(c=>c.stillId),old.map(c=>c.id));
for(const [i,c]of inventory.identities.entries()){
  const e=old[i];assert.equal(c.category,e.category);assert.equal(c.compatibleSexLabel,e.sex);assert.equal(c.ageBand,e.ageBand);
  assert.deepEqual(c.eligibleStaffRoleDefinitionIds??[],e.roles);assert.equal(c.standSouth.path,e.path);assert.equal(c.standSouth.sha256,e.sha256);
}
const eligible=old.filter(c=>c.category==='staff'&&c.roles.some(r=>roles.includes(r)));
assert.equal(eligible.length,2);assert.deepEqual(roleInventory.identities.map(c=>c.stillId),eligible.map(c=>c.id));
for(const [i,c]of roleInventory.identities.entries()){
  const e=eligible[i];assert.deepEqual(c.eligibleStaffRoleDefinitionIds,e.roles);assert.equal(c.standSouth.path,e.path);assert.equal(c.standSouth.sha256,e.sha256);
  receipt(c.referenceSheet);assert.equal(c.referenceSheet.inputs.length,8);
  for(const p of c.referenceSheet.inputs)receipt(p);
}
assert.deepEqual(roleInventory.boards.map(c=>c.role),roles);
for(const b of roleInventory.boards){assert.deepEqual(b.identities,eligible.filter(c=>c.roles.includes(b.role)).map(c=>c.id));receipt({path:b.file,sha256:b.sha256});}
const staging=json(resolve(root,'staging-registry.json'));
const fresh=staging.entries.map(e=>{const m=json(resolve(repo,e.manifest)),p=m.poses.stand.south;return {id:e.stableId,number:e.number,role:m.identity.eligibleStaffRoleDefinitionIds[0],sex:m.identity.compatibleSexLabel,age:m.identity.intendedAge,ageBand:m.identity.ageBand,path:p.file,sha256:p.sha256,sourceSha256:e.sourceSha256};});
assert.equal(fresh.length,8);assert.deepEqual(fresh.map(c=>c.role),Array.from({length:8},()=>roles[0]));
assert.deepEqual(all.entries.map(c=>c.id),fresh.map(c=>c.id));assert.deepEqual(same.entries.map(c=>c.id),fresh.map(c=>c.id));
const vectors=new Map();
for(const c of [...old,...fresh]){
  receipt({path:c.path,sha256:c.sha256});const image=await loadCanvas(resolve(repo,c.path)),b=measure(image).visibleBounds,s=112/b.height;
  const t=createCanvas(64,128),ctx=t.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,64,128);ctx.imageSmoothingEnabled=false;
  ctx.drawImage(image,32-(b.x+b.width/2)*s,120-(b.y+b.height)*s,image.width*s,image.height*s);vectors.set(c.id,ctx.getImageData(0,0,64,128).data);
}
function score(aId,bId){const a=vectors.get(aId),b=vectors.get(bId);let sum=0;for(let i=0;i<a.length;i+=4)for(let k=0;k<3;k++)sum+=(a[i+k]-b[i+k])**2;return Math.sqrt(sum/(a.length/4*3));}
const flags=[],roleFlags=[];let allPairs=0,rolePairs=0;
for(const [i,c]of fresh.entries())for(const [m,candidates,outputFlags,isRole]of [[all,old,flags,false],[same,eligible.filter(o=>o.roles.includes(c.role)),roleFlags,true]]){
  const row=m.entries[i];for(const k of ['id','number','role','sex','ageBand','sourceSha256'])assert.equal(row[k],c[k]);
  if(isRole)assert.deepEqual(row.newPose,{path:c.path,sha256:c.sha256});else for(const k of ['path','sha256','age'])assert.equal(row[k],c[k]);
  const scores=candidates.map(o=>({id:o.id,path:o.path,sha256:o.sha256,rmse:score(c.id,o.id)})).sort((a,b)=>a.rmse-b.rmse||a.id.localeCompare(b.id));
  assert.deepEqual(row.comparisons,scores);assert.deepEqual(row.nearestSix,scores.slice(0,6));assert.equal(row.comparedExisting,candidates.length);
  if(isRole)rolePairs+=scores.length;else allPairs+=scores.length;
  for(const p of scores)if(p.rmse<8)outputFlags.push({id:c.id,...p});
  receipt(row.board);const image=await loadCanvas(resolve(repo,row.board.path));assert.equal(image.width,1008);assert.equal(image.height,342);
  if(isRole)receipt(row.allSameRolePage);
}
const within=[],roleWithin=[];
for(let i=0;i<fresh.length;i++)for(let j=i+1;j<fresh.length;j++){
  const p={first:fresh[i].id,second:fresh[j].id,rmse:score(fresh[i].id,fresh[j].id)};within.push(p);if(p.rmse<8)flags.push(p);
  if(fresh[i].role===fresh[j].role){roleWithin.push(p);if(p.rmse<8)roleFlags.push(p);}
}
assert.deepEqual(all.withinBatch,within);assert.deepEqual(same.withinBatch,roleWithin);
assert.deepEqual(all.flags,flags);assert.deepEqual(same.flags,roleFlags);assert.equal(flags.length,0);assert.equal(roleFlags.length,0);
assert.equal(allPairs,2544);assert.equal(rolePairs,16);assert.equal(within.length,28);assert.equal(roleWithin.length,28);
assert.equal(all.totalCatalogComparisons,allPairs);assert.equal(all.totalWithinBatchComparisons,within.length);
assert.equal(same.totalExistingComparisons,rolePairs);assert.equal(same.totalWithinBatchComparisons,roleWithin.length);
assert.equal(all.catalogBoards.length,7);assert.deepEqual(all.catalogBoards.flatMap(b=>b.identities),old.map(c=>c.id));
for(const b of all.catalogBoards)receipt(b.proof);
assert.deepEqual(same.roleBoards.map(b=>b.role),roles);
for(const b of same.roleBoards){
  const prior=eligible.filter(c=>c.roles.includes(b.role)),added=fresh.filter(c=>c.role===b.role);
  assert.deepEqual(b.existing,prior.map(c=>c.id));assert.deepEqual(b.new,added.map(c=>c.id));assert.deepEqual(b.inputs.map(c=>c.id),[...b.existing,...b.new]);receipt(b.proof);
  const image=await loadCanvas(resolve(repo,b.proof.path));assert.equal(image.width,b.inputs.length*160);assert.equal(image.height,732);
  for(const p of b.inputs){receipt(p.standing);receipt(p.seated);const expected=[...old,...fresh].find(c=>c.id===p.id);assert.deepEqual(p.standing,{path:expected.path,sha256:expected.sha256});
    const seated=artById.get(p.id)?.poses.sit.east??json(resolve(root,'packages',p.id.slice(-3),'manifest.json')).poses.sit.east;
    assert.deepEqual(p.seated,{path:seated.file??'apps/player/public/'+seated.url.replace(/^\//,''),sha256:seated.sha256});}
}
receipt(same.roleOverview);
const result={status:'PASS',priorRuntimeIdentities:318,allCatalogIdentities:318,existingRoleLooks:2,independentlyRecomputedCatalogComparisons:allPairs,independentlyRecomputedSameRoleComparisons:rolePairs,withinBatchPairs:within.length,sameRoleNewPairs:roleWithin.length,perRoleComparisonSheets:1,nearDuplicateFlags:flags.length,minimumCatalogRmse:Math.min(...all.entries.map(c=>c.nearestSix[0].rmse)),minimumWithinBatchRmse:Math.min(...within.map(c=>c.rmse)),managerVisualAcceptance:'pending',browserValidation:'not-run-left-to-manager'};
mkdirSync(resolve(root,'validation'),{recursive:true});if(!process.argv.includes('--check-only'))writeFileSync(resolve(root,'validation/all-catalog-results.json'),JSON.stringify(result,null,2)+'\n');
verifyRuntimeBaseline();console.log(JSON.stringify(result));
