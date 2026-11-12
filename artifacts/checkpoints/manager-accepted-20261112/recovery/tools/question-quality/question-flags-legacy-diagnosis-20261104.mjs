// Disposable synthetic-fixture control only. No source, test, save or evidence writes.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
const d=await import('../../packages/game-domain/src/index.ts');
const c=await import('../../packages/clinical-content/src/index.ts');
const fixture=JSON.parse(fs.readFileSync('tests/fixtures/level-five-legacy-behavior-20261012.json','utf8'));
const current=d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,before=c.QUESTION_FLAGS_PRE_REVISION_RELEASE;
const newIds=current.concepts.map(x=>x.id).filter(id=>!before.concepts.some(x=>x.id===id));
assert.equal(newIds.length,2);
const hash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const loads=[];
try{
  for(const row of fixture.rows)for(const schema of [5,6,7,8,9]){
    const raw=JSON.parse(row.serializedInput);raw.schemaVersion=schema;
    d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=before;
    const old=d.deserializeGameState(JSON.stringify(raw));
    d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=current;
    const live=d.deserializeGameState(JSON.stringify(raw));
    const diagnosticCopy=structuredClone(live);
    for(const id of newIds){assert.deepEqual(live.learningHistories[id].reviews,[]);assert.equal(live.learningHistories[id].conceptId,id);delete diagnosticCopy.learningHistories[id];}
    const restored=hash(diagnosticCopy)===hash(old);
    assert(restored,'An unexpected loaded-state difference needs investigation');
    loads.push({level:row.level,schema,recordedHash:row.loadedHashes[String(schema)],entryHash:hash(old),currentHash:hash(live),diagnosticCopyWithoutTwoNewEmptyHistoriesHash:hash(diagnosticCopy),
      entryMatchesRecorded:hash(old)===row.loadedHashes[String(schema)],onlyNewEmptyHistoriesDiffer:restored,
      frozenEncountersUnchanged:hash(old.encounters)===hash(live.encounters)});
  }
}finally{d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=current;}
const result={checkedOn:'2026-11-04',scope:'Read-only causal comparison of synthetic legacy loads under the final current domain code and entry/current clinical releases. Removing two entries is confined to a disposable comparison copy; it is not a game loader change, passing test, evidence update or hash rebind.',
  newConceptIds:newIds,loads,conclusion:'All '+loads.length+' loaded-state differences are the two new empty histories. Entry release matches '+loads.filter(x=>x.entryMatchesRecorded).length+' recorded hashes; frozen encounter objects are exact in all '+loads.filter(x=>x.frozenEncountersUnchanged).length+' comparisons. Continuations are not evaluated by this load-only diagnostic.'};
fs.writeFileSync('tools/question-quality/question-flags-legacy-diagnosis-20261104.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({loads:loads.length,newConceptIds:newIds,entryMatches:loads.filter(x=>x.entryMatchesRecorded).length,onlyNewEmptyHistories:loads.every(x=>x.onlyNewEmptyHistoriesDiffer),frozenEncountersExact:loads.every(x=>x.frozenEncountersUnchanged)}));
