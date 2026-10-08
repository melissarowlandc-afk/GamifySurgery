// Pin the existing subset while permitting the explicitly concurrent v6b append.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync,readFileSync,writeFileSync,statSync,mkdirSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadCatalog} from '../patient-gapfill-v6a/runtime-baseline.mjs';
export {loadCatalog} from '../patient-gapfill-v6a/runtime-baseline.mjs';
const tool=resolve(fileURLToPath(new URL('.',import.meta.url))),repo=resolve(tool,'../../..');
const baselineFile=resolve(tool,'runtime-baseline.json');
const json=file=>JSON.parse(readFileSync(file,'utf8'));
const hash=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
const rel=file=>relative(repo,file).replaceAll('\\','/');
const registryFile=resolve(repo,'apps/player/src/art/characterStillRegistry.generated.json');
const record=file=>({path:rel(file),sha256:hash(file),bytes:statSync(file).size});
export function captureRuntimeBaseline(){
  if(existsSync(baselineFile))return verifyRuntimeBaseline();
  const registry=json(registryFile),catalog=loadCatalog();
  const priorRegistry=registry.characters.filter(c=>!c.id.startsWith('patient-gapfill-v6b.'));
  const ids=new Set(priorRegistry.map(c=>c.id));
  const priorCatalog=catalog.filter(c=>ids.has(c.stillId));
  assert.equal(priorRegistry.length,265);assert.equal(priorCatalog.length,265);
  const inherited=json(resolve(tool,'../patient-gapfill-v6b/runtime-baseline.json'));
  const assets=[...inherited.assets,...inherited.v6aAssets].map(c=>{
    const actual=record(resolve(repo,c.path));assert.deepEqual(actual,c);return actual;
  });
  assert.equal(assets.length,2150);
  const controls=inherited.protectedFiles;
  const protectedFiles=controls.map(c=>{const actual=record(resolve(repo,c.path));assert.deepEqual(actual,c);return actual;});
  const added=json(resolve(tool,'../patient-gapfill-v6b/roster.json')).identities;
  const acceptedV6bAssets=added.flatMap(c=>{
    const m=json(resolve(repo,'artifacts/character-statics/patient-gapfill-v6b/packages',c.number,'manifest.json'));
    return ['stand','sit'].flatMap(p=>['south','east','west','north'].map(d=>record(resolve(repo,m.poses[p][d].file))));
  });
  const acceptedV6bSources=added.flatMap(c=>['source.png','stage1-standing-cardinals.png'].map(name=>record(resolve(repo,'artifacts/character-statics/patient-gapfill-v6b/sources',c.number,name))));
  const snapshotDir=resolve(tool,'analysis/intake');mkdirSync(snapshotDir,{recursive:true});
  const registrySnapshot=resolve(snapshotDir,'prior-registry-265.json'),catalogSnapshot=resolve(snapshotDir,'prior-catalog-265.json');
  writeFileSync(registrySnapshot,JSON.stringify(priorRegistry,null,2)+'\n');writeFileSync(catalogSnapshot,JSON.stringify(priorCatalog,null,2)+'\n');
  const baseline={schemaVersion:'staff-gapfill-v6d-runtime-baseline/v1',policy:'Prior 265 identities/2150 assets/140 selectable patient entries and shared extraction/chair sources preserved. Only manager-authorized concurrent v6b append allowed; accepted v6b art pinned. No runtime writes by v6d.',identityCount:265,assetCount:2150,selectablePatientCount:140,stableIds:[...ids],assets,protectedFiles,priorRegistry,priorCatalog,priorRegistrySnapshot:record(registrySnapshot),priorCatalogSnapshot:record(catalogSnapshot),acceptedV6bAssets,acceptedV6bSources,allowedAddedIds:added.map(c=>c.stableId)};
  writeFileSync(baselineFile,JSON.stringify(baseline,null,2)+'\n');return verifyRuntimeBaseline();
}
export function verifyRuntimeBaseline(){
  const b=json(baselineFile);assert.equal(b.schemaVersion,'staff-gapfill-v6d-runtime-baseline/v1');
  assert.equal(b.identityCount,265);assert.equal(b.assetCount,2150);assert.equal(b.selectablePatientCount,140);
  assert.equal(b.stableIds.length,265);assert.equal(new Set(b.stableIds).size,265);assert.equal(b.assets.length,2150);
  assert.equal(b.priorCatalog.filter(c=>c.category==='patient').length,140);
  assert.equal(b.protectedFiles.length,7);assert.equal(b.acceptedV6bAssets.length,160);assert.equal(b.acceptedV6bSources.length,40);
  for(const c of [...b.assets,...b.protectedFiles,...b.acceptedV6bAssets,...b.acceptedV6bSources,b.priorRegistrySnapshot,b.priorCatalogSnapshot]){
    assert.equal(hash(resolve(repo,c.path)),c.sha256,'protected art/source changed '+c.path);assert.equal(statSync(resolve(repo,c.path)).size,c.bytes);
  }
  assert.deepEqual(json(resolve(repo,b.priorRegistrySnapshot.path)),b.priorRegistry);assert.deepEqual(json(resolve(repo,b.priorCatalogSnapshot.path)),b.priorCatalog);
  const registry=json(registryFile),catalog=loadCatalog();
  let registeredAssets=0;
  for(const c of b.priorRegistry){
    assert.deepEqual(registry.characters.find(a=>a.id===c.id),c,'prior registry metadata changed '+c.id);
    const poses=[...Object.values(c.poses).flatMap(p=>Object.values(p)),...(c.clipboard?[c.clipboard]:[])];
    for(const p of poses){assert.equal(hash(resolve(repo,'apps/player/public',p.url.replace(/^\//,''))),p.sha256,'prior registered PNG changed '+p.url);registeredAssets++;}
  }
  assert.equal(registeredAssets,2150);
  for(const c of b.priorCatalog)assert.deepEqual(catalog.find(a=>a.stillId===c.stillId),c,'prior catalog metadata changed '+c.stillId);
  const allowed=new Set([...b.stableIds,...b.allowedAddedIds]);
  assert(registry.characters.every(c=>allowed.has(c.id)));assert(catalog.every(c=>allowed.has(c.stillId)));
  assert.equal(new Set(registry.characters.map(c=>c.id)).size,registry.characters.length);assert.equal(new Set(catalog.map(c=>c.stillId)).size,catalog.length);
  return b;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const b=captureRuntimeBaseline();console.log(JSON.stringify({status:'PASS',preservedIdentities:b.identityCount,preservedAssets:b.assetCount,priorSelectablePatients:b.selectablePatientCount,protectedFiles:b.protectedFiles.length,pinnedAcceptedV6bPoses:b.acceptedV6bAssets.length,pinnedAcceptedV6bSources:b.acceptedV6bSources.length,currentRuntimeIdentities:json(registryFile).characters.length,concurrentV6bAppendAllowed:true,runtimeReady:false,managerAcceptance:'pending'}));
}
