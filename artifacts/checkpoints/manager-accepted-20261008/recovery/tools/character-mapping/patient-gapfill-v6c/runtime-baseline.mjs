// Preserve original runtime entries and both accepted art batches while allowing
// the manager-authorized append-only v6b integration to progress concurrently.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync,readFileSync,writeFileSync,statSync,mkdirSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadCatalog} from '../patient-gapfill-v6a/runtime-baseline.mjs';
export {loadCatalog} from '../patient-gapfill-v6a/runtime-baseline.mjs';
const tool=resolve(fileURLToPath(new URL('.',import.meta.url))),repo=resolve(tool,'../../..'),file=resolve(tool,'runtime-baseline.json');
const json=f=>JSON.parse(readFileSync(f,'utf8')),hash=f=>createHash('sha256').update(readFileSync(f)).digest('hex');
const rel=f=>relative(repo,f).replaceAll('\\','/'),record=f=>({path:rel(f),sha256:hash(f),bytes:statSync(f).size});
const registryFile=resolve(repo,'apps/player/src/art/characterStillRegistry.generated.json');
export function captureRuntimeBaseline(){
  if(existsSync(file))return verifyRuntimeBaseline();
  const original=json(resolve(tool,'../patient-gapfill-v6a/runtime-baseline.json')),registry=json(registryFile),catalog=loadCatalog(),ids=new Set(original.stableIds);
  const priorRegistry=registry.characters.filter(c=>ids.has(c.id)),priorCatalog=catalog.filter(c=>ids.has(c.stillId));
  assert.equal(priorRegistry.length,245);assert.equal(priorCatalog.length,245);
  const acceptedBatches=['patient-gapfill-v6a','patient-gapfill-v6b'].map(batch=>{
    const staging=json(resolve(repo,'artifacts/character-statics',batch,'staging-registry.json'));assert.equal(staging.entries.length,20);
    return {batch,ids:staging.entries.map(e=>e.stableId),poses:staging.entries.flatMap(e=>{const m=json(resolve(repo,e.manifest));return ['stand','sit'].flatMap(p=>['south','east','west','north'].map(d=>{const pose=m.poses[p][d],f=resolve(repo,pose.file);assert.equal(hash(f),pose.sha256);return record(f);}));}),native:staging.entries.flatMap(e=>['source.png','stage1-standing-cardinals.png'].map(n=>record(resolve(repo,'artifacts/character-statics',batch,'sources',e.number,n))))};
  });
  const dir=resolve(tool,'analysis/intake');mkdirSync(dir,{recursive:true});
  const rs=resolve(dir,'prior-registry-245.json'),cs=resolve(dir,'prior-catalog-245.json');writeFileSync(rs,JSON.stringify(priorRegistry,null,2)+'\n');writeFileSync(cs,JSON.stringify(priorCatalog,null,2)+'\n');
  writeFileSync(file,JSON.stringify({schemaVersion:'patient-gapfill-v6c-runtime-baseline/v1',policy:'Original 245 entries, 1990 assets, seven pipeline/chair files, and all accepted v6a/v6b art remain byte-exact. Concurrent authorized v6b append-only runtime integration is allowed. This lane writes no runtime files.',identityCount:245,assetCount:1990,selectablePatientCount:120,stableIds:original.stableIds,categoryCounts:original.categoryCounts,protectedFiles:original.protectedFiles.slice(3),assets:original.assets,priorRegistrySnapshot:record(rs),priorCatalogSnapshot:record(cs),priorRegistry,priorCatalog,acceptedBatches,allowedAddedIds:acceptedBatches.flatMap(b=>b.ids)},null,2)+'\n');
  return verifyRuntimeBaseline();
}
export function verifyRuntimeBaseline(){
  const b=json(file),original=json(resolve(tool,'../patient-gapfill-v6a/runtime-baseline.json'));
  assert.equal(b.schemaVersion,'patient-gapfill-v6c-runtime-baseline/v1');assert.equal(b.identityCount,245);assert.equal(b.assetCount,1990);assert.equal(b.selectablePatientCount,120);
  assert.deepEqual(b.stableIds,original.stableIds);assert.deepEqual(b.assets,original.assets);assert.deepEqual(b.protectedFiles,original.protectedFiles.slice(3));assert.equal(b.protectedFiles.length,7);
  assert.deepEqual(b.acceptedBatches.map(v=>v.batch),['patient-gapfill-v6a','patient-gapfill-v6b']);
  const pinned=[...b.protectedFiles,...b.assets,b.priorRegistrySnapshot,b.priorCatalogSnapshot];
  for(const batch of b.acceptedBatches){assert.equal(batch.ids.length,20);assert.equal(batch.poses.length,160);assert.equal(batch.native.length,40);pinned.push(...batch.poses,...batch.native);}
  for(const item of pinned){const f=resolve(repo,item.path);assert.equal(hash(f),item.sha256,'Protected file changed '+item.path);assert.equal(statSync(f).size,item.bytes);}
  assert.deepEqual(json(resolve(repo,b.priorRegistrySnapshot.path)),b.priorRegistry);assert.deepEqual(json(resolve(repo,b.priorCatalogSnapshot.path)),b.priorCatalog);
  const registry=json(registryFile),catalog=loadCatalog();
  for(const item of b.priorRegistry)assert.deepEqual(registry.characters.find(c=>c.id===item.id),item,'Prior registry entry changed '+item.id);
  for(const item of b.priorCatalog)assert.deepEqual(catalog.find(c=>c.stillId===item.stillId),item,'Prior catalog entry changed '+item.stillId);
  const allowed=new Set([...b.stableIds,...b.allowedAddedIds]);assert.equal(allowed.size,285);
  assert(registry.characters.every(c=>allowed.has(c.id)),'Unexpected identity outside concurrent authorized lane');assert(catalog.every(c=>allowed.has(c.stillId)),'Unexpected catalog identity outside concurrent authorized lane');
  assert.equal(new Set(registry.characters.map(c=>c.id)).size,registry.characters.length);assert.equal(new Set(catalog.map(c=>c.stillId)).size,catalog.length);return b;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){const b=captureRuntimeBaseline();console.log(JSON.stringify({status:'PASS',preservedIdentities:245,preservedAssets:1990,priorSelectablePatients:120,protectedFiles:b.protectedFiles.length,pinnedAcceptedPoses:320,pinnedAcceptedNativeSources:80,currentRuntimeIdentities:json(registryFile).characters.length,concurrentV6bAppendAllowed:true,runtimeReady:false,ownerApproval:'pending'}));}
