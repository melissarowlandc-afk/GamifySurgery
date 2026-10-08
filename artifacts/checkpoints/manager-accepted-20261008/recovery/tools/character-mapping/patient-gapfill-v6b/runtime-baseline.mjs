// Read-only preservation guards. The manager explicitly authorized concurrent
// v6a runtime integration, so pin the prior subset rather than whole registries.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync,readFileSync,writeFileSync,statSync,mkdirSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadCatalog} from '../patient-gapfill-v6a/runtime-baseline.mjs';
export {loadCatalog} from '../patient-gapfill-v6a/runtime-baseline.mjs';
import {expectedCatalogSource,readIntegrationBaseline,runtimeIntegrationState,verifyAppendOnlyCatalog,verifyAppendOnlyRegistry} from './runtime-contract.mjs';
const tool=resolve(fileURLToPath(new URL('.',import.meta.url))),repo=resolve(tool,'../../..');
const baselineFile=resolve(tool,'runtime-baseline.json');
const json=file=>JSON.parse(readFileSync(file,'utf8'));
const hash=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
const rel=file=>relative(repo,file).replaceAll('\\','/');
const registryFile=resolve(repo,'apps/player/src/art/characterStillRegistry.generated.json');
const assetRecord=file=>({path:rel(file),sha256:hash(file),bytes:statSync(file).size});

export function captureRuntimeBaseline(){
  if(existsSync(baselineFile))return verifyRuntimeBaseline();
  const original=json(resolve(tool,'../patient-gapfill-v6a/runtime-baseline.json'));
  const registry=json(registryFile),catalog=loadCatalog();
  const oldIds=new Set(original.stableIds);
  const protectedFiles=original.protectedFiles.slice(3);
  for(const item of [...protectedFiles,...original.assets]){
    assert.equal(hash(resolve(repo,item.path)),item.sha256,'prior protected file changed '+item.path);
    assert.equal(statSync(resolve(repo,item.path)).size,item.bytes);
  }
  const priorRegistry=registry.characters.filter(c=>oldIds.has(c.id));
  const priorCatalog=catalog.filter(c=>oldIds.has(c.stillId));
  assert.equal(priorRegistry.length,245);assert.equal(priorCatalog.length,245);
  assert.equal(priorCatalog.filter(c=>c.category==='patient').length,120);
  const v6a=json(resolve(repo,'artifacts/character-statics/patient-gapfill-v6a/staging-registry.json'));
  assert.equal(v6a.entries.length,20);
  const v6aAssets=v6a.entries.flatMap(entry=>{
    const m=json(resolve(repo,entry.manifest));
    return ['stand','sit'].flatMap(pose=>['south','east','west','north'].map(d=>{
      const file=resolve(repo,m.poses[pose][d].file);assert.equal(hash(file),m.poses[pose][d].sha256);return assetRecord(file);
    }));
  });
  const v6aNative=v6a.entries.flatMap(entry=>['source.png','stage1-standing-cardinals.png'].map(name=>assetRecord(resolve(repo,'artifacts/character-statics/patient-gapfill-v6a/sources',entry.number,name))));
  const snapshotDir=resolve(tool,'analysis/intake');mkdirSync(snapshotDir,{recursive:true});
  const registrySnapshot=resolve(snapshotDir,'prior-registry-245.json'),catalogSnapshot=resolve(snapshotDir,'prior-catalog-245.json');
  writeFileSync(registrySnapshot,JSON.stringify(priorRegistry,null,2)+'\n');
  writeFileSync(catalogSnapshot,JSON.stringify(priorCatalog,null,2)+'\n');
  const baseline={schemaVersion:'patient-gapfill-v6b-runtime-baseline/v1',
    policy:'Prior 245 identities/1990 assets/120 patient metadata and seven pipeline/chair files stay exact. Concurrent manager-authorized v6a append-only integration is permitted; v6a native and packaged art is pinned. No runtime writes by this lane.',
    authorization:'Current worker brief: a concurrent worker is integrating v6a into the runtime; read only elsewhere.',
    identityCount:245,assetCount:1990,selectablePatientCount:120,stableIds:original.stableIds,
    categoryCounts:original.categoryCounts,protectedFiles,assets:original.assets,
    priorRegistrySnapshot:assetRecord(registrySnapshot),priorCatalogSnapshot:assetRecord(catalogSnapshot),
    priorRegistry,priorCatalog,v6aAssets,v6aNative,allowedAddedIds:v6a.entries.map(e=>e.stableId)};
  writeFileSync(baselineFile,JSON.stringify(baseline,null,2)+'\n');
  return verifyRuntimeBaseline();
}

