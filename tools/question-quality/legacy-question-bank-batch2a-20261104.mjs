// Disposable synthetic-load control only: no saves, tests or evidence are written.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
const d=await import('../../packages/game-domain/src/index.ts'),c=await import('../../packages/clinical-content/src/index.ts');
const fixture=JSON.parse(fs.readFileSync('tests/fixtures/level-five-legacy-behavior-20261012.json','utf8'));
const current=d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,before=c.QUESTION_BANK_PRE_BATCH2A_RELEASE,recorded=c.QUESTION_FLAGS_PRE_REVISION_RELEASE;
const newIds=current.concepts.filter(x=>!before.concepts.some(o=>o.id===x.id)).map(x=>x.id),cumulativeIds=current.concepts.filter(x=>!recorded.concepts.some(o=>o.id===x.id)).map(x=>x.id);
assert.equal(newIds.length,2);assert.equal(cumulativeIds.length,18);
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex'),rows=[];
try{
 for(const row of fixture.rows)for(const schema of [5,6,7,8,9]){
  const raw=JSON.parse(row.serializedInput);raw.schemaVersion=schema;const states={};
  for(const[name,release]of [['recorded',recorded],['entry',before],['current',current]]){d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=release;states[name]=d.deserializeGameState(JSON.stringify(raw));}
  function without(ids){const copy=structuredClone(states.current);for(const id of ids){assert.deepEqual(copy.learningHistories[id].reviews,[]);assert.equal(copy.learningHistories[id].card.reps,0);delete copy.learningHistories[id];}return copy;}
  assert.equal(hash(without(newIds)),hash(states.entry));assert.equal(hash(without(cumulativeIds)),hash(states.recorded));assert.equal(hash(states.recorded),row.loadedHashes[String(schema)]);
  assert.deepEqual(states.current.encounters,states.entry.encounters);assert.deepEqual(states.current.encounters,states.recorded.encounters);
  rows.push({level:row.level,schema,recordedHash:row.loadedHashes[String(schema)],entryHash:hash(states.entry),currentHash:hash(states.current),onlyTwoNewEmptyHistoriesDifferFromEntry:true,onlyEighteenNewEmptyHistoriesDifferFromRecorded:true,frozenEncountersExact:true});
 }
}finally{d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=current;}
fs.writeFileSync('tools/question-quality/question-bank-batch2a-legacy-diagnosis-20261104.json',JSON.stringify({checkedOn:'2026-11-04',scope:'Identical domain code with recorded/entry/current synthetic clinical catalogs. Removing empty histories is done on disposable diagnostic copies, never in production or a saved state. This diagnoses initial hash differences only; continuation assertions after a failing initial hash are not evaluated.',newConceptIds:newIds,cumulativeConceptIds:cumulativeIds,rows},null,2)+'\n');
console.log(JSON.stringify({loads:rows.length,newHistories:2,cumulativeNewHistories:18,allRecordedInitialHashesReproduced:true,frozenEncountersExact:true}));
