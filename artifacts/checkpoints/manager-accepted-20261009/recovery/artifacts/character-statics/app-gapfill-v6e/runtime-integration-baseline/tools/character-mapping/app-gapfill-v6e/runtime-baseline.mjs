// Read-only runtime and art preservation. Concurrent Level 4 gameplay sources
// are deliberately outside this character-art pin; registry/catalog data and
// all existing character PNGs remain exact.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync,readFileSync,writeFileSync,statSync,mkdirSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadCatalog} from '../patient-gapfill-v6a/runtime-baseline.mjs';
export {loadCatalog} from '../patient-gapfill-v6a/runtime-baseline.mjs';
const tool=resolve(fileURLToPath(new URL('.',import.meta.url))),repo=resolve(tool,'../../..');
const baselineFile=resolve(tool,'runtime-baseline.json');
const json=f=>JSON.parse(readFileSync(f,'utf8'));
const hash=f=>createHash('sha256').update(readFileSync(f)).digest('hex');
const rel=f=>relative(repo,f).replaceAll('\\','/');
const record=f=>({path:rel(f),sha256:hash(f),bytes:statSync(f).size});
const registryFile=resolve(repo,'apps/player/src/art/characterStillRegistry.generated.json');
const controls=['tools/character-mapping/gs026-employee-expansion-v1/pipeline.mjs','tools/character-mapping/gs026-employee-expansion-v1/assets/gs026-employee-001-cardinals-v1.png','apps/player/src/facility/approvedRoomPresentation.ts','apps/player/src/facility/approvedRoomProofData.json','apps/player/src/facility/characterPresentation.ts','apps/player/src/art/characterBitmapArt.ts','apps/player/public/art/rooms/gs015-v1/front-desk/furniture.webp'];
export function captureRuntimeBaseline(){
  if(existsSync(baselineFile))return verifyRuntimeBaseline();
  const registry=json(registryFile),priorRegistry=registry.characters,priorCatalog=loadCatalog();
  assert.equal(priorRegistry.length,318);assert.equal(priorCatalog.length,318);
  const assets=priorRegistry.flatMap(c=>[...Object.values(c.poses).flatMap(p=>Object.values(p)),...(c.clipboard?[c.clipboard]:[])]).map(p=>{const f=resolve(repo,'apps/player/public',p.url.replace(/^\//,''));assert.equal(hash(f),p.sha256);return record(f);});
  assert.equal(assets.length,2574);
  const intake=resolve(tool,'analysis/intake');mkdirSync(intake,{recursive:true});
  const registrySnapshot=resolve(intake,'prior-registry-318.json'),catalogSnapshot=resolve(intake,'prior-catalog-318.json');
  writeFileSync(registrySnapshot,JSON.stringify(priorRegistry,null,2)+'\n');writeFileSync(catalogSnapshot,JSON.stringify(priorCatalog,null,2)+'\n');
  const sourceBatches=['future-roster20-v5','patient-gapfill-v6a','patient-gapfill-v6b','patient-gapfill-v6c','staff-gapfill-v6d'];
  const pinnedNativeSources=[];
  for(const batch of sourceBatches){const roster=json(resolve(tool,'..',batch,'roster.json'));for(const c of roster.identities)for(const name of ['source.png','stage1-standing-cardinals.png']){const f=resolve(repo,'artifacts/character-statics',batch,'sources',c.number,name);if(existsSync(f))pinnedNativeSources.push(record(f));}}
  const b={schemaVersion:'app-gapfill-v6e-runtime-baseline/v1',policy:'318 existing identities, 2574 assets, 179 patient designs, shared extraction/chair controls and accepted native sources preserved. No runtime writes by this batch; concurrent Level4 M5 gameplay edits remain outside this art snapshot.',capturedAt:new Date().toISOString(),identityCount:318,assetCount:2574,selectablePatientCount:179,stableIds:priorRegistry.map(c=>c.id),assets,protectedFiles:controls.map(p=>record(resolve(repo,p))),pinnedNativeSources,priorRegistry,priorCatalog,priorRegistrySnapshot:record(registrySnapshot),priorCatalogSnapshot:record(catalogSnapshot)};
  writeFileSync(baselineFile,JSON.stringify(b,null,2)+'\n');return verifyRuntimeBaseline();
}
export function verifyRuntimeBaseline(){
  const b=json(baselineFile);assert.equal(b.schemaVersion,'app-gapfill-v6e-runtime-baseline/v1');
  assert.equal(b.identityCount,318);assert.equal(b.assetCount,2574);assert.equal(b.assets.length,2574);
  assert.equal(b.priorCatalog.filter(c=>c.category==='patient').length,179);
  assert.equal(b.stableIds.length,318);assert.equal(new Set(b.stableIds).size,318);
  for(const c of [...b.assets,...b.protectedFiles,...b.pinnedNativeSources,b.priorRegistrySnapshot,b.priorCatalogSnapshot]){assert.equal(hash(resolve(repo,c.path)),c.sha256,'protected art/source changed '+c.path);assert.equal(statSync(resolve(repo,c.path)).size,c.bytes);}
  assert.deepEqual(json(resolve(repo,b.priorRegistrySnapshot.path)),b.priorRegistry);assert.deepEqual(json(resolve(repo,b.priorCatalogSnapshot.path)),b.priorCatalog);
  assert.deepEqual(json(registryFile).characters,b.priorRegistry,'runtime registry data changed');
  assert.deepEqual(loadCatalog(),b.priorCatalog,'runtime catalog data changed');
  return b;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){const b=captureRuntimeBaseline();console.log(JSON.stringify({status:'PASS',preservedIdentities:b.identityCount,preservedAssets:b.assetCount,priorSelectablePatients:b.selectablePatientCount,protectedFiles:b.protectedFiles.length,pinnedNativeSources:b.pinnedNativeSources.length,currentRuntimeIdentities:318,runtimeReady:false,managerAcceptance:'pending'}));}
