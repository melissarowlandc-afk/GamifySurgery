import fs from 'node:fs';
import assert from 'node:assert/strict';
const capture=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-n4-acceptance-before-20261110.json','utf8'));
const rows=capture.accepted.map(r=>({acceptanceId:r.acceptanceId,caseId:r.case.id,nodeId:r.case.decisionNodes[0].id,
 questionVariantId:r.question.id,conceptId:r.question.conceptId,sourceView:r.sourceView,decision:'docs/research/question-n4-manager-decision-20261110.md'}));
assert.equal(rows.length,8);assert.equal(capture.manifest.id,'question-ship.2026-11-10.v8');
for(const r of rows)assert(!capture.manifest.accepted.some(a=>a.caseId===r.caseId));
const output='packages/clinical-content/src/question-n4-accepted-20261110.ts';assert(!fs.existsSync(output),'One-shot integration; never rerun');
const edits=[];function modify(path,callback){const old=fs.readFileSync(path,'utf8'),text=callback(old);assert.notEqual(old,text,path);edits.push([path,text]);}
function replace(s,a,b){assert.equal(s.split(a).length,2,'Exact unique integration anchor: '+a.slice(0,100));return s.replace(a,b);}
modify('packages/clinical-content/src/question-ship-manifest.ts',s=>{
 s=replace(s,'id: "question-ship.2026-11-10.v8"','id: "question-ship.2026-11-10.v9"');
 s=replace(s,'\n] satisfies QuestionShipAcceptance[],','\n  // N4 exact four round1 + four round2 PASS additions; no clinical approval.\n'+JSON.stringify(rows,null,2).slice(1,-1).trimStart()+',\n] satisfies QuestionShipAcceptance[],');
 s=replace(s,'  headerSources: {','  headerSources: {\n'+rows.map(r=>'    '+JSON.stringify(r.caseId)+': '+JSON.stringify(r.sourceView)+',').join('\n'));
 return s;
});
modify('packages/clinical-content/src/synthetic-content.ts',s=>{
 s='import {QUESTION_N4_ACCEPTED_SOURCE_VIEWS,withAcceptedQuestionN4Concepts} from "./question-n4-accepted-20261110";\n'+s;
 return replace(s,'projectManagerAcceptedQuestions(withAcceptedHarden1N3r4Concepts(', 'projectManagerAcceptedQuestions(withAcceptedQuestionN4Concepts(withAcceptedHarden1N3r4Concepts(')
  .replace('QUESTION_NEW_N3_PRE_RELEASE.concepts))))))), QUESTION_FLAGS_PRE_REVISION_RELEASE, {','QUESTION_NEW_N3_PRE_RELEASE.concepts)))))))), QUESTION_FLAGS_PRE_REVISION_RELEASE, {\n  ...QUESTION_N4_ACCEPTED_SOURCE_VIEWS,');
});
modify('packages/clinical-content/src/answer-choice-timing.ts',s=>s+'\n// Exact N4 PASS estimates; domain order installation is a separate owned lane.\nimport {QUESTION_N4_ACCEPTED_TIMING_ENTRIES} from "./question-n4-accepted-20261110";\nANSWER_CHOICE_TIMING_REGISTRY.push(...QUESTION_N4_ACCEPTED_TIMING_ENTRIES);\n');
modify('packages/clinical-content/src/index.ts',s=>s+'\n// Manager-directed N4 exact PASS sources, provenance and accepted-only metadata.\nexport * from "./question-n4-accepted-20261110";\n');
const binding=capture.accepted.map(r=>({acceptanceId:r.acceptanceId,sourceView:r.sourceView,
 sourceReleaseSha256:capture.sourceViews[r.sourceView].sha256,caseId:r.case.id,questionVariantId:r.question.id,conceptId:r.question.conceptId,
 rawAuthoringCaseSha256:r.caseSha256,acceptedCaseSha256:capture.sourceViews[r.sourceView].cases.find(cs=>cs.id===r.case.id).sha256,acceptedQuestionSha256:r.questionSha256}));
