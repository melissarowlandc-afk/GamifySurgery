// Read-only synthetic-fixture diagnosis. Never changes saves, tests or evidence.
import fs from "node:fs";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import "../economy-audit/source-loader.mjs";
const domain=await import("../../packages/game-domain/src/index.ts");
const clinical=await import("../../packages/clinical-content/src/index.ts");
const legacy=JSON.parse(fs.readFileSync("tests/fixtures/level-five-legacy-behavior-20261012.json","utf8"));
const current=domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease;
const before=clinical.QUESTION_QUALITY_PRE_ADVERSARIAL_R4_RELEASE;
const roundEntry=clinical.QUESTION_QUALITY_PRE_ADVERSARIAL_R5_RELEASE;
const roundNewIds=current.concepts.map(c=>c.id).filter(id=>!roundEntry.concepts.some(c=>c.id===id));
const oldIds=new Set(before.concepts.map(c=>c.id));
const newIds=current.concepts.map(c=>c.id).filter(id=>!oldIds.has(id));
const hash=value=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const stripNewHistories=value=>{const copy=structuredClone(value);for(const id of newIds)delete copy.learningHistories[id];return copy;};
function differences(a,b,path="",out=[]){
 if(Object.is(a,b))return out;
 if(a===null||b===null||typeof a!=="object"||typeof b!=="object"){out.push(path);return out;}
 for(const k of new Set([...Object.keys(a),...Object.keys(b)])){
  if(!(k in a)||!(k in b))out.push(path+"/"+k);
  else differences(a[k],b[k],path+"/"+k,out);
 }
 return out;
}
const loads=[],continuations=[];
try{
 for(const row of legacy.rows){
  for(const schema of [5,6,7,8,9]){
   const raw=JSON.parse(row.serializedInput);raw.schemaVersion=schema;
   domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=before;
   const old=domain.deserializeGameState(JSON.stringify(raw));
   domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=current;
   const live=domain.deserializeGameState(JSON.stringify(raw));
   domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=roundEntry;
   const atEntry=domain.deserializeGameState(JSON.stringify(raw));
   const onlyThisRound=structuredClone(live);for(const id of roundNewIds)delete onlyThisRound.learningHistories[id];
   assert.deepEqual(onlyThisRound,atEntry,"This round adds only its new empty history on load");
   assert.equal(hash(old),row.loadedHashes[String(schema)],"Entry clinical release must reproduce recorded legacy load");
   assert.deepEqual(stripNewHistories(live),old,"Only new empty concept histories may differ on load");
   assert.equal(hash(stripNewHistories(live)),hash(old),"Removing only additive histories restores exact serialized hash");
   for(const id of newIds){assert.deepEqual(live.learningHistories[id].reviews,[]);assert.equal(live.learningHistories[id].conceptId,id);}
   loads.push({level:row.level,schema,recordedHash:row.loadedHashes[String(schema)],entryReleaseHash:hash(old),currentReleaseHash:hash(live),currentWithoutNewHistoriesHash:hash(stripNewHistories(live)),roundEntryHash:hash(atEntry),currentWithoutRoundFiveHistoryHash:hash(onlyThisRound),changedPaths:differences(old,live)});
  }
  // All five schemas load identically. Continue one representative of each level.
  const results={};
  for(const [name,release]of [["entry",before],["current",current]]){
   domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=release;
   const raw=JSON.parse(row.serializedInput);raw.schemaVersion=9;
   let state=domain.deserializeGameState(JSON.stringify(raw));
   state=domain.gameReducer(state,{type:"SET_PAUSED",paused:false,operationId:"m9.legacy.play"});
   for(let i=0;i<legacy.minutes;i++)state=domain.gameReducer(state,{type:"ADVANCE_TICK",operationId:`m9.legacy.minute.${i}`,advancedAtRealMs:(i+1)*1000});
   results[name]=state;
  }
  assert.deepEqual(results.entry,row.after,"Entry clinical release must reproduce exact recorded continuation");
  const changedPaths=differences(results.entry,stripNewHistories(results.current));
  const rawEncounterIds=Object.keys(JSON.parse(row.serializedInput).encounters);
  for(const id of rawEncounterIds)assert.deepEqual(results.current.encounters[id],results.entry.encounters[id],"Previously frozen encounter must continue identically: "+id);
  const changedEncounterIds=[...new Set(changedPaths.map(p=>p.match(/^\/encounters\/([^/]+)/)?.[1]).filter(Boolean))];
  assert(changedPaths.every(p=>p.startsWith("/encounters/")),"No continued difference outside new admissions");
  assert(changedEncounterIds.every(id=>!rawEncounterIds.includes(id)),"No changed admission was already frozen in the input save");
  continuations.push({level:row.level,minutes:legacy.minutes,entryMatchesRecorded:true,currentMatchesEntryExceptNewHistories:changedPaths.length===0,inputFrozenEncounterIds:rawEncounterIds,previouslyFrozenEncountersContinueIdentically:true,changedNewAdmissionIds:changedEncounterIds,changedPaths,entryHash:hash(results.entry),currentHash:hash(results.current),currentWithoutNewHistoriesHash:hash(stripNewHistories(results.current))});
 }
}finally{domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=current;}
const result={checkedOn:"2026-11-02",status:"diagnosed",scope:"Disposable current domain runtime, immutable synthetic legacy fixtures, entry/current clinical releases. No fixture, evidence, save, production code, assertion or timeout edited. This diagnostic is not a replacement passing Vitest run.",newConceptIds:newIds,roundFiveOnlyNewConceptIds:roundNewIds,loads,continuations,conclusion:"All 25 loaded-state hash mismatches arise solely from the existing loader adding empty histories for the 19 added concepts since the released fixture. Round five adds one of those; removing only that entry restores the round-four load exactly. Entry clinical release reproduces the recorded hashes and continuations. Continuation differences are listed separately; this is not a claim that rebinding input hashes alone updates legacy behavioral evidence."};
fs.writeFileSync("tools/question-quality/adversarial-r5-legacy-load-diagnosis-20261102.json",JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify({loads:loads.length,newConcepts:newIds.length,allEntryHashesMatch:true,allLoadedStatesDifferOnlyByNewHistories:true,continuations:continuations.map(({level,currentMatchesEntryExceptNewHistories,changedPaths})=>({level,currentMatchesEntryExceptNewHistories,changedPaths:changedPaths.length}))}));
