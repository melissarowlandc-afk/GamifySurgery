// Disposable synthetic-load comparison; never writes a save, test or evidence.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
const d=await import('../../packages/game-domain/src/index.ts'),c=await import('../../packages/clinical-content/src/index.ts');
const fixture=JSON.parse(fs.readFileSync('tests/fixtures/level-five-legacy-behavior-20261012.json','utf8'));
const current=d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,round1=c.QUESTION_FLAGS_ROUND1_RELEASE,preFlag=c.QUESTION_FLAGS_PRE_REVISION_RELEASE;
const round2Ids=current.concepts.filter(x=>!round1.concepts.some(o=>o.id===x.id)).map(x=>x.id);
const allFlagIds=current.concepts.filter(x=>!preFlag.concepts.some(o=>o.id===x.id)).map(x=>x.id);
assert.equal(round2Ids.length,14);assert.equal(allFlagIds.length,16);
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex'),rows=[];
try{
 for(const row of fixture.rows)for(const schema of [5,6,7,8,9]){
  const raw=JSON.parse(row.serializedInput);raw.schemaVersion=schema;
  const states={};for(const[name,release]of [['preFlag',preFlag],['round1',round1],['current',current]]){
   d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=release;states[name]=d.deserializeGameState(JSON.stringify(raw));
  }
  function without(ids){const copy=structuredClone(states.current);for(const id of ids){assert.deepEqual(copy.learningHistories[id].reviews,[]);assert.equal(copy.learningHistories[id].card.reps,0);delete copy.learningHistories[id];}return copy;}
  assert.equal(hash(without(round2Ids)),hash(states.round1));assert.equal(hash(without(allFlagIds)),hash(states.preFlag));
  assert.equal(hash(states.preFlag),row.loadedHashes[String(schema)]);
  assert.deepEqual(states.current.encounters,states.round1.encounters);assert.deepEqual(states.current.encounters,states.preFlag.encounters);
  rows.push({level:row.level,schema,recordedHash:row.loadedHashes[String(schema)],preFlagHash:hash(states.preFlag),round1Hash:hash(states.round1),currentHash:hash(states.current),
   onlyFourteenNewEmptyHistoriesDifferFromRound1:true,onlySixteenNewEmptyHistoriesDifferFromRecorded:true,frozenEncountersExact:true});
 }
}finally{d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=current;}
const result={checkedOn:'2026-11-04',scope:'Three synthetic clinical-release views under identical current domain code. Entry/recorded comparisons isolate added empty histories in disposable copies only. No production normalization, evidence rebind or passing Vitest claim; continued-play assertions are not evaluated.',
 round2ConceptIds:round2Ids,cumulativeFlagConceptIds:allFlagIds,rows};
fs.writeFileSync('tools/question-quality/question-flags-round2-legacy-diagnosis-20261104.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({loads:rows.length,newRoundTwoHistories:round2Ids.length,cumulativeNewHistories:allFlagIds.length,allRecordedHashesReproduced:true,frozenEncountersExact:true}));