const text=`import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import * as first from "./question-new-n4-20261110";
import * as second from "./question-new-n4-round2-20261110";
/** Exact manager editorial acceptance only. All authored clinical metadata
 * remains needs_clinician_review; no clinical approval or runtime domain gate. */
export const QUESTION_N4_ACCEPTED_ROWS=${JSON.stringify(rows,null,2)} as const;
export const QUESTION_N4_FROZEN_PRESERVATION=${JSON.stringify(binding,null,2)} as const;
export const QUESTION_N4_ACCEPTED_SOURCE_VIEWS={"n4-round1":first.QUESTION_NEW_N4_SOURCE_RELEASE,"n4-round2":second.QUESTION_NEW_N4_ROUND2_SOURCE_RELEASE};
export const QUESTION_N4_ACCEPTED_CASES=QUESTION_N4_ACCEPTED_ROWS.map(r=>QUESTION_N4_ACCEPTED_SOURCE_VIEWS[r.sourceView].cases.find(c=>c.id===r.caseId)!);
export const QUESTION_N4_ACCEPTED_QUESTIONS=QUESTION_N4_ACCEPTED_ROWS.map(r=>[...first.QUESTION_NEW_N4_QUESTIONS,...second.QUESTION_NEW_N4_ROUND2_QUESTIONS].find(q=>q.id===r.questionVariantId)!);
export const QUESTION_N4_ACCEPTED_CONCEPTS=QUESTION_N4_ACCEPTED_ROWS.map(r=>QUESTION_N4_ACCEPTED_SOURCE_VIEWS[r.sourceView].concepts.find(c=>c.id===r.conceptId)!);
const exactAccepted=(id:string)=>QUESTION_N4_ACCEPTED_ROWS.some(r=>r.questionVariantId===id&&QUESTION_SHIP_MANIFEST.accepted.some(a=>
 a.acceptanceId===r.acceptanceId&&a.caseId===r.caseId&&a.nodeId===r.nodeId&&a.questionVariantId===r.questionVariantId&&a.conceptId===r.conceptId&&a.sourceView===r.sourceView));
export function withAcceptedQuestionN4Concepts(release:SyntheticClinicalRelease):SyntheticClinicalRelease{
 const ids=new Set(release.concepts.map(c=>c.id));
 const added=QUESTION_N4_ACCEPTED_ROWS.flatMap((r,i)=>{if(ids.has(r.conceptId)||!exactAccepted(r.questionVariantId))return [];ids.add(r.conceptId);return [QUESTION_N4_ACCEPTED_CONCEPTS[i]!];});
 return {...release,concepts:[...release.concepts,...added]};
}
export const QUESTION_N4_ACCEPTED_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[]=QUESTION_N4_ACCEPTED_ROWS.filter(r=>exactAccepted(r.questionVariantId)).map(r=>
 [...first.QUESTION_NEW_N4_TIMING_ENTRIES,...second.QUESTION_NEW_N4_ROUND2_TIMING_ENTRIES].find(t=>t.questionVariantId===r.questionVariantId)!);
/** Exact accepted-only handoff data, NOT installed into game-domain runtime.
 * Each diagnostic choice is a future-planned preview, never a circular order
 * of the operation/endoscopy already in progress. */
export const QUESTION_N4_ACCEPTED_TEST_ORDER_RECORDS=QUESTION_N4_ACCEPTED_ROWS.filter(r=>exactAccepted(r.questionVariantId)).flatMap(r=>
 [...first.QUESTION_NEW_N4_CANDIDATE_TEST_ORDER_RECORDS,...second.QUESTION_NEW_N4_ROUND2_CANDIDATE_TEST_ORDER_RECORDS]
 .filter(t=>t.questionVariantId===r.questionVariantId).filter((t,index,all)=>all.findIndex(a=>a.choiceId===t.choiceId)===index));
export const QUESTION_N4_ACCEPTED_CASE_REVIEWS=QUESTION_N4_ACCEPTED_ROWS.map(r=>
 [...first.QUESTION_NEW_N4_CASE_REVIEWS,...second.QUESTION_NEW_N4_ROUND2_CASE_REVIEWS].find(v=>v.id===r.acceptanceId)!);
export * from "./question-new-n4-20261110";
export * from "./question-new-n4-round2-20261110";
`;
fs.writeFileSync(output,text);for(const [path,text]of edits)fs.writeFileSync(path,text);
console.log(JSON.stringify({accepted:rows.map(r=>r.acceptanceId),sourceViews:Object.keys(capture.sourceViews),productionDomainFilesEdited:0}));
