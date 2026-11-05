// Disposable synthetic loads only. No saved state or evidence is written.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
const d=await import('../../packages/game-domain/src/index.ts'),c=await import('../../packages/clinical-content/src/index.ts');
const fixture=JSON.parse(fs.readFileSync('tests/fixtures/level-five-legacy-behavior-20261012.json','utf8'));
const entry=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-bank-batch2a-round3-before-20261104.json','utf8'));
const current=d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,rr=c.QUESTION_BANK_BATCH2A_ROUND3_REVISIONS,ids=c.QUESTION_BANK_BATCH2A_ROUND3_TESTED_CONCEPTS.map(x=>x.id);
assert.equal(ids.length,5);
const before={...current,concepts:current.concepts.filter(x=>!ids.includes(x.id)),cases:current.cases.map(cs=>{
 const revisions=rr.filter(r=>r.caseId===cs.id);if(!revisions.length)return cs;
 const old=entry.release.cases.find(x=>x.id===cs.id),copy={...cs,decisionNodes:cs.decisionNodes.map(n=>revisions.some(r=>r.nodeId===n.id)?old.decisionNodes.find(x=>x.id===n.id):n)};
 if(revisions.some(r=>r.auditId==='B2A10'))for(const k of ['presentation','chiefComplaint','prototypeDemographics','approvedInstantiationProfiles']){if(Object.hasOwn(old,k))copy[k]=old[k];else delete copy[k];}return copy;
})};
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex'),rows=[];
try{for(const row of fixture.rows)for(const schema of [5,6,7,8,9]){
 const raw=JSON.parse(row.serializedInput);raw.schemaVersion=schema;const states={};
 for(const[name,release]of [['entry',before],['current',current]]){d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=release;states[name]=d.deserializeGameState(JSON.stringify(raw));}
 const reduced=structuredClone(states.current);for(const id of ids){assert.deepEqual(reduced.learningHistories[id].reviews,[]);assert.equal(reduced.learningHistories[id].card.reps,0);delete reduced.learningHistories[id];}
 assert.equal(hash(reduced),hash(states.entry));assert.deepEqual(states.current.encounters,states.entry.encounters);
 rows.push({level:row.level,schema,recordedHash:row.loadedHashes[String(schema)],entryHash:hash(states.entry),currentHash:hash(states.current),onlyFiveNewEmptyHistoriesDifferFromSameCurrentEntry:true,frozenEncountersExact:true});
}}finally{d.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=current;}
fs.writeFileSync('tools/question-quality/question-bank-batch2a-round3-legacy-diagnosis-20261104.json',JSON.stringify({checkedAt:new Date().toISOString(),scope:'Identical current domain and current external catalog on both sides. Seven own projections/five own definitions differ. This proves only the initial-load delta; continuation assertions behind a failed initial hash are not evaluated. No claim that all current-versus-recorded differences belong to this milestone.',newConceptIds:ids,rows},null,2)+'\n');
console.log(JSON.stringify({loads:rows.length,newEmptyHistories:5,ownDeltaOnlyEmptyHistories:true,frozenEncountersExact:true,initialRecordedMismatches:rows.filter(x=>x.currentHash!==x.recordedHash).length}));