export function verifyRuntimeBaseline(){
  const baseline=json(baselineFile);
  assert.equal(baseline.schemaVersion,'patient-gapfill-v6b-runtime-baseline/v1');
  assert.equal(baseline.identityCount,245);assert.equal(baseline.assetCount,1990);assert.equal(baseline.selectablePatientCount,120);
  assert.equal(baseline.stableIds.length,245);assert.equal(new Set(baseline.stableIds).size,245);
  assert.equal(baseline.assets.length,1990);assert.equal(baseline.protectedFiles.length,7);
  assert.equal(baseline.v6aAssets.length,160);assert.equal(baseline.v6aNative.length,40);
  const original=json(resolve(tool,'../patient-gapfill-v6a/runtime-baseline.json'));
  assert.deepEqual(baseline.stableIds,original.stableIds);assert.deepEqual(baseline.assets,original.assets);
  assert.deepEqual(baseline.protectedFiles,original.protectedFiles.slice(3));
  for(const item of [...baseline.protectedFiles,...baseline.assets,...baseline.v6aAssets,...baseline.v6aNative,baseline.priorRegistrySnapshot,baseline.priorCatalogSnapshot]){
    assert.equal(hash(resolve(repo,item.path)),item.sha256,'protected art/source changed '+item.path);
    assert.equal(statSync(resolve(repo,item.path)).size,item.bytes);
  }
  assert.deepEqual(json(resolve(repo,baseline.priorRegistrySnapshot.path)),baseline.priorRegistry);
  assert.deepEqual(json(resolve(repo,baseline.priorCatalogSnapshot.path)),baseline.priorCatalog);
  const registry=json(registryFile),catalog=loadCatalog();
  for(const item of baseline.priorRegistry)assert.deepEqual(registry.characters.find(c=>c.id===item.id),item,'prior registry metadata changed '+item.id);
  for(const item of baseline.priorCatalog)assert.deepEqual(catalog.find(c=>c.stillId===item.stillId),item,'prior catalog metadata changed '+item.stillId);
  const approved=existsSync(resolve(tool,'owner-approval.json'));
  const ownIds=approved?json(resolve(tool,'roster.json')).identities.map(c=>c.stableId):[];
  const allowed=new Set([...baseline.stableIds,...baseline.allowedAddedIds,...ownIds]);
  assert(registry.characters.every(c=>allowed.has(c.id)),'unexpected runtime identity outside authorized v6a/v6b lanes');
  assert(catalog.every(c=>allowed.has(c.stillId)),'unexpected catalog identity outside authorized v6a/v6b lanes');
  assert.equal(new Set(registry.characters.map(c=>c.id)).size,registry.characters.length);
  assert.equal(new Set(catalog.map(c=>c.stillId)).size,catalog.length);
  if(registry.characters.some(c=>ownIds.includes(c.id))||catalog.some(c=>ownIds.includes(c.stillId))){
    assert(approved);verifyAppendOnlyRegistry();verifyAppendOnlyCatalog();
    assert.equal(readFileSync(resolve(repo,'packages/game-domain/src/characterStillCatalog.ts'),'utf8'),expectedCatalogSource());
  }else if(approved){
    verifyAppendOnlyRegistry({allowBefore:true});verifyAppendOnlyCatalog({allowBefore:true});
  }
  return baseline;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const b=captureRuntimeBaseline();const registry=json(registryFile);
  const integration=runtimeIntegrationState(),before=readIntegrationBaseline();
  console.log(JSON.stringify({status:'PASS',preservedIdentities:before.identityCount,preservedAssets:before.assetCount,priorSelectablePatients:before.patientCount,generationPinnedIdentities:b.identityCount,generationPinnedAssets:b.assetCount,protectedFiles:b.protectedFiles.length,pinnedV6aPoses:b.v6aAssets.length,pinnedV6aNativeSources:b.v6aNative.length,currentRuntimeIdentities:registry.characters.length,concurrentV6aAppendAllowed:true,runtimeReady:integration.ready,ownerApproval:integration.ownerApproval}));
}
