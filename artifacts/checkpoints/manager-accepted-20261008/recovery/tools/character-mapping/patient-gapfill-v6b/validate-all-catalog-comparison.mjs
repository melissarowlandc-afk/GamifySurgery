// Independently reconstruct the complete comparison inventory from preservation
// snapshots and accepted v6a artifacts, then recalculate every comparison score.
import assert from 'node:assert/strict';
import {runtimeIntegrationState} from './runtime-contract.mjs';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas,measure} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,tool,hash,verifyRuntimeBaseline} from './build-roster.mjs';
const json=f=>JSON.parse(readFileSync(f,'utf8')),base=verifyRuntimeBaseline();
const directory=resolve(root,'comparison'),manifest=json(resolve(directory,'all-catalog-manifest.json')),inventory=json(resolve(directory,'all-catalog-inventory.json'));
assert.equal(manifest.schemaVersion,'patient-gapfill-v6b-all-catalog-comparison/v1');assert.equal(manifest.threshold,8);assert.equal(manifest.managerAcceptance,'pending');
assert.equal(hash(resolve(repo,manifest.inventory.path)),manifest.inventory.sha256);
const oldById=new Map(base.priorRegistry.map(c=>[c.id,c]));
const expected=base.priorCatalog.map(c=>{
  const art=oldById.get(c.stillId),p=art.poses.stand.south;return {id:c.stillId,sex:c.compatibleSexLabel,ageBand:c.ageBand,path:'apps/player/public/'+p.url.replace(/^\//,''),sha256:p.sha256};
});
const v6a=json(resolve(repo,'tools/character-mapping/patient-gapfill-v6a/roster.json'));
for(const c of v6a.identities){const m=json(resolve(repo,'artifacts/character-statics/patient-gapfill-v6a/packages',c.number,'manifest.json')),p=m.poses.stand.south;expected.push({id:c.stableId,sex:c.compatibleSexLabel,ageBand:c.ageBand,path:p.file,sha256:p.sha256});}
assert.equal(expected.length,265);assert.equal(new Set(expected.map(c=>c.id)).size,265);
assert.equal(inventory.originalCatalogIdentities,245);assert.equal(inventory.acceptedV6aIdentities,20);assert.equal(inventory.identities.length,265);
assert.deepEqual(inventory.identities.map(c=>c.stillId),expected.map(c=>c.id));
for(const [i,c]of inventory.identities.entries()){
  const e=expected[i];assert.equal(c.compatibleSexLabel,e.sex);assert.equal(c.ageBand,e.ageBand);assert.equal(c.standSouth.path,e.path);assert.equal(c.standSouth.sha256,e.sha256);
}
const staging=json(resolve(root,'staging-registry.json'));
const fresh=staging.entries.map(e=>{const m=json(resolve(repo,e.manifest)),p=m.poses.stand.south;return {id:e.stableId,number:e.number,sex:m.identity.compatibleSexLabel,ageBand:m.identity.ageBand,path:p.file,sha256:p.sha256};});
assert.equal(fresh.length,20);assert.deepEqual(manifest.entries.map(e=>e.id),fresh.map(c=>c.id));
const vectors=new Map();
for(const item of [...expected,...fresh]){
  assert.equal(hash(resolve(repo,item.path)),item.sha256);const image=await loadCanvas(resolve(repo,item.path)),b=measure(image).visibleBounds,s=112/b.height;
  const t=createCanvas(64,128),ctx=t.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,64,128);ctx.imageSmoothingEnabled=false;
  ctx.drawImage(image,32-(b.x+b.width/2)*s,120-(b.y+b.height)*s,image.width*s,image.height*s);vectors.set(item.id,ctx.getImageData(0,0,64,128).data);
}
function score(aId,bId){const a=vectors.get(aId),b=vectors.get(bId);let s=0;for(let i=0;i<a.length;i+=4)for(let c=0;c<3;c++)s+=(a[i+c]-b[i+c])**2;return Math.sqrt(s/(a.length/4*3));}
const flags=[];let pairs=0;
for(const [i,c]of fresh.entries()){
  const row=manifest.entries[i];for(const k of Object.keys(c))assert.equal(row[k],c[k]);assert.equal(row.comparedExisting,265);
  const scores=expected.map(p=>({id:p.id,path:p.path,sha256:p.sha256,rmse:score(c.id,p.id)})).sort((a,b)=>a.rmse-b.rmse||a.id.localeCompare(b.id));
  assert.deepEqual(row.comparisons,scores);assert.deepEqual(row.nearestSix,scores.slice(0,6));pairs+=scores.length;
  for(const p of scores)if(p.rmse<8)flags.push({id:c.id,...p});
  assert.equal(hash(resolve(repo,row.board.path)),row.board.sha256);const image=await loadCanvas(resolve(repo,row.board.path));assert.equal(image.width,1008);assert.equal(image.height,342);
}
const within=[];for(let i=0;i<fresh.length;i++)for(let j=i+1;j<fresh.length;j++){const p={first:fresh[i].id,second:fresh[j].id,rmse:score(fresh[i].id,fresh[j].id)};within.push(p);if(p.rmse<8)flags.push(p);}
assert.deepEqual(manifest.withinBatch,within);assert.deepEqual(manifest.flags,flags);assert.equal(flags.length,0,'all-catalog or cross-band near-duplicate flags require resolution');
assert.equal(pairs,5300);assert.equal(within.length,190);assert.equal(manifest.totalCatalogComparisons,pairs);assert.equal(manifest.totalWithinBatchComparisons,within.length);
assert.equal(manifest.catalogBoards.length,6);assert.deepEqual(manifest.catalogBoards.flatMap(b=>b.identities),expected.map(e=>e.id));
for(const b of manifest.catalogBoards)assert.equal(hash(resolve(repo,b.proof.path)),b.proof.sha256);
const html=readFileSync(resolve(directory,'all-catalog.html'),'utf8');assert.equal([...html.matchAll(/<img\b/gi)].length,20);
for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){assert(!/^[a-z]+:|^\/\//i.test(m[1]));assert(existsSync(resolve(directory,m[1])));}
const runtime=runtimeIntegrationState();
const result={status:'PASS',originalCatalogIdentities:245,acceptedV6aIdentities:20,allCatalogIdentities:265,independentlyRecomputedCatalogComparisons:pairs,withinBatchPairs:within.length,nearDuplicateFlags:flags.length,minimumCatalogRmse:Math.min(...manifest.entries.map(e=>e.nearestSix[0].rmse)),minimumWithinBatchRmse:Math.min(...within.map(p=>p.rmse)),managerVisualAcceptance:runtime.authorized?'approved':'pending',browserValidation:runtime.authorized?'manager-accepted-gallery-run-recorded-in-program-plan':'not-run-left-to-manager'};
mkdirSync(resolve(root,'validation'),{recursive:true});if(!process.argv.includes('--check-only'))writeFileSync(resolve(root,'validation/all-catalog-results.json'),JSON.stringify(result,null,2)+'\n');verifyRuntimeBaseline();console.log(JSON.stringify(result));
